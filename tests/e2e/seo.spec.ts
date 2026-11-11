import { test, expect } from "@playwright/test";
import { categories, products } from "../../src/features/catalog/lib/catalog";

const emptyCategories = categories.filter(({ slug }) => !products.some((product) => product.category === slug));
const populatedCategories = categories.filter(({ slug }) => products.some((product) => product.category === slug));

const routes = [
  "/",
  "/catalogo/",
  "/familias-olfativas/",
  ...categories.map(({ slug }) => `/catalogo/${slug}/`),
  ...products.slice(0, 2).map(({ slug }) => `/produtos/${slug}/`),
];

test.describe("SEO no export estático", () => {
  test("404 não herda canonical ou metadados sociais da home", async ({ page }) => {
    await page.goto("/404.html");
    await expect(page).toHaveTitle("Página não encontrada | Céu de Lavanda");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /página não foi encontrada/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[property^="og:"]')).toHaveCount(0);
    await expect(page.locator('meta[name^="twitter:"]')).toHaveCount(0);
    const robots = await page.locator('meta[name="robots"]').all();
    expect(robots.length).toBeGreaterThan(0);
    for (const tag of robots) expect(await tag.getAttribute("content")).toMatch(/noindex/);
  });

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
      const isEmptyCategory = emptyCategories.some(({ slug }) => route === `/catalogo/${slug}/`);
      expect(robots).toMatch(approved && !isEmptyCategory ? /^index/ : /noindex/);
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
      ...populatedCategories.map(({ slug }) => `/catalogo/${slug}/`),
      ...products.map(({ slug }) => `/produtos/${slug}/`),
    ];
    expect(new Set(locations).size).toBe(expectedPaths.length);
    const actualPaths = locations.map((value) => new URL(value).pathname);
    expect(actualPaths.sort()).toEqual([...expectedPaths].sort());
    for (const { slug } of emptyCategories) {
      expect(actualPaths).not.toContain(`/catalogo/${slug}/`);
    }
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
