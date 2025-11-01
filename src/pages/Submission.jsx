// src/pages/Submission.jsx
import React, { useEffect, useState } from "react";
import "../styles/Submission.css";

export default function Submission() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // delay for smooth fade-in
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="submission-container">
      <div className={`submission-card ${visible ? "show" : ""}`}>
        <span className="emoji">🎉</span>
        <h1 className="submission-title">Submitted Successfully!</h1>
        <p className="submission-text">
          Your response has been recorded. Thank you! 💫
        </p>
      </div>
    </div>
  );
}
