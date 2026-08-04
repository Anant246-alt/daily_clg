import { api } from "./client";

export const fetchCartApi = async () => {
  try {
    return (await api.get("/cart")).data;
  } catch {
    return { items: [], promo: null };
  }
};

export const addToCartApi = async (item: any) => {
  try {
    return (await api.post("/cart", item)).data;
  } catch {
    return { success: true };
  }
};

export const updateCartQtyApi = async (id: string, qty: number) => {
  try {
    return (await api.put("/cart/item", { id, qty })).data;
  } catch {
    return { success: true };
  }
};

export const removeCartItemApi = async (id: string) => {
  try {
    return (await api.delete(`/cart/item/${id}`)).data;
  } catch {
    return { success: true };
  }
};

export const clearCartApi = async () => {
  try {
    return (await api.delete("/cart")).data;
  } catch {
    return { success: true };
  }
};

export const applyPromoApi = async (code: string) => {
  try {
    return (await api.post("/cart/apply-promo", { code })).data;
  } catch {
    return { success: false };
  }
};
