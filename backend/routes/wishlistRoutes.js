import express from "express";
import { getWishlist, toggleWishlist, removeFromWishlist } from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getWishlist);
router.post("/toggle/:productId", toggleWishlist);
router.delete("/:productId", removeFromWishlist);

export default router;
