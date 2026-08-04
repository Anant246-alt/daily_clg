import { User } from "../models/User.js";
import { readCollection, updateDocument, insertDocument } from "../config/fileDb.js";

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let userDoc = null;
    try {
      userDoc = await User.findById(userId).select("-__v");
    } catch (err) {
      console.warn("[Profile] DB fetch failed");
    }

    if (!userDoc) {
      const diskUsers = readCollection("users", []);
      const found = diskUsers.find((u) => u.id === userId || u._id === userId || u.email === req.user.email);
      if (found) {
        return res.status(200).json(found);
      }

      return res.status(200).json({
        id: userId,
        name: req.user.name || "Aarav Mehta",
        email: req.user.email || "aarav@daily.app",
        phone: req.user.phone || "+91 98765 43210",
        avatar: req.user.avatar || "",
      });
    }

    return res.status(200).json({
      id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      avatar: userDoc.avatar || "",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, email, phone, avatar } = req.body;

    let userDoc = null;
    try {
      userDoc = await User.findById(userId);
      if (userDoc) {
        if (name) userDoc.name = name;
        if (email) userDoc.email = email;
        if (phone) userDoc.phone = phone;
        if (avatar !== undefined) userDoc.avatar = avatar;
        await userDoc.save();
      }
    } catch (dbErr) {
      console.warn("[Profile] DB update failed");
    }

    const updatedUserObj = {
      id: userId,
      _id: userId,
      name: name || (userDoc ? userDoc.name : req.user.name || "Aarav Mehta"),
      email: email || (userDoc ? userDoc.email : req.user.email || "aarav@daily.app"),
      phone: phone || (userDoc ? userDoc.phone : req.user.phone || "+91 98765 43210"),
      avatar: avatar !== undefined ? avatar : userDoc ? userDoc.avatar : req.user.avatar || "",
    };

    updateDocument("users", "email", updatedUserObj.email, updatedUserObj) || insertDocument("users", updatedUserObj);

    return res.status(200).json({
      success: true,
      user: updatedUserObj,
    });
  } catch (error) {
    next(error);
  }
};
