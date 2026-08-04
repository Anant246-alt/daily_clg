import Razorpay from "razorpay";

export const getRazorpayInstance = () => {
  const key_id = (process.env.RAZORPAY_KEY_ID || "rzp_test_TLXgSkf5lA607j").replace(/[<>]/g, "").trim();
  const key_secret = (process.env.RAZORPAY_KEY_SECRET || "Nv4EtrRQfJt5nLARCRMDmFog").replace(/[<>]/g, "").trim();

  return new Razorpay({
    key_id,
    key_secret,
  });
};
