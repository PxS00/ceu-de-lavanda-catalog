import { test } from "node:test";
import assert from "node:assert/strict";
import { randomSelection } from "../src/features/home/lib/random-selection.ts";

test("random selection returns up to four different items without mutating the catalog", () => {
  const items = ["a", "b", "c", "d", "e", "f"];
  const before = [...items];
  const first = randomSelection(items, 4, () => 0);
  const second = randomSelection(items, 4, () => 0.999);
  assert.equal(first.length, 4);
  assert.equal(new Set(first).size, 4);
  assert.notDeepEqual(first, second);
  assert.deepEqual(items, before);
  assert.deepEqual(randomSelection([], 4), []);
  assert.equal(randomSelection(["a"], 4).length, 1);
  assert.deepEqual(randomSelection(items, 0), []);
});
