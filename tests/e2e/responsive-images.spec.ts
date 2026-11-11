import { test, expect } from "@playwright/test";

test("hero uses generated responsive source and priority hint", async ({ page, request }) => {
  await page.goto("/");
  const hero = page.locator(".hero-art img");
  await expect(hero).toHaveAttribute("srcset", /campaigns\/generated\/ceu-de-lavanda-hero-w540\.webp/);
  await expect(hero).toHaveAttribute("fetchpriority", "high");
  const src = await hero.evaluate(async (img) => {
    const element = img as HTMLImageElement;
    await element.decode();
    return { currentSrc: element.currentSrc, decoded: element.naturalWidth > 0 };
  });
  expect(src.decoded).toBe(true);
  expect(src.currentSrc).toMatch(/ceu-de-lavanda-hero(-w\d+)?\.webp/);
  expect((await request.get("/campaigns/generated/ceu-de-lavanda-hero-w540.webp")).status()).toBe(200);
});

test("catalog cards download actual responsive WebP variants", async ({ page, request }) => {
  await page.goto("/catalogo/");
  const first = page.locator(".product-card .product-photo-frame img").first();
  await expect(first).toHaveAttribute("srcset", /\/products\/generated\/.+-w400\.webp 400w, .+-w800\.webp 800w/);
  await expect(first).toHaveAttribute("loading", "lazy");
  const selected = await first.evaluate(async (img) => {
    const element = img as HTMLImageElement;
    element.loading = "eager";
    await element.decode();
    return { currentSrc: element.currentSrc, decoded: element.naturalWidth > 0 };
  });
  expect(selected.decoded).toBe(true);
  expect(new URL(selected.currentSrc).pathname).toMatch(/\/products\/generated\/.+-w(?:400|800)\.webp$/);
  const response = await request.get(new URL(selected.currentSrc).pathname);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/image\/webp/);
});

test("product detail uses a responsive photo on phones without reducing desktop sharpness", async ({ page, request }, testInfo) => {
  await page.goto("/produtos/acquare/");
  const detail = page.locator(".product-detail .product-photo-frame img");
  await expect(detail).toHaveAttribute("alt", "Frasco do perfume Acquaré");
  await expect(detail).toHaveAttribute("fetchpriority", "high");
  const loaded = await detail.evaluate(async (img) => {
    const element = img as HTMLImageElement;
    await element.decode();
    return { currentSrc: element.currentSrc, width: element.naturalWidth, height: element.naturalHeight };
  });
  expect(loaded.width).toBeGreaterThan(0);
  expect(loaded.height).toBeGreaterThan(0);
  const path = new URL(loaded.currentSrc).pathname;
  if (testInfo.project.name === "mobile") {
    expect(path).toMatch(/^\/products\/generated\/acquare-w(?:400|800)\.webp$/);
  } else {
    expect(path).toBe("/products/acquare.webp");
  }
  const imageResponse = await request.get(path);
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()["content-type"]).toMatch(/image\/webp/i);
  const frame = await page.locator(".product-detail .product-art").boundingBox();
  expect(frame?.width).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
