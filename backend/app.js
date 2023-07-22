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
app.use("/api/v1", payment);

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);

//Middleware to handle errors
app.use(errorMiddleware);
module.exports = app;
