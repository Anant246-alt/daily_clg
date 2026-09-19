import crypto from "crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Otp } from "../models/Otp.js";
import { User } from "../models/User.js";
import { connectDB } from "../config/db.js";
import { sendEmail } from "../utils/sendEmail.js";
import { getOtpEmailTemplate } from "../utils/emailTemplates.js";
import { readCollection, insertDocument } from "../config/fileDb.js";

const SECRET = process.env.JWT_SECRET || "daily_jwt_secret_key_2026_super_secure";

const generateToken = (id, email) => {
  return jwt.sign({ id, email }, SECRET, { expiresIn: "30d" });
};

/**
 * Sends 6-digit OTP code dynamically to the entered recipient email address
 * Supports mode: "signup" | "login" for account existence checks
 */
export const sendOtp = async (req, res) => {
  try {
    const { email, phone, identifier: rawId, mode } = req.body || {};
    const rawInput = (email || phone || rawId || "").trim();
    const identifier = rawInput.toLowerCase();

    if (!identifier || (!identifier.includes("@") && identifier.length < 5)) {
      return res.status(400).json({
        success: false,
        emailSent: false,
        message: "Please enter a valid email address",
      });
    }

    // Check account existence based on mode
    let existingUser = null;
    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        existingUser = await User.findOne({
          email: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
        });
      }
    } catch (err) {
      console.warn("[sendOtp DB Lookup Notice]:", err?.message);
    }

    if (!existingUser) {
      try {
        const diskUsers = readCollection("users", []);
        existingUser = diskUsers.find((u) => u.email && u.email.toLowerCase() === identifier);
      } catch {
        /* ignore file db error */
      }
    }

    // Generate dynamic 6-digit random OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAtMs = Date.now() + 10 * 60 * 1000; // 10 minutes
    const expiresAt = new Date(expiresAtMs);

    // Create HMAC verification signature
    const hmacSignature = crypto
      .createHmac("sha256", SECRET)
      .update(`${identifier}:${otpCode}`)
      .digest("hex");

    // Store in File DB fallback
    try {
      const currentOtps = readCollection("otps.json", []);
      const filtered = currentOtps.filter((o) => o.email !== identifier);
      filtered.push({ email: identifier, otp: otpCode, expiresAt: expiresAtMs });
      insertDocument("otps.json", filtered, true);
    } catch {
      /* ignore file db error */
    }

    // Store in MongoDB Atlas
    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        await Otp.deleteMany({ email: identifier });
        await Otp.create({ email: identifier, otp: otpCode, expiresAt });
        console.log(`[MongoDB Atlas OTP Created] Saved code ${otpCode} for recipient ${identifier}`);
      }
    } catch (dbErr) {
      console.warn("[sendOtp DB Notice]:", dbErr?.message);
    }

    const html = getOtpEmailTemplate(otpCode, "Verify Your Email Address", mode || "login");

    // Dispatch email via Nodemailer to the exact recipient email entered
    const emailResult = await sendEmail({
      to: identifier,
      subject: `Your Daily Verification Code: ${otpCode}`,
      html,
    });

    if (emailResult.success) {
      console.log(`[Nodemailer Dispatch Success] Verification code sent to ${identifier}`);
      return res.status(200).json({
        success: true,
        emailSent: true,
        email: identifier,
        hashToken: hmacSignature,
        message: `OTP sent successfully to ${identifier}`,
      });
    } else {
      console.error(`[Nodemailer Dispatch Failed] Delivery to ${identifier} failed: ${emailResult.error}`);
      return res.status(400).json({
        success: false,
        emailSent: false,
        email: identifier,
        error: emailResult.error || "Email delivery failure",
        message: `Failed to deliver email to ${identifier}: ${emailResult.error || "Check email address"}`,
      });
    }
  } catch (error) {
    console.error("[sendOtp Controller Error]:", error);
    return res.status(500).json({
      success: false,
      emailSent: false,
      message: "Failed to generate and send OTP code",
    });
  }
};

