import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, default: "Daily Foodie" },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    status: { type: String, enum: ["active", "blocked"], default: "active" },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);

