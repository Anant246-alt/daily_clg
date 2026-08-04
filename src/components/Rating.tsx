import { FiStar } from "react-icons/fi";
import { cn } from "@/lib/utils";

/** Compact rating pill / star row. */
export function Rating({
  value,
  count,
  size = "sm",
  className,
}: {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 font-semibold text-primary",
        size === "sm" ? "text-[11px]" : "text-sm",
        className,
      )}
    >
      <FiStar className="fill-current" />
      {value.toFixed(1)}
      {count != null && <span className="font-medium text-muted-foreground">({count})</span>}
    </span>
  );
}

export function StarRow({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-warning">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar key={i} size={size} className={i <= Math.round(value) ? "fill-current" : "opacity-30"} />
      ))}
    </span>
  );
}

/** Small green/red veg indicator used across product surfaces. */
export function VegBadge({ veg }: { veg: boolean }) {
  return (
    <span
      className={cn(
        "grid size-4 shrink-0 place-items-center rounded-[3px] border",
        veg ? "border-success text-success" : "border-destructive text-destructive",
      )}
      aria-label={veg ? "Vegetarian" : "Non vegetarian"}
    >
      <span className="size-1.5 rounded-full bg-current" />
    </span>
  );
}
