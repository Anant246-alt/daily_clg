import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/States";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const tabs = categories.filter((c) =>
  ["salads", "sandwiches", "iced-tea", "footlong", "yogurt-bowl", "combos"].includes(c.slug),
);

export const Route = createFileRoute("/menu")({
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search["tab"] === "string" ? (search["tab"] as string) : "salads",
  }),
  head: () => ({
    meta: [
      { title: "Menu · Daily" },
      { name: "description", content: "Salads, sandwiches, iced teas, footlongs, yogurt bowls and combos." },
      { property: "og:title", content: "Menu · Daily" },
      { property: "og:description", content: "Salads, sandwiches, iced teas, footlongs, yogurt bowls and combos." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const items = products.filter((p) => p.category === tab);

  return (
    <AppShell title="Menu">
      <PageTransition>
        <div className="space-y-5">
          <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {tabs.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ search: { tab: c.slug } })}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                  tab === c.slug ? "text-primary-foreground" : "border border-border bg-card text-muted-foreground",
                )}
              >
                {tab === c.slug && (
                  <motion.span layoutId="menu-tab" className="absolute inset-0 rounded-full bg-primary" />
                )}
                <span className="relative">
                  {c.emoji} {c.name}
                </span>
              </button>
            ))}
          </div>

          {items.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🧑‍🍳"
              title="Cooking something new"
              message="This category is being restocked. Try another tab in the meantime."
            />
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
