---
description: >-
  Look up or recommend a Swift design pattern. With a pattern name, shows the
  full reference and idiomatic Swift example; with a problem description,
  recommends fitting patterns. Usage: /pattern Strategy  or  /pattern I have a
  giant switch selecting between behaviors
argument-hint: "[pattern name OR a design problem]"
---

The user invoked `/pattern` with: **$ARGUMENTS**

Use the `swift-design-patterns` skill and its reference files. Decide what they want:

- If `$ARGUMENTS` names a specific pattern (e.g. "Strategy", "abstract factory",
  "observer"), read `references/patterns/<id>.md` for it and present the intent,
  when-to-use, the Swift examples, and pros/cons. Keep it tight.
- If `$ARGUMENTS` describes a problem or symptom (e.g. "decouple UI from a
  growing set of algorithms"), read `references/catalog.md`, pick the best
  candidates by their intent and "Reach for it when" cues, then read the top
  candidate's reference and explain why it fits plus the main trade-off.
- If `$ARGUMENTS` is empty or just a category, show the catalog from
  `references/catalog.md` (filtered by category if given).

Prefer the bundled references over recalling from memory, and flag when a plain
Swift feature (closure, enum, protocol) is simpler than the pattern.
