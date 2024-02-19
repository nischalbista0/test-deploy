import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProfileBody from "./components/Profile/ProfileBody";
import XrCubeContainer from "./components/xr-model/XrModelContainer";
import AlphabetLesson from "./pages/AlphabetLesson";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import MainPage from "./pages/MainPage";
import NotFound from "./pages/NotFound";
import NumberLesson from "./pages/NumberLesson";
import Signup from "./pages/Signup";
import XrModelContainer from "./components/xr-model/XrModelContainer";
import XrGalleryContainer from "./components/xr-gallery/XrGalleryContainer";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<MainPage />} />
        <Route path="/learn/alphabets/:id" element={<AlphabetLesson />} />
        <Route path="/learn/numbers/:id" element={<NumberLesson />} />
        <Route path="/learn/:id/view-ar" element={<XrModelContainer />} />
        <Route path="/profile" element={<ProfileBody />} />
        <Route path="/xr-characters" element={<XrGalleryContainer />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
