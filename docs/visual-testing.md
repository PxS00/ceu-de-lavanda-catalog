# Browser and visual review

Use the existing Playwright Test dependency; do not reinstall it.

```sh
pnpm exec playwright install chromium # only if the matching browser is absent
pnpm test:e2e
pnpm test:visual
```

Both commands run the visual/functional scenarios across Chromium
desktop (1440×900), tablet (768×1024), and mobile (390×844). The visual command
selects scenarios tagged `@visual`. Captures are full-page review images, not
pixel-baseline assertions.

The web server builds the production static export and serves `out/` using Python
3 on loopback port 4173. Python 3, pnpm, Chromium and its native system libraries
must be available. An existing server at that address is reused locally; rebuild
and restart it after changing source. CI always starts its own server.

Generated files are ignored by Git:

- `artifacts/visual-review/report.md`: per-test results, screenshot links and failures.
- `artifacts/visual-review/screenshots/`: stable viewport/page filenames, overwritten on rerun.
- `artifacts/visual-review/test-results/`: failed-test screenshots and traces.

The shared fixture fails tests on console errors, uncaught browser exceptions,
failed requests (except navigation cancellation), and HTTP errors. Review checkpoints
also assert decoded images and no horizontal document overflow. Native Playwright
navigation assertions cover catalog/product/category links and the header.
`composition.spec.ts` checks a single heading, early results, all category links,
44px touch targets, keyboard focus through the controls and no horizontal overflow
on the catalog and each category page at all three viewport sizes.

Reduced motion is enabled for repeatable captures. Open screenshots for visual
approval; these checks do not replace a full accessibility audit or motion review.
`motion.spec.ts` explicitly enables motion to verify the 3% photo-only zoom,
static placeholders, arrow focus, one-time card entry and immediate filter fade.
It also checks keyboard activation, navigation with a single touch, and disabling
motion both on initial load and while the page is open. Its raster image is
generated only inside the temporary test export; production retains placeholders.
The eight verified products do not activate pagination, so production checks
assert that pagination stays hidden. Category registration fallbacks are expected.

`pnpm test:e2e` also tests a separate static export with 101 synthetic products
(90 perfumes, 10 body splashes and one hair perfume) on loopback port 4174.
`tests/fixtures/serve-catalog.mjs` copies the app into a temporary directory,
replaces only that copy's data, builds it with Webpack and removes it on exit.
Production source data and `out/` are never replaced. No extra dependency is needed.
These tests visit all nine pages, check pagination boundaries and page resets,
combine categories and initials, search Portuguese accents, sort, show empty
results and reset filters while retaining the selected category. They run at
all three viewport sizes and capture populated catalog layouts. The fixture
server also starts for visual-only runs, but scalability scenarios are untagged.
Python's static server does not emulate Cloudflare response headers or its custom
404 handling; existing security/dependency policies remain unchanged.

On this development machine Chromium required a locally available ALSA library
via `LD_LIBRARY_PATH`; no machine-specific path is part of the configuration.
For a fresh Linux environment, provision the native libraries described by
`pnpm exec playwright install-deps chromium` through your normal system setup.


## Regressão visual com golden snapshots — issue #31

A suíte de revisão manual (`pnpm test:visual`) permanece independente da regressão pixel-a-pixel. A suíte `tests/visual-regression/golden.spec.ts`, configurada em `playwright.visual.config.ts`, compara **seis PNGs versionados** (home, catálogo e detalhe Acquaré × Chromium desktop 1440×900 / mobile 390×844).

### Evidências e baseline adotada

