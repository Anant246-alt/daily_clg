import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiHeart, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { currency, discountPercent } from "@/utils/format";
import { Rating, VegBadge } from "./Rating";
import { QuantitySelector } from "./QuantitySelector";
import { cn } from "@/lib/utils";

/** Main product card. `variant="compact"` is the horizontal best-seller card. */
export function ProductCard({ product, variant = "grid" }: { product: Product; variant?: "grid" | "compact" }) {
  const { qtyOf, addItem, setQty } = useCart();
  const { isSaved, toggle } = useWishlist();
  const qty = qtyOf(product.id);
  const off = discountPercent(product.price, product.mrp);

  const favButton = (
    <button
      onClick={(e) => {
        e.preventDefault();
        toggle(product.id);
        toast.success(isSaved(product.id) ? "Removed from wishlist" : "Saved to wishlist");
      }}
      aria-label="Toggle wishlist"
      className="glass absolute right-2 top-2 grid size-8 place-items-center rounded-full text-foreground transition hover:scale-110"
    >
      <FiHeart className={cn(isSaved(product.id) && "fill-destructive text-destructive")} />
    </button>
  );

  const addControl =
    qty > 0 ? (
      <QuantitySelector qty={qty} onChange={(q) => setQty(product.id, q)} />
    ) : (
      <button
        onClick={(e) => {
          e.preventDefault();
          addItem(product);
          toast.success(`${product.name} added to cart`);
        }}
        className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-95"
      >
        <FiPlus /> Add
      </button>
    );

  if (variant === "compact") {
    return (
      <motion.div whileHover={{ y: -4 }} className="w-[230px] shrink-0">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              width={800}
              height={800}
              className="h-32 w-full object-cover"
            />
            {favButton}
            {off > 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
                {off}% OFF
              </span>
            )}
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-center gap-1.5">
              <VegBadge veg={product.veg} />
              <h3 className="truncate text-sm font-bold">{product.name}</h3>
            </div>
            <Rating value={product.rating} count={product.reviews} />
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold">{currency(product.price)}</span>
              {addControl}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ y: -4 }} className="h-full">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
      >
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={800}
            height={800}
            className="h-36 w-full object-cover sm:h-44"
          />
          {favButton}
          {off > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
              {off}% OFF
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <div className="flex min-w-0 items-center gap-1.5">
            <VegBadge veg={product.veg} />
            <h3 className="truncate text-sm font-bold sm:text-base">{product.name}</h3>
          </div>
          <Rating value={product.rating} count={product.reviews} />
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-1">
            <div className="min-w-0">
              <span className="text-base font-extrabold">{currency(product.price)}</span>{" "}
              {off > 0 && (
                <span className="text-xs text-muted-foreground line-through">{currency(product.mrp)}</span>
              )}
            </div>
            {addControl}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
