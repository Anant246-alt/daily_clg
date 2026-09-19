import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiUserPlus, FiLogIn, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication · Daily" },
      { name: "description", content: "Sign up for a new account or sign in to your existing Daily account." },
      { property: "og:title", content: "Authentication · Daily" },
      { property: "og:description", content: "Sign up for a new account or sign in to your existing Daily account." },
    ],
  }),
  component: AuthLandingPage,
});

function AuthLandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, hydrated, signOut } = useAuth();

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      void navigate({ to: "/home" });
    }
  }, [hydrated, isAuthenticated, navigate]);

  if (isAuthenticated && user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-2xl font-black text-primary shadow-sm">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="size-full rounded-2xl object-cover" />
            ) : (
              (user.name || "U").slice(0, 1).toUpperCase()
            )}
          </div>
          <div className="space-y-1">
            <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary border border-primary/20">
              Active Session
            </span>
            <h1 className="text-2xl font-black pt-2">Already Signed In</h1>
            <p className="text-xs text-muted-foreground">
              You are currently logged in as <span className="font-extrabold text-foreground">{user.name}</span> ({user.email}).
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/home"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition cursor-pointer"
            >
              Continue to Store <FiArrowRight />
            </Link>
            <button
              onClick={() => {
                signOut();
                toast.info("Signed out from your account.");
              }}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-background py-3 text-xs font-bold text-destructive hover:bg-destructive/10 transition cursor-pointer"
            >
              Sign Out / Switch Account
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Top Header Card inspired by reference image */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
        >
          {/* Header Banner Header */}
          <div className="bg-primary/10 px-6 py-8 text-center border-b border-border/50 relative">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-border p-2 shadow-md">
              <img src="/logo.png" alt="Daily Logo" className="size-full object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">Welcome to Daily</h1>
            <p className="mt-1 text-xs font-semibold text-primary">Fresh, healthy food delivered in 20 minutes.</p>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-center text-xs text-muted-foreground font-medium">
              Please choose how you would like to continue:
            </p>

            {/* Option 1: Sign Up for New Users */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3 transition hover:border-primary/40">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <FiUserPlus className="size-5" />
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 font-extrabold text-sm text-foreground">
                    Sign Up — New User
                    <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary">
                      New
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Create a new account if you do not have one yet. Register in seconds with a verification code.
                  </p>
                </div>
              </div>
              <Link
                to="/signup"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-xs font-bold text-primary-foreground shadow-sm hover:opacity-90 transition cursor-pointer"
              >
                Create Free Account <FiArrowRight />
              </Link>
            </div>

            {/* Option 2: Sign In / Login for Existing Users */}
            <div className="rounded-2xl border border-border bg-background p-4 space-y-3 transition hover:border-border/80">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground shadow-sm">
                  <FiLogIn className="size-5" />
                </span>
                <div className="space-y-1">
                  <div className="font-extrabold text-sm text-foreground">Sign In / Login</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    If you already have a Daily account, sign in quickly using your registered email address.
                  </p>
                </div>
              </div>
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-xs font-bold text-foreground hover:bg-accent transition cursor-pointer"
              >
                Sign In / Login <FiArrowRight />
              </Link>
            </div>

            {/* Value Props Footer */}
            <div className="pt-2 border-t border-border flex justify-between items-center text-[11px] text-muted-foreground font-semibold">
              <span className="inline-flex items-center gap-1"><FiCheckCircle className="text-primary" /> Pure Veg Food</span>
              <span className="inline-flex items-center gap-1"><FiCheckCircle className="text-primary" /> Live Tracking</span>
              <span className="inline-flex items-center gap-1"><FiCheckCircle className="text-primary" /> Instant Delivery</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
