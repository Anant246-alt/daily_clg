import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  FiEdit2,
  FiMapPin,
  FiCreditCard,
  FiClipboard,
  FiStar,
  FiHelpCircle,
  FiShield,
  FiFileText,
  FiInfo,
  FiLogOut,
  FiChevronRight,
  FiMoon,
} from "react-icons/fi";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export const Route = createFileRoute("/profile/")({
  head: () => ({
    meta: [
      { title: "Profile · Daily" },
      { name: "description", content: "Manage your Daily account, addresses, payments and preferences." },
      { property: "og:title", content: "Profile · Daily" },
      { property: "og:description", content: "Manage your Daily account, addresses, payments and preferences." },
    ],
  }),
  component: ProfilePage,
});

const links = [
  { to: "/address", label: "Saved addresses", icon: FiMapPin },
  { to: "/orders", label: "Order history", icon: FiClipboard },
  { to: "/review", label: "My reviews", icon: FiStar },
  { to: "/help", label: "Help center", icon: FiHelpCircle },
  { to: "/privacy", label: "Privacy policy", icon: FiShield },
  { to: "/terms", label: "Terms & conditions", icon: FiFileText },
] as const;

function ProfilePage() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <AppShell title="Profile">
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border border-border bg-card p-5">
            <div
              onClick={() => navigate({ to: "/profile/edit" })}
              className="relative group cursor-pointer"
              title="Change profile photo"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="size-16 shrink-0 rounded-3xl object-cover border-2 border-primary/30 shadow-md"
                />
              ) : (
                <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-primary text-2xl font-black text-primary-foreground shadow-md">
                  {(user?.name ?? "G").slice(0, 1).toUpperCase()}
                </span>
              )}
              <span className="absolute -bottom-1 -right-1 grid size-6 place-items-center rounded-full bg-primary text-primary-foreground text-xs shadow-md border-2 border-card">
                <FiEdit2 />
              </span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-extrabold">{user?.name ?? "Guest user"}</p>
              <p className="truncate text-sm text-muted-foreground">{user?.email ?? "Sign in to sync orders"}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.phone}</p>
            </div>
            <Link
              to="/profile/edit"
              aria-label="Edit profile"
              className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border hover:bg-muted/50 transition"
            >
              <FiEdit2 />
            </Link>
          </div>

          <div className="flex items-center justify-between rounded-3xl border border-border bg-card p-4">
            <span className="inline-flex items-center gap-3 text-sm font-semibold">
              <span className="grid size-9 place-items-center rounded-2xl bg-primary-soft text-primary">
                <FiMoon />
              </span>
              Dark mode
            </span>
            <button
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === "dark"}
              className={`h-7 w-12 rounded-full p-1 transition ${theme === "dark" ? "bg-primary" : "bg-muted"}`}
            >
              <span
                className={`block size-5 rounded-full bg-card transition ${theme === "dark" ? "translate-x-5" : ""}`}
              />
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center gap-3 border-b border-border px-4 py-4 text-sm font-semibold last:border-0"
              >
                <span className="grid size-9 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Icon />
                </span>
                <span className="flex-1 truncate">{label}</span>
                <FiChevronRight className="text-muted-foreground" />
              </Link>
            ))}
            <div className="flex items-center gap-3 border-t border-border px-4 py-4 text-sm font-semibold">
              <span className="grid size-9 place-items-center rounded-2xl bg-primary-soft text-primary">
                <FiCreditCard />
              </span>
              <span className="flex-1">Payment methods</span>
              <span className="text-xs text-muted-foreground">UPI · Card · COD</span>
            </div>
            <div className="flex items-center gap-3 border-t border-border px-4 py-4 text-sm font-semibold">
              <span className="grid size-9 place-items-center rounded-2xl bg-primary-soft text-primary">
                <FiInfo />
              </span>
              <span className="flex-1">About Daily</span>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </div>

          <button
            onClick={() => {
              signOut();
              void navigate({ to: "/login" });
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/40 py-3.5 font-bold text-destructive"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </PageTransition>
    </AppShell>
  );
}
