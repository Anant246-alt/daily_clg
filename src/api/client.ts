import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env["VITE_API_URL"] || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("daily.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mockRequest = <T>(data: T, delay = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));
