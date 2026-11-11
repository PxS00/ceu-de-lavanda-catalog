const base = require("./.lighthouserc.cjs");

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      url: [
        "http://127.0.0.1:4175/",
        "http://127.0.0.1:4175/catalogo/",
      ],
      numberOfRuns: 3,
      settings: { preset: "desktop", chromeFlags: "--headless --no-sandbox" },
    },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse-desktop" },
  },
};
