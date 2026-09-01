import axios from "axios";

const apiUrl = import.meta.env["VITE_API_URL"] || "";

// Detect static Vercel SPA or local client mode without live CORS backend server
export const isClientOnlyMode =
  !apiUrl ||
  apiUrl.includes("localhost") ||
  apiUrl.includes("vercel.app");

export const api = axios.create({
  baseURL: apiUrl || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach the JWT issued by backend
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("daily.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const mockRequest = <T>(data: T, delay = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));
