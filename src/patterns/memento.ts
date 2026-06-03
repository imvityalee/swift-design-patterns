import type { Pattern } from "../types.js";

export const memento: Pattern = {
  id: "memento",
  name: "Memento",
  category: "Behavioral",
  alsoKnownAs: ["Token", "Snapshot"],
  intent:
    "Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.",
  problem:
    "You want to add undo, a checkpoint, or a rollback to an object, which means you must be able to save and restore its state. But exposing every field publicly so something outside can copy and write them back breaks encapsulation: the object's internal representation leaks, and any external code can corrupt its invariants.",
  solution:
    "Let the object (the Originator) produce a memento — an opaque snapshot of its own state — and accept a memento to restore from. The memento's contents are visible only to the originator that created it; everyone else treats it as a black box. A caretaker keeps a history of mementos and asks the originator to roll back, but never inspects what is inside them.",
  applicability: [
    "You need to take a snapshot of an object's state to restore it later, for undo/redo or transactions.",
    "Exposing the state directly through accessors would break the object's encapsulation.",
    "You want a checkpoint mechanism that can roll back to a known-good state after a failed operation.",
    "You need to keep a bounded history of past states without coupling the history keeper to the state's structure.",
  ],
  participants: [
    {
      name: "Originator",
      role: "Creates a memento capturing its current state and uses a memento to restore that state.",
    },
    {
      name: "Memento",
      role: "Stores the originator's internal state; exposes a narrow interface to the caretaker and a full one only to the originator.",
    },
    {
      name: "Caretaker",
      role: "Holds mementos (e.g. an undo stack) but never opens or modifies their contents.",
    },
  ],
  conceptual: {
    title: "An editor that snapshots and restores its text",
    summary:
      "The originator produces an opaque memento of its state; a caretaker stores snapshots and asks the originator to restore one, without ever reading inside.",
    code: `struct Memento {
    // State is captured but treated as opaque by the caretaker.
    fileprivate let state: String
}

final class Originator {
    private var state: String = ""

    func set(_ value: String) {
        print("Set state to:", value)
        state = value
    }

    func save() -> Memento {
        Memento(state: state)
    }

    func restore(from memento: Memento) {
        state = memento.state
        print("Restored state to:", state)
    }
}

final class Caretaker {
    private var history: [Memento] = []
    private let originator: Originator

    init(originator: Originator) {
        self.originator = originator
    }

    func backup() { history.append(originator.save()) }

    func undo() {
        guard let memento = history.popLast() else { return }
        originator.restore(from: memento)
    }
}

// Client
let originator = Originator()
let caretaker = Caretaker(originator: originator)

originator.set("first")
caretaker.backup()
originator.set("second")
caretaker.backup()
originator.set("third")

caretaker.undo()   // Restored state to: second
caretaker.undo()   // Restored state to: first`,
  },
  realWorld: {
    title: "Undo stack for a drawing canvas",
    summary:
      "A canvas captures its list of shapes into an opaque snapshot before each edit. An undo manager keeps a bounded stack of snapshots and restores the previous one, never touching the snapshot's internals.",
    code: `import Foundation

struct Shape {
    let id: UUID
    var x: Double
    var y: Double
}

final class Canvas {
    private var shapes: [Shape] = []

    // Opaque snapshot — only Canvas can read it back.
    struct Snapshot {
        fileprivate let shapes: [Shape]
        let takenAt: Date
    }

    func add(x: Double, y: Double) {
        shapes.append(Shape(id: UUID(), x: x, y: y))
    }

    func snapshot() -> Snapshot {
        Snapshot(shapes: shapes, takenAt: Date())
    }

    func restore(_ snapshot: Snapshot) {
        shapes = snapshot.shapes
    }

    var count: Int { shapes.count }
}

final class UndoManager_ {
    private var stack: [Canvas.Snapshot] = []
    private let limit: Int
    private let canvas: Canvas

    init(canvas: Canvas, limit: Int = 10) {
        self.canvas = canvas
        self.limit = limit
    }

    func checkpoint() {
        stack.append(canvas.snapshot())
        if stack.count > limit { stack.removeFirst() }
    }

    func undo() {
        guard let last = stack.popLast() else {
            print("Nothing to undo")
            return
        }
        canvas.restore(last)
    }
}

let canvas = Canvas()
let undo = UndoManager_(canvas: canvas)

undo.checkpoint()
canvas.add(x: 10, y: 20)
print("Shapes:", canvas.count)   // Shapes: 1

undo.checkpoint()
canvas.add(x: 30, y: 40)
print("Shapes:", canvas.count)   // Shapes: 2

undo.undo()
print("Shapes:", canvas.count)   // Shapes: 1

undo.undo()
print("Shapes:", canvas.count)   // Shapes: 0`,
  },
  pros: [
    "Captures and restores state without exposing the object's internals or breaking encapsulation.",
    "Keeps the originator simple by moving the responsibility of storing history to the caretaker.",
    "Makes undo/redo, checkpoints, and transactional rollback straightforward to add.",
    "In Swift, value-type state copies into a memento cleanly with no aliasing surprises.",
  ],
  cons: [
    "Storing many or large mementos can consume significant memory.",
    "Frequent snapshots of expensive state can hurt performance unless diffs are used.",
    "Caretakers must manage memento lifetime; a leaking history grows without bound.",
  ],
  relatedPatterns: ["command", "iterator", "prototype", "state"],
  whenToReachFor: [
    "implement undo and redo",
    "snapshot and restore object state",
    "rollback to a previous checkpoint",
    "save state without breaking encapsulation",
    "transactional state with revert on failure",
    "history stack of past states",
  ],
};
