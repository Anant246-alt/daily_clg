import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Notification } from "../models/Notification.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getOrderConfirmationTemplate } from "../utils/emailTemplates.js";
import { readCollection, insertDocument, updateDocument } from "../config/fileDb.js";
import { connectDB } from "../config/db.js";

const fallbackOrders = [];

export const getOrders = async (req, res, next) => {
  try {
    await connectDB();
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
    return res.status(200).json(finalOrders);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;

    let order = null;
    try {
      const isObjectId = Boolean(id.match(/^[0-9a-fA-F]{24}$/));
      const queryConditions = [
        { id: id },
        { number: id },
        { number: `#${id}` },
        { number: id.startsWith("#") ? id : `#DLY-${id.replace(/^DLY-?/i, "")}` },
      ];
      if (isObjectId) queryConditions.push({ _id: id });

      order = await Order.findOne({ $or: queryConditions }).select("-__v");
    } catch (err) {
      console.warn(`[Order] DB fetch for ${id} failed:`, err.message);
    }

    if (!order) {
      const diskOrders = readCollection("orders", fallbackOrders);
      order =
        diskOrders.find(
          (o) =>
            o.id === id ||
            o.number === id ||
            o.number === `#${id}` ||
            o.id?.toLowerCase() === id.toLowerCase() ||
            o.number?.toLowerCase() === id.toLowerCase()
        ) || null;
    }

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getAllAdminOrders = async (req, res, next) => {
  try {
    await connectDB();
    let dbOrders = [];
    try {
      dbOrders = await Order.find({})
        .populate("user", "name email phone")
        .sort({ createdAt: -1 })
        .select("-__v");
    } catch (err) {
      console.warn("[Admin Orders] DB fetch failed:", err.message);
    }

    const diskOrders = readCollection("orders", fallbackOrders);

    const combinedMap = new Map();
    dbOrders.forEach((o) => {
      const obj = o.toObject ? o.toObject() : o;
      const key = obj.id || obj.number;
      if (key) {
        combinedMap.set(key, {
          ...obj,
          userName: obj.userName || obj.user?.name || "Registered Customer",
          userEmail: obj.userEmail || obj.user?.email || "",
          userPhone: obj.userPhone || obj.user?.phone || "",
          paymentStatus: obj.paymentStatus || "Paid",
          isConfirmed: obj.isConfirmed !== false,
        });
      }
    });

    diskOrders.forEach((o) => {
      const key = o.id || o.number;
      if (key && !combinedMap.has(key)) {
        combinedMap.set(key, {
          ...o,
          userName: o.userName || o.name || "Registered Customer",
          userEmail: o.userEmail || o.email || "",
          userPhone: o.userPhone || o.phone || "",
          paymentStatus: o.paymentStatus || "Paid",
          isConfirmed: o.isConfirmed !== false,
        });
      }
    });

    const finalOrders = Array.from(combinedMap.values()).filter(
      (o) =>
        !["#DLY-1001", "#DLY-1000", "#DLY-0999", "o1001", "o1000", "o999"].includes(o.number) &&
        !["#DLY-1001", "#DLY-1000", "#DLY-0999", "o1001", "o1000", "o999"].includes(o.id)
    );

    finalOrders.sort((a, b) => {
      const getTs = (item) => {
        if (item.createdAt) return new Date(item.createdAt).getTime();
        if (typeof item.id === "string" && item.id.startsWith("o_")) {
          const num = Number(item.id.replace("o_", ""));
          if (!isNaN(num)) return num;
        }
        if (item.date) {
          const parsed = new Date(item.date).getTime();
          if (!isNaN(parsed)) return parsed;
        }
        return 0;
      };
      return getTs(b) - getTs(a);
    });

    return res.status(200).json(finalOrders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { status, paymentStatus, notes } = req.body;

    let updatedOrder = null;

    try {
      const order = await Order.findOne({
        $or: [
          { id },
          { number: id },
          { _id: mongoose.Types.ObjectId.isValid(id) ? id : null },
        ],
      });

      if (order) {
        const previousStatus = order.status;
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        if (status && status !== previousStatus) {
          const now = new Date();
          const formattedTime = `${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}, ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
          order.statusHistory = order.statusHistory || [];
          order.statusHistory.push({
            previousStatus: previousStatus || "Order Placed",
            newStatus: status,
            timestamp: now,
            formattedTime,
            actor: req.user?.role === "admin" ? "admin" : "admin",
            notes: notes || `Order status updated from '${previousStatus || "Order Placed"}' to '${status}' by Admin`,
          });
        }

        if (order.timeline && Array.isArray(order.timeline)) {
          const nowTimeStr = new Date().toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          order.timeline = order.timeline.map((t) => {
            if (
              status === "Preparing" &&
              (t.label.includes("Preparing") ||
                t.label.includes("placed") ||
                t.label.includes("confirmed"))
            ) {
              return { label: t.label, time: t.time === "—" ? nowTimeStr : t.time, done: true };
            }
            if (
              (status === "On the way" || status === "Out for Delivery") &&
              (t.label.includes("Out for delivery") ||
                t.label.includes("Preparing") ||
                t.label.includes("placed") ||
                t.label.includes("confirmed"))
            ) {
              return { label: t.label, time: t.time === "—" ? nowTimeStr : t.time, done: true };
            }
            if (status === "Delivered") {
              return { label: t.label, time: t.time === "—" ? nowTimeStr : t.time, done: true };
            }
            return t;
          });
        }

        await order.save();
        updatedOrder = order.toObject();
      }
    } catch (err) {
      console.warn("[Admin Order Status Update Notice]:", err.message);
    }

    updateDocument("orders", "id", id, {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    });

    if (!updatedOrder) {
      const diskOrders = readCollection("orders", []);
      updatedOrder = diskOrders.find((o) => o.id === id || o.number === id) || null;
    }

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status || updatedOrder.status}`,
      order: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    await connectDB();
    const userId = req.user._id || req.user.id;
    const userName = req.user.name || req.body.userName || "Customer";
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
    const now = new Date();
    const dateStr = `${now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}, ${now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
    const nowTimeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });

    const isCod = (paymentMethod || "").toLowerCase().includes("cod") || (paymentMethod || "").toLowerCase().includes("cash");
    const pStatus = isCod ? "Pending" : "Paid";

    const initialAudit = {
      previousStatus: "",
      newStatus: "Preparing",
      timestamp: now,
      formattedTime: dateStr,
      actor: "customer",
      notes: "Order placed successfully by customer",
    };

    const newOrderData = {
      user: userId,
      userName,
      userEmail,
      userPhone,
      id: orderId,
      number: orderNum,
      date: dateStr,
      status: "Preparing",
      paymentStatus: pStatus,
      isConfirmed: true,
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
      statusHistory: [initialAudit],
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

    insertDocument("orders", newOrderData);

    try {
      await Cart.findOneAndUpdate({ user: userId }, { items: [], promo: null });
    } catch (cartErr) {
      console.warn("[Cart] Clear on order placement skipped");
    }

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

