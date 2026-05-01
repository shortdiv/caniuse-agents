import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type {
  Agent,
  AgentFeatureStats,
  CaniuseFeatureData,
  CaniuseSupportCode,
  CategorizedFeature,
  FeatureCategory,
  FeatureSupport,
} from "./types.js";

const loadCategories = async (): Promise<FeatureCategory[]> => {
  const names = await readdir("./data/features");
  const jsonNames = names.filter((name) => name.endsWith(".json"));
  const files = await Promise.all(
    jsonNames.map(
      async (name) =>
        await readFile(resolve("./data/features", name), {
          encoding: "utf8",
        }),
    ),
  );
  return files.map((file) => JSON.parse(file.toString()) as FeatureCategory);
};

const loadAgentMeta = async (): Promise<
  Record<string, { name: string; vendor: string; url: string; current_version: string; version_list: { version: string; release_date: number; era: number; models?: string[] }[] }>
> => {
  const raw = await readFile(resolve("./data/agents.json"), {
    encoding: "utf8",
  });
  return JSON.parse(raw);
};

const loadAgents = async (): Promise<Agent[]> => {
  const names = await readdir("./data/agents");
  const jsonNames = names.filter((name) => name.endsWith(".json"));
  const [files, meta] = await Promise.all([
    Promise.all(
      jsonNames.map((name) =>
        readFile(resolve("./data/agents", name), { encoding: "utf8" }),
      ),
    ),
    loadAgentMeta(),
  ]);

  return files.map((file) => {
    const agent = JSON.parse(file.toString()) as Agent;
    const agentMeta = meta[agent.id];
    if (agentMeta) {
      agent.versions = agentMeta.version_list.map((v) => ({
        version: v.version,
        date: new Date(v.release_date * 1000).toISOString().split("T")[0],
        models: v.models,
      }));
      agent.current_version = agentMeta.current_version;
    }
    return agent;
  });
};

const loadFeatures = async (): Promise<CategorizedFeature[]> => {
  const categories = await loadCategories();

  return categories.flatMap((category) =>
    category.features.map((feature) => ({
      ...feature,
      category: {
        category: category.category,
        title: category.title,
        description: category.description,
      },
    })),
  );
};

const isStatsFeature = (
  feature: FeatureSupport | AgentFeatureStats,
): feature is AgentFeatureStats => "stats" in feature;

const supportToCaniuseCode = (support: FeatureSupport): CaniuseSupportCode => {
  switch (support.support) {
    case "full":
      return "y";
    case "partial":
    case "beta":
      return "a";
    case "flag":
    case "via-mcp":
    case "via-skill":
    case "via-extension":
      return "p";
    case "deprecated":
      return "d";
    case "unknown":
      return "u";
    case "no":
    default:
      return "n";
  }
};

const caniuseCodeToSupport = (code: CaniuseSupportCode): FeatureSupport => {
  switch (code) {
    case "y":
      return { support: "full" };
    case "a":
      return { support: "partial" };
    case "p":
      return { support: "flag" };
    case "d":
      return { support: "deprecated" };
    case "u":
      return { support: "unknown" };
    case "n":
    default:
      return { support: "no" };
  }
};

const getCurrentFeatureSupport = (
  agent: Agent,
  featureId: string,
): FeatureSupport => {
  const featureSupport = agent.features[featureId];

  if (!featureSupport) {
    return { support: "unknown" };
  }

  if (!isStatsFeature(featureSupport)) {
    return featureSupport;
  }

  const latestVersion = agent.versions?.at(-1)?.version;

  if (!latestVersion) {
    return {
      support: "unknown",
      notes: featureSupport.notes,
    };
  }

  return {
    ...caniuseCodeToSupport(featureSupport.stats[latestVersion] ?? "u"),
    notes: featureSupport.notes,
  };
};

const getFeatureData = async (
  featureId: string,
): Promise<CaniuseFeatureData | null> => {
  const [features, agents] = await Promise.all([loadFeatures(), loadAgents()]);
  const feature = features.find((entry) => entry.id === featureId);

  if (!feature) {
    return null;
  }

  const stats = Object.fromEntries(
    agents.map((agent) => {
      const featureSupport = agent.features[featureId];
      const versions = agent.versions ?? [];

      if (featureSupport && isStatsFeature(featureSupport)) {
        return [agent.id, featureSupport.stats];
      }

      const normalizedSupport = featureSupport ?? { support: "unknown" };
      const versionStats = Object.fromEntries(
        versions.map((version) => {
          const isAvailable =
            normalizedSupport.since == null ||
            version.date >= normalizedSupport.since.date;

          const supportCode = isAvailable
            ? supportToCaniuseCode(normalizedSupport)
            : "n";

          return [version.version, supportCode];
        }),
      );

      return [agent.id, versionStats];
    }),
  );

  return {
    id: feature.id,
    title: feature.title,
    description: feature.description,
    category: feature.category.title,
    stats,
  };
};

export {
  loadCategories,
  loadAgents,
  loadFeatures,
  getCurrentFeatureSupport,
  getFeatureData,
};
