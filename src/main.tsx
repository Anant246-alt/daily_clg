import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

// Global error guard to catch and suppress third-party / VM performance reporting errors
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    if (
      event.message?.includes("startTime") ||
      event.message?.includes("reportAllChanges") ||
      (event.error?.stack && event.error.stack.includes("reportAllChanges"))
    ) {
      event.preventDefault();
      event.stopPropagation();
      return true;
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (
      event.reason?.message?.includes("startTime") ||
      (event.reason?.stack && event.reason.stack.includes("reportAllChanges"))
    ) {
      event.preventDefault();
    }
  });
}

const router = getRouter();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

