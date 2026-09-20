import { User } from "../../../models/User.js";
import { Order } from "../../../models/Order.js";
import { Product } from "../../../models/Product.js";
import { connectDB } from "../../../config/db.js";
import { readCollection } from "../../../config/fileDb.js";

export const getOverviewMetricsService = async () => {
  await connectDB();

  let totalOrders = 0;
  let totalRevenue = 0;
  let pendingOrders = 0;
  let deliveredOrders = 0;
  let totalUsers = 0;
  let activeProducts = 0;

  try {
    const orders = await Order.find({}).lean();
    totalOrders = orders.length;

    orders.forEach((o) => {
      const val = Number(o.total) || 0;
      if (o.paymentStatus === "Paid" || o.status === "Delivered") {
        totalRevenue += val;
      }
      if (o.status === "Preparing" || o.status === "Out for Delivery" || o.status === "On the way") {
        pendingOrders += 1;
      }
      if (o.status === "Delivered") {
        deliveredOrders += 1;
      }
    });

    totalUsers = await User.countDocuments({});
    activeProducts = await Product.countDocuments({});
  } catch {
    // Fallback disk reads if DB connection notice
    const diskOrders = readCollection("orders", []);
    const diskUsers = readCollection("users", []);
    const diskProducts = readCollection("products", []);

    totalOrders = diskOrders.length;
    diskOrders.forEach((o) => {
      const val = Number(o.total) || 0;
      totalRevenue += val;
      if (o.status === "Preparing" || o.status === "Out for Delivery") pendingOrders += 1;
      if (o.status === "Delivered") deliveredOrders += 1;
    });
    totalUsers = diskUsers.length;
    activeProducts = diskProducts.length;
  }

  return {
    totalRevenue: Math.round(totalRevenue),
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalUsers,
    activeProducts,
    currency: "INR",
  };
};

export const listUsersService = async ({ page = 1, limit = 20, role, status, search }) => {
  await connectDB();

  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
  }

  try {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(query),
    ]);
    return { users, total };
  } catch {
    const diskUsers = readCollection("users", []);
    let filtered = diskUsers;
    if (role) filtered = filtered.filter((u) => u.role === role);
    if (status) filtered = filtered.filter((u) => u.status === status);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.phone?.includes(s)
      );
    }
    const skip = (page - 1) * limit;
    const users = filtered.slice(skip, skip + limit);
    return { users, total: filtered.length };
  }
};

export const getUserByIdService = async (userId) => {
  await connectDB();

  let user = null;
  try {
    user = await User.findById(userId).lean();
    if (!user) {
      user = await User.findOne({ id: userId }).lean();
    }
  } catch {
    /* fallback disk */
  }

  if (!user) {
    const diskUsers = readCollection("users", []);
    user = diskUsers.find((u) => String(u._id || u.id) === String(userId)) || null;
  }

  if (!user) return null;

  // Compute user order history summary N+1 safe
  let userOrders = [];
  try {
    userOrders = await Order.find({
      $or: [{ user: user._id }, { userEmail: user.email }, { userPhone: user.phone }],
    })
      .sort({ createdAt: -1 })
      .lean();
  } catch {
    const diskOrders = readCollection("orders", []);
    userOrders = diskOrders.filter((o) => o.userEmail === user.email || o.user === String(user._id));
  }

  return {
    ...user,
    orderSummary: {
      totalOrders: userOrders.length,
      totalSpent: userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0),
      recentOrders: userOrders.slice(0, 5),
    },
  };
};

export const updateUserService = async (userId, updateData) => {
  await connectDB();

  let updatedUser = null;
  try {
    updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true }).lean();
    if (!updatedUser) {
      updatedUser = await User.findOneAndUpdate({ id: userId }, { $set: updateData }, { new: true }).lean();
    }
  } catch {
    /* ignore */
  }

  return updatedUser;
};

export const softDeleteUserService = async (userId) => {
  return updateUserService(userId, { status: "disabled" });
};

