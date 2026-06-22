---
description: "Look up or recommend a Swift design pattern via the swift-design-patterns MCP tools. Usage: /pattern Strategy  or  /pattern I have a giant switch selecting between behaviors"
---

The user invoked `/pattern` with: **$ARGUMENTS**

You have the `swift-design-patterns` MCP server connected. Decide what they want:

- If `$ARGUMENTS` names a specific pattern (e.g. "Strategy", "abstract factory",
  "observer"), call the `get_pattern` tool with it and present the intent,
  when-to-use, the Swift examples, and pros/cons. Keep it tight.
- If `$ARGUMENTS` describes a problem or symptom (e.g. "decouple UI from a
  growing set of algorithms"), call `recommend_pattern`, then `get_pattern` on
  the best candidate, and explain why it fits plus the main trade-off.
- If `$ARGUMENTS` is empty or just a category, call `list_patterns` (filtered by
  category if given) and show the catalog.

Prefer the `swift-design-patterns` MCP tools over recalling from memory, and
flag when a plain Swift feature (closure, enum, protocol) is simpler than the
pattern.
