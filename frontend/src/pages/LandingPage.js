import React from "react";
import { Link } from "react-router-dom";
import _bgSnow from "../assets/bg-snow.svg";
import { GlobeSvg } from "../components/Svgs";

const bgSnow = _bgSnow;

const LandingPage = () => {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-[#235390] text-white"
      style={{ backgroundImage: `url(${bgSnow.src})` }}
    >
      <header className="fixed left-0 right-0 top-4 mx-auto flex min-h-[70px] max-w-5xl items-center justify-between bg-[#235390] px-10 font-bold text-white">
        <Link className="text-4xl" href="/">
          LinguaChamps
        </Link>
      </header>

      <div className="flex w-full flex-col items-center justify-center gap-3 px-4 py-16 md:flex-row md:gap-36">
        <GlobeSvg className="h-fit w-7/12 md:w-[360px]" />
        <div>
          <p className="mb-6 max-w-[600px] text-center text-3xl font-bold md:mb-12">
            The free, fun, and effective way to learn a language!
          </p>
          <div className="mx-auto mt-4 flex w-fit flex-col items-center gap-3">
            <Link
              to="/signup"
              className="w-full rounded-2xl border-b-4 border-green-700 bg-green-600 px-10 py-3 text-center font-bold uppercase transition hover:border-green-600 hover:bg-green-500 md:min-w-[320px]"
            >
              Get started
            </Link>
            <button
              className="w-full rounded-2xl border-2 border-b-4 border-[#042c60] bg-[#235390] px-8 py-3 font-bold uppercase transition hover:bg-[#204b82] md:min-w-[320px]"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              I already have an account
            </button>
          </div>
        </div>
      </div>

      {/* <LoginScreen
        loginScreenState={loginScreenState}
        setLoginScreenState={setLoginScreenState}
      /> */}
    </main>
  );
};

export default LandingPage;
