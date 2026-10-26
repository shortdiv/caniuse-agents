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

// opencode: the npm registry's latest dist-tag (its release feed mixes in other artifacts)
describe("opencode", () => {
  let result: Awaited<ReturnType<typeof resolveChangelog>>;

  beforeAll(async () => {
    result = await resolveChangelog("opencode");
  }, TIMEOUT);

  it("resolves the version api", () => {
    expect(result.source).toBe("api");
  });

  it("extracts semver", async () => {
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
    expect(result.source).toBe("api");
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

  it("resolves the download api", () => {
    expect(result.source).toBe("api");
  });

  it("extracts major.minor.patch", async () => {
    const version = await getAgentVersion(result);
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  }, TIMEOUT);
});
