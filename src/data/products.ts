import salad from "@/assets/salad.jpg";
import sandwich from "@/assets/sandwich.jpg";
import icedtea from "@/assets/icedtea.jpg";
import footlong from "@/assets/footlong.jpg";

/** Dummy catalogue — replace with GET /api/products later. */
export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  gallery: string[];
  price: number;
  mrp: number;
  rating: number;
  reviews: number;
  veg: boolean;
  bestSeller: boolean;
  popular: boolean;
  description: string;
  ingredients: string[];
  nutrition: { label: string; value: string }[];
};

const nutrition = (kcal: number, p: number, c: number, f: number) => [
  { label: "Calories", value: `${kcal} kcal` },
  { label: "Protein", value: `${p} g` },
  { label: "Carbs", value: `${c} g` },
  { label: "Fat", value: `${f} g` },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Avocado Garden Salad",
    category: "salads",
    image: salad,
    gallery: [salad, sandwich, icedtea],
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
    nutrition: nutrition(320, 9, 22, 19),
  },
  {
    id: "p2",
    name: "Grilled Chicken Sandwich",
    category: "sandwiches",
    image: sandwich,
    gallery: [sandwich, footlong, salad],
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
    nutrition: nutrition(480, 34, 41, 17),
  },
  {
    id: "p3",
    name: "Peach Mint Iced Tea",
    category: "iced-tea",
    image: icedtea,
    gallery: [icedtea, salad, footlong],
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
    nutrition: nutrition(110, 0, 27, 0),
  },
  {
    id: "p4",
    name: "Paneer Tikka Footlong",
    category: "footlong",
    image: footlong,
    gallery: [footlong, sandwich, salad],
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
    nutrition: nutrition(620, 28, 68, 24),
  },
  {
    id: "p5",
    name: "Berry Yogurt Bowl",
    category: "yogurt-bowl",
    image: salad,
    gallery: [salad, icedtea, sandwich],
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
    nutrition: nutrition(290, 18, 34, 8),
  },
  {
    id: "p6",
    name: "Power Protein Combo",
    category: "combos",
    image: sandwich,
    gallery: [sandwich, salad, icedtea],
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
    nutrition: nutrition(780, 45, 72, 26),
  },
  {
    id: "p7",
    name: "Quinoa Protein Bowl",
    category: "protein-meals",
    image: salad,
    gallery: [salad, footlong, sandwich],
    price: 319,
    mrp: 399,
    rating: 4.6,
    reviews: 122,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Warm quinoa, roasted chickpeas, grilled veggies and tahini dressing. 30g plant protein in every bowl.",
    ingredients: ["Quinoa", "Chickpeas", "Zucchini", "Tahini", "Pumpkin seeds"],
    nutrition: nutrition(540, 30, 61, 16),
  },
  {
    id: "p8",
    name: "Sunrise Breakfast Sub",
    category: "breakfast",
    image: footlong,
    gallery: [footlong, sandwich, icedtea],
    price: 229,
    mrp: 289,
    rating: 4.4,
    reviews: 87,
    veg: false,
    bestSeller: false,
    popular: false,
    description:
      "Scrambled eggs, turkey rashers and melted cheddar in a warm sub. The classic morning starter.",
    ingredients: ["Egg", "Turkey rashers", "Cheddar", "Sub bread", "Chives"],
    nutrition: nutrition(510, 27, 44, 22),
  },
  {
    id: "p9",
    name: "Roasted Nut Mix",
    category: "healthy-snacks",
    image: salad,
    gallery: [salad, icedtea, footlong],
    price: 149,
    mrp: 199,
    rating: 4.3,
    reviews: 64,
    veg: true,
    bestSeller: false,
    popular: false,
    description:
      "Slow roasted almonds, cashews and pistachios with a pinch of Himalayan salt. Zero oil, zero guilt.",
    ingredients: ["Almonds", "Cashews", "Pistachios", "Himalayan salt"],
    nutrition: nutrition(210, 8, 9, 17),
  },
  {
    id: "p10",
    name: "Classic Veg Club Sandwich",
    category: "sandwiches",
    image: sandwich,
    gallery: [sandwich, salad, footlong],
    price: 219,
    mrp: 279,
    rating: 4.5,
    reviews: 173,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Triple layered club with grilled veggies, cheese and herbed mayo. Comfort food done right.",
    ingredients: ["Multigrain bread", "Grilled veggies", "Cheese", "Herbed mayo"],
    nutrition: nutrition(430, 16, 52, 15),
  },
  {
    id: "p11",
    name: "Lemon Basil Iced Tea",
    category: "iced-tea",
    image: icedtea,
    gallery: [icedtea, footlong, salad],
    price: 119,
    mrp: 159,
    rating: 4.4,
    reviews: 58,
    veg: true,
    bestSeller: false,
    popular: false,
    description: "Green tea shaken with lemon, basil and a hint of honey. Crisp and refreshing.",
    ingredients: ["Green tea", "Lemon", "Basil", "Honey"],
    nutrition: nutrition(90, 0, 21, 0),
  },
  {
    id: "p12",
    name: "Mediterranean Salad",
    category: "salads",
    image: salad,
    gallery: [salad, sandwich, icedtea],
    price: 269,
    mrp: 339,
    rating: 4.6,
    reviews: 133,
    veg: true,
    bestSeller: false,
    popular: true,
    description: "Cucumber, olives, feta and sun dried tomatoes with oregano olive oil dressing.",
    ingredients: ["Cucumber", "Feta", "Olives", "Sun dried tomato", "Oregano oil"],
    nutrition: nutrition(340, 12, 24, 21),
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const byCategory = (slug: string) => products.filter((p) => p.category === slug);
