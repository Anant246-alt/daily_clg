import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { notifications as seed } from "@/data/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Daily" },
      { name: "description", content: "Order updates, offers and promotions from Daily." },
      { property: "og:title", content: "Notifications · Daily" },
      { property: "og:description", content: "Order updates, offers and promotions from Daily." },
    ],
  }),
  component: NotificationsPage,
});

const tabs = ["All", "Order Updates", "Offers", "Promotions"] as const;

function NotificationsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const list = tab === "All" ? seed : seed.filter((n) => n.type === tab);

  return (
    <AppShell title="Notifications" back>
      <PageTransition>
        <div className="space-y-4">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  tab === t ? "border-primary bg-primary-soft text-primary" : "border-border bg-card",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {list.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "space-y-1 rounded-3xl border bg-card p-4",
                  n.unread ? "border-primary/40 bg-primary-soft/40" : "border-border",
                )}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                  <p className="truncate text-sm font-bold">{n.title}</p>
                  {n.unread && <span className="mt-1 size-2 shrink-0 rounded-full bg-destructive" />}
                </div>
                <p className="text-xs text-muted-foreground">{n.body}</p>
                <p className="text-[11px] text-muted-foreground">
                  {n.type} · {n.time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
