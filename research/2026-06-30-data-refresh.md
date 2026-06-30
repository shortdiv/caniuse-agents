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

---

<!-- Follow-up research appended below -->

## Decisions — 2026-06-30

The maintainer resolved the open questions as follows:

1. “Recent models” means agent/client/SDK releases, not a separate model-availability catalog.
2. Copilot tracks the local Copilot CLI/agent runtime that developers can build on top of, not the monthly cloud/editor product.
3. Cline tracks the Cline SDK/CLI surface, not the VS Code/JetBrains extension.
4. Windsurf should be removed from the compatibility matrix and data plane.
5. Store feature-changing milestones tied to stable releases, plus the latest relevant stable release; do not ingest every patch.
6. Defer plan, region, and surface availability. The untracked `data/availability.json` work is outside this refresh.
