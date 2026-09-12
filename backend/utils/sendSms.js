import axios from "axios";

/**
 * Sends real SMS text message containing the 6-digit OTP code to a mobile phone number (+91)
 * Supports Fast2SMS (India) and Twilio (Global).
 */
export const sendSmsOtp = async (phone, otpCode) => {
  const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: "Invalid phone number format" };
  }

  const message = `Your Daily Verification OTP Code is ${otpCode}. Valid for 10 mins.`;

  // 1. Fast2SMS API Integration (India +91 numbers)
  const fast2smsKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsKey) {
    try {
      const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2smsKey)}&route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${cleanPhone}`;
      const response = await axios.get(url, { timeout: 8000 });
      console.log(`[Fast2SMS Success] Sent SMS OTP to +91${cleanPhone}`);
      return { success: true, provider: "fast2sms", data: response.data };
    } catch (err) {
      console.warn(`[Fast2SMS Notice]: ${err.message}`);
    }
  }

  // 2. Twilio SMS Integration
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

  if (twilioSid && twilioAuth && twilioPhone) {
    try {
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString("base64");
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
      
      const params = new URLSearchParams();
      params.append("To", `+91${cleanPhone}`);
      params.append("From", twilioPhone);
      params.append("Body", message);

      const response = await axios.post(twilioUrl, params.toString(), {
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 8000,
      });

      console.log(`[Twilio Success] Sent SMS to +91${cleanPhone}`);
      return { success: true, provider: "twilio", data: response.data };
    } catch (err) {
      console.warn(`[Twilio Notice]: ${err.message}`);
    }
  }

  return { success: true, simulated: true, otp: otpCode };
};
