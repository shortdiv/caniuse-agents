# CiuTable Component — Time-Aligned Era Grid

## How it works

The `CiuTable.astro` component renders a caniuse-style grid for a single feature, with columns per agent and rows aligned by time period.

### The problem it solves

Agents have different version numbers and release cadences. Claude Code has 48 versions, Codex has 35, they started at different times. You can't just stack version 1 next to version 1 — they'd represent completely different dates.

### Time alignment algorithm

1. **Collect all version release timestamps** across all agents into one sorted list
2. **Build time segments** between consecutive timestamps (plus "now" as the final boundary)
3. **Resolve each agent's support** at each segment by finding the latest version released on or before that segment's end time
4. **Find global split points** — wherever ANY agent's support status changes from one segment to the next, that becomes a row boundary for ALL agents
5. **Group segments into buckets** using those global splits — each agent gets the same number of rows, split at the same time boundaries
6. **Reverse** so newest is on top (like caniuse)

### Why global splits matter

Without global splits, each agent groups independently. If Claude goes from "n" to "y" in July 2025 but Codex stays "n" the whole time, Claude gets 2 rows but Codex gets 1. The rows don't align.

With global splits, Codex also splits at July 2025, showing two red blocks that line up with Claude's red→green transition. Now you can scan horizontally and compare the same time period.

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
