import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daily — Fresh food ordering app" },
      { name: "description", content: "Daily delivers fresh salads, subs and iced teas in 20 minutes." },
      { property: "og:title", content: "Daily — Fresh food ordering app" },
      { property: "og:description", content: "Daily delivers fresh salads, subs and iced teas in 20 minutes." },
    ],
  }),
  component: Splash,
});

/** Animated splash screen; redirects to login (or home when already signed in). */
function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => navigate({ to: isAuthenticated ? "/home" : "/login" }), 1900);
    return () => clearTimeout(t);
  }, [navigate, isAuthenticated, hydrated]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary px-6 text-center">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute size-[520px] rounded-full bg-primary-foreground/20 blur-3xl"
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", damping: 12, stiffness: 140 }}
        className="relative grid size-24 place-items-center rounded-[28px] bg-primary-foreground text-5xl font-black text-primary shadow-[var(--shadow-float)]"
      >
        D
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="relative mt-6 text-4xl font-black text-primary-foreground"
      >
        Daily
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        className="relative mt-2 text-sm text-primary-foreground/80"
      >
        Fresh food, delivered daily
      </motion.p>

      <div className="relative mt-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            className="size-2.5 rounded-full bg-primary-foreground"
          />
        ))}
      </div>
    </div>
  );
}
