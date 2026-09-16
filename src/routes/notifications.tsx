import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiCheckCircle, FiChevronRight } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { useNotifications } from "@/context/NotificationContext";
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
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const navigate = useNavigate();

  const list = tab === "All" ? notifications : notifications.filter((n) => n.type === tab);

  const handleNotificationClick = (id: string, type: string, title: string) => {
    markAsRead(id);
    toast.info(`Opened: ${title}`);

    // Route dynamically based on notification content
    if (type === "Order Updates") {
      void navigate({ to: "/orders" });
    } else if (type === "Offers") {
      void navigate({ to: "/checkout" });
    } else {
      void navigate({ to: "/menu" });
    }
  };

  return (
    <AppShell title="Notifications" back>
      <PageTransition>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold cursor-pointer transition",
                    tab === t ? "border-primary bg-primary-soft text-primary shadow-xs" : "border-border bg-card text-muted-foreground hover:bg-accent",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={() => {
                  markAllAsRead();
                  toast.success("All notifications marked as read");
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline shrink-0 cursor-pointer"
              >
                <FiCheckCircle className="size-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="space-y-3">
            {list.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
                <p className="text-base font-bold">No notifications</p>
                <p className="text-xs">You're all caught up!</p>
              </div>
            ) : (
              list.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n.id, n.type, n.title)}
                  className={cn(
                    "w-full text-left space-y-1.5 rounded-3xl border p-4 transition duration-150 cursor-pointer hover:shadow-md hover:border-primary/50 active:scale-[0.99]",
                    n.unread ? "border-primary/40 bg-primary-soft/30 shadow-xs" : "border-border bg-card opacity-90",
                  )}
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <p className="truncate text-sm font-bold text-foreground">{n.title}</p>
                    <div className="flex items-center gap-2">
                      {n.unread && <span className="size-2.5 shrink-0 rounded-full bg-destructive animate-pulse" />}
                      <FiChevronRight className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.body}</p>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <span className="font-semibold text-primary/80">{n.type}</span>
                    <span>{n.time}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
