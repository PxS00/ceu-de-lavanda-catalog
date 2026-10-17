import { test as base, expect, type Page, type TestInfo } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { syntheticProducts } from "../fixtures/products.mjs";

const test = base.extend<{ browserHealth: void }>({
  browserHealth: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => {
      if (request.failure()?.errorText !== "net::ERR_ABORTED") errors.push(`${request.url()}: ${request.failure()?.errorText}`);
    });
    page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    await use();
    expect(errors, "Browser/network errors").toEqual([]);
  }, { auto: true }],
});

async function review(page: Page, info: TestInfo, name: string) {
  await page.evaluate(() => document.fonts.ready);
  // Load offscreen and closed-dialog images before checking the full-page capture.
  await page.evaluate(() => { for (const image of document.images) image.loading = "eager"; });
  await expect.poll(() => page.evaluate(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0)), { message: "All images decode" }).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "No horizontal overflow").toBe(true);
  await expect(page.locator(".announcement")).toHaveCount(0);
  await expect(page.getByText("Um universo de fragrâncias para descobrir", { exact: true })).toHaveCount(0);
  await mkdir("artifacts/visual-review/screenshots", { recursive: true });
  const path = `artifacts/visual-review/screenshots/${info.project.name}-${name}.png`;
  await page.screenshot({ path, fullPage: true, animations: "disabled" });
  await info.attach(name, { path, contentType: "image/png" });
}

test("@visual homepage and category discovery", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.locator(".hero h1")).toHaveText("Um encontro com o seu próximo encanto", { useInnerText: true });
  await expect(page.locator("#category-title")).toHaveText("Uma coleção, três caminhos");
  await expect(page.locator("#preview-title")).toHaveText("Nomes para despertar a curiosidade");
  await expect(page.locator(".about h2")).toHaveText("O começo de uma bela descoberta", { useInnerText: true });
  await expect(page.locator(".phrase-strip p")).toHaveText(["Presença nos detalhes", "Beleza em cada descoberta", "O seu próximo encanto"]);
  await expect(page.locator(".category-card")).toHaveCount(3);
  await expect(page.locator(".category-count")).toHaveText(["Aproximadamente 90 fragrâncias", "Aproximadamente 10 opções", "1 fragrância"]);
  await expect(page.locator(".product-card")).toHaveCount(4);
  const columns = await page.locator(".collection-preview .product-grid").evaluate((grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(info.project.name === "desktop" ? 4 : 2);
  await expect(page.getByRole("searchbox")).toHaveCount(0);
  await review(page, info, "homepage");
  await page.getByRole("link", { name: "Ver catálogo completo", exact: true }).click();
  await expect(page).toHaveURL("/catalogo/");
  await expect(page.locator(".product-card")).toHaveCount(8);
  for (const slug of ["perfumes", "body-splash", "perfume-capilar"]) {
    await page.goto("/");
    await page.locator(`.category-card[href='/catalogo/${slug}/']`).click();
    await expect(page).toHaveURL(`/catalogo/${slug}/`);
    await expect(page.getByRole("status")).toHaveText("Cadastro em preparação");
    await review(page, info, slug);
  }
});

test("@visual catalog search, initials, sorting and reset", async ({ page }, info) => {
  await page.goto("/catalogo/");
  const cards = page.locator(".product-card");
  await expect(cards).toHaveCount(8);
  await review(page, info, "catalog");
  await page.getByRole("searchbox").fill("ACQUARE");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Acquaré");
  await review(page, info, "search");
  await page.getByRole("searchbox").fill("");
  await page.getByRole("button", { name: "B", exact: true }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Bellevanille");
  await page.getByRole("button", { name: "Todos os nomes" }).click();
  await page.getByRole("combobox").selectOption("za");
  await expect(cards.first()).toContainText("Sollaris");
  await page.getByRole("combobox").selectOption("az");
  await expect(cards.first()).toContainText("Acquaré");
  await page.getByRole("searchbox").fill("inexistente");
  await expect(cards).toHaveCount(0);
  await review(page, info, "empty-search");
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(cards).toHaveCount(8);
  await expect(page.getByRole("navigation", { name: "Páginas do catálogo" })).toHaveCount(0);
});

test("@visual individual product and return navigation", async ({ page }, info) => {
  await page.goto("/catalogo/");
  await page.locator(".product-card").filter({ hasText: "Acquaré" }).click();
  await expect(page).toHaveURL("/produtos/acquare/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Acquaré");
  await expect(page.getByRole("complementary", { name: "Uma descoberta que continua." })).toBeVisible();
  await expect(page.locator(".detail-price")).toHaveText("Preço ainda não informado");
  await review(page, info, "product");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Acquaré");
  await page.getByRole("link", { name: "Continuar explorando" }).click();
  await expect(page).toHaveURL("/catalogo/");
});

test("@visual header, sticky geometry and keyboard navigation", async ({ page }, info) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  const initial = await header.boundingBox();
  expect(initial?.y).toBe(0);
  await page.evaluate(() => scrollTo(0, 600));
  await expect(header).toHaveAttribute("data-scrolled", "true");
  const scrolled = await header.boundingBox();
  expect(scrolled?.height).toBe(initial?.height);
  expect(scrolled?.y).toBe(0);
  await review(page, info, "sticky-header");
  if (info.project.name === "mobile") {
    const trigger = page.getByRole("button", { name: "Abrir navegação" });
    await trigger.click();
    const dialog = page.getByRole("dialog");
    const close = page.getByRole("button", { name: "Fechar navegação" });
    await expect(close).toBeFocused();
    for (const name of ["Início", "Catálogo", "Sobre a marca", "Explorar a coleção"]) {
      await page.keyboard.press("Tab");
      await expect(dialog.getByRole("link", { name, exact: true })).toBeFocused();
    }
    await review(page, info, "mobile-menu");
    // A viewport capture complements the full-page image for fixed dialog overlays.
    const path = "artifacts/visual-review/screenshots/mobile-menu-viewport.png";
    await page.screenshot({ path, animations: "disabled" });
    await info.attach("mobile-menu-viewport", { path, contentType: "image/png" });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await dialog.getByRole("link", { name: "Catálogo", exact: true }).click();
    await expect(dialog).not.toBeVisible();
  } else {
    await page.getByRole("navigation", { name: "Navegação principal", exact: true }).getByRole("link", { name: "Catálogo" }).focus();
    await page.keyboard.press("Enter");
  }
  await expect(page).toHaveURL("/catalogo/");
  await header.getByRole("link", { name: "Céu de Lavanda — início", exact: true }).click();
  await expect(page).toHaveURL("/");
});

