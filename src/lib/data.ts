import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const loadCategories = async () => {
  const names = await readdir("./data/features");
  const jsonNames = names.filter((name) => name.endsWith(".json"));
  const files = await Promise.all(
    jsonNames.map(async (name) => {
      const contents = await readFile(resolve("./data/features", name), {
        encoding: "utf8",
      });
      return contents;
    }),
  );
  return files.map((file) => JSON.parse(file.toString()));
};

const loadAgents = async () => {
  const names = await readdir("./data/agents");
  const files = await Promise.all(
    names.map((name) =>
      readFile(resolve("./data/agents", name), { encoding: "utf8" }),
    ),
  );
  return files.map((file) => JSON.parse(file.toString()));
};

export { loadCategories, loadAgents };
