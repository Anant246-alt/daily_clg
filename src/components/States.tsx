import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { FiAlertTriangle } from "react-icons/fi";
import { cn } from "@/lib/utils";

/** Empty state with illustration-ish emoji bubble. */
export function EmptyState({
  emoji = "🍽️",
  title,
  message,
  actionLabel,
  to,
  onAction,
}: {
  emoji?: string;
  title: string;
  message: string;
  actionLabel?: string;
  to?: string;
  onAction?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-surface px-6 py-14 text-center"
    >
      <span className="grid size-20 place-items-center rounded-full bg-primary-soft text-4xl">{emoji}</span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      {actionLabel &&
        (to ? (
          <Link to={to} className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="mt-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
          >
            {actionLabel}
          </button>
        ))}
    </motion.div>
  );
}

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-3xl border border-destructive/30 bg-destructive/5 p-8 text-center">
      <FiAlertTriangle className="size-8 text-destructive" />
      <p className="text-sm font-medium">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
          Try again
        </button>
      )}
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-primary/30 border-t-primary",
        className,
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3 rounded-3xl border border-border bg-card p-3">
      <div className="h-36 animate-pulse rounded-2xl bg-muted" />
      <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
    </div>
  );
}

/** Section heading with optional action link. */
export function Section({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold sm:text-xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
