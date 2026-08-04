import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    products: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export const Wishlist = mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
