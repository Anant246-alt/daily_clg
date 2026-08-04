import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronDown, FiPhone, FiMail } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { raiseTicket } from "@/api/profile";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help center · Daily" },
      { name: "description", content: "FAQs, support contacts and ticket raising for Daily orders." },
      { property: "og:title", content: "Help center · Daily" },
      { property: "og:description", content: "FAQs, support contacts and ticket raising for Daily orders." },
    ],
  }),
  component: HelpPage,
});

const faqs = [
  { q: "How long does delivery take?", a: "Most orders arrive in 20–35 minutes depending on your distance from the kitchen." },
  { q: "Can I cancel an order?", a: "Yes, until the kitchen starts preparing it. Open the order and tap Cancel." },
  { q: "How do refunds work?", a: "Refunds are issued to the original payment method within 3–5 business days." },
  { q: "Do you offer vegan options?", a: "Every salad and yogurt bowl can be made vegan. Add a note at checkout." },
];

function HelpPage() {
  const [open, setOpen] = useState<number | null>(0);
  const [message, setMessage] = useState("");

  return (
    <AppShell title="Help center" back>
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-5">
          <div className="space-y-2">
            <h2 className="text-base font-extrabold">Frequently asked questions</h2>
            <div className="overflow-hidden rounded-3xl border border-border bg-card">
              {faqs.map((f, i) => (
                <div key={f.q} className="border-b border-border last:border-0">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-semibold"
                  >
                    {f.q}
                    <FiChevronDown className={`shrink-0 transition ${open === i ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {open === i && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden px-4 pb-4 text-sm text-muted-foreground"
                      >
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:+911800000000" className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 text-sm font-semibold">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <FiPhone />
              </span>
              Call support
            </a>
            <a href="mailto:support@daily.app" className="flex items-center gap-3 rounded-3xl border border-border bg-card p-4 text-sm font-semibold">
              <span className="grid size-10 place-items-center rounded-2xl bg-primary-soft text-primary">
                <FiMail />
              </span>
              Email support
            </a>
          </div>

          <div className="space-y-3 rounded-3xl border border-border bg-card p-5">
            <h2 className="text-base font-extrabold">Raise a ticket</h2>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Describe your issue…"
              className="w-full rounded-2xl border border-border bg-background p-4 text-sm outline-none"
            />
            <button
              onClick={async () => {
                await raiseTicket({ message });
                setMessage("");
                toast.success("Ticket raised. We'll reply by email.");
              }}
              className="w-full rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground"
            >
              Submit ticket
            </button>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
