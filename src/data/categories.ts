/** Category data */
export type Category = {
  id: string;
  name: string;
  slug: string;
  emoji: string;
  items: number;
};

export const categories: Category[] = [
  { id: "c1", name: "Salads", slug: "salads", emoji: "🥗", items: 18 },
  { id: "c2", name: "Sandwiches", slug: "sandwiches", emoji: "🥪", items: 24 },
  { id: "c3", name: "Iced Tea", slug: "iced-tea", emoji: "🧋", items: 12 },
  { id: "c4", name: "Footlong", slug: "footlong", emoji: "🌭", items: 9 },
  { id: "c5", name: "Yogurt Bowl", slug: "yogurt-bowl", emoji: "🍨", items: 11 },
  { id: "c6", name: "Combos", slug: "combos", emoji: "🍱", items: 15 },
];
