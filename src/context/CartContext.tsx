import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { Product } from "@/data/products";
import { DELIVERY_FEE, GST_RATE } from "@/utils/format";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  veg: boolean;
  qty: number;
};

type CartValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  gst: number;
  delivery: number;
  total: number;
  promo: string | null;
  addItem: (p: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  qtyOf: (id: string) => number;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
  clearCart: () => void;
};

const PROMOS: Record<string, number> = { DAILY50: 0.5, SAVE100: 0.2, UPI20: 0.2, FREEDEL: 0.05 };

const CartContext = createContext<CartValue>({} as CartValue);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("daily.cart", []);
  const [promo, setPromo] = useLocalStorage<string | null>("daily.promo", null);

  const addItem = useCallback(
    (p: Product, qty = 1) =>
      setItems((prev) => {
        const found = prev.find((i) => i.id === p.id);
        if (found) return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
        return [
          ...prev,
          { id: p.id, name: p.name, image: p.image, price: p.price, mrp: p.mrp, veg: p.veg, qty },
        ];
      }),
    [setItems],
  );

  const removeItem = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), [setItems]);

  const setQty = useCallback(
    (id: string, qty: number) =>
      setItems((prev) =>
        qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
      ),
    [setItems],
  );

  const applyPromo = useCallback(
    (code: string) => {
      const key = code.trim().toUpperCase();
      if (!PROMOS[key]) return false;
      setPromo(key);
      return true;
    },
    [setPromo],
  );

  const clearPromo = useCallback(() => setPromo(null), [setPromo]);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromo(null);
  }, [setItems, setPromo]);

  const value = useMemo<CartValue>(() => {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promo ? Math.round(subtotal * (PROMOS[promo] ?? 0)) : 0;
    const gst = Math.round((subtotal - discount) * GST_RATE);
    const delivery = subtotal > 0 ? DELIVERY_FEE : 0;

    return {
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      discount,
      gst,
      delivery,
      total: Math.max(0, subtotal - discount + gst + delivery),
      promo,
      addItem,
      removeItem,
      setQty,
      qtyOf: (id) => items.find((i) => i.id === id)?.qty ?? 0,
      applyPromo,
      clearPromo,
      clearCart,
    };
  }, [items, promo, addItem, removeItem, setQty, applyPromo, clearPromo, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
