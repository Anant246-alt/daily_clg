import { api } from "./client";
import { products as dummyProducts } from "@/data/products";
import { categories as dummyCategories } from "@/data/categories";

/** GET /api/products, /api/products/:id, /api/categories, /api/search */
export const fetchProducts = async () => {
  try {
    return (await api.get("/products")).data;
  } catch {
    return dummyProducts;
  }
};

export const fetchProduct = async (id: string) => {
  try {
    return (await api.get(`/products/${id}`)).data;
  } catch {
    return dummyProducts.find((p) => p.id === id) ?? null;
  }
};

export const fetchByCategory = async (slug: string) => {
  try {
    return (await api.get(`/products/category/${slug}`)).data;
  } catch {
    return dummyProducts.filter((p) => p.category === slug);
  }
};

export const fetchCategories = async () => {
  try {
    return (await api.get("/categories")).data;
  } catch {
    return dummyCategories;
  }
};

export const searchProducts = async (q: string) => {
  try {
    return (await api.get("/search", { params: { q } })).data;
  } catch {
    return dummyProducts.filter((p) => `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  }
};

export const fetchBannersAndOffers = async () => {
  try {
    return (await api.get("/banners")).data;
  } catch {
    return { banners: [], offers: [] };
  }
};
