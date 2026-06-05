// PATH: src/api/cart.api.js
import api from "./Axios"; // আপনার তৈরি করা Axios ইনস্ট্যান্স

// ১. ডাটাবেজ থেকে কার্টের আইটেমগুলো নিয়ে আসা
export const getCartItems = async () => {
  const res = await api.get("/users/cart"); // আপনার ব্যাকএন্ডের গেট কার্ট রাউট
  return res.data;
};

// ২. কার্টে প্রোডাক্ট যোগ করা বা সংখ্যা বাড়ানো
export const addToCartApi = async ({ productId, quantity = 1 }) => {
  const res = await api.post("/users/cart/add", { productId, quantity });
  return res.data;
};

// ৩. কার্ট থেকে প্রোডাক্ট রিমুভ করা বা সংখ্যা কমানো
export const removeFromCartApi = async ({ productId }) => {
  const res = await api.post("/users/cart/remove", { productId });
  return res.data;
};
