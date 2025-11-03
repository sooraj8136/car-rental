const { createBooking, getAllBooking, getUserBookings, getOwnerBookings, cancelBooking, checkSpecificDateAvailability, checkCarAvailability, getBookingById } = require('../../controller/bookingController')
const { adminAuth } = require('../../middlewares/adminAuth')
const { ownerAuth } = require('../../middlewares/ownerAuth')
const { userAuth } = require('../../middlewares/userAuth')

const bookingRouter = require('express').Router()

bookingRouter.post("/create-booking",userAuth , createBooking)
bookingRouter.get("/get-all-booking",adminAuth , getAllBooking)
bookingRouter.get("/get-booking-byid/:id",userAuth , getBookingById)
bookingRouter.get("/get-user-booking",userAuth , getUserBookings)
bookingRouter.get("/get-owner-booking",ownerAuth , getOwnerBookings)
bookingRouter.post("/cancel-booking/:id",userAuth , cancelBooking)
bookingRouter.get("/car-availability/ranges/:carId",userAuth , checkCarAvailability)
bookingRouter.post("/car-specificdate-availability/:carId",userAuth , checkSpecificDateAvailability)

module.exports = bookingRouter