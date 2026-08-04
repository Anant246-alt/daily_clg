import express from "express";
import { getReviews, getReviewsByProduct, submitReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getReviews);
router.get("/product/:productId", getReviewsByProduct);
router.post("/", protect, submitReview);

export default router;
