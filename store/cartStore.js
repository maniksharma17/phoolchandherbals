import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart } from '@/utils/api';


export const useCartStore = create(
  persist(
    (set) => ({
      cart: null,
      isLoading: false,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const res = await getCart();
          set({ cart: res });
        } catch (err) {
          console.error(err);
        } finally {
          set({ isLoading: false });
        }
      },

      setCart: (cart) => set({ cart }),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);
