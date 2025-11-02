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



require('dotenv').config();
const express = require('express');
const connectDB = require('../server/config/db');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRouter = require('../server/routes');

const app = express();

// Connect to DB
connectDB();

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
app.get('/', (req, res) => {
  res.json({ message: "Hello world" });
});

// API routes
app.use('/api', apiRouter);

// 404 handler
app.all('*', (req, res) => {
  return res.status(404).json({ message: "End-point doesn't exist" });
});

// Export app for Vercel
module.exports = app;