/**
 * Verifies 6-digit OTP code, registers new users with full name or logs in existing users
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, phone, identifier: rawId, otp, hashToken, name } = req.body || {};
    const rawInput = (email || phone || rawId || "").trim();
    const identifier = rawInput.toLowerCase();

    if (!identifier) {
      return res.status(400).json({ success: false, message: "Email address is required" });
    }

    if (!otp || String(otp).trim().length !== 6) {
      return res.status(400).json({ success: false, message: "OTP must be exactly 6 digits" });
    }

    const cleanOtp = String(otp).trim();
    let isValid = false;
    let otpExpired = false;

    // 1. HMAC Verification check
    if (hashToken) {
      const expectedHmac = crypto
        .createHmac("sha256", SECRET)
        .update(`${identifier}:${cleanOtp}`)
        .digest("hex");
      if (expectedHmac === hashToken) {
        isValid = true;
      }
    }

    // 2. MongoDB Atlas Verification check
    let dbOtpRecord = null;
    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        dbOtpRecord = await Otp.findOne({ email: identifier, otp: cleanOtp });
        if (dbOtpRecord) {
          if (dbOtpRecord.expiresAt && new Date(dbOtpRecord.expiresAt) < new Date()) {
            otpExpired = true;
            await Otp.deleteOne({ _id: dbOtpRecord._id });
          } else {
            isValid = true;
            await Otp.deleteOne({ _id: dbOtpRecord._id });
          }
        }
      }
    } catch (dbErr) {
      console.warn("[verifyOtp DB Notice]:", dbErr?.message);
    }

    // 3. File DB Verification check
    if (!isValid && !otpExpired) {
      try {
        const fileOtps = readCollection("otps.json", []);
        const idx = fileOtps.findIndex((o) => o.email === identifier && String(o.otp) === cleanOtp);
        if (idx !== -1) {
          const record = fileOtps[idx];
          if (record.expiresAt && record.expiresAt < Date.now()) {
            otpExpired = true;
          } else {
            isValid = true;
          }
          fileOtps.splice(idx, 1);
          insertDocument("otps.json", fileOtps, true);
        }
      } catch {
        /* ignore file db error */
      }
    }

    if (otpExpired) {
      return res.status(400).json({
        success: false,
        message: "OTP code has expired. Please request a new verification code.",
      });
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code. Please check your email inbox and enter the exact 6-digit code.",
      });
    }

    // OTP Verified! Look up or create user in MongoDB Atlas
    let user = null;
    let isNewUser = false;

    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        user = await User.findOne({
          email: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
        });
      }
    } catch (err) {
      console.warn("[verifyOtp User Lookup Notice]:", err?.message);
    }

    const diskUsers = readCollection("users", []);
    const diskUser = diskUsers.find((u) => u.email && u.email.toLowerCase() === identifier);

    if (!user && diskUser) {
      user = diskUser;
    }

    if (!user) {
      isNewUser = true;
      const nameFromEmail = identifier.includes("@") ? identifier.split("@")[0] : "User";
      const formattedName = name && String(name).trim().length > 0
        ? String(name).trim()
        : nameFromEmail.replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

      const newUserObj = {
        name: formattedName || "Daily User",
        email: identifier,
        phone: "+91 98765 43210",
        avatar: "",
      };

      try {
        if (mongoose.connection.readyState >= 1) {
          user = await User.create(newUserObj);
          console.log(`[MongoDB Atlas User Registered] ${user.email} (${user.name})`);
        }
      } catch (createErr) {
        console.warn("[User Creation Notice]:", createErr?.message);
      }

      if (!user) {
        const cleanId = identifier.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
        user = { ...newUserObj, _id: `u_${cleanId}`, id: `u_${cleanId}` };
      }

      try {
        insertDocument("users", user);
      } catch {
        /* ignore file db error */
      }
    }

    const userIdToUse = user._id ? user._id.toString() : user.id;
    const token = generateToken(userIdToUse, user.email);

    return res.status(200).json({
      success: true,
      isNewUser,
      token,
      user: {
        id: userIdToUse,
        _id: userIdToUse,
        name: user.name,
        email: user.email,
        phone: user.phone || "+91 98765 43210",
        avatar: user.avatar || "",
      },
      message: isNewUser ? "Registration successful! Welcome to Daily." : "Login successful! Welcome back.",
    });
  } catch (error) {
    console.error("[verifyOtp Controller Error]:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed. Please try again.",
    });
  }
};

export const logout = async (req, res) => {
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    let mongoUsers = [];
    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        mongoUsers = await User.find({}).select("-password -__v").lean();
      }
    } catch (err) {
      console.warn("[getAllUsers DB Notice]:", err?.message);
    }

    const diskUsers = readCollection("users", []);
    const mergedMap = new Map();

    for (const u of mongoUsers) {
      const emailKey = String(u.email || "").toLowerCase();
      if (emailKey) {
        mergedMap.set(emailKey, {
          id: u._id ? u._id.toString() : u.id,
          _id: u._id ? u._id.toString() : u.id,
          name: u.name || "Daily User",
          email: u.email,
          phone: u.phone || "+91 98765 43210",
          avatar: u.avatar || "",
          createdAt: u.createdAt || new Date(),
        });
      }
    }

    for (const u of diskUsers) {
      const emailKey = String(u.email || "").toLowerCase();
      if (emailKey && !mergedMap.has(emailKey)) {
        mergedMap.set(emailKey, {
          id: u._id || u.id || `u_${Math.random()}`,
          _id: u._id || u.id || `u_${Math.random()}`,
          name: u.name || "Daily User",
          email: u.email,
          phone: u.phone || "+91 98765 43210",
          avatar: u.avatar || "",
          createdAt: u.createdAt || new Date(),
        });
      }
    }

    const usersList = Array.from(mergedMap.values());
    return res.status(200).json({
      success: true,
      count: usersList.length,
      users: usersList,
    });
  } catch (error) {
    next(error);
  }
};
