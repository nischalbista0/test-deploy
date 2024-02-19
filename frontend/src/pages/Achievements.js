import React from "react";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

const Achievements = () => {
  const badgeItems = [
    { id: 1, name: "Alphabet Explorer", description: "Learned all alphabets", achieved: true },
    { id: 2, name: "Number Ninja", description: "Mastered counting numbers", achieved: false },
    // Add more badge items related to alphabets and numbers
  ];

  return (
    <div className="p-6 w-full pb-20 md:pb-6 min-h-screen">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-purple-800 mb-6">Achievements</h1>

        <div className="mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {badgeItems.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 border rounded-xl cursor-pointer transition duration-300 transform hover:scale-105`}
              >
                <p className="text-xl font-bold">{badge.name}</p>
                <p className="text-sm">{badge.description}</p>
                {badge.achieved ? (
                  <span className="text-green-500">
                    <FaAward />
                  </span>
                ) : (
                  <span className="text-gray-300">Locked</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link to="/learn">
            <button className="bg-purple-500 text-white px-4 py-2 mt-4 rounded-md">
              Go Back to Learning
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
