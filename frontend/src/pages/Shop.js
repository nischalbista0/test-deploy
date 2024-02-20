import React, { useEffect, useState } from "react";
import { FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { currentUserAtom } from "./MainPage";
import { useAtom } from "jotai";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Shop = () => {
  const initialAvatarItems = [
    {
      id: 4,
      name: "Avatar 1",
      cost: 50,
      imageUrl:
        "https://img.freepik.com/premium-photo/cartoon-character-with-blue-hoodie-glasses-that-says-i-m-kid_784625-9658.jpg",
      type: "avatar",
    },
    {
      id: 5,
      name: "Avatar 2",
      cost: 70,
      imageUrl:
        "https://img.freepik.com/premium-photo/cartoon-character-with-glasses-hoodie-that-says-girl-is-wearing-hoodie_784625-9676.jpg",
      type: "avatar",
    },
    {
      id: 6,
      name: "Avatar 3",
      cost: 70,
      imageUrl:
        "https://img.freepik.com/premium-photo/cartoon-character-with-orange-hair-glasses-that-say-s-it_784625-10881.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1704585600&semt=ais",
      type: "avatar",
    },
    // Add more avatars as needed
  ];

  const [avatarItems, setAvatarItems] = useState(
    initialAvatarItems.map((item) => {
      const unlockedItem = JSON.parse(
        localStorage.getItem(`avatar_${item.id}`)
      );
      return unlockedItem ? { ...item, unlocked: true } : item;
    })
  );

  const [selectedAvatar, setSelectedAvatar] = useState(
    JSON.parse(localStorage.getItem("selectedAvatar")) || {
      id: null,
      name: null,
      cost: null,
      unlocked: null,
      imageUrl: null,
    }
  );

  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectItem = (item) => {
    setSelectedAvatar(item);
    localStorage.setItem("selectedAvatar", JSON.stringify(item));

    if (!item.unlocked) {
      setIsModalOpen(true);
    }
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

  const handleUnlock = () => {
    const selectedItem = selectedAvatar;

    if (currentUser?.data[0]?.points >= selectedItem.cost) {
      subtractPointsToUser(selectedItem.cost);

        setSelectedAvatar((prevAvatar) => ({
          ...prevAvatar,
          unlocked: true,
        }));
        // Update the avatar item in localStorage to reflect the unlocked state
        localStorage.setItem(
          "selectedAvatar",
          JSON.stringify({ ...selectedAvatar, unlocked: true })
        );
        localStorage.setItem(
          `avatar_${selectedAvatar.id}`,
          JSON.stringify({ ...selectedAvatar, unlocked: true })
        );
        // Also update the avatar item in the avatarItems state to re-render with the unlocked state
        setAvatarItems((prevItems) =>
          prevItems.map((item) =>
            item.id === selectedAvatar.id ? { ...item, unlocked: true } : item
          )
        );
      }

      toast.success('Avatar unlocked successfully!');

      setIsModalOpen(false);

      // reload the page
      window.location.reload();
    }

  return (
    <div className="p-6 w-full pb-20 md:pb-0 min-h-screen">
      <div className="w-full">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6">
          Unlock Characters & Avatars with points
        </h1>

        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-semibold">Points: {currentUser?.data[0]?.points}</p>
        </div>

        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Characters</h2>

          <p className="text-gray-600">
            Characters are unlocked from the points that you gain as you
            progress through the learning experience.
          </p>

          <Link to="/xr-characters">
            <button className="bg-purple-500 text-white px-4 py-2 rounded-md">
              View Characters 👀
            </button>
          </Link>
        </div>

        <div className="relative flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Avatars</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {avatarItems
              .filter((item) => item.type === "avatar")
              .map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border flex flex-col items-center rounded-xl cursor-pointer transition duration-300 transform ${
                    selectedAvatar?.id === item.id
                      ? "ring-4 ring-purple-500"
                      : ""
                  } ${
                    !item.unlocked
                      ? // black overlay
                        "bg-black bg-opacity-60"
                      : ""
                  }`}
                  onClick={() => selectItem(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-full mb-2"
                  />
                  <p className="text-xl font-bold">{item.name}</p>
                  <p>{item.cost} Points</p>
                  <div className="absolute top-3 right-3 text-xl">
                    {!item.unlocked && (
                      <span className="text-red-500">
                        <FaLock />
                      </span>
                    )}
                  </div>
                  <p className="text-sm">Avatar</p>
                </div>
              ))}
          </div>
        </div>

        {/* <div className="mt-8">
          <p className="text-xl font-semibold mb-2">Selected Item:</p>
          {selectedCharacter || selectedAvatar ? (
            <div>
              <p>{selectedCharacter?.name || selectedAvatar?.name}</p>
              <p>Total Points: {userPoints} Points</p>
            </div>
          ) : (
            <p>No item selected</p>
          )}
        </div> */}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Unlock characters and avatars to enhance your learning experience!
          </p>
          <Link to="/learn">
            <button className="bg-purple-500 text-white px-4 py-2 mt-4 rounded-md">
              Go Back to Learning
            </button>
          </Link>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="bg-[#000000a1] z-40 w-screen h-screen fixed top-0 left-0 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md">
              <p className="text-xl font-semibold mb-4">
                Unlock {selectedAvatar?.name}
              </p>
              <p className="mb-4">Are you sure you want to unlock this item?</p>
              <p className="mb-4">
                You will lose { selectedAvatar?.cost}{" "}
                points.
              </p>
              <button
                className="bg-purple-500 text-white px-4 py-2 mt-4 rounded-md"
                onClick={handleUnlock}
              >
                Unlock
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 mt-4 rounded-md ml-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default Shop;
