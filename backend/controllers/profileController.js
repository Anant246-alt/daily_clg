import mongoose from "mongoose";
import { User } from "../models/User.js";
import { connectDB } from "../config/db.js";
import { readCollection, updateDocument, insertDocument } from "../config/fileDb.js";

export const getProfile = async (req, res, next) => {
  try {
    const searchId = req.user._id || req.user.id;
    const searchEmail = req.user.email ? String(req.user.email).trim().toLowerCase() : "";

    let userDoc = null;
    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        if (searchId && mongoose.Types.ObjectId.isValid(searchId)) {
          userDoc = await User.findById(searchId).select("-__v");
        }
        if (!userDoc && searchEmail) {
          userDoc = await User.findOne({
            email: new RegExp(`^${searchEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
          }).select("-__v");
        }
      }
    } catch (err) {
      console.warn("[Profile Controller] MongoDB lookup notice:", err?.message);
    }

    if (!userDoc) {
      const diskUsers = readCollection("users", []);
      const found = diskUsers.find(
        (u) =>
          u.id === searchId ||
          u._id === searchId ||
          (u.email && u.email.toLowerCase() === searchEmail)
      );
      if (found) {
        return res.status(200).json({
          id: found._id || found.id || searchId,
          _id: found._id || found.id || searchId,
          name: found.name || req.user.name || "Anant Bhatt",
          email: found.email || searchEmail || "anantbhattd@gmail.com",
          phone: found.phone || req.user.phone || "+91 98765 43210",
          avatar: found.avatar || "",
        });
      }

      return res.status(200).json({
        id: searchId,
        _id: searchId,
        name: req.user.name || "Anant Bhatt",
        email: searchEmail || req.user.email || "anantbhattd@gmail.com",
        phone: req.user.phone || "+91 98765 43210",
        avatar: req.user.avatar || "",
      });
    }

    const resUser = {
      id: userDoc._id ? userDoc._id.toString() : searchId,
      _id: userDoc._id ? userDoc._id.toString() : searchId,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone || "+91 98765 43210",
      avatar: userDoc.avatar || "",
    };

    return res.status(200).json(resUser);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const searchId = req.user._id || req.user.id;
    const searchEmail = req.user.email ? String(req.user.email).trim().toLowerCase() : "";
    const { name, email, phone, avatar } = req.body || {};

    let userDoc = null;
    try {
      await connectDB();
      if (mongoose.connection.readyState >= 1) {
        if (searchId && mongoose.Types.ObjectId.isValid(searchId)) {
          userDoc = await User.findById(searchId);
        }
        if (!userDoc && searchEmail) {
          userDoc = await User.findOne({
            email: new RegExp(`^${searchEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
          });
        }

        if (userDoc) {
          if (name) userDoc.name = name;
          if (email) userDoc.email = email;
          if (phone) userDoc.phone = phone;
          if (avatar !== undefined) userDoc.avatar = avatar;
          await userDoc.save();
          console.log(`[MongoDB Atlas Profile Updated] Saved profile for ${userDoc.email} (${userDoc.name})`);
        } else {
          // Create user document in MongoDB Atlas if missing
          const newUserObj = {
            name: name || req.user.name || "Anant Bhatt",
            email: email || searchEmail || req.user.email || "anantbhattd@gmail.com",
            phone: phone || req.user.phone || "+91 98765 43210",
            avatar: avatar || "",
          };
          userDoc = await User.create(newUserObj);
          console.log(`[MongoDB Atlas Profile Created] Created document for ${userDoc.email}`);
        }
      }
    } catch (dbErr) {
      console.warn("[Profile Controller] DB update error:", dbErr?.message);
    }

    const finalUserId = userDoc ? userDoc._id.toString() : searchId;
    const updatedUserObj = {
      id: finalUserId,
      _id: finalUserId,
      name: name || (userDoc ? userDoc.name : req.user.name || "Anant Bhatt"),
      email: email || (userDoc ? userDoc.email : searchEmail || "anantbhattd@gmail.com"),
      phone: phone || (userDoc ? userDoc.phone : req.user.phone || "+91 98765 43210"),
      avatar: avatar !== undefined ? avatar : userDoc ? userDoc.avatar : req.user.avatar || "",
    };

    try {
      const updated =
        updateDocument("users", "id", searchId, updatedUserObj) ||
        updateDocument("users", "_id", searchId, updatedUserObj) ||
        updateDocument("users", "email", searchEmail, updatedUserObj) ||
        updateDocument("users", "email", updatedUserObj.email, updatedUserObj);

      if (!updated) {
        insertDocument("users", updatedUserObj);
      }
    } catch {
      /* ignore file db sync error */
    }

    return res.status(200).json({
      success: true,
      user: updatedUserObj,
    });
  } catch (error) {
    next(error);
  }
};
