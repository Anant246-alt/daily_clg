import {
  getOverviewMetricsService,
  listUsersService,
  getUserByIdService,
  updateUserService,
  softDeleteUserService,
  listOrdersService,
  getOrderByIdService,
  updateOrderStatusService,
  listProductsService,
  createProductService,
  updateProductService,
  softDeleteProductService,
} from "../services/adminService.js";
import {
  serializeUserDTO,
  serializeOrderDTO,
  serializeProductDTO,
  formatPaginatedResponse,
} from "../dto/adminDTO.js";

// GET /api/admin/v1/metrics/overview
export const getOverviewMetrics = async (req, res, next) => {
  try {
    const metrics = await getOverviewMetricsService();
    return res.status(200).json({ data: metrics });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/v1/users
export const listUsers = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const { role, status, search } = req.query;

    const { users, total } = await listUsersService({ page, limit, role, status, search });
    const serializedUsers = users.map(serializeUserDTO);

    return res.status(200).json(formatPaginatedResponse(serializedUsers, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/v1/users/:id
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDetail = await getUserByIdService(id);

    if (!userDetail) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `User with ID '${id}' was not found`,
        },
      });
    }

    const cleanUser = serializeUserDTO(userDetail);
    return res.status(200).json({
      data: {
        ...cleanUser,
        orderSummary: userDetail.orderSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/v1/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    const updated = await updateUserService(id, { role, status });
    if (!updated) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `User with ID '${id}' was not found`,
        },
      });
    }

    return res.status(200).json({ data: serializeUserDTO(updated) });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/v1/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await softDeleteUserService(id);

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `User with ID '${id}' was not found`,
        },
      });
    }

    return res.status(200).json({
      data: {
        id: String(deleted._id || deleted.id),
        status: "disabled",
        message: "User successfully soft-deleted",
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/v1/orders
export const listOrders = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const { status, paymentStatus, search } = req.query;

    const { orders, total } = await listOrdersService({ page, limit, status, paymentStatus, search });
    const serializedOrders = orders.map(serializeOrderDTO);

    return res.status(200).json(formatPaginatedResponse(serializedOrders, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/v1/orders/:id
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);

    if (!order) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Order with ID '${id}' was not found`,
        },
      });
    }

    return res.status(200).json({ data: serializeOrderDTO(order) });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/v1/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updated = await updateOrderStatusService(id, { status, paymentStatus });
    if (!updated) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Order with ID '${id}' was not found`,
        },
      });
    }

    return res.status(200).json({ data: serializeOrderDTO(updated) });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/v1/products
export const listProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.pagination;
    const { category, search } = req.query;

    const { products, total } = await listProductsService({ page, limit, category, search });
    const serializedProducts = products.map(serializeProductDTO);

    return res.status(200).json(formatPaginatedResponse(serializedProducts, total, page, limit));
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/v1/products
export const createProduct = async (req, res, next) => {
  try {
    const created = await createProductService(req.body);
    return res.status(201).json({ data: serializeProductDTO(created) });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/v1/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await updateProductService(id, req.body);

    if (!updated) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Product with ID '${id}' was not found`,
        },
      });
    }

    return res.status(200).json({ data: serializeProductDTO(updated) });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/v1/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await softDeleteProductService(id);

    if (!deleted) {
      return res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: `Product with ID '${id}' was not found`,
        },
      });
    }

    return res.status(200).json({
      data: {
        id: String(deleted._id || deleted.id),
        status: "inactive",
        message: "Product soft-deleted / deactivated",
      },
    });
  } catch (error) {
    next(error);
  }
};
