// src/socket.js
import { io } from 'socket.io-client';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const socket = io(BACKEND, { autoConnect: false });

export default socket;
