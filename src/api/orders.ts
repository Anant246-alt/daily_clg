import { api } from "./client";
import { orders as dummyOrders } from "@/data/orders";

/** GET /api/orders, GET /api/orders/:id, POST /api/orders */
export const fetchOrders = async () => {
  try {
    return (await api.get("/orders")).data;
  } catch {
    return dummyOrders;
  }
};

export const fetchOrder = async (id: string) => {
  try {
    return (await api.get(`/orders/${id}`)).data;
  } catch {
    return dummyOrders.find((o) => o.id === id) ?? null;
  }
};

export const placeOrder = async (payload: unknown) => {
  try {
    return (await api.post("/orders", payload)).data;
  } catch {
    return { success: true, orderNumber: `#DLY-${Math.floor(1002 + Math.random() * 900)}`, payload };
  }
};

export const repeatOrder = async (id: string) => {
  try {
    return (await api.post(`/orders/${id}/repeat`)).data;
  } catch {
    return { success: true, id };
  }
};

export const downloadInvoice = async (id: string) => {
  return { success: true, url: `/invoices/${id}.pdf` };
};
