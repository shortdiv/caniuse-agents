import { expect, describe, it, beforeAll } from "@jest/globals";
import { getAgentVersion, resolveChangelog } from "./readAndParseChangelog";

const TIMEOUT = 15000;

// claude-code  version_regex: ^## 1.x.x
describe("claude-code", () => {
  let result: Awaited<ReturnType<typeof resolveChangelog>>;

  beforeAll(async () => {
    result = await resolveChangelog("claude-code");
  }, TIMEOUT);

  it("resolves changelog url", () => {
    expect(result).toHaveProperty("url");
    expect(result.source).toBe("github");
  });

  it("extracts semver", async () => {
    const version = await getAgentVersion(result);
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  }, TIMEOUT);
});

// cline CLI stable releases use cli-v3.x.x tags
describe("cline", () => {
  let result: Awaited<ReturnType<typeof resolveChangelog>>;

  beforeAll(async () => {
    result = await resolveChangelog("cline");
  }, TIMEOUT);

  it("resolves changelog url", () => {
    expect(result).toHaveProperty("url");
    expect(result.source).toBe("github-releases");
  });

  it("extracts bracketed semver", async () => {
    const version = await getAgentVersion(result);
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  }, TIMEOUT);
});

// codex stable releases use rust-v0.x.x tags; alpha tags are excluded by the regex
describe("codex", () => {
  let result: Awaited<ReturnType<typeof resolveChangelog>>;

  beforeAll(async () => {
    result = await resolveChangelog("codex");
  }, TIMEOUT);

  it("resolves changelog url", () => {
    expect(result).toHaveProperty("url");
    expect(result.source).toBe("github-releases");
  });

  it("extracts stable semver", async () => {
    const version = await getAgentVersion(result);
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  }, TIMEOUT);
});

// copilot  version_regex: ^## 1.x.x (with optional pre-release suffix)
describe("copilot", () => {
  let result: Awaited<ReturnType<typeof resolveChangelog>>;

  beforeAll(async () => {
    result = await resolveChangelog("copilot");
  }, TIMEOUT);

  it("resolves changelog url", () => {
    expect(result).toHaveProperty("url");
    expect(result.source).toBe("github");
  });

  it("extracts semver with optional pre-release", async () => {
    const version = await getAgentVersion(result);
    expect(version).toMatch(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);
  }, TIMEOUT);
});

// cursor  version_regex: ^## 1.x.x (JS-rendered marketing page — fetch gets pre-render shell)
describe("cursor", () => {
  let result: Awaited<ReturnType<typeof resolveChangelog>>;

  beforeAll(async () => {
    result = await resolveChangelog("cursor");
  }, TIMEOUT);

  it("resolves changelog url", () => {
    expect(result).toHaveProperty("url");
    expect(result.source).toBe("marketing");
  });

  it.todo("extracts semver from marketing page (requires JS rendering)");
});
