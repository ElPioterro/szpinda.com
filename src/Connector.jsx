import { useEffect, useMemo, useRef, useState } from "react";
import Diamond from "./Diamond";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

// Add the performance check hook
function usePerformanceCheck() {
  const [lowPerformance, setLowPerformance] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    // FPS tracking function
    const checkFrameRate = () => {
      frameCountRef.current++;

      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      // Calculate FPS after 1 second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);

        // Set low performance mode if below 30 FPS
        if (fps < 30) {
          setLowPerformance(true);
        }

        // Reset counters
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
    };

    // Request animation frame loop for accurate frame counting
    let frameId;
    const frameLoop = () => {
      checkFrameRate();
      frameId = requestAnimationFrame(frameLoop);
    };

    frameId = requestAnimationFrame(frameLoop);

    // Ensure we make a decision within 5 seconds
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

function Connector({
  position,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  yOffset = 0,
  isMobile = false,
  ...props
}) {
  const api = useRef();
  const offsetRef = useRef(new THREE.Vector2());
  const [dragged, drag] = useState(false);
  const lastTouchPos = useRef(new THREE.Vector2());
  const vec2 = new THREE.Vector3();
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r]);

  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);

  // Check device performance
  const lowPerformance = usePerformanceCheck();

  // Fixed central position for low performance mode
  const centerPosition = useMemo(
    () => new THREE.Vector3(0, yOffset, 0),
    [yOffset]
  );

  const timeSpeed = 0.1;

  useFrame((state, delta) => {
    if (api.current) {
      // If low performance, lock diamond to center position
      if (lowPerformance) {
        api.current.setNextKinematicTranslation(centerPosition);

        // Reset rotations for X and Z to neutral position (as if the diamond was at 0,0)
        // This ensures the diamond has the correct orientation at the center
        setRotationX(0); // No tilt on X axis when centered
        setRotationZ(0); // No tilt on Z axis when centered

        // Keep gentle Y rotation for visual interest
        const newRotationY = state.clock.elapsedTime * timeSpeed * 0.5;
        setRotationY(newRotationY);
        return;
      }

      const { viewport } = state;
      const translation = api.current.translation();

      if (!dragged) {
        // Regular physics behavior for normal performance
        api.current.applyImpulse(
          vec
            .copy(api.current.translation())
            .negate()
            .multiplyScalar(isMobile ? 0.5 : 0.3)
        );
      } else {
        // Dragging behavior for normal performance
        const mouseWorldX =
          lastTouchPos.current.x * viewport.width - viewport.width / 2;
        const mouseWorldY =
          lastTouchPos.current.y * viewport.height - viewport.height / 2;
        vec2.set(
          mouseWorldX - offsetRef.current.x,
          mouseWorldY - offsetRef.current.y + yOffset,
          translation.z
        );
        api.current.setNextKinematicTranslation(vec2);
      }

      // Update rotations based on position for normal performance
      const normalizedX = (translation.x + viewport.width / 2) / viewport.width;
      const newRotationZ = -THREE.MathUtils.lerp(
        -Math.PI / 6,
        Math.PI / 6,
        normalizedX
      );
      setRotationZ(newRotationZ);

      const normalizedY =
        (translation.y + viewport.height / 2) / viewport.height;
      const newRotationX = -THREE.MathUtils.lerp(
        -Math.PI / 6,
        Math.PI / 6,
        normalizedY
      );
      setRotationX(newRotationX);

      const newRotationY = state.clock.elapsedTime * timeSpeed;
      setRotationY(newRotationY);
    }
  });

  const handlePointerDown = (e) => {
    // Disable interaction in low performance mode
    if (lowPerformance) return;

    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    const diamondPos = api.current.translation();
    const clickPos = new THREE.Vector2(e.point.x, e.point.y);
    offsetRef.current.set(clickPos.x - diamondPos.x, clickPos.y - diamondPos.y);
    lastTouchPos.current.set(
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight // Flip Y-axis to match WebGL
    );
    api.current.wakeUp();
    drag(true);
  };

  const handlePointerMove = (e) => {
    if (lowPerformance) return;

    if (dragged) {
      // Store normalized touch/mouse coordinates (0 to 1 range)
      lastTouchPos.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight // Flip Y-axis to match WebGL
      );
    }
  };

  const handlePointerUp = (e) => {
    if (lowPerformance) return;

    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    drag(false);

    // Reset physics to dynamic mode
    api.current?.setEnabled(false);
    setTimeout(() => {
      api.current?.setEnabled(true);
    }, 0);
  };

  return (
    <RigidBody
      linearDamping={isMobile ? 1.0 : 1.9}
      angularDamping={0.4}
      friction={0.1}
      position={lowPerformance ? [0, yOffset, 0] : pos}
      ref={api}
      type={lowPerformance || dragged ? "kinematicPosition" : "dynamic"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Diamond
        rotation={[
          (lowPerformance ? 0 : rotationX) + Math.PI / 9,
          rotationY,
          lowPerformance ? 0 : rotationZ,
          "XZY",
        ]}
      />
    </RigidBody>
  );
}

export default Connector;
