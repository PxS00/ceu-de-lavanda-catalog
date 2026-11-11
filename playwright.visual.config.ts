import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Golden snapshots use the same production export/server and fixed Chromium projects.
// Keep them out of the default E2E job until reviewed PNG baselines are committed.
export default defineConfig({
  ...base,
  testDir: "./tests/visual-regression",
  snapshotPathTemplate: "{testDir}/__screenshots__/{projectName}/{arg}",
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
