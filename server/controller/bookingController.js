const mongoose = require("mongoose");
const BookingDb = require('../model/bookingModel')
const CarDb = require('../model/carModel');


// const createBooking = async (req, res) => {
//     try {
//         const { carId, pickupDate, dropoffDate } = req.body;
//         const userId = req.user.id;

//         if (!carId || !pickupDate || !dropoffDate) {
//             return res.status(400).json({ message: "All fields are required." });
//         }

//         const car = await CarDb.findById(carId);
//         if (!car) {
//             return res.status(404).json({ message: "Car not found." });
//         }

//         const pickup = new Date(pickupDate);
//         const dropoff = new Date(dropoffDate);
//         const rentalDays = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
//         if (rentalDays <= 0) {
//             return res.status(400).json({ message: "Invalid rental date range." });
//         }

//         const totalAmount = car.rentalPricePerDay * rentalDays;

//         const isBooked = await BookingDb.exists({
//             carId,
//             $or: [
//                 {
//                     pickupDate: { $lte: dropoff },
//                     dropoffDate: { $gte: pickup }
//                 }
//             ],
//             status: { $in: ['paid'] },
//             ownerConfirmation: { $in: ['pending', 'confirmed'] }
//         });

//         if (isBooked) {
//             return res.status(400).json({ message: "Car is not available for the selected dates." });
//         }

//         const newBooking = new BookingDb({
//             userId,
//             carId,
//             pickupDate,
//             dropoffDate,
//             totalAmount,
//         });

//         const savedBooking = await newBooking.save();

//         res.status(200).json({
//             message: "Booking created. Proceed to payment.",
//             data: savedBooking
//         });

//     } catch (error) {
//         console.error("Booking creation error:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// };

const createBooking = async (req, res) => {
    try {
        const { carId, pickupDate, dropoffDate } = req.body;
        const userId = req.user.id;

        if (!carId || !pickupDate || !dropoffDate) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const car = await CarDb.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }

        const pickup = new Date(pickupDate);
        const dropoff = new Date(dropoffDate);
        const rentalDays = Math.ceil((dropoff - pickup) / (1000 * 60 * 60 * 24));
        if (rentalDays <= 0) {
            return res.status(400).json({ message: "Invalid rental date range." });
        }

        const totalAmount = car.rentalPricePerDay * rentalDays;

        const isBooked = await BookingDb.exists({
            carId,
            $or: [
                {
                    pickupDate: { $lte: dropoff },
                    dropoffDate: { $gte: pickup }
                }
            ],
            status: { $in: ['paid'] },
            ownerConfirmation: { $in: ['pending', 'confirmed'] }
        });

        if (isBooked) {
            return res.status(400).json({ message: "Car is not available for the selected dates." });
        }

        const ownerId = car.owner; // 🔥 get ownerId from car

        const newBooking = new BookingDb({
            userId,
            carId,
            pickupDate,
            dropoffDate,
            totalAmount,
            ownerId, // 🔥 save ownerId
        });

        const savedBooking = await newBooking.save();

        res.status(200).json({
            message: "Booking created. Proceed to payment.",
            data: savedBooking
        });

    } catch (error) {
        console.error("Booking creation error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};




const getAllBooking = async (req, res) => {
    try {
        const bookings = await BookingDb.find()
            .populate("userId", "name email")
            .populate("carId", "brand model");
        res.status(200).json({ message: "All Booking fetched successfully", data: bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log(userId, '---User ID');

        const bookings = await BookingDb.find({ userId })
            .populate("carId", "brand images model year rentalPricePerDay");

        const today = new Date();

        // Update 'paid' bookings to 'completed' if dropoffDate passed
        await Promise.all(
            bookings.map(async (booking) => {
                if (booking.status === "paid" && booking.dropoffDate < today) {
                    booking.status = "completed";
                    await booking.save();
                }
            })
        );

        res.status(200).json({ message: "User Booking fetched successfully", data: bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getOwnerBookings = async (req, res) => {
    try {
        const ownerId = req.user.id;
        // Step 1: Find all car IDs owned by this owner
        const ownerCars = await CarDb.find({ owner: ownerId }).select('_id');
        const carIds = ownerCars.map(car => car._id);

        if (carIds.length === 0) {
            return res.status(404).json({ message: "No cars found for this owner" });
        }

        const ownerBookings = await BookingDb.find({ carId: { $in: carIds } })
            .populate("carId", "brand model year rentalPricePerDay")
            .populate("userId", "name email");

        res.status(200).json({ message: "Owner bookings fetched successfully", data: ownerBookings, });

    } catch (error) {
        console.error("Error fetching owner bookings:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.id;

        const booking = await BookingDb.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // SAFETY CHECK added here
        if (!booking.userId || booking.userId.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to cancel this booking" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({ message: "Booking cancelled successfully", data: booking });
    } catch (error) {
        console.error("Cancel Booking Error:", error);
        res.status(500).json({ message: "Something went wrong", error });
    }
};

const checkSpecificDateAvailability = async (req, res) => {
    try {
        const carId = new mongoose.Types.ObjectId(req.params.carId);
        const { pickup, dropoff } = req.body; // ✅ from body now

        if (!pickup || !dropoff) {
            return res.status(400).json({ message: "Pickup and dropoff dates are required" });
        }

        const pickupDate = new Date(pickup);
        const dropoffDate = new Date(dropoff);

        if (pickupDate >= dropoffDate) {
            return res.status(400).json({ message: "Dropoff must be after pickup date" });
        }

        const overlappingBooking = await BookingDb.findOne({
            carId,
            status: { $in: ["paid", "completed"] },
            $or: [
                {
                    pickupDate: { $lte: dropoffDate },
                    dropoffDate: { $gte: pickupDate },
                }
            ]
        });

        if (overlappingBooking) {
            return res.status(200).json({
                available: false,
                message: "Car is already booked for selected dates",
                conflict: {
                    pickupDate: overlappingBooking.pickupDate,
                    dropoffDate: overlappingBooking.dropoffDate
                }
            });
        }

        res.status(200).json({ available: true, message: "Car is available for booking" });
    } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const checkCarAvailability = async (req, res) => {
    try {
        const carId = new mongoose.Types.ObjectId(req.params.carId);

        const bookings = await BookingDb.find({
            carId,
            status: { $in: ["paid", "completed"] }
        }).select("pickupDate dropoffDate");

        const unavailableRanges = bookings.map(booking => ({
            pickupDate: booking.pickupDate,
            dropoffDate: booking.dropoffDate
        }));

        res.status(200).json({
            message: "Booked dates fetched successfully",
            unavailableRanges
        });
    } catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getBookingById = async (req, res) => {
    try {
        const booking = await BookingDb.findById(req.params.id).populate("carId");
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        res.status(200).json({ booking });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = { createBooking, getAllBooking, getUserBookings, getOwnerBookings, cancelBooking, checkSpecificDateAvailability, checkCarAvailability, getBookingById }