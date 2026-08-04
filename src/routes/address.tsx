import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { AppShell } from "@/layouts/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { AddressCard } from "@/components/AddressCard";
import { useOrders, type Address } from "@/context/OrderContext";

export const Route = createFileRoute("/address")({
  head: () => ({
    meta: [
      { title: "Addresses · Daily" },
      { name: "description", content: "Manage your home, office and other delivery addresses." },
      { property: "og:title", content: "Addresses · Daily" },
      { property: "og:description", content: "Manage your home, office and other delivery addresses." },
    ],
  }),
  component: AddressPage,
});

const empty: Address = {
  id: "",
  label: "Home",
  name: "",
  line: "",
  city: "",
  pincode: "",
  phone: "",
};

function AddressPage() {
  const { addresses, selectedAddressId, selectAddress, saveAddress, deleteAddress } = useOrders();
  const [form, setForm] = useState<Address | null>(null);

  return (
    <AppShell title="Saved addresses" back>
      <PageTransition>
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="grid gap-3">
            {addresses.map((a) => (
              <AddressCard
                key={a.id}
                address={a}
                selected={a.id === selectedAddressId}
                onSelect={() => selectAddress(a.id)}
                onEdit={() => setForm(a)}
                onDelete={() => {
                  deleteAddress(a.id);
                  toast.success("Address deleted");
                }}
              />
            ))}
          </div>

          {form ? (
            <div className="space-y-3 rounded-3xl border border-border bg-card p-5">
              <p className="font-bold">{form.id ? "Edit address" : "Add new address"}</p>
              <div className="flex gap-2">
                {(["Home", "Office", "Other"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setForm({ ...form, label: l })}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      form.label === l ? "bg-primary text-primary-foreground" : "border border-border"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              {(["name", "line", "city", "pincode", "phone"] as const).map((f) => (
                <input
                  key={f}
                  value={form[f]}
                  placeholder={f === "line" ? "Address line" : f}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm capitalize outline-none focus:border-primary"
                />
              ))}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    saveAddress({ ...form, id: form.id || `a${Date.now()}` });
                    setForm(null);
                    toast.success("Address saved");
                  }}
                  className="flex-1 rounded-2xl bg-primary py-3 font-bold text-primary-foreground"
                >
                  Save address
                </button>
                <button onClick={() => setForm(null)} className="rounded-2xl border border-border px-4 font-semibold">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setForm(empty)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 py-3.5 font-bold text-primary"
            >
              <FiPlus /> Add new address
            </button>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}
