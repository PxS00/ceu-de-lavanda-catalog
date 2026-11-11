# Qualidade web — Lighthouse, Playwright e assets

## Execução local

```sh
pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e
node scripts/audit-assets.mjs
pnpm build
pnpm dlx @lhci/cli@0.15.1 autorun --config=.lighthouserc.cjs
pnpm dlx @lhci/cli@0.15.1 autorun --config=.lighthouserc.desktop.cjs
```

O Lighthouse CI usa o HTML exportado em `out/` e um servidor Python na porta 4175, sem `next dev`. São três rodadas por quatro URLs representativas. **A baseline medida está abaixo do alvo de performance de 90**, por isso foram definidos gates conservadores para prevenir regressões graves, além de um aviso não bloqueante de SEO enquanto `noindex` estiver ativo. Não declarar metas alcançadas sem os relatórios. O Lighthouse fornece LCP, CLS e TBT de laboratório; **não mede INP real**. A configuração `.lighthouserc.desktop.cjs` mede duas rotas em desktop em três rodadas, sob demanda; a CI principal prioriza mobile para limitar seu tempo de execução.

A CI registra HTML/JSON do Lighthouse em `artifacts/lighthouse/` e o levantamento de tamanho de imagens em `artifacts/quality/assets.json`. Corrigir primeiro os problemas por evidência e comparar várias rodadas; transformar budgets em gates apenas após calibração e revisão técnica.

## Baseline da CI — 11/11/2026

