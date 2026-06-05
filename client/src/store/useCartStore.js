// PATH: src/store/useCartStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useCartStore = create(
  devtools(
    (set, get) => ({
      // কার্টের ইনিশিয়াল স্টেট (অবজেক্ট হিসেবে থাকছে ওয়ান-ক্লিক ও ওয়ান-লুকআপ ওয়ান-টাইম ওয়ান অপটিমাইজেশনের জন্য)
      cart: {},

      /**
       * ১. SET CART (ডাটাবেজ থেকে ডেটা সিঙ্ক করার জন্য)
       * TanStack Query-এর onSuccess বা রেন্ডার ব্লকে এটি কল হবে।
       * ব্যাকএন্ডের অ্যারে ডেটাকে ফ্রন্টএন্ডের জন্য প্রোডাক্ট আইডি-ভিত্তিক অবজেক্টে রূপান্তর করে।
       */
      setCart: (cartItems) => {
        if (!cartItems || !Array.isArray(cartItems)) {
          set({ cart: {} });
          return;
        }

        const cartObj = {};
        cartItems.forEach((item) => {
          // আপনার ব্যাকএন্ডে পপুলেট করা productId অবজেক্ট বা শুধু আইডি দুটির জন্যই সেফটি চেক
          const id = item.productId?._id || item.productId;

          if (id) {
            cartObj[id] = {
              productId: id,
              quantity: item.quantity,
              price: item.priceAtAdd,
              // যদি প্রোডাক্টের অন্য কোনো ডিটেইলস পপুলেট করা থাকে, তা এখানে চলে আসবে
              title: item.productId?.title || "",
              image: item.productId?.image || "",
              slug: item.productId?.slug || "",
              stock: item.productId?.stock || 0,
            };
          }
        });

        set({ cart: cartObj });
      },

      /**
       * ২. CLEAR CART
       * ইউজার লগআউট করলে বা অর্ডার কমপ্লিট হয়ে গেলে কার্ট ফাঁকা করার জন্য
       */
      clearCart: () => set({ cart: {} }),
    }),
    { name: "cartStore" },
  ),
);
