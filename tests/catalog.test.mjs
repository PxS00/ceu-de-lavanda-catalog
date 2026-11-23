import { test } from "node:test";
import assert from "node:assert/strict";
import { syntheticProducts } from "./fixtures/products.mjs";
import {
  products,
  validateProducts,
  filterProducts,
  formatPrice,
  getStartingPrice,
  getPrimaryFamily,
  getProductFamilies,
  categories,
} from "../src/features/catalog/lib/catalog.ts";

test("gender filtering combines with category, family and search without modifying the catalog", () => {
  const original = structuredClone(products);
  const shared = products.find((product) => product.gender === "compartilhavel" && product.family);
  assert.ok(shared);
  const filtered = filterProducts(products, shared.name, "", "az", shared.category, shared.family, "compartilhavel");
  assert.ok(filtered.some((product) => product.id === shared.id));
  assert.ok(filtered.every((product) => product.gender === "compartilhavel" && getPrimaryFamily(product.family) === getPrimaryFamily(shared.family)));
  assert.deepEqual(filterProducts(products, shared.name, "", "az", shared.category, shared.family, "masculino"), []);
  assert.deepEqual(products, original);
});

test("primary family groups variants, aliases and old links", () => {
  const fixtures = [
    { id: "wood-spice", name: "A", family: "Amadeirado Especiado" },
    { id: "wood-aromatic", name: "B", family: "Amadeirada Aromática" },
    { id: "floral", name: "C", family: "Floral Solar" },
    { id: "pending", name: "D" },
  ];
  const expected = ["wood-spice", "wood-aromatic"];
  for (const family of ["Amadeirado", "amadeirada (Aromática)", "  AMADEIRADO ESPECIADO  "]) {
    assert.deepEqual(filterProducts(fixtures, "", "", "az", "", family).map((p) => p.id), expected);
  }
  assert.equal(filterProducts(fixtures, "", "", "az").length, fixtures.length);
});

test("starting price uses the lowest valid offered volume and handles missing prices", () => {
  const base = { id: "test", slug: "test", name: "Teste" };
  assert.equal(getStartingPrice({ ...base, volumeOptions: ["50 ml", "100 ml"], volumePrices: [
    { volume: "100 ml", priceCents: 28700 }, { volume: "50 ml", priceCents: 15700 },
  ] }), 15700);
  assert.equal(getStartingPrice({ ...base, volumeOptions: ["100 ml"], volumePrices: [
    { volume: "50 ml", priceCents: 100 }, { volume: "100 ml", priceCents: 28700 },
  ] }), 28700);
  assert.equal(getStartingPrice({ ...base, volumePrices: [{ volume: "50 ml", priceCents: 0 }] }), null);
  assert.equal(getStartingPrice({ ...base }), null);
  assert.equal(getStartingPrice({ ...base, priceCents: 15700 }), 15700);
});

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
  const registeredNames = new Set(products.map((product) => product.name));
  for (const name of [
      "Altesse",
      "Acquaré",
      "Araya Elixir",
      "Belle Vanille",
      "Aura Secretta",
      "Aurora Verde",
      "Dark Kiss",
      "Eterna",
      "Illusion",
      "Golden Femme",
      "Hypnos",
      "Imperator",
      "Jade",
      "Jasmim de Soie",
      "Alma de Seda",
      "Madellune",
      "Sollaris",
      "Serena",
      "Vanille Imperial",
      "Vellours",
  ]) assert.ok(registeredNames.has(name), `Missing perfume: ${name}`);
  for (const p of products.filter((product) => product.category === "perfumes")) {
    assert.deepEqual(p.volumeOptions, ["50 ml", "100 ml"]);
    assert.deepEqual(p.volumePrices, [
      { volume: "50 ml", priceCents: 15700 },
      { volume: "100 ml", priceCents: 28700 },
    ]);
    assert.equal(p.availability, "available");
    assert.ok(p.family && !/[()]/.test(p.family));
    assert.ok(p.tagline);
    assert.ok(p.description);
    assert.ok(p.notePyramid.top.length);
    assert.ok(p.notePyramid.heart.length);
    assert.ok(p.notePyramid.base.length);
  }
  assert.equal(products.find((item) => item.slug === "jasmin-de-soie").photo.src, "/products/jasmin-de-soie.webp");
  assert.equal(products.find((item) => item.slug === "illusion").productType, "Perfume compartilhável");
});

