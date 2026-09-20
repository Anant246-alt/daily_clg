import mongoose from "mongoose";
import { seedDatabase } from "../utils/seeder.js";

const DEFAULT_MONGODB_URI = "mongodb+srv://anantbhattd_db_user:k4g0O5CMdutmAOSd@cluster0.yn4b6d6.mongodb.net/feast_forward?retryWrites=true&w=majority";

let lastFailAt = 0;
const FAIL_COOLDOWN_MS = 30_000;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve, reject) => {
      const onConnected = () => {
        mongoose.connection.off("error", onError);
        resolve();
      };
      const onError = (err) => {
        mongoose.connection.off("connected", onConnected);
        reject(err);
      };
      mongoose.connection.once("connected", onConnected);
      mongoose.connection.once("error", onError);
    });
    return;
  }

  if (Date.now() - lastFailAt < FAIL_COOLDOWN_MS) {
    return;
  }

  const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      bufferCommands: false,
    });
    lastFailAt = 0;
    console.log(`[MongoDB Atlas] Connected to cloud database: ${conn.connection.host}`);
    if (process.env.SEED_DB === "true") {
      await seedDatabase();
    }
  } catch (error) {
    lastFailAt = Date.now();
    console.warn(`[Database Warning] Atlas Connection failed: ${error.message}`);
  }
};
