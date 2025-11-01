// src/socket.js
import { io } from 'socket.io-client';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://dbms-ka-sikandar-f.vercel.app/';
export const socket = io(BACKEND, { autoConnect: false });

export default socket;
