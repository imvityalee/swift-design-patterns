import type { Pattern } from "../types.js";

export const prototype: Pattern = {
  id: "prototype",
  name: "Prototype",
  category: "Creational",
  alsoKnownAs: ["Clone"],
  intent:
    "Create new objects by copying an existing instance — the prototype — instead of constructing them from scratch, so the concrete type and its configured state are reproduced without coupling to the class.",
  problem:
    "You need many objects that are nearly identical to one already configured at runtime, but rebuilding them through initializers means re-running expensive setup, re-supplying every parameter, and hard-coding the concrete type. When the exact class is decided dynamically, the client cannot even name a constructor to call.",
  solution:
    "Give objects a way to clone themselves through a common abstraction. A client asks a prototype for a copy and receives a new, independent instance pre-loaded with the prototype's state. Because cloning is polymorphic, the client never needs to know the concrete class, and a registry of ready-made prototypes can hand out fresh copies on demand.",
  applicability: [
    "The concrete class to instantiate is chosen at runtime and you want to avoid a parallel hierarchy of factories.",
    "Constructing an object is costly (heavy parsing, I/O, computation) and a configured template already exists.",
    "Instances vary only by a small amount of state, so copying a baseline is simpler than re-specifying everything.",
    "You want to snapshot an object's current configuration and spawn independent variations from it.",
  ],
  participants: [
    {
      name: "Prototype",
      role: "Declares the cloning interface that produces a copy of the conforming object.",
    },
    {
      name: "ConcretePrototype",
      role: "Implements the clone operation, returning a new instance that duplicates its own state.",
    },
    {
      name: "Client",
      role: "Produces new objects by asking a prototype to clone itself rather than calling an initializer.",
    },
    {
      name: "PrototypeRegistry",
      role: "Optional store of pre-built prototypes, keyed so clients can request a clone by name.",
    },
  ],
  conceptual: {
    title: "Self-copying objects behind a Cloneable protocol",
    summary:
      "A protocol declares a clone() method; each concrete type returns an independent duplicate of itself, so the client copies without knowing the concrete class.",
    code: `protocol Cloneable {
    func clone() -> Self
}

final class Shape: Cloneable {
    var x: Int
    var y: Int
    var color: String

    init(x: Int, y: Int, color: String) {
        self.x = x
        self.y = y
        self.color = color
    }

    func clone() -> Self {
        Self(x: x, y: y, color: color)
    }
}

// Client copies an existing, configured instance.
let original = Shape(x: 10, y: 20, color: "red")
let copy = original.clone()
copy.x = 99

print(original.x, original.color)   // 10 red
print(copy.x, copy.color)           // 99 red  (independent instance)`,
  },
  realWorld: {
    title: "Cloning a configured document template in an editor",
    summary:
      "A drawing editor keeps a registry of preset shapes. Reference types implement a deep clone so duplicated shapes carry their nested style without sharing it; value types get copy semantics for free.",
    code: `import Foundation

protocol GraphicPrototype {
    func clone() -> GraphicPrototype
    func describe() -> String
}

// A nested reference type that must be copied deeply.
final class Style {
    var fill: String
    var lineWidth: Double

    init(fill: String, lineWidth: Double) {
        self.fill = fill
        self.lineWidth = lineWidth
    }

    func clone() -> Style {
        Style(fill: fill, lineWidth: lineWidth)
    }
}

final class Sticker: GraphicPrototype {
    var label: String
    var style: Style

    init(label: String, style: Style) {
        self.label = label
        self.style = style
    }

    func clone() -> GraphicPrototype {
        // Deep copy: duplicate the nested reference type too.
        Sticker(label: label, style: style.clone())
    }

    func describe() -> String {
        "Sticker(\\(label), fill: \\(style.fill), width: \\(style.lineWidth))"
    }
}

// A registry of ready-made templates the user can stamp out.
final class StickerLibrary {
    private var presets: [String: GraphicPrototype] = [:]

    func register(_ key: String, _ prototype: GraphicPrototype) {
        presets[key] = prototype
    }

    func make(_ key: String) -> GraphicPrototype? {
        presets[key]?.clone()
    }
}

let library = StickerLibrary()
library.register("warning", Sticker(label: "Warning", style: Style(fill: "yellow", lineWidth: 2)))

let first = library.make("warning") as! Sticker
let second = library.make("warning") as! Sticker

// Mutating one clone leaves the other untouched.
second.label = "Caution"
second.style.fill = "orange"

print(first.describe())    // Sticker(Warning, fill: yellow, width: 2.0)
print(second.describe())   // Sticker(Caution, fill: orange, width: 2.0)`,
  },
  pros: [
    "Clones objects without coupling the client to their concrete classes.",
    "Sidesteps repeated, expensive initialization by copying a ready-made template.",
    "Lets you add and remove prototypes at runtime via a registry.",
    "Captures complex configured state as a reusable baseline.",
  ],
  cons: [
    "Cloning objects with circular references or deep reference graphs is tricky to get right.",
    "Each concrete prototype must implement its own copy logic, including deep copies of nested reference types.",
    "Mixing reference and value semantics can hide accidental sharing of mutable state.",
  ],
  relatedPatterns: ["abstract-factory", "factory-method", "composite", "decorator", "memento"],
  whenToReachFor: [
    "copy or clone an existing configured object",
    "avoid expensive re-initialization",
    "create instances without naming the concrete class",
    "deep copy nested reference types",
    "registry of reusable templates",
    "duplicate then tweak a baseline",
    "snapshot current configuration as a new object",
  ],
};
