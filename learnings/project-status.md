# Project Status

## What's built

### Data layer
- [x] TypeScript types (`src/lib/types.ts`) — Agent, Feature, FeatureCategory, CaniuseSupportCode, etc.
- [x] Data loader (`src/lib/data.ts`) — loads agents, categories, features; merges agents.json version metadata; getFeatureData() for caniuse-style stats
- [x] `data/agents.json` — stable, feature-changing release milestones for five tracked agents
- [x] Explicit version-by-feature support matrices for Claude Code, Codex CLI, Cursor, GitHub Copilot CLI, and Cline CLI
- [x] 5 feature definition files (hooks 10, MCP 12, instructions 6, memory 3, tools 16)
- [x] Data validation for version completeness, support codes, dates, eras, and feature coverage

### UI
- [x] Astro + Tailwind + TypeScript project scaffold
- [x] Base layout (`src/layouts/Layout.astro`)
- [x] Global CSS with light/dark theme via CSS custom properties
- [x] Index page with search, category index, feature index grid
- [x] Feature detail pages (`/features/[featureId]`) — 47 pages, statically generated
- [x] CiuTable component with time-aligned era grid (global split points)
- [x] Features index page (`/features/index`)

### Design system
- Theme colors defined as CSS custom properties in `src/styles/global.css`
- Support for `prefers-color-scheme: dark`
- Font stack: system sans-serif, serif for headings, monospace for versions
- Header: dark bg `#2a2520`, light text `#f2e8d5`

## What's not built yet

### Data
- [ ] Candidate future agents: Augment Code, Amazon Q, JetBrains AI, Devin
- [ ] JSON Schema files

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
