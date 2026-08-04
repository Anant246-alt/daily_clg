import mongoose from "mongoose";
import dotenv from "dotenv";
import { Category } from "../models/Category.js";
import { Product } from "../models/Product.js";
import { Review } from "../models/Review.js";
import { Notification } from "../models/Notification.js";
import { Banner, Offer } from "../models/Banner.js";

dotenv.config();

const categories = [
  { id: "c1", name: "Salads", slug: "salads", emoji: "🥗", items: 18 },
  { id: "c2", name: "Sandwiches", slug: "sandwiches", emoji: "🥪", items: 24 },
  { id: "c3", name: "Iced Tea", slug: "iced-tea", emoji: "🧋", items: 12 },
  { id: "c4", name: "Footlong", slug: "footlong", emoji: "🌭", items: 9 },
  { id: "c5", name: "Yogurt Bowl", slug: "yogurt-bowl", emoji: "🍨", items: 11 },
  { id: "c6", name: "Combos", slug: "combos", emoji: "🍱", items: 15 },
  { id: "c7", name: "Protein Meals", slug: "protein-meals", emoji: "🍗", items: 14 },
  { id: "c8", name: "Breakfast", slug: "breakfast", emoji: "🥐", items: 16 },
  { id: "c9", name: "Healthy Snacks", slug: "healthy-snacks", emoji: "🥜", items: 20 },
];

const products = [
  {
    id: "p1",
    name: "Avocado Garden Salad",
    category: "salads",
    image: "/assets/salad.jpg",
    gallery: ["/assets/salad.jpg", "/assets/sandwich.jpg", "/assets/icedtea.jpg"],
    price: 249,
    mrp: 329,
    rating: 4.8,
    reviews: 214,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Crisp farm greens tossed with ripe avocado, cherry tomatoes, olives and a house lemon vinaigrette. Light, fresh and packed with good fats.",
    ingredients: ["Mixed greens", "Avocado", "Cherry tomato", "Black olives", "Lemon vinaigrette"],
    nutrition: [
      { label: "Calories", value: "320 kcal" },
      { label: "Protein", value: "9 g" },
      { label: "Carbs", value: "22 g" },
      { label: "Fat", value: "19 g" },
    ],
  },
  {
    id: "p2",
    name: "Grilled Chicken Sandwich",
    category: "sandwiches",
    image: "/assets/sandwich.jpg",
    gallery: ["/assets/sandwich.jpg", "/assets/footlong.jpg", "/assets/salad.jpg"],
    price: 289,
    mrp: 349,
    rating: 4.7,
    reviews: 431,
    veg: false,
    bestSeller: true,
    popular: true,
    description:
      "Flame grilled chicken breast, garden herbs and peppers layered in a toasted sourdough with smoky aioli.",
    ingredients: ["Chicken breast", "Sourdough", "Bell peppers", "Parsley", "Smoky aioli"],
    nutrition: [
      { label: "Calories", value: "480 kcal" },
      { label: "Protein", value: "34 g" },
      { label: "Carbs", value: "41 g" },
      { label: "Fat", value: "17 g" },
    ],
  },
  {
    id: "p3",
    name: "Peach Mint Iced Tea",
    category: "iced-tea",
    image: "/assets/icedtea.jpg",
    gallery: ["/assets/icedtea.jpg", "/assets/salad.jpg", "/assets/footlong.jpg"],
    price: 129,
    mrp: 169,
    rating: 4.6,
    reviews: 188,
    veg: true,
    bestSeller: true,
    popular: false,
    description:
      "Cold brewed black tea infused with sun ripened peach and fresh mint. Served over ice, never from concentrate.",
    ingredients: ["Black tea", "Peach purée", "Mint", "Lemon", "Cane sugar"],
    nutrition: [
      { label: "Calories", value: "110 kcal" },
      { label: "Protein", value: "0 g" },
      { label: "Carbs", value: "27 g" },
      { label: "Fat", value: "0 g" },
    ],
  },
  {
    id: "p4",
    name: "Paneer Tikka Footlong",
    category: "footlong",
    image: "/assets/footlong.jpg",
    gallery: ["/assets/footlong.jpg", "/assets/sandwich.jpg", "/assets/salad.jpg"],
    price: 349,
    mrp: 449,
    rating: 4.9,
    reviews: 302,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "A full footlong loaded with charred paneer tikka, crunchy lettuce, tomatoes and mint mayo in a soft baked baguette.",
    ingredients: ["Paneer tikka", "Baguette", "Lettuce", "Tomato", "Mint mayo"],
    nutrition: [
      { label: "Calories", value: "620 kcal" },
      { label: "Protein", value: "28 g" },
      { label: "Carbs", value: "68 g" },
      { label: "Fat", value: "24 g" },
    ],
  },
  {
    id: "p5",
    name: "Berry Yogurt Bowl",
    category: "yogurt-bowl",
    image: "/assets/salad.jpg",
    gallery: ["/assets/salad.jpg", "/assets/icedtea.jpg", "/assets/sandwich.jpg"],
    price: 199,
    mrp: 259,
    rating: 4.5,
    reviews: 96,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Thick Greek yogurt topped with seasonal berries, toasted granola, chia seeds and a drizzle of wild honey.",
    ingredients: ["Greek yogurt", "Berries", "Granola", "Chia seeds", "Honey"],
    nutrition: [
      { label: "Calories", value: "290 kcal" },
      { label: "Protein", value: "18 g" },
      { label: "Carbs", value: "34 g" },
      { label: "Fat", value: "8 g" },
    ],
  },
  {
    id: "p6",
    name: "Power Protein Combo",
    category: "combos",
    image: "/assets/sandwich.jpg",
    gallery: ["/assets/sandwich.jpg", "/assets/salad.jpg", "/assets/icedtea.jpg"],
    price: 429,
    mrp: 569,
    rating: 4.7,
    reviews: 141,
    veg: false,
    bestSeller: true,
    popular: true,
    description:
      "Grilled chicken sandwich, a side salad and an iced tea. Everything you need for a full reset meal.",
    ingredients: ["Chicken sandwich", "Side salad", "Iced tea"],
    nutrition: [
      { label: "Calories", value: "780 kcal" },
      { label: "Protein", value: "45 g" },
      { label: "Carbs", value: "72 g" },
      { label: "Fat", value: "26 g" },
    ],
  },
];

