import { createFileRoute } from "@tanstack/react-router";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { EmptyState } from "@/components/States";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { currency } from "@/utils/format";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist · Daily" },
      { name: "description", content: "Dishes you saved for later on Daily." },
      { property: "og:title", content: "Wishlist · Daily" },
      { property: "og:description", content: "Dishes you saved for later on Daily." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();

  return (
    <AppShell title="Wishlist" back>
      <PageTransition>
        {items.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {items.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-3xl border border-border bg-card p-3"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="size-20 shrink-0 rounded-2xl object-cover"
                />
                <div className="min-w-0 space-y-2">
                  <p className="truncate font-bold">{p.name}</p>
                  <p className="text-sm font-extrabold">{currency(p.price)}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        addItem(p);
                        remove(p.id);
                        toast.success("Moved to cart");
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground"
                    >
                      <FiShoppingBag /> Move to cart
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive"
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="💚"
            title="No saved dishes"
            message="Tap the heart on any dish to save it here for later."
            actionLabel="Browse menu"
            to="/menu"
          />
        )}
      </PageTransition>
    </AppShell>
  );
}
