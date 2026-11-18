<!-- Starter for a project's conventions file. Looked up, in order: .swift-architecture.md, .claude/swift-architecture.md, .claude/swift-conventions.md, ARCHITECTURE.md -->

# Swift Architecture & Conventions

> Read by the `swift-design-patterns` plugin. Claude consults this file before
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
