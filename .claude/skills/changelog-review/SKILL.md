---
name: agent-compat
description: Track agent versions and capabilities from changelogs
---

Workflow:

1. Resolve changelog URL via scripts/resolve-source.ts
2. Fetch changelog
3. Run the tests in scripts/ to understand how to extract versions, then extract versions using agent.version_regex
4. Pull versions in to eras as you classify so they are normalized across agents, this data is stored in ./data/agents.json
5. If a new version is detected:
   - detect feature changes by diving into the changelog
   - run through each feature in agent.features to detect changes wrt feature compatibility
   - update compatibility matrix
