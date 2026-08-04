import { Notification } from "../models/Notification.js";

const fallbackNotifications = [
  {
    id: "n1",
    type: "Order Updates",
    title: "Your order #DLY-1001 is being prepared",
    body: "The kitchen has started on your Paneer Tikka Footlong.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "n2",
    type: "Offers",
    title: "20% cashback on UPI",
    body: "Pay with any UPI app this week and get up to ₹120 back.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "n3",
    type: "Promotions",
    title: "New on the menu: Yogurt Bowls",
    body: "Five new bowls with seasonal fruit. Try them before they sell out.",
    time: "Yesterday",
    unread: false,
  },
];

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let list = [];
    try {
      list = await Notification.find({ $or: [{ user: userId }, { user: null }] })
        .sort({ createdAt: -1 })
        .select("-__v");
    } catch (err) {
      console.warn("[Notifications] DB fetch failed");
    }

    if (!list || list.length === 0) {
      list = fallbackNotifications;
    }
    return res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    try {
      await Notification.updateOne({ id }, { unread: false });
    } catch (err) {
      console.warn("[Notification] Mark read failed");
    }
    return res.status(200).json({ success: true, id });
  } catch (error) {
    next(error);
  }
};
