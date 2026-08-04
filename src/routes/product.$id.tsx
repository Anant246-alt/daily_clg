import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard } from "@/components/ReviewCard";
import { QuantitySelector } from "@/components/QuantitySelector";
import { Rating, VegBadge } from "@/components/Rating";
import { Section } from "@/components/States";
import { getProduct, products, type Product } from "@/data/products";
import { reviews } from "@/data/reviews";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { currency, discountPercent } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Product"} · Daily` },
      { name: "description", content: loaderData?.description ?? "Fresh food from Daily." },
      { property: "og:title", content: `${loaderData?.name ?? "Product"} · Daily` },
      { property: "og:description", content: loaderData?.description ?? "Fresh food from Daily." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const product = Route.useLoaderData() as Product;
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const { isSaved, toggle } = useWishlist();
  const off = discountPercent(product.price, product.mrp);
  const recommended = products.filter((p) => p.id !== product.id).slice(0, 4);
  const productReviews = reviews.filter((r) => r.productId === product.id).concat(reviews.slice(0, 2));

  return (
    <AppShell title={product.name} back>
      <PageTransition>
        <div className="space-y-6 pb-24">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <motion.img
                key={active}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                src={product.gallery[active]}
                alt={product.name}
                width={800}
                height={800}
                className="h-64 w-full rounded-3xl object-cover shadow-[var(--shadow-soft)] sm:h-80"
              />
              <div className="flex gap-2">
                {product.gallery.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={cn(
                      "overflow-hidden rounded-2xl border-2 transition",
                      i === active ? "border-primary" : "border-transparent opacity-70",
                    )}
                  >
                    <img src={g} alt="" loading="lazy" width={800} height={800} className="size-16 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <VegBadge veg={product.veg} />
                    <h1 className="text-2xl font-black">{product.name}</h1>
                  </div>
                  <Rating value={product.rating} count={product.reviews} size="md" />
                </div>
                <button
                  onClick={() => toggle(product.id)}
                  aria-label="Toggle wishlist"
                  className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-card"
                >
                  <FiHeart className={cn(isSaved(product.id) && "fill-destructive text-destructive")} />
                </button>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">{currency(product.price)}</span>
                {off > 0 && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">{currency(product.mrp)}</span>
                    <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                      {off}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-sm text-muted-foreground">{product.description}</p>

              <div>
                <p className="mb-2 text-sm font-bold">Nutrition</p>
                <div className="grid grid-cols-4 gap-2">
                  {product.nutrition.map((n) => (
                    <div key={n.label} className="rounded-2xl bg-surface p-3 text-center">
                      <p className="text-sm font-extrabold">{n.value}</p>
                      <p className="text-[11px] text-muted-foreground">{n.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold">Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((i) => (
                    <span key={i} className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden items-center gap-3 lg:flex">
                <QuantitySelector qty={qty} onChange={(q) => setQty(Math.max(1, q))} size="md" />
                <button
                  onClick={() => {
                    addItem(product, qty);
                    toast.success(`${qty} × ${product.name} added`);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground"
                >
                  <FiShoppingBag /> Add to cart · {currency(product.price * qty)}
                </button>
              </div>
            </div>
          </div>

          <Section title="Customer reviews" action={<Link to="/review" className="text-xs font-bold text-primary">Write a review</Link>}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {productReviews.map((r, i) => (
                <ReviewCard key={`${r.id}-${i}`} review={r} />
              ))}
            </div>
          </Section>

          <Section title="You may also like">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Section>
        </div>

        {/* Sticky mobile add-to-cart bar */}
        <div className="glass fixed inset-x-0 bottom-16 z-30 flex items-center gap-3 px-4 py-3 lg:hidden">
          <QuantitySelector qty={qty} onChange={(q) => setQty(Math.max(1, q))} size="md" />
          <button
            onClick={() => {
              addItem(product, qty);
              toast.success(`${qty} × ${product.name} added`);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground"
          >
            <FiShoppingBag /> Add · {currency(product.price * qty)}
          </button>
        </div>
      </PageTransition>
    </AppShell>
  );
}
