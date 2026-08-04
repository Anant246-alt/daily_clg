import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & conditions · Daily" },
      { name: "description", content: "The terms that govern your use of the Daily food ordering app." },
      { property: "og:title", content: "Terms & conditions · Daily" },
      { property: "og:description", content: "The terms that govern your use of the Daily food ordering app." },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    title: "1. Accepting these terms",
    body: "By creating an account or placing an order you agree to these terms. If you do not agree, please stop using the app.",
  },
  {
    title: "2. Orders and pricing",
    body: "All prices are shown in Indian Rupees and include applicable taxes unless stated otherwise. We may change prices or menu items at any time before an order is confirmed.",
  },
  {
    title: "3. Delivery",
    body: "Estimated delivery times are indicative. Weather, traffic and kitchen volume can affect timing. We will always notify you of significant delays.",
  },
  {
    title: "4. Cancellations and refunds",
    body: "Orders can be cancelled free of charge until preparation begins. After that, a partial charge may apply to cover ingredients already used.",
  },
  {
    title: "5. Promotions",
    body: "Promo codes are single use per account unless stated otherwise, cannot be combined, and may be withdrawn at any time.",
  },
  {
    title: "6. Liability",
    body: "Daily is responsible for the quality of the food we prepare. Please tell us about allergies before ordering; we cannot guarantee an allergen free kitchen.",
  },
];

function TermsPage() {
  return (
    <AppShell title="Terms & conditions" back>
      <PageTransition>
        <article className="mx-auto max-w-2xl space-y-4">
          <p className="text-sm text-muted-foreground">Effective 31 July 2026</p>
          {sections.map((s) => (
            <section key={s.title} className="space-y-2 rounded-3xl border border-border bg-card p-5">
              <h2 className="text-base font-extrabold">{s.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </section>
          ))}
        </article>
      </PageTransition>
    </AppShell>
  );
}
