---
date: 2026-06-30 10:20:19 EDT
repo: caniuse-agents
branch: feature/compare-page
commit: 0dcafffeeeab939139d3bc3ba08f7f583c63fe8b
topic: "Review the current work and identify the data changes needed to support recent agent releases and models"
tags: [research, compatibility-data, agents, models, changelogs]
status: complete
last_updated: 2026-06-30
---

# Research: Recent Agent and Model Data Refresh

**Date**: 2026-06-30 10:20:19 EDT
**Repo**: caniuse-agents @ [`0dcafff`](https://github.com/shortdiv/caniuse-agents/commit/0dcafffeeeab939139d3bc3ba08f7f583c63fe8b)
**Branch**: feature/compare-page

## Research Question

> Ok I'm way behind on my caniuseagents codebase, and I need to update it to support the recent models. Can you please go to that project under Projects and review the current work. Please read the skills available, and the goal is to update the data mainly so it's up to date with recent changes

## Summary

The site is structurally ready for a data refresh: six agents and 47 features are loaded from JSON, the tests pass, and the static build succeeds. The tracked releases are nevertheless stale as of 2026-06-30, and the data has integrity gaps that the build does not detect: Claude Code has two metadata-only versions missing from 37 feature matrices, and Claude Code and Codex CLI contain invalid era sequences.

The existing `models` field is only populated for seven Claude Code milestones and is not rendered by the UI. A model refresh therefore needs an explicit scope decision: continue recording only model-introduction milestones on agent releases, or add a first-class current model-availability dataset for all agents.

## Findings

### Repository and current work

- The branch is `feature/compare-page`, two commits ahead of `main`.
- The worktree contains a modified `src/components/SiteHeader.astro` and untracked compare-page supporting data, tests, and image files. These changes were not modified during research.
- `npm test -- --runInBand` passes: 9 tests pass and 3 JavaScript-rendered changelog cases remain TODO.
- `npm run build` succeeds and generates 51 pages.

### Data flow

- `data/agents.json` owns agent release metadata, `current_version`, release timestamps, eras, and optional model milestones.
- `data/agents/*.json` owns the explicit version-by-feature support cells.
- `src/lib/data.ts:27-60` merges those two sources at build time.
- `src/lib/data.ts:136-148` treats the last item in `version_list`, not `current_version`, as the current support lookup.
- `src/lib/data.ts:161-187` passes explicit stats through without checking that every metadata version has a support entry.
- `src/lib/types.ts:48-62` carries model names into the in-memory `AgentVersion`, but no page or component consumes `models`.

### Current tracked state and staleness

The repository currently tracks:

- Claude Code `2.1.143` (`data/agents.json:9`)
- Codex CLI `0.128.0` (`data/agents.json:297`)
- Cursor `3.2` (`data/agents.json:488`)
- Windsurf `2.1.29` (`data/agents.json:554`)
- Copilot cloud releases through `2026.05` (`data/agents.json:615`)
- Cline `3.83.0` (`data/agents.json:656`)

Official sources checked on 2026-06-30 show newer releases:

- Claude Code `2.1.196` (GitHub releases and npm)
- Codex CLI stable `0.142.4` (GitHub releases; prereleases excluded)
- Cursor changelog `3.9` dated 2026-06-29
- GitHub Copilot CLI `1.0.66`
- Cline extension `4.0.4` and a separately versioned Cline CLI `3.0.34`

These comparisons expose a source-identity issue for Copilot and Cline. The repository models Copilot as a monthly cloud product, while the local skill points to the independently versioned Copilot CLI. Cline likewise now has extension and CLI release streams. Updating either without choosing the tracked surface would mix incompatible version axes.

Windsurf's current changelog page does not provide a clean IDE semver in the same way as the other sources, so its authoritative version source still needs to be resolved.

### Data integrity gaps

- The model is documented as explicit: every version must have a support code for every feature (`learnings/data-model.md:55-77`, `learnings/data-model.md:106-109`).
- Claude Code versions `2.1.122` and `2.1.142` are absent from 37 of the 47 Claude feature matrices. Because explicit stats are passed through unchanged, those cells do not exist rather than being intentionally marked unknown.
- Claude Code eras regress from `-2` at `2.1.111` to `-3` at `2.1.118`.
- Codex CLI versions `0.124.0` and `0.125.0` both use era `-1`.
- There is no schema or validation script to catch missing version cells, invalid support codes, non-monotonic dates/eras, mismatched `current_version`, or missing feature IDs.

### Local changelog skill

The only project-local skill is `.claude/skills/changelog-review/SKILL.md`. Its intended workflow is to resolve a changelog, detect new versions, classify versions into eras, inspect feature changes, and update every feature matrix.

The implementation and the written workflow have drifted:

- The skill references `scripts/resolve-source.ts`, but the available implementation is `scripts/readAndParseChangelog.ts`.
- GitHub-backed Claude Code, Cline, and Copilot parsing is tested.
- Codex, Cursor, and Windsurf extraction tests are TODO because their marketing pages require JavaScript rendering.
- Agent YAML files define sources, regexes, and broad feature categories, but no source policy for product variants, stable versus prerelease channels, release selection, or models.

### Documentation drift

- `learnings/project-status.md:8-11` describes only Claude and Codex data, 69 features, and older version counts; the repository now has six agents and 47 features.
- `learnings/project-status.md:31` lists Cursor, Windsurf, Copilot, and Cline as not built even though their data files exist.
- `learnings/data-model.md:10` describes models as a secondary axis, but only Claude has model metadata and the UI does not render it.
- `learnings/agent-data-sources.md` stops at late-April 2026 release milestones.

## Code References

| File | Lines | Notes |
|------|-------|-------|
| `data/agents.json` | 1-810 | Six agents, release histories, eras, and sparse Claude-only model milestones |
| `src/lib/data.ts` | 27-60 | Loads metadata and merges releases into agent records |
| `src/lib/data.ts` | 122-148 | Resolves current support from the final release entry |
| `src/lib/data.ts` | 151-209 | Builds per-feature compatibility data without completeness validation |
| `src/lib/types.ts` | 48-62 | Model metadata is represented but not consumed in UI |
| `.claude/skills/changelog-review/SKILL.md` | 1-15 | Intended changelog-driven update workflow |
| `.claude/skills/changelog-review/scripts/readAndParseChangelog.ts` | 1-69 | Current source resolution and first-version extraction |
| `.claude/skills/changelog-review/scripts/readAndParseChangelog.test.ts` | 1-106 | Three working GitHub cases and three TODO marketing-page cases |
| `learnings/data-model.md` | 29-77 | Metadata and explicit support-cell contract |
| `learnings/data-model.md` | 98-109 | Loader flow and explicit-over-sparse design decision |
| `learnings/project-status.md` | 5-33 | Stale counts and stale remaining-agent list |

## Architecture Notes

- Release histories are intentionally milestone-based rather than exhaustive; only versions relevant to feature changes need to be retained, provided the selection policy is explicit.
- The UI aligns agents by release timestamp. Exact, authoritative dates matter independently of version ordering.
- A release update is not just a change to `current_version`: each retained release must be added to all 47 feature matrices, with compatibility changes and version-specific notes applied where warranted.
- `era` is stored but the current table implementation computes alignment from timestamps. Era consistency still matters because the documented format treats it as normalized ordering and future consumers may rely on it.
- Model availability changes faster and has different semantics from client capabilities. Treating “model introduced in client changelog” and “model currently selectable by an agent/product/plan” as the same field would be misleading.

## Open Questions

1. Should “recent models” mean client release milestones, current selectable models per agent, or both?
2. Should Copilot track the cloud/editor product, Copilot CLI, or separate agent records for each surface?
3. Should Cline track the VS Code/JetBrains extension, the new CLI, or separate records?
4. What is the authoritative, machine-readable Windsurf IDE release source?
5. Should every upstream patch release be stored, or only feature-changing milestones plus the latest stable release?
6. Should model availability include plan, region, and surface constraints, similar to the untracked `data/availability.json` work?

### Follow-up: Cline session lifecycle

- The `hook-session-lifecycle` row is a normalized cross-agent capability label, not a literal Cline changelog phrase.
- In the Cline data, the row is populated from the hook docs and current runtime behavior: `TaskStart` is the only lifecycle event mapped, and the notes explicitly say it fires at the beginning of each agentic loop and is task-level, not session-level (`data/features/hooks.json:7-31`, `data/agents/cline.json:685-723`).
- The Cline hooks landing page itself does not enumerate a `SessionStart` or `SessionEnd` event; it points readers to SDK hooks instead (`https://docs.cline.bot/customization/hooks`).
- So the data currently says "session lifecycle management" as an umbrella comparison, but Cline’s actual support is narrower than that title suggests.

### Follow-up: hook integration model

- Yes, Cline’s hook model is different from the direct-config approach used by Claude Code and Codex.
- Claude Code hooks are defined in settings files, including `~/.claude/settings.json`, `.claude/settings.json`, and plugin-bundled `hooks/hooks.json` (`https://code.claude.com/docs/en/hooks`).
- Codex hooks are defined in `hooks.json` or inline `[hooks]` tables inside `config.toml`, with plugin-bundled lifecycle config as an additional source (`https://developers.openai.com/codex/hooks`).
- GitHub Copilot also reads hook files from repo/user config and plugin bundles, plus cloud-agent repository hooks (`https://docs.github.com/en/copilot/reference/hooks-reference`).
- Cline’s plugin docs say hooks are defined inside the plugin `hooks` object, not directly on the extension, and that plugin support applies to the Cline SDK, CLI, and Kanban surfaces (`https://docs.cline.bot/sdk/plugins`, `https://docs.cline.bot/customization/plugins`).
- So the distinguishing feature is not “hooks exist” but “where the hook logic lives”: Cline pushes lifecycle logic into SDK plugins, while the others are primarily config-file driven with optional plugin loading.

### Follow-up: when Cline plugins appeared

- The GitHub release history shows CLI plugin management by `cli-v3.0.27` on 2026-06-17, where the changelog adds `cline skill`, matches `cline plugin install`, and mentions plugin MCP OAuth handling. That is the earliest clear CLI-era marker for the plugin surface in the release notes.
- The broader SDK/plugin story becomes explicit in `v4.0.0` on 2026-06-26, which adds the SDK-backed runtime, the Customize marketplace, and "Cline Plugins" as a first-class feature.
- I did not find a release note that says "session hooks via plugins" in those exact words. The changelog evidence supports plugin-based extensibility and plugin-bundled hooks, but the session-hook semantics still come from the SDK/plugin docs, not a single release-note sentence.

### Follow-up: earliest hooks origin

- The earliest release-note reference I found for the hooks foundation is `v0.0.1-cli` from 2025-10-13. Its release notes explicitly list `Hooks: Initial implementation of hooks foundation logic [ENG-1011, ENG-985]` and link back to PR `#6755` (`https://github.com/cline/cline/releases/tag/v0.0.1-cli`).
- The linked PR discussion says the initial hook model used one entrypoint per hook in `.clinerules/hooks/`, with support for global `.clinerules/hooks/` too (`https://github.com/cline/cline/pull/6755#diff-43f3811022494cd7f00acc119494dec2a5b1faa3dcc2191759365ff8238384b7`).
- That is earlier than the CLI 3.x plugin surface. So if the matrix is meant to capture when Cline first gained hook extensibility at all, the start point should be `v0.0.1-cli`, not `cli-v3.0.27` or `v4.0.0`.

### Follow-up: CLI hooks versus plugins

- `v3.33.0` on 2025-10-16 is the earliest release I found that clearly ships hooks in the CLI product line: the notes include “Hooks: Foundation logic” and “Global clinerules dir,” which implies the hook execution model lived directly in the CLI filesystem/config surface at that point (`https://github.com/cline/cline/releases/tag/v3.33.0`).
- `v3.41.0` on 2025-12-11 then explicitly says “feat(hooks): enable hooks in the CLI” (`https://github.com/cline/cline/releases/tag/v3.41.0`), so by then the hook feature was definitely first-class in the CLI release stream.
- I do not see evidence that hooks were "moved to plugins" before `v4.0.0`. The first release that clearly makes plugins first-class is `v4.0.0`, which adds the SDK-backed runtime, the Customize marketplace, and plugin-bundled skills/capabilities (`https://github.com/cline/cline/releases/tag/v4.0.0`).
- Net: hooks in Cline start as a direct CLI capability, then plugin support arrives later as an additional extensibility layer. Those are related, but not the same change.

### Follow-up: current interpretation

- Based on the releases above, the current `hook-session-lifecycle` row is still too coarse if it implies a true session start/end pair for Cline.
- What Cline clearly has in the CLI line is hook foundation logic and later explicit CLI hook enablement.
- What `v4.0.0` adds is the SDK-backed app/runtime plus plugin packaging. The release notes explicitly say Cline now runs tasks through the shared Cline SDK session layer and that plugins can package reusable automations and extend Cline with custom tools, workflows, skills, and MCP-powered capabilities. That is enough to treat the lifecycle surface as app/runtime-backed in `v4.0.0`, even though the release notes still do not describe a neat one-line migration from CLI hooks to plugin hooks.

---

<!-- Follow-up research appended below -->

## Decisions — 2026-06-30

The maintainer resolved the open questions as follows:

1. “Recent models” means agent/client/SDK releases, not a separate model-availability catalog.
2. Copilot tracks the local Copilot CLI/agent runtime that developers can build on top of, not the monthly cloud/editor product.
3. Cline tracks the Cline SDK/CLI surface, not the VS Code/JetBrains extension.
4. Windsurf should be removed from the compatibility matrix and data plane.
5. Store every stable release in the version timeline. Carry support values
   forward between releases and reserve `version_notes` for feature-changing
   milestones.
6. Defer plan, region, and surface availability. The untracked `data/availability.json` work is outside this refresh.
