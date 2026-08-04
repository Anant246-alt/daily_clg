import express from "express";
import { getProducts, getProductById, getProductsByCategory } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/category/:slug", getProductsByCategory);

export default router;
