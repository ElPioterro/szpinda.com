import * as THREE from "three";
import { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Leva, useControls } from "leva";
// prettier-ignore
import { useGLTF, Environment, MeshRefractionMaterial, OrbitControls} from "@react-three/drei";
// prettier-ignore
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { Perf } from "r3f-perf";
import { BlendFunction } from "postprocessing";

import Connector from "./Connector";
import { DiamondAssetsProvider } from "./DiamondAssets";
import { Logo } from "./Logo";

// const exrTexture = "diamond_09_pg.exr";
const exrTexture = "output.exr";

function CameraController({ yOffset }) {
  const { camera } = useThree();
  const hasPanned = useRef(false);

  useEffect(() => {
    if (!hasPanned.current) {
      camera.position.y += yOffset; // Pan camera up by 0.45
      hasPanned.current = true; // Mark as panned
    }
    // console.log("update Camera");
  }, [camera]); // Dependency on camera ensures this runs when camera is ready

  return null; // This component doesn't render anything
}

// Custom hook to detect mobile device
function useDeviceDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleDeviceChange = (e) => {
      setIsMobile(e.matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleDeviceChange);
    return () => mediaQuery.removeEventListener("change", handleDeviceChange);
  }, []);

  return isMobile;
}

function usePerformanceCheck() {
  const [lowPerformance, setLowPerformance] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    // FPS tracking function
    const checkFrameRate = () => {
      frameCountRef.current++;

      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      // Calculate FPS after 1 second of monitoring
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);

        // Set low performance mode if below 30 FPS
        if (fps < 30) {
          setLowPerformance(true);
          // Clear interval once we've determined low performance
          if (checkIntervalRef.current) {
            clearInterval(checkIntervalRef.current);
          }
        }

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
    };

    // Use requestAnimationFrame for more accurate frame counting
    let frameId;
    const frameLoop = () => {
      checkFrameRate();
      frameId = requestAnimationFrame(frameLoop);
    };

    // Start monitoring
    frameId = requestAnimationFrame(frameLoop);

    // Set a backup timeout to ensure we make a decision after 5 seconds
    const timeoutId = setTimeout(() => {
      if (frameId) cancelAnimationFrame(frameId);
    }, 5000);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return lowPerformance;
}

function Scene(props) {
  const isMobile = useDeviceDetect();
  const sceneOffsetConst = 0.45;

  // Use the performance check here too
  const lowPerformance = usePerformanceCheck();

  // Apply more aggressive optimizations for low performance devices
  const dprSetting = useMemo(() => {
    if (lowPerformance) return [0.6, 0.6]; // Very low resolution
    if (isMobile) return [0.8, 0.8]; // Lower resolution for mobile
    return [1, 1.5]; // Full resolution for desktop
  }, [isMobile, lowPerformance]);

  // Set camera position based on device type
  const cameraZPosition = isMobile ? 15 : 12;

  return (
    <>
      <Canvas
        shadows={false}
        dpr={dprSetting}
        gl={{
          antialias: lowPerformance ? false : !isMobile,
          powerPreference: "low-power",
          precision: lowPerformance ? "lowp" : "highp", // Use lower precision for performance
        }}
        camera={{
          position: [0, 0, cameraZPosition],
          fov: 17.5,
          near: 0.1,
          far: 20,
        }}
        {...props}
      >
        <Suspense fallback={null}>
          <DiamondAssetsProvider>
            <Physics
              debug={false}
              gravity={[0, 0, 0]}
              timeStep={lowPerformance ? 1 / 20 : isMobile ? 1 / 30 : 1 / 60}
            >
              <Connector
                yOffset={sceneOffsetConst}
                isMobile={isMobile}
                lowPerformance={lowPerformance}
              />
            </Physics>
          </DiamondAssetsProvider>
        </Suspense>
        <EffectComposer enableNormalPass={false}>
          {lowPerformance ? null : isMobile ? null : (
            <Bloom
              luminanceThreshold={0}
              intensity={0.43}
              levels={7}
              mipmapBlur={true}
            />
          )}
          <Vignette
            offset={0.32}
            darkness={isMobile ? 0.5 : 0.79}
            eskil={false}
            blendFunction={BlendFunction.NORMAL}
          />
        </EffectComposer>
        <CameraController yOffset={sceneOffsetConst} />
      </Canvas>
    </>
  );
}

// function Diamond(props) {
//   const model = useGLTF("/test1-transformed.glb");
//   console.log("load Diamond Model");
//   const ref = useRef();
//   const texture = useLoader(EXRLoader, exrTexture);
//   console.log("load EXR Texture");

