import axios from "axios";

// Always use relative /api path so HTTP requests stay on the current deployment domain (e.g. daily-clg-swart.vercel.app/api)
// preventing cross-origin CORS errors.
export const api = axios.create({
  baseURL: "/api",
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
