---
name: swift-design-patterns
description: >-
  Use when choosing, recommending, comparing, refactoring toward, or explaining a
  Gang-of-Four design pattern in Swift / iOS code — e.g. "which pattern fits this?",
  "refactor this giant switch", "compare Strategy and State", "show Observer in
  Swift", or any mention of Strategy, Factory, Observer, Decorator, Adapter,
  Singleton, Builder, Visitor, etc. in Swift. Drives the swift-design-patterns MCP
  tools (recommend_pattern, get_pattern, list_patterns, get_project_conventions).
---

# Swift Design Patterns

You have the **`swift-design-patterns`** MCP server connected — a curated catalog
of all 23 Gang-of-Four patterns with idiomatic, compile-checked Swift examples.
Prefer its tools over recalling patterns from memory.

## Tools

- **`get_project_conventions`** — read the project's architecture & conventions
  file (`.swift-architecture.md` at the repo root, or `.claude/swift-architecture.md`
  in Claude projects). Call this **first** in a real project and follow it over
  generic defaults.
- **`recommend_pattern`** — give it a plain-text design problem ("a huge switch
  picks between interchangeable algorithms at runtime") and it returns ranked
  candidate patterns with the cues that matched.
- **`get_pattern`** — full reference for one pattern (intent, when-to-use, Swift
  examples, pros/cons). Accepts an id (`abstract-factory`) or name.
- **`list_patterns`** — browse the catalog, optionally filtered by category
  (Creational / Structural / Behavioral).

## How to respond

Infer the user's intent from what they ask (no special command syntax needed):

- **Recommend** (a problem, a smell, "which pattern fits…?") → `recommend_pattern`,
  then `get_pattern` on the top candidate; explain why it fits and the main
  trade-off.
- **Look up** (names a specific pattern) → `get_pattern`; present intent,
  when-to-use, the Swift example, and pros/cons. Keep it tight.
- **List / browse** → `list_patterns` (filter by category if asked).
- **Compare two patterns** ("Strategy vs State") → `get_pattern` on each; contrast
  intent, structure, and trade-offs, and give a "pick A when… / pick B when…"
  guide. If they aren't real alternatives, say so.
- **Refactor toward a pattern** (code or a smell) → `get_project_conventions`
  first, then `recommend_pattern`, then `get_pattern`; propose a concrete
  before/after refactor in idiomatic Swift that matches the project's conventions,
  and call out the main trade-off and when **not** to apply it.

Always honor the project's conventions over generic defaults, and flag when a
plain Swift feature (closure, enum, protocol) is simpler than the pattern.
