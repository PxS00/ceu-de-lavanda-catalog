import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import { categories, normalize, products } from "../src/features/catalog/lib/catalog.ts";

assert.ok(process.argv[2], "Informe a URL do Pages ou do emulador local.");
const base = new URL(process.argv[2]);
assert.ok(["http:", "https:"].includes(base.protocol));
assert.ok(!base.username && !base.password && !base.search && !base.hash);
const routes = [
  ["/", "Um encontro com o seu próximo encanto"],
  ["/catalogo/", "Nossa coleção"],
  ...categories.map(({ slug, name }) => [`/catalogo/${slug}/`, name]),
  ...products.map(({ slug, name }) => [`/produtos/${slug}/`, name]),
];
const directory = "artifacts/visual-review/pages-hosting";
await mkdir(directory, { recursive: true });
const report = { origin: base.origin, routes: [], screenshots: [], headers: [] };
const browser = await chromium.launch();
try {
  for (const [device, width] of [["desktop", 1440], ["mobile", 390]]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      isMobile: device === "mobile",
      hasTouch: device === "mobile",
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
    });
    page.on("requestfailed", (request) => {
      if (request.failure()?.errorText !== "net::ERR_ABORTED") errors.push(request.url());
    });
    for (const [route, title] of routes) {
      const response = await page.goto(new URL(route, base).href);
      assert.equal(response.status(), 200, route);
      const refresh = await page.reload();
      assert.equal(refresh.status(), 200, `Reload ${route}`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) => {
        image.loading = "eager";
        return image.decode();
      })));
      const heading = await page.locator("h1").innerText();
      assert.equal(heading.replace(/\s+/g, " ").trim(), title);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), route);
      const metadataUrls = await page.locator('link[rel="canonical"], meta[property="og:url"]').evaluateAll(
        (elements) => elements.map((element) => element.getAttribute("href") ?? element.getAttribute("content")),
      );
      assert.ok(metadataUrls.every((url) => !/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url)));
      if (base.hostname.endsWith(".pages.dev")) {
        assert.match(refresh.headers()["x-robots-tag"] ?? "", /noindex/);
      }
      report.routes.push({ device, route, direct: response.status(), reload: refresh.status() });
      if (!route.startsWith("/produtos/")) {
        const name = route === "/" ? "home" : route.split("/").filter(Boolean).join("-");
        const path = `${directory}/${device}-${name}.png`;
        await page.screenshot({ path, fullPage: true, animations: "disabled" });
        report.screenshots.push(path);
      }
    }
    await page.goto(new URL("/catalogo/", base).href);
    const cards = page.locator(".product-card");
    await page.getByRole("searchbox").fill(normalize(products[0].name));
    await page.getByRole("heading", { name: products[0].name, exact: true }).waitFor();
    assert.ok((await cards.locator("h3").allTextContents()).every((name) => normalize(name).includes(normalize(products[0].name))));
    await page.getByRole("searchbox").fill("__sem_resultados__");
    await page.getByRole("button", { name: "Limpar filtros" }).click();
    await page.getByRole("combobox").selectOption("za");
    const descending = [...products].sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
    assert.equal(await cards.locator("h3").first().innerText(), descending[0].name);
    const initial = normalize(products[0].name)[0].toUpperCase();
    await page.getByRole("button", { name: initial, exact: true }).click();
    assert.ok(await cards.count() > 0);
    assert.ok((await cards.locator("h3").allTextContents()).every((name) => normalize(name).startsWith(normalize(initial))));
    await page.getByRole("navigation", { name: "Categorias comerciais" }).getByRole("link", { name: "Perfumes", exact: true }).click();
    await page.waitForURL(new URL("/catalogo/perfumes/", base).href);
    const missing = await page.request.get(new URL("/endereco-inexistente/", base).href);
    assert.equal(missing.status(), 404);
    assert.match(await missing.text(), /Uma nova direção/);
    assert.deepEqual(errors, [], `${device}: browser or asset errors`);
    await page.close();
  }
  if (["localhost", "127.0.0.1"].includes(base.hostname)) {
    const context = await browser.newContext();
    for (const host of ["ceu-de-lavanda-preview.pages.dev", "preview.ceu-de-lavanda-preview.pages.dev", "example.com"]) {
      const response = await context.request.get(base.href, { headers: { Host: host } });
      const header = response.headers()["x-robots-tag"];
      assert.equal(response.status(), 200);
      if (host.endsWith(".pages.dev")) assert.match(header ?? "", /noindex/);
      else assert.equal(header, undefined);
      report.headers.push({ host, robots: header ?? null });
    }
    await context.close();
  }
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2) + "\n");
  console.log(`Verified ${routes.length} routes with direct access and reload on desktop/mobile, assets and branded 404: ${base.origin}`);
} finally {
  await browser.close();
}
