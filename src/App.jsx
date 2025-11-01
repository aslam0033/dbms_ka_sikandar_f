// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminQuestionPage from './pages/AdminQuestionPage';
import StudentPage from './pages/StudentPage';
import Leaderboard from './pages/Leaderboard';
import Submission from './pages/Submission';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/admin/:roomId" element={<AdminQuestionPage />} />
      <Route path="/student/:roomId" element={<StudentPage />} />
      <Route path="/leaderboard/:roomId" element={<Leaderboard />} />
      <Route path="/submission" element={<Submission />} />
    </Routes>
  );
}
