import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    // Assuming you have a login API endpoint at http://localhost:3001/users/login
    axios
      .post("http://localhost:3001/users/login", {
        email,
        password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data.token);

        navigate("/learn");
      })
      .catch((err) => {
        setError(err.response.data.error || "An error occurred");
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
          to="/signup"
          className="hidden rounded-2xl border-2 border-b-4 border-gray-200 px-4 py-3 text-sm font-bold uppercase text-blue-400 transition hover:bg-gray-50 hover:brightness-90 sm:block"
        >
          Sign up
        </Link>
      </header>

      <div className="flex grow items-center justify-center">
        <div className="flex w-full flex-col gap-5 sm:w-96">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Log in
          </h2>
          <div className="flex flex-col gap-2 text-black">
            {error && <span className="text-red-500">{error}</span>}

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
              placeholder="Email"
            />
            <div className="relative flex grow">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="grow rounded-2xl border-2 border-gray-200 bg-gray-50 px-4 py-3"
                placeholder="Password"
                type="password"
              />
            </div>
          </div>
          <button
            onClick={handleLogin}
            className="rounded-2xl border-b-4 border-blue-500 bg-blue-400 py-3 font-bold uppercase text-white transition hover:brightness-110"
          >
            Log in
          </button>

          <p className="block text-center sm:hidden">
            <span className="text-sm font-bold text-gray-700">
              Don't have an account?
            </span>{" "}
            <Link
              to="/signup"
              className="text-sm font-bold uppercase text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
};

export default Login;
