import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
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

  const isSaved = useCallback((id: string) => ids.includes(id), [ids]);

  const toggle = useCallback(
    (id: string) => setIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])),
    [setIds],
  );

  const remove = useCallback((id: string) => setIds((prev) => prev.filter((i) => i !== id)), [setIds]);

  const value = useMemo<WishlistValue>(
    () => ({
      ids,
      items: products.filter((p) => ids.includes(p.id)),
      isSaved,
      toggle,
      remove,
    }),
    [ids, isSaved, toggle, remove],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
