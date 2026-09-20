import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
  repeatOrder,
  getAllAdminOrders,
  updateOrderStatusAdmin,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/admin/all", getAllAdminOrders);
router.put("/admin/:id/status", updateOrderStatusAdmin);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.post("/:id/repeat", repeatOrder);

export default router;
