export const validatePagination = (req, res, next) => {
  const pageRaw = req.query.page;
  const limitRaw = req.query.limit;

  let page = 1;
  let limit = 20;

  if (pageRaw !== undefined) {
    page = parseInt(pageRaw, 10);
    if (isNaN(page) || page < 1) {
      return res.status(422).json({
        error: {
          code: "UNPROCESSABLE_ENTITY",
          message: "Validation failed",
          details: [{ field: "page", issue: "Page parameter must be a positive integer >= 1" }],
        },
      });
    }
  }

  if (limitRaw !== undefined) {
    limit = parseInt(limitRaw, 10);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return res.status(422).json({
        error: {
          code: "UNPROCESSABLE_ENTITY",
          message: "Validation failed",
          details: [{ field: "limit", issue: "Limit parameter must be an integer between 1 and 100" }],
        },
      });
    }
  }

  req.pagination = { page, limit };
  return next();
};

export const validateUserUpdateBody = (req, res, next) => {
  const allowedFields = ["role", "status"];
  const bodyKeys = Object.keys(req.body || {});

  const unknownFields = bodyKeys.filter((k) => !allowedFields.includes(k));
  if (unknownFields.length > 0) {
    return res.status(422).json({
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: "Validation failed",
        details: unknownFields.map((f) => ({ field: f, issue: "Unknown field not allowed in user update" })),
      },
    });
  }

  const { role, status } = req.body;
  const errors = [];

  if (role !== undefined && !["user", "admin", "superadmin"].includes(role)) {
    errors.push({ field: "role", issue: "Role must be one of: user, admin, superadmin" });
  }

  if (status !== undefined && !["active", "blocked", "disabled"].includes(status)) {
    errors.push({ field: "status", issue: "Status must be one of: active, blocked, disabled" });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: "Validation failed",
        details: errors,
      },
    });
  }

  return next();
};

export const validateOrderStatusUpdateBody = (req, res, next) => {
  const allowedFields = ["status", "paymentStatus"];
  const bodyKeys = Object.keys(req.body || {});

  const unknownFields = bodyKeys.filter((k) => !allowedFields.includes(k));
  if (unknownFields.length > 0) {
    return res.status(422).json({
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: "Validation failed",
        details: unknownFields.map((f) => ({ field: f, issue: "Unknown field not allowed in order status update" })),
      },
    });
  }

  const { status, paymentStatus } = req.body;
  const errors = [];

  const validStatuses = ["Preparing", "On the way", "Out for Delivery", "Delivered", "Cancelled"];
  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push({ field: "status", issue: `Status must be one of: ${validStatuses.join(", ")}` });
  }

  const validPaymentStatuses = ["Paid", "Pending", "Failed"];
  if (paymentStatus !== undefined && !validPaymentStatuses.includes(paymentStatus)) {
    errors.push({ field: "paymentStatus", issue: `Payment status must be one of: ${validPaymentStatuses.join(", ")}` });
  }

  if (errors.length > 0) {
    return res.status(422).json({
      error: {
        code: "UNPROCESSABLE_ENTITY",
        message: "Validation failed",
        details: errors,
      },
    });
  }

  return next();
};

export const validateProductBody = (isUpdate = false) => {
  return (req, res, next) => {
    const allowedFields = [
      "name",
      "category",
      "price",
      "mrp",
      "description",
      "image",
      "gallery",
      "veg",
      "bestSeller",
      "popular",
      "rating",
      "reviews",
      "ingredients",
      "nutrition",
      "status",
    ];

    const bodyKeys = Object.keys(req.body || {});
    const unknownFields = bodyKeys.filter((k) => !allowedFields.includes(k));

    if (unknownFields.length > 0) {
      return res.status(422).json({
        error: {
          code: "UNPROCESSABLE_ENTITY",
          message: "Validation failed",
          details: unknownFields.map((f) => ({ field: f, issue: "Unknown parameter field not allowed" })),
        },
      });
    }

    const { name, category, price } = req.body;
    const errors = [];

    if (!isUpdate && !name) errors.push({ field: "name", issue: "Product name is required" });
    if (!isUpdate && !category) errors.push({ field: "category", issue: "Product category is required" });
    if (!isUpdate && (price === undefined || price === null)) errors.push({ field: "price", issue: "Product price is required" });

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      errors.push({ field: "price", issue: "Price must be a non-negative number" });
    }

    if (errors.length > 0) {
      return res.status(422).json({
        error: {
          code: "UNPROCESSABLE_ENTITY",
          message: "Validation failed",
          details: errors,
        },
      });
    }

    return next();
  };
};
