module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:4175/",
        "http://127.0.0.1:4175/catalogo/",
        "http://127.0.0.1:4175/catalogo/perfumes/",
        "http://127.0.0.1:4175/familias-olfativas/",
        "http://127.0.0.1:4175/produtos/acquare/",
      ],
      numberOfRuns: 3,
      startServerCommand: "python3 -u -m http.server 4175 --bind 127.0.0.1 --directory out 2>&1",
      startServerReadyPattern: "Serving HTTP",
      settings: { chromeFlags: "--headless --no-sandbox", formFactor: "mobile", screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false } },
    },
    assert: {
      // Gates conservadores da baseline; SEO segue informativo porque noindex é obrigatório na prévia.
      assertions: {
        "categories:performance": ["error", { minScore: 0.65 }],
        "categories:accessibility": ["error", { minScore: 0.90 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        // Guard observed layout stability (mobile baseline <=0.008; desktop after fix <=0.008).
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "categories:seo": ["warn", { minScore: 0.95 }],
        "is-crawlable": "off", // noindex é deliberado antes do lançamento.
      },
    },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse" },
  },
};
