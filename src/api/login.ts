import { mockRequest } from "./client";
import { sendOtp, verifyOtp } from "./auth";

/** Alias module kept so backend wiring mirrors the Express route files. */
export const login = sendOtp;
export const confirmLogin = verifyOtp;
export const refreshSession = async () => mockRequest({ token: "demo.jwt.token" }, 200);
