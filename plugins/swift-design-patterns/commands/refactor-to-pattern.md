---
description: >-
  Refactor Swift code toward a fitting design pattern, honoring the project's
  conventions. Usage: /refactor-to-pattern <paste Swift code or describe the
  smell>
argument-hint: "[Swift code or a code smell]"
---

The user invoked `/refactor-to-pattern` with: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask them to paste the Swift code or describe the smell,
then stop. Otherwise, using the `swift-design-patterns` skill:

1. Look for the project's conventions file **first** (`.swift-architecture.md`,
   `.claude/swift-architecture.md`, `.claude/swift-conventions.md`, or
   `ARCHITECTURE.md` at the project root) and honor the team's architecture and
   idioms over generic defaults.
2. Read `references/catalog.md` and pick the best-fit pattern(s) for the code
   or smell.
3. Read `references/patterns/<id>.md` for the top candidate for its reference
   and idiomatic Swift example.
4. Propose a concrete refactor of the user's code toward that pattern, in
   idiomatic Swift that matches the project conventions: show the key
   before/after, keep it minimal, and call out the main trade-off and when
   **not** to apply it.

Flag when a plain Swift feature (closure, enum, protocol) is simpler than the
pattern.
