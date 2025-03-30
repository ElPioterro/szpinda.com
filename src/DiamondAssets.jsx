import { createContext, useContext } from "react";
import { useGLTF, useKTX2 } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";

const DiamondAssetsContext = createContext();

export function DiamondAssetsProvider({ children }) {
  const model = useGLTF("/test1-transformed.glb");
  const texture = useLoader(EXRLoader, "output.exr");
  // const texture = useKTX2("output.ktx2");

  console.log("load Model&Texture");
  console.log(texture);

  return (
    <DiamondAssetsContext.Provider value={{ model, texture }}>
      {children}
    </DiamondAssetsContext.Provider>
  );
}

export function useDiamondAssets() {
  return useContext(DiamondAssetsContext);
}
