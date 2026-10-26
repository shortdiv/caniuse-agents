# CiuTable Component — Version History Grid

## How it works

The `CiuTable.astro` component renders a caniuse-style grid for a single feature, with columns per agent and rows aligned like caniuse: current version on top, history below.

### Alignment (since 2026-10-26)

Like caniuse.com: **every agent's current version sits on the same top row**, and older versions stack below it, newest first. Each column is that agent's own history:

1. Sort the agent's versions oldest first.
2. Group consecutive versions with the same support code into runs. A version with a `version_notes` entry also starts a new run, so a documented change gets its own row.
3. Reverse, so the run containing the current version is on top.
4. Pad shorter histories at the bottom with "Not released" cells (cross-hatched), so all columns have the same number of rows.

Rows across agents line up by recency, not by date. The hover shows each run's date range.

**Replaced:** the earlier time-aligned grid. It split every column wherever *any* agent changed support. Rows came from other agents' releases, which needed "no new release" filler cells and made the table busy.

### Cell labels

- Version ranges: `1.0.38 - 2.1.121` (collapsed consecutive same-support versions)
- "Not released" when the agent didn't exist during that time window
- Hover tooltip shows: version range, date range (e.g. "Jul 2025 — Apr 2026"), support label

### Color scheme

Uses CSS custom properties from global.css for theme support (light/dark):
- `--status-yes-bg/text` for full support (green)
- `--status-no-bg/text` for no support (red)
- `--status-partial-bg/text` for partial (amber)
- `--status-flag-bg/text` for flag/workaround (purple)
- `--status-unknown-bg/text` for unknown (gray)

Header: dark bg `#2a2520`, light text `#f2e8d5`

### Layout

- CSS grid: `grid-template-columns: repeat(N, minmax(120px, 1fr))`
- Each agent is a flex column (`flex-direction: column`)
- Cells are 28px tall, 0.7rem font
- `align-items: start` keeps columns top-aligned

### Props

```typescript
interface Props {
  featureData: CaniuseFeatureData | null;  // from getFeatureData()
  supportRows: SupportRow[];                // from loadAgents() + getCurrentFeatureSupport()
}
```

### Codepen reference

The original prototype was built in a codepen at `~/Downloads/caniuse-grid/`. Key function was `buildBuckets()` which grouped consecutive same-support browser versions into ranges. The Astro component extends this with time-aligned global splits.
