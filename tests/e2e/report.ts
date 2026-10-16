import { mkdirSync, writeFileSync } from "node:fs";
import type { Reporter, TestCase, TestResult, FullResult, TestError } from "@playwright/test/reporter";

export default class ReviewReport implements Reporter {
  private results: string[] = [];

  onError(error: TestError) {
    this.results.push(`Runner error:\n\n\`\`\`text\n${error.message}\n\`\`\``);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const screenshots = result.attachments.filter((item) => item.path?.endsWith(".png"));
    this.results.push([
      `### ${test.parent.project()?.name}: ${test.title}`,
      `Viewport: ${test.parent.project()?.use.viewport?.width}×${test.parent.project()?.use.viewport?.height}`,
      `Result: **${result.status}** (${result.duration} ms).`,
      ...result.errors.map((error) => `\n\`\`\`text\n${error.message?.replace(/\u001b\[[0-9;]*m/g, "")}\n\`\`\``),
      ...screenshots.map((item) => `[${item.name}](${item.path!.split("artifacts/visual-review/").pop()})`),
    ].join("\n\n"));
  }

  onEnd(result: FullResult) {
    mkdirSync("artifacts/visual-review", { recursive: true });
    writeFileSync("artifacts/visual-review/report.md", [
      "# Céu de Lavanda — Chromium review",
      `Generated: ${new Date().toISOString()} · Overall: **${result.status}**`,
      "Checks: full-page captures, horizontal overflow, console/page errors, failed requests, HTTP errors, image decoding, search, initial filters, sorting, category routes, product navigation and keyboard navigation.",
      "UI issues: failures below identify automated findings. Passing checks do not establish visual approval or a complete accessibility audit.",
      "Limits: screenshots are review artifacts, not pixel-baseline comparisons. Reduced motion stabilizes captures; animation appearance requires manual review. Eight verified products do not activate pagination; no inventory was fabricated. Category pages intentionally display registration fallbacks. Python's local static server does not reproduce Cloudflare security headers or custom 404 routing.",
      ...this.results,
    ].join("\n\n"));
  }
}
