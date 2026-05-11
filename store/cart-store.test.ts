import { test, describe } from "node:test";
import assert from "node:assert";
import {
  selectCartCount,
  selectCartSubtotal,
  selectCartSavings,
} from "./cart-store.ts";

describe("Cart Selectors", () => {
  test("selectCartCount - calculates total items correctly", () => {
    // Empty cart
    assert.strictEqual(selectCartCount({ items: [] } as any), 0);

    // Single item
    assert.strictEqual(
      selectCartCount({
        items: [{ quantity: 1 }],
      } as any),
      1,
    );

    // Multiple items
    assert.strictEqual(
      selectCartCount({
        items: [{ quantity: 2 }, { quantity: 3 }],
      } as any),
      5,
    );
  });

  test("selectCartSubtotal - calculates total price correctly", () => {
    // Empty cart
    assert.strictEqual(selectCartSubtotal({ items: [] } as any), 0);

    // Single item
    assert.strictEqual(
      selectCartSubtotal({
        items: [{ price: 10, quantity: 2 }],
      } as any),
      20,
    );

    // Multiple items
    assert.strictEqual(
      selectCartSubtotal({
        items: [
          { price: 10, quantity: 2 },
          { price: 25, quantity: 1 },
        ],
      } as any),
      45,
    );
  });

  test("selectCartSavings - calculates total savings correctly", () => {
    // Empty cart
    assert.strictEqual(selectCartSavings({ items: [] } as any), 0);

    // Single item with savings
    assert.strictEqual(
      selectCartSavings({
        items: [{ originalPrice: 15, price: 10, quantity: 2 }],
      } as any),
      10, // (15 - 10) * 2 = 10
    );

    // Single item with no savings
    assert.strictEqual(
      selectCartSavings({
        items: [{ originalPrice: 20, price: 20, quantity: 1 }],
      } as any),
      0,
    );

    // Multiple items with varying savings
    assert.strictEqual(
      selectCartSavings({
        items: [
          { originalPrice: 15, price: 10, quantity: 2 }, // 10 savings
          { originalPrice: 20, price: 20, quantity: 1 }, // 0 savings
          { originalPrice: 50, price: 40, quantity: 3 }, // 30 savings
        ],
      } as any),
      40,
    );
  });
});
