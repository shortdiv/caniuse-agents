---
name: agent-compat
description: Track agent versions and capabilities from changelogs
---

Workflow:

1. Resolve the version source via `scripts/readAndParseChangelog.ts`, in this order:
   - `sources.version`: a registry or API URL that reports the current version (Codex, Cursor, OpenCode);
   - `sources.changelog`;
   - `sources.releases`.
2. Fetch changelog
3. Run the tests in `scripts/`, then extract the latest stable version using `agent.version_regex`
4. Pull versions in to eras as you classify so they are normalized across agents, this data is stored in ./data/agents.json
5. If a new version is detected:
   - detect feature changes by diving into the changelog
   - run through each feature in agent.features to detect changes wrt feature compatibility
   - update compatibility matrix

Tracked harnesses: Claude Code, Codex, Cursor, Copilot CLI, OpenCode (`agents/*.yaml`).
When a version source has no notes (Cursor's API, npm), read the changelog or release notes named in the yaml for feature changes.

Only retain stable releases that introduce or materially change a tracked
feature, plus the latest stable release.
