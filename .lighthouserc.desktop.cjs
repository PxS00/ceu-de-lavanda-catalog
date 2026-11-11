/* eslint-disable @typescript-eslint/no-require-imports -- Configuração CommonJS exigida pelo LHCI. */
const base = require("./.lighthouserc.cjs");

module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...base.ci.collect,
      url: [
        "http://127.0.0.1:4175/",
        "http://127.0.0.1:4175/catalogo/",
        "http://127.0.0.1:4175/familias-olfativas/",
        "http://127.0.0.1:4175/produtos/acquare/",
      ],
      numberOfRuns: 3,
      settings: { preset: "desktop", chromeFlags: "--headless --no-sandbox" },
    },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse-desktop" },
  },
};
