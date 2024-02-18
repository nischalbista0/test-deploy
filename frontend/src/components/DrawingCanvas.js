import React, { useRef } from "react";
import { FaImage, FaUndo } from "react-icons/fa";
import { MdRestartAlt } from "react-icons/md";
import { ReactSketchCanvas } from "react-sketch-canvas";

const DrawingCanvas = ({ onDrawingFinish }) => {
  const canvasRef = useRef();

  const handleGetImage = () => {
    canvasRef.current
      .exportImage("png")
      .then((data) => {
        console.log(data);
        onDrawingFinish(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleUndo = () => {
    canvasRef.current.undo();
  };

  const handleReset = () => {
    canvasRef.current.clearCanvas();
  };

  return (
    <div className="flex flex-col gap-4">
      <ReactSketchCanvas
        ref={canvasRef}
        strokeWidth={5}
        width="300px"
        height="300px"
        strokeColor="black"
        className="border border-gray-300 rounded p-2"
      />

      <div className="flex flex-col gap-2">
        <button
          className="bg-orange-600 flex items-center justify-center text-white py-2 px-4 rounded hover:bg-orange-700 transition duration-300"
          onClick={handleUndo}
        >
          <FaUndo className="mr-2" />
          Undo
        </button>
        <button
          className="bg-orange-600 flex items-center justify-center text-white py-2 px-4 rounded hover:bg-orange-700 transition duration-300"
          onClick={handleReset}
        >
          <MdRestartAlt className="mr-2 text-2xl" />
          Reset
        </button>
        <button
          className="bg-green-600 flex items-center justify-center text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          onClick={handleGetImage}
        >
          <FaImage className="mr-2" />
          Generate Image
        </button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
