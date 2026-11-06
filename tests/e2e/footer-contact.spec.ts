import { test, expect } from "@playwright/test";

test("footer exposes official contacts throughout the catalog", async ({ page }) => {
  for (const route of ["/", "/catalogo/", "/produtos/acquare/"]) {
    await page.goto(route);
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", /wa\.me\/5511934640404/);
    await expect(footer.getByRole("link", { name: "+55 11 93464-0404" })).toHaveAttribute("href", "tel:+5511934640404");
    await expect(footer.getByRole("link", { name: "gr.ceudelavanda@gmail.com" })).toHaveAttribute("href", "mailto:gr.ceudelavanda@gmail.com");
    await expect(footer.getByRole("link", { name: /Instagram/ })).toHaveAttribute("href", "https://www.instagram.com/ceu_de_lavanda/");
    await expect(footer.getByRole("link", { name: /TikTok/ })).toHaveAttribute("href", "https://www.tiktok.com/@ceu_de_lavanda");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto("/");
  const about = page.locator("#sobre");
  await expect(about.getByRole("link", { name: /Instagram/ })).toHaveAttribute("href", "https://www.instagram.com/ceu_de_lavanda/");
  await expect(about.getByRole("link", { name: /TikTok/ })).toHaveAttribute("href", "https://www.tiktok.com/@ceu_de_lavanda");
});
