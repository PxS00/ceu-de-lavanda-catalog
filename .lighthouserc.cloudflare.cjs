/* eslint-disable @typescript-eslint/no-require-imports -- Configuração CommonJS do Lighthouse CI. */
const base = require("./.lighthouserc.cjs");
const origin = process.env.CF_PREVIEW_URL;
if (!origin) throw new Error("CF_PREVIEW_URL não configurada para a auditoria da prévia.");
const collect = { ...base.ci.collect };
delete collect.startServerCommand;
delete collect.startServerReadyPattern;
module.exports = {
  ci: {
    ...base.ci,
    collect: {
      ...collect,
      url: [origin + "/", origin + "/catalogo/"],
      numberOfRuns: 2,
    },
    assert: {
      assertions: {
        ...base.ci.assert.assertions,
        "categories:performance": ["warn", { minScore: 0.90 }],
      },
    },
    upload: { target: "filesystem", outputDir: "artifacts/lighthouse-cloudflare" },
  },
};
