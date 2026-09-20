export const adminErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const errorCode = err.code || (statusCode === 404 ? "NOT_FOUND" : statusCode === 422 ? "UNPROCESSABLE_ENTITY" : "INTERNAL_SERVER_ERROR");

  return res.status(statusCode).json({
    error: {
      code: errorCode,
      message: err.message || "An unexpected error occurred in Admin API",
      ...(err.details ? { details: err.details } : {}),
    },
  });
};
