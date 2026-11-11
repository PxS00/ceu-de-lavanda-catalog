import { expect, test, type Locator, type Page } from "@playwright/test";

// Exercise the real sequential Tab order. Locator.focus() would bypass focus traps
// and may hide problems that affect keyboard-only customers.
async function tabUntilFocused(page: Page, target: Locator, maxTabs = 80): Promise<number> {
  await expect(target).toHaveCount(1);
  for (let count = 0; count <= maxTabs; count++) {
    if (await target.evaluate((element) => document.activeElement === element)) return count;
    if (count < maxTabs) await page.keyboard.press("Tab");
  }
  throw new Error(`Target not reachable after ${maxTabs} Tab presses: ${target.toString()}`);
}

test("keyboard-only journey: search, product detail, and related carousel", async ({ page }, testInfo) => {
  await page.goto("/catalogo/");
  await expect(page.locator(".catalog .product-card")).toHaveCount(12);

  const search = page.getByRole("searchbox", { name: "Buscar fragrância pelo nome" });
  const searchTabs = await tabUntilFocused(page, search, 25);
  await expect(page.locator(".search-field")).toHaveCSS("outline-style", "solid");
  await page.keyboard.type("ACQUARE");
  const card = page.locator(".catalog-results .product-card");
  await expect(card).toHaveCount(1);
  await expect(card.first()).toContainText("Acquaré");

  // The filter is immediately after the search in the normal document tab order.
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Ordenar por" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Família olfativa" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("combobox", { name: "Gênero", exact: true })).toBeFocused();

  const cardTabs = await tabUntilFocused(page, card, 80);
  await expect(card).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/produtos\/acquare\/$/);
  await expect(page.getByRole("heading", { name: "Acquaré", level: 1 })).toBeVisible();

  const next = page.getByRole("button", { name: "Próxima fragrância" });
  const relatedTabs = await tabUntilFocused(page, next, 45);
  await expect(next).toBeEnabled();
  await expect(next).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Enter");
  await expect.poll(
    () => page.locator(".related-track").evaluate((track) => track.scrollLeft),
  ).toBeGreaterThan(0);

  await testInfo.attach("keyboard-journey", {
    body: JSON.stringify({
      viewport: testInfo.project.name,
      route: "/catalogo/ → /produtos/acquare/",
      searchTabs,
      cardTabs,
      relatedTabs,
      verified: ["focus visibility", "filter tab order", "Enter navigation", "related carousel keyboard activation"],
    }, null, 2),
    contentType: "application/json",
  });
});
