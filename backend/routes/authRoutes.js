import express from "express";
import { sendOtp, verifyOtp, logout, getMe, getAllUsers } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow both Phone Numbers and Email addresses without express-validator blocking phone strings
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.get("/users", getAllUsers);
router.get("/admin/users", getAllUsers);

export default router;
