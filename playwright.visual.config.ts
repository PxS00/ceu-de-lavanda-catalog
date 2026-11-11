import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Golden snapshots use the same production export/server and fixed Chromium projects.
// Compare against reviewed PNGs committed in this branch; never update them automatically in CI.
export default defineConfig({
  ...base,
  testDir: "./tests/visual-regression",
  // Visual snapshots use only the main export (4173), not the synthetic 101-item fixture (4174).
  webServer: Array.isArray(base.webServer) ? base.webServer.slice(0, 1) : base.webServer,
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}{ext}",
  projects: (base.projects ?? []).filter((project) => project.name === "desktop" || project.name === "mobile"),
  use: {
    ...base.use,
    reducedMotion: "reduce",
    locale: "pt-BR",
    colorScheme: "light",
    deviceScaleFactor: 1,
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixelRatio: 0.005,
    },
  },
});
