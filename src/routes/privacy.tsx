import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy policy · Daily" },
      { name: "description", content: "How Daily collects, uses and protects your personal data." },
      { property: "og:title", content: "Privacy policy · Daily" },
      { property: "og:description", content: "How Daily collects, uses and protects your personal data." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    title: "1. Information we collect",
    body: "We collect your name, email, phone number and delivery addresses so we can prepare and deliver your orders. Payment details are handled by our payment partner and never stored on our servers.",
  },
  {
    title: "2. How we use your data",
    body: "Your data is used to process orders, send order updates, personalise recommendations and improve the quality of our kitchens. We never sell personal data to third parties.",
  },
  {
    title: "3. Cookies and local storage",
    body: "We store your theme preference, cart and session token in your browser so the app remembers you between visits. You can clear these at any time from your browser settings.",
  },
  {
    title: "4. Sharing with partners",
    body: "Delivery partners receive only the details required to reach you: your name, address and phone number. Analytics providers receive anonymised usage data.",
  },
  {
    title: "5. Your rights",
    body: "You can request a copy of your data, correct inaccuracies, or ask us to delete your account entirely by writing to privacy@daily.app. We respond within 30 days.",
  },
  {
    title: "6. Contact",
    body: "Questions about this policy can be sent to privacy@daily.app or by post to Daily Foods, Koramangala, Bengaluru 560034.",
  },
];

function PrivacyPage() {
  return (
    <AppShell title="Privacy policy" back>
      <PageTransition>
        <article className="mx-auto max-w-2xl space-y-4">
          <p className="text-sm text-muted-foreground">Last updated 31 July 2026</p>
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
