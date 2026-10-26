# Archive

On 2026-10-26 all in-progress work was archived as git tags so the site can restart cleanly. Nothing was lost.

| Tag | What it holds |
|---|---|
| `archive/2026-10-26/add-more-agents` | Homepage refactor to server-rendered JSX, Devin data, hooks data and learnings (last WIP, 2026-07-02, plus a final snapshot) |
| `archive/2026-10-26/rework-homepage` | Homepage reworked around workflow compatibility |
| `archive/2026-10-26/update-agent-data` | Cline version floor update |
| `archive/2026-10-26/compare-page` | Compare page as an Astro React island |
| `archive/2026-10-26/stash-availability` | Region/GDPR gating work: `data/availability.json` (in the stash's untracked-files parent, `^3`) and the update-checker worker |
| `archive/2026-10-26/stash-compare-page` | Types and a large `index.astro` rework |
| `archive/2026-10-26/stash-site-header` | SiteHeader changes for the compare page |
| `archive/2026-10-26/stash-homepage-lane-rollback` | Homepage lane experiment rollback |
| `archive/2026-10-26/stash-windsurf-hooks` | Windsurf and hooks data, design tweaks |

**Restore a branch:**

```
git switch -c <name> archive/2026-10-26/<tag>
```

**Restore a stash:**

```
git stash apply archive/2026-10-26/stash-…
```

Add `--index` to keep staged changes staged. For a stash's untracked files, use `git checkout archive/2026-10-26/stash-availability^3 -- <path>`.

The Pickwick plan and its research moved to the Pickwick repo (`~/Projects/pickwick/plans`, `~/Projects/pickwick/research`).
