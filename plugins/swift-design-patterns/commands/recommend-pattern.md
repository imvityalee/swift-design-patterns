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
- Otherwise use the `swift-design-patterns` skill: read `references/catalog.md`
  and rank the patterns whose intent and "Reach for it when" cues best match
  the problem. Present the top 3–5 candidates, each with the cues that matched
  and a one-line reason it fits.
- Offer to run `/pattern <top candidate>` for the full reference and idiomatic
  Swift example.

Prefer the bundled references over recalling from memory, and flag when a plain
Swift feature (closure, enum, protocol) is simpler than any pattern.