const reviews = [
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

const notifications = [
  {
    id: "n1",
    type: "Order Updates",
    title: "Your order #DLY-1001 is being prepared",
    body: "The kitchen has started on your Paneer Tikka Footlong.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: "n2",
    type: "Offers",
    title: "20% cashback on UPI",
    body: "Pay with any UPI app this week and get up to ₹120 back.",
    time: "1 hr ago",
    unread: true,
  },
  {
    id: "n3",
    type: "Promotions",
    title: "New on the menu: Yogurt Bowls",
    body: "Five new bowls with seasonal fruit. Try them before they sell out.",
    time: "Yesterday",
    unread: false,
  },
];

const banners = [
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

const offers = [
  { id: "o1", title: "Flat ₹100 off", detail: "On orders above ₹499", code: "SAVE100" },
  { id: "o2", title: "Free delivery", detail: "All week on app orders", code: "FREEDEL" },
  { id: "o3", title: "20% cashback", detail: "Paying via UPI", code: "UPI20" },
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    }

    console.log("[Seeder] Clearing old collections...");
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await Banner.deleteMany({});
    await Offer.deleteMany({});

    console.log("[Seeder] Inserting fresh data...");
    await Category.insertMany(categories);
    await Product.insertMany(products);
    await Review.insertMany(reviews);
    await Notification.insertMany(notifications);
    await Banner.insertMany(banners);
    await Offer.insertMany(offers);

    console.log("[Seeder] Database seeded successfully!");
  } catch (error) {
    console.warn(`[Seeder Warning] Database seeding skipped or offline: ${error.message}`);
  }
};

// Execute if called directly from CLI
if (process.argv[1] && process.argv[1].endsWith("seeder.js")) {
  seedDatabase().then(() => process.exit(0));
}
