---
description: >-
  Refactor Swift code toward a fitting design pattern, honoring the project's
  conventions. Usage: /refactor-to-pattern <paste Swift code or describe the
  smell>
argument-hint: "[Swift code or a code smell]"
---

The user invoked `/refactor-to-pattern` with: **$ARGUMENTS**

If `$ARGUMENTS` is empty, ask them to paste the Swift code or describe the smell,
then stop. Otherwise:

1. Call `get_project_conventions` **first** and honor the team's architecture and
   idioms over generic defaults.
2. Call `recommend_pattern` with `$ARGUMENTS` (the code or smell) to find the
   best-fit pattern(s).
3. Call `get_pattern` on the top candidate for its reference and idiomatic Swift
   example.
4. Propose a concrete refactor of the user's code toward that pattern, in
   idiomatic Swift that matches the project conventions: show the key before/after,
   keep it minimal, and call out the main trade-off and when **not** to apply it.

Flag when a plain Swift feature (closure, enum, protocol) is simpler than the
pattern.
