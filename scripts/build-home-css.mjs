import { readFile, writeFile } from "node:fs/promises";

const appDirectory = new URL("../app/", import.meta.url);
const partNames = Array.from(
  { length: 6 },
  (_unused, index) => `home-${index + 1}.module.css`,
);

const parts = await Promise.all(
  partNames.map((name) => readFile(new URL(name, appDirectory), "utf8")),
);

const output = [
  "/* Generated from the split AHED landing-page styles. Do not edit directly. */",
  ...parts,
].join("\n\n");

await writeFile(new URL("home.module.css", appDirectory), output, "utf8");
console.log(`Generated app/home.module.css from ${partNames.length} source files.`);
