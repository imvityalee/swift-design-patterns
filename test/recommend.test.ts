import { test } from "node:test";
import assert from "node:assert/strict";
import { patterns } from "../src/catalog.js";
import { recommend, renderPattern } from "../src/format.js";

test("blank query returns no recommendations", () => {
  assert.deepEqual(recommend(patterns, "   ", 3), []);
});

test("ranks Strategy first for an interchangeable-algorithm switch", () => {
  const recs = recommend(
    patterns,
    "huge switch statement selecting between interchangeable algorithms at runtime",
    3,
  );
  assert.ok(recs.length > 0);
  assert.equal(recs[0].pattern.id, "strategy");
});

test("surfaces Decorator for add-responsibilities-without-subclassing", () => {
  const recs = recommend(
    patterns,
    "add responsibilities to an object dynamically without subclassing",
    5,
  );
  assert.ok(recs.some((r) => r.pattern.id === "decorator"));
});

test("respects the limit", () => {
  const recs = recommend(patterns, "object create interface algorithm state behavior", 2);
  assert.ok(recs.length <= 2);
});

test("every recommendation carries matched cues and a positive score", () => {
  const recs = recommend(patterns, "decouple sender from receiver with a request object", 4);
  for (const r of recs) {
    assert.ok(r.score > 0);
    assert.ok(r.matched.length > 0);
  }
});

test("renderPattern includes/omits code per includeCode flag", () => {
  const p = patterns[0];
  assert.ok(renderPattern(p, { includeCode: true }).includes("```swift"));
  assert.ok(!renderPattern(p, { includeCode: false }).includes("```swift"));
});
