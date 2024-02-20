import { Canvas } from "@react-three/fiber";
import { ARButton, XR } from "@react-three/xr";
import axios from "axios";
import { useAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CharacterAnimationsProvider,
  useCharacterAnimations,
} from "../../contexts/CharacterAnimations";
import { currentUserAtom } from "../../pages/MainPage";
import Interface from "./Interface";
import XrGallery from "./XrGallery";

const XrGalleryContainer = () => {
  const [overlayContent, setOverlayContent] = useState(null);
  const { currentModelName } = useCharacterAnimations();
  const [isCharacterUnlocked, setIsCharacterUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [requiredPoints, setRequiredPoints] = useState(200); // Example: Set the required points
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const userPoints = currentUser?.data[0]?.points;

  let interfaceRef = useCallback((node) => {
    if (node !== null) {
      setOverlayContent(node);
    }
  });

  useEffect(() => {
    const unlockedCharactersJSON = localStorage.getItem("unlockedCharacters");
    if (unlockedCharactersJSON) {
      const unlockedCharacters = JSON.parse(unlockedCharactersJSON);
      if (unlockedCharacters && unlockedCharacters.includes(currentModelName)) {
        setIsCharacterUnlocked(true);
      }
    }
  }, [currentModelName]);

  const handleUnlockCharacter = () => {
    if (userPoints >= requiredPoints) {
      setShowModal(true); // Show modal if user has enough points
    } else {
      // Notify user if they don't have enough points
      alert(`You need ${requiredPoints} points to unlock this character.`);
    }
  };

  const handleConfirmUnlock = () => {
    // Deduct points
    const newPoints = userPoints - requiredPoints;
    // Update user points (You need to implement this part)
    console.log(`Character unlocked! Remaining points: ${newPoints}`);
    // Update state to indicate character is unlocked
    subtractPointsToUser(requiredPoints);
    toast.success(`Character unlocked! Remaining points: ${newPoints}`);

    setIsCharacterUnlocked(true);
    // Hide modal
    setShowModal(false);
  };

  const handleCloseModal = () => {
    // Close the modal without unlocking the character
    setShowModal(false);
  };

  const subtractPointsToUser = async (pointsToUse) => {
    console.log("Adding points to user:", pointsToUse);
    try {
      const formData = {
        points: pointsToUse,
      };

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3001/users/subtract-points",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const getUser = async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            // If token exists, fetch the user data
            const response = await axios.get("http://localhost:3001/users", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const user = response.data;
            setCurrentUser(user);
          } else {
            // If token doesn't exist, set user state to null
            setCurrentUser(null);
          }
        } catch (error) {
          console.log(error);
          setCurrentUser(null);
        }
      };

      getUser();
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  return (
    <>
      <CharacterAnimationsProvider>
        {!isCharacterUnlocked ? (
          <div className="w-screen flex justify-center absolute bottom-8">
            <button
              className="bg-orange-500 relative cursor-pointer pointer-events-auto rounded-lg px-3 py-1.5 z-20 text-white font-medium"
              onClick={handleUnlockCharacter}
            >
              Unlock Character To Interact 🤩
            </button>
          </div>
        ) : (
          <ARButton
            className="ar-button"
            sessionInit={{
              requiredFeatures: ["hit-test"],
              optionalFeatures: ["dom-overlay"],
              domOverlay: { root: overlayContent },
            }}
          />
        )}
        {showModal && (
          <div className="fixed z-40 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              {/* Overlay */}
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>

              {/* Modal */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* Icon */}
                      <svg
                        className="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Unlock Character
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Unlocking this character requires {requiredPoints}{" "}
                          points. Do you want to proceed?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={handleConfirmUnlock}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleCloseModal}
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Canvas>
          <XR>
            <XrGallery />
          </XR>
        </Canvas>
        <Interface ref={interfaceRef} />
      </CharacterAnimationsProvider>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default XrGalleryContainer;
