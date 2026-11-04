import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

// Verifies the Bearer token and attaches the requesting user to req.user.
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorized, user no longer exists." });
    }
    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "Your account is currently inactive." });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ success: false, message: "Not authorized, token failed." });
  }
});

// Optional authentication: attaches req.user if valid token provided; leaves req.user = null for guests.
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith("Bearer ")) {
    token = header.split(" ")[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.status === "active") {
      req.user = user;
    } else {
      req.user = null;
    }
  } catch {
    req.user = null;
  }
  next();
});

// Restricts a route to admins only. Must run after `protect`.
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ success: false, message: "Admin access required." });
  }
  next();
};
