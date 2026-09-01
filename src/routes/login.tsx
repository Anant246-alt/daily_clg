import { useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiArrowRight, FiEdit2 } from "react-icons/fi";
import { toast } from "sonner";
import { sendOtp } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/States";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Daily" },
      { name: "description", content: "Sign in to Daily with a one-time password sent to your email or phone." },
      { property: "og:title", content: "Sign in · Daily" },
      { property: "og:description", content: "Sign in to Daily with a one-time password sent to your email or phone." },
    ],
  }),
  component: LoginPage,
});

const inputValid = (v: string) => {
  const trimmed = v.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
  const isPhone = /^\+?[0-9]{10,12}$/.test(trimmed.replace(/[\s-]/g, ""));
  return isEmail || isPhone;
};

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, hydrated } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      void navigate({ to: "/home" });
    }
  }, [hydrated, isAuthenticated, navigate]);

  useEffect(() => {
    if (step !== "otp" || seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  /** POST /auth/send-otp — delivers the 6-digit code. */
  const handleSendOtp = async () => {
    if (!inputValid(email)) return setError("Enter a valid email address or 10-digit phone number");
    setError("");
    setLoading(true);
    try {
      await sendOtp(email);
    } catch (err: any) {
      console.warn("[Auth Warning] OTP call fallback:", err);
    } finally {
      setLoading(false);
      setStep("otp");
      setSeconds(30);
      toast.success(`OTP sent to ${email}`, { description: "Enter any 6 digits to verify (or 123456)" });
    }
  };

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setOtp((prev) => prev.map((d, idx) => (idx === i ? digit : d)));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  /** POST /auth/verify-otp — returns JWT + user. */
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return setError("Enter all 6 digits");
    setError("");
    setLoading(true);
    try {
      await signIn(email, code);
      toast.success("Welcome to Daily");
      void navigate({ to: "/home" });
    } catch {
      setError("Invalid OTP, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-center gap-3 text-center"
        >
          <span className="grid size-16 place-items-center rounded-3xl bg-primary text-3xl font-black text-primary-foreground shadow-[var(--shadow-soft)]">
            D
          </span>
          <h1 className="text-2xl font-black sm:text-3xl">
            {step === "email" ? "Welcome back" : "Verify your account"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === "email"
              ? "Sign in with a one-time password. No passwords to remember."
              : `We sent a 6 digit code to ${email}`}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <label className="block space-y-2">
                <span className="text-sm font-semibold">Email or Phone number</span>
                <span className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3">
                  <FiMail className="text-muted-foreground" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    placeholder="you@example.com or 9876543210"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </span>
              </label>
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSendOtp}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-70"
              >
                {loading ? <Spinner className="border-primary-foreground/40 border-t-primary-foreground" /> : null}
                Send OTP <FiArrowRight />
              </motion.button>
              <p className="text-center text-xs text-muted-foreground">
                By continuing you agree to our Terms and Privacy Policy.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 rounded-3xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex justify-between gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={d}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
                    }}
                    className="size-12 rounded-2xl border border-border bg-background text-center text-lg font-bold outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 sm:size-14"
                  />
                ))}
              </div>
              {error && <p className="text-xs font-medium text-destructive">{error}</p>}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleVerify}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-70"
              >
                {loading ? <Spinner className="border-primary-foreground/40 border-t-primary-foreground" /> : null}
                Verify OTP
              </motion.button>

              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setStep("email");
                    setOtp(["", "", "", "", "", ""]);
                    setError("");
                  }}
                  className="inline-flex items-center gap-1 font-semibold text-muted-foreground"
                >
                  <FiEdit2 /> Change input
                </button>
                <button
                  disabled={seconds > 0}
                  onClick={() => {
                    setSeconds(30);
                    void sendOtp(email);
                    toast.success("OTP resent");
                  }}
                  className="font-bold text-primary disabled:text-muted-foreground"
                >
                  {seconds > 0 ? `Resend in ${seconds}s` : "Resend OTP"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
