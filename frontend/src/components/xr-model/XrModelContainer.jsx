import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { useParams } from "react-router-dom";
import Model from "../xr-hit-model/Model";

const XrCubeContainer = () => {
  const { id } = useParams();
  return (
    <>
      <ARButton className="bg-orange-500 relative cursor-pointer pointer-events-auto rounded-lg px-3 py-1.5 z-20 text-white font-medium" />
      <Canvas>
        <XR>
          <Model value={id} />
        </XR>
      </Canvas>
    </>
  );
};

export default XrCubeContainer;
