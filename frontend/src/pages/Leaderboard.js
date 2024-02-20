import { useAtom } from "jotai";
import React from "react";
import { FaCrown } from "react-icons/fa";
import { currentUserAtom } from "./MainPage";

const Leaderboard = () => {
  const [currentUser] = useAtom(currentUserAtom);
  // Dummy leaderboard data (replace it with actual data from your backend)
  const leaderboardData = [
    { rank: 1, username: "Nischal", score: currentUser?.data[0]?.points },
    { rank: 2, username: "Suprem", score: 250 },
    { rank: 3, username: "Susmita", score: 200 },
    // Add more entries as needed
  ];

  return (
    <div className="p-6 w-full">
      <div className="w-full">
        <h1 className="text-4xl font-bold text-purple-800 mb-6">
          🏆 Leaderboard
        </h1>

        <p className="text-gray-600 mb-6">
          Here are the top learners on the leaderboard. Keep playing and earn
          more points to climb to the top of the leaderboard!
        </p>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border-b-2 p-4">#</th>
                <th className="border-b-2 p-4">Username</th>
                <th className="border-b-2 p-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry) => (
                <tr key={entry.rank}>
                  <td className="border-b p-4 text-center">{entry.rank}</td>
                  <td className="border-b p-4 text-center">{entry.username}</td>
                  <td className="border-b p-4 text-center">{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center flex items-center justify-center gap-2">
          <FaCrown className="text-yellow-500 text-3xl" />
          <p className="text-gray-600">
            Keep up the good work and climb to the top of the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
