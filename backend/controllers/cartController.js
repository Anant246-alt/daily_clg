import { Cart } from "../models/Cart.js";

const PROMOS = { DAILY50: 0.5, SAVE100: 0.2, UPI20: 0.2, FREEDEL: 0.05 };

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let cart = null;
    try {
      cart = await Cart.findOne({ user: userId });
    } catch (err) {
      console.warn("[Cart] DB find failed");
    }

    if (!cart) {
      return res.status(200).json({ items: [], promo: null });
    }
    return res.status(200).json({ items: cart.items, promo: cart.promo });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id, name, image, price, mrp, veg, qty = 1 } = req.body;

    if (!id || !name || price === undefined) {
      return res.status(400).json({ success: false, message: "Invalid product data" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], promo: null });
    }

    const existingIndex = cart.items.findIndex((item) => item.id === id);
    if (existingIndex > -1) {
      cart.items[existingIndex].qty += qty;
    } else {
      cart.items.push({ id, name, image, price, mrp, veg: !!veg, qty });
    }

    await cart.save();
    return res.status(200).json({ success: true, cart: { items: cart.items, promo: cart.promo } });
  } catch (error) {
    next(error);
  }
};

export const updateCartItemQty = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id, qty } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    if (qty <= 0) {
      cart.items = cart.items.filter((item) => item.id !== id);
    } else {
      const item = cart.items.find((i) => i.id === id);
      if (item) item.qty = qty;
    }

    await cart.save();
    return res.status(200).json({ success: true, cart: { items: cart.items, promo: cart.promo } });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = cart.items.filter((item) => item.id !== id);
      await cart.save();
    }
    return res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.promo = null;
      await cart.save();
    }
    return res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
};

export const applyPromo = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { code } = req.body;
    const key = (code || "").trim().toUpperCase();

    if (!PROMOS[key]) {
      return res.status(400).json({ success: false, message: "Invalid promo code" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.promo = key;
      await cart.save();
    }
    return res.status(200).json({ success: true, promo: key, discountRate: PROMOS[key] });
  } catch (error) {
    next(error);
  }
};
