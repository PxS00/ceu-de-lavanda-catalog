import { test, expect } from "@playwright/test";
import { categories, products } from "../../src/features/catalog/lib/catalog";

const routes = [
  "/",
  "/catalogo/",
  "/familias-olfativas/",
  ...categories.map(({ slug }) => `/catalogo/${slug}/`),
  ...products.slice(0, 2).map(({ slug }) => `/produtos/${slug}/`),
];

test.describe("SEO no export estático", () => {
  for (const route of routes) {
    test(`metadados válidos em ${route}`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/Céu de Lavanda/);
      const description = await page.locator('meta[name="description"]').getAttribute("content");
      expect(description?.trim().length).toBeGreaterThan(35);
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical).toBeTruthy();
      const parsed = new URL(canonical!);
      expect(parsed.protocol).toBe("https:");
      expect(parsed.pathname).toBe(route);
      expect(parsed.href).not.toMatch(/localhost|127\.0\.0\.1/);
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical!);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /^https:\/\//);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      const approved = process.env.CATALOG_INDEXABLE === "true" &&
        Boolean(process.env.CATALOG_SITE_URL) &&
        !new URL(process.env.CATALOG_SITE_URL!).hostname.endsWith(".pages.dev");
      expect(robots).toMatch(approved ? /\\bindex\\b/ : /noindex/);
    });
  }

  test("sitemap e robots possuem URLs públicas e rotas canônicas", async ({ request }) => {
    const xml = await request.get("/sitemap.xml");
    expect(xml.status()).toBe(200);
    const content = await xml.text();
    expect(content).toContain("<urlset");
    const locations = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    const expectedPaths = [
      "/", "/catalogo/", "/familias-olfativas/",
      ...categories.map(({ slug }) => `/catalogo/${slug}/`),
      ...products.map(({ slug }) => `/produtos/${slug}/`),
    ];
    expect(new Set(locations).size).toBe(expectedPaths.length);
    for (const path of expectedPaths) expect(locations.map((value) => new URL(value).pathname)).toContain(path);
    expect(content).not.toMatch(/localhost|127\.0\.0\.1/);
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const robotsText = await robots.text();
    expect(robotsText).toMatch(/User-agent: \*/i);
    expect(robotsText).toMatch(/Sitemap: https:\/\//);
    expect(robotsText).not.toMatch(/Disallow: \//);
  });

  test("JSON-LD usa apenas produtos cadastrados e preços reais", async ({ page }) => {
    const product = products.find((p) => p.photo && p.volumePrices?.length);
    expect(product).toBeDefined();
    await page.goto(`/produtos/${product!.slug}/`);
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    const records = jsonLd.map((entry) => JSON.parse(entry));
    const data = records.find((entry) => entry["@type"] === "Product");
    expect(data).toBeDefined();
    expect(data.name).toBe(product!.name);
    expect(data.url).toContain(`/produtos/${product!.slug}/`);
    expect(data.image?.[0]).toContain(product!.photo!.src);
    expect(data).not.toHaveProperty("aggregateRating");
    const allowedPrices = product!.volumePrices!.map((price) => (price.priceCents / 100).toFixed(2));
    for (const offer of data.offers ?? []) expect(allowedPrices).toContain(offer.price);
  });
});
