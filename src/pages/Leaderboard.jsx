
// src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import socket from "../socket";
import "../styles/Leaderboard.css";


const Leaderboard = () => {
  const location = useLocation();
  const { roomId, leaderboard: passedData } = location.state || {};

  const [leaderboard, setLeaderboard] = useState(passedData || []);

  // 🔄 Listen for live leaderboard updates
  useEffect(() => {
    socket.on("answers_update", ({ leaderboard }) => {
      setLeaderboard(leaderboard);
    });

    socket.on("show_results", ({ leaderboard }) => {
      setLeaderboard(leaderboard);
    });

    return () => {
      socket.off("answers_update");
      socket.off("show_results");
    };
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="leaderboard-title">🏆 Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <p className="leaderboard-empty">No answers submitted yet...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Time (sec)</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr
                key={entry.id}
                className={entry.correct ? "correct" : "wrong"}
              >
                <td>{index + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.timeTakenSec}</td>
                <td>{entry.correct ? "✅ Correct" : "❌ Wrong"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
