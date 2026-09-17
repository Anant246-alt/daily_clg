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

import americanGreensDiet from "@/assets/american_greens_diet.jpg";
import spicyInfernoDiet from "@/assets/spicy_inferno_diet.jpg";
import creamyVegDelight from "@/assets/creamy_veg_delight.jpg";
import avocadoCrunchDiet from "@/assets/avocado_crunch_diet.jpg";

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
    gallery: [salad, americanGreensDiet, peachIcedTea],
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
    name: "American Greens Classic Sandwich (4 Pcs)",
    category: "sandwiches",
    image: americanGreensDiet,
    gallery: [americanGreensDiet, spicyInfernoDiet, creamyVegDelight],
    price: 119,
    mrp: 159,
    rating: 4.8,
    reviews: 312,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "4 Pcs fresh authentic diet sandwich with crisp American farm greens, vine-ripened tomatoes, English cucumbers, and olive oil on un-toasted multigrain bread.",
    ingredients: ["Multigrain Bread (4 Pcs)", "American Farm Greens", "Vine Tomatoes", "English Cucumber", "Olive Oil"],
    nutrition: nutrition(210, 10, 32, 5),
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
    gallery: [footlong, americanGreensDiet, salad],
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
    gallery: [salad, peachIcedTea, americanGreensDiet],
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
    gallery: [veggieSupremeCombo, americanGreensDiet, salad, peachIcedTea],
    price: 349,
    mrp: 449,
    rating: 4.8,
    reviews: 241,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "100% Healthy Veg Meal: American Greens Classic Sandwich, crisp Avocado Garden Salad, and refreshing Peach Mint Iced Tea.",
    ingredients: ["American Greens Diet Sandwich", "Avocado Garden Salad", "Peach Mint Iced Tea"],
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
    gallery: [clubCombo, spicyInfernoDiet, salad, peachIcedTea],
    price: 319,
    mrp: 399,
    rating: 4.7,
    reviews: 156,
    veg: true,
    bestSeller: false,
    popular: true,
    description:
      "The Spicy Inferno Diet Sandwich served with Mediterranean Feta Salad and Peach Mint Iced Tea.",
    ingredients: ["Spicy Inferno Diet Sandwich", "Mediterranean Salad", "Peach Mint Iced Tea"],
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
    name: "The Spicy Inferno Diet Sandwich (4 Pcs)",
    category: "sandwiches",
    image: spicyInfernoDiet,
    gallery: [spicyInfernoDiet, americanGreensDiet, avocadoCrunchDiet],
    price: 119,
    mrp: 159,
    rating: 4.7,
    reviews: 245,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "4 Pcs authentic zesty diet sandwich with purple cabbage, crisp bell peppers, jalapeños, and green herbs on un-toasted seeded bread. Non-grilled & healthy.",
    ingredients: ["Seeded Multigrain Bread (4 Pcs)", "Purple Cabbage", "Bell Peppers", "Jalapeño", "Green Herbs"],
    nutrition: nutrition(215, 11, 33, 5),
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
    gallery: [salad, americanGreensDiet, peachIcedTea],
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
    name: "Creamy Veg Delight Sandwich (4 Pcs)",
    category: "sandwiches",
    image: creamyVegDelight,
    gallery: [creamyVegDelight, americanGreensDiet, spicyInfernoDiet],
    price: 119,
    mrp: 159,
    rating: 4.8,
    reviews: 198,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "4 Pcs fresh diet sandwich loaded with sweet corn, finely diced carrots, bell peppers, and hung curd yogurt spread on soft whole-grain bread. Non-grilled & healthy.",
    ingredients: ["Whole-grain Bread (4 Pcs)", "Sweet Corn", "Diced Carrots", "Bell Peppers", "Hung Curd Spread"],
    nutrition: nutrition(225, 12, 34, 6),
  },
  {
    id: "p17",
    name: "Avocado Crunch Sandwich (4 Pcs)",
    category: "sandwiches",
    image: avocadoCrunchDiet,
    gallery: [avocadoCrunchDiet, creamyVegDelight, americanGreensDiet],
    price: 149,
    mrp: 189,
    rating: 4.9,
    reviews: 284,
    veg: true,
    bestSeller: true,
    popular: true,
    description:
      "4 Pcs premium healthy diet sandwich featuring fresh sliced avocado, English cucumber, toasted flax & pumpkin seeds on artisan seeded bread.",
    ingredients: ["Seeded Artisan Bread (4 Pcs)", "Fresh Avocado", "English Cucumber", "Flax & Pumpkin Seeds", "Microgreens"],
    nutrition: nutrition(260, 11, 30, 11),
  },
];

export const getProduct = (id: string) => products.find((p) => p.id === id);
export const byCategory = (slug: string) => products.filter((p) => p.category === slug);
