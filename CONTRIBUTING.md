# Contributing

Thanks for helping improve **Swift Design Patterns**! This repo is a Claude Code
plugin: an MCP server (`src/`) plus a skill and slash command.

## Ground rules

- **Original content only.** All pattern prose and Swift code must be your own
  work written from general knowledge of the patterns. Do **not** copy from
  copyrighted sources (e.g. Refactoring.Guru, books). The GoF pattern set is
  general knowledge; specific text and code are not.
- **Swift must compile.** Every example is type-checked in CI with the Swift
  toolchain. Keep examples self-contained and idiomatic (value types,
  protocol-oriented design, no XCTest — demonstrate with top-level `print`).
- **Keep `dist/` in sync.** The bundled server is committed so the plugin runs
  without an install step. CI fails if `dist/` is stale.

## Development

```bash
npm install         # dev deps
npm run typecheck   # tsc --noEmit
npm test            # unit tests (catalog integrity + recommender)
npm run build       # bundle src/ -> dist/index.js  (commit the result)
npm run smoke       # exercise every MCP tool over stdio
```

Type-check the Swift examples locally (needs a Swift toolchain):

```bash
npx esbuild scripts/dump-swift.ts --bundle --platform=node --format=esm --outfile=/tmp/dump.mjs
node /tmp/dump.mjs /tmp/sdp-swift
cd /tmp/sdp-swift && for f in *.swift; do swiftc -typecheck "$f" || echo "FAILED: $f"; done
```

## Adding or editing a pattern

1. Create/edit `src/patterns/<id>.ts` exporting a `Pattern` (see `src/types.ts`)
   that satisfies the interface. Match the structure and depth of
   `src/patterns/strategy.ts` (the reference exemplar).
2. Register it in `src/catalog.ts`.
3. `relatedPatterns` must reference existing pattern ids.
4. `whenToReachFor` should list the lowercase phrases a developer would actually
   type when they need this pattern — these power `recommend_pattern`.
5. Run `npm test`, `npm run build`, and the Swift type-check above. Commit the
   updated `dist/`.

## Pull requests

- One logical change per PR.
- CI must be green (typecheck, unit tests, build, fresh `dist/`, smoke test,
  Swift type-check).
- Describe the change and, for new patterns, why the examples are idiomatic.

## Before opening a PR — checklist

- [ ] `npm run typecheck` passes
- [ ] `npm test` passes
- [ ] `npm run build` run and `dist/` committed
- [ ] `npm run smoke` passes
- [ ] Swift examples type-check
- [ ] Content is original
