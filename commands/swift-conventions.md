---
description: >-
  View or scaffold this project's Swift architecture & conventions file
  (.swift-architecture.md) that the design-patterns plugin reads and
  honors. Usage: /swift-conventions  (view)  ·  /swift-conventions init  (create)
argument-hint: "[init | view]"
---

The user invoked `/swift-conventions` with: **$ARGUMENTS**

- If `$ARGUMENTS` is `init`, `scaffold`, `create`, or `new`:
  1. Call `get_project_conventions` with `action: "template"` to get the
     starter template.
  2. If `.swift-architecture.md` already exists in the project, show it
     and ask before overwriting.
  3. Otherwise write the template to `.swift-architecture.md` in the
     project root, then tell the user to fill in the sections (especially
     **Architecture**, **Dependency management**, and **Team-specific patterns
     & idioms** — that last section is where they capture their own patterns
     beyond the GoF catalog).

- Otherwise (no args or `view`/`show`): call `get_project_conventions` and
  display the project's current conventions. If none exist, tell the user and
  offer to scaffold one with `/swift-conventions init`.

These conventions are authoritative — once set, follow them over the generic
catalog when proposing or implementing patterns in this project.
