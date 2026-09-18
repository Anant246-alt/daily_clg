import { api } from "./client";

let lastHashToken = "";

export const sendOtp = async (email: string, mode?: "signup" | "login") => {
  try {
    const res = await api.post("/auth/send-otp", { email, mode });
    if (res.data?.hashToken) {
      lastHashToken = res.data.hashToken;
    }
    if (res.data && res.data.success === false) {
      const err: any = new Error(res.data.message || res.data.error || "Email delivery failure");
      err.isAlreadyRegistered = res.data.isAlreadyRegistered;
      err.isNotRegistered = res.data.isNotRegistered;
      throw err;
    }
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to send OTP email.";
    const errObj: any = new Error(msg);
    errObj.isAlreadyRegistered = error.response?.data?.isAlreadyRegistered;
    errObj.isNotRegistered = error.response?.data?.isNotRegistered;
    throw errObj;
  }
};

export const verifyOtp = async (email: string, otp: string, name?: string) => {
  if (otp.length !== 6) throw new Error("OTP must be 6 digits");
  try {
    const res = await api.post("/auth/verify-otp", { email, otp, hashToken: lastHashToken, name });
    if (res.data && res.data.success === false) {
      throw new Error(res.data.message || "Invalid or expired OTP code.");
    }
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "OTP verification failed. Please try again.";
    throw new Error(msg);
  }
};

export const resendOtp = (email: string, mode?: "signup" | "login") => sendOtp(email, mode);

export const logout = async () => {
  try {
    return (await api.post("/auth/logout")).data;
  } catch {
    return { success: true };
  }
};
