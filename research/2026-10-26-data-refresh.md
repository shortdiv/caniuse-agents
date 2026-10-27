# Data refresh, 2026-10-26

This covers releases from 2026-06-30 to 2026-10-26, for Claude Code, Codex, Cursor and Copilot CLI. It also adds OpenCode and drops Cline. Every changed cell below has a source.

## Sources

| Harness | Versions and dates | Feature changes |
|---|---|---|
| Claude Code | npm `@anthropic-ai/claude-code` publish times | `CHANGELOG.md` (2.1.198 → 2.1.310); the latest on npm is 2.1.311 |
| Codex | GitHub releases API: stable, `rust-v*` | Release notes, 0.142.5 → 0.164.0; hooks docs (now at learn.chatgpt.com/docs/hooks); source code for the plan tool |
| Cursor | Download API (`/api/download`): 3.27.14 build of 2026-10-23 | `cursor.com/changelog` posts; hooks docs. The changelog stopped printing version numbers after 3.11 |
| Copilot CLI | npm `@github/copilot` publish times | `changelog.md` (1.0.68 → 1.0.103); hooks reference docs |
| OpenCode | GitHub releases (`anomalyco/opencode`, formerly `sst/opencode`); npm `opencode-ai` latest | Release notes, 0.0.45 → 1.19.4; docs for tools, MCP, rules, plugins, agents, LSP, TUI and config |

## Changes

**Claude Code**
- **Browser control:** `n` → `y` at 2.1.198. Claude in Chrome became generally available.
- **MCP roots:** `a` → `y` at 2.1.203. Added working directories are now sent in `roots/list`, with `list_changed` notifications.
- **AGENTS.md:** `a` → `y` at 2.1.277. AGENTS.md is read natively when a project has no CLAUDE.md.
- **Models added:**
  - Opus 4.8 (2.1.154), Fable 5 (2.1.170), Sonnet 5 (2.1.197), which the June refresh missed;
  - Opus 5 (2.1.219), Fable 5.1 (2.1.257), Opus 5.5 (2.1.280), Sonnet 5.5 (2.1.284), Haiku 5.5 (2.1.293).

