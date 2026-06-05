// PATH: src/store/useCartStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useCartStore = create(
  devtools(
    (set, get) => ({
      cart: {},

      // ADD TO CART (Accepts the full product object now)
      addToCart: (product) => {
        const { productId, stock } = product;
        const currentItem = get().cart[productId];
        const currentQty = currentItem ? currentItem.quantity : 0;

        // Prevent exceeding stock
        if (currentQty >= stock) return;

        set((state) => ({
          cart: {
            ...state.cart,
            [productId]: {
              ...product,
              quantity: currentQty + 1,
            },
          },
        }));
      },

      // DECREASE QUANTITY
      decreaseQuantity: (productId) => {
        const currentItem = get().cart[productId];
        if (!currentItem) return;

        // REMOVE ITEM WHEN QUANTITY DROPS BELOW 1
        if (currentItem.quantity <= 1) {
          const updatedCart = { ...get().cart };
          delete updatedCart[productId];
          set({ cart: updatedCart });
          return;
        }

        set((state) => ({
          cart: {
            ...state.cart,
            [productId]: {
              ...currentItem,
              quantity: currentItem.quantity - 1,
            },
          },
        }));
      },

      // REMOVE PRODUCT COMPLETELY
      removeFromCart: (productId) => {
        const updatedCart = { ...get().cart };
        delete updatedCart[productId];
        set({ cart: updatedCart });
      },

      // CLEAR CART
      clearCart: () => set({ cart: {} }),
    }),
    { name: "cartStore" },
  ),
);
