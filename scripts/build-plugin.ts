// Dev-only: render the TypeScript catalog into the Markdown-only Claude plugin
// at plugins/swift-design-patterns (no MCP server, no scripts — the form the
// Claude plugin directory accepts). Run with: npm run build:plugin
import { patterns, categories } from "../src/catalog.js";
import { renderPattern } from "../src/format.js";
import { CONVENTIONS_FILES, CONVENTIONS_TEMPLATE } from "../src/conventions.js";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const refDir = resolve("plugins/swift-design-patterns/skills/swift-design-patterns/references");
rmSync(refDir, { recursive: true, force: true });
mkdirSync(resolve(refDir, "patterns"), { recursive: true });

for (const p of patterns) {
  writeFileSync(resolve(refDir, "patterns", `${p.id}.md`), renderPattern(p, { includeCode: true }));
}

const idx: string[] = [
  "# Pattern catalog index",
  "",
  "All 23 GoF patterns. Each entry links to its full reference (intent, problem,",
  "solution, participants, conceptual + real-world Swift examples, pros/cons).",
  "Use the **Reach for it when** cues to recommend patterns for a described problem.",
  "",
];
for (const c of categories) {
  idx.push(`## ${c}`, "");
  for (const p of patterns.filter((x) => x.category === c)) {
    const aka = p.alsoKnownAs?.length ? ` _(aka ${p.alsoKnownAs.join(", ")})_` : "";
    idx.push(`### [${p.name}](patterns/${p.id}.md)${aka}`, "");
    idx.push(`- **Id:** \`${p.id}\``);
    idx.push(`- **Intent:** ${p.intent}`);
    idx.push(`- **Reach for it when:** ${p.whenToReachFor.join("; ")}`);
    if (p.relatedPatterns.length) idx.push(`- **Related:** ${p.relatedPatterns.join(", ")}`);
    idx.push("");
  }
}
writeFileSync(resolve(refDir, "catalog.md"), idx.join("\n"));

writeFileSync(
  resolve(refDir, "conventions-template.md"),
  `<!-- Starter for a project's conventions file. Looked up, in order: ${CONVENTIONS_FILES.join(", ")} -->\n\n` +
    CONVENTIONS_TEMPLATE,
);
console.log(`wrote ${patterns.length} pattern references + catalog.md + conventions-template.md to ${refDir}`);
