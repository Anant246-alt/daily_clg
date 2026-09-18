import { api } from "./client";

export type AdminUser = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
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
