import axios from "axios";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { currentUserAtom } from "../../pages/MainPage";
import Sidebar from "../Sidebar";
import Button from "./Button";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import UserInfo from "./UserInfo";

const ProfileBody = () => {
  const [activeButton, setActiveButton] = useState("Edit Profile");

  const handleButtonClick = (btnName) => {
    setActiveButton(btnName);
  };

  const [, setCurrentUser] = useAtom(currentUserAtom);

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

  useEffect(() => {
    getUser();
  }, []);

  const formComponent =
    activeButton === "Edit Profile" ? (
      <EditProfile />
    ) : activeButton === "Change Password" ? (
      <ChangePassword />
    ) : null;

  return (
    <div className="w-full flex mb-16 md:mb-0">
      <Sidebar />

      <div className="md:ml-[280px] min-h-screen flex-1">
        <div className="w-full p-6 flex flex-col gap-8 xl:flex-row">
          <UserInfo />

          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-wrap gap-2 vsm:gap-4">
              <Button
                btnName="Edit Profile"
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
              />
              <Button
                btnName="Change Password"
                activeButton={activeButton}
                handleButtonClick={handleButtonClick}
              />
            </div>

            {formComponent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBody;
