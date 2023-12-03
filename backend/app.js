const express = require("express");
const app = express();
var morgan = require("morgan");

var cors = require("cors");

const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middlewares/errors");
const path = require("path");
const dotenv = require("dotenv");
// dotenv.config({ path: "backend/config/config.env" });
// dotenv.config({ path: "backend/config/config.env" });
dotenv.config({ path: "./config/config.env" });

console.log("PROCESS", process.env.PORT);
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  })
);

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
  });
}

app.use(
  cors({
    origin: "http://127.0.0.1:5173/",
    credentials: true,
  })
);

// app.use(
//   cors({
//     origin: "https://vapingsidewalk-client.onrender.com",
//     credentials: true,
//   })
// );
app.use(morgan("dev"));

// Import all routes
const products = require("./routes/product");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");
const category = require("./routes/category");
const wishlist = require("./models/wishlist");

app.use("/api/v1", payment);
app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", category);
app.use("/api/v1", wishlist);

//Middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
