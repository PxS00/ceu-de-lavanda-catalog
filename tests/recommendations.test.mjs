import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendProducts } from "../src/features/catalog/lib/recommendations.ts";

const item = (id, family) => ({ id, slug: id, name: id, family });
test("related perfumes prioritize equivalent families and fill remaining slots without mutation", () => {
  const current = item("current", "Chipre Frutada");
  const related = item("related", "Chypre Frutal");
  const others = Array.from({ length: 8 }, (_, i) => item(`other-${i}`, "Oriental"));
  const catalog = [current, ...others, related, related];
  const before = structuredClone(catalog);
  const result = recommendProducts(current, catalog, () => 0.4);
  assert.equal(result.length, 6);
  assert.equal(result[0].id, "related");
  assert.equal(new Set(result.map(p => p.id)).size, 6);
  assert.ok(result.every(p => p.id !== current.id));
  assert.deepEqual(catalog, before);
});
test("fallback is shuffled and missing families do not count as a match", () => {
  const current = item("current", null);
  const others = Array.from({ length: 8 }, (_, i) => item(`other-${i}`, null));
  const a = recommendProducts(current, others, () => 0);
  const b = recommendProducts(current, others, () => 0.999);
  assert.equal(a.length, 6);
  assert.notDeepEqual(a.map(p => p.id), b.map(p => p.id));
  assert.deepEqual(recommendProducts(current, [current]), []);
  assert.equal(recommendProducts(current, [current, others[0]]).length, 1);
});

test("default recommendations are deterministic for static-export rebuilds", () => {
  const current = item("acquare", "Floral Frutada");
  const options = Array.from({ length: 24 }, (_, i) =>
    item(`fragrance-${i}`, i % 3 === 0 ? "Floral Frutada" : "Oriental"),
  );
  const catalog = [current, ...options];
  const first = recommendProducts(current, catalog).map(product => product.slug);
  const second = recommendProducts(current, catalog).map(product => product.slug);
  assert.deepEqual(first, second);
  assert.equal(first.length, 6);
  assert.ok(first.every(slug => slug !== current.slug));
  assert.ok(first.slice(0, 6).some(slug => Number(slug.split("-")[1]) % 3 === 0));
});
