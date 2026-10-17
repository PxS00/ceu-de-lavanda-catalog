import { test, expect } from "@playwright/test";

test("catalog and category controls remain compact, accessible and within the viewport", async ({ page }, info) => {
  let referenceTypography;
  for (const [route, title] of [["", "Nossa coleção"], ["perfumes/", "Perfumes"], ["body-splash/", "Body Splash"], ["perfume-capilar/", "Perfume Capilar"]]) {
    await page.goto(`/catalogo/${route}`);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(title);
    await expect(page.locator("h1")).toHaveText(title);
    await expect(page.locator(".title-dot")).toHaveCount(0);
    const typography = await page.locator("h1").evaluate((heading) => {
      const style = getComputedStyle(heading);
      return {
        family: style.fontFamily,
        color: style.color,
        size: style.fontSize,
        alignment: style.textAlign,
        script: style.getPropertyValue("--font-script").split(",")[0].trim().replace(/['"]/g, ""),
        before: getComputedStyle(heading, "::before").content,
        after: getComputedStyle(heading, "::after").content,
      };
    });
    expect(typography.family).toContain(typography.script);
    expect(typography.before).toBe("none");
    expect(typography.after).toBe("none");
    referenceTypography ??= typography;
    expect(typography).toEqual(referenceTypography);
    await expect(page.locator(".catalog .eyebrow")).toHaveCount(0);
    const geometry = await page.evaluate(() => ({
      top: document.querySelector(".catalog-results")!.getBoundingClientRect().top,
      overflow: document.documentElement.scrollWidth > innerWidth,
      controls: [...document.querySelectorAll(".category-filters a, .search-field, .sort-label select, .initial-filters button")].map((element) => {
        const box = element.getBoundingClientRect();
        return { height: box.height, left: box.left, right: box.right };
      }),
    }));
    expect(geometry.top).toBeLessThan(info.project.name === "mobile" ? 650 : 500);
    expect(geometry.overflow).toBe(false);
    for (const control of geometry.controls) {
      expect(control.height).toBeGreaterThanOrEqual(44);
      expect(control.left).toBeGreaterThanOrEqual(0);
      expect(control.right).toBeLessThanOrEqual(page.viewportSize()!.width);
    }
    const categories = page.getByRole("navigation", { name: "Categorias comerciais" });
    await expect(categories.getByRole("link")).toHaveCount(4);
    const active = categories.locator("[aria-current]");
    const selectedColor = await active.evaluate((element) => getComputedStyle(element).backgroundColor);
    if (info.project.name !== "mobile") {
      await active.hover();
      await expect(active).toHaveCSS("background-color", selectedColor);
    }
    await categories.getByRole("link").last().focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("searchbox")).toBeFocused();
    await expect(page.locator(".search-field")).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("combobox")).toBeFocused();
    await expect(page.getByRole("combobox")).toHaveCSS("outline-style", "solid");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Todos os nomes" })).toBeFocused();
    await expect(page.getByRole("button", { name: "Todos os nomes" })).toHaveCSS("outline-style", "solid");
  }
});
