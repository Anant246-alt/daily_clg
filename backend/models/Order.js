import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
});

const timelineSchema = new mongoose.Schema({
  label: { type: String, required: true },
  time: { type: String, required: true },
  done: { type: Boolean, default: false },
});

const statusAuditSchema = new mongoose.Schema({
  previousStatus: { type: String, default: "" },
  newStatus: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  formattedTime: { type: String, default: "" },
  actor: { type: String, default: "system" },
  notes: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },
    userPhone: { type: String, default: "" },
    id: { type: String, required: true },
    number: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ["Preparing", "On the way", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Preparing",
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Failed"],
      default: "Paid",
    },
    isConfirmed: { type: Boolean, default: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    address: { type: String, required: true },
    items: [orderItemSchema],
    timeline: [timelineSchema],
    statusHistory: [statusAuditSchema],
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
