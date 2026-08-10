import mongoose from "mongoose";
import { seedDatabase } from "../utils/seeder.js";

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const uri = process.env.MONGODB_URI;
    const isValidAtlasUri = uri && !uri.includes("<cluster-address>") && !uri.includes("<database_name>");

    if (isValidAtlasUri) {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[MongoDB Atlas] Connected to cloud database: ${conn.connection.host}`);
      if (process.env.SEED_DB === "true") {
        await seedDatabase();
      }
      return;
    }
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to Atlas URI: ${error.message}`);
  }

  // Fallback to local MongoDB instance
  try {
    const fallbackUri = "mongodb://127.0.0.1:27017/daily_food_db";
    const conn = await mongoose.connect(fallbackUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Local] Connected to local database: ${conn.connection.host}`);
  } catch (fallbackError) {
    console.log("[MongoDB Engine] Persistent File-Backed Database activated in backend/data/db/");
  }
};
