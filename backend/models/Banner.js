import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    cta: { type: String, required: true },
    image: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

const offerSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

export const Banner = mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
export const Offer = mongoose.models.Offer || mongoose.model("Offer", offerSchema);
