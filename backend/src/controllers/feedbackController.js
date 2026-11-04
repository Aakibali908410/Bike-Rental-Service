import Feedback from "../models/Feedback.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to safely extract authenticated user if token is provided
const getOptionalUser = async (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.id) {
        return await User.findById(decoded.id);
      }
    }
  } catch {
    return null;
  }
  return null;
};

// @desc    Submit new customer feedback
// @route   POST /api/feedback
// @access  Public (Guest or Authenticated Customer)
export const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, rating, message, category } = req.body;

  // Validation
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ success: false, message: "Please provide your name." });
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ success: false, message: "Please provide your email address." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address." });
  }

  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ success: false, message: "Rating must be an integer between 1 and 5." });
  }

  if (!message || typeof message !== "string" || message.trim().length < 5) {
    return res.status(400).json({ success: false, message: "Feedback message must be at least 5 characters." });
  }
  if (message.trim().length > 2000) {
    return res.status(400).json({ success: false, message: "Feedback message cannot exceed 2000 characters." });
  }

  // Sanitize message - strip dangerous HTML tags
  const sanitizedMessage = message.trim().replace(/<[^>]*>?/gm, "");
  const sanitizedName = name.trim().replace(/<[^>]*>?/gm, "").slice(0, 100);

  // Link to user account if signed in
  const user = await getOptionalUser(req);

  const feedback = await Feedback.create({
    name: sanitizedName,
    email: email.trim().toLowerCase(),
    rating: numericRating,
    category: category?.trim() || "General",
    message: sanitizedMessage,
    user: user?._id || null,
    status: "PENDING",
  });

  res.status(201).json({
    success: true,
    message: "Thank you for your feedback! Your review has been saved successfully.",
    feedback,
  });
});

// @desc    Fetch recent feedback
// @route   GET /api/feedback
// @access  Public
export const getFeedbackList = asyncHandler(async (_req, res) => {
  const feedbackList = await Feedback.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    success: true,
    count: feedbackList.length,
    feedback: feedbackList,
  });
});
