import express from "express";
import { submitFeedback, getFeedbackList } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", getFeedbackList);

export default router;
