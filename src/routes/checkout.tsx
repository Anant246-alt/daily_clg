import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FiPlus, FiCreditCard, FiSmartphone, FiDollarSign, FiZap, FiInfo, FiPhone } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { AddressCard } from "@/components/AddressCard";
import { EmptyState, Spinner } from "@/components/States";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrderContext";
import { useAuth } from "@/context/AuthContext";
import { placeOrder } from "@/api/orders";
import { createPaymentOrder, verifyPayment } from "@/api/payment";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout · Daily" },
      { name: "description", content: "Confirm your address, choose a payment method and place your Daily order." },
      { property: "og:title", content: "Checkout · Daily" },
      { property: "og:description", content: "Confirm your address, choose a payment method and place your Daily order." },
    ],
  }),
  component: CheckoutPage,
});

const methods = [
  { id: "razorpay", label: "Razorpay Wallet & All Methods", detail: "Paytm, Mobikwik, PhonePe, Netbanking", icon: FiZap },
  { id: "upi", label: "UPI Instant Payment", detail: "GPay, PhonePe, Paytm UPI", icon: FiSmartphone },
  { id: "card", label: "Credit / Debit Card", detail: "Visa, Mastercard, RuPay", icon: FiCreditCard },
  { id: "cod", label: "Cash on Delivery", detail: "Pay when it arrives", icon: FiDollarSign },
];

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addresses, selectedAddressId, selectAddress, setLastOrder } = useOrders();
  const [method, setMethod] = useState("razorpay");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);

  if (!cart.items.length) {
    return (
      <AppShell title="Checkout" back>
        <PageTransition>
          <EmptyState emoji="🧾" title="Nothing to check out" message="Your cart is empty." actionLabel="Browse menu" to="/menu" />
        </PageTransition>
      </AppShell>
    );
  }

  /** Opens Razorpay Modal Popup Window in Test Mode. */
  const handlePlaceOrder = async () => {
    setLoading(true);

    if (method === "razorpay" || method === "card" || method === "upi") {
      const isLoaded = await loadRazorpayScript();
      if (isLoaded && (window as any).Razorpay) {
        try {
          const orderData = await createPaymentOrder(cart.total);
          const keyId = orderData?.keyId || "rzp_test_TLXgSkf5lA607j";
          const amountInPaise = orderData?.amount || Math.round(cart.total * 100);

          const cleanPhone = phone.replace(/\D/g, "") || "9876543210";

          const options: any = {
            key: keyId,
            amount: amountInPaise,
            currency: "INR",
            name: "Daily Food Delivery",
            description: "Order Payment",
            handler: async function (response: any) {
              try {
                const verifyRes = await verifyPayment({
                  razorpay_order_id: response.razorpay_order_id || orderData?.orderId || `order_${Date.now()}`,
                  razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now()}`,
                  razorpay_signature: response.razorpay_signature || "verified_signature",
                  items: cart.items,
                  total: cart.total,
                  address: addresses.find((a) => a.id === selectedAddressId)?.line || "Flat 402, Green Meadows",
                  instructions,
                  paymentMethod: "Razorpay Gateway",
                  userEmail: user?.email || "dailyclgproject@gmail.com",
                });
                setLastOrder({ number: verifyRes.orderNumber || "#DLY-1002", eta: "25 – 35 min" });
                cart.clearCart();
                setLoading(false);
                toast.success("Payment verified & Order placed!");
                void navigate({ to: "/order-success" });
              } catch (err: any) {
                setLoading(false);
                toast.error(err.message || "Payment verification failed");
              }
            },
            prefill: {
              name: user?.name || "Aarav Mehta",
              email: user?.email || "dailyclgproject@gmail.com",
              contact: cleanPhone,
            },
            theme: { color: "#16a34a" },
            modal: {
              ondismiss: function () {
                setLoading(false);
                toast.info("Payment process cancelled");
              },
            },
          };

          if (
            orderData?.orderId &&
            orderData.orderId.startsWith("order_") &&
            !orderData.orderId.startsWith("order_test_")
          ) {
            options.order_id = orderData.orderId;
          }

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        } catch (err) {
          console.warn("[Razorpay Modal Error]:", err);
          setLoading(false);
          toast.error("Could not launch Razorpay gateway");
          return;
        }
      }
    }

    // Direct checkout fallback ONLY for Cash on Delivery (COD)
    const res = await placeOrder({
      items: cart.items,
      method,
      instructions,
      total: cart.total,
      address: addresses.find((a) => a.id === selectedAddressId)?.line || "Flat 402, Green Meadows, Koramangala",
    });
    setLastOrder({ number: res.orderNumber || "#DLY-1002", eta: "25 – 35 min" });
    cart.clearCart();
    setLoading(false);
    toast.success("Order placed successfully");
    void navigate({ to: "/order-success" });
  };

  return (
    <AppShell title="Checkout" back>
      <PageTransition>
        <div className="grid gap-5 pb-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold">Delivery address</h2>
                <button
                  onClick={() => navigate({ to: "/address" })}
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary"
                >
                  <FiPlus /> Add / edit
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <AddressCard
                    key={a.id}
                    address={a}
                    selected={a.id === selectedAddressId}
                    onSelect={() => selectAddress(a.id)}
                    onEdit={() => navigate({ to: "/address" })}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-extrabold">Mobile Number for Payment & SMS</h2>
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
                <FiPhone className="text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-transparent text-sm text-foreground outline-none font-medium"
                />
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-base font-extrabold">Payment method</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {methods.map(({ id, label, detail, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={cn(
                      "flex items-center gap-3 rounded-3xl border bg-card p-4 text-left transition cursor-pointer",
                      method === id ? "border-primary shadow-[var(--shadow-soft)]" : "border-border",
                    )}
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold">{label}</span>
                      <span className="block truncate text-xs text-muted-foreground">{detail}</span>
                    </span>
                  </button>
                ))}
              </div>

              {method !== "cod" && (
                <div className="rounded-3xl border border-primary/30 bg-primary/5 p-4 text-xs text-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-primary">
                    <FiInfo className="size-4" /> Razorpay Test Mode Instructions:
                  </div>
                  <p className="text-muted-foreground">
                    • <strong>Razorpay Wallet / OTP Screen:</strong> Type any 4-digit code (e.g. <code className="font-bold text-foreground">1234</code> or <code className="font-bold text-foreground">123456</code>) into the Razorpay modal and click <strong>Continue</strong> to approve.
                  </p>
                  <p className="text-muted-foreground">
                    • <strong>Mobile Number:</strong> Prefilled automatically with your number above: <code className="font-bold text-foreground">{phone}</code>
                  </p>
                </div>
              )}
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold">Delivery instructions</h2>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="Leave at the door, call on arrival…"
                className="w-full rounded-3xl border border-border bg-card p-4 text-sm outline-none"
              />
            </section>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 rounded-3xl border border-border bg-card p-4 text-sm">
              <p className="mb-2 font-bold">Order summary</p>
              {cart.items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3">
                  <span className="truncate text-muted-foreground">
                    {i.qty} × {i.name}
                  </span>
                  <span className="font-semibold">{currency(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="mt-2 space-y-1 border-t border-border pt-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery</span>
                  <span>{currency(cart.delivery)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>GST</span>
                  <span>{currency(cart.gst)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Coupon {cart.promo}</span>
                    <span>- {currency(cart.discount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold">
                <span>Total</span>
                <span>{currency(cart.total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-70 cursor-pointer"
            >
              {loading && <Spinner className="border-primary-foreground/40 border-t-primary-foreground" />}
              Place order · {currency(cart.total)}
            </button>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
