import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { currency, discountPercent } from "@/utils/format";
import { Rating, VegBadge } from "./Rating";
import { QuantitySelector } from "./QuantitySelector";
import { cn } from "@/lib/utils";

/** Main product card with interactive multi-image thumbnail gallery support. */
export function ProductCard({ product, variant = "grid" }: { product: Product; variant?: "grid" | "compact" }) {
  const { qtyOf, addItem, setQty } = useCart();
  const { isSaved, toggle } = useWishlist();
  const qty = qtyOf(product.id);
  const off = discountPercent(product.price, product.mrp);

  // Derive unique gallery list (fallback to main image if empty)
  const galleryImages = Array.from(new Set([product.image, ...(product.gallery || [])])).filter(Boolean);
  const [activeImage, setActiveImage] = useState(product.image);

  // Reset active image if product changes
  useEffect(() => {
    setActiveImage(product.image);
  }, [product.id, product.image]);

  const favButton = (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product.id);
        toast.success(isSaved(product.id) ? "Removed from wishlist" : "Saved to wishlist");
      }}
      aria-label="Toggle wishlist"
      className="glass absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-full text-foreground transition hover:scale-110"
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
          e.stopPropagation();
          addItem(product);
          toast.success(`${product.name} added to cart`);
        }}
        className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-[var(--shadow-card)] transition active:scale-95 hover:bg-primary/90"
      >
        <FiPlus /> Add
      </button>
    );

  // Render thumbnail gallery below main image if multiple images exist
  const renderThumbnails = (
    thumbnailHeight = "h-11 w-11"
  ) => {
    if (galleryImages.length <= 1) return null;
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto px-3 pt-2 pb-1 no-scrollbar">
        {galleryImages.map((img, idx) => {
          const isActive = activeImage === img;
          return (
            <button
              key={`${product.id}-thumb-${idx}`}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveImage(img);
              }}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 focus:outline-none",
                thumbnailHeight,
                isActive
                  ? "border-primary ring-2 ring-primary/40 scale-105"
                  : "border-transparent opacity-65 hover:opacity-100"
              )}
            >
              <img
                src={img}
                alt={`${product.name} thumbnail ${idx + 1}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <motion.div whileHover={{ y: -4 }} className="w-[240px] shrink-0">
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="block overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition-colors hover:border-primary/50"
        >
          <div className="relative overflow-hidden bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImage}
                src={activeImage}
                alt={product.name}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                loading="lazy"
                width={800}
                height={800}
                className="h-32 w-full object-cover"
              />
            </AnimatePresence>
            {favButton}
            {off > 0 && (
              <span className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground shadow-sm">
                {off}% OFF
              </span>
            )}
          </div>

          {/* Interactive Thumbnail Gallery Slider */}
          {renderThumbnails("h-10 w-10")}

          <div className="space-y-2 p-3">
            <div className="flex items-center gap-1.5">
              <VegBadge veg={product.veg} />
              <h3 className="truncate text-sm font-bold">{product.name}</h3>
            </div>
            <Rating value={product.rating} count={product.reviews} />
            <div className="flex items-center justify-between gap-2 pt-1">
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
        className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)] transition-colors hover:border-primary/50"
      >
        <div className="relative overflow-hidden bg-muted">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={product.name}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              loading="lazy"
              width={800}
              height={800}
              className="h-44 w-full object-cover sm:h-52"
            />
          </AnimatePresence>
          {favButton}
          {off > 0 && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground shadow-sm">
              {off}% OFF
            </span>
          )}
        </div>

        {/* Interactive Thumbnail Gallery Slider */}
        {renderThumbnails("h-12 w-12 sm:h-14 sm:w-14")}

        <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
          <div className="flex min-w-0 items-center gap-1.5">
            <VegBadge veg={product.veg} />
            <h3 className="truncate text-sm font-bold sm:text-base">{product.name}</h3>
          </div>
          <Rating value={product.rating} count={product.reviews} />
          <p className="line-clamp-2 text-xs text-muted-foreground">{product.description}</p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <div className="min-w-0">
              <span className="text-base font-extrabold sm:text-lg">{currency(product.price)}</span>{" "}
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
