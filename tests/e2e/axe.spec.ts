import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

for (const path of ["/", "/catalogo/", "/produtos/acquare/"]) {
  test(`axe-core: auditar WCAG A/AA em ${path}`, async ({ page }, testInfo) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const violations = results.violations
      .filter((item) => item.impact === "critical" || item.impact === "serious")
      .map((item) => ({
        rule: item.id,
        impact: item.impact,
        nodes: item.nodes.length,
        help: item.help,
      }));
    await testInfo.attach("axe-report", {
      body: JSON.stringify({ path, violations, incomplete: results.incomplete.length }, null, 2),
      contentType: "application/json",
    });
    // A baseline de violações sérias será triada antes de habilitar bloqueio completo.
    expect(violations.filter((entry) => entry.impact === "critical")).toEqual([]);
    if (violations.length) {
      testInfo.annotations.push({ type: "accessibility-audit", description: JSON.stringify(violations) });
    }
  });
}