**Codex**
- **Task management:** `n` → `y` from 0.11.0. **This corrects old data.** The `update_plan` tool shipped as experimental in openai/codex#1726, first in 0.11.0; source is `codex-rs/core/src/tools/handlers/plan.rs` and `protocol/src/plan_tool.rs`.
- **Session lifecycle:** SessionEnd added in 0.145.0 (#33895). The mapping is now "SessionStart, SessionEnd"; the code was already `y`.

**Cursor**
- **Response tracking:** `n` → `y` at 3.11. The `afterAgentResponse` and `afterAgentThought` hooks came in with the side-chat release (2026-07-10), and the hooks docs list them.

**Copilot CLI**
- **Compaction hook:** `n` → `y` from 1.0.5. **This corrects old data.** `preCompact` arrived in 1.0.5.
- **Response tracking:** `n` → `y` from 1.0.18. **This corrects old data.**
  - The `notification` hook fires on agent completion, permission prompts and elicitation.
  - This matches how Claude Code's `Notification` hook is counted.
- **MCP resources:** `u` → `a` at 1.0.70, then `y` at 1.0.100.
  - 1.0.70 added the `session.mcp.resources` RPCs.
  - By 1.0.100 there's a resource dashboard in `/mcp`.
- **Semantic search:** `n` → `y` at 1.0.100. On by default for online sessions.

**OpenCode (new)**

**Checked in source.** Each date below is the first release whose code contains the feature. I read files at each release tag with the GitHub contents API and binary-searched the stable tags. Release notes were only a starting point, because early ones are sparse and often mention a feature first in a fix.

**Only the TypeScript OpenCode is tracked.** Tags 0.0.45–0.0.52 are an earlier Go program in the same repo (`main.go`, `internal/`). The TypeScript rewrite starts at v0.1.30 (2025-06-13), so that's the first tracked version.

| Since | What | Where in source (`packages/opencode/src`) |
|---|---|---|
| 0.1.30 | read, edit, write, grep, glob, bash; task tool (subagents); todos; webfetch; LSP diagnostics; MCP local + remote over SSE; project config; AGENTS.md/CLAUDE.md walk-up; auto-summarize at 90% of context; `run --session` | `tool/*`, `mcp/index.ts`, `session/system.ts`, `session/index.ts`, `cli/cmd/run.ts` |
| 0.1.87 | Global config (`~/.config/opencode`), so user-level MCP config | `config/config.ts` |
| 0.1.113 | Global AGENTS.md and `~/.claude/CLAUDE.md` | `session/system.ts` |
| 0.1.146 → 0.3.7 | Task tool commented out, then restored | `provider/provider.ts` |
| 0.1.148 | Experimental config hooks (`file_edited`, `session_completed`) | `config/config.ts` |
| 0.1.180 | `instructions` config option | `config/config.ts` |
| 0.1.192 | Image @ files handled; paste images in 0.2.6 | release notes; earlier image support unknown (`u`) |
| 0.3.76 | Streamable HTTP MCP transport | `mcp/index.ts` |
| 0.3.83 | Remote `.well-known/opencode` config as an overridable base layer: org instructions `a` | `config/config.ts` |
| 0.3.114 | Plugin system: `tool.execute.before/after`, `chat.message`, all app events (session updated/idle/deleted; message updated) | `packages/plugin` (first added in commit ca031278c) |
| 0.7.2 | `session.compacted` event: compaction hook `a` | `session/index.ts` |
| 0.15.19 | `session.created` event: session lifecycle `y` | `session/index.ts` |
| 1.0.56 | `websearch` tool (later limited to Zen or an env flag): `a` | `tool/websearch.ts` |
| 1.0.137 | MCP OAuth | `mcp/oauth-provider.ts` |
| 1.0.165 | `experimental.session.compacting`: compaction hook `y` | plugin API |
| 1.0.219 | MCP prompts (as slash commands) | `mcp/index.ts` |
| 1.1.1 | MCP resources | `mcp/index.ts` |
| 1.1.43 | Managed config (system dirs, enforced): org instructions `y` | `config/config.ts` |
| 1.17.7 | MCP roots capability and `roots/list` handler | `mcp/index.ts` |

**Still "no",** because the capabilities are commented out in the MCP client with links to open issues:
- MCP sampling (#11948);
- MCP elicitation (#23066).

**Hooks are JS/TS plugins,** not config commands:
- **Partial:**
  - agent stop: `session.idle` only observes;
  - subagent lifecycle: subagents show up only as child sessions;
  - prompt validation: `chat.message` can modify a prompt, but blocking isn't documented.
- `chat.message` is in the plugin API but not on the plugin docs page.

**Corrections versus the first draft of this refresh:**
- Seven features started too late: subagents, todos, web fetch, MCP, MCP over SSE, AGENTS.md and resume.
- Plugins were dated 0.3.129 (the first release-note mention) instead of 0.3.114.
- MCP roots was `n`.
- Global instructions only had the latest version marked.
- Org instructions started at 1.3.14 instead of 0.3.83/1.1.43.
- The Go-era versions were included.

**Cline:** removed, along with its data file, mappings, sub-capabilities, table style and skill feed. The data is archived in `archive/2026-10-26/*`.

## New hook features: permission request and interrupt

Feature categories here are our own; these two follow event names the harnesses share (Codex's hooks docs group events by when they fire).

| Harness | `hook-permission-request` | `hook-interrupt` | Source |
|---|---|---|---|
| Claude Code | `y` from 2.0.45 (`PermissionRequest`) | `n`: `Stop` doesn't run on a user interrupt | CHANGELOG 2.0.45, 2.0.54; hooks docs |
| Codex | `y` from 0.122.0 (#17563) | `y` from 0.150.0 (`Interrupt`, #40511) | release notes |
| GitHub Copilot | `y` from 1.0.16 (`permissionRequest`) | `n`: only `sessionEnd` `reason: "abort"`, undocumented | changelog 1.0.16; hooks reference |
| Cursor | `n`: only pre-call allow/deny on `preToolUse`, shell and MCP hooks | `a` from 2.4: `stop` `status: "aborted"` | hooks docs |
| OpenCode | `y` 0.3.127–1.2.26 (`permission.ask` plugin hook), then `a`: the hook is still typed but no longer triggered; only `permission.asked`/`replied` events | `n`: aborts show only as `MessageAbortedError` on a message | source: `permission/index.ts` at each tag, binary search |

New tracked versions so these dates show: Codex 0.150.0; OpenCode 0.3.127 and 1.2.27.

## Skill fixes (`.claude/skills/changelog-review`)

- **New `sources.version` option:** a registry or API URL that reports the current version, checked first.
- **Codex** uses the GitHub latest-release API. Its atom feed shows only the newest ~10 tags, often all alphas, and the old pattern couldn't match `rust-v` tags.
- **Cursor** uses its download API, because its changelog no longer has version numbers.
- **OpenCode** uses npm's latest dist-tag. Its GitHub feed also carries a `v2.x` artifact.
- **Jest still can't run the skill's TypeScript tests:** `ts-jest` is installed but not configured. That was already the case before this refresh. Version detection for all five harnesses was checked with Bun instead.

## Left for later

- **Model lists:** only Claude Code records models per version. Other harnesses need sources for theirs.
- **Possible new features** worth tracking:
  - model-switch hooks (Claude Code `PreModelSwitch`/`PostModelSwitch`);
  - error hooks (Copilot `errorOccurred`);
  - post-tool-failure hooks (Cursor and Copilot `postToolUseFailure`).
- **`mcp-sampling` note:** it says "No agent supports this yet", but Copilot is marked `y`. Needs a check.
- **`agent_mapping`** is still empty for most non-hook features.
