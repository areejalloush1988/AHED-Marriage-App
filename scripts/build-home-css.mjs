import { readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";

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

const insideDirectory = new URL("inside/", appDirectory);
const insideSource = await readFile(new URL("inside.css", insideDirectory), "utf8");
const insideRoot = postcss.parse(insideSource);

const scopeForAndroidPhone = (selector) => selector
  .split(",")
  .map((part) => `html.ahed-samsung-phone ${part.trim()}`)
  .join(",\n");

const isResponsiveRule = (rule) => {
  let parent = rule.parent;
  while (parent && parent.type !== "root") {
    if (parent.type === "atrule" && parent.name === "media" && /max-width\s*:/i.test(parent.params)) {
      return true;
    }
    parent = parent.parent;
  }
  return false;
};

const responsiveRules = [];
const fontRules = [];

insideRoot.walkRules((rule) => {
  if (rule.selector.includes("ahed-samsung-phone")) return;

  if (isResponsiveRule(rule)) {
    const declarations = rule.nodes
      .filter((node) => node.type === "decl")
      .map((node) => `  ${node.toString()};`)
      .join("\n");
    if (declarations) {
      responsiveRules.push(`${scopeForAndroidPhone(rule.selector)} {\n${declarations}\n}`);
    }
  }

  const fontSize = rule.nodes.find((node) => node.type === "decl" && node.prop === "font-size");
  if (!fontSize) return;

  const value = fontSize.value.trim();
  const boostedValue = /^(?:0|0px|0rem|0em)$/.test(value)
    ? "0"
    : `calc(${value} + 4px)`;
  fontRules.push(`${scopeForAndroidPhone(rule.selector)} {\n  font-size: ${boostedValue} !important;\n}`);
});

const samsungPhoneOutput = [
  "/* Generated from inside.css. Do not edit directly. */",
  "/* Android/Samsung phone layout: full interface +30%, each declared font size +4px. */",
  `html.ahed-samsung-phone,
html.ahed-samsung-phone body {
  overflow-x: hidden;
}

html.ahed-samsung-phone .inside-app {
  width: calc(100% / 1.3);
  min-height: calc(100svh / 1.3);
  font-size: 20px !important;
  zoom: 1.3;
}

html.ahed-samsung-phone .inside-mobile-nav {
  right: 0;
  left: auto;
  width: calc(100vw / 1.3);
}

html.ahed-samsung-phone .message-action-backdrop {
  right: 0;
  left: auto;
  width: calc(100vw / 1.3);
  min-height: calc(100svh / 1.3);
}`,
  "/* Force the phone layout even when Samsung Browser reports a desktop-sized viewport. */",
  ...responsiveRules,
  "/* Add exactly four CSS pixels to every declared text size. */",
  ...fontRules,
].join("\n\n");

await writeFile(
  new URL("samsung-phone.generated.css", insideDirectory),
  `${samsungPhoneOutput}\n`,
  "utf8",
);
console.log("Generated app/inside/samsung-phone.generated.css for Android/Samsung phones.");
