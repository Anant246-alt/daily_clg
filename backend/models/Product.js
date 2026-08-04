import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
});

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    veg: { type: Boolean, default: true },
    bestSeller: { type: Boolean, default: false },
    popular: { type: Boolean, default: false },
    description: { type: String, required: true },
    ingredients: [{ type: String }],
    nutrition: [nutritionSchema],
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
