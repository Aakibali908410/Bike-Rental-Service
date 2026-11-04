import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

// @route POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone?.trim() || "",
    password,
  });

  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// @route POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }
  if (user.status !== "active") {
    return res.status(403).json({ success: false, message: "Your account is currently inactive. Please contact support." });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: user.toSafeObject(),
  });
});

// @route GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeObject() });
});

// @route PUT /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  if (name !== undefined) req.user.name = name.trim();
  if (phone !== undefined) req.user.phone = phone.trim();

  await req.user.save();
  res.json({ success: true, user: req.user.toSafeObject() });
});
