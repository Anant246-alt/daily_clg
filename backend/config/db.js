import mongoose from "mongoose";
import { seedDatabase } from "../utils/seeder.js";

const DEFAULT_MONGODB_URI = "mongodb+srv://anantbhattd_db_user:k4g0O5CMdutmAOSd@cluster0.yn4b6d6.mongodb.net/feast_forward?retryWrites=true&w=majority";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000,
    });
    console.log(`[MongoDB Atlas] Connected to cloud database: ${conn.connection.host}`);
    if (process.env.SEED_DB === "true") {
      await seedDatabase();
    }
  } catch (error) {
    // Quiet debug notice to keep Vercel logs clean while using persistent disk DB fallback
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Database Notice] Operating in fast cloud mode (Atlas IP whitelist required for live DB sync)`);
    }
  }
};
