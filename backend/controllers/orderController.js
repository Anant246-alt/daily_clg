import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Notification } from "../models/Notification.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getOrderConfirmationTemplate } from "../utils/emailTemplates.js";
import { readCollection, insertDocument } from "../config/fileDb.js";

const fallbackOrders = [
  {
    id: "o1001",
    number: "#DLY-1001",
    date: "31 Jul 2026, 12:40 PM",
    status: "Preparing",
    total: 678,
    paymentMethod: "UPI · yourname@upi",
    address: "Flat 402, Green Meadows, Koramangala, Bengaluru 560034",
    items: [
      { id: "p4", name: "Paneer Tikka Footlong", qty: 1, price: 349 },
      { id: "p3", name: "Peach Mint Iced Tea", qty: 2, price: 129 },
    ],
    timeline: [
      { label: "Order placed", time: "12:40 PM", done: true },
      { label: "Restaurant confirmed", time: "12:42 PM", done: true },
      { label: "Preparing your food", time: "12:47 PM", done: true },
      { label: "Out for delivery", time: "—", done: false },
      { label: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o1000",
    number: "#DLY-1000",
    date: "28 Jul 2026, 8:05 PM",
    status: "Delivered",
    total: 538,
    paymentMethod: "Card · **** 4291",
    address: "Flat 402, Green Meadows, Koramangala, Bengaluru 560034",
    items: [
      { id: "p2", name: "Grilled Chicken Sandwich", qty: 1, price: 289 },
      { id: "p1", name: "Avocado Garden Salad", qty: 1, price: 249 },
    ],
    timeline: [
      { label: "Order placed", time: "8:05 PM", done: true },
      { label: "Restaurant confirmed", time: "8:07 PM", done: true },
      { label: "Preparing your food", time: "8:12 PM", done: true },
      { label: "Out for delivery", time: "8:26 PM", done: true },
      { label: "Delivered", time: "8:41 PM", done: true },
    ],
  },
];

export const getOrders = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let orders = [];
    try {
      orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).select("-__v");
    } catch (err) {
      console.warn("[Orders] DB fetch failed");
    }

    if (!orders || orders.length === 0) {
      const diskOrders = readCollection("orders", fallbackOrders);
      orders = diskOrders.filter((o) => !o.user || o.user === userId || o.user === req.user.id);
      if (orders.length === 0) orders = diskOrders;
    }
    return res.status(200).json(orders);
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