test("search is accent insensitive, intersects initials, sorts without mutating data", () => {
  const original = products.map((p) => p.id);
  assert.equal(
    filterProducts(products, " ACQUARE ", "A", "az")[0].name,
    "Acquaré",
  );
  assert.equal(filterProducts(products, "acquare", "B", "az").length, 0);
  assert.deepEqual(
    filterProducts(products, "", "", "za").map((p) => p.id),
    [...products].sort((a, b) => b.name.localeCompare(a.name, "pt-BR")).map((p) => p.id),
  );
  assert.deepEqual(
    products.map((p) => p.id),
    original,
  );
  assert.equal(filterProducts([], "", "", "az").length, 0);
});

test("commercial workbook merge preserves photographs and source identity without duplicates", () => {
  const imported = products.filter((product) => product.sourceRecord);
  assert.equal(imported.length, new Set(imported.map((product) => product.sourceRecord.number)).size);
  for (const p of imported) {
    assert.ok(p.photo);
    assert.ok(p.sourceRecord.name);
    assert.ok(p.sourceRecord.volumeType);
    assert.ok(p.sourceRecord.profile);
    assert.ok(p.family);
    assert.ok(p.style);
    assert.ok(["feminino", "masculino", "compartilhavel"].includes(p.gender));
  }
  assert.equal(products.find(p => p.slug === "illusion").gender, "compartilhavel");
  for (const slug of ["imperator", "bourbon-noir"]) assert.equal(products.find(p => p.slug === slug).gender, "masculino");
  assert.equal(products.find(p => p.slug === "aura-rubbra").gender, "feminino");
  assert.equal(products.find(p => p.slug === "jasmin-de-soie").name, "Jasmim de Soie");
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
        volumePrices: [
          { volume: "50 ml", priceCents: 0 },
          { volume: "100 ml", priceCents: 28700 },
        ],
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
    [{ ...base, volumePrices: {} }],
    [{ ...base, volumePrices: [] }],
    [{ ...base, volumePrices: [null] }],
    [{ ...base, volumePrices: [{ volume: " ", priceCents: 15700 }] }],
    [{ ...base, volumePrices: [{ volume: "50 ml", priceCents: -1 }] }],
    [{ ...base, volumePrices: [{ volume: "50 ml", priceCents: 157.5 }] }],
    [{ ...base, volumePrices: [{ volume: "50 ml", priceCents: "15700" }] }],
    [{ ...base, volumePrices: [{ volume: "50 ml", priceCents: 15700 }, { volume: "50 ml", priceCents: 28700 }] }],
    [{ ...base, volumeOptions: ["50 ml"], volumePrices: [{ volume: "100 ml", priceCents: 28700 }] }],
    [{ ...base, volumeOptions: ["50 ml", "100 ml"], volumePrices: [{ volume: "50 ml", priceCents: 15700 }] }],
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
  for (const category of categories) {
    assert.doesNotThrow(() =>
      validateProducts([{ ...products[0], category: category.slug }]),
    );
    assert.equal(
      filterProducts(products, "", "", "az", category.slug).length,
      products.filter((product) => product.category === category.slug).length,
    );
  }
  assert.doesNotThrow(() =>
    validateProducts([{ ...products[0], category: null }]),
  );
  for (const category of ["floral", "amadeirado", "", 42])
    assert.throws(() => validateProducts([{ ...products[0], category }]));
  assert.equal(filterProducts(products, "", "", "az").length, products.length);
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


test("Gourmand remains searchable alongside the primary family", () => {
  const items = [
    { id: "a", name: "A", family: "Oriental Gourmand" },
    { id: "b", name: "B", family: "Floral Frutada Gourmand" },
    { id: "c", name: "C", family: "Floral Frutada" },
    { id: "d", name: "D", family: "Gourmand" },
  ];
  assert.deepEqual(getProductFamilies(items[0].family), ["Oriental", "Gourmand"]);
  assert.deepEqual(getProductFamilies(items[3].family), ["Gourmand"]);
  assert.deepEqual(filterProducts(items, "", "", "az", "", "Gourmand").map((p) => p.id), ["a", "b", "d"]);
  assert.deepEqual(filterProducts(items, "", "", "az", "", "Floral").map((p) => p.id), ["b", "c"]);
  assert.deepEqual(filterProducts(items, "", "", "az", "", "Frutal"), []);
});
