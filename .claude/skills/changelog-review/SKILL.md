---
name: agent-compat
description: Track agent versions and capabilities from changelogs
---

Workflow:

1. Resolve the changelog or release feed via `scripts/readAndParseChangelog.ts`
2. Fetch changelog
3. Run the tests in `scripts/`, then extract the latest stable version using `agent.version_regex`
4. Pull versions in to eras as you classify so they are normalized across agents, this data is stored in ./data/agents.json
5. If a new version is detected:
   - detect feature changes by diving into the changelog
   - run through each feature in agent.features to detect changes wrt feature compatibility
   - update compatibility matrix

Only retain stable releases that introduce or materially change a tracked
feature, plus the latest stable release.
