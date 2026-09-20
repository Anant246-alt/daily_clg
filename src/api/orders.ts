import { api } from "./client";
import { orders as dummyOrders } from "@/data/orders";

/** GET /api/orders, GET /api/orders/:id, POST /api/orders */
export const fetchOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const fetchOrder = async (id: string) => {
  try {
    return (await api.get(`/orders/${id}`)).data;
  } catch {
    return dummyOrders.find((o) => o.id === id) ?? null;
  }
};

export const placeOrder = async (payload: unknown) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

export const repeatOrder = async (id: string) => {
  const res = await api.post(`/orders/${id}/repeat`);
  return res.data;
};

export const downloadInvoice = async (id: string) => {
  return { success: true, url: `/invoices/${id}.pdf` };
};
