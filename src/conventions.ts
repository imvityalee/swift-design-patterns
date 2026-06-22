// Per-project conventions: each project describes its own architecture,
// idioms, and custom patterns in a file the plugin reads and honors. This keeps
// the shared catalog universal (GoF) while advice adapts to each codebase.

/**
 * Candidate file paths (relative to the project root), in priority order.
 * The harness-neutral `.swift-architecture.md` is checked first so the plugin
 * works the same under Codex (or any tool) as under Claude Code; the `.claude/`
 * paths are kept for back-compat with existing Claude projects.
 */
export const CONVENTIONS_FILES = [
  ".swift-architecture.md",
  ".claude/swift-architecture.md",
  ".claude/swift-conventions.md",
  "ARCHITECTURE.md",
];

/** Starter template a team fills in to teach the plugin its conventions. */
export const CONVENTIONS_TEMPLATE = `# Swift Architecture & Conventions

> Read by the \`swift-design-patterns\` plugin. Claude consults this file before
> proposing or implementing a pattern, and follows what it says here over its
> generic defaults. Delete the guidance comments and fill in your project's
> reality. Keep it short and specific.

## Architecture

- **Style:** <!-- e.g. MVVM-C, VIPER, TCA, Clean/Onion, MVC, custom -->
- **Overview:** <!-- one paragraph: the layers and how data/control flows -->

## Layers & boundaries

<!-- The layers (e.g. Presentation / Domain / Data) and the rules for what may
depend on what. Name the rule that must never be broken. -->

## Dependency management

- **Injection style:** <!-- initializer injection / a DI container / property wrappers / ... -->
- **Composition root:** <!-- where dependencies are assembled -->
- **Banned:** <!-- e.g. "no global singletons except AppEnvironment" -->

## Concurrency & state

<!-- async/await vs Combine vs callbacks? Where is state owned? Threading rules,
@MainActor usage, how observers are notified. -->

## Naming conventions

<!-- Suffixes (ViewModel, Service, Repository, UseCase, Coordinator),
protocol naming, file/module layout. -->

## Module / target structure

<!-- Swift packages / targets and their responsibilities, if modularized. -->

## Preferred patterns

<!-- Which patterns this team reaches for, and the local shape they take.
e.g. "Strategy via protocol + initializer injection", "Coordinator for all
navigation". Reference catalog ids where useful. -->

## Discouraged / banned patterns

<!-- e.g. "no Singleton for stateful services", "no inheritance for view models" -->

## Team-specific patterns & idioms

<!-- YOUR OWN reusable patterns the shared catalog doesn't cover: delegation
rules, your Coordinator/Router contract, your Repository shape, DI conventions,
result-builder DSLs, custom abstractions. Include a tiny canonical Swift snippet
for each so Claude matches your house style. THIS is where project-specific
"patterns" live. -->

## Examples / references

<!-- Links to exemplar files in this repo Claude should imitate. -->
`;

/** Header shown above a project's conventions when returned by the tool. */
export function conventionsHeader(path: string): string {
  return `# Project conventions (from \`${path}\`)\n\nFollow these over generic pattern defaults. Reconcile any pattern you propose with what is stated here.\n\n---\n\n`;
}

/** Message + template when no conventions file exists yet. */
export function noConventionsMessage(projectDir: string): string {
  return (
    `No conventions file found in this project (looked for: ${CONVENTIONS_FILES.join(", ")} under ${projectDir}).\n\n` +
    `Proceed with idiomatic, framework-neutral Swift defaults. To make pattern advice match this team's architecture and idioms, create one — run \`/swift-conventions init\` or save the template below to \`.swift-architecture.md\`:\n\n` +
    "```markdown\n" +
    CONVENTIONS_TEMPLATE +
    "\n```\n"
  );
}
