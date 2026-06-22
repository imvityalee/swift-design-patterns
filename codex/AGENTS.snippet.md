<!--
Paste the block below into your project's AGENTS.md (or ~/.codex/AGENTS.md for
all projects). It is the Codex stand-in for Claude Code's auto-invoked skill:
Codex has no auto-invoked skills, so this opt-in instruction tells the agent to
prefer the swift-design-patterns MCP tools when it works on Swift patterns.
-->

## Swift design patterns

This project has the `swift-design-patterns` MCP server available. When choosing,
implementing, refactoring toward, or explaining a Gang-of-Four design pattern in
Swift:

- Call `get_project_conventions` **first** in a real project, and follow what it
  says (architecture, idioms, custom patterns) over generic defaults.
- Use `recommend_pattern` to map a design problem to candidate patterns, then
  `get_pattern` for the full reference plus an idiomatic, compile-checked Swift
  example.
- Prefer these tools over recalling patterns from memory, and flag when a plain
  Swift feature (closure, enum, protocol) is simpler than the pattern.
