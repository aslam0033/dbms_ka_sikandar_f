// src/socket.js
import { io } from 'socket.io-client';

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

console.log("🔗 Connecting to backend:", BACKEND);

export const socket = io(BACKEND, {
  autoConnect: false,
  transports: ['websocket'], // ✅ force WebSocket (no polling)
  secure: true,              // ✅ required for HTTPS
  withCredentials: false,
});

export default socket;


