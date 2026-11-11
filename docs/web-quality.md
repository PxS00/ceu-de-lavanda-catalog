# Qualidade web — Lighthouse, Playwright e assets

## Execução local

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
node scripts/audit-assets.mjs
pnpm build
pnpm dlx @lhci/cli@0.15.1 autorun --config=.lighthouserc.cjs
```

O Lighthouse CI usa o HTML exportado em `out/` e um servidor Python na porta 4175, sem `next dev`. São três rodadas por quatro URLs representativas. **As pontuações de configuração são metas informativas (`warn`) até que seja revisada a baseline obtida na CI**; não declarar metas atingidas sem os relatórios. O Lighthouse fornece LCP, CLS e TBT de laboratório; **não mede INP real**. Desempenho desktop pode ser aferido separadamente com o preset desktop após o baseline mobile.

A CI registra HTML/JSON do Lighthouse em `artifacts/lighthouse/` e o levantamento de tamanho de imagens em `artifacts/quality/assets.json`. Corrigir primeiro os problemas por evidência e comparar várias rodadas; transformar budgets em gates apenas após calibração e revisão técnica.

## Testes end-to-end

A infraestrutura atual do Playwright continua responsável por funcionalidade, fluxos mobile/tablet/desktop e capturas de revisão. `tests/e2e/seo.spec.ts` protege canonical, sitemap, robots e metadados das páginas públicas, enquanto `tests/e2e/accessibility-smoke.spec.ts` cobre estrutura, imagens e salto para o conteúdo. O arquivo `tests/e2e/axe.spec.ts` executa `@axe-core/playwright@4.14.0` com regras WCAG A/AA, anexa violações sérias/críticas ao relatório e bloqueia violações críticas. As sérias permanecem registradas até triagem e definição de baseline; a auditoria automatizada não substitui revisão manual com teclado e leitor de tela.

As capturas de `pnpm test:visual` continuam informativas, sem golden snapshots pixel-a-pixel aceitas. Só ativar baselines versionadas quando aprovadas pelo responsável, com amostragem determinística para a vitrine aleatória, mesmo Chromium, fontes e viewport.

`public/_headers` só é aplicado pelo Cloudflare/Wrangler. O servidor Python dos E2E não testa `X-Robots-Tag`. Antes da indexação, executar verificação de headers na prévia Pages e no host definitivo com aprovação, usando `scripts/check-pages.mjs` e `pnpm dlx wrangler@4.151.1 pages dev out`.

## Diagnóstico de CI

`pnpm test:e2e` registra trace/screenshot ao falhar. A CI publica os relatórios como artifacts quando disponíveis. Não alterar snapshots automaticamente para forçar aprovação.
