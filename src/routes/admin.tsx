import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiShield,
  FiLock,
  FiTrendingUp,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiGrid,
  FiStar,
  FiRefreshCw,
  FiLogOut,
  FiSearch,
  FiChevronRight,
  FiEdit2,
  FiDollarSign,
  FiAlertCircle,
  FiCheck,
  FiX,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { toast } from "sonner";
import { PageTransition, FadeIn } from "@/components/PageTransition";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { products as initialProducts, type Product } from "@/data/products";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal · Daily Healthy Food" },
      { name: "description", content: "Dedicated Admin Control Panel for order fulfillment, menu management, and store metrics." },
      { property: "og:title", content: "Admin Portal · Daily Healthy Food" },
      { property: "og:description", content: "Dedicated Admin Control Panel for order fulfillment, menu management, and store metrics." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const { orders, createOrder } = useOrders();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Admin authentication state (passcode gate)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("daily.adminAuthenticated") === "true";
  });
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "products" | "customers" | "reviews">("overview");

  // Local state for administrative management
  const [adminOrders, setAdminOrders] = useState(orders);
  const [orderFilter, setOrderFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [productList, setProductList] = useState<Product[]>(initialProducts);

  // Sync orders with OrderContext
  useEffect(() => {
    setAdminOrders(orders);
  }, [orders]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === "123456" || passcode.trim().toLowerCase() === "admin" || passcode.trim() === "admin123") {
      setIsAdminAuthenticated(true);
      localStorage.setItem("daily.adminAuthenticated", "true");
      toast.success("Welcome to Daily Admin Control Panel!");
    } else {
      setPasscodeError("Invalid passcode. Default admin passcode is 123456.");
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem("daily.adminAuthenticated");
    toast.info("Logged out from Admin Control Panel.");
  };

  // Update order status dynamically in state and localStorage
  const handleUpdateOrderStatus = (orderId: string, newStatus: any) => {
    const updated = adminOrders.map((o) => {
      if (o.id === orderId) {
        const newTimeline = o.timeline.map((t) => {
          if (newStatus === "Preparing" && (t.label.includes("Preparing") || t.label.includes("placed") || t.label.includes("confirmed"))) {
            return { ...t, done: true };
          }
          if (newStatus === "On the way" && !t.label.includes("Delivered")) {
            return { ...t, done: true };
          }
          if (newStatus === "Delivered") {
            return { ...t, done: true };
          }
          return t;
        });
        return { ...o, status: newStatus, timeline: newTimeline };
      }
      return o;
    });

    setAdminOrders(updated);
    localStorage.setItem("daily.orders", JSON.stringify(updated));
    toast.success(`Order #${orderId} status updated to ${newStatus}`);
  };

  // Calculate Metrics
  const totalOrders = adminOrders.length;
  const totalRevenue = adminOrders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
  const activeOrders = adminOrders.filter((o) => o.status === "Preparing" || o.status === "On the way").length;
  const completedOrders = adminOrders.filter((o) => o.status === "Delivered").length;
  const cancelledOrders = adminOrders.filter((o) => o.status === "Cancelled").length;

  // Filtered orders list for order manager
  const filteredOrders = adminOrders.filter((o) => {
    const matchesFilter = orderFilter === "all" || o.status.toLowerCase() === orderFilter.toLowerCase();
    const matchesSearch =
      o.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // Admin Gate Screen if not authenticated
  if (!isAdminAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-primary/20 bg-card p-8 shadow-[var(--shadow-float)] space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
              <FiShield className="size-8" />
            </div>
            <span className="inline-block rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
              ADMIN PORTAL
            </span>
            <h1 className="text-2xl font-black tracking-tight">Store Management</h1>
            <p className="text-xs text-muted-foreground">
              Enter the admin passcode to access store analytics and order controls.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold uppercase text-muted-foreground tracking-wider mb-1.5 block">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setPasscodeError("");
                  }}
                  placeholder="Enter passcode (Default: 123456)"
                  className="w-full rounded-2xl border border-border bg-background py-3.5 pl-4 pr-10 text-sm outline-none focus:border-primary transition"
                  autoFocus
                />
                <FiLock className="absolute right-3.5 top-3.5 text-muted-foreground size-5" />
              </div>
              {passcodeError && (
                <p className="mt-2 text-xs font-semibold text-destructive flex items-center gap-1">
                  <FiAlertCircle /> {passcodeError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md hover:opacity-90 transition"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-muted/40 p-3 text-center text-xs text-muted-foreground">
            💡 Default Demo Passcode: <span className="font-extrabold text-foreground">123456</span>
          </div>

          <div className="text-center">
            <Link to="/home" className="text-xs font-bold text-primary hover:underline">
              ← Return to Customer Store
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-md">
              D
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight">DAILY Admin</h1>
                <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                  Control Panel
                </span>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">Live store management & fulfillment dashboard</p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => toast.success("Refreshed store metrics and live order stream!")}
              className="grid size-9 place-items-center rounded-xl border border-border bg-background hover:bg-muted transition"
              title="Refresh Data"
            >
              <FiRefreshCw className="size-4" />
            </button>

            <button
              onClick={toggleTheme}
              className="grid size-9 place-items-center rounded-xl border border-border bg-background hover:bg-muted transition"
              title="Toggle Theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <Link
              to="/home"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-bold hover:bg-muted transition"
            >
              Customer Web App
            </Link>

            <button
              onClick={handleAdminLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive hover:text-destructive-foreground transition"
            >
              <FiLogOut className="size-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="no-scrollbar flex gap-2 border-b border-border pb-3 overflow-x-auto">
          {[
            { id: "overview", label: "Overview & Analytics", icon: FiTrendingUp },
            { id: "orders", label: `Orders (${adminOrders.length})`, icon: FiPackage },
            { id: "products", label: `Menu Items (${productList.length})`, icon: FiGrid },
            { id: "customers", label: "Registered Users", icon: FiUsers },
            { id: "reviews", label: "Reviews & Feedback", icon: FiStar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-extrabold transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === "overview" && (
          <FadeIn className="space-y-6">
            {/* Top Metrics Cards Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <AdminMetricCard
                icon={FiDollarSign}
                label="Total Store Revenue"
                value={currency(totalRevenue)}
                subtext="From completed orders"
                color="text-emerald-500"
                bgColor="bg-emerald-500/10"
              />
              <AdminMetricCard
                icon={FiPackage}
                label="Total Orders"
                value={totalOrders}
                subtext={`${activeOrders} currently active`}
                color="text-blue-500"
                bgColor="bg-blue-500/10"
              />
              <AdminMetricCard
                icon={FiClock}
                label="Active Kitchen Orders"
                value={activeOrders}
                subtext="Preparing or Out for delivery"
                color="text-amber-500"
                bgColor="bg-amber-500/10"
              />
              <AdminMetricCard
                icon={FiUsers}
                label="Registered Users"
                value={user ? 1 : 0}
                subtext="Active customer accounts"
                color="text-purple-500"
                bgColor="bg-purple-500/10"
              />
            </div>

            {/* Live Order Status Distribution */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl border border-border bg-card p-5 space-y-4 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold">Recent Live Customer Orders</h2>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Manage all orders →
                  </button>
                </div>

                {adminOrders.length > 0 ? (
                  <div className="space-y-3">
                    {adminOrders.slice(0, 4).map((o) => (
                      <div
                        key={o.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border p-4 hover:border-primary/30 transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm">{o.number}</span>
                            <OrderStatusBadge status={o.status} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{o.date}</p>
                          <p className="text-xs font-medium text-muted-foreground mt-1 line-clamp-1">
                            {o.items.map((i) => `${i.qty}x ${i.name}`).join(", ")}
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:flex-col sm:items-end">
                          <span className="text-base font-extrabold text-primary">{currency(o.total)}</span>
                          <StatusSelector
                            currentStatus={o.status}
                            onUpdate={(st) => handleUpdateOrderStatus(o.id, st)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
                    No orders placed yet. Live orders will appear here automatically.
                  </div>
                )}
              </div>

              {/* Quick Admin Actions & Information */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-border bg-card p-5 space-y-3">
                  <h2 className="text-base font-extrabold">Quick Admin Operations</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setActiveTab("orders");
                        setOrderFilter("Preparing");
                      }}
                      className="flex w-full items-center justify-between rounded-2xl border border-border p-3 text-xs font-bold hover:bg-muted transition"
                    >
                      <span className="flex items-center gap-2">
                        <FiClock className="text-amber-500" /> Filter Kitchen Preparing
                      </span>
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-500">
                        {adminOrders.filter((o) => o.status === "Preparing").length}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab("orders");
                        setOrderFilter("On the way");
                      }}
                      className="flex w-full items-center justify-between rounded-2xl border border-border p-3 text-xs font-bold hover:bg-muted transition"
                    >
                      <span className="flex items-center gap-2">
                        <FiPackage className="text-blue-500" /> Filter Out For Delivery
                      </span>
                      <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-500">
                        {adminOrders.filter((o) => o.status === "On the way").length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("products")}
                      className="flex w-full items-center justify-between rounded-2xl border border-border p-3 text-xs font-bold hover:bg-muted transition"
                    >
                      <span className="flex items-center gap-2">
                        <FiGrid className="text-primary" /> View Menu Items Catalogue
                      </span>
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-primary">
                        {productList.length}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <FadeIn className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">Customer Orders Management</h2>
                <p className="text-xs text-muted-foreground">View and update live fulfillment statuses</p>
              </div>

              {/* Order Status Filters */}
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
                {["all", "Preparing", "On the way", "Delivered", "Cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={cn(
                      "rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition",
                      orderFilter.toLowerCase() === st.toLowerCase()
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order #, address, or item name..."
                className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-xs outline-none focus:border-primary transition"
              />
              <FiSearch className="absolute left-3.5 top-3.5 text-muted-foreground size-4" />
            </div>

            {/* Orders Feed */}
            {filteredOrders.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm hover:border-primary/40 transition"
                  >
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base">{order.number}</span>
                          <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                      </div>
                      <span className="text-lg font-black text-primary">{currency(order.total)}</span>
                    </div>

                    {/* Customer Items & Delivery Address */}
                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-foreground/90">Items Ordered:</p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            <span className="font-bold text-foreground">{item.qty}x</span> {item.name} ({currency(item.price)})
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-xs text-muted-foreground border-t border-border pt-2.5">
                      <p className="truncate"><span className="font-bold text-foreground">Delivery:</span> {order.address}</p>
                      <p><span className="font-bold text-foreground">Payment:</span> {order.paymentMethod}</p>
                    </div>

                    {/* Interactive Status Update Selector */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-xs font-extrabold text-muted-foreground uppercase">Update Status:</span>
                      <StatusSelector
                        currentStatus={order.status}
                        onUpdate={(st) => handleUpdateOrderStatus(order.id, st)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center text-xs text-muted-foreground">
                No orders match your filter criteria.
              </div>
            )}
          </FadeIn>
        )}

        {/* TAB 3: PRODUCTS & MENU MANAGER */}
        {activeTab === "products" && (
          <FadeIn className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Healthy Foods Catalogue</h2>
                <p className="text-xs text-muted-foreground">Manage products, pricing, and best seller badges</p>
              </div>
              <button
                onClick={() => toast.info("Product catalogue is synced directly with live store data.")}
                className="rounded-2xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
              >
                Sync Products
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {productList.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 rounded-3xl border border-border bg-card p-3.5 shadow-sm hover:border-primary/40 transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-20 rounded-2xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-bold text-sm truncate">{product.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{product.category}</p>
                    <p className="text-sm font-black text-primary">{currency(product.price)}</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      {product.bestSeller && (
                        <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                          Best Seller
                        </span>
                      )}
                      {product.popular && (
                        <span className="rounded-md bg-primary-soft px-2 py-0.5 text-[10px] font-bold text-primary">
                          Popular
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* TAB 4: REGISTERED CUSTOMERS */}
        {activeTab === "customers" && (
          <FadeIn className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold">Registered Customer Directory</h2>
              <p className="text-xs text-muted-foreground">MongoDB Atlas customer profiles</p>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground text-lg font-extrabold">
                  {(user?.name ?? "U").slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-extrabold text-base">{user?.name ?? "Daily User"}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <FiMail /> {user?.email ?? "anantbhattd@gmail.com"}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <FiPhone /> {user?.phone ?? "+91 98765 43210"}
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* TAB 5: REVIEWS & FEEDBACK */}
        {activeTab === "reviews" && (
          <FadeIn className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold">Customer Reviews Monitor</h2>
              <p className="text-xs text-muted-foreground">Feedback submitted by store customers</p>
            </div>

            <div className="rounded-3xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground space-y-2">
              <div className="mx-auto grid size-10 place-items-center rounded-full bg-primary-soft text-primary font-bold">
                ⭐
              </div>
              <p className="font-extrabold text-sm text-foreground">No customer reviews to display</p>
              <p>When customers submit feedback, reviews will appear here for admin moderation.</p>
            </div>
          </FadeIn>
        )}
      </main>
    </div>
  );
}

function AdminMetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
  bgColor,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtext: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn("grid size-10 place-items-center rounded-2xl", bgColor, color)}>
          <Icon className="size-5" />
        </span>
      </div>
      <p className="text-2xl font-black tracking-tight">{value}</p>
      <div>
        <p className="text-xs font-bold truncate">{label}</p>
        <p className="text-[11px] text-muted-foreground truncate">{subtext}</p>
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const getStyle = () => {
    switch (status) {
      case "Preparing":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "On the way":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Delivered":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize", getStyle())}>
      {status}
    </span>
  );
}

function StatusSelector({
  currentStatus,
  onUpdate,
}: {
  currentStatus: string;
  onUpdate: (st: string) => void;
}) {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onUpdate(e.target.value)}
      className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-bold outline-none focus:border-primary cursor-pointer transition"
    >
      <option value="Preparing">Preparing</option>
      <option value="On the way">On the way</option>
      <option value="Delivered">Delivered</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
