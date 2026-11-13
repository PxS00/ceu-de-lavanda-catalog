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

test("WhatsApp button can be moved without opening the link", async ({ page }, testInfo) => {
  await page.goto("/catalogo/perfumes/");
  const button = page.locator(".whatsapp-float");
  await expect(button).toHaveAttribute("href", /wa\.me/);
  await expect(button).toHaveCSS("position", "fixed");
  await expect(button).toHaveCSS("width", testInfo.project.name === "mobile" ? "52px" : "64px");
  const before = (await button.boundingBox())!;
  const x = before.x + before.width / 2;
  const y = before.y + before.height / 2;
  if (testInfo.project.name === "mobile") {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - 100, y: y - 100 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 100, y - 100, { steps: 5 });
    await page.mouse.up();
  }
  const after = (await button.boundingBox())!;
  expect(after.x).toBeLessThan(before.x - 80);
  expect(after.y).toBeLessThan(before.y - 80);
  expect(page.url()).toContain("/catalogo/perfumes/");
  await button.focus();
  await page.keyboard.press("ArrowLeft");
  expect((await button.boundingBox())!.x).toBeLessThan(after.x);
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