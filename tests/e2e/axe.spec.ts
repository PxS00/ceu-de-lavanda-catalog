import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

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
    const report = {
      route: path,
      project: testInfo.project.name,
      violations: results.violations.map((item) => ({
        rule: item.id,
        impact: item.impact,
        help: item.help,
        nodes: item.nodes.map((node) => ({ target: node.target, failureSummary: node.failureSummary })),
      })),
      incomplete: results.incomplete.length,
    };
    await mkdir("artifacts/quality", { recursive: true });
    await writeFile(
      join("artifacts/quality", `axe-${testInfo.project.name}-${path.replace(/[^a-z0-9]+/gi, "-")}.json`),
      JSON.stringify(report, null, 2) + "\n",
    );
    await testInfo.attach("axe-report", {
      body: JSON.stringify({ path, violations, incomplete: results.incomplete.length }, null, 2),
      contentType: "application/json",
    });
    // Violações sérias/críticas são bloqueantes; demais impactos ficam disponíveis no relatório.
    expect(violations, `Violações WCAG A/AA sérias ou críticas em ${path} (${testInfo.project.name})`).toEqual([]);
  });
}
