import { io } from "socket.io-client";

// Create a socket instance
const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
  reconnectionDelay: 1000,
  reconnection: true,
  reconnectionAttempts: 10,
  transports: ["websocket"],
  agent: false,
  upgrade: false,
  rejectUnauthorized: false,
});

// Add event listeners for connection
socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error);
});

export default socket;
