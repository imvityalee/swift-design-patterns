import type { Pattern } from "../types.js";

export const mediator: Pattern = {
  id: "mediator",
  name: "Mediator",
  category: "Behavioral",
  alsoKnownAs: ["Intermediary", "Controller"],
  intent:
    "Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and lets you vary their interaction independently.",
  problem:
    "A group of objects need to collaborate, but if each one talks directly to all the others, the dependencies form a dense web. Every component ends up knowing about many peers, the wiring is duplicated, and a component can no longer be reused or tested in isolation because it is hard-wired to specific collaborators.",
  solution:
    "Introduce a mediator object that sits between the colleagues. Colleagues never reference each other directly; instead they notify the mediator of events, and the mediator decides what should happen and forwards instructions to the right peers. The many-to-many graph of dependencies collapses into a star: each colleague knows only the mediator, and all interaction logic lives in one place.",
  applicability: [
    "A set of objects communicate in well-defined but complex ways, producing tangled dependencies that are hard to follow.",
    "Reusing a component is difficult because it depends on and talks to many others.",
    "Behavior distributed across several classes should be customizable without subclassing all of them.",
    "You want to centralize control logic that currently lives scattered across many widgets or services.",
  ],
  participants: [
    {
      name: "Mediator",
      role: "Protocol declaring how colleagues notify the mediator of events.",
    },
    {
      name: "ConcreteMediator",
      role: "Implements coordination logic, knows and maintains its colleagues, and orchestrates their interaction.",
    },
    {
      name: "Colleague",
      role: "Holds a reference to its mediator and communicates with it instead of with other colleagues.",
    },
  ],
  conceptual: {
    title: "Colleagues that talk only through a mediator",
    summary:
      "Two colleagues never reference each other; each notifies the mediator, which decides how the others should react.",
    code: `protocol Mediator: AnyObject {
    func notify(sender: Colleague, event: String)
}

class Colleague {
    weak var mediator: Mediator?
    let name: String

    init(name: String) {
        self.name = name
    }

    func send(_ event: String) {
        print(name, "sends:", event)
        mediator?.notify(sender: self, event: event)
    }

    func receive(_ event: String) {
        print(name, "reacts to:", event)
    }
}

final class ConcreteMediator: Mediator {
    private let left: Colleague
    private let right: Colleague

    init(left: Colleague, right: Colleague) {
        self.left = left
        self.right = right
        left.mediator = self
        right.mediator = self
    }

    func notify(sender: Colleague, event: String) {
        // All interaction logic lives here.
        let other = sender === left ? right : left
        other.receive(event)
    }
}

// Client
let a = Colleague(name: "A")
let b = Colleague(name: "B")
let mediator = ConcreteMediator(left: a, right: b)

a.send("ping")
// A sends: ping
// B reacts to: ping

b.send("pong")
// B sends: pong
// A reacts to: pong`,
  },
  realWorld: {
    title: "A form dialog that coordinates its controls",
    summary:
      "A login dialog acts as the mediator: the username field, password field, and submit button never reference each other; each reports changes to the dialog, which enables or disables the button and runs validation.",
    code: `import Foundation

protocol DialogMediator: AnyObject {
    func controlChanged(_ control: Control)
}

class Control {
    weak var mediator: DialogMediator?
    let id: String

    init(id: String) {
        self.id = id
    }

    func changed() {
        mediator?.controlChanged(self)
    }
}

final class TextField: Control {
    var text: String = "" {
        didSet { changed() }
    }
}

final class Button: Control {
    var isEnabled = false {
        didSet { print("Button", id, isEnabled ? "enabled" : "disabled") }
    }

    func click() {
        guard isEnabled else {
            print("Button", id, "ignored (disabled)")
            return
        }
        changed()
    }
}

final class LoginDialog: DialogMediator {
    private let username = TextField(id: "username")
    private let password = TextField(id: "password")
    private let submit = Button(id: "submit")

    init() {
        username.mediator = self
        password.mediator = self
        submit.mediator = self
    }

    func type(username value: String) { username.text = value }
    func type(password value: String) { password.text = value }
    func tapSubmit() { submit.click() }

    func controlChanged(_ control: Control) {
        if control === submit {
            print("Submitting login for:", username.text)
            return
        }
        // Coordination: the button is valid only when both fields are filled.
        submit.isEnabled = !username.text.isEmpty && password.text.count >= 6
    }
}

let dialog = LoginDialog()
dialog.tapSubmit()                  // Button submit ignored (disabled)
dialog.type(username: "ada")        // (no change to button yet)
dialog.type(password: "lovelace")   // Button submit enabled
dialog.tapSubmit()                  // Submitting login for: ada`,
  },
  pros: [
    "Removes direct dependencies between colleagues, replacing a many-to-many graph with a star.",
    "Centralizes interaction logic in one place that is easy to find and modify.",
    "Colleagues become reusable because they no longer hard-code references to specific peers.",
    "You can introduce new mediators to vary how the same colleagues interact.",
  ],
  cons: [
    "The mediator can grow into a god object that knows too much and becomes hard to maintain.",
    "Centralizing control can simply move complexity rather than reduce it.",
    "Indirection makes the flow of a single interaction harder to trace through the code.",
  ],
  relatedPatterns: ["observer", "facade", "command"],
  whenToReachFor: [
    "objects reference each other in a tangled web",
    "decouple components that talk directly",
    "centralize coordination logic",
    "ui controls that enable/disable each other",
    "reduce many-to-many dependencies",
    "chat room or hub routing messages between peers",
  ],
};
