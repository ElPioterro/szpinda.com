import { useMemo, useRef, useState } from "react";
import Diamond from "./Diamond";

import * as THREE from "three";
import { useControls } from "leva";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";

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

  const timeSpeed = 0.1;

  useFrame((state, delta) => {
    // console.log("update physics");
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
      linearDamping={1.9}
      angularDamping={0.4}
      friction={0.1}
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

export default Connector;
