import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readAgentFiles(agentName: string) {
  const fullPath = path.join(__dirname, "../agents", `${agentName}.yaml`);
  const content = await readFile(fullPath, "utf-8");
  return yaml.load(content) as Record<string, any>;
}

type ChangelogMeta = {
  url: string;
  source: string;
  versionRegex: string | undefined;
};

async function getAgentVersion(agentMetadata: ChangelogMeta) {
  const response = await fetch(agentMetadata.url);
  if (!response.body) throw new Error(`No response body from ${agentMetadata.url}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const regex = agentMetadata.versionRegex
    ? new RegExp(agentMetadata.versionRegex, "m")
    : /^##\s+(\d+\.\d+\.\d+)/m;

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const match = buffer.match(regex);
    if (match) {
      await reader.cancel();
      return match[1];
    }
  }

  throw new Error(`No version found in changelog for ${agentMetadata.url}`);
}

async function resolveChangelog(agentName: string): Promise<ChangelogMeta> {
  const agent = await readAgentFiles(agentName);

  if (agent.sources?.changelog) {
    const isGithub = agent.sources.changelog.includes("github.com");
    const changelogUrl = isGithub
      ? agent.sources.changelog
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/refs/heads/")
      : agent.sources.changelog;

    return {
      url: changelogUrl,
      source: isGithub ? "github" : "marketing",
      versionRegex: agent.version_regex,
    };
  }

  if (agent.sources?.releases) {
    return {
      url: agent.sources.releases,
      source: "github-releases",
      versionRegex: agent.version_regex,
    };
  }

  if (agent.homepage) {
    return {
      url: agent.homepage,
      source: "homepage",
      versionRegex: agent.version_regex,
    };
  }

  throw new Error(`No changelog source for ${agentName}`);
}

export { getAgentVersion, resolveChangelog };
