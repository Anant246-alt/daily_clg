import test from "node:test";
import assert from "node:assert/strict";
import express from "express";
import jwt from "jsonwebtoken";
import adminV1Routes from "../routes/adminRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/admin/v1", adminV1Routes);

const SECRET = process.env.JWT_SECRET || "daily_jwt_secret_key_2026_super_secure";

const validAdminToken = jwt.sign(
  { id: "u_admin_test", email: "admin@dailyfood.com", role: "admin" },
  SECRET
);
const validUserToken = jwt.sign(
  { id: "u_customer_test", email: "user@dailyfood.com", role: "user" },
  SECRET
);

// Helper function to simulate HTTP requests
async function makeRequest(path, options = {}) {
  const method = options.method || "GET";
  const headers = options.headers || {};
  const body = options.body ? JSON.stringify(options.body) : undefined;

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  return new Promise((resolve) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      try {
        const res = await fetch(`http://localhost:${port}${path}`, {
          method,
          headers,
          body,
        });
        const json = await res.json().catch(() => ({}));
        server.close();
        resolve({ status: res.status, body: json });
      } catch (err) {
        server.close();
        resolve({ status: 500, error: err.message });
      }
    });
  });
}

test("Admin API V1 - 401 Unauthorized when missing token", async () => {
  const res = await makeRequest("/api/admin/v1/metrics/overview");
  assert.equal(res.status, 401);
  assert.equal(res.body.error?.code, "UNAUTHORIZED");
});

test("Admin API V1 - 403 Forbidden when user role is not admin", async () => {
  const res = await makeRequest("/api/admin/v1/metrics/overview", {
    headers: { Authorization: `Bearer ${validUserToken}` },
  });
  assert.equal(res.status, 403);
  assert.equal(res.body.error?.code, "FORBIDDEN");
});

test("Admin API V1 - 200 Happy Path for Overview Metrics (with Admin Passcode)", async () => {
  const res = await makeRequest("/api/admin/v1/metrics/overview", {
    headers: { "x-admin-passcode": "admin123" },
  });
  assert.equal(res.status, 200);
  assert.ok(res.body.data);
  assert.ok(typeof res.body.data.totalOrders === "number");
});

test("Admin API V1 - 200 Happy Path for Paginated Users", async () => {
  const res = await makeRequest("/api/admin/v1/users?page=1&limit=5", {
    headers: { Authorization: `Bearer ${validAdminToken}` },
  });
  assert.equal(res.status, 200);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.meta);
  assert.equal(res.body.meta.page, 1);
  assert.equal(res.body.meta.limit, 5);
});

test("Admin API V1 - 422 Validation Error when limit exceeds 100", async () => {
  const res = await makeRequest("/api/admin/v1/users?limit=500", {
    headers: { Authorization: `Bearer ${validAdminToken}` },
  });
  assert.equal(res.status, 422);
  assert.equal(res.body.error?.code, "UNPROCESSABLE_ENTITY");
  assert.equal(res.body.error?.details[0]?.field, "limit");
});

test("Admin API V1 - 422 Validation Error on unknown body fields", async () => {
  const res = await makeRequest("/api/admin/v1/users/u101", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${validAdminToken}` },
    body: { role: "admin", unknownProperty: "invalid" },
  });
  assert.equal(res.status, 422);
  assert.equal(res.body.error?.code, "UNPROCESSABLE_ENTITY");
});

test("Admin API V1 - 404 Not Found for non-existent order", async () => {
  const res = await makeRequest("/api/admin/v1/orders/non_existent_999999", {
    headers: { Authorization: `Bearer ${validAdminToken}` },
  });
  assert.equal(res.status, 404);
  assert.equal(res.body.error?.code, "NOT_FOUND");
});
