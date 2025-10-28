const stripe = require("stripe")(process.env.STRIPE_SECRET_API_KEY);
const BookingDb = require('../model/bookingModel');
const { createConfirmationRequest } = require("./ownerController");


// const CreateCheckoutSession = async (req, res) => {
//     try {
//         const { carId, bookingId } = req.body;
//         const userId = req.user.id;

//         if (!bookingId) {
//             return res.status(400).json({ message: "Booking ID is required" });
//         }

//         const booking = await BookingDb.findById(bookingId);
//         if (!booking) {
//             return res.status(404).json({ message: "Booking not found." });
//         }

//         if (booking.status !== "pending") {
//             return res.status(400).json({ message: "Booking not eligible for payment." });
//         }

//         const totalAmount = booking.totalAmount;
//         if (typeof totalAmount !== 'number' || isNaN(totalAmount)) {
//             return res.status(400).json({ message: "Invalid total amount for payment." });
//         }

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "inr",
//                         product_data: { name: `Car Rental Booking - Car ID: ${carId}` },
//                         unit_amount: Math.round(totalAmount * 100),
//                     },
//                     quantity: 1,
//                 }
//             ],
//             mode: "payment",
//             metadata: {
//                 bookingId,
//                 userId,
//                 carId
//             },
//             success_url: `${process.env.CLIENT_DOMAIN}/user/booking-success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.CLIENT_DOMAIN}/user/booking-cancelled`,
//         });

//         res.status(200).json({
//             success: true,
//             sessionId: session.id,
//             url: session.url,
//         });

//     } catch (error) {
//         console.error("Stripe session error:", error);
//         res.status(500).json({ error: error.message || "Something went wrong with payment session" });
//     }
// };

const CreateCheckoutSession = async (req, res) => {
    createConfirmationRequest
    try {
        const { carId, bookingId } = req.body;
        const userId = req.user.id;

        if (!bookingId) {
            return res.status(400).json({ message: "Booking ID is required" });
        }

        // Get booking and car details
        const booking = await BookingDb.findById(bookingId).populate("carId");
        if (!booking) return res.status(404).json({ message: "Booking not found" });

        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Booking not eligible for payment." });
        }

        const car = booking.carId;
        const carModel = car?.model || "Car";
        const carBrand = car?.brand || "";
        const carImage = car?.images?.[0] || `${process.env.CLIENT_DOMAIN}/default-car.jpg`;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${carBrand} ${carModel}`, // ✅ Example: Toyota Fortuner - Car Rental
                            images: [carImage],
                        },
                        unit_amount: Math.round(booking.totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            metadata: {
                bookingId: bookingId.toString(),
                userId: userId.toString(),
                carId: carId.toString(),
            },
            success_url: `${process.env.CLIENT_DOMAIN}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_DOMAIN}/user/payment-cancelled`,
        });

        res.status(200).json({
            success: true,
            sessionId: session.id,
            url: session.url,
        });

    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({
            error: error.message || "Something went wrong with payment session",
        });
    }
};




// 2. Get Stripe Session Status (optional)
// const sessionStatus = async (req, res) => {
//     try {
//         const sessionId = req.query.session_id;
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         res.status(200).json({
//             status: session.payment_status, // should be "paid"
//             customer_email: session.customer_details?.email,
//             session_data: session,
//         });
//     } catch (error) {
//         res.status(error?.statusCode || 500).json({
//             error: error.message || "Stripe session check failed",
//         });
//     }
// };

const sessionStatus = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // ✅ If payment is not completed, exit early
        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: "Payment not completed" });
        }

        const bookingId = session.metadata?.bookingId;

        if (bookingId) {
            const booking = await BookingDb.findById(bookingId).populate('carId');

            if (booking && booking.status !== 'paid') {
                booking.status = 'paid';
                booking.paymentId = session.payment_intent || sessionId;
                await booking.save();

                // ✅ Send confirmation request to owner
                await createConfirmationRequest(booking, booking.carId.owner);
            }
        }

        res.status(200).json({
            status: session.payment_status,
            customer_email: session.customer_details?.email,
            session_data: session,
        });

    } catch (error) {
        res.status(error?.statusCode || 500).json({
            error: error.message || "Stripe session check failed",
        });
    }
};

module.exports = { CreateCheckoutSession, sessionStatus };
