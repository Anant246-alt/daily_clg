import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiShoppingBag,
  FiHeart,
  FiClipboard,
  FiUser,
  FiHelpCircle,
  FiLogOut,
  FiChevronRight,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiBell,
  FiStar,
  FiShield,
  FiFileText,
} from "react-icons/fi";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition, FadeIn } from "@/components/PageTransition";
import { ProductCard } from "@/components/ProductCard";
import { OrderCard } from "@/components/OrderCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useOrders } from "@/context/OrderContext";
import { useNotifications } from "@/context/NotificationContext";
import { products } from "@/data/products";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Daily Healthy Food Portal" },
      { name: "description", content: "Overview of your healthy food orders, cart, wishlist, and profile activity." },
      { property: "og:title", content: "Dashboard · Daily Healthy Food Portal" },
      { property: "og:description", content: "Overview of your healthy food orders, cart, wishlist, and profile activity." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, hydrated, signOut } = useAuth();
  const { count: cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { orders } = useOrders();
  const { unreadCount } = useNotifications();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      void navigate({ to: "/login" });
    }
  }, [hydrated, isAuthenticated, navigate]);

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  const pendingOrders = orders.filter((o) => o.status === "Preparing" || o.status === "On the way");
  const completedOrders = orders.filter((o) => o.status === "Delivered");
  const activeOrder = pendingOrders[0]; // Active order for progress stepper

  const recentOrders = orders.slice(0, 3);
  const featuredProducts = products.filter((p) => p.bestSeller || p.popular).slice(0, 4);

  return (
    <AppShell title="Dashboard">
      <PageTransition>
        <div className="space-y-6 pb-6">
          {/* Welcome Banner / Header Card */}
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary-soft/30 p-6 shadow-[var(--shadow-card)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-16 rounded-2xl object-cover border-2 border-primary/30 shadow-md shrink-0"
                  />
                ) : (
                  <div className="grid size-16 place-items-center rounded-2xl bg-primary text-2xl font-black text-primary-foreground shadow-md shrink-0">
                    {(user?.name ?? "U").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                    <span className="size-2 rounded-full bg-primary animate-pulse" />
                    Member Dashboard
                  </span>
                  <h1 className="mt-1 text-2xl font-black tracking-tight">
                    Welcome back, <span className="text-primary">{user?.name ?? "Daily User"}</span>!
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Header Action Icons */}
              <div className="flex items-center gap-2">
                <Link
                  to="/notifications"
                  aria-label="Notifications"
                  className="relative grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm hover:border-primary/50 transition"
                  title="Notifications"
                >
                  <FiBell className="size-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-extrabold text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/profile"
                  className="grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm hover:border-primary/50 transition"
                  title="My Profile"
                >
                  <FiUser className="size-5 text-primary" />
                </Link>

                <button
                  onClick={() => {
                    signOut();
                    void navigate({ to: "/login" });
                  }}
                  className="grid size-11 place-items-center rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
                  title="Logout"
                >
                  <FiLogOut className="size-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards Grid */}
          <SectionTitle title="Overview & Stats" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <StatCard
              icon={FiPackage}
              label="Total Orders"
              value={orders.length}
              to="/orders"
              color="text-primary"
              bgColor="bg-primary-soft"
            />
            <StatCard
              icon={FiClock}
              label="Pending Orders"
              value={pendingOrders.length}
              to="/orders"
              color="text-amber-500"
              bgColor="bg-amber-500/10"
            />
            <StatCard
              icon={FiCheckCircle}
              label="Completed Orders"
              value={completedOrders.length}
              to="/orders"
              color="text-emerald-500"
              bgColor="bg-emerald-500/10"
            />
            <StatCard
              icon={FiHeart}
              label="Wishlist Items"
              value={wishlist.length}
              to="/wishlist"
              color="text-rose-500"
              bgColor="bg-rose-500/10"
            />
            <StatCard
              icon={FiShoppingBag}
              label="Cart Items"
              value={cartCount}
              to="/cart"
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            />
          </div>

          {/* Active Order Progress Stepper Section */}
          {activeOrder && (
            <FadeIn>
              <div className="rounded-3xl border border-primary/30 bg-card p-5 shadow-[var(--shadow-card)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative flex size-3">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex size-3 rounded-full bg-primary" />
                    </span>
                    <h2 className="text-base font-extrabold">Active Order #{activeOrder.number}</h2>
                  </div>
                  <Link
                    to="/orders/$id"
                    params={{ id: activeOrder.id }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    Track order <FiChevronRight />
                  </Link>
                </div>

                {/* Progress Timeline Stepper */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { label: "Placed", status: "Order placed", done: true },
                    { label: "Confirmed", status: "Restaurant confirmed", done: true },
                    { label: "Preparing", status: "Preparing your food", done: activeOrder.status === "Preparing" || activeOrder.status === "On the way" },
                    { label: "On the way", status: "Out for delivery", done: activeOrder.status === "On the way" },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div
                        className={cn(
                          "grid size-8 place-items-center rounded-full text-xs font-extrabold transition",
                          step.done ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {step.done ? <FiCheckCircle className="size-4" /> : i + 1}
                      </div>
                      <span className="mt-1.5 text-[11px] font-bold truncate max-w-full">{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Quick Actions Bar */}
          <SectionTitle title="Quick Actions" />
          <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
            <QuickActionButton to="/menu" icon={FiGrid} label="Browse Healthy Foods" />
            <QuickActionButton to="/cart" icon={FiShoppingBag} label="View Cart" badge={cartCount} />
            <QuickActionButton to="/orders" icon={FiClipboard} label="Track My Orders" />
            <QuickActionButton to="/profile/edit" icon={FiUser} label="Edit Profile" />
            <QuickActionButton to="/help" icon={FiHelpCircle} label="Contact Support" />
          </div>

          {/* Main Grid: Recent Orders & Quick Navigation Links */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Recent Orders List (2 columns on lg) */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold">Recent Orders</h2>
                <Link to="/orders" className="text-xs font-bold text-primary hover:underline">
                  View all ({orders.length})
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center space-y-3">
                  <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary-soft text-primary text-xl font-bold">
                    📦
                  </div>
                  <div>
                    <p className="text-base font-extrabold">No orders placed yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Explore our delicious healthy menu and place your first order.
                    </p>
                  </div>
                  <Link
                    to="/menu"
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
                  >
                    Browse Menu <FiArrowRight />
                  </Link>
                </div>
              )}
            </div>

            {/* Sidebar Quick Links Navigation */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold">Navigation & Support</h2>
              <div className="overflow-hidden rounded-3xl border border-border bg-card divide-y divide-border">
                {[
                  { to: "/menu", label: "Browse Products", icon: FiGrid },
                  { to: "/cart", label: "Shopping Cart", icon: FiShoppingBag, badge: cartCount },
                  { to: "/wishlist", label: "Wishlist", icon: FiHeart, badge: wishlist.length },
                  { to: "/orders", label: "My Orders & History", icon: FiClipboard },
                  { to: "/profile", label: "My Profile", icon: FiUser },
                  { to: "/review", label: "Reviews and Ratings", icon: FiStar },
                  { to: "/help", label: "Customer Support", icon: FiHelpCircle },
                  { to: "/privacy", label: "Privacy Policy", icon: FiShield },
                  { to: "/terms", label: "Terms & Conditions", icon: FiFileText },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold hover:bg-muted/50 transition group"
                  >
                    <span className="grid size-8 place-items-center rounded-xl bg-primary-soft text-primary group-hover:bg-primary group-hover:text-primary-foreground transition">
                      <item.icon className="size-4" />
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {typeof item.badge === "number" && item.badge > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
                        {item.badge}
                      </span>
                    )}
                    <FiChevronRight className="text-muted-foreground group-hover:text-foreground transition" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended / Featured Products Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold">Recommended Healthy Foods</h2>
                <p className="text-xs text-muted-foreground">Fresh chef-crafted meals for your daily diet</p>
              </div>
              <Link to="/menu" className="text-xs font-bold text-primary hover:underline">
                View Menu
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-base font-extrabold tracking-tight">{title}</h2>;
}

function StatCard({
  icon: Icon,
  label,
  value,
  to,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: number;
  to: string;
  color: string;
  bgColor: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-3xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={cn("grid size-10 place-items-center rounded-2xl transition", bgColor, color)}>
          <Icon className="size-5" />
        </span>
        <FiChevronRight className="text-muted-foreground/50 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
      </div>
      <p className="mt-3 text-2xl font-black">{value}</p>
      <p className="truncate text-xs font-semibold text-muted-foreground mt-0.5">{label}</p>
    </Link>
  );
}

function QuickActionButton({
  to,
  icon: Icon,
  label,
  badge,
}: {
  to: string;
  icon: any;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2.5 text-xs font-bold transition hover:border-primary/40 hover:bg-primary-soft/40 shadow-sm"
    >
      <Icon className="size-4 text-primary" />
      <span>{label}</span>
      {typeof badge === "number" && badge > 0 && (
        <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-extrabold text-primary-foreground">
          {badge}
        </span>
      )}
    </Link>
  );
}
