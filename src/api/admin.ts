import { api } from "./client";

export type AdminUser = {
  id: string;
  _id?: string | undefined;
  name: string;
  email: string;
  phone?: string | undefined;
  avatar?: string | undefined;
  status?: "active" | "blocked" | string | undefined;
  lastLoginAt?: string | undefined;
  createdAt?: string | undefined;
  totalOrders?: number | undefined;
  totalSpent?: number | undefined;
};

export type AdminOrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

export type AdminTimelineItem = {
  label: string;
  time: string;
  done: boolean;
};

export type AdminStatusAudit = {
  previousStatus?: string | undefined;
  newStatus: string;
  timestamp?: string | Date | undefined;
  formattedTime?: string | undefined;
  actor?: "user" | "admin" | "system" | string | undefined;
  notes?: string | undefined;
};

export type AdminOrder = {
  _id?: string | undefined;
  id: string;
  number: string;
  date: string;
  status: "Preparing" | "On the way" | "Out for Delivery" | "Delivered" | "Cancelled" | string;
  paymentStatus?: "Paid" | "Pending" | "Failed" | string | undefined;
  isConfirmed?: boolean | undefined;
  total: number;
  paymentMethod: string;
  address: string;
  user?: any;
  userName?: string | undefined;
  userEmail?: string | undefined;
  userPhone?: string | undefined;
  items: AdminOrderItem[];
  timeline: AdminTimelineItem[];
  statusHistory?: AdminStatusAudit[] | undefined;
  razorpayOrderId?: string | undefined;
  razorpayPaymentId?: string | undefined;
  razorpaySignature?: string | undefined;
  createdAt?: string | undefined;
};

export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const res = await api.get("/auth/users");
    if (res.data && Array.isArray(res.data.users)) {
      return res.data.users;
    }
  } catch (error) {
    console.warn("[fetchAdminUsers Notice]", error);
  }
  return [];
};

export const fetchAdminOrders = async (): Promise<AdminOrder[]> => {
  try {
    const res = await api.get("/orders/admin/all");
    if (Array.isArray(res.data)) {
      return res.data;
    }
  } catch (error) {
    console.warn("[fetchAdminOrders Notice]", error);
  }
  return [];
};

export const updateAdminOrderStatus = async (
  orderId: string,
  status: string,
  paymentStatus?: string
): Promise<AdminOrder | null> => {
  try {
    const res = await api.put(`/orders/admin/${orderId}/status`, { status, paymentStatus });
    if (res.data && res.data.order) {
      return res.data.order;
    }
  } catch (error) {
    console.warn("[updateAdminOrderStatus Notice]", error);
  }
  return null;
};

