// index.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // Thêm cors module
const route = require("./route");
const cookieParser = require("cookie-parser");
// Khởi tạo Express và HTTP server
const app = express();
const { connection } = require("./database");
const server = http.createServer(app);
const { insertMessage } = require("./database");
// setup thuật toán mã hóa
app.use(express.json());
app.use(cookieParser());
// Cấu hình CORS cho Express
app.use(
  cors({
    origin: function (origin, callback) {
      // Cho phép mọi origin (nếu có origin, nếu không có thì là null)
      callback(null, origin || "*");
    },
    credentials: true, // Cho phép gửi credentials
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

const users = new Map();
// api
app.use("/api", route);

// Xử lý kết nối của client
io.on("connection", (socket) => {
  socket.on("login", (userId) => {
    if (userId) {
      console.log(`Client ${userId} connected: ${socket.id}`);
      socket.join(userId);
      if (!users.has(userId)) {
        users.set(userId, new Set([socket.id]));
      } else {
        users.get(userId).add(socket.id);
      }
      console.log("All users", Array.from(users.keys()));
      io.emit("onlineUsers", Array.from(users.keys()));
    }
  });
  socket.on("get-online-users", () => {
    socket.emit("onlineUsers", Array.from(users.keys()));
  });
  // Lắng nghe sự kiện 'chat message' từ client
  socket.on("chat_message", (msg) => {
    // Phát lại tin nhắn cho tất cả client (broadcast)
    // socket.to(msg.receiverUsername).emit("chat_message", msg);
    msg.chatId = [msg.senderId, msg.receiverId].sort().join("-");
    console.log("msg: ", msg);
    insertMessage(msg);
    socket.to(msg.receiverId).emit("chat_message", msg);
  });
  socket.on("logout", (userId) => {
    console.log("logout user: ", userId);
    socket.leave(userId);
    users.delete(userId);
    console.log("users", users);
    io.emit("onlineUsers", Array.from(users.keys()));
  });
  // Khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log("disconnect user: ", socket.id);
    for (const [userId, sockets] of users.entries()) {
      if (sockets.has(socket.id)) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          users.delete(userId);
        }
      }
    }
    io.emit("onlineUsers", Array.from(users.keys()));
  });
});

// Lắng nghe trên cổng 3000 hoặc cổng được cấu hình trong môi trường
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
