import * as THREE from "three";
import { useRef, useMemo, useState, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import { Leva, useControls } from "leva";
// prettier-ignore
import { useGLTF, Environment, MeshRefractionMaterial, OrbitControls, Svg} from "@react-three/drei";
// prettier-ignore
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { Perf } from "r3f-perf";
import { KernelSize, BlendFunction, MaskPass } from "postprocessing";

const exrTexture = "diamond_09_pg.exr";
const sceneOffsetConst = 0.45;
import mainLogo from "./signature(1)-final.svg"; // Adjust path to your SVG file
import { Logo } from "./Logo";

function CameraController({ yOffset }) {
  const { camera } = useThree();
  const hasPanned = useRef(false);

  useEffect(() => {
    if (!hasPanned.current) {
      camera.position.y += yOffset; // Pan camera up by 0.45
      hasPanned.current = true; // Mark as panned
    }
  }, [camera]); // Dependency on camera ensures this runs when camera is ready

  return null; // This component doesn't render anything
}

function Scene(props) {
  const config = useControls("Bloom", {
    luminanceThreshold: {
      // value: 3.66,
      value: 0,
      min: 0,
      max: 10,
      step: 0.01,
      label: "Luminance Threshold",
    },
    luminanceSmoothing: {
      // value: 0.025, // default
      value: 0,
      min: 0,
      max: 1,
      step: 0.001,
      label: "Luminance Smoothing",
    },
    intensity: {
      // value: 0.53,
      value: 0.43,
      min: 0,
      max: 5,
      step: 0.01,
      label: "Intensity",
    },
    levels: {
      // value: 9,
      value: 7,
      min: 0,
      max: 10,
      step: 1,
      label: "Levels",
    },
    mipmapBlur: {
      value: true,
      label: "Mipmap Blur",
    },
    debug: {
      value: false,
      label: "Debug Mode",
    },
  });
  const config2 = useControls("Vignette", {
    offset: {
      value: 0.32, // Default value from your code
      min: 0,
      max: 1,
      step: 0.01,
      label: "Offset",
    },
    darkness: {
      value: 0.79, // Default value from your code
      min: 0,
      max: 3,
      step: 0.01,
      label: "Darkness",
    },
    eskil: {
      value: false, // Default value from your code
      label: "Eskil Technique",
    },
    blendFunction: {
      value: BlendFunction.NORMAL, // Default value from your code
      options: {
        Normal: BlendFunction.NORMAL,
        Multiply: BlendFunction.MULTIPLY,
        Screen: BlendFunction.SCREEN,
        Overlay: BlendFunction.OVERLAY,
        Darken: BlendFunction.DARKEN,
        Lighten: BlendFunction.LIGHTEN,
        // Add more BlendFunction options as needed
      },
      label: "Blend Mode",
    },
  });

  return (
    <>
      <Leva collapsed />
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{ antialias: false }}
        // cam : 0 0 15
        camera={{ position: [0, 0, 12], fov: 17.5, near: 0.1, far: 200 }}
        {...props}
      >
        {/* <Perf position="top-left" /> */}
        {/* <Environment files={exrTexture} /> */}
        <Suspense fallback={null}>
          <Physics debug={config.debug} gravity={[0, 0, 0]}>
            {/* <Connector position={[-4, -2, 1]} /> */}

            <Connector position={[2, 7, 5]} yOffset={sceneOffsetConst} />
          </Physics>
        </Suspense>
        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={config.luminanceThreshold}
            intensity={config.intensity}
            levels={config.levels}
            mipmapBlur={config.mipmapBlur}
            luminanceSmoothing={config.mipmapBlur} // smoothness of the luminance threshold. Range is [0, 1]
          />
          {/* <Bloom
          luminanceThreshold={config.luminanceThreshold}
          intensity={config.intensity}
          levels={2}
          mipmapBlur={config.mipmapBlur}
          luminanceSmoothing={config.mipmapBlur} // smoothness of the luminance threshold. Range is [0, 1]
        /> */}
          <Vignette
            offset={config2.offset}
            darkness={config2.darkness}
            eskil={config2.eskil}
            blendFunction={config2.blendFunction}
          />
        </EffectComposer>
        {/* <OrbitControls
        makeDefault // Makes these controls the default for the canvas
        enablePan={true} // Allow panning
        enableZoom={true} // Allow zooming
        enableRotate={true} // Allow rotation
        minDistance={5} // Minimum zoom distance
        maxDistance={50} // Maximum zoom distance
      /> */}
        <CameraController yOffset={sceneOffsetConst} />
      </Canvas>
      {/* <Logo fillColor={"#318CE7"} strokeColor={"white"} strokeWidth={1} /> */}
    </>
  );
}

