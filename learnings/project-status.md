# Project Status

## What's built

### Data layer
- [x] TypeScript types (`src/lib/types.ts`) — Agent, Feature, FeatureCategory, CaniuseSupportCode, etc.
- [x] Data loader (`src/lib/data.ts`) — loads agents, categories, features; merges agents.json version metadata; getFeatureData() for caniuse-style stats
- [x] `data/agents.json` — version metadata with exact timestamps and eras for Claude Code (48 versions) and Codex CLI (35 versions)
- [x] `data/agents/claude.json` — 69 features × 48 versions = 3,312 explicit support cells
- [x] `data/agents/codex.json` — 69 features × 35 versions = 2,415 explicit support cells
- [x] 5 feature definition files (hooks 32, mcp 12, instructions 6, memory 3, tools 16)

### UI
- [x] Astro + Tailwind + TypeScript project scaffold
- [x] Base layout (`src/layouts/Layout.astro`)
- [x] Global CSS with light/dark theme via CSS custom properties
- [x] Index page with search, category index, feature index grid
- [x] Feature detail pages (`/features/[featureId]`) — 69 pages, statically generated
- [x] CiuTable component with time-aligned era grid (global split points)
- [x] Features index page (`/features/index`)

### Design system
- Theme colors defined as CSS custom properties in `src/styles/global.css`
- Support for `prefers-color-scheme: dark`
- Font stack: system sans-serif, serif for headings, monospace for versions
- Header: dark bg `#2a2520`, light text `#f2e8d5`

## What's not built yet

### Data
- [ ] Remaining agents: Cursor, Windsurf, Copilot, Cline, Augment Code, Codex, Amazon Q, JetBrains AI, Devin
- [ ] JSON Schema validation files
- [ ] Validation script (`npm run validate`)

### UI
- [ ] Agent detail pages (`/agents/[slug]`)
- [ ] Changelog page (derived from version data)
- [ ] Interactive filtering (React islands for category filter, search on feature pages)
- [ ] Hover tooltips (currently using native `title` attribute)

### OSS
- [ ] README
- [ ] CONTRIBUTING.md
- [ ] GitHub Actions CI
- [ ] Issue templates
- [ ] License (considering CC BY 4.0 for data, MIT for code — matching caniuse)

## Stack
- Astro 6.x (static site gen)
- TypeScript strict
- Tailwind CSS v4 (via Vite plugin)
- No React islands yet (planned for interactive features)
- Build: ~1 second for 71 pages