- Baselines geradas no Ubuntu/Chromium pelo [GitHub Actions #43080210162](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43080210162), com **seis imagens e duas execuções consecutivas de comparação aprovadas**, após estabilização da seleção da vitrine e decodificação das imagens.
- Artifact `visual-baselines-candidates-43080210162` recuperado, seis hashes SHA-256 verificados antes de versionar em `tests/visual-regression/__screenshots__/{desktop,mobile}/`.
- As capturas foram adotadas como **baseline técnica inicial**; isso não equivale à aprovação editorial final da marca, fotografias e rótulos. Eventuais alterações de identidade visual seguem exigindo revisão explícita.
- A validação principal do PR executa `pnpm test:visual:regression` após `pnpm test:e2e`. Falhas produzem screenshots esperados/recebidos/diffs e traces em `artifacts/visual-review/`, enviados como artifacts por 7 dias.

### Comandos de manutenção

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium --only-shell
pnpm build
pnpm test:visual:regression          # CI e verificação local: nunca altera os PNGs
pnpm test:visual:baseline            # SOMENTE após decisão de mudar a baseline
```

A geração de novas referências é **manual**, não ocorre automaticamente para tornar um teste verde. Para alterar snapshots, produzir as capturas em Ubuntu/Chromium equivalente à CI, examinar expected/actual/diff e conteúdo dos rótulos, rever a mudança no PR e só então atualizar os PNGs. A tolerância inicial é **0,5%** de pixels distintos; não aumentá-la para ocultar regressões.

A suíte fixa `Math.random` no navegador e aguarda `data-selection-ready=true` na home; as recomendações do detalhe são embaralhadas com PRNG estável derivado do slug do perfume (independente do build), preservando a injeção de aleatoriedade nos testes unitários. força carregamento eager das imagens lazy, verifica `complete`, dimensões naturais e `currentSrc`, decodifica as imagens, espera fontes e desativa movimento/caret. Usa `pt-BR`, tema claro, DPR=1 e somente o servidor do export estático na porta 4173: não inicia o fixture sintético da porta 4174.

**Limitações:** imagens pixel-a-pixel não substituem auditoria manual de teclado/leitor de tela nem os testes de responsividade em 320/375/768. Manter versões do Chromium e fontes no runner alinhadas ao ambiente em que os PNGs foram gerados, investigar diferenças de fonte/SO antes de refazer baselines.

### Correção da flutuação nas recomendações

O primeiro gate completo revelou **4/6 snapshots passando** e diferenças apenas no detalhe Acquaré (desktop 8%, mobile 7%), porque `recommendProducts()` utilizava `Math.random` em renderização estática. A regra agora usa PRNG com seed do slug do produto; a priorização de família olfativa permanece, e a função `random` continua injetável para testes. No [workflow #43084176245](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43084176245) os seis snapshots passaram em duas comparações consecutivas. **Somente os dois PNGs de Acquaré foram alterados**; os outros quatro mantiveram os mesmos hashes. A promoção desses PNGs ocorreu com verificação SHA-256 pelo [workflow #43084603788](https://github.com/PxS00/ceu-de-lavanda-catalog/actions/runs/43084603788). O gate principal da CI deve ser avaliado novamente no head final, não apenas pela suíte isolada.


## Teclado e foco — issue #31

A jornada automatizada usa **teclas reais** no Chromium (Tab, Enter, Escape), sem chamar `Locator.focus()` para saltar controles. O arquivo `tests/e2e/keyboard-journey.spec.ts` percorre catálogo → campo de busca → seleção de Acquaré → detalhes → botão do carrossel de relacionados, validando foco visível, ordem dos filtros, navegação e rolagem por teclado em desktop/tablet/mobile. O arquivo `tests/e2e/keyboard-menu.mobile.spec.ts` confirma no mobile: skip link como primeiro foco, botão de menu alcançável por Tab, abertura por Enter, fechamento por Escape, devolução do foco ao acionador e navegação por links do diálogo com Tab/Enter. Os relatórios anexados à CI incluem uma trilha curta de foco por cenário.

Rodar após o build: 

```sh
pnpm build
pnpm exec playwright test tests/e2e/keyboard-journey.spec.ts tests/e2e/keyboard-menu.mobile.spec.ts
```

**Revisão manual complementar — ainda obrigatória:** testar no navegador com teclado real (sem mouse) em 390 px e 1440 px: (1) Tab inicial revela o link “Pular para o conteúdo” e Enter alcança o conteúdo; (2) links e botões apresentam indicador de foco claramente perceptível; (3) menu móvel abre por Enter, prende foco dentro do diálogo e Escape devolve ao acionador; (4) busca por nome, ordenação, filtros, seleção do produto e carrossel funcionam só com teclado; (5) Shift+Tab percorre o caminho inverso sem armadilhas; (6) zoom a 200% e leitura por leitor de tela (nome, papel e estado de controles). Documentar responsável, navegador/sistema, data, evidências e qualquer exceção. **Os testes automatizados não equivalem a essa aprovação manual** e não permitem marcar o critério manual como concluído por si só.
