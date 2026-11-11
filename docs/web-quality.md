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

As capturas de `pnpm test:visual` continuam informativas. A suíte de golden snapshots foi preparada em `tests/visual-regression/` (home, catálogo e detalhe, mobile/desktop), com geração e verificação por comandos explícitos; **ainda não existem PNGs de referência aprovados**. Não incluir a regressão visual no gate de CI até gerar, inspecionar e versionar seis baselines reproduzíveis. Veja `docs/visual-testing.md` para o protocolo de aprovação.

`public/_headers` só é aplicado pelo Cloudflare/Wrangler. O servidor Python dos E2E não testa `X-Robots-Tag`. Antes da indexação, executar verificação de headers na prévia Pages e no host definitivo com aprovação, usando `scripts/check-pages.mjs` e `pnpm dlx wrangler@4.151.1 pages dev out`.

## Diagnóstico de CI

`pnpm test:e2e` registra trace/screenshot ao falhar. A CI publica os relatórios como artifacts quando disponíveis. Não alterar snapshots automaticamente para forçar aprovação.

## Validação no Cloudflare Pages

A CI executa em sequência: auditoria local do build exportado, smoke com `wrangler pages dev out`, e, **somente em PRs internos do repositório**, deploy de QA para a branch isolada `quality-pr-N` do Cloudflare Pages. A branch `main` e o site de produção **não são alterados**.

O script `scripts/verify-cloudflare-pages.mjs` valida emulação local e URL real de preview: resposta 200, sitemap sem categorias vazias, páginas de categorias vazias ainda acessíveis com `noindex`, além do header `X-Robots-Tag` (com `noarchive` para confirmar as regras do arquivo `public/_headers`) no host real. **A prévia real também reprova canonicals que apontem para a própria prévia ou para o caminho errado, ausência de `noindex` nas páginas amostradas (home, catálogo, produto e categorias vazias) e falta de compressão Brotli/Gzip em JavaScript.** O relatório inclui rota, canonical e cabeçalhos observados. O teste local **não** afirma que as regras de hostname se aplicam ao `localhost`.

A prévia real precisa das secrets existentes `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID`. Se faltarem, o job falha explicitamente; não declarar Cloudflare validado somente porque o servidor Python passou. A CI produz `artifacts/quality/cloudflare-{local,preview}.json` e mede home e catálogo na CDN pelo `.lighthouserc.cloudflare.cjs`, em modo informativo para performance até a baseline de Pages ser aprovada. A URL da prévia é pública, porém protegida por `noindex` no HTML e headers.

**Observação:** o Lighthouse sobre a CDN ainda é laboratório simulado, não INP real nem dados CrUX. Verificar adicionalmente headers, URL canônica, controle de acesso e domínio definitivo antes do lançamento.


## Imagens responsivas no export estático
`pnpm assets:responsive` gera WebP reais de cada foto de produto (400/800px) e do hero (540/960px). `pnpm dev` e `pnpm build` executam Sharp 0.35.5 antes do Next.js 16. Os arquivos gerados são ignorados no Git, reproduzidos no build e publicados no Cloudflare Pages sem serviço de imagem em runtime. Cartões usam `srcset`, `sizes` e `loading=lazy`; hero usa prioridade alta. A página de detalhe utiliza variantes responsivas em celulares até 760 px e preserva a foto original em desktop/tablet.

A CI valida a entrega de variantes com Playwright e com Cloudflare real (HTTP 200, MIME WebP, e menor transferência que o original). `artifacts/quality/responsive-images.json` registra os bytes de todas as variantes. Compare baseline Lighthouse antes e depois **na CDN Cloudflare**, sem confundir economias potenciais de auditoria com ganhos reais.


### Suítes específicas por projeto

O Playwright usa arquivos `*.desktop.spec.ts`, `*.desktop-tablet.spec.ts` e `*.mobile.spec.ts` com `testIgnore` por projeto. Isso mantém a mesma cobertura executada de antes (sem reduzir a cobertura efetiva: os 26 `test.skip` anteriores eram combinações de dispositivos não aplicáveis; a quantidade de casos varia conforme novas suítes são adicionadas), sem gerar entradas `skipped` no relatório. Para conferir, executar `pnpm exec playwright test --list` e revisar os cenários por desktop, tablet e mobile. A seleção não desativa testes e não altera a experiência do usuário.

### Fotografia do detalhe por viewport

O detalhe do perfume mantém a imagem original em desktop/tablet e usa a variante WebP de 400/800 px em celulares de até 760 px, com `<picture>`, `srcset` e prioridade alta de carregamento. A fotografia permanece nítida nos displays maiores, enquanto no mobile a transferência é reduzida. `tests/e2e/responsive-images.spec.ts` verifica `currentSrc`, decodificação, formato, presença da imagem e ausência de overflow em todos os projetos Playwright. Para o cenário mobile, compara os bytes efetivamente selecionados com o arquivo original; a CI do Cloudflare verifica separadamente as variantes 400/800 px e registra ambas em `cloudflare-preview.json`. A avaliação visual ainda precisa da aprovação final do responsável antes do merge; evitar usar somente notas Lighthouse para julgar a fidelidade dos rótulos.


