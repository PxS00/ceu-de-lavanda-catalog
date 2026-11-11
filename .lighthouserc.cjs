module.exports = {
  ci: {
    collect: {
      url: [
        "http://127.0.0.1:4175/",
        "http://127.0.0.1:4175/catalogo/",
        "http://127.0.0.1:4175/familias-olfativas/",
        "http://127.0.0.1:4175/produtos/acquare/",
      ],
      numberOfRuns: 3,
      startServerCommand: "python3 -m http.server 4175 --bind 127.0.0.1 --directory out",
      startServerReadyPattern: "Serving HTTP",
      settings: { chromeFlags: "--headless --no-sandbox", formFactor: "mobile", screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 1, disabled: false } },
    },
    assert: {
      // Baseline inicial: report-only. Não bloquear mudanças por metas sem medições confiáveis.
      assertions: {
        "categories:performance": ["warn", { minScore: 0.90 }],
        "categories:accessibility": ["warn", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.95 }],
        "categories:seo": ["warn", { minScore: 0.95 }],
        "is-crawlable": "off", // noindex é deliberado antes do lançamento.
      },
    },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse" },
  },
};
