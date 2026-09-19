import express from "express";
import { getProducts, getProductById, getProductsByCategory, updateProductsList } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", updateProductsList);
router.put("/", updateProductsList);
router.get("/:id", getProductById);
router.get("/category/:slug", getProductsByCategory);

export default router;
