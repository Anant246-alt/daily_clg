import salad from "@/assets/salad.jpg";
import sandwich from "@/assets/sandwich.jpg";
import footlong from "@/assets/footlong.jpg";

/** Home carousel banners — replace with GET /api/banners later. */
export const banners = [
  {
    id: "b1",
    title: "50% off on first order",
    subtitle: "Fresh salads delivered in 20 minutes",
    cta: "Order now",
    image: salad,
    code: "DAILY50",
  },
  {
    id: "b2",
    title: "Footlong Fridays",
    subtitle: "Buy one footlong, get an iced tea free",
    cta: "Grab the deal",
    image: footlong,
    code: "FOOT100",
  },
  {
    id: "b3",
    title: "Protein packed lunch",
    subtitle: "High protein combos under ₹399",
    cta: "Explore combos",
    image: sandwich,
    code: "PROTEIN20",
  },
];

export const offers = [
  { id: "o1", title: "Flat ₹100 off", detail: "On orders above ₹499", code: "SAVE100" },
  { id: "o2", title: "Free delivery", detail: "All week on app orders", code: "FREEDEL" },
  { id: "o3", title: "20% cashback", detail: "Paying via UPI", code: "UPI20" },
];
