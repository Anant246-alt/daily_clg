import { api } from "./client";

let lastHashToken = "";

export const sendOtp = async (email: string) => {
  try {
    const res = await api.post("/auth/send-otp", { email });
    if (res.data?.hashToken) {
      lastHashToken = res.data.hashToken;
    }
    if (res.data && res.data.success === false) {
      throw new Error(res.data.message || res.data.error || "Email delivery failure");
    }
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to send OTP email.";
    throw new Error(msg);
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  if (otp.length !== 6) throw new Error("OTP must be 6 digits");
  try {
    const res = await api.post("/auth/verify-otp", { email, otp, hashToken: lastHashToken });
    if (res.data && res.data.success === false) {
      throw new Error(res.data.message || "Invalid or expired OTP code.");
    }
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "OTP verification failed. Please try again.";
    throw new Error(msg);
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
