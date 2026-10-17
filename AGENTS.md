<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Maintainable components and styles

- Prefer cohesive source files of roughly 150 lines or fewer; split by responsibility, not by arbitrary line counts.
- Use one feature-first structure: `src/app/` owns routing, metadata and page composition; `src/features/<feature>/` owns feature UI, styles and domain data; `src/shared/` owns reusable components, styles and fonts.
- Do not add parallel top-level `components`, `styles`, `lib` or `data` folders in `src`. Features may depend on shared code; shared code must not depend on features.
- Keep `src/app/globals.css` as the ordered stylesheet entry point, with responsive rules alongside the styles they modify.
