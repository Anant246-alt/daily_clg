/** Dummy reviews — replace with GET /api/reviews later. */
export type Review = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  date: string;
  text: string;
  productId?: string;
};

export const reviews: Review[] = [
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
