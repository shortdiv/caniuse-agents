# Can I Use Agents?

Compatibility tables for AI coding agent features. Compare hooks, MCP, tools, instructions, and memory support across Claude Code, Cline CLI, Codex CLI, GitHub Copilot CLI, and Cursor.

**[caniuseagents.com](https://caniuseagents.com)**

## What is this?

Coding agents have become the platform developers build workflows on top of. But support for features like lifecycle hooks, MCP transports, and persistent memory varies widely across agents — and changes with every release.

This site tracks feature support across agents with version-level granularity, so you can check compatibility without digging through six different docs sites.

## Data

All compatibility data lives in `data/`:

- `data/agents.json` — version metadata and release dates for all tracked agents
- `data/features/*.json` — feature definitions grouped by category
- `data/agents/*.json` — per-agent support codes across all tracked versions

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on the data format and how to contribute.

## Development

```sh
npm install
npm run dev
```

Built with [Astro](https://astro.build) and deployed on [Netlify](https://netlify.com).

## Contributing

Contributions are welcome — whether it's fixing a support code, adding a feature, or updating notes. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Credits

Created and maintained by [@shortdiv](https://shortdiv.com). Inspired by [caniuse.com](https://caniuse.com) by [@Fyrd](https://github.com/Fyrd).
