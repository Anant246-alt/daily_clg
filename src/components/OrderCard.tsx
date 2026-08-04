import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Order } from "@/data/orders";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Delivered: "bg-primary-soft text-primary",
  Preparing: "bg-accent text-accent-foreground",
  "On the way": "bg-accent text-accent-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
};

export function OrderCard({ order }: { order: Order }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold">{order.number}</p>
          <p className="text-xs text-muted-foreground">{order.date}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-bold", statusStyles[order.status])}>
          {order.status}
        </span>
      </div>

      <ul className="space-y-1 text-sm text-muted-foreground">
        {order.items.map((i) => (
          <li key={i.id} className="truncate">
            {i.qty} × {i.name}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="font-extrabold">{currency(order.total)}</span>
        <div className="flex gap-2">
          <button
            onClick={() => toast.success("Items added to cart again")}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
          >
            Repeat order
          </button>
          <Link
            to="/orders/$id"
            params={{ id: order.id }}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
          >
            View details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
