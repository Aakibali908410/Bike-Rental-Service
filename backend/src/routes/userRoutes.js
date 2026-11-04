import express from "express";
import { getUsers, getUserById, updateUserStatus } from "../controllers/userController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id/status", updateUserStatus);

export default router;
