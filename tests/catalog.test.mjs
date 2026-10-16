import { test } from "node:test";
import assert from "node:assert/strict";
import {
  products,
  validateProducts,
  filterProducts,
  formatPrice,
} from "../src/lib/catalog.ts";

test("only the eight verified names are registered, with no invented details", () => {
  assert.equal(products.length, 8);
  assert.deepEqual(
    products.map((p) => p.name).sort(),
    [
      "Acquaré",
      "Bellevanille",
      "Sollaris",
      "Jasmin de Soie",
      "Alma de Seda",
      "Aura Secretta",
      "Illusion",
      "Golden Femme",
    ].sort(),
  );
  for (const p of products)
    assert.deepEqual(Object.keys(p).sort(), ["id", "name", "slug"]);
});

test("search is accent insensitive, intersects initials, sorts without mutating data", () => {
  const original = products.map((p) => p.id);
  assert.equal(
    filterProducts(products, " ACQUARE ", "A", "az")[0].name,
    "Acquaré",
  );
  assert.equal(filterProducts(products, "acquare", "B", "az").length, 0);
  assert.equal(filterProducts(products, "", "A", "az").length, 3);
  assert.equal(filterProducts(products, "", "", "za")[0].name, "Sollaris");
  assert.deepEqual(
    products.map((p) => p.id),
    original,
  );
  assert.equal(filterProducts([], "", "", "az").length, 0);
});

test("data validation rejects malformed and duplicate bulk records", () => {
  const base = { id: "test", slug: "test", name: "Test" };
  assert.doesNotThrow(() =>
    validateProducts([
      {
        ...base,
        description: null,
        notes: [],
        photo: null,
        priceCents: 0,
        availability: null,
      },
    ]),
  );
  assert.doesNotThrow(() =>
    validateProducts([
      {
        ...base,
        photo: { src: "/products/approved.webp", alt: "Approved photograph" },
        priceCents: 12000,
        notes: ["Verified note"],
        availability: "available",
      },
    ]),
  );
  for (const input of [
    null,
    {},
    [null],
    [{ ...base, name: " " }],
    [base, base],
    [base, { ...base, id: "other" }],
    [{ ...base, slug: "../x" }],
    [{ ...base, priceCents: -1 }],
    [{ ...base, priceCents: 1.5 }],
    [{ ...base, description: 10 }],
    [{ ...base, notes: [null] }],
    [{ ...base, availability: "unknown" }],
    [
      {
        ...base,
        photo: { src: "https://invalid.test/photo.jpg", alt: "photo" },
      },
    ],
    [{ ...base, photo: { src: "/products/photo.jpg", alt: "" } }],
  ]) {
    assert.throws(() => validateProducts(input));
  }
});

test("missing prices remain unknown while zero is formatted as a real value", () => {
  assert.equal(formatPrice(null), "Preço ainda não informado");
  assert.equal(formatPrice(undefined), "Preço ainda não informado");
  assert.match(formatPrice(0), /0,00/);
  assert.match(formatPrice(12345), /123,45/);
});
