/** Dummy notifications — replace with GET /api/notifications later. */
export type Notification = {
  id: string;
  type: "Promotions" | "Order Updates" | "Offers";
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const notifications: Notification[] = [];
