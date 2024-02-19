import { useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";

export default function Model(props) {
  const { value } = props;
  console.log(value);

  let modelFilePath;

  // Determine whether the value is a number or an alphabet
  if (!isNaN(value) && value >= 0 && value <= 9) {
    // It's a number, convert it to the word representation
    const numberWords = [
      "zero",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
    ];
    const numberWord = numberWords[value];

    modelFilePath = `/models/numbers/${numberWord}.gltf`;
  } else {
    // It's an alphabet
    modelFilePath = `/models/alphabets/Letter_${value.toUpperCase()}.gltf`;
  }

  console.log(modelFilePath);

  const group = useRef();
  const { nodes, materials } = useGLTF(modelFilePath);

  useEffect(() => {
    useGLTF.preload(modelFilePath);
  }, [modelFilePath]);

  if (!nodes || !materials) {
    return null; // Or a loading indicator
  }

  return (
    <group ref={group} {...props} dispose={null}>
      <group scale={0.1} position={[0, 2, -5]}>
        <primitive object={nodes.ascii} materials={materials} />
      </group>
    </group>
  );
}
