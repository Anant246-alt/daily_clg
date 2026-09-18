import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { orders as seedOrders, type Order } from "@/data/orders";

export type Address = {
  id: string;
  label: "Home" | "Office" | "Other";
  name: string;
  line: string;
  city: string;
  pincode: string;
  phone: string;
};

type OrderValue = {
  orders: Order[];
  lastOrder: { number: string; eta: string } | null;
  addresses: Address[];
  selectedAddressId: string;
  selectAddress: (id: string) => void;
  saveAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  createOrder: (order: Order) => void;
  setLastOrder: (o: { number: string; eta: string }) => void;
};

const seedAddresses: Address[] = [];

const OrderContext = createContext<OrderValue>({} as OrderValue);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [rawOrders, setOrders] = useLocalStorage<Order[]>("daily.orders", seedOrders);
  // Filter out any leftover sample dummy orders from user localStorage
  const orders = useMemo(
    () => rawOrders.filter((o) => !["o1001", "o1000", "o999", "#DLY-1001", "#DLY-1000", "#DLY-0999"].includes(o.id) && !["#DLY-1001", "#DLY-1000", "#DLY-0999"].includes(o.number)),
    [rawOrders]
  );

  const [rawAddresses, setAddresses] = useLocalStorage<Address[]>("daily.addresses", seedAddresses);
  const addresses = useMemo(
    () => rawAddresses.filter((a) => a.id !== "a1" && a.id !== "a2" && a.name !== "Aarav Mehta"),
    [rawAddresses]
  );
  const [selectedAddressId, setSelectedAddressId] = useLocalStorage<string>("daily.address", "");
  const [lastOrder, setLastOrder] = useLocalStorage<{ number: string; eta: string } | null>(
    "daily.lastOrder",
    null,
  );

  const selectAddress = useCallback((id: string) => setSelectedAddressId(id), [setSelectedAddressId]);

  const saveAddress = useCallback(
    (address: Address) =>
      setAddresses((prev) =>
        prev.some((a) => a.id === address.id)
          ? prev.map((a) => (a.id === address.id ? address : a))
          : [...prev, address],
      ),
    [setAddresses],
  );

  const deleteAddress = useCallback((id: string) => setAddresses((prev) => prev.filter((a) => a.id !== id)), [setAddresses]);

  const createOrder = useCallback((order: Order) => setOrders((prev) => [order, ...prev]), [setOrders]);

  const value = useMemo<OrderValue>(
    () => ({
      orders,
      lastOrder,
      addresses,
      selectedAddressId,
      selectAddress,
      saveAddress,
      deleteAddress,
      createOrder,
      setLastOrder,
    }),
    [
      orders,
      lastOrder,
      addresses,
      selectedAddressId,
      selectAddress,
      saveAddress,
      deleteAddress,
      createOrder,
      setLastOrder,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => useContext(OrderContext);
