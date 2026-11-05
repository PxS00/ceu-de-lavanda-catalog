import { test, expect } from "@playwright/test";

test("related carousel prioritizes family, scrolls and navigates without overflow", async ({ page }, info) => {
  await page.goto("/produtos/acquare/");
  const section = page.getByRole("region", { name: "Outras fragrâncias para descobrir" });
  await section.scrollIntoViewIfNeeded();
  const cards = section.locator(".product-card");
  await expect(cards).toHaveCount(6);
  const links = await cards.evaluateAll(nodes => nodes.map(n => n.getAttribute("href")));
  expect([...links].sort()).toEqual([
    "/produtos/jade/", "/produtos/jasmin-de-soie/", "/produtos/illusion/",
    "/produtos/imperator/", "/produtos/aurora-rose/", "/produtos/belle/",
  ].sort());
  const firstName = await cards.first().locator("h3").innerText();
  expect(new Set(links).size).toBe(6);
  expect(links).not.toContain("/produtos/acquare/");
  const track = section.getByRole("list");
  await expect(section.getByRole("button", { name: "Fragrância anterior", exact: true })).toBeDisabled();
  await section.getByRole("button", { name: "Próxima fragrância", exact: true }).click();
  await expect.poll(() => track.evaluate(e => e.scrollLeft)).toBeGreaterThan(0);
  await expect(section.getByRole("button", { name: "Fragrância anterior", exact: true })).toBeEnabled();
  await track.evaluate(e => { e.scrollLeft = e.scrollWidth; });
  await expect(section.getByRole("button", { name: "Próxima fragrância", exact: true })).toBeDisabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await page.screenshot({ path: `artifacts/visual-review/screenshots/${info.project.name}-related.png`, fullPage: true });
  await section.getByRole("button", { name: "Fragrância anterior", exact: true }).click();
  await cards.first().focus();
  await expect(cards.first()).toBeFocused();
  await cards.first().press("Enter");
  await expect(page).toHaveURL(links[0]!);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(firstName);
});
