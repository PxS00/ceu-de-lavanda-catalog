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
