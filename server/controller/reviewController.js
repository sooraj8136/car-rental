const CarDb = require('../model/carModel');
const BookingDb = require('../model/bookingModel');
const ReviewDb = require('../model/reviewModel');

const addReview = async (req, res) => {
    try {
        const { carId, rating, comment } = req.body;
        // const carId = req.params.carId; // ✅ get carId from URL
        const userId = req.user.id;

        if (!carId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if car exists
        const car = await CarDb.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Check if the user has completed a booking for this car
        const completedBooking = await BookingDb.findOne({
            userId,
            carId,
            status: "completed",
        });

        if (!completedBooking) {
            return res.status(400).json({ message: "You can only review a car after completing a rental" });
        }

        // Check if user already reviewed this car
        const existingReview = await ReviewDb.findOne({ userId, carId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this car" });
        }

        // Create new review
        const newReview = new ReviewDb({
            userId,
            carId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(200).json({ message: "Review added successfully", data: newReview });
    } catch (error) {
        console.error("Add review error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const editReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const carId = req.params.carId; // Get carId from the URL
        const userId = req.user.id;

        if (!rating || !comment) {
            return res.status(400).json({ message: "Rating and comment are required" });
        }

        // Check if the car exists
        const car = await CarDb.findById(carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Find existing review
        const existingReview = await ReviewDb.findOne({
            userId,
            carId,
        });

        if (!existingReview) {
            return res.status(400).json({ message: "No existing review found. Add one before editing." });
        }

        // Update review fields
        existingReview.rating = rating;
        existingReview.comment = comment;

        await existingReview.save();

        res.status(200).json({
            message: "Review updated successfully",
            data: existingReview,
        });

    } catch (error) {
        console.error("Edit review error:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

const getReviews = async (req, res) => {
    const { carId } = req.params;

    try {
        const reviews = await ReviewDb.find({ carId }).populate('userId', 'name');

        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this car' });
        }

        res.status(200).json(reviews);
    } catch (err) {
        console.error("Get reviews error:", err);
        res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
    }
};

const deleteReview = async (req, res) => {
    const { carId, reviewId } = req.params;
    const userId = req.user?.id;

    try {
        if (!carId || !reviewId || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const review = await ReviewDb.findOne({ _id: reviewId, carId, userId });

        if (!review) {
            return res.status(404).json({ message: 'Review not found or unauthorized' });
        }

        await ReviewDb.deleteOne({ _id: reviewId });

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (err) {
        console.error("Delete review error:", err);
        res.status(500).json({ message: 'Failed to delete review', error: err.message });
    }
};


module.exports = { addReview, editReview, getReviews, deleteReview };
