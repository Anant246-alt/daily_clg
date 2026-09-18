import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { FiMail, FiUser, FiArrowRight, FiEdit2, FiAlertCircle } from "react-icons/fi";
import { toast } from "sonner";
import { sendOtp } from "@/api/auth";
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "@/components/States";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up · Daily" },
      { name: "description", content: "Create your free account on Daily to order fresh healthy food." },
      { property: "og:title", content: "Sign Up · Daily" },
      { property: "og:description", content: "Create your free account on Daily to order fresh healthy food." },
    ],
  }),
  component: SignUpPage,
});

const inputValidEmail = (v: string) => {
  const trimmed = v.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

function SignUpPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, hydrated } = useAuth();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [seconds, setSeconds] = useState(30);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      void navigate({ to: "/home" });
    }
  }, [hydrated, isAuthenticated, navigate]);

  useEffect(() => {
    if (step === "details") {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    if (step !== "otp" || seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, seconds]);

  /** Send OTP for New User Registration */
  const handleSendOtp = async () => {
    setAlreadyRegistered(false);
    if (!name.trim()) return setError("Please enter your full name");
    if (!inputValidEmail(email)) return setError("Please enter a valid email address");

    setError("");
    setLoading(true);
    try {
      const res = await sendOtp(email, "signup");
      const recipient = res?.email || email;
      toast.success("OTP Sent Successfully", {
        description: `We sent a 6-digit verification code to ${recipient}. Please check your email inbox.`,
      });
      setStep("otp");
      setSeconds(30);
    } catch (err: any) {
      if (err.isAlreadyRegistered) {
        setAlreadyRegistered(true);
        setError("This email address is already registered. Please Sign In instead.");
        toast.error("Email Already Registered", {
          description: "This email is already registered. Please Sign In instead.",
        });
      } else {
        const errorMsg = err.message || "Email delivery failure. Could not send OTP to the entered email address.";
        setError(errorMsg);
        toast.error("Email Delivery Failure", { description: errorMsg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    setOtp((prev) => prev.map((d, idx) => (idx === i ? digit : d)));
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  /** Verify OTP & Complete Registration */
  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) return setError("Enter all 6 digits");
    setError("");
    setLoading(true);
    try {
      const res = await signIn(email, code, name.trim());
      if (res?.isNewUser) {
        toast.success("Successful Registration!", {
          description: "Your new account has been created. Welcome to Daily!",
        });
      } else {
        toast.success("Successful Login!", {
          description: "Welcome back to Daily!",
        });
      }
      void navigate({ to: "/home" });
    } catch (err: any) {
      const errorMsg = err.message || "Invalid or expired OTP code. Please check your email inbox and try again.";
      setError(errorMsg);
      toast.error("Invalid or Expired OTP", { description: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-5 py-10">
      <div className="mx-auto w-full max-w-md">
        {/* Registration Header Card inspired by Reference Image */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-soft)]"
        >
          {/* Top Banner Accent */}
          <div className="bg-primary/10 px-6 py-6 text-center border-b border-border/50">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border p-2 shadow-sm">
              <img src="/logo.png" alt="Daily Logo" className="size-full object-contain" />
            </div>
            <h1 className="text-2xl font-black sm:text-3xl">Welcome</h1>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Create your free account in seconds.
            </p>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === "details" ? (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-4"
                >
                  {/* Full Name Input */}
                  <label htmlFor="name-input" className="block space-y-1.5 cursor-pointer">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</span>
                    <span className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 cursor-text focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
                      <FiUser className="text-muted-foreground flex-shrink-0" />
                      <input
                        id="name-input"
                        name="name"
                        ref={nameInputRef}
                        type="text"
                        autoFocus
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setError("");
                        }}
                        placeholder="Your full name"
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none cursor-text"
                      />
                    </span>
                  </label>

                  {/* Email Address Input */}
                  <label htmlFor="email-input" className="block space-y-1.5 cursor-pointer">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</span>
                    <span className="flex items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 cursor-text focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
                      <FiMail className="text-muted-foreground flex-shrink-0" />
                      <input
                        id="email-input"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                          setAlreadyRegistered(false);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                        placeholder="your@email.com"
                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none cursor-text"
                      />
                    </span>
                  </label>

                  {error && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive flex items-center gap-2">
                      <FiAlertCircle className="shrink-0 size-4" />
                      <span className="flex-1">{error}</span>
                    </div>
                  )}

                  {alreadyRegistered && (
                    <Link
                      to="/login"
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary bg-primary/10 py-3 text-xs font-bold text-primary hover:bg-primary/20 transition cursor-pointer"
                    >
                      Sign In Now <FiArrowRight />
                    </Link>
                  )}

                  {!alreadyRegistered && (
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-70 cursor-pointer shadow-md hover:opacity-90 transition"
                    >
                      {loading ? <Spinner className="border-primary-foreground/40 border-t-primary-foreground" /> : null}
                      Create Free Account <FiArrowRight />
                    </motion.button>
                  )}

                  <p className="text-center text-[11px] text-muted-foreground pt-1">
                    By registering, you agree to our Terms of Use and Privacy Policy.
                  </p>

                  <div className="pt-4 text-center border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="font-extrabold text-primary hover:underline">
                        Sign In
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="text-center space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">
                      Enter the 6-digit verification code sent to:
                    </p>
                    <p className="text-sm font-extrabold text-foreground">{email}</p>
                  </div>

                  <div className="flex justify-between gap-2 py-2">
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
                        className="size-11 rounded-2xl border border-border bg-background text-center text-lg font-bold outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30 sm:size-13"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive flex items-center gap-2">
                      <FiAlertCircle className="shrink-0 size-4" />
                      <span className="flex-1">{error}</span>
                    </div>
                  )}

                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={handleVerify}
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground disabled:opacity-70 cursor-pointer shadow-md hover:opacity-90 transition"
                  >
                    {loading ? <Spinner className="border-primary-foreground/40 border-t-primary-foreground" /> : null}
                    Verify OTP & Register
                  </motion.button>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("details");
                        setOtp(["", "", "", "", "", ""]);
                        setError("");
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <FiEdit2 /> Change details
                    </button>
                    <button
                      type="button"
                      disabled={seconds > 0}
                      onClick={async () => {
                        setSeconds(30);
                        try {
                          await sendOtp(email, "signup");
                          toast.success("OTP Verification Code Resent", {
                            description: `Code sent to ${email}`,
                          });
                        } catch (err: any) {
                          toast.error("Email Delivery Failure", {
                            description: err.message || "Failed to resend OTP",
                          });
                        }
                      }}
                      className="font-bold text-primary disabled:text-muted-foreground cursor-pointer"
                    >
                      {seconds > 0 ? `Resend in ${seconds}s` : "Resend OTP"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
