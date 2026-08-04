import { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FiChevronRight, FiEdit3 } from "react-icons/fi";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition, FadeIn } from "@/components/PageTransition";
import { SearchBar } from "@/components/SearchBar";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { ReviewCard, type ReviewData } from "@/components/ReviewCard";
import { Section } from "@/components/States";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { reviews as staticReviews } from "@/data/reviews";
import { offers } from "@/data/banners";
import { fetchReviews } from "@/api/profile";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home · Daily food ordering" },
      { name: "description", content: "Browse best sellers, categories and today's offers on Daily." },
      { property: "og:title", content: "Home · Daily food ordering" },
      { property: "og:description", content: "Browse best sellers, categories and today's offers on Daily." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reviewsList, setReviewsList] = useState<ReviewData[]>(staticReviews);

  const bestSellers = products.filter((p) => p.bestSeller);
  const popular = products.filter((p) => p.popular);
  const recommended = products[3]!;

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const data = await fetchReviews();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          // Merge custom user avatar if review name matches user name
          const formatted = data.map((r: any) => ({
            id: r.id || `r_${Math.random()}`,
            name: r.name,
            initials: r.initials || r.name?.slice(0, 2).toUpperCase(),
            rating: r.rating || 5,
            date: r.date || "Recently",
            text: r.text,
            avatar: r.avatar || (user?.avatar && r.name === user?.name ? user.avatar : undefined),
          }));
          setReviewsList(formatted);
        }
      } catch (err) {
        console.warn("[Home Reviews Fetch Warning]", err);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <AppShell showGreeting>
      <PageTransition>
        <div className="space-y-7">
          <SearchBar readOnly onClick={() => navigate({ to: "/search" })} />

          <FadeIn>
            <BannerCarousel />
          </FadeIn>

          <Section
            title="Categories"
            action={
              <Link to="/menu" className="inline-flex items-center text-xs font-bold text-primary">
                See all <FiChevronRight />
              </Link>
            }
          >
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {categories.map((c, i) => (
                <CategoryCard key={c.id} category={c} index={i} />
              ))}
            </div>
          </Section>

          <Section title="Best sellers">
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} variant="compact" />
              ))}
            </div>
          </Section>

          <Section
            title="Popular right now"
            action={
              <Link to="/menu" className="text-xs font-bold text-primary">
                View menu
              </Link>
            }
          >
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {popular.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Section>

          <Section title="Today's recommendation">
            <Link
              to="/product/$id"
              params={{ id: recommended.id }}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
            >
              <div className="min-w-0 space-y-1">
                <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground">
                  Chef's pick
                </span>
                <h3 className="truncate text-lg font-extrabold">{recommended.name}</h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">{recommended.description}</p>
              </div>
              <img
                src={recommended.image}
                alt={recommended.name}
                loading="lazy"
                width={800}
                height={800}
                className="size-24 shrink-0 rounded-2xl object-cover sm:size-32"
              />
            </Link>
          </Section>

          <Section title="Featured offers">
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
              {offers.map((o) => (
                <div
                  key={o.id}
                  className="w-56 shrink-0 rounded-3xl border border-dashed border-primary/40 bg-primary-soft p-4"
                >
                  <p className="text-base font-extrabold text-primary">{o.title}</p>
                  <p className="text-xs text-muted-foreground">{o.detail}</p>
                  <p className="mt-3 rounded-full bg-card px-3 py-1 text-center text-xs font-bold">{o.code}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section
            title="What customers say"
            action={
              <Link to="/review" className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                <FiEdit3 /> Write a review
              </Link>
            }
          >
            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
              {reviewsList.map((r) => (
                <div key={r.id} className="w-72 shrink-0 sm:w-auto">
                  <ReviewCard review={r} />
                </div>
              ))}
            </div>
          </Section>
        </div>
      </PageTransition>
    </AppShell>
  );
}
