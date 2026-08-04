import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    label: { type: String, enum: ["Home", "Office", "Other"], required: true },
    name: { type: String, required: true },
    line: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);