Execução [#43040819531](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43040819531), `output: export`, Linux/Chromium, Lighthouse mobile simulado, **3 execuções por rota** (medianas arredondadas):

| Rota | Performance | Acessibilidade | Boas práticas | SEO | LCP (lab.) | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home `/` | 76 | 100 | 100 | 69 | 7,49 s | 0,01 |
| Catálogo `/catalogo/` | 75 | 96 | 100 | 69 | 7,82 s | 0 |
| Guia `/familias-olfativas/` | 77 | 100 | 100 | 69 | 6,31 s | 0 |
| Produto `/produtos/acquare/` | 76 | 100 | 100 | 69 | 7,36 s | 0 |

**Limitações importantes:** a auditoria foi feita com `python3 -m http.server`, que **não comprime HTML/JS/CSS** nem aplica headers do Cloudflare. A maior oportunidade listada pelo Lighthouse foi compressão de texto (~2,5–3 segundos estimados); esses ganhos **não devem ser contabilizados como uma otimização a implementar** antes de revalidar a compressão real do Cloudflare Pages. O Lighthouse também encontrou oportunidades de imagens responsivas (~1–2 MiB por página na amostragem) e JavaScript não utilizado. O LCP observado é resultado de laboratório em localhost, não Core Web Vitals de usuários reais.

O **SEO = 69** resulta exclusivamente de `is-crawlable` reprovado: o `noindex` foi intencionalmente preservado até aprovação do lançamento. **Não remover `noindex` para aumentar nota.** O Lighthouse registrou acessibilidade e boas práticas altas, mas não substitui auditoria manual. Antes de definir budgets de performance mais rigorosos, medir também no host real do Cloudflare com compressão e configuração de cache verificadas.

O levantamento de imagens encontrou **53 assets**, total aproximado **9,98 MB** (soma do repositório, não transferência por página), sem arquivos individuais acima de 350 KiB. O maior foi `public/products/aura-rubbra.webp` (335.258 bytes). Reduzir o tráfego por viewport deve priorizar **variantes responsivas e tamanhos de imagem**, não apenas compressão individual.

**Budgets iniciais calibrados:** reprovar apenas regressões graves de performance (<65), acessibilidade (<90) e boas práticas (<95); o alvo de performance ≥90 e o de SEO ≥95 permanecem objetivos futuros, sem confundir a proteção de indexação com erro de SEO. Revisar thresholds após baseline comprimida e repetição em CI.

## Testes end-to-end

A infraestrutura atual do Playwright continua responsável por funcionalidade, fluxos mobile/tablet/desktop e capturas de revisão. `tests/e2e/seo.spec.ts` protege canonical, sitemap, robots e metadados das páginas públicas, enquanto `tests/e2e/accessibility-smoke.spec.ts` cobre estrutura, imagens e salto para o conteúdo. O arquivo `tests/e2e/axe.spec.ts` executa `@axe-core/playwright@4.14.0` com regras WCAG A/AA, anexa o relatório completo em `artifacts/quality/axe-*.json` e **bloqueia violações sérias/críticas**. O contraste do texto secundário sobre o fundo tingido do painel de contato foi ajustado após o Lighthouse apontar 4,41:1 (mínimo WCAG AA de 4,5:1). Demais violações e casos inconclusivos permanecem documentados nos relatórios; a auditoria automatizada não substitui revisão manual com teclado e leitor de tela.

As capturas de `pnpm test:visual` continuam informativas, sem golden snapshots pixel-a-pixel aceitas. Só ativar baselines versionadas quando aprovadas pelo responsável, com amostragem determinística para a vitrine aleatória, mesmo Chromium, fontes e viewport.

`public/_headers` só é aplicado pelo Cloudflare/Wrangler. O servidor Python dos E2E não testa `X-Robots-Tag`. Antes da indexação, executar verificação de headers na prévia Pages e no host definitivo com aprovação, usando `scripts/check-pages.mjs` e `pnpm dlx wrangler@4.151.1 pages dev out`.

## Diagnóstico de CI

`pnpm test:e2e` registra trace/screenshot ao falhar. A CI publica os relatórios como artifacts quando disponíveis. Não alterar snapshots automaticamente para forçar aprovação.

## Validação no Cloudflare Pages

A CI executa em sequência: auditoria local do build exportado, smoke com `wrangler pages dev out`, e, **somente em PRs internos do repositório**, deploy de QA para a branch isolada `quality-pr-N` do Cloudflare Pages. A branch `main` e o site de produção **não são alterados**.

O script `scripts/verify-cloudflare-pages.mjs` valida emulação local e URL real de preview: resposta 200, sitemap sem categorias vazias, páginas de categorias vazias ainda acessíveis com `noindex`, além do header `X-Robots-Tag` (com `noarchive` para confirmar as regras do arquivo `public/_headers`) no host real. O teste local **não** afirma que as regras de hostname se aplicam ao `localhost`.

A prévia real precisa das secrets existentes `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. Se faltarem, o job falha explicitamente; não declarar Cloudflare validado somente porque o servidor Python passou. A CI produz `artifacts/quality/cloudflare-{local,preview}.json` e mede home e catálogo na CDN pelo `.lighthouserc.cloudflare.cjs`, em modo informativo para performance até a baseline de Pages ser aprovada. A URL da prévia é pública, porém protegida por `noindex` no HTML e headers.

**Observação:** o Lighthouse sobre a CDN ainda é laboratório simulado, não INP real nem dados CrUX. Verificar adicionalmente headers, URL canônica, controle de acesso e domínio definitivo antes do lançamento.


## Imagens responsivas no export estático
`pnpm assets:responsive` gera WebP reais de cada foto de produto (400/800px) e do hero (540/960px). `pnpm dev` e `pnpm build` executam Sharp 0.35.5 antes do Next.js 16. Os arquivos gerados são ignorados no Git, reproduzidos no build e publicados no Cloudflare Pages sem serviço de imagem em runtime. Cartões usam `srcset`, `sizes` e `loading=lazy`; hero usa prioridade alta. A página de detalhe preserva a foto original.

A CI valida a entrega de variantes com Playwright e com Cloudflare real (HTTP 200, MIME WebP, e menor transferência que o original). `artifacts/quality/responsive-images.json` registra os bytes de todas as variantes. Compare baseline Lighthouse antes e depois **na CDN Cloudflare**, sem confundir economias potenciais de auditoria com ganhos reais.


### Suítes específicas por projeto

O Playwright usa arquivos `*.desktop.spec.ts`, `*.desktop-tablet.spec.ts` e `*.mobile.spec.ts` com `testIgnore` por projeto. Isso mantém a mesma cobertura executada de antes (**154 cenários efetivos**: os 26 `test.skip` anteriores eram combinações de dispositivos não aplicáveis), sem gerar entradas `skipped` no relatório. Para conferir, executar `pnpm exec playwright test --list` e revisar os cenários por desktop, tablet e mobile. A seleção não desativa testes e não altera a experiência do usuário.
