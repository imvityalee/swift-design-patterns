# Interpreter  _(Behavioral)_

**Intent.** Given a language, define a representation for its grammar along with an interpreter that uses the representation to evaluate sentences in the language.

**Problem.** You repeatedly handle inputs that follow a small, well-defined grammar — arithmetic expressions, search filters, configuration rules. Parsing and evaluating them ad hoc with string handling becomes brittle and hard to extend whenever the grammar grows a new construct.

**Solution.** Model each grammar rule as a class. Terminal expressions represent the atomic symbols (numbers, variables) and non-terminal expressions represent composed rules (addition, multiplication). Each node implements a common interpret operation that evaluates itself against a context, so an abstract syntax tree of these nodes evaluates a whole sentence recursively.

**When to use it**
- There is a language to interpret and you can represent its sentences as abstract syntax trees.
- The grammar is simple and relatively stable; for complex grammars a parser generator is better.
- Efficiency is not the top priority — clarity of the grammar representation matters more.
- You want to add new grammar rules by adding new expression types rather than editing a monolithic parser.

**Participants**
- **AbstractExpression** — Declares the interpret operation shared by every node in the syntax tree.
- **TerminalExpression** — Implements interpret for the grammar's atomic symbols (literals, variables).
- **NonterminalExpression** — Represents a composed rule; interprets its child expressions and combines results.
- **Context** — Holds global information the interpreter needs, such as variable bindings.
- **Client** — Builds the abstract syntax tree and invokes interpret on its root.

## Conceptual example — Evaluating arithmetic expressions
Numbers are terminal expressions; addition and multiplication are non-terminal expressions that combine sub-expressions. The tree evaluates recursively.
```swift
protocol Expression {
    func interpret() -> Int
}

struct Number: Expression {
    let value: Int
    func interpret() -> Int { value }
}

struct Add: Expression {
    let left: Expression
    let right: Expression
    func interpret() -> Int { left.interpret() + right.interpret() }
}

struct Multiply: Expression {
    let left: Expression
    let right: Expression
    func interpret() -> Int { left.interpret() * right.interpret() }
}

// Build the tree for: (2 + 3) * 4
let tree: Expression = Multiply(
    left: Add(left: Number(value: 2), right: Number(value: 3)),
    right: Number(value: 4)
)

print(tree.interpret())   // 20
```

## Real-world example — A tiny boolean rule engine with variables
A feature-flag rule is parsed into an expression tree over named variables. The context supplies the variable values, and the same tree can be evaluated against many contexts.
```swift
import Foundation

struct Context {
    var values: [String: Bool]
}

protocol RuleExpression {
    func evaluate(in context: Context) -> Bool
}

struct Variable: RuleExpression {
    let name: String
    func evaluate(in context: Context) -> Bool {
        context.values[name] ?? false
    }
}

struct Constant: RuleExpression {
    let value: Bool
    func evaluate(in context: Context) -> Bool { value }
}

struct And: RuleExpression {
    let left: RuleExpression
    let right: RuleExpression
    func evaluate(in context: Context) -> Bool {
        left.evaluate(in: context) && right.evaluate(in: context)
    }
}

struct Or: RuleExpression {
    let left: RuleExpression
    let right: RuleExpression
    func evaluate(in context: Context) -> Bool {
        left.evaluate(in: context) || right.evaluate(in: context)
    }
}

struct Not: RuleExpression {
    let operand: RuleExpression
    func evaluate(in context: Context) -> Bool {
        !operand.evaluate(in: context)
    }
}

// Rule: isPremium AND (isBetaTester OR NOT isThrottled)
let rule: RuleExpression = And(
    left: Variable(name: "isPremium"),
    right: Or(
        left: Variable(name: "isBetaTester"),
        right: Not(operand: Variable(name: "isThrottled"))
    )
)

let alice = Context(values: ["isPremium": true, "isBetaTester": false, "isThrottled": true])
let bob = Context(values: ["isPremium": true, "isBetaTester": true, "isThrottled": true])

print(rule.evaluate(in: alice))   // false
print(rule.evaluate(in: bob))     // true
```

**Pros**
- Each grammar rule is its own class, so the grammar is easy to read and extend.
- Adding a new construct means adding a new expression type, not editing a parser.
- Expression trees are reusable and can be evaluated against many contexts.
- Maps cleanly onto recursive grammars and composite structures.

**Cons**
- Class-per-rule grows unwieldy for anything beyond a simple grammar.
- Recursive tree evaluation can be slow and memory-heavy for large inputs.
- Parsing the source text into the tree is a separate concern the pattern does not address.

**Related patterns:** composite, visitor, iterator, flyweight
