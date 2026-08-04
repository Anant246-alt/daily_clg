import { Category } from "../models/Category.js";

const fallbackCategories = [
  { id: "c1", name: "Salads", slug: "salads", emoji: "🥗", items: 18 },
  { id: "c2", name: "Sandwiches", slug: "sandwiches", emoji: "🥪", items: 24 },
  { id: "c3", name: "Iced Tea", slug: "iced-tea", emoji: "🧋", items: 12 },
  { id: "c4", name: "Footlong", slug: "footlong", emoji: "🌭", items: 9 },
  { id: "c5", name: "Yogurt Bowl", slug: "yogurt-bowl", emoji: "🍨", items: 11 },
  { id: "c6", name: "Combos", slug: "combos", emoji: "🍱", items: 15 },
  { id: "c7", name: "Protein Meals", slug: "protein-meals", emoji: "🍗", items: 14 },
  { id: "c8", name: "Breakfast", slug: "breakfast", emoji: "🥐", items: 16 },
  { id: "c9", name: "Healthy Snacks", slug: "healthy-snacks", emoji: "🥜", items: 20 },
];

export const getCategories = async (req, res, next) => {
  try {
    let categories = [];
    try {
      categories = await Category.find().select("-__v");
    } catch (err) {
      console.warn("[Categories] DB fetch failed, using fallback.");
    }
    if (!categories || categories.length === 0) {
      categories = fallbackCategories;
    }
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
