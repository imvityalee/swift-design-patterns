# Swift Design Patterns — Claude Code plugin

A [Claude Code](https://code.claude.com) plugin that makes Claude fluent in the
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

### Skill & command

- The **`swift-design-patterns` skill** auto-invokes when you're choosing,
  implementing, refactoring toward, or explaining a pattern in Swift — and it
  drives the MCP tools for you.
- **`/pattern <name-or-problem>`** — quick lookup or recommendation on demand.
  - `/pattern Strategy` → full reference + Swift example
  - `/pattern I have a giant switch selecting between behaviors` → recommendations

## Install

In Claude Code:

```text
/plugin marketplace add imvityalee/swift-design-patterns
/plugin install swift-design-patterns
```

Then start using it — ask "which pattern fits …?", "show me Observer in Swift",
or run `/pattern …`. The MCP server is bundled (single self-contained
`dist/index.js`); you only need Node.js available, which Claude Code already
requires.

## The 23 patterns

**Creational** — Abstract Factory, Builder, Factory Method, Prototype, Singleton
**Structural** — Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
**Behavioral** — Chain of Responsibility, Command, Interpreter, Iterator,
Mediator, Memento, Observer, State, Strategy, Template Method, Visitor

## Local development

```bash
npm install        # install dev deps (SDK, esbuild, typescript)
npm run typecheck  # tsc --noEmit
npm run build      # bundle src/ -> dist/index.js (committed, so the plugin runs without node_modules)
npm run smoke      # spin up the server over stdio and exercise every tool
```

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
