import { api } from "./client";
import { notifications as dummyNotifications } from "@/data/notifications";

export const fetchNotificationsApi = async () => {
  try {
    return (await api.get("/notifications")).data;
  } catch {
    return dummyNotifications;
  }
};

export const markNotificationReadApi = async (id: string) => {
  try {
    return (await api.put(`/notifications/${id}/read`)).data;
  } catch {
    return { success: true, id };
  }
};
