import { useGLTF } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import annyang from "annyang";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { AiFillSound } from "react-icons/ai";
import { FaMicrophoneAlt } from "react-icons/fa";
import { MdOutlineDraw } from "react-icons/md";
import { TbAugmentedReality } from "react-icons/tb";
import { useParams } from "react-router-dom";
import Tesseract from "tesseract.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import DrawingCanvas from "../components/DrawingCanvas";

// Extend the controls
extend({ OrbitControls });

// Custom hook to provide access to Three.js context
const CameraControls = () => {
  const { camera, gl } = useThree();
  const controlsRef = useRef();

  return <orbitControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

const Model = ({ value }) => {
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

  const { nodes, materials } = useGLTF(modelFilePath);
  const groupRef = useRef();
  const modelRef = useRef();

  // Use state to control the animation
  const [positionY, setPositionY] = useState(2); // Initial Y position

  // Update the position in the animation loop
  useFrame(() => {
    // Modify this function to control the animation behavior
    const newY = 2 + Math.sin(Date.now() * 0.004) * 0.3; // Adjust the multiplier for speed
    setPositionY(newY);
  });

  return (
    <group ref={groupRef} dispose={null}>
      <group scale={0.1} position={[-1, positionY, -2]}>
        <primitive object={nodes.ascii} materials={materials} ref={modelRef} />
      </group>
    </group>
  );
};

const NumberLesson = () => {
  const { id } = useParams();
  const [recognizedWord, setRecognizedWord] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [result, setResult] = useState("");
  const [drawingEnabled, setDrawingEnabled] = useState(false);
  const [sketchImage, setSketchImage] = useState("");
  const expectedAlphabet = id;

  const onDrawingFinish = (data) => {
    // Set the base64 data URL to the state
    setSketchImage(data);
  };

  const handleCheckButtonClick = () => {
    // Use the sketchImage state for Tesseract OCR
    console.log("Sketch Image Base64:", sketchImage);

    // Perform OCR using Tesseract.js
    Tesseract.recognize(
      sketchImage,
      "eng", // Language code (e.g., 'eng' for English)
      {
        logger: (info) => {
          console.log(info); // Log OCR progress and information
        },
      }
    )
      .then(({ data: { text } }) => {
        console.log("OCR Result:", text);

        // Check if OCR result matches the expected number
        const normalizedOCRResult = text.replace(/\s/g, "").toLowerCase();
        const normalizedExpectedNumber = expectedAlphabet
          .toString()
          .toLowerCase();

        if (normalizedOCRResult === normalizedExpectedNumber) {
          setResult("Correct!");
        } else {
          setResult("Incorrect!");
        }
      })
      .catch((error) => {
        console.error("Error during OCR:", error);
      });
  };

  // Start annyang only when the button is clicked
  const startAnnyang = () => {
    if (annyang) {
      annyang.start();

      annyang.addCommands({
        test: speakAndTest,
      });

      annyang.addCallback("result", handleResult);
    }
  };

  const playSound = () => {
    const spokenRepresentationWithPause = `${expectedAlphabet}`;

    const utterance = new SpeechSynthesisUtterance(
      spokenRepresentationWithPause
    );
    var voices = window.speechSynthesis.getVoices();
    utterance.voice = voices[5];

    // if voice is 5 then speak
    if (utterance.voice === voices[5]) {
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (isListening) {
      setIsListening(false);
      annyang.abort();
    } else {
      setIsListening(true);
      startAnnyang();
    }
  };

  const speakAndTest = (prevSpokenInput) => {
    console.log("Spoken Input:", prevSpokenInput);

    // Normalize the spoken input
    const normalizedSpokenInput = prevSpokenInput
      .toLowerCase()
      .replace(/\s/g, "");

    // Normalize the expected alphabet
    const normalizedExpectedAlphabet = expectedAlphabet.toLowerCase();

    if (
      normalizedSpokenInput === normalizedExpectedAlphabet ||
      normalizedSpokenInput ===
        `${normalizedExpectedAlphabet}${normalizedExpectedAlphabet}` ||
      normalizedSpokenInput ===
        `${normalizedExpectedAlphabet}${normalizedExpectedAlphabet}${normalizedExpectedAlphabet}`
    ) {
      setResult("Correct!");
    } else {
      setResult("Incorrect!");
    }

    setIsListening(false);
    annyang.abort();
  };

  const handleResult = (phrases) => {
    const recognized = phrases[0];
    setRecognizedWord(recognized);
    setTimeout(() => speakAndTest(recognized), 0);
  };

  useEffect(() => {
    // Hide the correct animation after 3 seconds
    setTimeout(() => {
      setResult("");
    }, 4000);
  }, [result]);

  return (
    <div className="pr-14 pb-10 md:pb-0 w-full min-h-screen bg-white">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 h-screen">
        {!drawingEnabled ? (
          <Canvas style={{ width: "100%" }}>
            <CameraControls />
            <Suspense fallback={null}>
              <Model value={id} />
            </Suspense>
          </Canvas>
        ) : (
          <div className="w-full flex flex-col gap-4 justify-center items-center md:border-none border-b py-4 border-gray-400">
            <div className="w-[300px] flex flex-col gap-2">
              <DrawingCanvas onDrawingFinish={onDrawingFinish} />

              {sketchImage && (
                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-300"
                  onClick={handleCheckButtonClick}
                >
                  Check
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 min-w-[300px]">
          <button
            className="bg-[#58cc02] rounded-xl py-2 px-4 text-white font-bold hover:bg-[#4BAC00] transition duration-300 flex items-center justify-center"
            onClick={playSound}
          >
            <AiFillSound className="mr-2 text-xl" /> Play Sound
          </button>
          <button
            className={`bg-[#FFD700] rounded-xl py-2 px-4 text-[#4A90E2] font-bold hover:bg-yellow-300 transition duration-300 flex items-center justify-center ${
              isListening ? "bg-yellow-300" : ""
            }`}
            onClick={startListening}
          >
            {isListening ? (
              <div className="flex items-center">
                <FaMicrophoneAlt className="mr-2 text-xl" />
                Listening...
              </div>
            ) : (
              <>
                <FaMicrophoneAlt className="mr-2 text-xl" /> Speak and Test
              </>
            )}
          </button>
          <button
            className="bg-[#4A90E2] rounded-xl py-2 px-4 text-white font-bold hover:bg-[#2F76C2] transition duration-300 flex items-center justify-center"
            onClick={() => setDrawingEnabled(!drawingEnabled)}
          >
            <MdOutlineDraw className="mr-2 text-xl" />{" "}
            {drawingEnabled ? "Stop Writing" : "Write and Test"}
          </button>
          <button
            className="bg-[#4A90E2] rounded-xl py-2 px-4 text-white font-bold hover:bg-[#2F76C2] transition duration-300 flex items-center justify-center"
            onClick={() => {
              window.location.href = `/learn/${id}/view-ar`;
            }}
          >
            <TbAugmentedReality className="mr-2 text-xl" /> View
          </button>
          <div>
            Recognized Word: <strong>{recognizedWord}</strong>
          </div>
        </div>
      </div>

      {result === "Correct!" && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* show gif */}
          <img
            src="https://quizizz.com/media/resource/gs/quizizz-media/quizzes/8bb31a22-5b2f-48a5-a729-cb5093ca4232"
            alt="correct"
            className="w-[500px]"
          />
        </div>
      )}

      {result === "Incorrect!" && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* show gif */}
          <img
            src="https://i.pinimg.com/originals/89/ce/10/89ce107c3de91747d436f52f562dc3dc.gif"
            alt="incorrect"
            className="w-[500px]"
          />
        </div>
      )}
    </div>
  );
};

export default NumberLesson;
