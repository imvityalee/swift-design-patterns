import type { Pattern } from "../types.js";

export const visitor: Pattern = {
  id: "visitor",
  name: "Visitor",
  category: "Behavioral",
  intent:
    "Represent an operation to be performed on the elements of an object structure; let you define a new operation without changing the classes of the elements on which it operates.",
  problem:
    "You have a stable set of element types (the nodes of a tree, the shapes in a document) and a growing set of operations over them. Putting each operation as a method on every element forces you to edit every type whenever you add an operation, and it scatters unrelated concerns — export, validation, pricing — across the element classes.",
  solution:
    "Move each operation into its own visitor type with one visit method per concrete element. Each element implements a single accept method that calls back the visitor's method for its own type — a technique called double dispatch. Adding a new operation now means writing a new visitor, leaving the element classes untouched, and each operation's logic lives together in one place.",
  applicability: [
    "An object structure contains many element types and you want to perform operations that depend on their concrete classes.",
    "Many distinct, unrelated operations must be performed over a structure and you do not want to pollute the element classes with them.",
    "The set of element classes is stable while the set of operations over them keeps growing.",
    "You want to accumulate related operation logic in one place rather than spreading it across the elements.",
  ],
  participants: [
    {
      name: "Visitor",
      role: "Protocol declaring one visit method for each concrete element type.",
    },
    {
      name: "ConcreteVisitor",
      role: "Implements every visit method, defining one operation over the whole structure.",
    },
    {
      name: "Element",
      role: "Protocol declaring an accept method that takes a visitor.",
    },
    {
      name: "ConcreteElement",
      role: "Implements accept by calling back the visit method that matches its own type (double dispatch).",
    },
  ],
  conceptual: {
    title: "Double dispatch over a small element hierarchy",
    summary:
      "Each element's accept() calls the visitor method for its concrete type, so the visitor selects behavior by element without any type checks.",
    code: `protocol Visitor {
    func visit(_ element: ElementA)
    func visit(_ element: ElementB)
}

protocol Element {
    func accept(_ visitor: Visitor)
}

struct ElementA: Element {
    let value = "A"
    func accept(_ visitor: Visitor) { visitor.visit(self) }
}

struct ElementB: Element {
    let value = 42
    func accept(_ visitor: Visitor) { visitor.visit(self) }
}

final class PrintVisitor: Visitor {
    func visit(_ element: ElementA) { print("Visiting A:", element.value) }
    func visit(_ element: ElementB) { print("Visiting B:", element.value) }
}

// Client
let elements: [Element] = [ElementA(), ElementB()]
let visitor = PrintVisitor()
for element in elements {
    element.accept(visitor)
}
// Visiting A: A
// Visiting B: 42`,
  },
  realWorld: {
    title: "Operations over a shape document",
    summary:
      "Circles and rectangles are a stable set of shapes; area calculation and SVG export are separate visitors. New operations arrive as new visitors without editing the shape types.",
    code: `import Foundation

protocol ShapeVisitor {
    func visit(_ circle: Circle)
    func visit(_ rectangle: Rectangle)
}

protocol Shape {
    func accept(_ visitor: ShapeVisitor)
}

struct Circle: Shape {
    let radius: Double
    func accept(_ visitor: ShapeVisitor) { visitor.visit(self) }
}

struct Rectangle: Shape {
    let width: Double
    let height: Double
    func accept(_ visitor: ShapeVisitor) { visitor.visit(self) }
}

final class AreaVisitor: ShapeVisitor {
    private(set) var total = 0.0
    func visit(_ circle: Circle) {
        total += Double.pi * circle.radius * circle.radius
    }
    func visit(_ rectangle: Rectangle) {
        total += rectangle.width * rectangle.height
    }
}

final class SVGExportVisitor: ShapeVisitor {
    private(set) var markup: [String] = []
    func visit(_ circle: Circle) {
        markup.append("<circle r=\\"" + String(format: "%.0f", circle.radius) + "\\"/>")
    }
    func visit(_ rectangle: Rectangle) {
        markup.append("<rect w=\\"" + String(format: "%.0f", rectangle.width)
            + "\\" h=\\"" + String(format: "%.0f", rectangle.height) + "\\"/>")
    }
}

let document: [Shape] = [Circle(radius: 2), Rectangle(width: 3, height: 4)]

let area = AreaVisitor()
document.forEach { $0.accept(area) }
print(String(format: "Total area: %.2f", area.total))   // Total area: 24.57

let export = SVGExportVisitor()
document.forEach { $0.accept(export) }
print(export.markup.joined(separator: "\\n"))
// <circle r="2"/>
// <rect w="3" h="4"/>`,
  },
  pros: [
    "Adding a new operation is a single new visitor — the element classes never change.",
    "Gathers each operation's logic in one type instead of scattering it across elements.",
    "Double dispatch picks behavior by concrete element type without runtime type checks or casts.",
    "A visitor can accumulate state as it walks the structure, enabling cross-element computations.",
  ],
  cons: [
    "Adding a new element type forces a change to every visitor's protocol and implementations.",
    "The double-dispatch accept/visit indirection is more ceremony than a plain method call.",
    "Visitors may need access to element internals, which can weaken encapsulation.",
    "In Swift, an enum with associated values plus a switch often expresses the same idea more simply.",
  ],
  relatedPatterns: ["composite", "iterator", "interpreter"],
  whenToReachFor: [
    "add operations without changing element classes",
    "stable element types growing set of operations",
    "double dispatch by concrete type",
    "traverse a tree or ast applying an operation",
    "separate algorithms from the object structure",
    "export validate or evaluate over a hierarchy",
  ],
};
