export const serializeUserDTO = (user) => {
  if (!user) return null;
  const obj = user.toObject ? user.toObject() : user;
  const { password, token, __v, ...cleanUser } = obj;

  return {
    id: cleanUser._id ? String(cleanUser._id) : cleanUser.id || "u_unknown",
    name: cleanUser.name || "Customer",
    email: cleanUser.email || "",
    phone: cleanUser.phone || "",
    role: cleanUser.role || "user",
    status: cleanUser.status || "active",
    avatar: cleanUser.avatar || undefined,
    createdAt: cleanUser.createdAt || undefined,
    updatedAt: cleanUser.updatedAt || undefined,
  };
};

export const serializeOrderDTO = (order) => {
  if (!order) return null;
  const obj = order.toObject ? order.toObject() : order;
  const { __v, ...cleanOrder } = obj;

  return {
    id: cleanOrder._id ? String(cleanOrder._id) : cleanOrder.id || "o_unknown",
    number: cleanOrder.number || `#DLY-${cleanOrder.id || "1001"}`,
    date: cleanOrder.date || (cleanOrder.createdAt ? new Date(cleanOrder.createdAt).toLocaleString("en-IN") : ""),
    status: cleanOrder.status || "Preparing",
    paymentStatus: cleanOrder.paymentStatus || "Paid",
    total: cleanOrder.total || 0,
    paymentMethod: cleanOrder.paymentMethod || "Online",
    address: cleanOrder.address || "",
    user: cleanOrder.user ? (typeof cleanOrder.user === "object" ? serializeUserDTO(cleanOrder.user) : cleanOrder.user) : undefined,
    userName: cleanOrder.userName || (typeof cleanOrder.user === "object" ? cleanOrder.user?.name : undefined),
    userEmail: cleanOrder.userEmail || (typeof cleanOrder.user === "object" ? cleanOrder.user?.email : undefined),
    userPhone: cleanOrder.userPhone || (typeof cleanOrder.user === "object" ? cleanOrder.user?.phone : undefined),
    items: Array.isArray(cleanOrder.items)
      ? cleanOrder.items.map((i) => ({
          id: i.id || i._id || "item",
          name: i.name || "Item",
          qty: i.qty || i.quantity || 1,
          price: i.price || 0,
        }))
      : [],
    timeline: Array.isArray(cleanOrder.timeline) ? cleanOrder.timeline : [],
    createdAt: cleanOrder.createdAt || undefined,
    updatedAt: cleanOrder.updatedAt || undefined,
  };
};

export const serializeProductDTO = (product) => {
  if (!product) return null;
  const obj = product.toObject ? product.toObject() : product;
  const { __v, ...cleanProduct } = obj;

  return {
    id: cleanProduct._id ? String(cleanProduct._id) : cleanProduct.id || "p_unknown",
    name: cleanProduct.name || "",
    category: cleanProduct.category || "sandwiches",
    price: cleanProduct.price || 0,
    mrp: cleanProduct.mrp || Math.round((cleanProduct.price || 0) * 1.25),
    description: cleanProduct.description || "",
    image: cleanProduct.image || "",
    gallery: cleanProduct.gallery || [],
    veg: cleanProduct.veg !== undefined ? cleanProduct.veg : true,
    bestSeller: cleanProduct.bestSeller || false,
    popular: cleanProduct.popular || false,
    rating: cleanProduct.rating || 4.5,
    reviews: cleanProduct.reviews || 0,
    ingredients: cleanProduct.ingredients || [],
    nutrition: cleanProduct.nutrition || [],
    status: cleanProduct.status || "active",
    createdAt: cleanProduct.createdAt || undefined,
    updatedAt: cleanProduct.updatedAt || undefined,
  };
};

export const formatPaginatedResponse = (items, total, page, limit) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const hasMore = page < totalPages;

  return {
    data: items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasMore,
    },
  };
};
