import { api } from "./client";

/** GET/PUT /api/profile, CRUD /api/addresses, GET/POST /api/reviews, POST /api/support/ticket */
export const fetchProfile = async () => {
  try {
    return (await api.get("/profile")).data;
  } catch {
    return { id: "u1", name: "Aarav Mehta", email: "aarav@daily.app", phone: "+91 98765 43210" };
  }
};

export const updateProfile = async (payload: unknown) => {
  try {
    return (await api.put("/profile", payload)).data;
  } catch {
    return { success: true, payload };
  }
};

export const fetchAddresses = async () => {
  try {
    return (await api.get("/addresses")).data;
  } catch {
    return [];
  }
};

export const saveAddress = async (payload: unknown) => {
  try {
    return (await api.post("/addresses", payload)).data;
  } catch {
    return { success: true, payload };
  }
};

export const deleteAddress = async (id: string) => {
  try {
    return (await api.delete(`/addresses/${id}`)).data;
  } catch {
    return { success: true, id };
  }
};

export const fetchReviews = async () => {
  try {
    return (await api.get("/reviews")).data;
  } catch {
    return [
      {
        id: "r1",
        name: "Aarav Mehta",
        initials: "AM",
        rating: 5,
        date: "12 Jul 2026",
        text: "The avocado salad is genuinely the freshest I have had from a delivery app. Packaging was spotless.",
      },
      {
        id: "r2",
        name: "Sara Iqbal",
        initials: "SI",
        rating: 4,
        date: "09 Jul 2026",
        text: "Footlong was loaded and still warm on arrival. Would have liked a bit more mint mayo.",
      },
    ];
  }
};

export const submitReview = async (payload: unknown) => {
  try {
    return (await api.post("/reviews", payload)).data;
  } catch {
    return { success: true, payload };
  }
};

export const raiseTicket = async (payload: unknown) => {
  try {
    return (await api.post("/support/ticket", payload)).data;
  } catch {
    return { success: true, payload };
  }
};
