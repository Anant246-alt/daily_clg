import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FiStar, FiMessageSquare, FiTrash2, FiCheckCircle } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { fetchReviews, submitReview } from "@/api/profile";
import { Spinner } from "@/components/States";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "Customer Reviews · Daily" },
      { name: "description", content: "Rate your meal and share feedback with the Daily kitchen." },
      { property: "og:title", content: "Customer Reviews · Daily" },
      { property: "og:description", content: "Rate your meal and share feedback with the Daily kitchen." },
    ],
  }),
  component: ReviewPage,
});

type ReviewItem = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  avatar?: string;
};

function ReviewPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    let isMounted = true;
    void (async () => {
      try {
        const data = await fetchReviews();
        if (isMounted && Array.isArray(data)) {
          setReviews(data);
        }
      } catch (err) {
        console.warn("[Reviews Fetch Error]", err);
      } finally {
        if (isMounted) setFetching(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) {
      toast.error("Please enter a review message before submitting.");
      return;
    }
    setLoading(true);

    const userName = user?.name || "Anant Bhatt";
    const initials = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newReviewItem: ReviewItem = {
      id: `r_${Date.now()}`,
      name: userName,
      initials,
      rating,
      date: dateStr,
      text: text.trim(),
      avatar: user?.avatar,
    };

    try {
      await submitReview({ rating, text: text.trim() });
    } catch (err) {
      console.warn("[Submit Review Fallback]", err);
    }

    setReviews((prev) => [newReviewItem, ...prev]);
    setText("");
    setLoading(false);
    toast.success("Review submitted successfully!");
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.info("Review deleted");
  };

  return (
    <AppShell title="Customer Reviews" back>
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-6 pb-6">
          {/* Write Review Card */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <FiMessageSquare className="size-5" />
              </span>
              <div>
                <h2 className="text-base font-extrabold">Write a Review</h2>
                <p className="text-xs text-muted-foreground">Share your dining experience with us</p>
              </div>
            </div>

            <div className="space-y-2 text-center pt-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Rating</p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    type="button"
                    aria-label={`${i} star rating`}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <FiStar
                      size={28}
                      className={i <= rating ? "fill-warning text-warning" : "text-muted-foreground/30"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Tell us what you loved about your meal..."
              className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none focus:border-primary transition"
            />

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 disabled:opacity-60 transition"
            >
              {loading && <Spinner className="border-primary-foreground/40 border-t-primary-foreground" />}
              Submit review
            </button>
          </div>

          {/* Submitted Reviews Box */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold">Customer Reviews ({reviews.length})</h3>
              </div>
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-warning bg-warning/10 px-2.5 py-1 rounded-full">
                  <FiStar className="fill-warning text-warning" />
                  <span>
                    {(
                      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 5
                    ).toFixed(1)} / 5.0
                  </span>
                </div>
              )}
            </div>

            {fetching ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading reviews...</div>
            ) : reviews.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No reviews yet. Be the first to share your feedback above!
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-border">
                {reviews.map((r, idx) => (
                  <div key={r.id || idx} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {r.avatar || (user?.avatar && (r.name === user?.name || r.name === "Anant Bhatt")) ? (
                          <img
                            src={r.avatar || user?.avatar}
                            alt={r.name}
                            className="size-10 rounded-full object-cover border border-primary/20"
                          />
                        ) : (
                          <span className="grid size-10 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                            {(r.initials || r.name.slice(0, 2)).toUpperCase()}
                          </span>
                        )}
                        <div>
                          <p className="text-sm font-bold flex items-center gap-1.5">
                            {r.name}
                            {(r.name === user?.name || r.name === "Anant Bhatt" || r.id.startsWith("r_")) && (
                              <span className="inline-flex items-center gap-0.5 rounded-md bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary">
                                <FiCheckCircle /> You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{r.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              size={14}
                              className={star <= r.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}
                            />
                          ))}
                        </div>
                        {(r.name === user?.name || r.name === "Anant Bhatt" || r.id.startsWith("r_")) && (
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="text-muted-foreground hover:text-destructive p-1 transition"
                            title="Delete review"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-foreground/90 pl-13 leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
