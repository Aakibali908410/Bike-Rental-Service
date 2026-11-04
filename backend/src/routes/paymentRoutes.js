import express from "express";
import { processPayment, getPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, processPayment);
router.get("/:idOrBookingId", protect, getPayment);

export default router;
