// require('dotenv').config()
// const express = require('express')
// const connectDB = require('../config/db')
// var cookieParser = require('cookie-parser')
// const cors = require('cors');
// const apiRouter = require('../routes')
// require('dotenv').config()   // Added

// const app = express()

// connectDB()
// app.use(express.json());  // position chnaged

// app.use(
//     cors({
//         origin: ["http://localhost:5173", "https://car-rental-client-lyart.vercel.app"],
//         credentials: true,
//         methods: ["GET", "POST", "PUT", "DELETE"]
//     })
// );

// app.use(cookieParser())

// app.get("/", (req, res, next) => {
//     res.json("Hello world");
// });

// app.use("/api", apiRouter)

// app.all("*", (req, res) => {
//     return res.status(404).json({ message: "End-point doesn't exist" })
// })

// app.listen(process.env.PORT, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(`Server listening on port ${process.env.PORT}`)
//     }
// })



const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const apiRouter = require("../routes");

dotenv.config();

const app = express();

// Connect to MongoDB only once
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
})();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://car-rental-client-lyart.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

// API routes
app.use("/api", apiRouter);

// 404 handler
app.all("*", (req, res) => {
  return res.status(404).json({ message: "End-point doesn't exist" });
});

// ❌ Do NOT use app.listen() — Vercel handles that
module.exports = app;
