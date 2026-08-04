import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiMenu,
  FiBell,
  FiHome,
  FiGrid,
  FiClipboard,
  FiShoppingBag,
  FiUser,
  FiHeart,
  FiX,
  FiShield,
  FiFileText,
  FiHelpCircle,
  FiLogOut,
  FiMoon,
  FiSun,
  FiArrowLeft,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { notifications } from "@/data/notifications";
import { greeting } from "@/utils/format";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/home", label: "Home", icon: FiHome },
  { to: "/menu", label: "Menu", icon: FiGrid },
  { to: "/orders", label: "Orders", icon: FiClipboard },
  { to: "/cart", label: "Cart", icon: FiShoppingBag },
  { to: "/profile", label: "Profile", icon: FiUser },
] as const;

const menuLinks = [
  ...navItems,
  { to: "/wishlist", label: "Wishlist", icon: FiHeart },
  { to: "/help", label: "Help Center", icon: FiHelpCircle },
  { to: "/privacy", label: "Privacy Policy", icon: FiShield },
  { to: "/terms", label: "Terms & Conditions", icon: FiFileText },
] as const;

/** App chrome: top bar, slide-in sidebar, sticky bottom navigation. */
export function AppShell({
  children,
  title,
  showGreeting,
  back,
}: {
  children: ReactNode;
  title?: string;
  showGreeting?: boolean;
  back?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-10">
      {/* Top bar */}
      <header className="glass sticky top-0 z-40">
        <div className="mx-auto grid max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
          {back ? (
            <button
              onClick={() => window.history.back()}
              aria-label="Go back"
              className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-card"
            >
              <FiArrowLeft />
            </button>
          ) : (
            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border bg-card"
            >
              <FiMenu />
            </button>
          )}

          <div className="min-w-0">
            {showGreeting ? (
              <>
                <p className="truncate text-xs text-muted-foreground">{greeting()},</p>
                <p className="truncate text-sm font-extrabold">{user?.name ?? "Guest"}</p>
              </>
            ) : (
              <p className="truncate text-base font-extrabold">{title ?? "Daily"}</p>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="grid size-10 place-items-center rounded-2xl border border-border bg-card"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <Link
              to="/notifications"
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-2xl border border-border bg-card"
            >
              <FiBell />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              aria-label="Profile"
              className="overflow-hidden grid size-10 place-items-center rounded-2xl bg-primary-soft text-sm font-bold text-primary border border-primary/20"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="size-full object-cover" />
              ) : (
                (user?.name ?? "G").slice(0, 1).toUpperCase()
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-xs flex-col gap-4 border-r border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="grid size-10 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-foreground">
                    D
                  </span>
                  <div>
                    <p className="font-extrabold leading-tight">Daily</p>
                    <p className="text-xs text-muted-foreground">Fresh food, fast</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-9 place-items-center rounded-full border border-border">
                  <FiX />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
                {menuLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                      pathname === to ? "bg-primary-soft text-primary" : "hover:bg-muted",
                    )}
                  >
                    <Icon /> {label}
                  </Link>
                ))}
              </nav>

              <button
                onClick={() => {
                  signOut();
                  setOpen(false);
                  void navigate({ to: "/login" });
                }}
                className="flex items-center gap-3 rounded-2xl border border-border px-3 py-3 text-sm font-bold text-destructive"
              >
                <FiLogOut /> Logout
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-6xl px-4 py-4">{children}</main>

      {/* Bottom navigation */}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-2">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="relative flex w-16 flex-col items-center gap-1 py-1.5 text-[11px] font-semibold"
              >
                <span className={cn("relative", active ? "text-primary" : "text-muted-foreground")}>
                  <Icon size={20} />
                  {to === "/cart" && count > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                      {count}
                    </span>
                  )}
                </span>
                <span className={active ? "text-primary" : "text-muted-foreground"}>{label}</span>
                {active && (
                  <motion.span layoutId="tab" className="absolute -top-0.5 h-1 w-8 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop side rail */}
      <nav className="fixed bottom-6 left-1/2 z-40 hidden -translate-x-1/2 lg:block">
        <div className="glass flex items-center gap-1 rounded-full px-2 py-2 shadow-[var(--shadow-float)]">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition",
                pathname === to ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
              )}
            >
              <Icon size={16} /> {label}
              {to === "/cart" && count > 0 && (
                <span className="rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                  {count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
