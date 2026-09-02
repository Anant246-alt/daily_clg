import axios from "axios";

/**
 * Sends SMS text message containing the 6-digit OTP code to an Indian mobile number (+91)
 */
export const sendSmsOtp = async (phone, otpCode) => {
  const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: "Invalid phone number format" };
  }

  // Fast2SMS API integration
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (apiKey) {
    try {
      const message = `Your Daily Verification OTP Code is ${otpCode}. Valid for 10 mins.`;
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(apiKey)}&route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${cleanPhone}`;
      const response = await axios.get(url, { timeout: 8000 });
      return { success: true, data: response.data };
    } catch (err) {
      console.warn(`[Fast2SMS Notice]: ${err.message}`);
    }
  }

  return { success: true, simulated: true, otp: otpCode };
};
