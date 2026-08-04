import { Banner, Offer } from "../models/Banner.js";

const fallbackBanners = [
  {
    id: "b1",
    title: "50% off on first order",
    subtitle: "Fresh salads delivered in 20 minutes",
    cta: "Order now",
    image: "/assets/salad.jpg",
    code: "DAILY50",
  },
  {
    id: "b2",
    title: "Footlong Fridays",
    subtitle: "Buy one footlong, get an iced tea free",
    cta: "Grab the deal",
    image: "/assets/footlong.jpg",
    code: "FOOT100",
  },
  {
    id: "b3",
    title: "Protein packed lunch",
    subtitle: "High protein combos under ₹399",
    cta: "Explore combos",
    image: "/assets/sandwich.jpg",
    code: "PROTEIN20",
  },
];

const fallbackOffers = [
  { id: "o1", title: "Flat ₹100 off", detail: "On orders above ₹499", code: "SAVE100" },
  { id: "o2", title: "Free delivery", detail: "All week on app orders", code: "FREEDEL" },
  { id: "o3", title: "20% cashback", detail: "Paying via UPI", code: "UPI20" },
];

export const getBannersAndOffers = async (req, res, next) => {
  try {
    let banners = [];
    let offers = [];
    try {
      banners = await Banner.find().select("-__v");
      offers = await Offer.find().select("-__v");
    } catch (err) {
      console.warn("[Banners] DB fetch failed");
    }

    if (!banners || banners.length === 0) banners = fallbackBanners;
    if (!offers || offers.length === 0) offers = fallbackOffers;

    return res.status(200).json({ banners, offers });
  } catch (error) {
    next(error);
  }
};
