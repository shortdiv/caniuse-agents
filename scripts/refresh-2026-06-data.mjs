import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));
const writeJson = async (path, value) =>
  writeFile(new URL(path, root), `${JSON.stringify(value, null, 2)}\n`);
const timestamp = (iso) => Math.floor(new Date(iso).getTime() / 1000);

const meta = await readJson("data/agents.json");
delete meta.windsurf;

const releases = {
  "claude-code": [
    ["2.1.163", "2026-06-04T17:56:01.880Z"],
    ["2.1.169", "2026-06-08T18:11:20.859Z"],
    ["2.1.172", "2026-06-10T17:55:48.479Z"],
    ["2.1.186", "2026-06-22T18:03:48.955Z"],
    ["2.1.196", "2026-06-29T20:08:58.871Z"],
  ],
  "codex-cli": [
    ["0.131.0", "2026-05-18T17:39:34Z"],
    ["0.133.0", "2026-05-21T16:48:03Z"],
    ["0.134.0", "2026-05-26T19:13:26Z"],
    ["0.139.0", "2026-06-09T20:13:29Z"],
    ["0.141.0", "2026-06-18T04:43:06Z"],
    ["0.142.0", "2026-06-22T22:19:53Z"],
    ["0.142.4", "2026-06-29T05:04:25Z"],
  ],
  cursor: [
    ["3.7", "2026-06-17T00:00:00Z"],
    ["3.8", "2026-06-18T00:00:00Z"],
    ["3.9", "2026-06-29T00:00:00Z"],
  ],
};

for (const [agentId, additions] of Object.entries(releases)) {
  const agent = meta[agentId];
  const byVersion = new Map(
    agent.version_list.map((release) => [release.version, release]),
  );
  for (const [version, date] of additions) {
    byVersion.set(version, {
      ...byVersion.get(version),
      version,
      release_date: timestamp(date),
    });
  }
  agent.version_list = [...byVersion.values()].sort(
    (a, b) => a.release_date - b.release_date,
  );
  agent.current_version = additions.at(-1)[0];
}

meta.copilot = {
  ...meta.copilot,
  name: "GitHub Copilot CLI",
  long_name: "GitHub Copilot CLI",
  abbr: "GHCP",
  vendor: "GitHub",
  type: "cli",
  url: "https://github.com/features/copilot/cli",
  current_version: "1.0.66",
  version_list: [
    ["0.0.374", "2026-01-02T00:00:00Z"],
    ["0.0.384", "2026-01-16T00:00:00Z"],
    ["0.0.389", "2026-01-22T00:00:00Z"],
    ["0.0.396", "2026-01-27T00:00:00Z"],
    ["0.0.399", "2026-01-29T00:00:00Z"],
    ["0.0.401", "2026-02-03T00:00:00Z"],
    ["0.0.402", "2026-02-03T12:00:00Z"],
    ["0.0.422", "2026-03-05T00:00:00Z"],
    ["1.0.13", "2026-03-30T00:00:00Z"],
    ["1.0.14", "2026-03-31T00:00:00Z"],
    ["1.0.58", "2026-06-02T00:00:00Z"],
    ["1.0.61", "2026-06-09T00:00:00Z"],
    ["1.0.64", "2026-06-23T00:00:00Z"],
    ["1.0.66", "2026-06-30T00:00:00Z"],
  ].map(([version, date]) => ({ version, release_date: timestamp(date) })),
};

meta.cline = {
  ...meta.cline,
  name: "Cline CLI",
  long_name: "Cline CLI & SDK",
  abbr: "CL",
  vendor: "Cline",
  type: "cli-sdk",
  url: "https://github.com/cline/cline",
  current_version: "3.0.34",
  version_list: [
    ["3.0.0", "2026-05-12T22:29:54Z"],
    ["3.0.15", "2026-05-29T19:20:01Z"],
    ["3.0.16", "2026-06-03T20:33:57Z"],
    ["3.0.23", "2026-06-10T00:52:44Z"],
    ["3.0.25", "2026-06-17T03:26:31Z"],
    ["3.0.27", "2026-06-17T07:00:25Z"],
    ["3.0.28", "2026-06-19T22:04:12Z"],
    ["3.0.31", "2026-06-27T00:56:45Z"],
    ["3.0.34", "2026-06-29T17:06:12Z"],
  ].map(([version, date]) => ({ version, release_date: timestamp(date) })),
};

for (const agent of Object.values(meta)) {
  agent.version_list.forEach((release, index, list) => {
    release.era = index - list.length + 1;
  });
}

