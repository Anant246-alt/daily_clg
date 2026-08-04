import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String, enum: ["Promotions", "Order Updates", "Offers"], required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    time: { type: String, required: true },
    unread: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
