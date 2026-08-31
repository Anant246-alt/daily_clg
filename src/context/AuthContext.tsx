import { createContext, useContext, useMemo, useCallback, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import * as authApi from "@/api/auth";

export type User = { id: string; name: string; email: string; phone: string; avatar?: string };

type AuthValue = {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  signIn: (email: string, otp: string) => Promise<void>;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthValue>({} as AuthValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, hydrated] = useLocalStorage<User | null>("daily.user", null);

  const signIn = useCallback(
    async (email: string, otp: string) => {
      const res = await authApi.verifyOtp(email, otp);
      window.localStorage.setItem("daily.token", res.token);
      setUser(res.user);
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    void authApi.logout();
    window.localStorage.removeItem("daily.token");
    setUser(null);
  }, [setUser]);

  const updateUser = useCallback(
    (patch: Partial<User>) => setUser((u) => (u ? { ...u, ...patch } : u)),
    [setUser],
  );

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      hydrated,
      signIn,
      signOut,
      updateUser,
    }),
    [user, hydrated, signIn, signOut, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
