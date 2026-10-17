import { test, expect } from "@playwright/test";

test.describe("delicate catalog motion", () => {
  test.use({ baseURL: "http://127.0.0.1:4174", reducedMotion: "no-preference" });

  test("photo zoom, static placeholders, keyboard focus and direct touch navigation", async ({ page }, info) => {
    await page.goto("/catalogo/");
    const photoCard = page.locator(".product-card").filter({ has: page.locator(".has-photo") });
    const photo = photoCard.locator("img");
    const placeholder = page.locator(".product-card").filter({ has: page.locator(".placeholder-label") }).first();
    await photoCard.scrollIntoViewIfNeeded();
    await expect(photoCard).toHaveClass(/is-revealed/);
    await expect.poll(() => photoCard.evaluate((card) => card.getAnimations().length)).toBe(0);
    const size = await photoCard.boundingBox();
    if (info.project.name !== "mobile") {
      await photoCard.hover();
      await expect(photo).toHaveCSS("transform", "matrix(1.03, 0, 0, 1.03, 0, 0)");
      await expect(photoCard.locator(".product-card-title svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 2, -2)");
      expect(await photoCard.boundingBox()).toEqual(size);
      await placeholder.hover();
      await expect(placeholder.locator("img")).toHaveCSS("transform", "none");
      await expect(placeholder).toHaveCSS("transform", "none");
      await page.mouse.move(0, 0);
      await photoCard.focus();
      await expect(photoCard).toBeFocused();
      await expect(photoCard).toHaveCSS("outline-style", "solid");
      await expect(photoCard.locator(".product-card-title svg")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 2, -2)");
      await page.keyboard.press("Enter");
    } else {
      await photoCard.tap();
    }
    await expect(page).toHaveURL("/produtos/synthetic-0/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Água de Rosas 001");
  });

  test("cards reveal once on entry, including the homepage grid", async ({ page }) => {
    await page.addInitScript(() => {
      document.addEventListener("animationstart", (event) => {
        if (event.animationName === "card-reveal" && event.target instanceof HTMLElement)
          event.target.dataset.testReveals = String(Number(event.target.dataset.testReveals ?? 0) + 1);
      });
    });
    for (const route of ["/", "/catalogo/"]) {
      await page.goto(route);
      const card = page.locator(".product-card").first();
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveAttribute("data-test-reveals", "1");
      await expect.poll(() => card.evaluate((element) => element.getAnimations().length)).toBe(0);
      await expect(card).toHaveCSS("animation-duration", "0.28s");
      await page.locator("footer").scrollIntoViewIfNeeded();
      await card.scrollIntoViewIfNeeded();
      await expect(card).toHaveAttribute("data-test-reveals", "1");
      if (route === "/catalogo/") {
        await page.getByRole("searchbox").fill("rosas");
        await expect(page.getByRole("status")).toHaveText("34 fragrâncias");
        await expect(card).toHaveAttribute("data-test-reveals", "1");
      }
    }
  });

  test("filter opacity updates immediately and cancels when reduced motion is enabled", async ({ page }) => {
    await page.goto("/catalogo/");
    const results = page.locator(".catalog-results");
    await page.getByRole("searchbox").fill("rosas");
    await expect(page.getByRole("status")).toHaveText("34 fragrâncias");
    expect(await results.evaluate((element) => element.getAnimations().some((animation) => animation.effect?.getTiming().duration === 180))).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => results.evaluate((element) => element.getAnimations().length)).toBe(0);
    await page.getByRole("searchbox").fill("inexistente");
    await expect(page.getByRole("heading", { name: "Nenhum nome por aqui." })).toBeVisible();
    await expect(results).toHaveCSS("opacity", "1");
    expect(await results.evaluate((element) => element.getAnimations().length)).toBe(0);
  });
});

test("reduced motion disables card, image, arrow and filter animations", async ({ page }, info) => {
  await page.goto("/catalogo/");
  const card = page.locator(".product-card").first();
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await expect(card).toHaveCSS("outline-style", "solid");
  if (info.project.name !== "mobile") await card.hover();
  await expect(card).toHaveCSS("animation-name", "none");
  await expect(card.locator("img")).toHaveCSS("transform", "none");
  await expect(card.locator(".product-card-title svg")).toHaveCSS("transform", "none");
  await page.getByRole("searchbox").fill("ACQUARE");
  await expect(page.locator(".product-card")).toHaveCount(1);
  expect(await page.locator(".catalog-results").evaluate((element) => element.getAnimations({ subtree: true }).length)).toBe(0);
});
