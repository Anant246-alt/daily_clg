import { StarRow } from "./Rating";

export type ReviewData = {
  id: string;
  name: string;
  initials?: string;
  rating: number;
  date: string;
  text: string;
  avatar?: string;
};

export function ReviewCard({ review }: { review: ReviewData }) {
  const initials = review.initials || review.name.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-2 rounded-3xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
      <div className="flex min-w-0 items-center gap-3">
        {review.avatar ? (
          <img
            src={review.avatar}
            alt={review.name}
            className="size-10 shrink-0 rounded-full object-cover border border-primary/20"
          />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{review.name}</p>
          <p className="text-[11px] text-muted-foreground">{review.date}</p>
        </div>
      </div>
      <StarRow value={review.rating} size={14} />
      <p className="text-sm text-muted-foreground line-clamp-3">{review.text}</p>
    </div>
  );
}
