// PATH: src/hooks/cart.query.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartItems, addToCartApi, removeFromCartApi } from "@/api/cart.api";
import { useCartStore } from "@/store/useCartStore"; // আপনার Zustand Store
import { AuthToast } from "@/components/common/AuthToast";

// হুক ১: কার্ট ডেটা গেট করার জন্য
export const useGetCart = (isLoggedIn) => {
  const setCart = useCartStore((state) => state.setCart); // Zustand-এ ডেটা পুশ করার জন্য

  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartItems,
    enabled: !!isLoggedIn, // ইউজার লগইন থাকলেই কেবল ডাটাবেজ থেকে কার্ট আনবে
    staleTime: 10 * 60 * 1000,
    onSuccess: (data) => {
      // ব্যাকএন্ড থেকে আসা কার্ট লিস্ট দিয়ে Zustand স্টোর আপডেট করুন
      if (data?.cartProducts) {
        setCart(data.cartProducts);
      }
    },
  });
};

// হুক ২: কার্টে প্রোডাক্ট যোগ করার জন্য (Mutation)
export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartApi,
    onSuccess: (response) => {
      // 'cart' কি-র আন্ডারে থাকা সব কুয়েরি ইনভ্যালিড করে ডাটাবেজের সাথে সিঙ্ক করবে
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      AuthToast.error(error?.response?.data?.message || "Could not add to cart");
    },
  });
};

// হুক ৩: কার্ট থেকে প্রোডাক্ট রিমুভ করার জন্য (Mutation)
export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      AuthToast.error(error?.response?.data?.message || "Could not update cart");
    },
  });
};
