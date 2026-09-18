import { createContext, useContext, useMemo, useCallback, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import * as authApi from "@/api/auth";
import * as profileApi from "@/api/profile";

export type User = { id: string; name: string; email: string; phone: string; avatar?: string };

export type SignInResult = {
  isNewUser?: boolean;
  message?: string;
  user?: User;
  token?: string;
};

type AuthValue = {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  signIn: (email: string, otp: string) => Promise<SignInResult>;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue>({} as AuthValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser, hydrated] = useLocalStorage<User | null>("daily.user", null);

  const refreshProfile = useCallback(async () => {
    const token = window.localStorage.getItem("daily.token");
    if (!token) return;
    try {
      const p = await profileApi.fetchProfile();
      if (p && (p.name || p.email)) {
        setUser(p);
      }
    } catch {
      /* ignore offline/error */
    }
  }, [setUser]);

  useEffect(() => {
    if (hydrated) {
      void refreshProfile();
    }
  }, [hydrated, refreshProfile]);

  const signIn = useCallback(
    async (email: string, otp: string) => {
      const res = await authApi.verifyOtp(email, otp);
      if (res.token) {
        window.localStorage.setItem("daily.token", res.token);
      }
      if (res.user) {
        setUser(res.user);
      }
      try {
        const fresh = await profileApi.fetchProfile();
        if (fresh && (fresh.name || fresh.email)) {
          setUser(fresh);
        }
      } catch {
        /* fallback to verifyOtp user */
      }
      return res;
    },
    [setUser],
  );

  const signOut = useCallback(() => {
    void authApi.logout();
    window.localStorage.removeItem("daily.token");
    window.localStorage.removeItem("daily.user");
    setUser(null);
  }, [setUser]);

  const updateUser = useCallback(
    (patch: Partial<User>) => {
      setUser((u) => {
        const next = u ? { ...u, ...patch } : (patch as User);
        window.localStorage.setItem("daily.user", JSON.stringify(next));
        return next;
      });
    },
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
      refreshProfile,
    }),
    [user, hydrated, signIn, signOut, updateUser, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
