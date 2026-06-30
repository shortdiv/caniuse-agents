import { readdir, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));

const meta = await readJson("data/agents.json");
const featureFiles = (await readdir(new URL("data/features/", root))).filter(
  (name) => name.endsWith(".json"),
);
const featureIds = new Set(
  (
    await Promise.all(
      featureFiles.map((name) => readJson(`data/features/${name}`)),
    )
  ).flatMap((category) => category.features.map((feature) => feature.id)),
);
const agentFiles = (await readdir(new URL("data/agents/", root))).filter(
  (name) => name.endsWith(".json"),
);
const agents = await Promise.all(
  agentFiles.map((name) => readJson(`data/agents/${name}`)),
);
const errors = [];
const supportCodes = new Set(["y", "a", "n", "u", "p", "d"]);

for (const agent of agents) {
  const agentMeta = meta[agent.id];
  if (!agentMeta) {
    errors.push(`${agent.id}: missing metadata`);
    continue;
  }
  const versions = agentMeta.version_list.map((release) => release.version);
  const versionSet = new Set(versions);
  if (agentMeta.current_version !== versions.at(-1)) {
    errors.push(`${agent.id}: current_version is not the final version`);
  }
  agentMeta.version_list.forEach((release, index) => {
    const expectedEra = index - agentMeta.version_list.length + 1;
    if (release.era !== expectedEra) {
      errors.push(`${agent.id} ${release.version}: expected era ${expectedEra}`);
    }
    if (
      index > 0 &&
      release.release_date <= agentMeta.version_list[index - 1].release_date
    ) {
      errors.push(`${agent.id} ${release.version}: release dates are not increasing`);
    }
  });

  for (const featureId of featureIds) {
    const feature = agent.features[featureId];
    if (!feature?.stats) {
      errors.push(`${agent.id}: missing feature ${featureId}`);
      continue;
    }
    for (const version of versions) {
      if (!(version in feature.stats)) {
        errors.push(`${agent.id} ${featureId}: missing version ${version}`);
      } else if (!supportCodes.has(feature.stats[version])) {
        errors.push(
          `${agent.id} ${featureId} ${version}: invalid code ${feature.stats[version]}`,
        );
      }
    }
    for (const version of Object.keys(feature.stats)) {
      if (!versionSet.has(version)) {
        errors.push(`${agent.id} ${featureId}: unknown version ${version}`);
      }
    }
  }
}

for (const agentId of Object.keys(meta)) {
  if (!agents.some((agent) => agent.id === agentId)) {
    errors.push(`${agentId}: metadata has no agent data file`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Validated ${agents.length} agents, ${featureIds.size} features, and complete version matrices.`,
  );
}
