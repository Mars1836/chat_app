// index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Thêm cors module

// Khởi tạo Express và HTTP server
const app = express();
const server = http.createServer(app);

// Cấu hình CORS cho Express
app.use(
  cors({
    origin: "*", // Cho phép mọi domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cấu hình CORS cho Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Cho phép mọi domain
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

// Định nghĩa một route đơn giản
app.get("/", (req, res) => {
  res.send("Socket.io Chat Server is running");
});

// Xử lý kết nối của client
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Lắng nghe sự kiện 'chat message' từ client
  socket.on("chat message", (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    // Phát lại tin nhắn cho tất cả client (broadcast)
    io.emit("chat message", msg);
  });

  // Khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Lắng nghe trên cổng 3000 hoặc cổng được cấu hình trong môi trường
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
