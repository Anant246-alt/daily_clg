import { createFileRoute, notFound } from "@tanstack/react-router";
import { FiDownload, FiMapPin, FiCreditCard } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { orders as seedOrders, type Order } from "@/data/orders";
import { currency, DELIVERY_FEE } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$id")({
  loader: ({ params }) => {
    const order = seedOrders.find((o) => o.id === params.id);
    if (!order) throw notFound();
    return order;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `Order ${loaderData?.number ?? ""} · Daily` },
      { name: "description", content: "Live status, items and bill summary for your Daily order." },
      { property: "og:title", content: `Order ${loaderData?.number ?? ""} · Daily` },
      { property: "og:description", content: "Live status, items and bill summary for your Daily order." },
    ],
  }),
  component: OrderDetailsPage,
});

function OrderDetailsPage() {
  const order = Route.useLoaderData() as Order;
  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);

  return (
    <AppShell title={order.number} back>
      <PageTransition>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <section className="rounded-3xl border border-border bg-card p-5">
              <h2 className="mb-4 text-base font-extrabold">Order timeline</h2>
              <ol className="space-y-4">
                {order.timeline.map((t, i) => (
                  <li key={t.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "size-3 rounded-full",
                          t.done ? "bg-primary" : "border-2 border-border bg-background",
                        )}
                      />
                      {i < order.timeline.length - 1 && (
                        <span className={cn("w-0.5 flex-1", t.done ? "bg-primary" : "bg-border")} />
                      )}
                    </div>
                    <div className="pb-1">
                      <p className={cn("text-sm font-semibold", !t.done && "text-muted-foreground")}>{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.time}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-2 rounded-3xl border border-border bg-card p-5">
              <h2 className="text-base font-extrabold">Items</h2>
              {order.items.map((i) => (
                <div key={i.id} className="flex justify-between gap-3 text-sm">
                  <span className="truncate text-muted-foreground">
                    {i.qty} × {i.name}
                  </span>
                  <span className="font-semibold">{currency(i.price * i.qty)}</span>
                </div>
              ))}
            </section>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 rounded-3xl border border-border bg-card p-4 text-sm">
              <p className="inline-flex items-center gap-2 font-bold">
                <FiMapPin /> Delivery address
              </p>
              <p className="text-muted-foreground">{order.address}</p>
            </div>

            <div className="space-y-2 rounded-3xl border border-border bg-card p-4 text-sm">
              <p className="inline-flex items-center gap-2 font-bold">
                <FiCreditCard /> Payment
              </p>
              <p className="text-muted-foreground">{order.paymentMethod}</p>
            </div>

            <div className="space-y-1 rounded-3xl border border-border bg-card p-4 text-sm">
              <p className="mb-2 font-bold">Bill summary</p>
              <div className="flex justify-between text-muted-foreground">
                <span>Item total</span>
                <span>{currency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery</span>
                <span>{currency(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST</span>
                <span>{currency(gst)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-extrabold">
                <span>Total paid</span>
                <span>{currency(order.total)}</span>
              </div>
            </div>

            <button
              onClick={() => toast.success("Invoice download started")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3 font-bold"
            >
              <FiDownload /> Download invoice
            </button>
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
