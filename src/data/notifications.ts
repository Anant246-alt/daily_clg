/** Dummy notifications — replace with GET /api/notifications later. */
export type Notification = {
  id: string;
  type: "Promotions" | "Order Updates" | "Offers";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const notifications: Notification[] = [
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
  {
    id: "n4",
    type: "Order Updates",
    title: "Order #DLY-1000 delivered",
    body: "Hope you enjoyed it. Tap to rate your meal.",
    time: "3 days ago",
    unread: false,
  },
];
