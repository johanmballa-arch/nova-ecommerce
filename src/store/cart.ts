import { create } from "zustand";

export type CartItem = {
  id: string;
  qty: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (id: string, qty?: number) => void;
  updateQty: (id: string, qty: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
  items: [],

  addToCart: (id, qty = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + qty } : i
          ),
        };
      }
      return { items: [...state.items, { id, qty }] };
    }),

  updateQty: (id, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ items: [] }),
}));