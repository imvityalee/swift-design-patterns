import type { Pattern } from "../types.js";

export const templateMethod: Pattern = {
  id: "template-method",
  name: "Template Method",
  category: "Behavioral",
  intent:
    "Define the skeleton of an algorithm in an operation, deferring some steps to subclasses; let subclasses redefine certain steps without changing the algorithm's structure.",
  problem:
    "Several variants of a process share the same overall sequence of steps but differ in the details of a few of them. Copying the whole sequence into each variant duplicates the invariant scaffolding, and a fix to the shared structure must then be applied in every copy, where it is easy to miss one.",
  solution:
    "Put the fixed sequence in a single template method that calls a series of named steps. Implement the steps that never change once, and declare the variable steps as overridable hooks. Each variant overrides only the steps it needs while inheriting the invariant skeleton, so the algorithm's structure lives in exactly one place.",
  applicability: [
    "Several algorithms share an identical structure but differ in individual steps.",
    "You want to factor out and localize the common, invariant part of related algorithms to avoid duplication.",
    "You want to control which points of an algorithm subclasses are allowed to extend, and forbid the rest.",
    "You need optional hooks that do nothing by default but let subclasses inject behavior at fixed points.",
  ],
  participants: [
    {
      name: "AbstractClass",
      role: "Defines the template method calling the steps, implements the invariant steps, and declares the abstract or hook steps.",
    },
    {
      name: "ConcreteClass",
      role: "Overrides the variable steps to provide the behavior specific to one variant of the algorithm.",
    },
  ],
  conceptual: {
    title: "A fixed skeleton with overridable steps",
    summary:
      "The template method run() fixes the order of stepOne, stepTwo, and an optional hook; subclasses customize only the steps they care about.",
    code: `class AbstractAlgorithm {
    // The template method: fixed structure, not overridden.
    final func run() {
        stepOne()
        stepTwo()
        if shouldDoExtra() {
            extraStep()
        }
    }

    func stepOne() {
        print("Base: step one")
    }

    // Subclasses must supply this.
    func stepTwo() {
        fatalError("stepTwo() must be overridden")
    }

    // Hook with a default; subclasses may override.
    func shouldDoExtra() -> Bool { false }
    func extraStep() { print("Base: extra step") }
}

final class ConcreteAlgorithm: AbstractAlgorithm {
    override func stepTwo() {
        print("Concrete: step two")
    }

    override func shouldDoExtra() -> Bool { true }
}

// Client
AbstractAlgorithm().stepOne()    // Base: step one
ConcreteAlgorithm().run()
// Base: step one
// Concrete: step two
// Base: extra step`,
  },
  realWorld: {
    title: "A data-import pipeline with format-specific parsing",
    summary:
      "Importing CSV and JSON shares the same load/parse/validate/save sequence; only the parse step differs. The base class owns the pipeline and exposes parse as the single hook each format overrides.",
    code: `import Foundation

struct Record {
    let id: Int
    let name: String
}

class DataImporter {
    // Template method: the import sequence is fixed here.
    final func importData(from raw: String) {
        let lines = load(raw)
        let records = parse(lines)
        let valid = validate(records)
        save(valid)
    }

    private func load(_ raw: String) -> [String] {
        let lines = raw.split(separator: "\\n").map(String.init)
        print("Loaded", lines.count, "lines")
        return lines
    }

    // Variable step: each format parses differently.
    func parse(_ lines: [String]) -> [Record] {
        fatalError("parse(_:) must be overridden")
    }

    private func validate(_ records: [Record]) -> [Record] {
        let valid = records.filter { !$0.name.isEmpty }
        print("Validated", valid.count, "of", records.count, "records")
        return valid
    }

    private func save(_ records: [Record]) {
        print("Saved", records.count, "records")
    }
}

final class CSVImporter: DataImporter {
    override func parse(_ lines: [String]) -> [Record] {
        lines.compactMap { line in
            let cols = line.split(separator: ",").map(String.init)
            guard cols.count == 2, let id = Int(cols[0]) else { return nil }
            return Record(id: id, name: cols[1])
        }
    }
}

final class JSONLinesImporter: DataImporter {
    override func parse(_ lines: [String]) -> [Record] {
        lines.compactMap { line in
            guard
                let data = line.data(using: .utf8),
                let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                let id = obj["id"] as? Int,
                let name = obj["name"] as? String
            else { return nil }
            return Record(id: id, name: name)
        }
    }
}

CSVImporter().importData(from: "1,Ada\\n2,Grace\\n3,")
// Loaded 3 lines
// Validated 2 of 3 records
// Saved 2 records

JSONLinesImporter().importData(from: "{\\"id\\":1,\\"name\\":\\"Linus\\"}")
// Loaded 1 lines
// Validated 1 of 1 records
// Saved 1 records`,
  },
  pros: [
    "Removes duplication by lifting the invariant part of related algorithms into one place.",
    "Gives subclasses precise extension points while keeping the overall flow under the base class's control.",
    "Hooks let subclasses opt into optional behavior without touching the skeleton.",
    "A fix to the shared structure applies to every variant at once.",
  ],
  cons: [
    "Relies on inheritance, which couples variants to the base class and limits each to a single superclass.",
    "The flow inverts control, so reading one subclass rarely tells the whole story of what runs.",
    "Too many hooks make the base class hard to understand and the contract easy to break.",
    "In Swift, composing closures or a protocol with default methods is often a lighter alternative.",
  ],
  relatedPatterns: ["strategy", "factory-method", "builder"],
  whenToReachFor: [
    "fixed algorithm skeleton with variable steps",
    "remove duplication across similar workflows",
    "override only certain steps via subclass",
    "import or processing pipeline variants",
    "hook methods with default behavior",
    "invariant sequence shared by subclasses",
  ],
};
