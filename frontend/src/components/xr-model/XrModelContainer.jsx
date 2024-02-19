import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { useParams } from "react-router-dom";
import Model from "./Model";

const XrCubeContainer = () => {
  const { id } = useParams();
  
  return (
    <>
      <ARButton />
      <Canvas>
        <XR>
          <Model value={id} />
        </XR>
      </Canvas>
    </>
  );
};

export default XrCubeContainer;
