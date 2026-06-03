import type { Pattern } from "../types.js";

export const bridge: Pattern = {
  id: "bridge",
  name: "Bridge",
  category: "Structural",
  alsoKnownAs: ["Handle/Body"],
  intent:
    "Decouple an abstraction from its implementation so the two can vary independently, replacing a combinatorial class hierarchy with two cooperating hierarchies linked by composition.",
  problem:
    "A type varies along two (or more) independent dimensions — say a shape that can be drawn with different rendering backends, or a notification that can be sent over different transports. Modeling every combination with subclassing produces a class explosion (RasterCircle, VectorCircle, RasterSquare, VectorSquare, ...). Adding a new shape or a new backend forces edits across the whole grid.",
  solution:
    "Split the two dimensions into separate hierarchies. The Abstraction holds a reference to an Implementor protocol and forwards the low-level work to it, while exposing higher-level operations to clients. Each dimension is now extended on its own: add a refined abstraction without touching implementors, and add a concrete implementor without touching abstractions. The reference connecting the two is the bridge.",
  applicability: [
    "A type varies along two or more orthogonal dimensions and subclassing would multiply combinations.",
    "You want to switch or share an implementation at runtime rather than binding it at compile time.",
    "Both the abstraction and its implementation should be extensible by subclassing/conformance independently.",
    "Implementation details should be hidden from clients and changeable without recompiling them.",
  ],
  participants: [
    {
      name: "Abstraction",
      role: "Defines the high-level interface clients use and keeps a reference to an Implementor.",
    },
    {
      name: "RefinedAbstraction",
      role: "Extends or specializes the abstraction without depending on a concrete implementor.",
    },
    {
      name: "Implementor",
      role: "Protocol for the low-level operations; deliberately different in shape from the Abstraction.",
    },
    {
      name: "ConcreteImplementor",
      role: "A specific implementation of the Implementor protocol.",
    },
  ],
  conceptual: {
    title: "Abstraction bridged to an implementor",
    summary:
      "An Abstraction delegates primitive work to whatever Implementor it was given; refining the abstraction and adding implementors happen on separate axes.",
    code: `protocol Implementor {
    func primitive() -> String
}

struct ImplementorA: Implementor {
    func primitive() -> String { "A" }
}

struct ImplementorB: Implementor {
    func primitive() -> String { "B" }
}

class Abstraction {
    let implementor: Implementor

    init(_ implementor: Implementor) {
        self.implementor = implementor
    }

    func operation() -> String {
        "Abstraction(" + implementor.primitive() + ")"
    }
}

final class RefinedAbstraction: Abstraction {
    override func operation() -> String {
        "Refined[" + super.operation() + "]"
    }
}

// Client picks any combination of the two axes.
print(Abstraction(ImplementorA()).operation())        // Abstraction(A)
print(RefinedAbstraction(ImplementorB()).operation())  // Refined[Abstraction(B)]`,
  },
  realWorld: {
    title: "Notifications across channels and urgency levels",
    summary:
      "The message hierarchy (normal, urgent) varies independently from the delivery channel (push, SMS, email). Each new channel is one conforming type, and each new message kind is one subclass — no grid of combinations.",
    code: `import Foundation

// Implementor axis: how a message physically goes out.
protocol MessageChannel {
    var name: String { get }
    func send(title: String, body: String)
}

struct PushChannel: MessageChannel {
    let name = "Push"
    func send(title: String, body: String) {
        print("[Push]", title, "-", body)
    }
}

struct SMSChannel: MessageChannel {
    let name = "SMS"
    func send(title: String, body: String) {
        // SMS has no title; fold it into the text.
        print("[SMS]", title + ": " + body)
    }
}

struct EmailChannel: MessageChannel {
    let name = "Email"
    func send(title: String, body: String) {
        print("[Email] Subject:", title)
        print("        Body:", body)
    }
}

// Abstraction axis: what kind of message we are sending.
class Notification {
    let channel: MessageChannel

    init(over channel: MessageChannel) {
        self.channel = channel
    }

    func notify(title: String, body: String) {
        channel.send(title: title, body: body)
    }
}

final class UrgentNotification: Notification {
    override func notify(title: String, body: String) {
        super.notify(title: "URGENT: " + title, body: body)
    }
}

// Same abstraction, swap the channel freely.
let push = Notification(over: PushChannel())
push.notify(title: "Welcome", body: "Thanks for signing up.")
// [Push] Welcome - Thanks for signing up.

let urgentEmail = UrgentNotification(over: EmailChannel())
urgentEmail.notify(title: "Payment failed", body: "Please update your card.")
// [Email] Subject: URGENT: Payment failed
//         Body: Please update your card.

let urgentSMS = UrgentNotification(over: SMSChannel())
urgentSMS.notify(title: "Login detected", body: "New device used.")
// [SMS] URGENT: Login detected: New device used.`,
  },
  pros: [
    "Replaces a combinatorial subclass grid with two independently extensible hierarchies.",
    "Lets you switch or share an implementation at runtime.",
    "Hides implementation details from clients (Single Responsibility on each axis).",
    "Open/closed: add abstractions or implementors without disturbing the other side.",
  ],
  cons: [
    "Adds indirection and an extra layer that can feel like overkill for a single dimension.",
    "You must identify the orthogonal axes up front; refactoring into a bridge later is more work.",
    "More moving parts to wire together at construction time.",
  ],
  relatedPatterns: ["abstract-factory", "adapter", "strategy", "state"],
  whenToReachFor: [
    "two independent dimensions of variation",
    "avoid class explosion from subclassing combinations",
    "decouple abstraction from implementation",
    "swap backend or platform implementation at runtime",
    "pluggable rendering or transport layer",
    "extend interface and implementation separately",
  ],
};
