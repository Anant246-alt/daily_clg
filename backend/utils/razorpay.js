import Razorpay from "razorpay";

export const getRazorpayKeyId = () =>
  (process.env.RAZORPAY_KEY_ID || "rzp_test_TLXgSkf5lA607j").replace(/[<>]/g, "").trim();

export const getRazorpayKeySecret = () =>
  (process.env.RAZORPAY_KEY_SECRET || "Nv4EtrRQfJt5nLARCRMDmFog").replace(/[<>]/g, "").trim();

export const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: getRazorpayKeyId(),
    key_secret: getRazorpayKeySecret(),
  });
};
