import express from "express";
import { sendChatMessage } from "../controllers/chatController.js";
import { optionalAuth } from "../middleware/auth.js";
import { chatRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// POST /api/chat/message with rate limiting and optional authentication
router.post("/message", chatRateLimiter(30, 60 * 1000), optionalAuth, sendChatMessage);

export default router;

