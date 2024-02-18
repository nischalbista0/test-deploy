import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import XrHitModel from "./XrHitModel";

const XrHitModelContainer = () => {
  return (
    <div className="h-screen">
      <ARButton
        sessionInit={{
          requiredFeatures: ["hit-test"],
        }}
      />
      <Canvas>
        <XR>
          <XrHitModel />
        </XR>
      </Canvas>

    </div>
  );
};

export default XrHitModelContainer;

