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
- **Milestones:** 20 versions, each the first release-note evidence of a tracked feature, plus the latest.
- **Before first evidence:**
  - features that probably already existed are `u`;
  - features that were clearly introduced later are `n`.

  Early release notes are sparse, so the first versions are approximate.
- **Hooks are JS/TS plugins,** not config commands. The plugin system first shipped in **0.3.114** (2025-08-03): `packages/plugin` landed in commit ca031278c ("wip: plugins"), and 0.3.114 is the first release that contains it. The release notes first mention plugins at 0.3.129, which was used at first and then corrected.
  - **Agent stop and subagent lifecycle are `a`:** `session.idle` only observes the end of a turn, and subagents show up only as child sessions.
  - **Prompt validation is `a`:** the `chat.message` plugin hook (in the source, not the plugin docs) receives each user message and can modify it. Blocking isn't documented.
- **Web search is `a`:** it needs OpenCode Zen or an environment flag. (First recorded as `p`; flags now count as partial.)
- **LSP is `a`:** diagnostics only, and off by default.

**Cline:** removed, along with its data file, mappings, sub-capabilities, table style and skill feed. The data is archived in `archive/2026-10-26/*`.

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
  - interrupt hooks (Codex `Interrupt`);
  - error hooks (Copilot `errorOccurred`);
  - post-tool-failure hooks (Cursor and Copilot `postToolUseFailure`).
- **`mcp-sampling` note:** it says "No agent supports this yet", but Copilot is marked `y`. Needs a check.
- **`agent_mapping`** is still empty for most non-hook features.
