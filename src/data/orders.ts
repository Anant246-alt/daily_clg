/** Dummy orders — replace with GET /api/orders later. */
export type OrderStatus = "Preparing" | "On the way" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  address: string;
  items: { id: string; name: string; qty: number; price: number }[];
  timeline: { label: string; time: string; done: boolean }[];
};

export const orders: Order[] = [];
