---
description: >-
  Recommend Swift design patterns for a described design problem (ranked, with
  the cues that matched). Usage: /recommend-pattern a huge switch picks between
  interchangeable algorithms at runtime
argument-hint: "[describe your design problem]"
---

The user invoked `/recommend-pattern` with: **$ARGUMENTS**

- If `$ARGUMENTS` is empty, ask them to describe the design problem in a sentence
  (the symptom or the change they're trying to make), then stop.
- Otherwise call the `recommend_pattern` tool with `$ARGUMENTS` as the problem
  description. Present the ranked candidates, each with its matched cues and a
  one-line reason it fits.
- Offer to run `/pattern <top candidate>` for the full reference and idiomatic
  Swift example.

Prefer the `swift-design-patterns` MCP tools over recalling from memory, and flag
when a plain Swift feature (closure, enum, protocol) is simpler than any pattern.
