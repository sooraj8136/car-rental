const { addReview, editReview, getReviews, deleteReview } = require('../../controller/reviewController')
const { userAuth } = require('../../middlewares/userAuth')
const reviewRouter = require('express').Router()

reviewRouter.post("/add-review", userAuth, addReview)
reviewRouter.put("/edit-review/:carId", userAuth, editReview)
reviewRouter.get("/get-review/:carId", getReviews)
reviewRouter.delete("/delete-review/:carId/:reviewId", userAuth, deleteReview)

module.exports = reviewRouter