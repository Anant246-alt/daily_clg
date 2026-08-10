import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FiFilter, FiClock, FiTrendingUp } from "react-icons/fi";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { SearchBar } from "@/components/SearchBar";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState } from "@/components/States";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search · Daily" },
      { name: "description", content: "Search the Daily menu by dish, category or craving." },
      { property: "og:title", content: "Search · Daily" },
      { property: "og:description", content: "Search the Daily menu by dish, category or craving." },
    ],
  }),
  component: SearchPage,
});

const recent = ["Footlong", "Iced tea", "Protein bowl"];
const popular = ["Salads", "Combos", "Footlong", "Yogurt bowl", "Sandwich"];
const sorts = [
  { id: "popular", label: "Popular" },
  { id: "low", label: "Price: low to high" },
  { id: "high", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const;

function SearchPage() {
  const [query, setQuery] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("popular");

  const results = useMemo(() => {
    let list = products.filter((p) =>
      `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(query.trim().toLowerCase()),
    );
    if (vegOnly) list = list.filter((p) => p.veg);
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, vegOnly, sort]);

  return (
    <AppShell title="Search" back>
      <PageTransition>
        <div className="space-y-5">
          <SearchBar value={query} onChange={setQuery} autoFocus />

          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setVegOnly((v) => !v)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold",
                vegOnly ? "border-primary bg-primary-soft text-primary" : "border-border bg-card",
              )}
            >
              <FiFilter /> Veg only
            </button>
            {sorts.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  sort === s.id ? "border-primary bg-primary-soft text-primary" : "border-border bg-card",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>

          {!query && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 rounded-3xl border border-border bg-card p-4">
                <p className="inline-flex items-center gap-2 text-sm font-bold">
                  <FiClock /> Recent searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2 rounded-3xl border border-border bg-card p-4">
                <p className="inline-flex items-center gap-2 text-sm font-bold">
                  <FiTrendingUp /> Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popular.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQuery(r)}
                      className="rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {results.length ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              emoji="🔍"
              title="No dishes found"
              message={`We couldn't find anything for "${query}". Try a different craving.`}
              actionLabel="Clear search"
              onAction={() => setQuery("")}
            />
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
