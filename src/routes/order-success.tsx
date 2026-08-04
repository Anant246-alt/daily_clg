import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { useOrders } from "@/context/OrderContext";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order placed · Daily" },
      { name: "description", content: "Your Daily order is confirmed and on its way." },
      { property: "og:title", content: "Order placed · Daily" },
      { property: "og:description", content: "Your Daily order is confirmed and on its way." },
    ],
  }),
  component: OrderSuccessPage,
});

function OrderSuccessPage() {
  const { lastOrder, orders } = useOrders();
  const number = lastOrder?.number ?? "#DLY-1002";
  const eta = lastOrder?.eta ?? "25 – 35 min";
  const trackId = orders[0]?.id ?? "o1001";

  return (
    <AppShell title="Order placed">
      <PageTransition>
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 160 }}
            className="grid size-24 place-items-center rounded-full bg-primary text-5xl text-primary-foreground shadow-[var(--shadow-float)]"
          >
            <FiCheck />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute size-40 rounded-full bg-primary/20 blur-2xl"
          />
          <h1 className="text-2xl font-black">Order confirmed!</h1>
          <p className="text-sm text-muted-foreground">
            Thanks for ordering with Daily. Your food is being prepared fresh right now.
          </p>

          <div className="w-full space-y-2 rounded-3xl border border-border bg-card p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order number</span>
              <span className="font-bold">{number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated delivery</span>
              <span className="font-bold">{eta}</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Link
              to="/orders/$id"
              params={{ id: trackId }}
              className="flex-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground"
            >
              Track order
            </Link>
            <Link to="/menu" className="flex-1 rounded-2xl border border-border py-3 font-bold">
              Continue shopping
            </Link>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
