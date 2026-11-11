# Revisão de aceite — issues #28–#31 (PR #32)

Data: 11/11/2026. Branch `feat/quality-seo-lighthouse-playwright` → `develop`, PR [#32](https://github.com/PxS00/ceu-de-lavanda-catalog/pull/32) **draft**. Este documento separa trabalho técnico comprovado, pendências editoriais/de lançamento e critérios ainda não integralmente demonstrados. Não autoriza merge ou indexação.

## Evidências técnicas

- [CI #43086884865](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43086884865): **167 Playwright E2E e 6 golden snapshots**, lint, TypeScript, testes, build, Lighthouse, Cloudflare Pages QA e Lighthouse CDN aprovados antes dos ajustes finais de performance.
- [Auditoria mobile e fontes/bundles](./performance-audit-2026-11-11.md): Cloudflare home e catálogo em 2 execuções, localhost em 3; fonte/JS/CLS/TBT documentados sem confundir ambientes.
- Desktop Lighthouse (4 rotas × 3 medições): [antes #43089654403](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43089654403) e [depois da correção de CLS #43090709689](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43090709689); guia `CLS 0,311 → 0,008`, Performance `82 → 97`.
- `scripts/summarize-lighthouse.mjs` adiciona resumos de mediana, amplitudes, LCP, CLS, TBT e payload por rota/ambiente a `artifacts/quality/lighthouse-summary.{json,md}`; seu resultado só deve ser declarado validado após execução no pipeline final.
- Fonte e licenciamento: `src/shared/fonts/typography.ts`, `public/branding/licenses/*-OFL.txt` e testes de hash em `tests/brand.test.mjs`.
- Testes visual/teclado: [docs/visual-testing.md](./visual-testing.md). O workflow principal compara baselines aprovadas; não atualiza referências automaticamente.

## Matriz de aceite

| Issue | Implementação com evidência | Pendências reais / momento correto |
| --- | --- | --- |
| [#28 — Lighthouse CI](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/28) | Build/export estático; quatro rotas mobile × 3 medições; quatro desktop × 3 (workflow sob demanda); duas rotas na CDN × 2; artifacts; budgets conservadores para Performance/A11y/Boas práticas; `CLS <= 0,1` agora bloqueante; `noindex` preservado | Validar estabilidade do novo gate em mais ciclos; metas futuras de LCP e score só após amostra adequada na CDN; registrar exceções/planos para casos fora da meta sem afrouxar checks |
| [#29 — SEO técnico](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/29) | Metadata por rota, canonical, OG/Twitter, JSON-LD sem dados inventados, sitemap sem categorias vazias, robots/noindex verificados com Wrangler/Cloudflare QA, Playwright SEO | Confirmar comportamento real de 404/metadata, cobertura de todos os hosts `*.pages.dev` inclusive host principal; aceitar domínio canônico quando definido; revisar previews sociais e Google Search Console apenas no lançamento |
| [#30 — Performance](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/30) | 96 variantes WebP estáticas, `srcset`/dimensões, testes de decodificação/bytes e Cloudflare; duas fontes locais OFL com `display:swap` e fallbacks; baixo TBT CDN; CLS do guia corrigido e comparado antes/depois; golden visual | Aceite editorial de fotos/rótulos; avaliar separadamente a imagem LCP do guia marcada `lazy` sem impor tráfego extra mobile; ampliar evidências de LCP para outras rotas na CDN e eventualmente medir INP real quando houver tráfego |
| [#31 — Playwright](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/31) | 167 E2E + 6 golden no último workflow concluído antes da auditoria, axe bloqueante sérias/críticas, testes de SEO e Cloudflare, rastros/artefatos com retenção 7 dias, jornada Tab/Enter/Escape automatizada, tamanhos 320/375/390/768/1440 cobertos em suítes complementares | Aceite humano documentado com teclado físico, `Shift+Tab`, zoom 200%, leitor de tela e revisão editorial; não declarar conformidade completa por axe/Playwright |

## Critérios de promoção

1. CI **do HEAD final** verde (lint, TypeScript, unitários, export, E2E, golden, Lighthouse e QA da CDN), incluindo os novos testes e o gate de CLS. Não utilizar aprovação antiga para validar commits posteriores.
2. Inspeção manual de acessibilidade e editorial com registro de navegador, dispositivo, data, responsável e defeitos encontrados; ausência de regressões visuais inaceitáveis.
3. Problemas de SEO dependentes do domínio e da indexação permanecem condicionados ao lançamento aprovado; **nenhum `noindex` deve ser removido automaticamente** por integrar `develop`.
4. Issues permanecem abertas até o fluxo de validação e promoção para `main`; não fechar com base apenas em status de CI. PR permanece draft até decisão humana de readiness.

**Decisão atual:** a maior parte da implementação técnica está pronta; restam itens de validação e lançamento. Não propor refatoração de hydration nem mudar fontes apenas por bytes estimados sem comparação A/B e evidência de benefício.
