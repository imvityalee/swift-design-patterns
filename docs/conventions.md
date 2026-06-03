# Project conventions — make the plugin match *your* architecture

The shared catalog is intentionally universal (the 23 GoF patterns). Every
project's architecture, idioms, and custom patterns differ — so instead of
baking one opinion into the plugin, each project declares its own conventions in
a file the plugin reads and honors.

## How it works

1. Add a conventions file to the project you're working in (not this plugin
   repo). The plugin looks for these, in order:
   - `.claude/swift-architecture.md`
   - `.claude/swift-conventions.md`
   - `ARCHITECTURE.md`
2. The skill calls `get_project_conventions` before proposing or implementing a
   pattern, and follows what the file says **over** the generic catalog — your
   architecture, layering rules, DI style, naming, preferred/banned patterns,
   and your own team-specific patterns.

## Create one

In the target project:

```text
/swift-conventions init
```

This scaffolds `.claude/swift-architecture.md` from a template. Fill in the
sections — especially:

- **Architecture** — MVVM-C / VIPER / TCA / Clean / custom, and how layers flow.
- **Dependency management** — injection style, composition root, what's banned.
- **Team-specific patterns & idioms** — your own reusable patterns the GoF
  catalog doesn't cover (delegation rules, your Coordinator/Router contract,
  Repository shape, DI conventions, custom abstractions). Include a tiny
  canonical Swift snippet for each so Claude matches your house style. **This is
  where project-specific patterns live.**

View the current conventions any time with `/swift-conventions`.

## Why this design

Keeping the shared plugin universal means it's correct for every team, while the
per-project file lets advice adapt to each codebase. A team that bans singletons,
uses TCA, and has its own networking pattern gets advice that respects all three
— without forking the plugin.
