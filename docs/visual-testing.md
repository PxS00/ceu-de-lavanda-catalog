# Browser and visual review

Use the existing Playwright Test dependency; do not reinstall it.

```sh
pnpm exec playwright install chromium # only if the matching browser is absent
pnpm test:e2e
pnpm test:visual
```

Both commands currently run the four visual/functional scenarios across Chromium
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

Reduced motion is enabled for repeatable captures. Open screenshots for visual
approval; these checks do not replace a full accessibility audit or motion review.
The eight verified products do not activate pagination, so the browser suite
checks that pagination stays hidden. Category registration fallbacks are expected.
Python's static server does not emulate Cloudflare response headers or its custom
404 handling; existing security/dependency policies remain unchanged.

On this development machine Chromium required a locally available ALSA library
via `LD_LIBRARY_PATH`; no machine-specific path is part of the configuration.
For a fresh Linux environment, provision the native libraries described by
`pnpm exec playwright install-deps chromium` through your normal system setup.
