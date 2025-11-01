// src/pages/AdminQuestionPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';

export default function AdminQuestionPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const storedName = sessionStorage.getItem('adminName') || 'Admin';
  const [adminName] = useState(storedName);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [students, setStudents] = useState([]);
  const [launched, setLaunched] = useState(false);

  useEffect(() => {
    // connect if not connected
    if (!socket.connected) {
      socket.connect();
      socket.emit('admin_join_existing', { roomId, adminName }, (resp) => {
        if (!resp || !resp.ok) {
          alert('Failed to join as admin. Go back to login');
          navigate('/');
        }
      });
    }
    socket.on('students_update', ({ students }) => {
      setStudents(students);
    });
    socket.on('answers_update', ({ leaderboard }) => {
      // optional: live update while submissions come in
    });
    socket.on('admin_disconnected', () => {
      // nothing
    });
    return () => {
      socket.off('students_update');
      socket.off('answers_update');
    };
  }, []);

  function updateOption(idx, val) {
    const arr = [...options];
    arr[idx] = val;
    setOptions(arr);
  }

  function handleLaunch(e) {
    e.preventDefault();
    if (!questionText || options.some(o => o.trim() === '')) {
      alert('Please fill question and all options');
      return;
    }
    const q = {
      id: Date.now().toString(),
      text: questionText,
      options,
      correctIndex: Number(correctIndex)
    };
    socket.emit('launch_question', { roomId, question: q }, (resp) => {
      if (!resp || !resp.ok) {
        alert('Failed to launch');
        return;
      }
      setLaunched(true);
      // small visual toast / animation - handled by CSS
      setTimeout(() => setLaunched(false), 2000);
    });
  }

  function handleShowResults() {
    // socket.emit('show_results', { roomId }, (resp) => {
    //   if (!resp || !resp.ok) {
    //     alert('Failed to show results');
    //     return;
    //   }
    //   navigate(`/leaderboard/${roomId}`);
    // });

  socket.emit("get_results", { roomId }, (response) => {
    if (response.ok) {
      navigate(`/leaderboard/${roomId}`, { state: { roomId, leaderboard: response.leaderboard } });
    } else {
      alert(response.error || "Unable to fetch results");
    }
  });


  }

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <h1>Room: {roomId}</h1>
        <div>Admin: {adminName}</div>
      </header>

      <main className="admin-main">
        <form className="question-form" onSubmit={handleLaunch}>
          <textarea placeholder="Type question here..." value={questionText} onChange={e => setQuestionText(e.target.value)} />
          <div className="opts">
            {options.map((o, i) => (
              <input key={i} value={o} placeholder={`Option ${i+1}`} onChange={e => updateOption(i, e.target.value)} />
            ))}
          </div>
          <label>
            Correct answer:
            <select value={correctIndex} onChange={e => setCorrectIndex(e.target.value)}>
              {options.map((o, i) => <option key={i} value={i}>{o || `Option ${i+1}`}</option>)}
            </select>
          </label>
          <div className="buttons">
            <button type="submit">Launch Question</button>
            <button type="button" onClick={handleShowResults}>See Results</button>
          </div>
        </form>

        <aside className="student-list">
          <h3>Students joined</h3>
          <ul>
            {students.map(s => <li key={s.id}>{s.name}</li>)}
            {students.length === 0 && <li>No students yet</li>}
          </ul>
        </aside>
      </main>

      {launched && <div className="launched-banner">🚀 Question launched successfully!</div>}
    </div>
  );
}
