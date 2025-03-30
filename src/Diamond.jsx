// Diamond.jsx
import { useRef } from "react";
import { Box, MeshRefractionMaterial } from "@react-three/drei";
import { useDiamondAssets } from "./DiamondAssets";
import { useControls } from "leva";
import { SphereGeometry } from "three";

function Diamond(props) {
  const { model, texture } = useDiamondAssets();
  const ref = useRef();

  return (
    <group {...props} dispose={null}>
      <mesh
        ref={ref}
        geometry={model.nodes.Diamond_1_0001.geometry}
        material={model.materials["gems_001.001"]}
      >
        <MeshRefractionMaterial
          envMap={texture}
          bounces={2}
          aberrationStrength={0.01}
          ior={1.9}
          fresnel={0.45}
          color={"white"}
          toneMapped={false}
        />
      </mesh>
      {/* <Box args={[1, 1, 1]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <meshStandardMaterial attach="material" color="orange" />
      </Box> */}
    </group>
  );
}
export default Diamond;
