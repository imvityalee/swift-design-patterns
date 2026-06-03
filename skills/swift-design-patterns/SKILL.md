---
name: swift-design-patterns
description: >-
  Apply Gang of Four design patterns in Swift. Use when implementing, choosing,
  refactoring toward, or explaining a design pattern in Swift/iOS code — e.g.
  "which pattern fits this?", "refactor this giant switch", "show me Strategy in
  Swift", "decouple this with a pattern", or any mention of Strategy, Factory,
  Observer, Decorator, Adapter, Singleton, Builder, Visitor, etc. in a Swift
  context. Backed by the swift-design-patterns MCP server.
---

# Swift Design Patterns

You have a companion MCP server, **`swift-design-patterns`**, that holds a
curated catalog of all 23 GoF patterns with idiomatic, compile-checked Swift
examples. Prefer its tools over recalling patterns from memory — the examples
are verified against the Swift 6 toolchain and stay consistent.

## Tools

- **`get_project_conventions`** — read the current project's architecture &
  conventions (`.claude/swift-architecture.md`). Call this **first** when
  working in a real project; it tells you the team's architecture, idioms, and
  custom patterns. With `action: "template"` it returns a blank starter.
- **`recommend_pattern`** — give it a free-text description of the design
  problem ("a huge switch picks between behaviors", "add responsibilities
  without subclassing", "one place must stay in sync with many views") and it
  returns ranked candidate patterns with matched cues.
- **`get_pattern`** — fetch the full reference for one pattern (intent, problem,
  solution, applicability, participants, conceptual + real-world Swift examples,
  pros/cons, related patterns). Accepts an id (`abstract-factory`) or display
  name (`Abstract Factory`). Pass `includeCode: false` for a quick summary.
- **`list_patterns`** — browse the catalog, optionally filtered by category
  (`Creational`, `Structural`, `Behavioral`).

## How to work

0. **Honor the project's conventions first.** When working inside a real
   project, call `get_project_conventions` before anything else. If a
   conventions file exists, treat it as authoritative: use the team's
   architecture, layering rules, DI style, naming, and any team-specific or
   banned patterns — *over* the generic catalog. If a pattern you'd suggest
   conflicts with the conventions (e.g. they ban Singletons), follow the
   conventions and say so. If no file exists, proceed with framework-neutral
   defaults and you may offer to scaffold one (`/swift-conventions init`).
1. **Choosing a pattern.** When the user describes a symptom rather than naming
   a pattern, call `recommend_pattern` first, then `get_pattern` on the top
   candidate to confirm fit before proposing it. Briefly say *why* it fits and
   note the trade-offs (the pattern's cons) — don't oversell.
2. **Implementing a named pattern.** Call `get_pattern` to ground your code in
   the catalog's idiomatic structure, then adapt it to the user's actual types
   and naming. Don't paste the example verbatim — fit it to their codebase.
3. **Explaining.** Use the pattern's intent/problem/solution and participants
   from `get_pattern`; show the conceptual example for the shape and the
   real-world example for practical context.

## Judgment

- Patterns are a means, not a goal. If a Swift-native feature is simpler — a
  closure instead of a single-method Strategy, an `enum` instead of a State
  hierarchy, protocols/generics instead of boilerplate — say so and prefer it.
- Match the surrounding code's conventions when writing into an existing
  project. Value types and protocol-oriented design are usually the Swift-idiomatic
  default.
- Mention related patterns when a neighbor (Strategy vs State, Adapter vs
  Bridge, Factory Method vs Abstract Factory) might be the better fit.
