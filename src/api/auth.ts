import { api } from "./client";

export const sendOtp = async (email: string) => {
  try {
    return (await api.post("/auth/send-otp", { email })).data;
  } catch (error: any) {
    console.warn("[Auth Warning] API call error:", error?.message);
    throw new Error(error.response?.data?.message || "Failed to send OTP email");
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  if (otp.length !== 6) throw new Error("Invalid OTP");
  try {
    const res = await api.post("/auth/verify-otp", { email, otp });
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Invalid OTP code. Please check your Gmail inbox.";
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
