import React from "react";
import { Link } from "react-router-dom";

const Learn = () => {
  const alphabets = Array.from({ length: 26 }, (_, index) =>
    String.fromCharCode("A".charCodeAt(0) + index)
  );

  const numbers = Array.from({ length: 10 }, (_, index) =>
    (index).toString()
  );

  return (
    <div className="py-6 px-6 md:py-8 md:px-14 w-full flex justify-center pb-20 md:pb-8">
      <div className="w-full flex flex-col gap-10">
        <div>
          <div className="flex bg-[#58cc02] rounded-xl px-6 py-3 flex-col gap-1.5 text-white">
            <h1 className="font-semibold text-xl">Unit 1</h1>
            <p className="font-medium text-[17px]">Alphabets</p>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4 md:grid-cols-6 md:gap-6">
            {alphabets.map((letter, index) => (
              <Link key={index} to={`/learn/alphabets/${letter}`}>
                <div
                  key={index}
                  className="flex items-center justify-center bg-[#2F4858] rounded-xl p-4 cursor-pointer transition duration-300 transform hover:scale-105 shadow-md"
                >
                  <span className="text-3xl font-bold text-[#fff]">
                    {letter}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="flex bg-[#58cc02] rounded-xl px-6 py-3 flex-col gap-1.5 text-white">
            <h1 className="font-semibold text-xl">Unit 2</h1>
            <p className="font-medium text-[17px]">Numbers</p>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4 md:grid-cols-6 md:gap-6">
            {numbers.map((number, index) => (
              <Link key={index} to={`/learn/numbers/${number}`}>
                <div className="flex items-center justify-center bg-[#2F4858] rounded-xl p-4 cursor-pointer transition duration-300 transform hover:scale-105 shadow-md">
                  <span className="text-3xl font-bold text-[#fff]">
                    {number}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;
