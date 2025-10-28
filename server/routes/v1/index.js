const v1Router = require('express').Router()
const userRouter = require('./userRoutes')
const adminRouter = require('./adminRoutes')
const ownerRouter = require('./ownerRoutes')
const carRouter = require('./carRoutes')
const bookingRouter = require('./bookingRoutes')
const paymentRouter = require('./paymentRoutes')
const reviewRouter = require('./reviewRoutes')

v1Router.use("/user", userRouter)
v1Router.use("/admin", adminRouter)
v1Router.use("/owner", ownerRouter)
v1Router.use("/car", carRouter)
v1Router.use("/booking", bookingRouter)
v1Router.use("/payment", paymentRouter)
v1Router.use("/review", reviewRouter)

module.exports = v1Router