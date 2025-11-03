// require('dotenv').config()
// const express = require('express')
// const connectDB = require('./config/db')
// var cookieParser = require('cookie-parser')
// const cors = require('cors');
// const apiRouter = require('./routes')

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

// // app.all("*", (req, res) => {
// //     return res.status(404).json({ message: "End-point doesn't exist" })
// // })

// app.listen(process.env.PORT, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(`Server listening on port ${process.env.PORT}`)
//     }
// })



require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const apiRouter = require('./routes');

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:5173", "https://car-rental-client-lyart.vercel.app"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

app.use(cookieParser());

app.get("/", (req, res) => {
    res.json("hello world");
});

app.use("/api", apiRouter);

// ✅ Proper async server start
const startServer = async () => {
    try {
        await connectDB(); // Wait until MongoDB connection is ready
        app.listen(process.env.PORT, () => {
            console.log(`✅ Server running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

startServer();




// const express = require("express");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const apiRouter = require("./routes");

// dotenv.config(); // only once!

// const app = express();

// // Connect DB
// connectDB();

// app.use(express.json());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "https://car-rental-client-lyart.vercel.app"],
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

// app.use(cookieParser());

// app.get("/", (req, res) => {
//   res.json("Hello from Car Rental API");
// });

// app.use("/api", apiRouter);

// app.all("*", (req, res) => {
//   return res.status(404).json({ message: "End-point doesn't exist" });
// });

// // ✅ Export for Vercel
// module.exports = app;

// // ✅ Start server locally only
// if (process.env.NODE_ENV !== "production") {
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }
