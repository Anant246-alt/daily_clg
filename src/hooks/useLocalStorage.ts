import { useEffect, useState, useCallback } from "react";

/** localStorage-backed state that is SSR-safe and memoization-stable. */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setValue(JSON.parse(raw) as T);
      }
    } catch {
      /* ignore corrupted entries */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }, [key, value, hydrated]);

  const updateValue = useCallback((val: T | ((prev: T) => T)) => {
    setValue(val);
  }, []);

  return [value, updateValue, hydrated] as const;
}
