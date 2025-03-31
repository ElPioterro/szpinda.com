import { useMemo, useRef, useState } from "react";
import Diamond from "./Diamond";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

function Connector({
  position,
  vec = new THREE.Vector3(),
  r = THREE.MathUtils.randFloatSpread,
  yOffset = 0,
  ...props
}) {
  const api = useRef();
  const offsetRef = useRef(new THREE.Vector2());
  const [dragged, drag] = useState(false);
  const lastTouchPos = useRef(new THREE.Vector2()); // Track last touch position in normalized coordinates
  const vec2 = new THREE.Vector3();
  const pos = useMemo(() => position || [r(10), r(10), r(10)], [position, r]);

  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);

  const timeSpeed = 0.1;

  useFrame((state, delta) => {
    if (api.current) {
      const { viewport } = state; // Access viewport from useFrame state
      const translation = api.current.translation();

      if (!dragged) {
        // Apply spring-like force when not dragging
        api.current.applyImpulse(
          vec.copy(api.current.translation()).negate().multiplyScalar(0.2)
        );
      } else {
        // Convert normalized lastTouchPos to world coordinates
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

      // Update rotations based on position
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
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    const diamondPos = api.current.translation();
    const clickPos = new THREE.Vector2(e.point.x, e.point.y);
    offsetRef.current.set(clickPos.x - diamondPos.x, clickPos.y - diamondPos.y);
    // Store initial touch position in normalized coordinates
    lastTouchPos.current.set(
      e.clientX / window.innerWidth,
      1 - e.clientY / window.innerHeight // Flip Y-axis to match WebGL
    );
    api.current.wakeUp();
    drag(true);
  };

  const handlePointerMove = (e) => {
    if (dragged) {
      // Store normalized touch/mouse coordinates (0 to 1 range)
      lastTouchPos.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight // Flip Y-axis to match WebGL
      );
    }
  };

  const handlePointerUp = (e) => {
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
      linearDamping={1.9}
      angularDamping={0.4}
      friction={0.1}
      position={pos}
      ref={api}
      type={dragged ? "kinematicPosition" : "dynamic"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Diamond
        rotation={[rotationX + Math.PI / 9, rotationY, rotationZ, "XZY"]}
      />
    </RigidBody>
  );
}

export default Connector;
