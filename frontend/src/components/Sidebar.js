import React, { useEffect, useState } from "react";
import { FaBookReader } from "react-icons/fa";
import { FiMoreHorizontal } from "react-icons/fi";
import { MdLeaderboard, MdShop } from "react-icons/md";
import { PiHandsClapping } from "react-icons/pi";

import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { currentUserAtom } from "../pages/MainPage";

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState("learn");
  const [currentUser] = useAtom(currentUserAtom);
  const [avatar, setAvatarUrl] = useState(
    JSON.parse(localStorage.getItem("selectedAvatar")) || ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Update the avatar state when it changes in local storage
    setAvatarUrl(JSON.parse(localStorage.getItem("selectedAvatar")) || "");
  }, []);

  return (
    <div className="fixed z-20 bg-white dark:bg-black bottom-0 w-full md:bg-black md:w-[280px] md:min-h-[100vh] md:flex md:flex-col md:justify-between md:py-5">
      <div className="md:flex md:flex-col md:gap-10">
        <div className="hidden md:block md:px-8">
          <h1 className="text-2xl font-bold text-white">LinguaChamps</h1>
        </div>

        <nav className="w-full md:px-4">
          <ul className="flex items-center justify-between px-6 py-4 border-t md:flex-col md:gap-2 md:items-start md:border-none md:p-0">
            <li
              className={`relative hover:text-purple-lighter cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md md:hover:bg-dark-bg ${
                activeTab === "learn"
                  ? "text-blue-500 md:text-blue-500"
                  : "text-white"
              }`}
              onClick={() => {
                navigate("/learn");
                setActiveTab("learn");
              }}
            >
              <FaBookReader className="w-5 h-5" />
              <p className="hidden font-semibold md:block">Learn</p>

              {activeTab === "learn" && (
                <div className="md:bg-blue-500 h-full w-[2px] absolute left-0"></div>
              )}
            </li>

            <li
              className={`relative hover:text-purple-lighter cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md md:hover:bg-dark-bg ${
                activeTab === "shop"
                  ? "text-blue-500 md:text-blue-500"
                  : "text-white"
              }`}
              onClick={() => {
                navigate("/shop");
                setActiveTab("shop");
              }}
            >
              <MdShop className="w-5 h-5" />
              <p className="hidden font-semibold md:block">Shop</p>

              {activeTab === "shop" && (
                <div className="md:bg-blue-500 h-full w-[2px] absolute left-0"></div>
              )}
            </li>

            <li
              className={`relative hover:text-purple-lighter cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md md:hover:bg-dark-bg ${
                activeTab === "leaderboard"
                  ? "text-blue-500 md:text-blue-500"
                  : "text-white"
              }`}
              onClick={() => {
                navigate("/leaderboard");
                setActiveTab("leaderboard");
                localStorage.setItem("activeTab", "leaderboard");
              }}
            >
              <MdLeaderboard className="w-5 h-5" />
              <p className="hidden font-semibold md:block">Leaderboard</p>

              {activeTab === "leaderboard" && (
                <div className="md:bg-blue-500 h-full w-[2px] absolute left-0"></div>
              )}
            </li>

            <li
              className={`relative hover:text-purple-lighter cursor-pointer transition duration-200 ease-linear md:text-white md:flex md:items-center md:gap-3 md:w-full md:px-4 md:py-2.5 md:rounded-md md:hover:bg-dark-bg ${
                activeTab === "achievements"
                  ? "text-blue-500 md:text-blue-500"
                  : "text-white"
              }`}
              onClick={() => {
                navigate("/achievements");
                setActiveTab("achievements");
                localStorage.setItem("activeTab", "achievements");
              }}
            >
              <PiHandsClapping className="w-5 h-5" />
              <p className="hidden font-semibold md:block">Achievements</p>

              {activeTab === "achievements" && (
                <div className="md:bg-blue-500 h-full w-[2px] absolute left-0"></div>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <div
        className="hidden cursor-pointer md:flex justify-between items-center md:px-4 md:py-2 rounded-lg mx-4 transition duration-300 hover:bg-black-75"
        onClick={() => {
          navigate("/profile");
        }}
      >
        <div className="flex items-center gap-2 text-white md:text-white">
          <img
            src={
              avatar.imageUrl ||
              "https://st3.depositphotos.com/9998432/13335/v/600/depositphotos_133352156-stock-illustration-default-placeholder-profile-icon.jpg"
            } // Provide a default avatar URL
            alt=""
            className="w-[35px] h-[35px] rounded-full object-fill"
          />
          <p className="font-semibold">{currentUser?.data[0]?.fullname}</p>
        </div>

        <div>
          <FiMoreHorizontal className="relative cursor-pointer z-20 text-white md:w-6 md:h-6 md:text-white transition duration-300 hover:text-purple-lighter dark:hover:text-purple-lighter" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
