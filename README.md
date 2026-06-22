# Swift Design Patterns — for Claude Code & Codex

[![CI](https://github.com/imvityalee/swift-design-patterns/actions/workflows/ci.yml/badge.svg)](https://github.com/imvityalee/swift-design-patterns/actions/workflows/ci.yml)

A [Claude Code](https://code.claude.com) plugin — also installable as an
[OpenAI Codex](https://github.com/openai/codex) MCP server (see
[Use with Codex](#use-with-codex)) — that makes your coding agent fluent in the
**23 Gang-of-Four design patterns in Swift**. It bundles:

- 🧰 an **MCP server** exposing the pattern catalog as tools, and
- 🧠 a **skill** + **slash command** that auto-engage when you work on design
  patterns in Swift.

Every pattern ships with an **idiomatic, compile-checked Swift example** (all 46
examples type-check under the Swift 6 toolchain).

## What you get

### MCP tools

| Tool | What it does |
|---|---|
| `list_patterns` | Browse the catalog, optionally filtered by category (Creational / Structural / Behavioral). |
| `get_pattern` | Full reference for one pattern — intent, problem, solution, applicability, participants, conceptual + real-world Swift examples, pros/cons, related patterns. Accepts an id (`abstract-factory`) or name (`Abstract Factory`). |
| `recommend_pattern` | Describe a design problem in plain words; get ranked candidate patterns with the matched cues. |
| `get_project_conventions` | Read the current project's architecture & conventions file so advice matches *your* codebase, not generic defaults. |

### Skill & command

- The **`swift-design-patterns` skill** auto-invokes when you're choosing,
  implementing, refactoring toward, or explaining a pattern in Swift — and it
  drives the MCP tools for you.
- **`/pattern <name-or-problem>`** — quick lookup or recommendation on demand.
  - `/pattern Strategy` → full reference + Swift example
  - `/pattern I have a giant switch selecting between behaviors` → recommendations
- **`/swift-conventions [init]`** — view or scaffold the project's conventions
  file so the plugin follows *your* architecture (see below).

### Make it match your architecture

The catalog is universal (GoF), but every project's architecture, idioms, and
custom patterns differ. Declare them once in `.claude/swift-architecture.md`
(run `/swift-conventions init`) and the plugin reads and **honors them over its
generic defaults** — MVVM-C, VIPER, TCA, Clean, banned patterns, your own
abstractions, whatever your team uses. See
[docs/conventions.md](docs/conventions.md).

## Install

In Claude Code:

Install Market place 

```text
/plugin marketplace add imvityalee/swift-design-patterns
```
Install Skill 

```text
/plugin install swift-design-patterns
```

Then start using it — ask "which pattern fits …?", "show me Observer in Swift",
or run `/pattern …`. The MCP server is bundled (single self-contained
`dist/index.js`); you only need Node.js available, which Claude Code already
requires.

### Use it across a team

To auto-enable the plugin for everyone working in a shared project (no manual
install), commit a snippet into that project's `.claude/settings.json`. See
[docs/team-setup.md](docs/team-setup.md).

## Use with Codex

The same MCP server runs under [OpenAI Codex](https://github.com/openai/codex) —
both the CLI and the IDE extension, which share `~/.codex/config.toml`, so one
setup covers both. Codex has no plugin marketplace, so you wire it up directly:

**1. Register the MCP server (required — this is the tools).** One command:

```bash
codex mcp add swift-design-patterns -- npx -y swift-design-patterns-mcp
```

It writes an `[mcp_servers.swift-design-patterns]` block into
`~/.codex/config.toml`. Prefer editing the file by hand? Copy the block from
[`codex/config.example.toml`](codex/config.example.toml). Either way, all four
tools (`list_patterns`, `get_pattern`, `recommend_pattern`,
`get_project_conventions`) become available in Codex. You only need Node.js on
your `PATH` (for `npx`).

**2. Add the slash commands (optional).** Copy the prompt files into your Codex
prompts directory to get `/pattern` and `/swift-conventions`:

```bash
mkdir -p ~/.codex/prompts
cp codex/prompts/pattern.md codex/prompts/swift-conventions.md ~/.codex/prompts/
```

**3. Make Codex reach for the tools automatically (optional).** Codex has no
auto-invoked skill like Claude Code, so paste the block from
[`codex/AGENTS.snippet.md`](codex/AGENTS.snippet.md) into your project's
`AGENTS.md` (or `~/.codex/AGENTS.md`) — it nudges Codex to prefer these tools
when working on Swift patterns.

> **Conventions file:** under Codex, save your project conventions to
> `.swift-architecture.md` at the repo root (`/swift-conventions init` creates
> it). The server still reads the legacy `.claude/swift-architecture.md`, so
> existing Claude projects keep working unchanged.

## The 23 patterns

**Creational** — Abstract Factory, Builder, Factory Method, Prototype, Singleton
**Structural** — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
**Behavioral** — Chain of Responsibility, Command, Interpreter, Iterator,
Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

## Local development

```bash
npm install        # install dev deps (SDK, esbuild, typescript, tsx)
npm run typecheck  # tsc --noEmit
npm test           # unit tests: catalog integrity + recommender
npm run build      # bundle src/ -> dist/index.js (committed, so the plugin runs without node_modules)
npm run smoke      # spin up the server over stdio and exercise every tool
```

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs all of the
above on every push/PR, type-checks all 46 Swift examples with the Swift
toolchain, and fails if the committed `dist/` is stale. See
[CONTRIBUTING.md](CONTRIBUTING.md).

The catalog lives in `src/patterns/<id>.ts`, one file per pattern, each
satisfying the `Pattern` interface in `src/types.ts`. Add or edit a pattern,
register it in `src/catalog.ts`, then `npm run build`.

To type-check the Swift examples themselves (requires a Swift toolchain):

```bash
npx esbuild scripts/dump-swift.ts --bundle --platform=node --format=esm --outfile=/tmp/dump.mjs
node /tmp/dump.mjs /tmp/sdp-swift
cd /tmp/sdp-swift && for f in *.swift; do swiftc -typecheck "$f"; done
```

## License & attribution

MIT — see [LICENSE](LICENSE).

All pattern descriptions and Swift code in this repository are **original
work**. The Gang-of-Four pattern set is general knowledge; this project does not
copy or derive from any specific copyrighted source. It was *inspired by* the
excellent [Refactoring.Guru](https://refactoring.guru/design-patterns) catalog —
go there for deeper, illustrated explanations — but contains none of its text or
code.
