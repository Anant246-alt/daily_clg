import { api } from "./client";

export const fetchWishlistApi = async () => {
  try {
    return (await api.get("/wishlist")).data;
  } catch {
    return { products: ["p4", "p1"] };
  }
};

export const toggleWishlistApi = async (productId: string) => {
  try {
    return (await api.post(`/wishlist/toggle/${productId}`)).data;
  } catch {
    return { success: true };
  }
};
