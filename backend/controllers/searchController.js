import { Product } from "../models/Product.js";

export const searchProducts = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) {
      return res.status(200).json([]);
    }

    let results = [];
    try {
      const regex = new RegExp(q, "i");
      results = await Product.find({
        $or: [{ name: regex }, { category: regex }, { description: regex }],
      }).select("-__v");
    } catch (dbErr) {
      console.warn(`[Search] DB query failed for '${q}'.`);
    }

    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};
