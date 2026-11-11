# Auditoria de fontes, bundles e Core Web Vitals — 11/11/2026

**Escopo:** issue [#30](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/30), PR [#32](https://github.com/PxS00/ceu-de-lavanda-catalog/pull/32). Dados de laboratório da [CI #43086884865](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43086884865), sobre **Next.js 16 com `output: export`**, sem alterações no código comercial. Relatórios brutos: artifact `quality-report-43086884865`.

## Baseline mobile: Cloudflare Pages QA (com compressão)

Duas medições Lighthouse por rota; mediana entre duas execuções. O Cloudflare foi testado em URL isolada `*.pages.dev`, mantendo `noindex`.

| Métrica | Home | Catálogo |
| --- | ---: | ---: |
| Performance / 100 | 96 (93–99) | 95,5 (94–97) |
| LCP de laboratório | 2.723 ms (2.245–3.201) | 2.833 ms (2.586–3.079) |
| CLS | 0,008 | 0 |
| TBT | 36 ms | 31,5 ms |
| JavaScript transferido | ~177 KiB | ~179 KiB |
| CSS transferido | ~10 KiB | ~10 KiB |
| Fontes transferidas | ~62 KiB | ~62 KiB |
| JS não utilizado (estimativa Lighthouse) | ~26 KiB | ~29 KiB |

LCP identificado: **imagem do hero** na home; **logo do cabeçalho** no catálogo. O resultado continua sendo Lighthouse com throttling simulado, **não dados de Core Web Vitals de campo**, e duas rodadas ainda apresentam variabilidade (especialmente LCP). **Não declarar INP real**, economia após alterações inexistentes nem garantia de meta LCP < 2,5 s.

## Baseline mobile local: servidor Python (sem compressão)

Três execuções por rota (mesma CI, outro ambiente); **não comparar como antes/depois** da CDN:

| Rota | Perf. (mediana) | LCP | CLS | TBT | JS transferido |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 76 | 7.074 ms | ~0,008 | 26 ms | ~598 KiB |
| `/catalogo/` | 76 | 7.106 ms | 0 | 39 ms | ~601 KiB |
| `/familias-olfativas/` | 78 | 6.047 ms | 0 | 34 ms | ~592 KiB |
| `/produtos/acquare/` | 78 | 6.104 ms | 0 | 25 ms | ~601 KiB |

O servidor Python não usa Brotli/Gzip, não aplica os headers Pages nem replica completamente o cache da CDN. Portanto, a diferença nos bytes de JS **não é uma redução resultante de uma refatoração**: são condições distintas de entrega.

## Fontes: achados e decisão

- `src/shared/fonts/typography.ts` usa duas famílias `next/font/local`: **Cormorant Garamond**, WOFF2 22.876 B, e **Pinyon Script**, WOFF2 39.044 B. Um único peso 400 para cada família; sem download de fontes em runtime a partir de terceiros.
- Ambas usam `display: "swap"`, fallbacks e `adjustFontFallback: "Times New Roman"`. Preload padrão de `next/font` ocorre no root layout; as duas famílias têm uso editorial efetivo. Lighthouse `font-display` recebeu score **1**, e a amostragem mostrou CLS entre 0 e 0,008.
- As licenças **SIL Open Font License 1.1 já estão presentes** em `public/branding/licenses/{cormorant-garamond,pinyon-script}-OFL.txt`. `tests/brand.test.mjs` exige licenças e verifica o SHA-256 dos dois arquivos de fonte. O arquivo de marca Ivy permanece **fora do bundle público** por ausência de licença de webfont.
- **Decisão:** não alterar `font-display`, `preload`, família, peso ou métricas sem um experimento reproduzível que demonstre benefício. Especialmente `preload:false` no Pinyon poderia reduzir uma requisição em rota sem uso, mas atrasar o hero/cabeçalho nas rotas que dependem da fonte.

Fontes externas para conferir a licença e configuração: [projeto Cormorant](https://github.com/CatharsisFonts/Cormorant), [projeto Pinyon](https://github.com/SorkinType/Pinyon), [referência oficial Next.js](https://nextjs.org/docs/app/api-reference/components/font). A verificação de integridade no projeto é mais específica que a licença genérica da família.

## Bundles e hidratação: achados e decisão

- Na CDN, o total transferido de **scripts é ~177–179 KiB**, CSS ~10 KiB. O Lighthouse estimou 26–29 KiB de JavaScript potencialmente não utilizado, mas o TBT mediano ficou em **31–36 ms**. Esses números não justificam por si só extrair componentes cliente ou substituir a arquitetura de hidratação.
- O catálogo precisa de estado no cliente para busca, filtros, ordenação, paginação e menu; o detalhe usa carrossel interativo. Isolar ou remover esses estados sem ganho medido aumentaria o risco de regressões nos **167 testes Playwright e seis golden snapshots** já aprovados.
- O `resource-summary` inclui custo do runtime React/Next.js. Não comparar bytes transferidos em Brotli com tamanhos não comprimidos de chunks em disco; não atribuir esses bytes integralmente ao código escrito para o catálogo.
- **Decisão:** manter os boundaries atuais; implementar observabilidade e repetir a mesma medição após mudanças futuras. Se o TBT/INP real, LCP ou bytes aumentarem, identificar chunks específicos com análise de bundles antes de alterar imports/hidratação.

## Instrumentação e acompanhamento

A partir desta auditoria, `scripts/summarize-lighthouse.mjs` consolida todos os `*.report.json` de `artifacts/lighthouse/` e `artifacts/lighthouse-cloudflare/` por **ambiente e rota**, incluindo mediana, amplitude de LCP, TBT, CLS, LCP selector, bytes transferidos de JS/CSS/fontes e estimativa de JS não utilizado. A CI gera `artifacts/quality/lighthouse-summary.{json,md}` mesmo quando não há relatório de uma etapa anterior; não introduz thresholds novos nem atualiza screenshots.

**Próximas decisões fundamentadas:** (1) completar baseline desktop de quatro rotas em Linux (workflow `lighthouse-desktop.yml`, manual após a primeira execução); (2) acompanhar variabilidade de LCP e comparar múltiplos runs reais Cloudflare por commit; (3) avaliar INP de campo somente após tráfego real e política de privacidade adequada; (4) rever budgets da #28 após amostras suficientes. O Lighthouse atual não prova aprovação editorial da qualidade dos frascos e rótulos.


## Baseline desktop e correção de CLS (mesmo ambiente, 3 execuções por rota)

Execuções Linux/Chromium, mesmo Lighthouse desktop e servidor exportado, imediatamente antes e depois do commit [`ea0f9c5`](https://github.com/PxS00/ceu-de-lavanda-catalog/commit/ea0f9c54b03bfa3d86e00018e0f0897b03347ff2). Comparação medida, não estimada:

| Rota | Perf. antes → depois | CLS antes → depois | LCP antes → depois | TBT |
| --- | --- | --- | --- | --- |
| `/` | 96 → 96 | 0 → 0 | 1.352 → 1.356 ms | 0 ms |
| `/catalogo/` | 97 → 97 | 0 → 0 | 1.296 → 1.296 ms | 0 ms |
| `/familias-olfativas/` | **82 → 97** | **0,311 → 0,008** | 1.215 → 1.214 ms | 0 ms |
| `/produtos/acquare/` | 97 → 97 | 0 → 0 | 1.278 → 1.277 ms | 0 ms |

- Antes: [workflow #43089654403](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43089654403), artifact `lighthouse-desktop-43089654403`.
- Depois: [workflow #43090709689](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43090709689), artifact `lighthouse-desktop-43090709689`.
- O problema foi uma alteração tardia da altura `#notas-olfativas` após `useEffect` adicionar `.is-scroll-ready`. O guia seguinte deslocava ~0,31 de CLS. A altura da seção e da cena agora é reservada por media query antes da hidratação em desktop/tablet com movimento permitido. A preferência `prefers-reduced-motion` e o layout mobile permanecem intactos.
- Proteção adicional: teste `olfactory-story.desktop-tablet.spec.ts` compara a geometria do export sem JavaScript com a geometria após hidratação nos projetos desktop e tablet. Um gate Lighthouse `cumulative-layout-shift <= 0.1` evita regressões significativas, sem reduzir as exigências existentes.
- Limitação: esses números são **desktop local**; não são métricas reais de usuários nem valores diretamente comparáveis à CDN mobile. A amostragem de três medições não elimina toda variabilidade.

### Próximo achado distinto — imagem LCP do guia em desktop

O Lighthouse desktop também classificou a imagem `/campaigns/olfactory-pump-plate.webp` como LCP com `loading="lazy"`. Esse risco deve ser tratado em uma alteração separada, com uma estratégia que **não obrigue o mobile a baixar** uma imagem que sua versão responsiva não utiliza. Não aplicar `priority` globalmente sem medir o custo nas duas resoluções. O LCP desktop observado (~1,21 s) não justifica uma mudança potencialmente regressiva sem benchmark da CDN.
