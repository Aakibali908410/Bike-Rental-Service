import express from "express";
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  getBookingStats,
} from "../controllers/bookingController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/mine", protect, getMyBookings);
router.get("/stats", protect, adminOnly, getBookingStats);
router.get("/", protect, adminOnly, getAllBookings);
router.get("/:bookingId", protect, getBookingById);
router.put("/:bookingId/cancel", protect, cancelBooking);
router.put("/:bookingId", protect, adminOnly, updateBookingStatus);

export default router;
