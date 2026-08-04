import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { OrderCard } from "@/components/OrderCard";
import { EmptyState } from "@/components/States";
import { useOrders } from "@/context/OrderContext";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/")({
  head: () => ({
    meta: [
      { title: "Your orders · Daily" },
      { name: "description", content: "Track current Daily orders and revisit past ones." },
      { property: "og:title", content: "Your orders · Daily" },
      { property: "og:description", content: "Track current Daily orders and revisit past ones." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useOrders();
  const [tab, setTab] = useState<"current" | "past">("current");
  const current = orders.filter((o) => o.status === "Preparing" || o.status === "On the way");
  const past = orders.filter((o) => o.status === "Delivered" || o.status === "Cancelled");
  const list = tab === "current" ? current : past;

  return (
    <AppShell title="Your orders">
      <PageTransition>
        <div className="space-y-4">
          <div className="flex gap-2 rounded-full border border-border bg-card p-1">
            {(["current", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-full py-2 text-sm font-bold capitalize transition",
                  tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {t} orders
              </button>
            ))}
          </div>

          {list.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {list.map((o) => (
                <OrderCard key={o.id} order={o} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="📦"
              title={tab === "current" ? "No active orders" : "No past orders yet"}
              message="When you place an order it will appear here with live status."
              actionLabel="Order something"
              to="/menu"
            />
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
