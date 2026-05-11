# Contributing to Can I Use Agents?

Thanks for helping keep this data as accurate as possible! <3

## How the data works

All compatibility data lives in `data/`. There are three types of files:

### Agent version metadata — `data/agents.json`

Maps each agent to its version history with release timestamps:

```json
{
  "claude-code": {
    "name": "Claude Code",
    "current_version": "2.1.121",
    "version_list": [
      { "version": "2.1.121", "release_date": 1777318786, "era": 0 }
    ]
  }
}
```

- `release_date` is a Unix timestamp
- `era` is a relative ordering (0 = latest, negative = older)

### Feature definitions — `data/features/*.json`

Each file defines a category of features:

```json
{
  "category": "hooks",
  "title": "Hooks & Lifecycle",
  "description": "...",
  "features": [
    {
      "id": "hook-pre-tool",
      "group": "Hook Events",
      "title": "Pre-tool-use hook",
      "description": "Run custom code before any tool executes",
      "agent_mapping": {
        "claude-code": "PreToolUse",
        "cursor": "preToolUse"
      },
      "sub_capabilities": ["..."]
    }
  ]
}
```

- `id` must match the key used in agent data files
- `agent_mapping` maps to each agent's actual event/API name
- `sub_capabilities` lists implementation differences across agents

### Agent support data — `data/agents/*.json`

Each agent has a file mapping feature IDs to per-version support codes:

```json
{
  "id": "cursor",
  "name": "Cursor",
  "features": {
    "hook-pre-tool": {
      "stats": {
        "0.45": "n",
        "1.7": "a",
        "2.4": "y"
      },
      "notes": "Allow/deny/modify, matchers, failClosed.",
      "version_notes": {
        "1.7": "Beta: basic tool observation.",
        "2.4": "GA: allow/deny/modify, matchers, failClosed."
      }
    }
  }
}
```

#### Support codes

| Code | Meaning |
|------|---------|
| `y`  | Full support |
| `a`  | Partial support |
| `n`  | No support |
| `u`  | Unknown |
| `p`  | Behind a flag or workaround |
| `d`  | Deprecated |

#### Notes

- `notes` is the default note shown for all versions of that feature
- `version_notes` (optional) overrides the note for specific versions — use this when support changed meaningfully between versions

## Common contributions

### Updating support data

If an agent shipped a new version with changed support for a feature:

1. Add the version to `data/agents.json` in the agent's `version_list`
2. Add the support code to the feature's `stats` in `data/agents/<agent>.json`
3. Update `notes` or `version_notes` if the implementation changed

### Adding a new feature

1. Add the feature definition to the appropriate `data/features/*.json` file
2. Add the feature ID with support codes to every agent file in `data/agents/`

### Adding a new agent

1. Add version metadata to `data/agents.json`
2. Create `data/agents/<agent-id>.json` with support codes for all tracked features
3. Add the agent's display metadata (color, logo) to `src/components/CiuTable.astro`

## Running locally

```bash
npm install
npm run dev
```

The site is built with [Astro](https://astro.build). All pages are statically generated from the JSON data.

## Submitting changes

1. Fork the repo
2. Create a branch for your change
3. Make your edits to the JSON data files
4. Run `npm run build` to verify nothing breaks
5. Open a PR with a clear description of what changed and why
