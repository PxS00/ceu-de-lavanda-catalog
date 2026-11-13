import { test, expect } from "@playwright/test";

test("category descriptions match each category", async ({ page }) => {
  const categories = [
    ["perfumes", "Encontre um perfume para marcar seus momentos."],
    ["body-splash", "Descubra fragrâncias leves para acompanhar seu dia."],
    ["perfume-capilar", "Perfume seus cabelos com uma fragrância especial."],
  ];
  for (const [slug, description] of categories) {
    await page.goto(`/catalogo/${slug}/`);
    await expect(page.locator(".catalog-heading p")).toHaveText(description);
  }
});

test("mobile WhatsApp link does not cover page content", async ({ page }, testInfo) => {
  await page.goto("/catalogo/perfumes/");
  const button = page.locator(".whatsapp-float");
  await expect(button).toHaveAttribute("href", /wa\.me/);
  await expect(button).toHaveCSS("position", testInfo.project.name === "mobile" ? "static" : "fixed");
});

test("family filter adapts to the selected text on desktop", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Mobile filters share the available width.");
  await page.goto("/catalogo/perfumes/");
  const select = page.getByLabel("Família olfativa");
  await select.selectOption({ label: "Floral" });
  const shortWidth = (await select.boundingBox())!.width;
  await select.selectOption({ label: "Floral Almiscarado Amadeirado" });
  expect((await select.boundingBox())!.width).toBeGreaterThan(shortWidth);
});