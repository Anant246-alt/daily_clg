import { Wishlist } from "../models/Wishlist.js";

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(200).json({ products: ["p4", "p1"] });
    }
    return res.status(200).json({ products: wishlist.products });
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: ["p4", "p1"] });
    }

    const index = wishlist.products.indexOf(productId);
    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    return res.status(200).json({ success: true, products: wishlist.products });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ user: userId });
    if (wishlist) {
      wishlist.products = wishlist.products.filter((id) => id !== productId);
      await wishlist.save();
    }
    return res.status(200).json({ success: true, products: wishlist ? wishlist.products : [] });
  } catch (error) {
    next(error);
  }
};
