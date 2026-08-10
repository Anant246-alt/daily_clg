/** Dummy orders — replace with GET /api/orders later. */
export type OrderStatus = "Preparing" | "On the way" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  paymentMethod: string;
  address: string;
  items: { id: string; name: string; qty: number; price: number }[];
  timeline: { label: string; time: string; done: boolean }[];
};

export const orders: Order[] = [
  {
    id: "o1001",
    number: "#DLY-1001",
    date: "31 Jul 2026, 12:40 PM",
    status: "Preparing",
    total: 678,
    paymentMethod: "UPI · yourname@upi",
    address: "Flat 402, Green Meadows, Koramangala, Bengaluru 560034",
    items: [
      { id: "p4", name: "Paneer Tikka Footlong", qty: 1, price: 349 },
      { id: "p3", name: "Peach Mint Iced Tea", qty: 2, price: 129 },
    ],
    timeline: [
      { label: "Order placed", time: "12:40 PM", done: true },
      { label: "Restaurant confirmed", time: "12:42 PM", done: true },
      { label: "Preparing your food", time: "12:47 PM", done: true },
      { label: "Out for delivery", time: "—", done: false },
      { label: "Delivered", time: "—", done: false },
    ],
  },
  {
    id: "o1000",
    number: "#DLY-1000",
    date: "28 Jul 2026, 8:05 PM",
    status: "Delivered",
    total: 538,
    paymentMethod: "Card · **** 4291",
    address: "Flat 402, Green Meadows, Koramangala, Bengaluru 560034",
    items: [
      { id: "p2", name: "Grilled Paneer & Herb Sandwich", qty: 1, price: 289 },
      { id: "p1", name: "Avocado Garden Salad", qty: 1, price: 249 },
    ],
    timeline: [
      { label: "Order placed", time: "8:05 PM", done: true },
      { label: "Restaurant confirmed", time: "8:07 PM", done: true },
      { label: "Preparing your food", time: "8:12 PM", done: true },
      { label: "Out for delivery", time: "8:26 PM", done: true },
      { label: "Delivered", time: "8:41 PM", done: true },
    ],
  },
  {
    id: "o999",
    number: "#DLY-0999",
    date: "21 Jul 2026, 1:15 PM",
    status: "Cancelled",
    total: 249,
    paymentMethod: "Cash on delivery",
    address: "Office 12, WeWork Galaxy, Residency Road, Bengaluru 560025",
    items: [{ id: "p1", name: "Avocado Garden Salad", qty: 1, price: 249 }],
    timeline: [
      { label: "Order placed", time: "1:15 PM", done: true },
      { label: "Cancelled by you", time: "1:18 PM", done: true },
    ],
  },
];
