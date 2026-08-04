import { Review } from "../models/Review.js";
import { readCollection, insertDocument } from "../config/fileDb.js";

const fallbackReviews = [
  {
    id: "r1",
    name: "Aarav Mehta",
    initials: "AM",
    rating: 5,
    date: "12 Jul 2026",
    text: "The avocado salad is genuinely the freshest I have had from a delivery app. Packaging was spotless.",
    productId: "p1",
  },
  {
    id: "r2",
    name: "Sara Iqbal",
    initials: "SI",
    rating: 4,
    date: "09 Jul 2026",
    text: "Footlong was loaded and still warm on arrival. Would have liked a bit more mint mayo.",
    productId: "p4",
  },
  {
    id: "r3",
    name: "Rohit Nair",
    initials: "RN",
    rating: 5,
    date: "05 Jul 2026",
    text: "Ordering breakfast every weekday now. Delivery is always ahead of the estimate.",
    productId: "p8",
  },
  {
    id: "r4",
    name: "Ishita Rao",
    initials: "IR",
    rating: 5,
    date: "28 Jun 2026",
    text: "Peach iced tea is dangerously good. The combo pricing makes it an easy lunch.",
    productId: "p3",
  },
];

export const getReviews = async (req, res, next) => {
  try {
    let reviews = [];
    try {
      reviews = await Review.find().select("-__v");
    } catch (err) {
      console.warn("[Reviews] DB fetch failed");
    }

    if (!reviews || reviews.length === 0) {
      reviews = readCollection("reviews", fallbackReviews);
    }
    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let reviews = [];
    try {
      reviews = await Review.find({ productId }).select("-__v");
    } catch (err) {
      console.warn("[Reviews] DB fetch by product failed");
    }

    if (!reviews || reviews.length === 0) {
      const diskReviews = readCollection("reviews", fallbackReviews);
      reviews = diskReviews.filter((r) => r.productId === productId);
    }
    return res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const submitReview = async (req, res, next) => {
  try {
    const { rating, text, productId } = req.body;
    const userName = req.user ? req.user.name : "Aarav Mehta";
    const initials = userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const dateStr = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newReview = {
      id: `r_${Date.now()}`,
      user: req.user ? req.user._id : undefined,
      name: userName,
      initials: initials || "AM",
      rating: Number(rating) || 5,
      date: dateStr,
      text: text || "Great meal!",
      productId: productId || "p1",
      avatar: req.user?.avatar || "",
    };

    let created = newReview;
    try {
      created = await Review.create(newReview);
    } catch (dbErr) {
      console.warn("[Review] DB write failed");
    }

    insertDocument("reviews", newReview);

    return res.status(201).json({ success: true, review: created });
  } catch (error) {
    next(error);
  }
};
