import salad from "@/assets/salad.jpg";
import sandwich from "@/assets/sandwich.jpg";
import icedtea from "@/assets/icedtea.jpg";
import footlong from "@/assets/footlong.jpg";
import clubSandwich from "@/assets/club_sandwich.jpg";
import veggieSupremeCombo from "@/assets/veggie_supreme_combo.jpg";
import paneerCombo from "@/assets/paneer_combo.jpg";
import clubCombo from "@/assets/club_combo.jpg";
import healthyGardenFitCombo from "@/assets/healthy_garden_fit_combo.jpg";

import peachIcedTea from "@/assets/peach_iced_tea.jpg";
import lemonBasilIcedTea from "@/assets/lemon_basil_iced_tea.jpg";
import berryHibiscusIcedTea from "@/assets/berry_hibiscus_iced_tea.jpg";
import passionFruitIcedTea from "@/assets/passion_fruit_iced_tea.jpg";
import matchaMintIcedTea from "@/assets/matcha_mint_iced_tea.jpg";

import rawAvocadoSprout from "@/assets/raw_avocado_sprout.jpg";
import cucumberHummus from "@/assets/cucumber_hummus.jpg";
import spinachCottageCheese from "@/assets/spinach_cottage_cheese.jpg";
import avocadoPestoFresh from "@/assets/avocado_pesto_fresh.jpg";
import bombayFreshBeetroot from "@/assets/bombay_fresh_beetroot.jpg";

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
    gallery: [salad, rawAvocadoSprout, peachIcedTea],
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
    name: "Raw Garden Avocado & Sprout Sandwich",
    category: "sandwiches",
    image: rawAvocadoSprout,
    gallery: [rawAvocadoSprout, cucumberHummus, spinachCottageCheese],
    price: 289,
    mrp: 349,
    rating: 4.9,
    reviews: 431,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Fresh ripe avocado slices, crunchy green alfalfa sprouts, crisp English cucumber, and romaine lettuce on soft un-toasted multigrain bread. 100% Fresh & healthy (no cheese, non-grilled).",
    ingredients: ["Soft Multigrain Bread", "Fresh Avocado", "Alfalfa Sprouts", "English Cucumber", "Romaine Lettuce", "Olive Oil"],
    nutrition: nutrition(280, 12, 34, 11),
  },
  {
    id: "p3",
    name: "Peach Mint Iced Tea",
    category: "iced-tea",
    image: peachIcedTea,
    gallery: [peachIcedTea, salad, footlong],
    price: 129,
    mrp: 169,
    rating: 4.8,
    reviews: 218,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Cold brewed black tea infused with sun-ripened peach slices and fresh garden mint. Served over clear ice.",
    ingredients: ["Black tea", "Peach purée", "Fresh mint", "Lemon", "Cane sugar"],
    nutrition: nutrition(110, 0, 27, 0),
  },
  {
    id: "p4",
    name: "Paneer Tikka Footlong",
    category: "footlong",
    image: footlong,
    gallery: [footlong, rawAvocadoSprout, salad],
    price: 349,
    mrp: 449,
    rating: 4.9,
    reviews: 302,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "A full footlong loaded with seasoned paneer tikka, crunchy lettuce, tomatoes and mint mayo in a soft baked baguette.",
    ingredients: ["Paneer tikka", "Baguette", "Lettuce", "Tomato", "Mint mayo"],
    nutrition: nutrition(580, 28, 64, 18),
  },
  {
    id: "p5",
    name: "Berry Yogurt Bowl",
    category: "yogurt-bowl",
    image: salad,
    gallery: [salad, peachIcedTea, rawAvocadoSprout],
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
    name: "Veggie Supreme Delight Combo",
    category: "combos",
    image: veggieSupremeCombo,
    gallery: [veggieSupremeCombo, rawAvocadoSprout, salad, peachIcedTea],
    price: 349,
    mrp: 449,
    rating: 4.8,
    reviews: 241,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "100% Healthy Veg Meal: Raw Garden Avocado & Sprout Sandwich, crisp Avocado Garden Salad, and refreshing Peach Mint Iced Tea.",
    ingredients: ["Raw Garden Avocado & Sprout Sandwich", "Avocado Garden Salad", "Peach Mint Iced Tea"],
    nutrition: nutrition(560, 24, 68, 16),
  },
  {
    id: "p7",
    name: "Paneer Tikka Feast Combo",
    category: "combos",
    image: paneerCombo,
    gallery: [paneerCombo, footlong, salad, lemonBasilIcedTea],
    price: 429,
    mrp: 549,
    rating: 4.9,
    reviews: 189,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "100% Healthy Veg Feast: Seasoned Paneer Tikka Footlong, Berry Yogurt Bowl, and ice-cold Lemon Basil Iced Tea.",
    ingredients: ["Paneer Tikka Footlong", "Berry Yogurt Bowl", "Lemon Basil Iced Tea"],
    nutrition: nutrition(740, 36, 88, 20),
  },
  {
    id: "p8",
    name: "Classic Veg Club & Salad Combo",
    category: "combos",
    image: clubCombo,
    gallery: [clubCombo, cucumberHummus, salad, peachIcedTea],
    price: 319,
    mrp: 399,
    rating: 4.7,
    reviews: 156,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Triple-layered Fresh Cucumber Hummus & Greens Club served with Mediterranean Feta Salad and Peach Mint Iced Tea.",
    ingredients: ["Fresh Cucumber Hummus Club", "Mediterranean Salad", "Peach Mint Iced Tea"],
    nutrition: nutrition(550, 20, 65, 12),
  },
  {
    id: "p9",
    name: "Healthy Garden Fit Combo",
    category: "combos",
    image: healthyGardenFitCombo,
    gallery: [healthyGardenFitCombo, salad, lemonBasilIcedTea],
    price: 299,
    mrp: 379,
    rating: 4.6,
    reviews: 112,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Light & Clean: Avocado Garden Salad, Berry Yogurt Bowl, and freshly brewed Lemon Basil Iced Tea.",
    ingredients: ["Avocado Garden Salad", "Berry Yogurt Bowl", "Lemon Basil Iced Tea"],
    nutrition: nutrition(510, 19, 58, 14),
  },
  {
    id: "p10",
    name: "Fresh Cucumber Hummus & Greens Club",
    category: "sandwiches",
    image: cucumberHummus,
    gallery: [cucumberHummus, rawAvocadoSprout, spinachCottageCheese],
    price: 219,
    mrp: 279,
    rating: 4.6,
    reviews: 173,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Triple-layered soft artisan health club packed with sliced English cucumber, vine tomatoes, microgreens, and house chickpea hummus. 100% Plant-based & fresh (non-grilled).",
    ingredients: ["Soft Whole-Wheat Bread", "Fresh Cucumber", "Vine Tomatoes", "Microgreens", "Chickpea Hummus"],
    nutrition: nutrition(260, 11, 36, 7),
  },
  {
    id: "p11",
    name: "Lemon Basil Iced Tea",
    category: "iced-tea",
    image: lemonBasilIcedTea,
    gallery: [lemonBasilIcedTea, footlong, salad],
    price: 119,
    mrp: 159,
    rating: 4.7,
    reviews: 142,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Green tea shaken with fresh lemon wheels, sweet basil leaves and a hint of wildflower honey.",
    ingredients: ["Green tea", "Fresh lemon", "Sweet basil", "Honey"],
    nutrition: nutrition(90, 0, 21, 0),
  },
  {
    id: "p12",
    name: "Mediterranean Salad",
    category: "salads",
    image: salad,
    gallery: [salad, rawAvocadoSprout, peachIcedTea],
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
  {
    id: "p13",
    name: "Wild Berry Hibiscus Iced Tea",
    category: "iced-tea",
    image: berryHibiscusIcedTea,
    gallery: [berryHibiscusIcedTea, salad, peachIcedTea],
    price: 139,
    mrp: 179,
    rating: 4.8,
    reviews: 94,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Vibrant ruby-red brewed hibiscus tea infused with fresh raspberries, blueberries, and clear ice.",
    ingredients: ["Hibiscus tea", "Raspberries", "Blueberries", "Agave nectar", "Lemon"],
    nutrition: nutrition(105, 0, 25, 0),
  },
  {
    id: "p14",
    name: "Passion Fruit Mango Iced Tea",
    category: "iced-tea",
    image: passionFruitIcedTea,
    gallery: [passionFruitIcedTea, peachIcedTea, salad],
    price: 149,
    mrp: 189,
    rating: 4.9,
    reviews: 167,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Exotic tropical iced black tea shaken with real passion fruit pulp, ripe mango nectar, and mint.",
    ingredients: ["Black tea", "Passion fruit pulp", "Mango nectar", "Mint", "Ice"],
    nutrition: nutrition(125, 0, 31, 0),
  },
  {
    id: "p15",
    name: "Spiced Mint Matcha Iced Tea",
    category: "iced-tea",
    image: matchaMintIcedTea,
    gallery: [matchaMintIcedTea, lemonBasilIcedTea, salad],
    price: 159,
    mrp: 199,
    rating: 4.6,
    reviews: 78,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "Grade-A Japanese green matcha tea shaken with lime juice, crushed fresh mint leaves, and agave.",
    ingredients: ["Matcha green tea", "Lime juice", "Crushed mint", "Agave syrup"],
    nutrition: nutrition(95, 1, 22, 0),
  },
  {
    id: "p16",
    name: "Organic Spinach & Sweet Corn Cottage Cheese Sandwich",
    category: "sandwiches",
    image: spinachCottageCheese,
    gallery: [spinachCottageCheese, rawAvocadoSprout, cucumberHummus],
    price: 199,
    mrp: 249,
    rating: 4.7,
    reviews: 128,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Fresh organic baby spinach, sweet corn, crumbled fresh paneer (cottage cheese), and lemon herb dressing on soft whole-grain bread. Fresh & un-toasted (no cheese, non-grilled).",
    ingredients: ["Whole-grain Bread", "Organic Baby Spinach", "Sweet Corn", "Fresh Cottage Cheese (Paneer)", "Lemon Herb Dressing"],
    nutrition: nutrition(270, 16, 35, 8),
  },
  {
    id: "p17",
    name: "Artisan Avocado Tomato & Herb Pesto Sandwich",
    category: "sandwiches",
    image: avocadoPestoFresh,
    gallery: [avocadoPestoFresh, spinachCottageCheese, rawAvocadoSprout],
    price: 259,
    mrp: 319,
    rating: 4.8,
    reviews: 164,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Sliced fresh avocado, juicy vine-ripened tomatoes, dairy-free basil pesto, and toasted pumpkin seeds on soft seeded bread. Pure healthy whole foods (non-grilled).",
    ingredients: ["Seeded Whole-wheat Bread", "Fresh Avocado", "Vine Tomatoes", "Dairy-free Basil Pesto", "Pumpkin Seeds"],
    nutrition: nutrition(310, 11, 32, 13),
  },
  {
    id: "p18",
    name: "Bombay Fresh Beetroot & Mint Chutney Sandwich",
    category: "sandwiches",
    image: bombayFreshBeetroot,
    gallery: [bombayFreshBeetroot, cucumberHummus, rawAvocadoSprout],
    price: 179,
    mrp: 229,
    rating: 4.9,
    reviews: 215,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "Layered fresh beetroot slices, cucumber, sweet potato, fresh mint-coriander chutney, and sprouted seeds on soft whole-wheat bread. Clean & refreshing (non-grilled, no cheese).",
    ingredients: ["Soft Whole-wheat Bread", "Fresh Beetroot", "Cucumber", "Sweet Potato", "Mint Coriander Chutney", "Sprouted Seeds"],
    nutrition: nutrition(230, 9, 41, 3),
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const byCategory = (slug: string) => products.filter((p) => p.category === slug);
