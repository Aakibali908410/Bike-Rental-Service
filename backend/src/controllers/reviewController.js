import Review from "../models/Review.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getReviews = asyncHandler(async (_req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const { name, location, rating, review } = req.body;
  const numericRating = Number(rating);

  if (!name?.trim() || !review?.trim() || !Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      success: false,
      message: "Name, review, and a rating from 1 to 5 are required.",
    });
  }

  const createdReview = await Review.create({
    name: name.trim(),
    location: location?.trim() || "Rider",
    rating: numericRating,
    review: review.trim(),
  });

  res.status(201).json({ success: true, review: createdReview });
});
