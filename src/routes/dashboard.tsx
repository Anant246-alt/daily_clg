import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Daily Healthy Food" }],
  }),
  component: DashboardRedirectPage,
});

function DashboardRedirectPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({ to: "/home", replace: true });
  }, [navigate]);

  return null;
}
