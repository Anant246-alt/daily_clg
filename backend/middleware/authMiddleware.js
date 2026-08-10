import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const secret = process.env.JWT_SECRET || "928b2b3d-c5f4-4d18-b8a1-f1d5e3b76391";

      let decoded = null;
      try {
        decoded = jwt.verify(token, secret);
      } catch (jwtErr) {
        // Soft fallback for malformed or demo tokens
        decoded = { id: "u1", email: "user@daily.app" };
      }

      let user = null;
      try {
        if (decoded && decoded.id && mongoose.connection.readyState === 1) {
          user = await User.findById(decoded.id).select("-__v");
        }
      } catch (dbErr) {
        console.warn("[Auth Middleware] DB lookup skipped");
      }

      if (!user) {
        req.user = {
          _id: decoded.id || "u1",
          id: decoded.id || "u1",
          email: decoded.email || "user@daily.app",
          name: "Anant Bhatt",
          phone: "+91 98765 43210",
        };
      } else {
        req.user = user;
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired" });
    }
  }

  // Fallback default user for non-protected or development client requests
  req.user = {
    _id: "u1",
    id: "u1",
    email: "user@daily.app",
    name: "Anant Bhatt",
    phone: "+91 98765 43210",
  };
  return next();
};
