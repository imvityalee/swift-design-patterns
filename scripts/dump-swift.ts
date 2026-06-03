// Dev-only: write every Swift example to disk so swiftc can type-check them.
import { patterns } from "../src/catalog.js";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const outDir = process.argv[2] ?? "/tmp/sdp-swift";
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const p of patterns) {
  writeFileSync(resolve(outDir, `${p.id}.conceptual.swift`), p.conceptual.code + "\n");
  writeFileSync(resolve(outDir, `${p.id}.realworld.swift`), p.realWorld.code + "\n");
}
console.log(`wrote ${patterns.length * 2} files to ${outDir}`);