export const listOrdersService = async ({ page = 1, limit = 20, status, paymentStatus, search }) => {
  await connectDB();

  const query = {};
  if (status && status !== "all") query.status = status;
  if (paymentStatus && paymentStatus !== "all") query.paymentStatus = paymentStatus;
  if (search) {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [
      { number: searchRegex },
      { id: searchRegex },
      { userName: searchRegex },
      { userEmail: searchRegex },
      { userPhone: searchRegex },
    ];
  }

  try {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query).populate("user", "name email phone").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(query),
    ]);
    return { orders, total };
  } catch {
    const diskOrders = readCollection("orders", []);
    let filtered = diskOrders;
    if (status && status !== "all") filtered = filtered.filter((o) => o.status === status);
    if (paymentStatus && paymentStatus !== "all") filtered = filtered.filter((o) => o.paymentStatus === paymentStatus);
    const skip = (page - 1) * limit;
    return { orders: filtered.slice(skip, skip + limit), total: filtered.length };
  }
};

export const getOrderByIdService = async (orderId) => {
  await connectDB();

  let order = null;
  try {
    const isObjectId = Boolean(orderId.match(/^[0-9a-fA-F]{24}$/));
    const query = [
      { id: orderId },
      { number: orderId },
      { number: `#${orderId}` },
      { number: orderId.startsWith("#") ? orderId : `#DLY-${orderId.replace(/^DLY-?/i, "")}` },
    ];
    if (isObjectId) query.push({ _id: orderId });

    order = await Order.findOne({ $or: query }).populate("user", "name email phone").lean();
  } catch {
    /* ignore */
  }

  if (!order) {
    const diskOrders = readCollection("orders", []);
    order = diskOrders.find((o) => o.id === orderId || o.number === orderId || o.number === `#${orderId}`) || null;
  }

  return order;
};

export const updateOrderStatusService = async (orderId, { status, paymentStatus }) => {
  await connectDB();

  const updateFields = {};
  if (status) updateFields.status = status;
  if (paymentStatus) updateFields.paymentStatus = paymentStatus;

  let order = await getOrderByIdService(orderId);
  if (!order) return null;

  const currentHistory = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  if (status && status !== order.status) {
    currentHistory.push({
      previousStatus: order.status,
      newStatus: status,
      timestamp: new Date(),
      formattedTime: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      actor: "admin",
    });
    updateFields.statusHistory = currentHistory;
  }

  try {
    const updated = await Order.findByIdAndUpdate(order._id || order.id, { $set: updateFields }, { new: true })
      .populate("user", "name email phone")
      .lean();
    return updated;
  } catch {
    return { ...order, ...updateFields };
  }
};

export const listProductsService = async ({ page = 1, limit = 20, category, search }) => {
  await connectDB();

  const query = {};
  if (category && category !== "all") query.category = category;
  if (search) {
    const searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    query.$or = [{ name: searchRegex }, { description: searchRegex }];
  }

  try {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);
    return { products, total };
  } catch {
    const diskProducts = readCollection("products", []);
    let filtered = diskProducts;
    if (category && category !== "all") filtered = filtered.filter((p) => p.category === category);
    const skip = (page - 1) * limit;
    return { products: filtered.slice(skip, skip + limit), total: filtered.length };
  }
};

export const createProductService = async (productData) => {
  await connectDB();
  const newProduct = new Product({
    id: `p_${Date.now()}`,
    ...productData,
    status: productData.status || "active",
  });
  await newProduct.save();
  return newProduct.toObject();
};

export const updateProductService = async (productId, updateData) => {
  await connectDB();

  let updated = null;
  try {
    updated = await Product.findByIdAndUpdate(productId, { $set: updateData }, { new: true }).lean();
    if (!updated) {
      updated = await Product.findOneAndUpdate({ id: productId }, { $set: updateData }, { new: true }).lean();
    }
  } catch {
    /* ignore */
  }

  return updated;
};

export const softDeleteProductService = async (productId) => {
  return updateProductService(productId, { status: "inactive" });
};
