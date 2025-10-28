require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db')
var cookieParser = require('cookie-parser')
const cors = require('cors');
const apiRouter = require('./routes')

const app = express()

connectDB()

app.use(
    cors({
        origin: ["http://localhost:5173" , "https://car-rental-client-topaz.vercel.app"],
        credentials: true, 
        methods: ["GET", "POST", "PUT", "DELETE"] 
    })
);

app.use(express.json());
app.use(cookieParser())

app.use("/api", apiRouter)

// app.all("*", (req, res) => {
//     return res.status(404).json({ message: "End-point doesn't exist" })
// })
 
app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Server listening on port ${process.env.PORT}`)
    }
})
