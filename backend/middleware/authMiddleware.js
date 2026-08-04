import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "928b2b3d-c5f4-4d18-b8a1-f1d5e3b76391");

      const user = await User.findById(decoded.id).select("-__v");
      if (!user) {
        // Fallback user object if DB offline or user not found
        req.user = { _id: decoded.id, id: decoded.id, email: decoded.email || "user@daily.app", name: "Aarav Mehta" };
      } else {
        req.user = user;
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no bearer token provided" });
  }
};