## Rastreabilidade do PR #32 — auditoria em 11/11/2026

Este registro distingue **implementação comprovada**, **validação ainda necessária** e **atividades pós-lançamento**. Issues #28–#31 permanecem abertas até validação e promoção para `main`; este PR é draft para `develop`. Não confundir uma execução verde na CI com aprovação visual ou Core Web Vitals de campo.

### Issue #30 — evidências da etapa de imagens responsivas

- Commits: [`63ab8be`](https://github.com/PxS00/ceu-de-lavanda-catalog/commit/63ab8be0fc77292e2aef4f8c2299af4358396fb0) (detalhe mobile) e [`c6fbdd3`](https://github.com/PxS00/ceu-de-lavanda-catalog/commit/c6fbdd373684a86b2c13169a0d03c866a9353283) (assertions no navegador e CDN).
- O build gera **96 variantes WebP**: 47 produtos × 2 larguras (400/800 px) mais hero × 2 (540/960 px). Nada depende de transformação de imagens em runtime.
- No detalhe, `<picture>` permite variante mobile até 760 px; desktop/tablet conservam a foto original. Testes conferem `currentSrc`, `decode()`, MIME, integridade, ausência de overflow e economia de bytes da variante selecionada.
- **Exemplo amostrado no Cloudflare Pages QA** (`https://a96945e6.ceu-de-lavanda.pages.dev`): Acquaré original **165.382 B**; WebP 400 px **40.912 B** (−75,3%, ou −124.470 B); WebP 800 px **98.804 B** (−40,3%, ou −66.578 B). Economia por arquivo, dependente de viewport/DPR, **não** economia global de tráfego nem ganho de LCP comprovado.
- [CI #43073381656](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43073381656): 163 Playwright aprovados, 0 skips, 0 falhas; lint, TypeScript, testes, export, auditorias locais, QA Cloudflare e Lighthouse na CDN aprovados. Não houve regressão bloqueante reportada; não existe experimento A/B de LCP de campo.

**Pendente na #30:** aprovação manual da fidelidade dos frascos e rótulos em mobile/desktop; comparação visual versionada; auditoria conclusiva de fontes/licenciamento/fallback e de bundles/hidratação baseada em medidas; consolidar LCP/CLS/TBT por rota e dispositivo antes/depois, com eventual instrumentação de INP **real** apenas quando houver tráfego e condições apropriadas. Não marcar esses itens como resolvidos por efeito colateral dos testes de imagem.

### Revisão cruzada dos critérios das issues

| Issue | Já evidenciado | Ainda não comprovado integralmente / depende de decisão |
| --- | --- | --- |
| [#28](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/28) Lighthouse | Export estático; 4 rotas × 3 medições mobile na CI; perfil desktop separado; relatórios e gates conservadores; teste real na CDN com Brotli | Consolidar baseline desktop e limites finais por métrica/ambiente, confirmar tolerância a flakiness e registrar plano para resultados abaixo das metas |
| [#29](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/29) SEO | Canonical/metadados/JSON-LD/sitemap; exclusão de categorias vazias; noindex e header Cloudflare verificados em QA | Validar especificamente metadata/404 e todas as URLs/hosts relevantes; aprovação do domínio canônico e do compartilhamento social apenas na fase de lançamento; preservar noindex até autorização |
| [#30](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/30) Performance | 96 imagens WebP responsivas, prioridade/decodificação e redução de bytes na CDN; E2E e Lighthouse sem regressões bloqueantes | Aprovação visual e baselines comparativas; verificação específica de fontes, bundles, CLS/LCP por rota e interação; métricas reais somente após tráfego |
| [#31](https://github.com/PxS00/ceu-de-lavanda-catalog/issues/31) E2E | 163 testes aprovados sem skips; SEO; axe com bloqueio de violações sérias/críticas; Wrangler e Pages QA; artifacts | Pelo menos uma jornada manual de teclado/foco documentada; baselines golden determinísticas versionadas com aprovação; verificar cobertura explícita de 320/375/390/768/1440 e política de retenção de artifacts |

**Ordem recomendada:** (1) aprovação visual e golden snapshots; (2) verificação pontual de fontes, bundles, teclado e dispositivos; (3) consolidar budgets Lighthouse e critérios de SEO/404; (4) somente após validação completa, decidir readiness do PR e promoção. Não remover `noindex`, não fazer merge automático e não fechar issues antes de `main`.
