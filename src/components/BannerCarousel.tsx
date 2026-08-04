import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { banners } from "@/data/banners";
import { cn } from "@/lib/utils";

/** Auto-rotating hero carousel. */
export function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, []);

  const banner = banners[index]!;

  return (
    <div className="relative h-44 overflow-hidden rounded-3xl shadow-[var(--shadow-soft)] sm:h-56 lg:h-72">
      <AnimatePresence mode="wait">
        <motion.div
          key={banner.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img src={banner.image} alt={banner.title} className="size-full object-cover" width={800} height={800} />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center gap-2 p-5 sm:p-8">
            <span className="w-fit rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
              Code {banner.code}
            </span>
            <h2 className="max-w-[70%] text-xl font-extrabold text-background sm:text-3xl">{banner.title}</h2>
            <p className="max-w-[70%] text-xs text-background/80 sm:text-sm">{banner.subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-3 left-5 flex gap-1.5 sm:left-8">
        {banners.map((b, i) => (
          <button
            key={b.id}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1.5 rounded-full bg-background/60 transition-all",
              i === index ? "w-6 bg-primary" : "w-1.5",
            )}
          />
        ))}
      </div>
    </div>
  );
}
