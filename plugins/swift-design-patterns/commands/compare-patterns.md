---
description: >-
  Compare two design patterns side by side — intents, trade-offs, and when to
  pick which. Usage: /compare-patterns Strategy vs State
argument-hint: "[pattern A] vs [pattern B]"
---

The user invoked `/compare-patterns` with: **$ARGUMENTS**

Parse two pattern names from `$ARGUMENTS` (split on "vs", "versus", a comma, or
whitespace). If fewer than two are given, ask which two patterns to compare and
stop.

Use the `swift-design-patterns` skill: read `references/patterns/<id>.md` for
each pattern, then present:

- a short intent line for each pattern,
- a compact comparison of their structure and trade-offs,
- a **"Pick A when… / Pick B when…"** decision guide.

If the two aren't genuine alternatives, say so and explain how they relate
instead of forcing a comparison.
