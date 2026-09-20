import { createContext, useContext, useMemo, useCallback, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { orders as seedOrders, type Order } from "@/data/orders";
import { fetchOrders } from "@/api/orders";

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
  refreshOrders: () => Promise<void>;
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

  const refreshOrders = useCallback(async () => {
    try {
      const remoteOrders = await fetchOrders();
      if (Array.isArray(remoteOrders) && remoteOrders.length > 0) {
        setOrders((prev) => {
          const orderMap = new Map<string, Order>();
          // Remote backend orders take precedence for status updates
          remoteOrders.forEach((ro: any) => {
            const key = ro.id || ro.number;
            if (key) orderMap.set(key, ro);
          });
          // Retain any local orders not yet reflected in backend
          prev.forEach((lo) => {
            const key = lo.id || lo.number;
            if (key && !orderMap.has(key)) {
              orderMap.set(key, lo);
            }
          });
          return Array.from(orderMap.values());
        });
      }
    } catch (err) {
      console.warn("[OrderContext] refreshOrders notice:", err);
    }
  }, [setOrders]);

  useEffect(() => {
    refreshOrders();
    const interval = setInterval(() => {
      refreshOrders();
    }, 3000);

    const handleFocus = () => refreshOrders();
    const handleOrderPlaced = () => refreshOrders();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleFocus);
    window.addEventListener("daily:orderPlaced", handleOrderPlaced);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleFocus);
      window.removeEventListener("daily:orderPlaced", handleOrderPlaced);
    };
  }, [refreshOrders]);

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

  const createOrder = useCallback(
    (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("daily:orderPlaced"));
      }
    },
    [setOrders],
  );

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
      refreshOrders,
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
      refreshOrders,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => useContext(OrderContext);

