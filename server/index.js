// require('dotenv').config()
// const express = require('express')
// const connectDB = require('./config/db')
// var cookieParser = require('cookie-parser')
// const cors = require('cors');
// const apiRouter = require('./routes')
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
//     res.json("hello world");
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



// const express = require("express");
// const cookieParser = require("cookie-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("../config/db");
// const apiRouter = require("../routes");

// // ✅ Load .env before anything else that depends on it
// dotenv.config();  

// const app = express();

// // ✅ Connect to DB after env is loaded
// connectDB();

// // ✅ Middleware
// app.use(express.json());
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
//     credentials: true,
//   })
// );

// // ✅ Routes
// app.use("/api", apiRouter);

// // ✅ Basic root route to avoid 500 error
// app.get("/", (req, res) => {
//   res.send("Server is running ✅");
// });

// // ✅ Handle missing favicon requests gracefully
// app.get("/favicon.ico", (req, res) => res.status(204).end());
// app.get("/favicon.png", (req, res) => res.status(204).end());

// // ✅ Start server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });





require('dotenv').config();
const express = require('express');
const connectDB = require('../config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRouter = require('../routes');

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://car-rental-client-lyart.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.json("Hello world");
});

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).json({ message: "End-point doesn't exist" });
});

// Server listener (optional for local dev only)
if (process.env.PORT) {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}

module.exports = app; // 👈 this export is required for Vercel serverless
