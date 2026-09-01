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

const seedAddresses: Address[] = [
  {
    id: "a1",
    label: "Home",
    name: "Aarav Mehta",
    line: "Flat 402, Green Meadows, 5th Block Koramangala",
    city: "Bengaluru",
    pincode: "560034",
    phone: "+91 98765 43210",
  },
  {
    id: "a2",
    label: "Office",
    name: "Aarav Mehta",
    line: "WeWork Galaxy, 43 Residency Road",
    city: "Bengaluru",
    pincode: "560025",
    phone: "+91 98765 43210",
  },
];

const OrderContext = createContext<OrderValue>({} as OrderValue);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useLocalStorage<Order[]>("daily.orders", seedOrders);
  const [addresses, setAddresses] = useLocalStorage<Address[]>("daily.addresses", seedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useLocalStorage<string>("daily.address", "a1");
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
