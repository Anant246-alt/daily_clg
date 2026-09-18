import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Notification } from "../models/Notification.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getOrderConfirmationTemplate } from "../utils/emailTemplates.js";
import { readCollection, insertDocument } from "../config/fileDb.js";

const fallbackOrders = [];

export const getOrders = async (req, res, next) => {
  try {
    const userId = String(req.user._id || req.user.id || "").toLowerCase();
    const userEmail = String(req.user.email || "").toLowerCase();
    const userPhone = String(req.user.phone || "").replace(/\D/g, "");

    let dbOrders = [];
    try {
      dbOrders = await Order.find({
        $or: [
          { user: userId },
          { userEmail: userEmail },
          { user: userEmail },
          { userPhone: userPhone },
        ],
      })
        .sort({ createdAt: -1 })
        .select("-__v");
    } catch (err) {
      console.warn("[Orders] DB fetch failed");
    }

    const diskOrders = readCollection("orders", fallbackOrders);
    const matchedDiskOrders = diskOrders.filter((o) => {
      const oUser = String(o.user || "").toLowerCase();
      const oEmail = String(o.userEmail || o.email || "").toLowerCase();
      const oPhone = String(o.userPhone || o.phone || "").replace(/\D/g, "");

      return (
        (userId && (oUser === userId || oUser.includes(userId))) ||
        (userEmail && (oUser === userEmail || oEmail === userEmail)) ||
        (userPhone && userPhone.length >= 10 && (oUser === userPhone || oPhone === userPhone))
      );
    });

    const combinedMap = new Map();
    [...dbOrders, ...matchedDiskOrders].forEach((o) => {
      const key = o.id || o.number;
      if (key && !combinedMap.has(key)) {
        combinedMap.set(key, o);
      }
    });

    let finalOrders = Array.from(combinedMap.values());
    if (finalOrders.length === 0) {
      finalOrders = diskOrders.length > 0 ? diskOrders : fallbackOrders;
    }
    return res.status(200).json(finalOrders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let order = null;
    try {
      order = await Order.findOne({ id }).select("-__v");
    } catch (err) {
      console.warn(`[Order] DB fetch for ${id} failed`);
    }

    if (!order) {
      const diskOrders = readCollection("orders", fallbackOrders);
      order = diskOrders.find((o) => o.id === id || o.number === id) || null;
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email || "dailyclgproject@gmail.com";
    const userPhone = req.user.phone || "";
    const {
      total,
      paymentMethod,
      address,
      items,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = req.body;

    const orderNum = `#DLY-${Math.floor(1002 + Math.random() * 9000)}`;
    const orderId = `o_${Date.now()}`;
    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const nowTimeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newOrderData = {
      user: userId,
      userEmail,
      userPhone,
      id: orderId,
      number: orderNum,
      date: dateStr,
      status: "Preparing",
      total: total || 500,
      paymentMethod: paymentMethod || "Razorpay Online",
      address: address || "Flat 402, Green Meadows, Koramangala, Bengaluru 560034",
      items: items || [
        { id: "p4", name: "Paneer Tikka Footlong", qty: 1, price: 349 },
        { id: "p3", name: "Peach Mint Iced Tea", qty: 1, price: 129 },
      ],
      timeline: [
        { label: "Order placed", time: nowTimeStr, done: true },
        { label: "Restaurant confirmed", time: nowTimeStr, done: true },
        { label: "Preparing your food", time: nowTimeStr, done: true },
        { label: "Out for delivery", time: "—", done: false },
        { label: "Delivered", time: "—", done: false },
      ],
      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || "",
      razorpaySignature: razorpaySignature || "",
    };

    let createdOrder = newOrderData;
    try {
      createdOrder = await Order.create(newOrderData);
    } catch (dbErr) {
      console.warn(`[Order Warning] DB write failed: ${dbErr.message}`);
    }

    // Save to persistent file storage
    insertDocument("orders", newOrderData);

    // 1. Empty Cart
    try {
      await Cart.findOneAndUpdate({ user: userId }, { items: [], promo: null });
    } catch (cartErr) {
      console.warn("[Cart] Clear on order placement skipped");
    }

    // 2. Create Notification
    const notif = {
      id: `n_${Date.now()}`,
      user: userId,
      type: "Order Updates",
      title: `Your order ${orderNum} is being prepared`,
      body: "The kitchen has started preparing your order.",
      time: "Just now",
      unread: true,
    };
    try {
      await Notification.create(notif);
    } catch (notifErr) {
      console.warn("[Notification] Creation on order placement skipped");
    }
    insertDocument("notifications", notif);

    // 3. Send Order Confirmation Email via Nodemailer
    if (req.user && req.user.email) {
      const emailHtml = getOrderConfirmationTemplate(newOrderData);
      await sendEmail({
        to: req.user.email,
        subject: `Order Confirmation - ${orderNum} (Daily)`,
        html: emailHtml,
      });
    }

    return res.status(201).json({
      success: true,
      orderNumber: orderNum,
      orderId,
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const repeatOrder = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    let targetOrder = await Order.findOne({ id });
    if (!targetOrder) {
      const diskOrders = readCollection("orders", fallbackOrders);
      targetOrder = diskOrders.find((o) => o.id === id);
    }

    if (targetOrder && targetOrder.items) {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) cart = new Cart({ user: userId, items: [] });

      targetOrder.items.forEach((item) => {
        const found = cart.items.find((i) => i.id === item.id);
        if (found) found.qty += item.qty;
        else
          cart.items.push({
            id: item.id,
            name: item.name,
            image: "/assets/salad.jpg",
            price: item.price,
            mrp: item.price + 50,
            veg: true,
            qty: item.qty,
          });
      });

      try {
        await cart.save();
      } catch (err) {
        console.warn("[Repeat Order] Cart DB save skipped");
      }
    }

    return res.status(200).json({ success: true, message: "Items added to cart", id });
  } catch (error) {
    next(error);
  }
};
