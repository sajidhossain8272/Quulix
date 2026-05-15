"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product } from "@/lib/types";

export type CartItem = Pick<
  Product,
  | "id"
  | "slug"
  | "title"
  | "image"
  | "price"
  | "originalPrice"
  | "category"
  | "categoryName"
> & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  hasHydrated: boolean;
  addItem: (product: Product, options?: { openCart?: boolean }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setHasHydrated: (value: boolean) => void;
};

type PersistedCartState = {
  items?: Array<Partial<CartItem>>;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,
      addItem: (product, options) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);

          if (existing) {
            return {
              isOpen: options?.openCart ?? state.isOpen,
              items: state.items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                slug: product.slug,
                title: product.title,
                image: product.image,
                price: product.price,
                originalPrice: product.originalPrice,
                category: product.category,
                categoryName: product.categoryName,
                quantity: 1,
              },
            ],
            isOpen: options?.openCart ?? state.isOpen,
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.id !== productId)
              : state.items.map((item) =>
                  item.id === productId ? { ...item, quantity } : item,
                ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "qullix-cart",
      version: 2,
      partialize: (state) => ({
        items: state.items,
      }),
      migrate: (persistedState) => {
        const state = persistedState as PersistedCartState;

        return {
          items: (state.items ?? []).map((item) => ({
            id: item.id ?? "",
            slug: item.slug ?? "",
            title: item.title ?? "Untitled product",
            image: item.image ?? "",
            price: item.price ?? 0,
            originalPrice: item.originalPrice ?? item.price ?? 0,
            category: item.category ?? "all",
            categoryName: item.categoryName ?? item.category ?? "Catalog",
            quantity: item.quantity ?? 1,
          })),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: CartState) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const selectCartSavings = (state: CartState) =>
  state.items.reduce(
    (total, item) => total + (item.originalPrice - item.price) * item.quantity,
    0,
  );
