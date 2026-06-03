import type { Pattern } from "../types.js";

export const command: Pattern = {
  id: "command",
  name: "Command",
  category: "Behavioral",
  alsoKnownAs: ["Action", "Transaction"],
  intent:
    "Encapsulate a request as an object, letting you parameterize clients with different requests, queue or log requests, and support undoable operations.",
  problem:
    "You need to issue requests to objects without knowing anything about the operation being requested or its receiver. Calling methods directly hard-wires the invoker to the receiver and makes it impossible to queue, log, schedule, or undo an action after the fact.",
  solution:
    "Turn a request into a standalone command object that exposes a uniform execute method and holds everything needed to perform the action — the receiver and any arguments. Invokers trigger commands without knowing their concrete type, so commands can be stored, passed around, queued, and (by also recording how to reverse themselves) undone.",
  applicability: [
    "You want to parameterize objects with an action to perform, decoupling who triggers it from what it does.",
    "You need to queue, schedule, or execute requests at different times.",
    "You want to support undo/redo by recording executed operations.",
    "You want to log changes so they can be reapplied after a crash.",
    "You want to structure a system around high-level operations built on primitive ones.",
  ],
  participants: [
    {
      name: "Command",
      role: "Declares an interface for executing (and optionally undoing) an operation.",
    },
    {
      name: "ConcreteCommand",
      role: "Binds a receiver to an action and implements execute by invoking the receiver.",
    },
    { name: "Receiver", role: "Knows how to perform the actual work of the request." },
    {
      name: "Invoker",
      role: "Holds a command and triggers its execution; does not know the concrete command.",
    },
    { name: "Client", role: "Creates concrete commands and configures their receivers." },
  ],
  conceptual: {
    title: "A command with undo support",
    summary:
      "Each command knows how to do and undo its work. An invoker executes commands and keeps a history it can roll back.",
    code: `protocol Command {
    func execute()
    func undo()
}

final class Light {
    private(set) var isOn = false
    func turnOn() { isOn = true }
    func turnOff() { isOn = false }
}

struct TurnOnCommand: Command {
    let light: Light
    func execute() { light.turnOn() }
    func undo() { light.turnOff() }
}

final class Switch {
    private var history: [Command] = []

    func run(_ command: Command) {
        command.execute()
        history.append(command)
    }

    func undoLast() {
        guard let last = history.popLast() else { return }
        last.undo()
    }
}

// Client
let light = Light()
let toggle = Switch()

toggle.run(TurnOnCommand(light: light))
print(light.isOn)   // true

toggle.undoLast()
print(light.isOn)   // false`,
  },
  realWorld: {
    title: "Undoable edits in a text document",
    summary:
      "Editing operations are commands pushed onto an undo stack. The editor replays or reverses them without knowing the concrete edit, and closures express simple commands compactly.",
    code: `import Foundation

protocol DocumentCommand {
    func execute()
    func undo()
}

final class TextDocument {
    private(set) var text: String = ""

    func append(_ s: String) { text += s }
    func removeLast(_ count: Int) { text.removeLast(min(count, text.count)) }
}

struct AppendText: DocumentCommand {
    let document: TextDocument
    let value: String
    func execute() { document.append(value) }
    func undo() { document.removeLast(value.count) }
}

final class Editor {
    let document = TextDocument()
    private var undoStack: [DocumentCommand] = []
    private var redoStack: [DocumentCommand] = []

    func perform(_ command: DocumentCommand) {
        command.execute()
        undoStack.append(command)
        redoStack.removeAll()
    }

    func undo() {
        guard let command = undoStack.popLast() else { return }
        command.undo()
        redoStack.append(command)
    }

    func redo() {
        guard let command = redoStack.popLast() else { return }
        command.execute()
        undoStack.append(command)
    }
}

let editor = Editor()
editor.perform(AppendText(document: editor.document, value: "Hello"))
editor.perform(AppendText(document: editor.document, value: ", world"))
print(editor.document.text)   // Hello, world

editor.undo()
print(editor.document.text)   // Hello

editor.redo()
print(editor.document.text)   // Hello, world`,
  },
  pros: [
    "Decouples the object that invokes an operation from the one that performs it.",
    "Commands are first-class values you can store, queue, log, and pass around.",
    "Makes undo/redo and transactional behavior straightforward to add.",
    "New commands can be introduced without changing existing invokers (open/closed).",
    "Composite commands let you assemble macros from simpler operations.",
  ],
  cons: [
    "Introduces an extra layer of objects for what may be a one-line call.",
    "Undo support requires carefully capturing and restoring prior state.",
    "A single-method command in Swift is often more naturally a closure.",
  ],
  relatedPatterns: ["memento", "composite", "chain-of-responsibility", "strategy", "prototype"],
  whenToReachFor: [
    "undo and redo support",
    "encapsulate a request as an object",
    "queue or schedule operations",
    "log and replay actions",
    "decouple invoker from receiver",
    "macro or transactional commands",
    "parameterize a button or menu with an action",
  ],
};
