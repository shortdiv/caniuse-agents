# Data Model

## Architecture — mirrors caniuse.com

The data model closely follows caniuse.com's structure:

- **Columns** = agents (Claude Code, Codex CLI, etc.) — like browsers in caniuse
- **Rows** = client/runtime versions — like browser versions in caniuse
- **Cells** = single-letter support codes (`y`, `n`, `a`, `u`, `p`, `d`)
- **Secondary axis** = models (Opus 4.6, GPT-4.1) — like rendering engines in caniuse

## File structure

```
data/
├── agents.json              # Version lists with release dates, eras, models (like caniuse agents)
├── agents/
│   ├── claude.json           # Per-agent feature support stats (version → support code)
│   └── codex.json
├── features/
│   ├── hooks.json            # Feature definitions grouped by category
│   ├── mcp.json
│   ├── instructions.json
│   ├── memory.json
│   └── tools.json
└── schema/                   # (planned) JSON Schema for validation
```

## agents.json — version metadata

Separate file defining each agent's version history with exact release timestamps and era positions:

```json
{
  "claude-code": {
    "name": "Claude Code",
    "long_name": "Claude Code (Anthropic)",
    "abbr": "CC",
    "vendor": "Anthropic",
    "type": "cli",
    "url": "https://code.claude.com",
    "current_version": "2.1.121",
    "version_list": [
      { "version": "0.2.31", "release_date": 1741196900, "era": -47, "models": ["Sonnet 3.5"] },
      { "version": "1.0.0", "release_date": 1747933038, "era": -39, "models": ["Sonnet 4", "Opus 4"] }
    ]
  }
}
```

- `release_date` = Unix timestamp (seconds), sourced from npm publish dates / GitHub releases
- `era` = relative position, 0 = current, negative = older
- `models` = optional, which models were introduced in this version

## Per-agent feature files (claude.json, codex.json)

Explicit support code for every version × every feature:

```json
{
  "id": "claude-code",
  "name": "Claude Code",
  "features": {
    "pre-tool-use": {
      "stats": {
        "0.2.31": "n",
        "1.0.0": "n",
        "1.0.38": "y",
        "2.1.121": "y"
      },
      "notes": "Part of initial hooks release"
    }
  }
}
```

Support codes: `y` (full), `a` (partial), `n` (no), `u` (unknown), `p` (polyfill/workaround), `d` (deprecated)

## Feature definition files

Define what features exist, grouped by category with optional sub-groups:

```json
{
  "category": "hooks",
  "title": "Hooks & Lifecycle",
  "features": [
    {
      "id": "pre-tool-use",
      "group": "Core Lifecycle Events",
      "title": "Pre-tool-use hook",
      "description": "Run custom code before any tool executes"
    }
  ]
}
```

## Data loader merges at build time

The Astro data loader (`src/lib/data.ts`):
1. Reads per-agent JSON files from `data/agents/*.json`
2. Reads `data/agents.json` for version metadata
3. Merges version lists into Agent objects (agent files don't have versions, agents.json does)
4. Feature pages call `getFeatureData(featureId)` which returns the caniuse-style stats object

## Key design decisions

- **Explicit over sparse**: Every version × feature cell is explicitly set (not derived from a `since` field). This avoids ambiguity and makes the data auditable.
- **Version metadata is separate**: `agents.json` owns version lists and dates. Per-agent feature files only have support codes. This keeps feature data clean for community PRs.
- **Feature groups**: Features have an optional `group` field for visual sub-categorization within a category (e.g. "Core Lifecycle Events" within Hooks).
