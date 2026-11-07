import { test, expect } from "@playwright/test";

test("olfactory story explains notes and offers motion control", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const story = page.locator(".olfactory-story");
  await story.scrollIntoViewIfNeeded();
  await expect(story.getByText("Notas de saída")).toBeVisible();
  await expect(story.getByText("Notas de corpo")).toBeVisible();
  await expect(story.getByText("Notas de fundo")).toBeVisible();
  await expect(story.locator(".olfactory-story-art")).toHaveAttribute("data-playing", "true");
  await story.getByRole("button", { name: "Pausar animação" }).click();
  await expect(story.locator(".olfactory-story-art")).toHaveAttribute("data-playing", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(story.getByRole("button", { name: "Retomar animação" })).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
