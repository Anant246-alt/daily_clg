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

export const reviews: Review[] = [];
