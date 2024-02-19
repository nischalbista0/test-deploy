import axios from "axios";
import { atom, useAtom } from "jotai";
import React, { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Achievements from "./Achievements";
import Leaderboard from "./Leaderboard";
import Learn from "./Learn";
import Shop from "./Shop";

export const currentUserAtom = atom(null);

const MainPage = () => {
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

  return (
    <div className="bg-white">
      <Sidebar />

      <div className="md:ml-[280px]">
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="learn" element={<Learn />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="shop" element={<Shop />} />
            <Route path="achievements" element={<Achievements />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
