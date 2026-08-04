import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { products, type Product } from "@/data/products";

type WishlistValue = {
  ids: string[];
  items: Product[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};

const WishlistContext = createContext<WishlistValue>({} as WishlistValue);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>("daily.wishlist", ["p4", "p1"]);

  const value = useMemo<WishlistValue>(
    () => ({
      ids,
      items: products.filter((p) => ids.includes(p.id)),
      isSaved: (id) => ids.includes(id),
      toggle: (id) => setIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])),
      remove: (id) => setIds((prev) => prev.filter((i) => i !== id)),
    }),
    [ids, setIds],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
