import { Canvas } from "@react-three/fiber";
import React, { useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

const MyScene = ({ characterModel }) => {
  const controlsRef = useRef();

  return (
    <Canvas
      style={{ width: "100%", height: "250px" }}
      onCreated={({ gl, camera, scene }) => {
        const controls = new OrbitControls(camera, gl.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 1, 0);
        controlsRef.current = controls;

        const light = new THREE.PointLight(0xffffff, 50);
        light.position.set(0, 10, 0);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight();
        scene.add(ambientLight);

        // Adjust the camera position to make the scene smaller
        camera.position.set(0.8, 1.2, 2.5);

        const fbxLoader = new FBXLoader();
        fbxLoader.load(
          `models/characters/${characterModel}.fbx`,
          (object) => {
            // You can scale the loaded object to adjust its size
            object.scale.set(0.02, 0.02, 0.02);
            scene.add(object);
          },
          (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          },
          (error) => {
            console.log(error);
          }
        );

        // Event listener for window resize
        const onWindowResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          gl.setSize(window.innerWidth, window.innerHeight);
          controls.update();
        };

        window.addEventListener("resize", onWindowResize);

        // Cleanup function
        return () => {
          window.removeEventListener("resize", onWindowResize);
        };
      }}
    />
  );
};

export default MyScene;
