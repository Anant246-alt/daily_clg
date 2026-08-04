import { FiEdit2, FiTrash2, FiHome, FiBriefcase, FiMapPin } from "react-icons/fi";
import type { Address } from "@/context/OrderContext";
import { cn } from "@/lib/utils";

const icons = { Home: FiHome, Office: FiBriefcase, Other: FiMapPin };

export function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
  onDelete,
}: {
  address: Address;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const Icon = icons[address.label];
  return (
    <div
      onClick={onSelect}
      className={cn(
        "cursor-pointer space-y-2 rounded-3xl border bg-card p-4 transition",
        selected ? "border-primary shadow-[var(--shadow-soft)]" : "border-border",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <Icon />
          </span>
          <p className="truncate font-bold">{address.label}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {onEdit && (
            <button onClick={onEdit} aria-label="Edit address" className="grid size-8 place-items-center rounded-full border border-border">
              <FiEdit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              aria-label="Delete address"
              className="grid size-8 place-items-center rounded-full border border-border text-destructive"
            >
              <FiTrash2 size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {address.name} · {address.line}, {address.city} {address.pincode}
      </p>
      <p className="text-xs text-muted-foreground">{address.phone}</p>
    </div>
  );
}
