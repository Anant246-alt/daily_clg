import express from "express";
import { body } from "express-validator";
import { sendOtp, verifyOtp, logout, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/send-otp",
  [body("email").isEmail().withMessage("Please provide a valid email")],
  validateRequest,
  sendOtp
);

router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
  ],
  validateRequest,
  verifyOtp
);

router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;
