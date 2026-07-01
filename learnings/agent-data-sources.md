# Agent Data Sources & Research

## Claude Code

### Version dates
- Source: **npm registry** (`npm view @anthropic-ai/claude-code time --json`)
- 48 versions tracked from 0.2.31 (2025-03-05) to 2.1.121 (2026-04-27)
- Exact publish timestamps

### Changelog
- Source: https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md
- 3,352 lines, covers 0.2.21 through 2.1.121
- No dates in the changelog itself — dates come from npm

### Key milestones found in changelog
- 0.2.31: MCP setup wizard (earliest MCP)
- 0.2.47: Auto compaction
- 0.2.50: MCP project scope
- 0.2.53: Web fetch tool
- 0.2.54: MCP SSE, memory system
- 0.2.93: --continue/--resume, todo tool
- 0.2.105: Web search
- 0.2.107: CLAUDE.md imports
- 1.0.0: GA — Sonnet 4, Opus 4
- 1.0.38: **Hooks released** (the foundational entry)
- 1.0.41: Stop/SubagentStop split, per-hook timeout
- 1.0.48: PreCompact hook
- 1.0.54: UserPromptSubmit hook
- 1.0.62: SessionStart hook
- 1.0.85: SessionEnd hook
- 2.0.0: VS Code extension, Agent SDK
- 2.0.17: Haiku 4.5
- 2.0.30: Prompt-based hooks
- 2.0.43: SubagentStart hook
- 2.0.45: PermissionRequest hook
- 2.0.51: Opus 4.5, Desktop app
- 2.1.0: Skill/agent frontmatter hooks, agent handler type
- 2.1.32: Opus 4.6
- 2.1.45: Sonnet 4.6
- 2.1.50: WorktreeCreate/Remove hooks
- 2.1.63: HTTP hooks
- 2.1.76: MCP elicitation
- 2.1.78: StopFailure hook
- 2.1.83: FileChanged/CwdChanged hooks
- 2.1.84: TaskCreated hook
- 2.1.98: Monitor tool
- 2.1.111: Opus 4.7
- 2.1.118: MCP tool handler type

## Codex CLI

### Version dates
- Source: **GitHub releases API** (`gh api repos/openai/codex/releases --paginate`)
- 35 stable versions tracked from 0.2.0 (2025-06-30) to 0.125.0 (2026-04-24)
- Filtered out alpha releases (hundreds of them)
- Exact GitHub release timestamps

### Changelog
- Source: GitHub release notes (fetched via API, 444KB total)
- Each stable release has structured release notes with New Features, Bug Fixes, Chores sections

### Key milestones found in releases
- 0.64.0 (2025-12-02): MCP elicitations, shell-tool MCP login
- 0.77.0 (2025-12-21): MCP OAuth for streamable HTTP
- 0.79.0 (2026-01-07): Cached web search
- 0.92.0 (2026-01-27): Cached web search default, multi-agent collaboration
- 0.97.0 (2026-02-05): Initial memory plumbing
- 0.99.0 (2026-02-11): Memory tool
- 0.100.0 (2026-02-12): Memory slash commands
- 0.107.0 (2026-03-02): Memories configurable + debug clear
- 0.113.0 (2026-03-10): Image generation, web search config
- 0.114.0 (2026-03-11): **Experimental hooks engine** (SessionStart + Stop)
- 0.116.0 (2026-03-19): UserPromptSubmit hook
- 0.117.0 (2026-03-26): PreToolUse/PostToolUse (shell-only)
- 0.119.0 (2026-04-10): MCP Apps, server-driven elicitations, resources
- 0.121.0 (2026-04-15): Memory mode controls, chronicle alias
- 0.122.0 (2026-04-20): PermissionRequest hooks, computer use, image gen default
- 0.124.0 (2026-04-23): **Hooks stable**, inline config, MCP tool observation

### Key differences from Claude Code
- Hooks came much later (Mar 2026 vs Oct 2025) and only command handlers
- No HTTP, prompt, agent, or MCP tool handler types
- No SessionEnd, subagent hooks, compaction hooks, file watch, worktree hooks
- Strong memory/chronicle system
- Computer use (browser control) built in
- Image generation built in
- AGENTS.md is native format (vs CLAUDE.md)

## Devin (removed for now)
- Was in data/agents/devin.json using old FeatureSupport format (no stats)
- No version data
- Removed to focus on Claude + Codex with full version history

## Other agents researched but not yet seeded
- Roo Code, Augment Code, Amazon Q, JetBrains AI
- Initial hooks research done (see feature-categories.md)
- Need changelog/release research for version data before seeding

## June 2026 refresh policy

- Track every stable release so displayed version ranges remain continuous.
- Carry compatibility values forward and add notes only at feature-changing milestones.
- GitHub Copilot means the local GitHub Copilot CLI and its SDK-facing runtime, not the monthly cloud/editor release train.
- Cline means Cline CLI and the Cline SDK runtime introduced with CLI 3.0.0, not the editor-extension release train.
- Windsurf is intentionally not part of the matrix.
- Model-plan, region, and surface availability are outside the compatibility dataset.

### Current primary sources

- Claude Code: npm publish timestamps and the official `anthropics/claude-code` changelog/releases
- Codex CLI: stable `openai/codex` GitHub releases and the official Codex manual
- Cursor: the official Cursor changelog
- GitHub Copilot CLI: `github/copilot-cli/changelog.md`
- Cline: CLI hook foundation in `cli-v*` releases, plus SDK-backed VS Code runtime and plugins in `v4.0.0+` from `cline/cline`
- Cline's `hook-session-lifecycle` row is an umbrella label. The underlying Cline mapping is `TaskStart` only, with notes that it is task-level rather than a true session start/end pair (`data/features/hooks.json:7-31`, `data/agents/cline.json:685-723`).
