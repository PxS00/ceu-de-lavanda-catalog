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


## Golden snapshots (issue #31 — preparação)

A suíte de revisão manual (`pnpm test:visual`) continua separada das comparações pixel-a-pixel. A suíte `tests/visual-regression/golden.spec.ts` usa a configuração `playwright.visual.config.ts` e cobre **home, catálogo e detalhe Acquaré** em **Chromium desktop 1440×900 e mobile 390×844**: seis imagens de referência quando aprovadas. Não duplica o framework Playwright nem adiciona `test.skip` à suíte E2E.

A geração é **explícita**, e a baseline não deve ser produzida automaticamente pelo CI:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm build
pnpm test:visual:baseline     # cria/atualiza PNGs de referência: revisar MANUALMENTE
pnpm test:visual:regression   # comparação contra PNGs aprovados
```

A execução usa o export estático existente e o mesmo servidor Playwright da suíte principal. Antes de comparar, fixa `Math.random` para as vitrines, a localidade pt-BR, tema claro, `deviceScaleFactor=1`, movimento reduzido, fontes carregadas, decodificação de imagens e carregamento eager nas fotos lazy. O screenshot é da página inteira, desativa animações e caret, e tem tolerância inicial de **0,5% de pixels diferentes**. Isso não substitui inspeção semântica das fotografias e rótulos.

Os golden PNGs ficam versionados em `tests/visual-regression/__screenshots__/{desktop,mobile}/`. Na primeira execução **ainda não há imagens de referência aprovadas**: `pnpm test:visual:regression` deve falhar até que sejam geradas e revisadas. É deliberado: não aceitar um estado visual desconhecido simplesmente para obter CI verde. **A suíte não entra no gate principal até a aprovação dos seis PNGs.**

Processo de aprovação: gerar no ambiente Linux/Chromium compatível com CI, inspecionar lado a lado frascos/rótulos, legibilidade e enquadramento em 390 e 1440 px, adicionar os seis PNGs ao commit após aprovação, executar `pnpm test:visual:regression` duas vezes e verificar estabilidade. Só então adicionar o comando ao workflow com artifacts de screenshots/diffs em falha. Em mudanças futuras, nunca rodar `--update-snapshots` automaticamente no CI; cada alteração deve ter aprovação visual explícita no PR.

**Limitações conhecidas:** renderização de fontes nativas, versão do Chromium e sistema operacional podem mudar pixels; padronizar ambiente e verificar flakiness antes de usar o gate. A comparação de snapshots não substitui testes nos demais breakpoints (320/375/768) nem navegação por teclado, ambos tratados nas suítes funcionais e na revisão manual.
