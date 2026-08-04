import axios from "axios";

/**
 * Shared axios instance. Point VITE_API_URL at the Node/Express backend
 * (e.g. http://localhost:5000/api) when it exists — nothing else changes.
 */
export const api = axios.create({
  baseURL: import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach the JWT issued by the Express backend.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("daily.token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Simulates a network round trip while the backend does not exist yet. */
export const mockRequest = <T>(data: T, delay = 700): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));
