// src/pages/StudentPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function StudentPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const storedName = sessionStorage.getItem('studentName') || 'Student';
  const [studentName] = useState(storedName);
  const [waiting, setWaiting] = useState(true);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const startAt = useRef(null);
  const timerRef = useRef(null);
  useEffect(() => {
  if (!socket.connected) {
    socket.connect();
    socket.emit('join_room', { roomId, studentName }, (resp) => {
      if (!resp || !resp.ok) {
        alert('Failed to join room. Go back to login.');
        navigate('/');
      }
    });
  }

  // When admin launches question
  socket.on('question_launched', ({ question }) => {
    setQuestion(question);
    setWaiting(false);
    setSubmitted(false);
    setSelected(null);
    startAt.current = question.launchedAt;

    // start countdown 40s
    let counter = 40;
    setTimeLeft(counter);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      counter -= 1;
      setTimeLeft(counter >= 0 ? counter : 0);
      if (counter <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);
  });

  // When admin shows results
  socket.on('show_results', ({ leaderboard }) => {
    navigate('/leaderboard', { state: { leaderboard } });
  });

  return () => {
    socket.off('question_launched');
    socket.off('show_results');
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [roomId, studentName, navigate]);

  function handleSelect(idx) {
    setSelected(idx);
  }

  function handleSubmit() {
    if (selected === null) return alert('Select an option first');
    socket.emit('submit_answer', { roomId, optionIndex: selected }, (resp) => {
      if (!resp || !resp.ok) {
        alert(resp && resp.error ? resp.error : 'Failed to submit');
        return;
      }
      setSubmitted(true);
      // show a success message
      setTimeout(() => {
        // we can auto navigate to leaderboard on submission; but better wait for admin to show results
        // For your request, we'll open leaderboard page immediately
        navigate('/submission');
      }, 800);
    });
  }

  return (
    <div className="student-wrap">
      <header className="student-header">
        <h2>Room: {roomId}</h2>
        <div>{studentName}</div>
      </header>

      <main className="student-main">
        {waiting && <div className="waiting">Waiting for admin to launch the question…</div>}

        {question && (
          <div className="question-card">
            <div className="q-top">
              <div className="q-text">{question.text}</div>
              <div className="timer">Time left: {timeLeft ?? '—'}s</div>
            </div>
            <div className="q-options">
              {question.options.map((opt, idx) => (
                <div key={idx} className={`opt ${selected === idx ? 'selected' : ''}`} onClick={() => handleSelect(idx)}>
                  <span className="opt-label">{String.fromCharCode(65 + idx)}</span>
                  <span className="opt-text">{opt}</span>
                </div>
              ))}
            </div>
            <div className="q-actions">
              <button disabled={submitted} style={{margin:"0 6rem"}} onClick={handleSubmit}>{submitted ? 'Submitted ✓' : 'Submit Answer'}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
