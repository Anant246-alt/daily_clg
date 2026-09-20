# Daily Healthy Food — Comprehensive Admin API Documentation

This document provides complete, production-ready API specifications for all **Admin Endpoints** of the Daily Healthy Food platform.

---

## 📌 Table of Contents
1. [General Specifications & Base URL](#1-general-specifications--base-url)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [Standard Response & Error Formats](#3-standard-response--error-formats)
4. [Overview & Analytics Metrics API](#4-overview--analytics-metrics-api)
   - [GET /api/admin/v1/metrics/overview](#get-apiadminv1metricsoverview)
5. [User Management APIs](#5-user-management-apis)
   - [GET /api/admin/v1/users](#get-apiadminv1users)
   - [GET /api/admin/v1/users/:id](#get-apiadminv1usersid)
   - [PATCH /api/admin/v1/users/:id](#patch-apiadminv1usersid)
   - [DELETE /api/admin/v1/users/:id](#delete-apiadminv1usersid)
6. [Order Fulfillment & Tracking APIs](#6-order-fulfillment--tracking-apis)
   - [GET /api/admin/v1/orders](#get-apiadminv1orders)
   - [GET /api/admin/v1/orders/:id](#get-apiadminv1ordersid)
   - [PATCH /api/admin/v1/orders/:id/status](#patch-apiadminv1ordersidstatus)
   - [GET /api/orders/admin/all (Legacy direct sync)](#get-apiordersadminall-legacy-direct-sync)
   - [PUT /api/orders/admin/:id/status (Legacy direct sync)](#put-apiordersadminidstatus-legacy-direct-sync)
7. [Product Catalogue Management APIs](#7-product-catalogue-management-apis)
   - [GET /api/admin/v1/products](#get-apiadminv1products)
   - [POST /api/admin/v1/products](#post-apiadminv1products)
   - [PATCH /api/admin/v1/products/:id](#patch-apiadminv1productsid)
   - [DELETE /api/admin/v1/products/:id](#delete-apiadminv1productsid)

---

## 1. General Specifications & Base URL

- **Production Base URL**: `https://daily-clg-swart.vercel.app`
- **Local Development Base URL**: `http://localhost:5000`
- **Data Format**: `JSON` (`Content-Type: application/json`)
- **Protocol**: `HTTPS` (or HTTP in local dev)

---

## 2. Authentication & Authorization

All Admin API endpoints require authentication using one of the following methods:

### Method A: JWT Bearer Token Header (Recommended)
```http
Authorization: Bearer <YOUR_ADMIN_JWT_TOKEN>
```
> The decoded JWT token must contain a valid user ID or email with a role of `"admin"` or `"superadmin"`.

### Method B: Direct Admin Key Header (Bypass Key)
```http
x-admin-passcode: admin123
```
> Used by internal dashboards or administrative scripts for direct authentication.

---

## 3. Standard Response & Error Formats

### Success Response Format (Single Resource)
```json
{
  "data": { ... }
}
```

### Success Response Format (Paginated Collection)
```json
{
  "data": [ ... ],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8,
    "hasMore": true
  }
}
```

### Standard Error Response Format
```json
{
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Validation failed",
    "details": [
      {
        "field": "limit",
        "issue": "Limit parameter must be an integer between 1 and 100"
      }
    ]
  }
}
```

### HTTP Status Code Mapping
- `200 OK`: Request completed successfully.
- `201 Created`: New resource successfully created.
- `401 Unauthorized`: Authentication token missing, invalid, or expired.
- `403 Forbidden`: Authenticated user lacks `admin` or `superadmin` role privileges.
- `404 Not Found`: Target record ID does not exist in database or disk storage.
- `422 Unprocessable Entity`: Input validation failed or unknown fields were included.
- `500 Internal Server Error`: Server-side unhandled exception.

---

## 4. Overview & Analytics Metrics API

### GET `/api/admin/v1/metrics/overview`
Retrieves platform-wide summary metrics, including total revenue, order statuses, user count, and active product inventory.

- **Authentication**: Required (`Bearer` or `x-admin-passcode`)
- **Headers**:
  ```http
  Authorization: Bearer <TOKEN>
  ```
- **Query Parameters**: None

#### Example Request
```bash
curl -X GET "https://daily-clg-swart.vercel.app/api/admin/v1/metrics/overview" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Example 200 OK Response
```json
{
  "data": {
    "totalRevenue": 145920,
    "totalOrders": 348,
    "pendingOrders": 12,
    "deliveredOrders": 320,
    "totalUsers": 84,
    "activeProducts": 24,
    "currency": "INR"
  }
}
```

---

## 5. User Management APIs

### GET `/api/admin/v1/users`
Retrieves a paginated, filterable list of registered customer and admin accounts.

- **Authentication**: Required
- **Query Parameters**:
  | Parameter | Type | Required | Default | Constraint / Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | No | `1` | Min `1` |
  | `limit` | Integer | No | `20` | Min `1`, Max `100` |
  | `role` | String | No | - | Filter by role: `user`, `admin`, `superadmin` |
  | `status` | String | No | - | Filter by status: `active`, `blocked`, `disabled` |
  | `search` | String | No | - | Case-insensitive search across `name`, `email`, `phone` |

#### Example Request
```bash
curl -X GET "https://daily-clg-swart.vercel.app/api/admin/v1/users?page=1&limit=10&role=user&status=active&search=Aarav" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Example 200 OK Response
```json
{
  "data": [
    {
      "id": "66e85f12a8f9c1b3d4e5f678",
      "name": "Aarav Mehta",
      "email": "aarav.mehta@example.com",
      "phone": "+91 98765 43210",
      "role": "user",
      "status": "active",
      "createdAt": "2026-09-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### GET `/api/admin/v1/users/:id`
Retrieves detailed information for a specific user ID along with their order summary stats.

- **Authentication**: Required
- **Path Parameters**:
  - `id` (String, Required): MongoDB `_id` or string ID of the user.

#### Example Request
```bash
curl -X GET "https://daily-clg-swart.vercel.app/api/admin/v1/users/66e85f12a8f9c1b3d4e5f678" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Example 200 OK Response
```json
{
  "data": {
    "id": "66e85f12a8f9c1b3d4e5f678",
    "name": "Aarav Mehta",
    "email": "aarav.mehta@example.com",
    "phone": "+91 98765 43210",
    "role": "user",
    "status": "active",
    "createdAt": "2026-09-15T10:30:00.000Z",
    "orderSummary": {
      "totalOrders": 4,
      "totalSpent": 1496,
      "recentOrders": [
        {
          "id": "o_1726838271",
          "number": "#DLY-1002",
          "total": 349,
          "status": "Delivered"
        }
      ]
    }
  }
}
```

#### Example 404 Not Found Response
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "User with ID 'non_existent_id' was not found"
  }
}
```

---

### PATCH `/api/admin/v1/users/:id`
Updates administrative properties (`role` and/or `status`) of a user account. Unknown body fields are strictly rejected (`422`).

- **Authentication**: Required
- **Path Parameters**:
  - `id` (String, Required): MongoDB `_id` or user string ID.
- **Request Body Parameters**:
  | Field | Type | Allowed Values | Description |
  | :--- | :--- | :--- | :--- |
  | `role` | String | `user`, `admin`, `superadmin` | User authorization role |
  | `status` | String | `active`, `blocked`, `disabled` | Account standing status |

#### Example Request
```bash
curl -X PATCH "https://daily-clg-swart.vercel.app/api/admin/v1/users/66e85f12a8f9c1b3d4e5f678" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "status": "active"
  }'
```

#### Example 200 OK Response
```json
{
  "data": {
    "id": "66e85f12a8f9c1b3d4e5f678",
    "name": "Aarav Mehta",
    "email": "aarav.mehta@example.com",
    "phone": "+91 98765 43210",
    "role": "admin",
    "status": "active"
  }
}
```

#### Example 422 Unprocessable Entity (Unknown Field)
```json
{
  "error": {
    "code": "UNPROCESSABLE_ENTITY",
    "message": "Validation failed",
    "details": [
      {
        "field": "invalidField",
        "issue": "Unknown field not allowed in user update"
      }
    ]
  }
}
```

---

### DELETE `/api/admin/v1/users/:id`
Soft-deletes a user account by transitioning status to `"disabled"`.

- **Authentication**: Required
- **Path Parameters**:
  - `id` (String, Required): Target user ID.

#### Example 200 OK Response
```json
{
  "data": {
    "id": "66e85f12a8f9c1b3d4e5f678",
    "status": "disabled",
    "message": "User successfully soft-deleted"
  }
}
```

---

## 6. Order Fulfillment & Tracking APIs

### GET `/api/admin/v1/orders`
Retrieves a paginated list of all customer orders in the system with real-time status and payment state.

- **Authentication**: Required
- **Query Parameters**:
  | Parameter | Type | Required | Default | Constraint / Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | No | `1` | Min `1` |
  | `limit` | Integer | No | `20` | Min `1`, Max `100` |
  | `status` | String | No | - | `Preparing`, `On the way`, `Out for Delivery`, `Delivered`, `Cancelled` |
  | `paymentStatus` | String | No | - | `Paid`, `Pending`, `Failed` |
  | `search` | String | No | - | Search by `number`, `id`, `userName`, `userEmail`, `userPhone` |

#### Example Request
```bash
curl -X GET "https://daily-clg-swart.vercel.app/api/admin/v1/orders?page=1&limit=5&status=Preparing" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Example 200 OK Response
```json
{
  "data": [
    {
      "id": "o_1726838271",
      "number": "#DLY-1002",
      "date": "20 Sep 2026, 06:45 PM",
      "status": "Preparing",
      "paymentStatus": "Paid",
      "total": 349,
      "paymentMethod": "Razorpay Gateway",
      "address": "Flat 402, Green Meadows, Koramangala",
      "userName": "Aarav Mehta",
      "userEmail": "aarav@example.com",
      "userPhone": "+91 98765 43210",
      "items": [
        {
          "id": "p1",
          "name": "Avocado Crunch Diet Salad",
          "qty": 1,
          "price": 299
        }
      ],
      "timeline": [
        {
          "label": "Order Placed",
          "time": "06:45 PM",
          "done": true
        },
        {
          "label": "Preparing",
          "time": "06:46 PM",
          "done": true
        }
      ]
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 5,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### GET `/api/admin/v1/orders/:id`
Retrieves detailed information for a specific order by ID or order number (`#DLY-XXXX`).

- **Authentication**: Required
- **Path Parameters**:
  - `id` (String, Required): Order ID (`o_1726...`), Order Number (`#DLY-1002` or `DLY-1002`), or MongoDB `_id`.

#### Example Request
```bash
curl -X GET "https://daily-clg-swart.vercel.app/api/admin/v1/orders/DLY-1002" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

#### Example 200 OK Response
```json
{
  "data": {
    "id": "o_1726838271",
    "number": "#DLY-1002",
    "date": "20 Sep 2026, 06:45 PM",
    "status": "Preparing",
    "paymentStatus": "Paid",
    "total": 349,
    "paymentMethod": "Razorpay Gateway",
    "address": "Flat 402, Green Meadows, Koramangala",
    "userName": "Aarav Mehta",
    "userEmail": "aarav@example.com",
    "userPhone": "+91 98765 43210",
    "items": [
      {
        "id": "p1",
        "name": "Avocado Crunch Diet Salad",
        "qty": 1,
        "price": 299
      }
    ],
    "timeline": [
      { "label": "Order Placed", "time": "06:45 PM", "done": true },
      { "label": "Preparing", "time": "06:46 PM", "done": true }
    ]
  }
}
```

---

### PATCH `/api/admin/v1/orders/:id/status`
Updates order status (`status`) and/or payment standing (`paymentStatus`). Automatically appends audit history entries into `statusHistory`.

- **Authentication**: Required
- **Path Parameters**:
  - `id` (String, Required): Target Order ID.
- **Request Body Parameters**:
  | Field | Type | Allowed Values | Description |
  | :--- | :--- | :--- | :--- |
  | `status` | String | `Preparing`, `On the way`, `Out for Delivery`, `Delivered`, `Cancelled` | Fulfillment stage |
  | `paymentStatus` | String | `Paid`, `Pending`, `Failed` | Payment state |

#### Example Request
```bash
curl -X PATCH "https://daily-clg-swart.vercel.app/api/admin/v1/orders/DLY-1002/status" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Out for Delivery",
    "paymentStatus": "Paid"
  }'
```

#### Example 200 OK Response
```json
{
  "data": {
    "id": "o_1726838271",
    "number": "#DLY-1002",
    "status": "Out for Delivery",
    "paymentStatus": "Paid",
    "updatedAt": "2026-09-20T18:50:00.000Z"
  }
}
```

---

### GET `/api/orders/admin/all` (Legacy Direct Sync)
Direct endpoint used for live polling sync in the Admin Dashboard UI.

- **Authentication**: Open / Public for Admin Portal polling.
- **Response**: Array of all active orders from MongoDB Atlas.

---

### PUT `/api/orders/admin/:id/status` (Legacy Direct Sync)
Direct status update endpoint for real-time dashboard UI controls.

- **Request Body**: `{ "status": "Delivered", "paymentStatus": "Paid" }`
- **Response**: `{ "success": true, "order": { ... } }`

---

## 7. Product Catalogue Management APIs

### GET `/api/admin/v1/products`
Retrieves a paginated list of menu catalogue items.

- **Authentication**: Required
- **Query Parameters**:
  | Parameter | Type | Required | Default | Description |
  | :--- | :--- | :--- | :--- | :--- |
  | `page` | Integer | No | `1` | Page number |
  | `limit` | Integer | No | `20` | Max items per page (Max 100) |
  | `category` | String | No | - | Filter by category (`sandwiches`, `salads`, `beverages`, `combos`) |
  | `search` | String | No | - | Search by `name` or `description` |

#### Example 200 OK Response
```json
{
  "data": [
    {
      "id": "p1",
      "name": "Avocado Crunch Diet Salad",
      "category": "salads",
      "price": 299,
      "mrp": 374,
      "description": "Fresh avocado, kale, cherry tomatoes, and seeds with lemon vinaigrette.",
      "image": "/avocado_crunch_diet.jpg",
      "veg": true,
      "bestSeller": true,
      "status": "active"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasMore": false
  }
}
```

---

### POST `/api/admin/v1/products`
Creates a new menu item in the database.

- **Authentication**: Required
- **Request Body Parameters**:
  | Field | Type | Required | Description |
  | :--- | :--- | :--- | :--- |
  | `name` | String | **Yes** | Item name |
  | `category` | String | **Yes** | Category (`sandwiches`, `salads`, `beverages`, `combos`) |
  | `price` | Number | **Yes** | Selling price |
  | `mrp` | Number | No | Maximum Retail Price |
  | `description` | String | No | Detailed description |
  | `image` | String | No | Image URL or base64 |
  | `veg` | Boolean | No | `true` for vegetarian |

#### Example Request
```bash
curl -X POST "https://daily-clg-swart.vercel.app/api/admin/v1/products" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mediterranean Veggie Wrap",
    "category": "sandwiches",
    "price": 279,
    "mrp": 349,
    "description": "Fresh hummus, grilled zucchini, bell peppers, and feta cheese.",
    "veg": true
  }'
```

#### Example 201 Created Response
```json
{
  "data": {
    "id": "p_1726839000",
    "name": "Mediterranean Veggie Wrap",
    "category": "sandwiches",
    "price": 279,
    "mrp": 349,
    "description": "Fresh hummus, grilled zucchini, bell peppers, and feta cheese.",
    "veg": true,
    "status": "active"
  }
}
```

---

### PATCH `/api/admin/v1/products/:id`
Updates an existing menu product's properties.

- **Authentication**: Required
- **Path Parameters**: `id` (String, Required)

---

### DELETE `/api/admin/v1/products/:id`
Soft-deletes a product by marking `status: "inactive"`.

- **Authentication**: Required
- **Path Parameters**: `id` (String, Required)

#### Example 200 OK Response
```json
{
  "data": {
    "id": "p_1726839000",
    "status": "inactive",
    "message": "Product soft-deleted / deactivated"
  }
}
```

---

### 📄 Summary
The documentation above covers **all** Admin API endpoints with full request syntax, query parameters, header options, validation rules, HTTP status codes, and example JSON response bodies.
