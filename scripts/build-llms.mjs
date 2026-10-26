// Writes public/llms.txt from the data, so it never drifts from the site. Runs before every build.
import { readdir, readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));

const meta = await readJson("data/agents.json");
const categories = await Promise.all(
  (await readdir(new URL("data/features/", root)))
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => readJson(`data/features/${name}`)),
);

const month = (ts) => new Date(ts * 1000).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
const agents = Object.values(meta);
const names = agents.map((a) => a.name);
const list = `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;

const lines = [
  "# Can I Use Agents?",
  "",
  `> A community-maintained compatibility table for AI coding agent features, modeled after caniuse.com. Tracks hooks, MCP, tools, instructions, and memory support across ${list}.`,
  "",
  "This site compares feature support across AI coding agents with version-level granularity. Each feature page shows a time-aligned matrix of support across agents, similar to how caniuse.com compares browser support for web standards. Data is stored as JSON and open for community contributions.",
  "",
  "## Agents Tracked",
  "",
  ...agents.map((a) => {
    const v = a.version_list;
    return `- ${a.long_name ?? a.name}: ${v.length} versions from ${v[0].version} (${month(v[0].release_date)}) to ${v.at(-1).version} (${month(v.at(-1).release_date)})${a.note ? `. ${a.note}` : ""}`;
  }),
  "",
  ...categories.flatMap((c) => [
    `## ${c.title}: ${c.features.length} features`,
    "",
    ...c.features.map((f) => `- [${f.title}](/features/${f.id}): ${f.description}`),
    "",
  ]),
  "## Data",
  "",
  "- [agents.json](/data/agents.json): Version metadata with release dates and era positions for all tracked agents",
  "- [Feature definitions](/data/features/): JSON files defining all tracked features by category",
  "- [Agent data](/data/agents/): Per-agent JSON files with version-by-version support codes (y/n/a/u/p/d)",
  "",
  "## Optional",
  "",
  "- [Index page](/): Homepage with category index, feature search, and browseable feature list",
  "- [Feature index](/features/): Alphabetical listing of all tracked features",
  "",
];
await writeFile(new URL("public/llms.txt", root), lines.join("\n"));
console.log(`llms.txt: ${agents.length} agents, ${categories.reduce((n, c) => n + c.features.length, 0)} features`);
