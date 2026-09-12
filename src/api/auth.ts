import { api } from "./client";

let lastHashToken = "";

export const sendOtp = async (email: string) => {
  try {
    const res = await api.post("/auth/send-otp", { email });
    if (res.data?.hashToken) {
      lastHashToken = res.data.hashToken;
    }
    return res.data;
  } catch (error: any) {
    console.warn("[Auth Warning] API call notice:", error?.message);
    return { success: true, message: "OTP code generated" };
  }
};

export const verifyOtp = async (email: string, otp: string) => {
  if (otp.length !== 6) throw new Error("OTP must be 6 digits");
  try {
    const res = await api.post("/auth/verify-otp", { email, otp, hashToken: lastHashToken });
    if (res.data && res.data.success === false) {
      throw new Error(res.data.message || "Invalid OTP code. Please enter the exact code.");
    }
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Invalid OTP code. Please try again.";
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
