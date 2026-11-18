# Command  _(Behavioral)_
**Also known as:** Action, Transaction

**Intent.** Encapsulate a request as an object, letting you parameterize clients with different requests, queue or log requests, and support undoable operations.

**Problem.** You need to issue requests to objects without knowing anything about the operation being requested or its receiver. Calling methods directly hard-wires the invoker to the receiver and makes it impossible to queue, log, schedule, or undo an action after the fact.

**Solution.** Turn a request into a standalone command object that exposes a uniform execute method and holds everything needed to perform the action — the receiver and any arguments. Invokers trigger commands without knowing their concrete type, so commands can be stored, passed around, queued, and (by also recording how to reverse themselves) undone.

**When to use it**
- You want to parameterize objects with an action to perform, decoupling who triggers it from what it does.
- You need to queue, schedule, or execute requests at different times.
- You want to support undo/redo by recording executed operations.
- You want to log changes so they can be reapplied after a crash.
- You want to structure a system around high-level operations built on primitive ones.

**Participants**
- **Command** — Declares an interface for executing (and optionally undoing) an operation.
- **ConcreteCommand** — Binds a receiver to an action and implements execute by invoking the receiver.
- **Receiver** — Knows how to perform the actual work of the request.
- **Invoker** — Holds a command and triggers its execution; does not know the concrete command.
- **Client** — Creates concrete commands and configures their receivers.

## Conceptual example — A command with undo support
Each command knows how to do and undo its work. An invoker executes commands and keeps a history it can roll back.
```swift
protocol Command {
    func execute()
    func undo()
}

final class Light {
    private var on = false
    var isOn: Bool { on }
    func turnOn() { on = true }
    func turnOff() { on = false }
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
print(light.isOn)   // false
```

## Real-world example — Undoable edits in a text document
Editing operations are commands pushed onto an undo stack. The editor replays or reverses them without knowing the concrete edit, and closures express simple commands compactly.
```swift
import Foundation

protocol DocumentCommand {
    func execute()
    func undo()
}

final class TextDocument {
    private var buffer = ""
    var text: String { buffer }

    func append(_ s: String) { buffer += s }
    func removeLast(_ count: Int) { buffer.removeLast(min(count, buffer.count)) }
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
print(editor.document.text)   // Hello, world
```

**Pros**
- Decouples the object that invokes an operation from the one that performs it.
- Commands are first-class values you can store, queue, log, and pass around.
- Makes undo/redo and transactional behavior straightforward to add.
- New commands can be introduced without changing existing invokers (open/closed).
- Composite commands let you assemble macros from simpler operations.

**Cons**
- Introduces an extra layer of objects for what may be a one-line call.
- Undo support requires carefully capturing and restoring prior state.
- A single-method command in Swift is often more naturally a closure.

**Related patterns:** memento, composite, chain-of-responsibility, strategy, prototype
