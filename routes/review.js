const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//Route to add a review to a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createNewReview)
);

//Route to delete a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