const fillForward = (agentData, versions) => {
  for (const feature of Object.values(agentData.features)) {
    const oldStats = feature.stats;
    const oldVersions = Object.keys(oldStats);
    const lastKnown = oldStats[oldVersions.at(-1)] ?? "u";
    let carried = oldStats[versions[0]] ?? lastKnown;
    feature.stats = Object.fromEntries(
      versions.map((version) => {
        carried = oldStats[version] ?? carried;
        return [version, carried];
      }),
    );
  }
};

const claude = await readJson("data/agents/claude.json");
fillForward(
  claude,
  meta["claude-code"].version_list.map(({ version }) => version),
);

const codex = await readJson("data/agents/codex.json");
fillForward(
  codex,
  meta["codex-cli"].version_list.map(({ version }) => version),
);
for (const version of meta["codex-cli"].version_list.map(({ version }) => version)) {
  if (timestampFor(meta["codex-cli"], version) >= timestamp("2026-05-21T16:48:03Z")) {
    codex.features["hook-subagent-lifecycle"].stats[version] = "y";
  }
  if (timestampFor(meta["codex-cli"], version) >= timestamp("2026-05-18T17:39:34Z")) {
    codex.features["hook-compaction"].stats[version] = "y";
  }
}
codex.features["hook-subagent-lifecycle"].notes =
  "SubagentStart and SubagentStop are supported for command hooks.";
codex.features["hook-subagent-lifecycle"].version_notes = {
  "0.133.0": "Added SubagentStart and SubagentStop lifecycle hooks.",
};
codex.features["hook-compaction"].notes =
  "PreCompact and PostCompact run for manual and automatic compaction.";
codex.features["hook-compaction"].version_notes = {
  "0.131.0": "Compact hooks run for local and remote compaction.",
};

const cursor = await readJson("data/agents/cursor.json");
fillForward(
  cursor,
  meta.cursor.version_list.map(({ version }) => version),
);

const copilot = await readJson("data/agents/copilot.json");
copilot.name = "GitHub Copilot CLI";
rebuildFromCurrent(copilot, meta.copilot);
applyBefore(copilot, meta.copilot, "auto-memory", "0.0.384", "n");
applyBefore(copilot, meta.copilot, "mcp-oauth", "0.0.389", "n");
applyBefore(copilot, meta.copilot, "hook-tool-use", "0.0.396", "n");
applyBefore(copilot, meta.copilot, "hook-shell-control", "0.0.396", "n");
applyBefore(copilot, meta.copilot, "hook-file-access", "0.0.396", "n");
applyBefore(copilot, meta.copilot, "lsp-integration", "0.0.399", "n");
applyBefore(copilot, meta.copilot, "hook-agent-stop", "0.0.401", "n");
applyBefore(copilot, meta.copilot, "hook-subagent-lifecycle", "0.0.401", "n");
applyBefore(copilot, meta.copilot, "hook-session-lifecycle", "0.0.402", "n");
applyBefore(copilot, meta.copilot, "mcp-sampling", "1.0.13", "n");
applyBefore(copilot, meta.copilot, "mcp-elicitation", "1.0.14", "n");
applyBefore(copilot, meta.copilot, "scheduled-tasks", "1.0.58", "n");
applyBefore(copilot, meta.copilot, "browser-control", "1.0.64", "n");
applyBefore(copilot, meta.copilot, "background-monitor", "1.0.66", "n");
applyBefore(copilot, meta.copilot, "instruction-imports", "1.0.66", "n");
applySince(copilot, meta.copilot, "hook-agent-stop", "0.0.401", "y");
applySince(
  copilot,
  meta.copilot,
  "hook-subagent-lifecycle",
  "0.0.401",
  "y",
);
applySince(copilot, meta.copilot, "mcp-sampling", "1.0.13", "y");
applySince(copilot, meta.copilot, "mcp-elicitation", "1.0.14", "y");
applySince(copilot, meta.copilot, "mcp-oauth", "0.0.389", "y");
applySince(copilot, meta.copilot, "lsp-integration", "0.0.399", "p");
applySince(copilot, meta.copilot, "lsp-integration", "0.0.422", "y");
applySince(copilot, meta.copilot, "scheduled-tasks", "1.0.58", "p");
applySince(copilot, meta.copilot, "scheduled-tasks", "1.0.66", "y");
applySince(copilot, meta.copilot, "background-monitor", "1.0.66", "y");
applySince(copilot, meta.copilot, "instruction-imports", "1.0.66", "y");
for (const featureId of ["mcp-resources", "mcp-prompts", "mcp-roots"]) {
  applySince(copilot, meta.copilot, featureId, "0.0.374", "u");
}
for (const featureId of ["mcp-streamable-http", "task-management"]) {
  applySince(copilot, meta.copilot, featureId, "0.0.374", "y");
}
for (const featureId of ["semantic-search"]) {
  applySince(copilot, meta.copilot, featureId, "0.0.374", "n");
}
for (const featureId of ["org-instructions"]) {
  applySince(copilot, meta.copilot, featureId, "0.0.374", "u");
}
applyBefore(copilot, meta.copilot, "hook-mcp-control", "0.0.396", "n");
applySince(copilot, meta.copilot, "hook-mcp-control", "0.0.396", "y");
copilot.features["mcp-sampling"].notes =
  "MCP servers can request model sampling with user approval.";
