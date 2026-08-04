import { Address } from "../models/Address.js";

const fallbackAddresses = [
  {
    id: "a1",
    label: "Home",
    name: "Aarav Mehta",
    line: "Flat 402, Green Meadows, 5th Block Koramangala",
    city: "Bengaluru",
    pincode: "560034",
    phone: "+91 98765 43210",
  },
  {
    id: "a2",
    label: "Office",
    name: "Aarav Mehta",
    line: "WeWork Galaxy, 43 Residency Road",
    city: "Bengaluru",
    pincode: "560025",
    phone: "+91 98765 43210",
  },
];

export const getAddresses = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let addresses = [];
    try {
      addresses = await Address.find({ user: userId }).select("-__v");
    } catch (err) {
      console.warn("[Addresses] DB fetch failed");
    }
    if (!addresses || addresses.length === 0) {
      addresses = fallbackAddresses;
    }
    return res.status(200).json(addresses);
  } catch (error) {
    next(error);
  }
};

export const saveAddress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id, label, name, line, city, pincode, phone } = req.body;

    const addressId = id || `a_${Date.now()}`;
    let addressDoc = await Address.findOne({ user: userId, id: addressId });

    if (addressDoc) {
      addressDoc.label = label || addressDoc.label;
      addressDoc.name = name || addressDoc.name;
      addressDoc.line = line || addressDoc.line;
      addressDoc.city = city || addressDoc.city;
      addressDoc.pincode = pincode || addressDoc.pincode;
      addressDoc.phone = phone || addressDoc.phone;
      await addressDoc.save();
    } else {
      addressDoc = await Address.create({
        id: addressId,
        user: userId,
        label: label || "Home",
        name: name || "Aarav Mehta",
        line: line || "",
        city: city || "Bengaluru",
        pincode: pincode || "560001",
        phone: phone || "+91 98765 43210",
      });
    }

    return res.status(200).json({ success: true, address: addressDoc });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    await Address.deleteOne({ user: userId, id });
    return res.status(200).json({ success: true, message: "Address deleted", id });
  } catch (error) {
    next(error);
  }
};
