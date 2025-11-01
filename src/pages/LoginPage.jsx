
// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import '../styles/LoginPage.css'; // make sure this line exists

export default function LoginPage() {
  const [mode, setMode] = useState('admin'); // 'student' or 'admin'
  const [adminPassword, setAdminPassword] = useState('');
  const [adminName, setAdminName] = useState('');
  const [roomIdAdmin, setRoomIdAdmin] = useState('');
  const [studentName, setStudentName] = useState('');
  const [roomIdStudent, setRoomIdStudent] = useState('');
  const [select, setSelect] = useState('admin');
  const navigate = useNavigate();

  const ADMIN_PASSWORD = 'dbmsking';

  function switchTo(m) {
    setMode(m);
  }

  async function handleCreateRoom(e) {
    e.preventDefault();
    if (adminPassword !== ADMIN_PASSWORD) {
      alert('Admin password incorrect');
      return;
    }
    if (!adminName || !roomIdAdmin) {
      alert('Please provide admin name and room ID');
      return;
    }

    socket.connect();
    socket.emit('create_room', { roomId: roomIdAdmin, adminName }, (resp) => {
      if (!resp || !resp.ok) {
        alert('Error creating room: ' + (resp && resp.error ? resp.error : 'unknown'));
        socket.disconnect();
        return;
      }
      sessionStorage.setItem('adminName', adminName);
      navigate(`/admin/${roomIdAdmin}`);
    });
  }

  async function handleStudentJoin(e) {
    e.preventDefault();
    if (!studentName || !roomIdStudent) {
      alert('Please enter your name and room id');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/room/${roomIdStudent}`
      );
      const data = await res.json();
      if (!data.exists) {
        alert('❌ Room not found! Please enter a valid Room ID.');
        return;
      }

      socket.connect();
      socket.emit('join_room', { roomId: roomIdStudent, studentName }, (resp) => {
        if (!resp || !resp.ok) {
          alert('Failed to join: ' + (resp && resp.error));
          socket.disconnect();
          return;
        }
        sessionStorage.setItem('studentName', studentName);
        navigate(`/student/${roomIdStudent}`);
      });
    } catch (err) {
      console.error(err);
      alert('Error checking room id');
    }
  }

  return (
    <>
      <div className="login-page">
        {/* ✨ Top animated title */}
        <h1 className="title fade-in-up">Welcome to the Ultimate DBMS Quiz 🎓</h1>
        <p className="subtitle fade-in-down">Let’s see… कौन बनेगा DBMS का SIKANDAR 👑</p>

        <div className="login-wrap">
          <div className={`card flip-${mode}`}>
            <div className="switcher">
              <button
                className={mode === 'admin' ? 'active' : ''}
                onClick={() => {
                  switchTo('admin');
                  setSelect('admin');
                }}
              >
                Admin
              </button>
              <button
                className={mode === 'student' ? 'active' : ''}
                onClick={() => {
                  switchTo('student');
                  setSelect('student');
                }}
              >
                Student
              </button>
            </div>

            {select === 'admin' && (
              <div className="pane admin-pane">
                <h2>Admin Login</h2>
                <form onSubmit={handleCreateRoom}>
                  <input
                    placeholder="Admin password"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <input
                    placeholder="Admin name"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                  />
                  <input
                    placeholder="Room ID (e.g., room123)"
                    value={roomIdAdmin}
                    onChange={(e) => setRoomIdAdmin(e.target.value)}
                  />
                  <button type="submit">Create Room</button>
                </form>
              </div>
            )}

            {select === 'student' && (
              <div className="pane student-pane">
                <h2>Join as Student</h2>
                <form onSubmit={handleStudentJoin}>
                  <input
                    placeholder="Your name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                  <input
                    placeholder="Room ID"
                    value={roomIdStudent}
                    onChange={(e) => setRoomIdStudent(e.target.value)}
                  />
                  <button type="submit">Join Room</button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* ✨ Bottom animated subtitle */}
      </div>
    </>
  );
}
