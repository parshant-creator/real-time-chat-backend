require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: "https://real-time-chat-frontend.vercel.app",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("public/uploads"));
const connectDB = require("./config/db");
connectDB();
// const User = require("./models/userModel");
const authmiddleware = require("./middelware/authMiddleware");
const userRoutes = require("./routes/userRoutes");

app.get("/",(req,res)=>{
  res.send("server is running successfully")
})

const http = require("http");
const { Server } = require("socket.io");
// app.get("/", async (req, res) => {
//   try {
//     const user = await User.create({
//       username: "parshant",
//       email: "123abc@gmail.com",
//       password: "123abc",
//       age: 25,
//     });

//     res.json(user);
//   } catch (error) {
//     console.error("Error creating user:", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
const chatRoutes = require("./routes/chatRoutes");
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
const messageRoutes = require("./routes/messageRoutes");

app.use("/api/message", messageRoutes);
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);
app.get("/profile", authmiddleware, (req, res) => {
  res.json({ msg: "this is a protected route", user: req.user });
});
const Port = process.env.PORT || 4000;
// app.listen(Port, ()=>{
//     console.log(`Server is running on port ${Port}`);
// })
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "real-time-chat-frontend-ashy.vercel.app",
    credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log("user connected", socket.id);
  socket.on("setup", (userId) => {
    socket.join(userId);
    socket.emit("connected");
    console.log("user joined room", userId);
  });
  socket.on("join chat", (chatId) => {
    socket.join(chatId);
    console.log("joined chat", chatId);
  });

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;

    if (!chat || !chat.users) {
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }

      io.to(user._id).emit("message received", newMessageReceived);
    });
  });
  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("disconnect", () => {
    console.log("disconnect");
  });
});
server.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
