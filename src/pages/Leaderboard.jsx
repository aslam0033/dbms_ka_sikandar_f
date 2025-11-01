// // src/pages/Leaderboard.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import socket from '../socket';

// export default function Leaderboard() {
//   const { roomId } = useParams();
//   const [board, setBoard] = useState(() => {
//     const raw = sessionStorage.getItem('last_leaderboard');
//     return raw ? JSON.parse(raw) : [];
//   });

//   useEffect(() => {
//     socket.on('show_results', ({ leaderboard }) => {
//       setBoard(leaderboard);
//     });
//     socket.on('answers_update', ({ leaderboard }) => {
//       setBoard(leaderboard);
//     });
//     return () => {
//       socket.off('show_results');
//       socket.off('answers_update');
//     };
//   }, []);

//   return (
//     <div className="lb-wrap">
//       <header className="lb-header">
//         <h2>Leaderboard — Room {roomId}</h2>
//       </header>

//       <main className="lb-main">
//         <ol className="lb-list">
//           {board.length === 0 && <div className="no-data">No answers yet</div>}
//           {board.map((p, idx) => (
//             <li key={p.id} className={`lb-item ${p.correct ? 'correct' : 'wrong'}`}>
//               <div className="rank">{idx + 1}</div>
//               <div className="who">
//                 <div className="name">{p.name}</div>
//                 <div className="meta">{p.correct ? 'Correct' : 'Wrong'}</div>
//               </div>
//               <div className="time">{p.timeTakenSec}s</div>
//             </li>
//           ))}
//         </ol>
//       </main>
//     </div>
//   );
// }


// src/components/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import "../styles/Leaderboard.css";

const socket = io("http://localhost:4000"); // ✅ adjust if your backend uses another port

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
