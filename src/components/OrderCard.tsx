import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Order } from "@/data/orders";
import { products, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { currency } from "@/utils/format";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  Delivered: "bg-primary-soft text-primary font-extrabold",
  Preparing: "bg-amber-500/10 text-amber-500 font-extrabold",
  "On the way": "bg-blue-500/10 text-blue-500 font-extrabold",
  "Out for Delivery": "bg-blue-500/10 text-blue-500 font-extrabold",
  "Order Confirmed": "bg-emerald-500/10 text-emerald-500 font-extrabold",
  Cancelled: "bg-destructive/10 text-destructive font-extrabold",
};

export function OrderCard({ order }: { order: Order }) {
  const { addMultipleItems } = useCart();
  const navigate = useNavigate();

  const handleRepeatOrder = () => {
    const itemsToAdd: { product: Product; qty: number }[] = order.items.map((item) => {
      const foundProduct = products.find(
        (p) => p.id === item.id || p.name.toLowerCase() === item.name.toLowerCase()
      );
      if (foundProduct) {
        return { product: foundProduct, qty: item.qty };
      }
      return {
        product: {
          id: item.id,
          name: item.name,
          category: "sandwiches",
          image: "/sandwich.jpg",
          gallery: ["/sandwich.jpg"],
          price: item.price,
          mrp: Math.round(item.price * 1.25),
          rating: 4.5,
          reviews: 100,
          veg: true,
          bestSeller: false,
          popular: false,
          description: item.name,
          ingredients: [],
          nutrition: [],
        },
        qty: item.qty,
      };
    });

    addMultipleItems(itemsToAdd);
    toast.success("Order items added to your cart!");
    navigate({ to: "/cart" });
  };

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
            onClick={handleRepeatOrder}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-accent transition cursor-pointer"
          >
            Repeat order
          </button>
          <Link
            to="/orders/$id"
            params={{ id: order.id }}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition"
          >
            View details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
