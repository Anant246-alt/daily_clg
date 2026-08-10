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
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB Atlas] Connected to cloud database: ${conn.connection.host}`);
    if (process.env.SEED_DB === "true") {
      await seedDatabase();
    }
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to cloud database: ${error.message}`);
  }
};
