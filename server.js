import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./backend/config/db.js";
import { notFound, errorHandler } from "./backend/middleware/errorMiddleware.js";

import authRoutes from "./backend/routes/authRoutes.js";
import productRoutes from "./backend/routes/productRoutes.js";
import categoryRoutes from "./backend/routes/categoryRoutes.js";
import bannerRoutes from "./backend/routes/bannerRoutes.js";
import searchRoutes from "./backend/routes/searchRoutes.js";
import cartRoutes from "./backend/routes/cartRoutes.js";
import wishlistRoutes from "./backend/routes/wishlistRoutes.js";
import addressRoutes from "./backend/routes/addressRoutes.js";
import paymentRoutes from "./backend/routes/paymentRoutes.js";
import orderRoutes from "./backend/routes/orderRoutes.js";
import notificationRoutes from "./backend/routes/notificationRoutes.js";
import reviewRoutes from "./backend/routes/reviewRoutes.js";
import profileRoutes from "./backend/routes/profileRoutes.js";
import supportRoutes from "./backend/routes/supportRoutes.js";

dotenv.config();

let __dirname = process.cwd();
try {
  if (import.meta && import.meta.url) {
    const __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
  }
} catch (err) {
  __dirname = process.cwd();
}

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:8080",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // Allow all origins for API endpoints
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Ensure DB connection on incoming requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("[DB Connection Warning]:", err.message);
  }
  next();
});

// Root API Info Page
app.get(["/api", "/"], (req, res, next) => {
  if (req.url === "/") return next();
  res.json({ status: "ok", message: "Daily Food Delivery API active" });
});

// API Health Check
app.get(["/api/health", "/health"], (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Mount REST API Routes (both /api/xxx and /xxx to handle Vercel rewrite paths)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/products", productRoutes);
app.use("/products", productRoutes);

app.use("/api/categories", categoryRoutes);
app.use("/categories", categoryRoutes);

app.use("/api/banners", bannerRoutes);
app.use("/banners", bannerRoutes);

app.use("/api/search", searchRoutes);
app.use("/search", searchRoutes);

app.use("/api/cart", cartRoutes);
app.use("/cart", cartRoutes);

app.use("/api/wishlist", wishlistRoutes);
app.use("/wishlist", wishlistRoutes);

app.use("/api/addresses", addressRoutes);
app.use("/addresses", addressRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/payment", paymentRoutes);

app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/notifications", notificationRoutes);

app.use("/api/reviews", reviewRoutes);
app.use("/reviews", reviewRoutes);

app.use("/api/profile", profileRoutes);
app.use("/profile", profileRoutes);

app.use("/api/support", supportRoutes);
app.use("/support", supportRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Express Backend] Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
  });
  connectDB();
}

export default app;
