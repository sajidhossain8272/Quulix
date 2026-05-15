import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import {
  useCartStore,
  selectCartCount,
  selectCartSubtotal,
  selectCartSavings,
} from "./cart-store.ts";
import type { Product } from "@/lib/types";

const mockProduct: Product = {
  id: "1",
  slug: "test-product-1",
  title: "Test Product 1",
  image: "test1.jpg",
  price: 100,
  originalPrice: 150,
  category: "test",
  categoryName: "Test Category",
  rating: 4.5,
  reviewCount: 10,
  description: "Test description",
  discountPercentage: 0,
  tags: [],
  inventory: 100,
  featuredCollections: [],
  createdAt: "2023-01-01T00:00:00.000Z",
};

const mockProduct2: Product = {
  id: "2",
  slug: "test-product-2",
  title: "Test Product 2",
  image: "test2.jpg",
  price: 200,
  originalPrice: 200,
  category: "test",
  categoryName: "Test Category",
  rating: 4.0,
  reviewCount: 5,
  description: "Test description 2",
  discountPercentage: 0,
  tags: [],
  inventory: 100,
  featuredCollections: [],
  createdAt: "2023-01-01T00:00:00.000Z",
};

describe("cart-store", () => {
  beforeEach(() => {
    // Reset the store state before each test
    useCartStore.setState({
      items: [],
      isOpen: false,
      hasHydrated: false,
    });
  });

  describe("addItem", () => {
    it("should add a new item to the cart", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct);

      const state = useCartStore.getState();
      assert.strictEqual(state.items.length, 1);
      assert.strictEqual(state.items[0].id, mockProduct.id);
      assert.strictEqual(state.items[0].quantity, 1);
      // Cart should remain closed if no option is passed
      assert.strictEqual(state.isOpen, false);
    });

    it("should increase quantity if item already exists", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct);

      const state1 = useCartStore.getState();
      state1.addItem(mockProduct);

      const state2 = useCartStore.getState();
      assert.strictEqual(state2.items.length, 1);
      assert.strictEqual(state2.items[0].quantity, 2);
    });

    it("should open the cart if openCart option is true", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct, { openCart: true });

      const state = useCartStore.getState();
      assert.strictEqual(state.isOpen, true);
    });
  });

  describe("removeItem", () => {
    it("should remove an item from the cart", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct);
      store.addItem(mockProduct2);

      const state1 = useCartStore.getState();
      state1.removeItem(mockProduct.id);

      const state2 = useCartStore.getState();
      assert.strictEqual(state2.items.length, 1);
      assert.strictEqual(state2.items[0].id, mockProduct2.id);
    });
  });

  describe("updateQuantity", () => {
    it("should update the quantity of an item", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct);

      const state1 = useCartStore.getState();
      state1.updateQuantity(mockProduct.id, 5);

      const state2 = useCartStore.getState();
      assert.strictEqual(state2.items[0].quantity, 5);
    });

    it("should remove the item if quantity is set to 0 or less", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct);

      const state1 = useCartStore.getState();
      state1.updateQuantity(mockProduct.id, 0);

      const state2 = useCartStore.getState();
      assert.strictEqual(state2.items.length, 0);
    });
  });

  describe("clearCart", () => {
    it("should remove all items from the cart", () => {
      const store = useCartStore.getState();
      store.addItem(mockProduct);
      store.addItem(mockProduct2);

      const state1 = useCartStore.getState();
      state1.clearCart();

      const state2 = useCartStore.getState();
      assert.strictEqual(state2.items.length, 0);
    });
  });

  describe("cart UI toggles", () => {
    it("should open, close, and toggle the cart", () => {
      let state = useCartStore.getState();
      assert.strictEqual(state.isOpen, false);

      state.openCart();
      state = useCartStore.getState();
      assert.strictEqual(state.isOpen, true);

      state.closeCart();
      state = useCartStore.getState();
      assert.strictEqual(state.isOpen, false);

      state.toggleCart();
      state = useCartStore.getState();
      assert.strictEqual(state.isOpen, true);

      state.toggleCart();
      state = useCartStore.getState();
      assert.strictEqual(state.isOpen, false);
    });
  });

  describe("setHasHydrated", () => {
    it("should set the hydration state", () => {
      const state = useCartStore.getState();
      assert.strictEqual(state.hasHydrated, false);

      state.setHasHydrated(true);
      const state2 = useCartStore.getState();
      assert.strictEqual(state2.hasHydrated, true);
    });
  });

  describe("selectors", () => {
    beforeEach(() => {
      const store = useCartStore.getState();
      store.addItem(mockProduct); // price 100, original 150

      const state1 = useCartStore.getState();
      state1.addItem(mockProduct); // now quantity 2

      const state2 = useCartStore.getState();
      state2.addItem(mockProduct2); // price 200, original 200, quantity 1
    });

    it("selectCartCount should return total item count", () => {
      const state = useCartStore.getState();
      assert.strictEqual(selectCartCount(state), 3);
    });

    it("selectCartSubtotal should return total price", () => {
      const state = useCartStore.getState();
      // 2 * 100 + 1 * 200 = 400
      assert.strictEqual(selectCartSubtotal(state), 400);
    });

    it("selectCartSavings should return total savings", () => {
      const state = useCartStore.getState();
      // (150 - 100) * 2 + (200 - 200) * 1 = 100
      assert.strictEqual(selectCartSavings(state), 100);
    });
  });
});
