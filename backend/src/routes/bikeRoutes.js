import express from "express";
import {
  getBikes,
  getBikeById,
  createBike,
  updateBike,
  deleteBike,
  checkBikeAvailabilityHandler,
  getAvailableFleetHandler,
} from "../controllers/bikeController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Public Real-Time Availability Endpoints (must precede /:id)
router.post("/check-availability", checkBikeAvailabilityHandler);
router.get("/available-fleet", getAvailableFleetHandler);

// Standard Bike CRUD routes
router.get("/", getBikes);
router.get("/:id", getBikeById);
router.post("/", protect, adminOnly, createBike);
router.put("/:id", protect, adminOnly, updateBike);
router.delete("/:id", protect, adminOnly, deleteBike);

export default router;