copilot.features["mcp-elicitation"].notes =
  "The CLI and SDK expose structured elicitation dialogs and callbacks.";
copilot.features["background-monitor"].notes =
  "Detached shell commands can be inspected and stopped; completion notifications are supported.";
copilot.features["scheduled-tasks"].notes =
  "The /after and /every commands schedule one-shot and recurring prompts.";
copilot.features["instruction-imports"].notes =
  "AGENTS.md, CLAUDE.md, and Copilot instruction files support @-style imports.";
copilot.features["mcp-oauth"].notes =
  "OAuth 2.0 with automatic token management, refresh, and headless device-code support.";
copilot.features["lsp-integration"].notes =
  "The local CLI exposes LSP tools and loads plugin-contributed language servers.";
copilot.features["semantic-search"].notes =
  "No embedding-based code search is documented; the CLI uses indexed grep and glob search.";
copilot.features["task-management"].notes =
  "Built-in Task tools and subagents manage parallel work.";
copilot.features["hook-mcp-control"].notes =
  "Generic PreToolUse and PostToolUse hooks can match MCP tool calls.";
copilot.features["org-instructions"].notes =
  "Managed settings exist, but an organization-scoped instruction file for the local CLI is not documented.";
copilot.features["hook-agent-stop"].version_notes = {
  "0.0.401": "Added agentStop and subagentStop hooks.",
};
copilot.features["hook-session-lifecycle"].version_notes = {
  "0.0.402": "Plugins can provide session lifecycle hooks.",
};
copilot.features["mcp-sampling"].version_notes = {
  "1.0.13": "Added MCP sampling with an explicit user approval prompt.",
};
copilot.features["mcp-elicitation"].version_notes = {
  "1.0.14": "SDK participants can respond to pending elicitation requests.",
};
copilot.features["instruction-imports"].version_notes = {
  "1.0.66": "Added @-style imports across supported instruction files.",
};

const cline = await readJson("data/agents/cline.json");
cline.name = "Cline CLI";
rebuildFromCurrent(cline, meta.cline);
applyBefore(cline, meta.cline, "subagent-spawning", "3.0.23", "n");
cline.features["subagent-spawning"].notes =
  "Configured agents can be exposed as subagent tools through the Cline SDK runtime.";
cline.features["auto-memory"].notes =
  "No automatic cross-session memory capability is documented for the SDK runtime.";
cline.features["conversation-resume"].notes =
  "CLI and Hub sessions can be resumed and steered by session ID.";
cline.features["context-compaction"].notes =
  "The SDK runtime compacts oversized context and truncates large tool results.";

await writeJson("data/agents.json", meta);
await writeJson("data/agents/claude.json", claude);
await writeJson("data/agents/codex.json", codex);
await writeJson("data/agents/cursor.json", cursor);
await writeJson("data/agents/copilot.json", copilot);
await writeJson("data/agents/cline.json", cline);

function timestampFor(agent, version) {
  return agent.version_list.find((release) => release.version === version)
    .release_date;
}

function rebuildFromCurrent(agentData, agentMeta) {
  const previousCurrent = Object.values(agentData.features)[0].stats;
  const previousVersion = Object.keys(previousCurrent).at(-1);
  for (const feature of Object.values(agentData.features)) {
    const current = feature.stats[previousVersion] ?? "u";
    feature.stats = Object.fromEntries(
      agentMeta.version_list.map(({ version }) => [version, current]),
    );
    delete feature.version_notes;
  }
}

function applyBefore(agentData, agentMeta, featureId, firstVersion, code) {
  const boundary = timestampFor(agentMeta, firstVersion);
  for (const release of agentMeta.version_list) {
    if (release.release_date < boundary) {
      agentData.features[featureId].stats[release.version] = code;
    }
  }
}

function applySince(agentData, agentMeta, featureId, firstVersion, code) {
  const boundary = timestampFor(agentMeta, firstVersion);
  for (const release of agentMeta.version_list) {
    if (release.release_date >= boundary) {
      agentData.features[featureId].stats[release.version] = code;
    }
  }
}