function Diamond(props) {
  const model = useGLTF("/test1-transformed.glb");
  const ref = useRef();
  const texture = useLoader(EXRLoader, exrTexture);

  // Optional config
  const config = useControls("Diamond", {
    bounces: { value: 2, min: 0, max: 8, step: 1 },
    aberrationStrength: { value: 0.01, min: 0.001, max: 0.2, step: 0.001 },
    ior: { value: 1.9, min: 0, max: 10 },
    fresnel: { value: 0.45, min: 0, max: 1 },
    color: "white",
  });

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        geometry={model.nodes.Diamond_1_0001.geometry}
        material={model.materials["gems_001.001"]}
      >
        <MeshRefractionMaterial
          envMap={texture}
          {...config}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Connector({
  position,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  yOffset,
  ...props
}) {
  const api = useRef();
  const offsetRef = useRef(new THREE.Vector2());
  const [dragged, drag] = useState(false);
  const vec2 = new THREE.Vector3();
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r]);

  const [rotationX, setRotationX] = useState(0); // State to track X rotation
  const [rotationY, setRotationY] = useState(0); // State to track Y rotation
  const [rotationZ, setRotationZ] = useState(0); // State to track Z rotation

  const { linearDamping, angularDamping, friction, timeSpeed } = useControls(
    "Physics",
    // prettier-ignore
    {
     linearDamping: { value: 1.9, min: 0, max: 10, step: 0.1 },
     angularDamping: { value: 0.4, min: 0, max: 5,step: 0.1 },
     friction: { value: 0.1, min: 0, max: 2, step: 0.01 },
     timeSpeed: { value: 0.1, min: 0, max: 1.5, step: 0.01 },
    }
  );

  useFrame((state, delta) => {
    if (api.current) {
      const { mouse, viewport } = state;
      const translation = api.current.translation();
      // console.log(api.current);
      if (!dragged) {
        api.current.applyImpulse(
          vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
        );
      } else {
        const mouseWorldX = (mouse.x * viewport.width) / 2;
        const mouseWorldY = (mouse.y * viewport.height) / 2;
        vec2.set(
          mouseWorldX - offsetRef.current.x,
          mouseWorldY - offsetRef.current.y + yOffset,
          // currentZ
          translation.z
        );
        api.current.setNextKinematicTranslation(vec2);
      }
      const normalizedX = (translation.x + viewport.width / 2) / viewport.width; // Normalize X position to [0, 1]
      const newRotationZ = -THREE.MathUtils.lerp(
        -Math.PI / 6,
        Math.PI / 6,
        normalizedX
      ); // Map to [-30deg, 30deg]
      setRotationZ(newRotationZ);

      const normalizedY =
        (translation.y + viewport.height / 2) / viewport.height; // Normalize Y position to [0, 1]
      const newRotationX = -THREE.MathUtils.lerp(
        -Math.PI / 6,
        Math.PI / 6,
        normalizedY
      ); // Map to [-30deg, 30deg]
      setRotationX(newRotationX);

      setRotationY(state.clock.elapsedTime * timeSpeed);
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    const diamondPos = api.current.translation();
    const clickPos = e.point;
    offsetRef.current.set(clickPos.x - diamondPos.x, clickPos.y - diamondPos.y);
    api.current.wakeUp(); // Prevent sleeping
    drag(true);
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    drag(false);

    // Disable the rigid body temporarily to switch back to dynamic mode
    // https://github.com/pmndrs/react-three-rapier/issues/314
    api.current?.setEnabled(false);
    setTimeout(() => {
      api.current?.setEnabled(true);
    }, 0); // Re-enable immediately after disabling
  };

  return (
    <RigidBody
      linearDamping={linearDamping}
      angularDamping={angularDamping}
      friction={friction}
      position={pos}
      ref={api}
      type={dragged ? "kinematicPosition" : "dynamic"}
      // canSleep={false} // Prevent sleeping
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Diamond
        rotation={[rotationX + Math.PI / 9, rotationY, rotationZ, "XZY"]}
      />
    </RigidBody>
  );
}

export default Scene;
