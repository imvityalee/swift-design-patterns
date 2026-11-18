---
description: >-
  View or scaffold this project's Swift architecture & conventions file
  (.claude/swift-architecture.md) that the design-patterns plugin reads and
  honors. Usage: /swift-conventions  (view)  ·  /swift-conventions init  (create)
argument-hint: "[init | view]"
---

The user invoked `/swift-conventions` with: **$ARGUMENTS**

Conventions files are looked up at the project root, in order:
`.swift-architecture.md`, `.claude/swift-architecture.md`,
`.claude/swift-conventions.md`, `ARCHITECTURE.md`.

- If `$ARGUMENTS` is `init`, `scaffold`, `create`, or `new`:
  1. Read the starter template from the `swift-design-patterns` skill's
     `references/conventions-template.md`.
  2. If a conventions file already exists, show it, ask before overwriting, and
     edit that existing file in place (don't create a second one).
  3. Otherwise write the template to `.claude/swift-architecture.md`, then tell
     the user to fill in the sections (especially **Architecture**,
     **Dependency management**, and **Team-specific patterns & idioms** — that
     last section is where they capture their own patterns beyond the GoF
     catalog).

- Otherwise (no args or `view`/`show`): read the project's conventions file and
  display it. If none exists, tell the user and offer to scaffold one with
  `/swift-conventions init`.

These conventions are authoritative — once set, follow them over the generic
catalog when proposing or implementing patterns in this project.
