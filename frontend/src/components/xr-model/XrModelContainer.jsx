import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import Model from "../xr-hit-model/Model";

const XrCubeContainer = () => {
  const { id } = useParams();
  const modelRef = useRef();

  useFrame((state, delta) => {
    modelRef.current.rotation.y += delta;
  });
  return (
    <>
      <ARButton />
      <Canvas>
        <XR>
          <OrbitControls />
          <ambientLight />
          <mesh ref={modelRef} position-z={-5}>
            <Model value={id} />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
};

export default XrCubeContainer;