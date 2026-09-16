import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { FiDownload, FiMapPin, FiCreditCard, FiPrinter, FiX, FiCheckCircle, FiFileText, FiShield } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { orders as seedOrders, type Order } from "@/data/orders";
import { currency, DELIVERY_FEE } from "@/utils/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders/$id")({
  loader: ({ params }) => {
    let ordersList = seedOrders;
    try {
      const saved = localStorage.getItem("daily.orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          ordersList = parsed;
        }
      }
    } catch {
      /* ignore */
    }

    const order = ordersList.find(
      (o) =>
        o.id.toLowerCase() === params.id.toLowerCase() ||
        o.number.toLowerCase() === params.id.toLowerCase() ||
        o.number.replace("#", "").toLowerCase() === params.id.toLowerCase()
    ) || seedOrders.find((o) => o.id === params.id || o.number === params.id);

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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  const cgst = (gst / 2).toFixed(2);
  const sgst = (gst / 2).toFixed(2);

  const invoiceNo = `INV-2026-${order.number.replace("#", "")}`;
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const handleDownloadInvoice = () => {
    setShowInvoiceModal(true);
    toast.success("Opening Tax Invoice PDF Preview");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadBlob = () => {
    const content = `
============================================================
              DAILY FOOD DELIVERY PVT LTD
                   OFFICIAL TAX INVOICE
============================================================
Invoice No: ${invoiceNo}
Order Ref:  ${order.number}
Date:       ${currentDate}
Status:     PAID & VERIFIED

------------------------------------------------------------
CUSTOMER & DELIVERY DETAILS
------------------------------------------------------------
Delivery Address: ${order.address}
Payment Method:   ${order.paymentMethod}

------------------------------------------------------------
ITEMIZED BILL DETAILS
------------------------------------------------------------
${order.items.map((i, index) => `${index + 1}. ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join("\n")}

------------------------------------------------------------
FINANCIAL SUMMARY
------------------------------------------------------------
Item Subtotal:  ₹${subtotal.toFixed(2)}
CGST (2.5%):    ₹${cgst}
SGST (2.5%):    ₹${sgst}
Delivery Fee:   ₹${DELIVERY_FEE.toFixed(2)}
------------------------------------------------------------
TOTAL PAID:     ₹${order.total.toFixed(2)}
============================================================
           Thank you for ordering with Daily!
============================================================
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${order.number.replace("#", "")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Invoice file downloaded: Invoice_${order.number.replace("#", "")}.txt`);
  };

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
              onClick={handleDownloadInvoice}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground shadow-[var(--shadow-soft)] hover:opacity-90 transition cursor-pointer"
            >
              <FiDownload /> Download invoice
            </button>
          </div>
        </div>

        {/* Tax Invoice Modal Preview */}
        {showInvoiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-6">
              
              {/* Modal Header Controls */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2 font-extrabold text-lg text-foreground">
                  <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                    <FiFileText className="size-5" />
                  </span>
                  Tax Invoice Preview
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                  >
                    <FiPrinter className="size-3.5" /> Print / Save PDF
                  </button>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                  >
                    <FiX className="size-5" />
                  </button>
                </div>
              </div>

              {/* Invoice Printable Sheet */}
              <div id="printable-invoice" className="rounded-2xl border border-border bg-background p-6 space-y-6 text-foreground font-sans">
                
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 border-b border-border pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="grid size-10 place-items-center rounded-xl bg-card border border-border p-1 overflow-hidden shrink-0">
                        <img src="/logo.png" alt="Daily Logo" className="size-full object-contain" />
                      </div>
                      <h2 className="text-xl font-black tracking-tight text-primary">DAILY FOOD DELIVERY</h2>
                    </div>
                    <p className="text-xs text-muted-foreground">FSSAI Lic No: 11223344556677</p>
                    <p className="text-xs text-muted-foreground">GSTIN: 29AAACD1234F1Z5</p>
                    <p className="text-xs text-muted-foreground">Green Meadows, Koramangala, Bengaluru 560034</p>
                  </div>
                  <div className="sm:text-right space-y-1">
                    <span className="inline-block rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      TAX INVOICE
                    </span>
                    <p className="text-sm font-extrabold text-foreground pt-1">Invoice #: {invoiceNo}</p>
                    <p className="text-xs text-muted-foreground">Order Ref: {order.number}</p>
                    <p className="text-xs text-muted-foreground">Date: {currentDate}</p>
                  </div>
                </div>

                {/* Billed To Details */}
                <div className="grid sm:grid-cols-2 gap-4 rounded-xl bg-card p-4 border border-border text-xs">
                  <div>
                    <p className="font-bold text-muted-foreground uppercase text-[10px] mb-1">Billed & Delivered To:</p>
                    <p className="font-extrabold text-sm text-foreground">Customer Address</p>
                    <p className="text-muted-foreground">{order.address}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-bold text-muted-foreground uppercase text-[10px] mb-1">Payment Information:</p>
                    <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 flex sm:justify-end items-center gap-1">
                      <FiCheckCircle className="size-4" /> PAID & VERIFIED
                    </p>
                    <p className="text-muted-foreground">Method: {order.paymentMethod}</p>
                  </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-card text-muted-foreground font-bold">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Item Description</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {order.items.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="py-3 px-3 font-mono text-muted-foreground">{idx + 1}</td>
                          <td className="py-3 px-3 font-semibold text-foreground">{item.name}</td>
                          <td className="py-3 px-3 text-center font-bold">{item.qty}</td>
                          <td className="py-3 px-3 text-right text-muted-foreground">₹{item.price}</td>
                          <td className="py-3 px-3 text-right font-bold text-foreground">₹{item.price * item.qty}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-t border-border pt-4 text-xs">
                  <div className="space-y-1.5 text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                      <FiShield className="size-4" /> 100% Tax Compliant Digital Receipt
                    </div>
                    <p className="text-[11px]">Includes CGST 2.5% + SGST 2.5% on food items.</p>
                  </div>
                  <div className="w-full sm:w-64 space-y-1.5 font-sans">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Item Subtotal:</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>CGST (2.5%):</span>
                      <span>₹{cgst}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>SGST (2.5%):</span>
                      <span>₹{sgst}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Charge:</span>
                      <span>₹{DELIVERY_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-sm font-black text-foreground">
                      <span>Grand Total:</span>
                      <span className="text-primary">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Verified Stamp Seal */}
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <p className="text-[11px] text-muted-foreground">Computer generated invoice. No signature required.</p>
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-center">
                    <p className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">OFFICIALLY PAID</p>
                    <p className="text-[9px] text-emerald-700 dark:text-emerald-300 font-bold">Daily Kitchens Inc.</p>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 font-bold text-primary-foreground shadow-md hover:opacity-90 transition cursor-pointer"
                >
                  <FiPrinter /> Print / Save as PDF
                </button>
                <button
                  onClick={handleDownloadBlob}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary px-5 py-3.5 text-xs font-bold text-secondary-foreground hover:bg-secondary/80 cursor-pointer"
                >
                  <FiDownload /> Download TXT File
                </button>
              </div>

            </div>
          </div>
        )}
      </PageTransition>
    </AppShell>
  );
}
