# Daily Food Delivery - Production Backend & API Documentation

A complete, production-ready backend built with **Node.js, Express.js, MongoDB Atlas, JWT Authentication, Nodemailer (Email OTP)**, and **Razorpay Test Mode** payment integration.

---

## Tech Stack & Architecture

- **Backend Framework**: Node.js & Express.js (MVC Pattern, REST API Architecture)
- **Database**: MongoDB Atlas via Mongoose ORM
- **Authentication**: Passwordless Email OTP Login with JWT Bearer Token authorization
- **Email Dispatch**: Nodemailer with HTML templates for OTP, Order Confirmations, and Support Tickets
- **Payment Processing**: Razorpay Test Mode integration with HMAC SHA-256 Signature Verification
- **Security**: Helmet, Rate-Limiting, CORS, JWT Protection Middleware, Validation & Error Handling Middleware
- **Documentation**: Swagger UI (`/api-docs`) & Postman Collection (`postman_collection.json`)

---

## Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb+srv://anantbhattd_db_user:k4g0O5CMdutmAOSd@<cluster-address>/<database_name>?retryWrites=true&w=majority

JWT_SECRET=928b2b3d-c5f4-4d18-b8a1-f1d5e3b76391
JWT_EXPIRE=30d

EMAIL_USER=dailyclgproject@gmail.com
EMAIL_PASS=wrbimcktkcejmipb
EMAIL_FROM=Daily <dailyclgproject@gmail.com>

RAZORPAY_KEY_ID=rzp_test_TLXgSkf5lA607j
RAZORPAY_KEY_SECRET=Nv4EtrRQfJt5nLARCRMDmFog

CLIENT_URL=http://localhost:8080
```

---

## Quick Start & Running the Backend

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Seed Database (Optional)**:
   ```bash
   npm run seed
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   *Runs Express Backend (`http://localhost:5000`) and Vite Frontend (`http://localhost:8080`) simultaneously.*

---

## Passwordless Email OTP Login Workflow

1. **User enters Email** -> `POST /api/auth/send-otp`
   - Generates a 6-digit numeric OTP.
   - Stores OTP temporarily in MongoDB with a 10-minute expiration index.
   - Sends a formatted HTML email via Nodemailer.
2. **User enters OTP** -> `POST /api/auth/verify-otp`
   - Verifies OTP correctness and expiration.
   - Automatically registers a new User account if one does not exist.
   - Generates and returns a JWT Bearer Token + User profile.

---

## Checkout & Payment Workflow

1. **Cart & Address Selection** -> Items collected in `CartContext`.
2. **Create Razorpay Order** -> `POST /api/payment/create-order`
   - Creates a Razorpay Order ID (`amount` in paise, `currency: "INR"`).
3. **Razorpay Modal / Gateway** -> Payment processed in Test Mode.
4. **Signature Verification** -> `POST /api/payment/verify`
   - Verifies HMAC SHA-256 signature using `RAZORPAY_KEY_SECRET`.
5. **Save Order & Post-Processing** -> `POST /api/orders`
   - Saves order details in MongoDB.
   - Empties user's Cart.
   - Generates an in-app Notification.
   - Sends an itemized Order Confirmation Email via Nodemailer.

---

## API Documentation & Routes Table

Interactive Swagger Documentation is accessible at: **`http://localhost:5000/api-docs`**

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Public | Send 6-digit Email OTP |
| `POST` | `/api/auth/verify-otp` | Public | Verify OTP & return JWT Token + User |
| `POST` | `/api/auth/logout` | Public | Logout current user session |
| `GET` | `/api/auth/me` | JWT | Get current user profile |
| `GET` | `/api/products` | Public | Fetch product catalogue |
| `GET` | `/api/products/:id` | Public | Fetch single product by ID |
| `GET` | `/api/products/category/:slug` | Public | Fetch products by category |
| `GET` | `/api/categories` | Public | Fetch all food categories |
| `GET` | `/api/banners` | Public | Fetch promotional banners & offers |
| `GET` | `/api/search?q=...` | Public | Search products |
| `GET` | `/api/cart` | JWT | Fetch user cart |
| `POST` | `/api/cart` | JWT | Add item to cart |
| `PUT` | `/api/cart/item` | JWT | Update item quantity |
| `DELETE` | `/api/cart/item/:id` | JWT | Remove item from cart |
| `DELETE` | `/api/cart` | JWT | Clear entire cart |
| `POST` | `/api/cart/apply-promo` | JWT | Apply promo code |
| `GET` | `/api/wishlist` | JWT | Fetch saved wishlist IDs |
| `POST` | `/api/wishlist/toggle/:productId` | JWT | Toggle item in wishlist |
| `GET` | `/api/addresses` | JWT | Fetch user saved addresses |
| `POST` | `/api/addresses` | JWT | Add or edit user address |
| `DELETE` | `/api/addresses/:id` | JWT | Delete saved address |
| `POST` | `/api/payment/create-order` | JWT | Create Razorpay test order |
| `POST` | `/api/payment/verify` | JWT | Verify Razorpay payment signature |
| `GET` | `/api/orders` | JWT | Fetch user order history |
| `GET` | `/api/orders/:id` | JWT | Fetch specific order details |
| `POST` | `/api/orders` | JWT | Place order & send confirmation email |
| `POST` | `/api/orders/:id/repeat` | JWT | Repeat order items into cart |
| `GET` | `/api/notifications` | JWT | Fetch user notifications |
| `PUT` | `/api/notifications/:id/read` | JWT | Mark notification as read |
| `GET` | `/api/reviews` | Public | Fetch product reviews |
| `POST` | `/api/reviews` | JWT | Submit product review |
| `GET` | `/api/profile` | JWT | Fetch profile details |
| `PUT` | `/api/profile` | JWT | Update profile details |
| `POST` | `/api/support/ticket` | Public/JWT | Create support ticket & email confirmation |

---

## Testing with Postman

Import `postman_collection.json` into Postman to test all endpoints with pre-configured requests, environment variables (`{{baseUrl}}`), and Bearer Token headers (`{{token}}`).
