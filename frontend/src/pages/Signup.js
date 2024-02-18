import axios from "axios";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [ageTooltipShown, setAgeTooltipShown] = useState(false);
  const ageInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    console.log(ageInputRef.current.value)
    const data = {
      age: ageInputRef.current.value,
      fullname: nameInputRef.current.value,
      email: emailInputRef.current.value,
      password: passwordInputRef.current.value,
    };

    axios
      .post("http://localhost:3001/users/register", data)
      .then((response) => {
        // Handle success response, reset form, show success message, etc.
        navigate("/login");

        console.log(response.data);
        setError("");
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setError(error.response.data.error);
        } else {
          setError("An error occurred. Please try again.");
        }
      });
  };

  return (
    <article className="fixed inset-0 z-30 flex flex-col bg-white p-7 transition duration-300">
      <header className="flex flex-row-reverse justify-between sm:flex-row">
        <Link
          to="/"
          className="rounded-2xl border-2 border-b-4 border-gray-200 px-4 py-3 text-sm font-bold uppercase text-blue-400 transition hover:bg-gray-50 hover:brightness-90"
        >
          Back
        </Link>

        <Link
          to="/login"
          className="hidden rounded-2xl border-2 border-b-4 border-gray-200 px-4 py-3 text-sm font-bold uppercase text-blue-400 transition hover:bg-gray-50 hover:brightness-90 sm:block"
        >
          Log in
        </Link>
      </header>

      <div className="flex grow items-center justify-center">
        <div className="flex w-full flex-col gap-5 sm:w-96">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Create your profile
          </h2>
          <div className="flex flex-col gap-2 text-black">
          {error && <span className="text-red-500">{error}</span>}
            <div className="relative flex grow">
              <input
                ref={ageInputRef}
                className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
                placeholder="Age"
              />
              <div className="absolute bottom-0 right-0 top-0 flex items-center justify-center pr-4">
                <div
                  className="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-2 border-gray-200 text-gray-400"
                  onMouseEnter={() => setAgeTooltipShown(true)}
                  onMouseLeave={() => setAgeTooltipShown(false)}
                  onClick={() => setAgeTooltipShown((x) => !x)}
                  role="button"
                  tabIndex={0}
                  aria-label="Why do you need an age?"
                >
                  ?
                  {ageTooltipShown && (
                    <div className="absolute -right-5 top-full z-10 w-72 rounded-2xl border-2 border-gray-200 bg-white p-4 text-center text-xs leading-5 text-gray-800">
                      Providing your age ensures you get the right experience.
                    </div>
                  )}
                </div>
              </div>
            </div>
            <input
              ref={nameInputRef}
              className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Name"
            />
            <input
              ref={emailInputRef}
              className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Email"
            />
            <div className="relative flex grow">
              <input
                ref={passwordInputRef}
                className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
                placeholder="Password"
                type="password"
              />
            </div>
          </div>
          <button
            onClick={handleSignup}
            className="rounded-2xl border-b-4 border-blue-500 bg-blue-400 py-3 font-bold uppercase text-white transition hover:brightness-110"
          >
            Create account
          </button>

          <p className="block text-center sm:hidden">
            <span className="text-sm font-bold text-gray-700">
              Have an account?
            </span>{" "}
            <Link
              to="/login"
              className="text-sm font-bold uppercase text-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
};

export default Signup;
