import { test } from "node:test";
import assert from "node:assert";
import { apiClient, ApiError } from "./client.ts";

test("apiClient - success", async (t) => {
  const mockData = { id: 1, name: "Test" };
  const mockResponse = new Response(JSON.stringify(mockData), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

  const fetchMock = t.mock.method(global, "fetch", () =>
    Promise.resolve(mockResponse),
  );

  const result = await apiClient("/test");

  assert.deepStrictEqual(result, mockData);
  assert.strictEqual(fetchMock.mock.callCount(), 1);
  assert.strictEqual(fetchMock.mock.calls[0].arguments[0], "/test");
});

test("apiClient - error with payload message", async (t) => {
  const errorMessage = "Invalid request";
  const mockResponse = new Response(JSON.stringify({ message: errorMessage }), {
    status: 400,
    statusText: "Bad Request",
    headers: { "Content-Type": "application/json" },
  });

  const fetchMock = t.mock.method(global, "fetch", () =>
    Promise.resolve(mockResponse),
  );

  try {
    await apiClient("/error");
    assert.fail("Should have thrown ApiError");
  } catch (error) {
    assert.ok(error instanceof ApiError);
    assert.strictEqual((error as ApiError).message, errorMessage);
    assert.strictEqual((error as ApiError).status, 400);
  }
});

test("apiClient - error with invalid JSON", async (t) => {
  const mockResponse = new Response("Invalid JSON", {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });

  const fetchMock = t.mock.method(global, "fetch", () =>
    Promise.resolve(mockResponse),
  );

  try {
    await apiClient("/invalid-json");
    assert.fail("Should have thrown ApiError");
  } catch (error) {
    assert.ok(error instanceof ApiError);
    assert.strictEqual((error as ApiError).message, "Something went wrong while loading data.");
    assert.strictEqual((error as ApiError).status, 500);
  }
});

test("apiClient - error with empty payload", async (t) => {
  const mockResponse = new Response(JSON.stringify({}), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });

  const fetchMock = t.mock.method(global, "fetch", () =>
    Promise.resolve(mockResponse),
  );

  try {
    await apiClient("/not-found");
    assert.fail("Should have thrown ApiError");
  } catch (error) {
    assert.ok(error instanceof ApiError);
    assert.strictEqual((error as ApiError).message, "Something went wrong while loading data.");
    assert.strictEqual((error as ApiError).status, 404);
  }
});
