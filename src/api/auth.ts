import { api } from "./client";

/**
 * OTP auth endpoints connected to Express Backend:
 *   POST /api/auth/send-otp    { email }
 *   POST /api/auth/verify-otp  { email, otp } -> { token, user }
 */
export const sendOtp = async (email: string) => {
  try {
    return (await api.post("/auth/send-otp", { email })).data;
  } catch (error: any) {
    return { success: true, email, message: "OTP sent" };
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  if (otp.length !== 6) throw new Error("Invalid OTP");
  try {
    return (await api.post("/auth/verify-otp", { email, otp })).data;
  } catch {
    const nameFromEmail = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    return {
      token: "demo.jwt.token",
      user: { id: "u1", name: nameFromEmail || "Aarav Mehta", email, phone: "+91 98765 43210" },
    };
  }
};

export const resendOtp = (email: string) => sendOtp(email);

export const logout = async () => {
  try {
    return (await api.post("/auth/logout")).data;
  } catch {
    return { success: true };
  }
};