test.describe("101-product test-only catalog", () => {
  test.use({ baseURL: "http://127.0.0.1:4174" });

  test("pagination visits every product once and respects both boundaries", async ({ page }, info) => {
    await page.goto("/catalogo/");
    await expect(page.getByRole("status")).toHaveText("101 fragrâncias");
    const pagination = page.getByRole("navigation", { name: "Páginas do catálogo" });
    const previous = pagination.getByRole("button", { name: "Anterior" });
    const next = pagination.getByRole("button", { name: "Próxima" });
    await expect(previous).toBeDisabled();
    const names: string[] = [];
    for (let current = 1; current <= 9; current++) {
      await expect(pagination.locator("span")).toHaveText(`${current} de 9`);
      await expect(page.locator(".product-card")).toHaveCount(current === 9 ? 5 : 12);
      names.push(...await page.locator(".product-card h3").allTextContents());
      if (current < 9) await next.click();
    }
    expect(names).toEqual(syntheticProducts.map((product) => product.name).sort((a, b) => a.localeCompare(b, "pt-BR")));
    await expect(next).toBeDisabled();
    await previous.click();
    await expect(pagination.locator("span")).toHaveText("8 de 9");
    await review(page, info, "scalability-pagination");
  });

  test("category, initials, accented search, sorting and reset compose", async ({ page }, info) => {
    await page.goto("/catalogo/");
    await page.getByRole("navigation", { name: "Categorias comerciais" }).getByRole("link", { name: "Perfumes", exact: true }).click();
    const cards = page.locator(".product-card");
    const count = page.getByRole("status");
    const pagination = page.getByRole("navigation", { name: "Páginas do catálogo" });
    const next = page.getByRole("button", { name: "Próxima", exact: true });
    await expect(count).toHaveText("90 fragrâncias");
    await next.click();
    await page.getByRole("button", { name: "A", exact: true }).click();
    await expect(count).toHaveText("30 fragrâncias");
    await expect(pagination.locator("span")).toHaveText("1 de 3");
    await next.click();
    await page.getByRole("combobox").selectOption("za");
    await expect(pagination.locator("span")).toHaveText("1 de 3");
    await expect(cards.first()).toContainText("Água de Rosas 088");
    await next.click();
    await page.getByRole("searchbox").fill("  AGUA DE ROSAS  ");
    await expect(pagination.locator("span")).toHaveText("1 de 3");
    await expect(count).toHaveText("30 fragrâncias");
    await page.getByRole("searchbox").fill("Água de Rosas 001");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Água de Rosas 001");
    await expect(pagination).toHaveCount(0);
    await page.getByRole("searchbox").fill("inexistente");
    await expect(cards).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Nenhum nome por aqui." })).toBeVisible();
    await page.getByRole("button", { name: "Limpar filtros" }).click();
    await expect(count).toHaveText("90 fragrâncias");
    await expect(page.getByRole("searchbox")).toHaveValue("");
    await expect(page.getByRole("combobox")).toHaveValue("az");
    await expect(page.getByRole("button", { name: "Todos os nomes" })).toHaveAttribute("aria-pressed", "true");
    await expect(pagination.locator("span")).toHaveText("1 de 8");
    await expect(cards.first()).toContainText("Água de Rosas 001");
    await review(page, info, "scalability-filters");
    for (const [category, expected] of [["Body Splash", "10 fragrâncias"], ["Perfume Capilar", "1 fragrância"]]) {
      await page.getByRole("navigation", { name: "Categorias comerciais" }).getByRole("link", { name: category, exact: true }).click();
      await expect(count).toHaveText(expected);
      await expect(pagination).toHaveCount(0);
    }
  });
});
