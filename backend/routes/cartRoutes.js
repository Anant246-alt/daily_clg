import express from "express";
import {
  getCart,
  addToCart,
  updateCartItemQty,
  removeCartItem,
  clearCart,
  applyPromo,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/item", updateCartItemQty);
router.delete("/item/:id", removeCartItem);
router.delete("/", clearCart);
router.post("/apply-promo", applyPromo);

export default router;