//   // Optional config
//   const config = useControls("Diamond", {
//     bounces: { value: 2, min: 0, max: 8, step: 1 },
//     aberrationStrength: { value: 0.01, min: 0.001, max: 0.2, step: 0.001 },
//     ior: { value: 1.9, min: 0, max: 10 },
//     fresnel: { value: 0.45, min: 0, max: 1 },
//     color: "white",
//   });

//   return (
//     <group {...props} dispose={null}>
//       <mesh
//         ref={ref}
//         geometry={model.nodes.Diamond_1_0001.geometry}
//         material={model.materials["gems_001.001"]}
//       >
//         <MeshRefractionMaterial
//           envMap={texture}
//           {...config}
//           toneMapped={false}
//         />
//       </mesh>
//     </group>
//   );
// }

// function Connector({
//   position,
//   vec = new THREE.Vector3(),
//   r = THREE.MathUtils.randFloatSpread,
//   yOffset,
//   ...props
// }) {
//   const api = useRef();
//   const offsetRef = useRef(new THREE.Vector2());
//   const [dragged, drag] = useState(false);
//   const vec2 = new THREE.Vector3();
//   const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r]);

//   const [rotationX, setRotationX] = useState(0); // State to track X rotation
//   const [rotationY, setRotationY] = useState(0); // State to track Y rotation
//   const [rotationZ, setRotationZ] = useState(0); // State to track Z rotation

//   const { linearDamping, angularDamping, friction, timeSpeed } = useControls(
//     "Physics",
//     // prettier-ignore
//     {
//      linearDamping: { value: 1.9, min: 0, max: 10, step: 0.1 },
//      angularDamping: { value: 0.4, min: 0, max: 5,step: 0.1 },
//      friction: { value: 0.1, min: 0, max: 2, step: 0.01 },
//      timeSpeed: { value: 0.1, min: 0, max: 1.5, step: 0.01 },
//     }
//   );

//   useFrame((state, delta) => {
//     console.log("update physics");
//     if (api.current) {
//       const { mouse, viewport } = state;
//       const translation = api.current.translation();
//       // console.log(api.current);
//       if (!dragged) {
//         api.current.applyImpulse(
//           vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
//         );
//       } else {
//         const mouseWorldX = (mouse.x * viewport.width) / 2;
//         const mouseWorldY = (mouse.y * viewport.height) / 2;
//         vec2.set(
//           mouseWorldX - offsetRef.current.x,
//           mouseWorldY - offsetRef.current.y + yOffset,
//           // currentZ
//           translation.z
//         );
//         api.current.setNextKinematicTranslation(vec2);
//       }
//       const normalizedX = (translation.x + viewport.width / 2) / viewport.width; // Normalize X position to [0, 1]
//       const newRotationZ = -THREE.MathUtils.lerp(
//         -Math.PI / 6,
//         Math.PI / 6,
//         normalizedX
//       ); // Map to [-30deg, 30deg]
//       setRotationZ(newRotationZ);

//       const normalizedY =
//         (translation.y + viewport.height / 2) / viewport.height; // Normalize Y position to [0, 1]
//       const newRotationX = -THREE.MathUtils.lerp(
//         -Math.PI / 6,
//         Math.PI / 6,
//         normalizedY
//       ); // Map to [-30deg, 30deg]
//       setRotationX(newRotationX);

//       setRotationY(state.clock.elapsedTime * timeSpeed);
//     }
//   });

//   const handlePointerDown = (e) => {
//     e.stopPropagation();
//     e.target.setPointerCapture(e.pointerId);
//     const diamondPos = api.current.translation();
//     const clickPos = e.point;
//     offsetRef.current.set(clickPos.x - diamondPos.x, clickPos.y - diamondPos.y);
//     api.current.wakeUp(); // Prevent sleeping
//     drag(true);
//   };

//   const handlePointerUp = (e) => {
//     e.stopPropagation();
//     e.target.releasePointerCapture(e.pointerId);
//     drag(false);

//     // Disable the rigid body temporarily to switch back to dynamic mode
//     // https://github.com/pmndrs/react-three-rapier/issues/314
//     api.current?.setEnabled(false);
//     setTimeout(() => {
//       api.current?.setEnabled(true);
//     }, 0); // Re-enable immediately after disabling
//   };

//   return (
//     <RigidBody
//       linearDamping={linearDamping}
//       angularDamping={angularDamping}
//       friction={friction}
//       position={pos}
//       ref={api}
//       type={dragged ? "kinematicPosition" : "dynamic"}
//       // canSleep={false} // Prevent sleeping
//       onPointerDown={handlePointerDown}
//       onPointerUp={handlePointerUp}
//     >
//       <Diamond
//         rotation={[rotationX + Math.PI / 9, rotationY, rotationZ, "XZY"]}
//       />
//     </RigidBody>
//   );
// }

export default Scene;
