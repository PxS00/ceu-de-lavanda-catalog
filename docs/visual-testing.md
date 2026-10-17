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
