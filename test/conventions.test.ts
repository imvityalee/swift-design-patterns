import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONVENTIONS_FILES,
  CONVENTIONS_TEMPLATE,
  conventionsHeader,
  noConventionsMessage,
} from "../src/conventions.js";

test("candidate file list prioritises the harness-neutral root path", () => {
  assert.ok(CONVENTIONS_FILES.length >= 1);
  assert.equal(CONVENTIONS_FILES[0], ".swift-architecture.md");
});

test("candidate file list keeps the .claude/ path for back-compat", () => {
  assert.ok(CONVENTIONS_FILES.includes(".claude/swift-architecture.md"));
});

test("template covers the key sections", () => {
  for (const section of [
    "## Architecture",
    "## Dependency management",
    "## Discouraged / banned patterns",
    "## Team-specific patterns & idioms",
  ]) {
    assert.ok(CONVENTIONS_TEMPLATE.includes(section), `missing section: ${section}`);
  }
});

test("header references the file path", () => {
  assert.ok(conventionsHeader(".claude/swift-architecture.md").includes(".claude/swift-architecture.md"));
});

test("not-found message embeds the template and the project dir", () => {
  const msg = noConventionsMessage("/tmp/proj");
  assert.ok(msg.includes("/tmp/proj"));
  assert.ok(msg.includes("Swift Architecture & Conventions"));
  assert.ok(
    msg.includes(".swift-architecture.md"),
    "should suggest the harness-neutral path, not a Claude-only one",
  );
});
