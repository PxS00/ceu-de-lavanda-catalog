import { test } from "node:test";
import assert from "node:assert/strict";
import { syntheticProducts } from "./fixtures/products.mjs";
import {
  products,
  validateProducts,
  filterProducts,
  formatPrice,
  categories,
} from "../src/features/catalog/lib/catalog.ts";

test("101-product fixture validates and filters Portuguese names without mutation", () => {
  const original = structuredClone(syntheticProducts);
  validateProducts(syntheticProducts);
  assert.equal(syntheticProducts.length, 101);
  assert.deepEqual(categories.map(({ slug }) =>
    filterProducts(syntheticProducts, "", "", "az", slug).length), [90, 10, 1]);
  for (const query of ["  AGUA DE ROSAS ", "Água de Rosas", "a\u0301gua de rosas"]) {
    const matches = filterProducts(syntheticProducts, query, "A", "az", "perfumes");
    assert.equal(matches.length, 30);
    assert.equal(matches[0].name, "Água de Rosas 001");
    assert.equal(matches.at(-1).name, "Água de Rosas 088");
  }
  assert.equal(filterProducts(syntheticProducts, "verao", "B", "za", "body-splash")[0].name, "Brisa de Verão 098");
  assert.equal(filterProducts(syntheticProducts, "acucar", "C", "az").length, 33);
  assert.equal(filterProducts(syntheticProducts, "rosas", "B", "az").length, 0);
  assert.equal(filterProducts(syntheticProducts, "inexistente", "", "az").length, 0);
  assert.deepEqual(syntheticProducts, original);
});

test("catalog registers the supplied perfumes with their confirmed details", () => {
  assert.equal(products.length, 13);
  assert.deepEqual(
    products.map((p) => p.name).sort(),
    [
      "Altesse",
      "Acquaré",
      "Araya Elixir",
      "Bellevanille",
      "Aura Secretta",
      "Dark Kiss",
      "Illusion",
      "Golden Femme",
      "Jasmin de Soie",
      "Alma de Seda",
      "Sollaris",
      "Vanille Imperial",
      "Vellours",
    ].sort(),
  );
  for (const p of products) assert.equal(p.category, "perfumes");
  for (const slug of ["altesse", "araya-elixir", "dark-kiss", "sollaris", "vanille-imperial", "vellours"]) {
    const product = products.find((item) => item.slug === slug);
    assert.deepEqual(product.volumeOptions, ["50 ml", "100 ml"]);
    assert.ok(product.tagline);
    assert.ok(product.description);
    assert.ok(product.notePyramid.top.length);
    assert.ok(product.notePyramid.heart.length);
    assert.ok(product.notePyramid.base.length);
  }
  assert.equal(products.find((item) => item.slug === "jasmin-de-soie").volumeOptions[0], "100 ml");
  assert.equal(products.find((item) => item.slug === "jasmin-de-soie").photo.src, "/products/jasmin-de-soie.webp");
});

test("search is accent insensitive, intersects initials, sorts without mutating data", () => {
  const original = products.map((p) => p.id);
  assert.equal(
    filterProducts(products, " ACQUARE ", "A", "az")[0].name,
    "Acquaré",
  );
  assert.equal(filterProducts(products, "acquare", "B", "az").length, 0);
  assert.equal(filterProducts(products, "", "A", "az").length, 5);
  assert.equal(filterProducts(products, "", "", "za")[0].name, "Vellours");
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
        volumeOptions: ["50 ml", "100 ml"],
        notePyramid: {
          top: ["Citrus"],
          heart: ["Floral"],
          base: ["Musk"],
        },
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
    [{ ...base, volumeOptions: ["50 ml", " "] }],
    [{ ...base, notePyramid: { top: ["Citrus"], heart: [], base: ["Musk"] } }],
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

test("commercial categories are distinct from olfactory families and remain optional", () => {
  assert.deepEqual(
    categories.map((category) => category.name),
    ["Perfumes", "Body Splash", "Perfume Capilar"],
  );
  assert.equal(new Set(categories.map((category) => category.slug)).size, 3);
  for (const [index, category] of categories.entries()) {
    assert.doesNotThrow(() =>
      validateProducts([{ ...products[0], category: category.slug }]),
    );
    assert.equal(
      filterProducts(products, "", "", "az", category.slug).length,
      [13, 0, 0][index],
    );
  }
  assert.doesNotThrow(() =>
    validateProducts([{ ...products[0], category: null }]),
  );
  for (const category of ["floral", "amadeirado", "", 42])
    assert.throws(() => validateProducts([{ ...products[0], category }]));
  assert.equal(filterProducts(products, "", "", "az").length, 13);
});

test("category filtering intersects search and initials, and preserves sorting", () => {
  const fixtures = [
    { ...products[0], category: "perfumes" },
    { ...products[1], category: "body-splash" },
    { ...products[2], category: "perfume-capilar" },
    { ...products[4], category: "perfumes" },
    products[5],
  ];
  assert.deepEqual(
    filterProducts(fixtures, "", "A", "za", "perfumes").map((p) => p.name),
    ["Aura Secretta", "Alma de Seda", "Acquaré"],
  );
  assert.deepEqual(
    filterProducts(fixtures, "ACQUARE", "A", "az", "perfumes").map(
      (p) => p.name,
    ),
    ["Acquaré"],
  );
  assert.equal(
    filterProducts(fixtures, "ACQUARE", "", "az", "body-splash").length,
    0,
  );
  assert.equal(
    filterProducts(fixtures, "", "", "az", "perfume-capilar")[0].name,
    "Sollaris",
  );
  assert.equal(filterProducts(fixtures, "", "", "az").length, 5);
});
