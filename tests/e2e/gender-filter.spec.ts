import { expect, test } from "@playwright/test";
import products from "../../src/features/catalog/data/products.json";

const masculineCount = products.filter((product) => product.category === "perfumes" && product.gender === "masculino").length;
const sharedCount = products.filter((product) => product.category === "perfumes" && product.gender === "compartilhavel").length;
const sharedTotal = products.filter((product) => product.gender === "compartilhavel").length;

test("home shortcuts open their real selections and show pending male perfumes", async ({ page }, testInfo) => {
  await page.goto("/");
  const discovery = page.getByRole("region", { name: "Encontre o seu jeito de sentir" });
  await discovery.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `artifacts/visual-review/gender-${testInfo.project.name}.png` });
  for (const label of ["Femininos", "Masculinos", "Compartilháveis"]) {
    await discovery.getByRole("link", { name: new RegExp(label) }).screenshot({ path: `artifacts/visual-review/gender-${testInfo.project.name}-${label}.png` });
  }
  const masculine = discovery.getByRole("link", { name: /Masculinos/ });
  if (!masculineCount) await expect(masculine).toContainText("Em breve");
  await masculine.click();
  await expect(page).toHaveURL(/genero=masculino/);
  if (!masculineCount) {
    await expect(page.getByRole("heading", { name: "Uma nova descoberta está por vir." })).toBeVisible();
    await page.getByRole("button", { name: /Explorar toda a coleção/ }).click();
    await expect(page).not.toHaveURL(/genero=/);
  } else {
    await expect(page.locator(".catalog").getByRole("status")).toContainText(String(masculineCount));
  }
  await page.goto("/");
  await page.getByRole("region", { name: "Encontre o seu jeito de sentir" }).getByRole("link", { name: /Compartilháveis/ }).click();
  await expect(page).toHaveURL(/genero=compartilhavel/);
  await expect(page.locator(".catalog").getByRole("status")).toContainText(String(sharedCount));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("gender links survive refresh, combine with family and can be cleared", async ({ page }) => {
  await page.goto("/catalogo/?genero=compartilhavel");
  const gender = page.getByRole("combobox", { name: "Gênero", exact: true });
  await expect(gender).toHaveValue("compartilhavel");
  await expect(page.locator(".catalog").getByRole("status")).toContainText(String(sharedTotal));
  await page.reload();
  await expect(gender).toHaveValue("compartilhavel");
  await page.getByRole("combobox", { name: "Família olfativa" }).selectOption({ index: 1 });
  await expect(page).toHaveURL(/genero=compartilhavel/);
  await expect(page).toHaveURL(/familia=/);
  await gender.selectOption("feminino");
  await expect(page).toHaveURL(/genero=feminino/);
  await expect(page).toHaveURL(/familia=/);
  await page.goBack();
  await expect(gender).toHaveValue("compartilhavel");
  await gender.selectOption("");
  await expect(page).not.toHaveURL(/genero=/);
  await expect(page).toHaveURL(/familia=/);
});

test("cards shine on hover or mobile entry and respect reduced motion", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const card = page.getByRole("region", { name: "Encontre o seu jeito de sentir" }).getByRole("link", { name: /Femininos/ });
  await card.scrollIntoViewIfNeeded();
  if (testInfo.project.name === "mobile") {
    await expect(card).toHaveClass(/is-glinting/);
    await expect.poll(() => card.evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("gender-discovery-glint");
  } else {
    await card.hover();
    await expect.poll(() => card.evaluate((element) => Number(getComputedStyle(element, "::after").opacity))).toBeGreaterThan(.3);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("none");
  await expect.poll(() => card.evaluate((element) => getComputedStyle(element, "::after").opacity)).toBe("0");
});
