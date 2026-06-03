import { test } from "node:test";
import assert from "node:assert/strict";
import { patterns, byId, categories } from "../src/catalog.js";

const KEBAB = /^[a-z]+(-[a-z]+)*$/;
const validCategories = new Set(categories);
const ids = new Set(patterns.map((p) => p.id));

test("catalog has 23 patterns", () => {
  assert.equal(patterns.length, 23);
});

test("ids are unique and kebab-case", () => {
  assert.equal(ids.size, patterns.length);
  for (const p of patterns) assert.ok(KEBAB.test(p.id), `bad id: ${p.id}`);
});

test("byId resolves every pattern", () => {
  assert.equal(byId.size, patterns.length);
  for (const p of patterns) assert.equal(byId.get(p.id), p);
});

test("each pattern has a valid category", () => {
  for (const p of patterns) assert.ok(validCategories.has(p.category), `${p.id}: ${p.category}`);
});

test("relatedPatterns reference existing, non-self ids", () => {
  for (const p of patterns) {
    for (const rel of p.relatedPatterns) {
      assert.ok(ids.has(rel), `${p.id} -> unknown related "${rel}"`);
      assert.notEqual(rel, p.id, `${p.id} references itself`);
    }
  }
});

test("required content fields are populated", () => {
  for (const p of patterns) {
    assert.ok(p.name.length > 0, `${p.id} name`);
    assert.ok(p.intent.length > 10, `${p.id} intent`);
    assert.ok(p.problem.length > 10, `${p.id} problem`);
    assert.ok(p.solution.length > 10, `${p.id} solution`);
    assert.ok(p.applicability.length >= 1, `${p.id} applicability`);
    assert.ok(p.participants.length >= 2, `${p.id} participants`);
    assert.ok(p.conceptual.code.includes("\n"), `${p.id} conceptual code`);
    assert.ok(p.realWorld.code.includes("\n"), `${p.id} realWorld code`);
    assert.ok(p.pros.length >= 1 && p.cons.length >= 1, `${p.id} pros/cons`);
    assert.ok(p.whenToReachFor.length >= 3, `${p.id} whenToReachFor`);
  }
});

test("swift code has no JS template-literal hazards", () => {
  for (const p of patterns) {
    for (const code of [p.conceptual.code, p.realWorld.code]) {
      assert.ok(!code.includes("${"), `${p.id} contains a JS-template sequence in Swift code`);
    }
  }
});
