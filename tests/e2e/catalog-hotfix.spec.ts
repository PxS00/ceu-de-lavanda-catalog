import { test, expect } from "@playwright/test";

test("category descriptions and family filter remain consistent", async ({ page }) => {
  const categories = [
    ["perfumes", "Encontre um perfume para marcar seus momentos."],
    ["body-splash", "Descubra fragrâncias leves para acompanhar seu dia."],
    ["perfume-capilar", "Perfume seus cabelos com uma fragrância especial."],
  ];
  const widths: number[] = [];
  for (const [slug, description] of categories) {
    await page.goto(`/catalogo/${slug}/`);
    await expect(page.locator(".catalog-heading p")).toHaveText(description);
    widths.push((await page.getByLabel("Família olfativa").boundingBox())!.width);
  }
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
});

test("mobile WhatsApp link does not cover page content", async ({ page }, testInfo) => {
  await page.goto("/catalogo/perfumes/");
  const button = page.locator(".whatsapp-float");
  await expect(button).toHaveAttribute("href", /wa\.me/);
  await expect(button).toHaveCSS("position", testInfo.project.name === "mobile" ? "static" : "fixed");
});
