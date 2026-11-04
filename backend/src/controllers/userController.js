import User from "../models/User.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";

// @route GET /api/users (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users: users.map((u) => u.toSafeObject()) });
});

// @route GET /api/users/:id (admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });

  const bookings = await Booking.find({ user: user._id }).sort({ createdAt: -1 });
  res.json({ success: true, user: user.toSafeObject(), bookings });
});

// @route PUT /api/users/:id/status (admin)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be 'active' or 'inactive'." });
  }

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found." });
  if (user.role === "ADMIN") {
    return res.status(400).json({ success: false, message: "Admin accounts cannot be deactivated." });
  }

  user.status = status;
  await user.save();
  res.json({ success: true, user: user.toSafeObject() });
});
