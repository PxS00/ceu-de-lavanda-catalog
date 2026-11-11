import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 3,
  outputDir: "artifacts/visual-review/test-results",
  reporter: [["list"], ["./tests/e2e/report.ts"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  // Discovery por projeto, sem skips: os cenários continuam executando nas mesmas telas.
  projects: [
    {
      name: "desktop",
      testIgnore: ["**/*.mobile.spec.ts"],
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "tablet",
      testIgnore: ["**/*.desktop.spec.ts", "**/*.mobile.spec.ts"],
      use: { viewport: { width: 768, height: 1024 } },
    },
    {
      name: "mobile",
      testIgnore: ["**/*.desktop.spec.ts", "**/*.desktop-tablet.spec.ts"],
      use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
    },
  ],
  webServer: [{
    command: process.env.CI ? "python3 -u -m http.server 4173 --bind 127.0.0.1 --directory out" : "pnpm build && python3 -u -m http.server 4173 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stderr: "pipe",
  }, {
    command: "node tests/fixtures/serve-catalog.mjs",
    url: "http://127.0.0.1:4174",
    reuseExistingServer: false,
    timeout: 180_000,
    stderr: "pipe",
  }],
});
