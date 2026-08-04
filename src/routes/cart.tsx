import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiTrash2, FiTag } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { QuantitySelector } from "@/components/QuantitySelector";
import { EmptyState } from "@/components/States";
import { VegBadge } from "@/components/Rating";
import { useCart } from "@/context/CartContext";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart · Daily" },
      { name: "description", content: "Review your Daily order, apply a promo code and checkout." },
      { property: "og:title", content: "Your cart · Daily" },
      { property: "og:description", content: "Review your Daily order, apply a promo code and checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const [code, setCode] = useState("");

  if (!cart.items.length) {
    return (
      <AppShell title="Your cart" back>
        <PageTransition>
          <EmptyState
            emoji="🛒"
            title="Your cart is empty"
            message="Add a salad, sub or iced tea and it will show up here."
            actionLabel="Browse menu"
            to="/menu"
          />
        </PageTransition>
      </AppShell>
    );
  }

  return (
    <AppShell title="Your cart" back>
      <PageTransition>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-3">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  exit={{ opacity: 0, x: -30 }}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="size-20 shrink-0 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <VegBadge veg={item.veg} />
                      <p className="truncate font-bold">{item.name}</p>
                    </div>
                    <p className="text-sm font-extrabold">{currency(item.price)}</p>
                    <QuantitySelector qty={item.qty} onChange={(q) => cart.setQty(item.id, q)} />
                  </div>
                  <button
                    onClick={() => {
                      cart.removeItem(item.id);
                      toast.success("Item removed");
                    }}
                    aria-label="Remove item"
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-destructive"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="space-y-3 rounded-3xl border border-border bg-card p-4">
              <p className="inline-flex items-center gap-2 text-sm font-bold">
                <FiTag /> Promo code
              </p>
              <div className="flex gap-2">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="DAILY50"
                  className="w-full min-w-0 rounded-2xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
                />
                <button
                  onClick={() => {
                    if (cart.applyPromo(code)) toast.success(`${code.toUpperCase()} applied`);
                    else toast.error("Invalid promo code");
                  }}
                  className="shrink-0 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground"
                >
                  Apply
                </button>
              </div>
              {cart.promo && (
                <p className="flex items-center justify-between text-xs font-semibold text-primary">
                  {cart.promo} applied
                  <button onClick={cart.clearPromo} className="text-muted-foreground underline">
                    Remove
                  </button>
                </p>
              )}
            </div>

            <div className="space-y-2 rounded-3xl border border-border bg-card p-4 text-sm">
              <p className="mb-2 font-bold">Order summary</p>
              <Row label="Item total" value={currency(cart.subtotal)} />
              <Row label="Delivery charges" value={currency(cart.delivery)} />
              <Row label="GST (5%)" value={currency(cart.gst)} />
              {cart.discount > 0 && <Row label="Discount" value={`- ${currency(cart.discount)}`} accent />}
              <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-extrabold">
                <span>Grand total</span>
                <span>{currency(cart.total)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="block rounded-2xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-[var(--shadow-soft)]"
            >
              Proceed to checkout
            </Link>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={accent ? "font-semibold text-primary" : "font-semibold"}>{value}</span>
    </div>
  );
}
