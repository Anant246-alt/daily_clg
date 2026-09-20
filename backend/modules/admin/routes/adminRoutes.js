import express from "express";
import { adminGuard } from "../middleware/adminGuard.js";
import { adminErrorHandler } from "../middleware/adminErrorHandler.js";
import {
  validatePagination,
  validateUserUpdateBody,
  validateOrderStatusUpdateBody,
  validateProductBody,
} from "../validation/adminValidators.js";
import {
  getOverviewMetrics,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  listOrders,
  getOrderById,
  updateOrderStatus,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminController.js";

const router = express.Router();

// Apply auth & role guard to all admin v1 endpoints
router.use(adminGuard);

// 1. Overview Metrics
router.get("/metrics/overview", getOverviewMetrics);

// 2. User Management
router.get("/users", validatePagination, listUsers);
router.get("/users/:id", getUserById);
router.patch("/users/:id", validateUserUpdateBody, updateUser);
router.delete("/users/:id", deleteUser);

// 3. Order Management
router.get("/orders", validatePagination, listOrders);
router.get("/orders/:id", getOrderById);
router.patch("/orders/:id/status", validateOrderStatusUpdateBody, updateOrderStatus);

// 4. Product Catalogue Management
router.get("/products", validatePagination, listProducts);
router.post("/products", validateProductBody(false), createProduct);
router.patch("/products/:id", validateProductBody(true), updateProduct);
router.delete("/products/:id", deleteProduct);

// Scoped error handler for Admin V1
router.use(adminErrorHandler);

export default router;
