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
import { seedDatabase } from "./backend/utils/seeder.js";

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true); // Allow for local dev flexibility
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate Limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Too many requests from this IP, please try again later." },
});
app.use("/api/auth/send-otp", authLimiter);
app.use("/api/auth/verify-otp", authLimiter);

// Root API Info Page
app.get("/api", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Daily Food Delivery - Backend API Server</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
          .card { max-width: 550px; background: #1e293b; border-radius: 24px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); border: 1px solid #334155; text-align: center; }
          .badge { background: #16a34a; color: white; padding: 4px 14px; border-radius: 20px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; margin-bottom: 16px; }
          h1 { margin: 0 0 10px 0; font-size: 26px; }
          p { color: #94a3b8; font-size: 15px; margin-bottom: 28px; line-height: 1.5; }
          .btn-group { display: flex; flex-direction: column; gap: 12px; }
          .btn { background: #3b82f6; color: white; text-decoration: none; padding: 14px 20px; border-radius: 14px; font-weight: 700; font-size: 15px; transition: all 0.2s; }
          .btn:hover { background: #2563eb; }
          .btn-secondary { background: #334155; color: #f8fafc; }
          .btn-secondary:hover { background: #475569; }
          .footer { font-size: 12px; color: #64748b; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">API Server Running</span>
          <h1>Daily Food Delivery Backend</h1>
          <p>Express REST API server is active on port 5000. Use the quick links below to access API documentation or open the React frontend application.</p>
          <div class="btn-group">
            <a href="http://localhost:5173" target="_blank" class="btn">🚀 Open Frontend App (http://localhost:5173)</a>
            <a href="/api-docs" class="btn btn-secondary">📖 Open Swagger API Docs (/api-docs)</a>
            <a href="/api/health" class="btn btn-secondary">🟢 API Health Check (/api/health)</a>
          </div>
          <div class="footer">Node.js • Express.js • MongoDB Atlas • JWT • Nodemailer • Razorpay</div>
        </div>
      </body>
    </html>
  `);
});

// API Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Swagger Documentation
try {
  const swaggerPath = path.join(process.cwd(), "swagger.json");
  if (fs.existsSync(swaggerPath)) {
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
} catch (err) {
  console.warn("[Swagger Notice] Could not load swagger.json file:", err.message);
}

// Mount REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/support", supportRoutes);

// Ensure DB connection on incoming requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn("[DB Connection Warning]:", err.message);
  }
  next();
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`[Express Backend] Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
      console.log(`[Swagger UI] Documentation available at http://localhost:${PORT}/api-docs`);
    });
  });
}

export default app;
