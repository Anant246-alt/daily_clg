import salad from "@/assets/salad.jpg";
import sandwich from "@/assets/sandwich.jpg";
import icedtea from "@/assets/icedtea.jpg";
import footlong from "@/assets/footlong.jpg";

/** Pure Vegetarian Catalogue */
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
    name: "Grilled Paneer & Herb Sandwich",
    category: "sandwiches",
    image: sandwich,
    gallery: [sandwich, footlong, salad],
    price: 289,
    mrp: 349,
    rating: 4.7,
    reviews: 431,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Herbed paneer slabs, roasted bell peppers and fresh basil layered in toasted sourdough with garlic aioli.",
    ingredients: ["Paneer", "Sourdough", "Bell peppers", "Basil", "Garlic aioli"],
    nutrition: nutrition(440, 24, 41, 19),
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
    name: "Veggie Delight Combo",
    category: "combos",
    image: sandwich,
    gallery: [sandwich, salad, icedtea],
    price: 399,
    mrp: 499,
    rating: 4.7,
    reviews: 141,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Grilled Paneer sandwich, a garden side salad and an iced tea. 100% vegetarian energy meal.",
    ingredients: ["Paneer sandwich", "Side salad", "Iced tea"],
    nutrition: nutrition(680, 28, 72, 22),
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
