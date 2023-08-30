const express = require("express");
const app = express();
var morgan = require("morgan");

var cors = require("cors");

const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middlewares/errors");

const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
// app.use(fileUpload());
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  })
);

const { Server } = require("socket.io");
let onlineUsers = [];

const io = new Server({ cors: "http://127.0.0.1:5173" });
io.listen(3000);

io.on("connection", (socket) => {
  console.log("NEW CONNECTION", socket.id);

  socket.on("addNewUser", (userId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId: socket.id });
    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  //add message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.senderId);
    console.log("sendMessage event received:", message);
    console.log("USER APP", user);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        chatId: message.chatId,
        message: message, // Emit the full message object here
      });
      console.log("get Message event received:", message);
    }
  });
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

app.use(
  cors({
    origin: "http://127.0.0.1:5173", // Replace with your frontend domain
  })
);
app.use(morgan("dev"));

// Import all routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");
const category = require("./routes/category");
const chat = require("./routes/chat");
const messages = require("./routes/messages");

app.use("/api/v1", messages);
app.use("/api/v1", chat);
app.use("/api/v1", payment);
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", category);

//Middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
