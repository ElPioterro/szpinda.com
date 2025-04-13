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

export default Scene;
