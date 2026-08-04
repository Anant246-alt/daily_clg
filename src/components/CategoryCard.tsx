import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import type { Category } from "@/data/categories";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.96 }}
    >
      <Link
        to="/menu"
        search={{ tab: category.slug }}
        className="flex w-[92px] shrink-0 flex-col items-center gap-2 rounded-3xl border border-border bg-card p-3 shadow-[var(--shadow-card)]"
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-2xl">
          {category.emoji}
        </span>
        <span className="truncate text-center text-xs font-semibold">{category.name}</span>
        <span className="text-[10px] text-muted-foreground">{category.items} items</span>
      </Link>
    </motion.div>
  );
}
