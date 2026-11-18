---
description: >-
  Browse the 23 GoF pattern catalog, optionally filtered by category.
  Usage: /list-patterns  or  /list-patterns Behavioral
argument-hint: "[category: Creational | Structural | Behavioral]"
---

The user invoked `/list-patterns` with: **$ARGUMENTS**

Use the `swift-design-patterns` skill and read its `references/catalog.md`:

- If `$ARGUMENTS` names a category (Creational, Structural, Behavioral), show
  only that category.
- Otherwise list the whole catalog grouped by category.

Present a scannable list — each pattern as name + a one-line intent. If
`$ARGUMENTS` actually names a specific pattern (e.g. "Observer"), point the user
to `/pattern <name>` for its full reference instead.
