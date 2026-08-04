import { createContext, useContext, useMemo, type ReactNode } from "react";
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

  const value = useMemo<AuthValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      hydrated,
      signIn: async (email, otp) => {
        const res = await authApi.verifyOtp(email, otp);
        window.localStorage.setItem("daily.token", res.token);
        setUser(res.user);
      },
      signOut: () => {
        void authApi.logout();
        window.localStorage.removeItem("daily.token");
        setUser(null);
      },
      updateUser: (patch) => setUser((u) => (u ? { ...u, ...patch } : u)),
    }),
    [user, hydrated, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
