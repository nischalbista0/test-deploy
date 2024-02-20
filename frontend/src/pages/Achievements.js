import React from "react";
import { FaAward, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Achievements = () => {
  const badgeItems = [
    { 
      id: 1, 
      name: "Alphabet Explorer", 
      description: "Learned all alphabets", 
      achieved: false,
      imageUrl: "https://i.pinimg.com/736x/a6/fd/f8/a6fdf8c0cf8f7e67de4c094d36babf4b.jpg" 
    },
    { 
      id: 2, 
      name: "Number Ninja", 
      description: "Mastered counting numbers", 
      achieved: false,
      imageUrl: "https://img.freepik.com/premium-vector/kids-play-number-vector-illustration_97632-355.jpg" 
    },
    // Add more badge items related to alphabets and numbers
  ];

  return (
    <div className="p-6 w-full pb-20 md:pb-6 min-h-screen">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-purple-800 mb-6">Achievements</h1>

        <p className="text-gray-600 mb-6">
          Here are the badges you have achieved and the ones you can still
          achieve. Keep learning and unlock more badges!
        </p>

        <div className="mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {badgeItems.map((badge) => (
              <div
                key={badge.id}
                className={`relative p-4 border rounded-xl cursor-pointer transition duration-300 transform hover:scale-105`}
                onClick={() => {
                  if (badge.achieved) {
                    toast.success('Badge already achieved!');
                  } else {
                    toast.error('Badge locked! Keep learning to unlock it.');
                  }
                }}
              >
              <div className="bg-[#00000060] rounded-xl w-full h-full absolute top-0 left-0 z-10"></div>
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="w-full object-cover mb-2"
                />
                <p className="text-xl font-bold">{badge.name}</p>
                <p className="text-sm">{badge.description}</p>
                {badge.achieved ? (
                  <span className="text-green-500">
                    <FaAward />
                  </span>
                ) : (
                  <div className="text-gray-500 flex items-center gap-1">
                  <FaLock className="text-yellow-500" />
                  Locked
                  </div>
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

      <ToastContainer position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover />
    </div>
  );
};

export default Achievements;
