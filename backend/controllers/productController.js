import { Product } from "../models/Product.js";

// 100% Pure Vegetarian fallback items
const fallbackProducts = [
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
    description: "Crisp farm greens tossed with ripe avocado, cherry tomatoes, olives and a house lemon vinaigrette.",
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
    name: "Grilled Paneer & Herb Sandwich",
    category: "sandwiches",
    image: "/assets/sandwich.jpg",
    gallery: ["/assets/sandwich.jpg", "/assets/footlong.jpg", "/assets/salad.jpg"],
    price: 289,
    mrp: 349,
    rating: 4.7,
    reviews: 431,
    veg: true,
    bestSeller: true,
    popular: true,
    description: "Herbed paneer slabs, roasted bell peppers and fresh basil layered in toasted sourdough with garlic aioli.",
    ingredients: ["Paneer", "Sourdough", "Bell peppers", "Basil", "Garlic aioli"],
    nutrition: [
      { label: "Calories", value: "440 kcal" },
      { label: "Protein", value: "24 g" },
      { label: "Carbs", value: "41 g" },
      { label: "Fat", value: "19 g" },
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
    description: "Cold brewed black tea infused with sun ripened peach and fresh mint.",
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
    description: "A full footlong loaded with charred paneer tikka, crunchy lettuce, tomatoes and mint mayo in a soft baked baguette.",
    ingredients: ["Paneer tikka", "Baguette", "Lettuce", "Tomato", "Mint mayo"],
    nutrition: [
      { label: "Calories", value: "620 kcal" },
      { label: "Protein", value: "28 g" },
      { label: "Carbs", value: "68 g" },
      { label: "Fat", value: "24 g" },
    ],
  },
];

export const getProducts = async (req, res, next) => {
  try {
    let products = [];
    try {
      products = await Product.find().select("-__v");
    } catch (err) {
      console.warn("[Products] DB fetch failed, using fallback list.");
    }
    if (!products || products.length === 0) {
      products = fallbackProducts;
    }
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;
    try {
      product = await Product.findOne({ id }).select("-__v");
    } catch (err) {
      console.warn(`[Product] DB fetch for ${id} failed.`);
    }
    if (!product) {
      product = fallbackProducts.find((p) => p.id === id) || null;
    }
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let products = [];
    try {
      products = await Product.find({ category: slug }).select("-__v");
    } catch (err) {
      console.warn(`[Products] DB category fetch for ${slug} failed.`);
    }
    if (!products || products.length === 0) {
      products = fallbackProducts.filter((p) => p.category === slug);
    }
    return res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
