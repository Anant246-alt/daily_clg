import { motion } from "framer-motion";
import { FiMinus, FiPlus } from "react-icons/fi";
import { cn } from "@/lib/utils";

/** +/- stepper used in cards, cart and product page. */
export function QuantitySelector({
  qty,
  onChange,
  size = "sm",
}: {
  qty: number;
  onChange: (qty: number) => void;
  size?: "sm" | "md";
}) {
  const btn =
    "grid place-items-center rounded-full text-primary-foreground bg-primary transition active:scale-90 disabled:opacity-40";
  const dim = size === "sm" ? "size-7 text-xs" : "size-9 text-base";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft p-1",
        size === "sm" ? "" : "gap-3",
      )}
    >
      <button className={cn(btn, dim)} onClick={() => onChange(qty - 1)} aria-label="Decrease quantity">
        <FiMinus />
      </button>
      <motion.span
        key={qty}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn("min-w-4 text-center font-bold text-primary", size === "md" && "text-lg")}
      >
        {qty}
      </motion.span>
      <button className={cn(btn, dim)} onClick={() => onChange(qty + 1)} aria-label="Increase quantity">
        <FiPlus />
      </button>
    </div>
  );
}
