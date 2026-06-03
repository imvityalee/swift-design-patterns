import type { Pattern } from "../types.js";

export const decorator: Pattern = {
  id: "decorator",
  name: "Decorator",
  category: "Structural",
  alsoKnownAs: ["Wrapper"],
  intent:
    "Attach additional responsibilities to an object dynamically by wrapping it in another object that shares its interface, providing a flexible alternative to subclassing for extending behavior.",
  problem:
    "You need to add responsibilities — logging, caching, compression, encryption, scrolling, borders — to individual objects, not to a whole class, and ideally in combinations chosen at runtime. Doing this with subclassing produces an explosion of subclasses for every mix of features (BufferedEncryptedStream, CompressedBufferedStream, ...), and you cannot add or remove a feature from one live object without changing its type.",
  solution:
    "Define a Component protocol implemented by the concrete object you want to extend. A Decorator also conforms to that protocol and holds a reference to a wrapped Component. It forwards calls to the wrapped object, adding behavior before and/or after. Because a decorator is itself a Component, decorators can wrap other decorators, stacking responsibilities in any order. Clients keep using the same protocol and never know how many layers are underneath.",
  applicability: [
    "You want to add responsibilities to individual objects transparently, without affecting others.",
    "Responsibilities can be withdrawn or combined in arbitrary order at runtime.",
    "Subclassing to extend behavior would be impractical or cause a combinatorial explosion of subclasses.",
    "You want to keep each added behavior small, focused, and independently testable.",
  ],
  participants: [
    {
      name: "Component",
      role: "Protocol for objects that can have responsibilities added dynamically.",
    },
    {
      name: "ConcreteComponent",
      role: "The base object to which extra behavior is attached.",
    },
    {
      name: "Decorator",
      role: "Conforms to Component and holds a wrapped Component, forwarding requests to it.",
    },
    {
      name: "ConcreteDecorator",
      role: "Adds behavior before/after delegating to the wrapped component.",
    },
  ],
  conceptual: {
    title: "Stacking wrappers over a component",
    summary:
      "Each decorator conforms to the same protocol it wraps, so decorators compose: the call passes through every layer in turn.",
    code: `protocol Component {
    func operation() -> String
}

struct ConcreteComponent: Component {
    func operation() -> String { "core" }
}

// Base decorator holds a wrapped component and forwards to it.
class Decorator: Component {
    let wrapped: Component

    init(_ wrapped: Component) {
        self.wrapped = wrapped
    }

    func operation() -> String { wrapped.operation() }
}

final class DecoratorA: Decorator {
    override func operation() -> String {
        "A(" + super.operation() + ")"
    }
}

final class DecoratorB: Decorator {
    override func operation() -> String {
        "B(" + super.operation() + ")"
    }
}

// Wrap in any order; the client still just calls operation().
let decorated: Component = DecoratorA(DecoratorB(ConcreteComponent()))
print(decorated.operation())   // A(B(core))`,
  },
  realWorld: {
    title: "Layering behavior over a data source",
    summary:
      "A plain data source is wrapped with compression and then encryption decorators. Each layer transforms the bytes on the way through, and layers can be added or reordered without new subclasses.",
    code: `import Foundation

protocol DataSource {
    func write(_ data: String) -> String   // returns what gets persisted
}

// The concrete component: stores the raw string as-is.
struct FileDataSource: DataSource {
    func write(_ data: String) -> String {
        print("Persisting:", data)
        return data
    }
}

// Base decorator wraps another DataSource.
class DataSourceDecorator: DataSource {
    private let wrapped: DataSource

    init(_ wrapped: DataSource) {
        self.wrapped = wrapped
    }

    func write(_ data: String) -> String {
        wrapped.write(data)
    }
}

final class CompressionDecorator: DataSourceDecorator {
    override func write(_ data: String) -> String {
        let compressed = "gzip(" + data + ")"
        return super.write(compressed)
    }
}

final class EncryptionDecorator: DataSourceDecorator {
    override func write(_ data: String) -> String {
        let encrypted = "enc(" + data + ")"
        return super.write(encrypted)
    }
}

// Plain source.
let plain: DataSource = FileDataSource()
_ = plain.write("hello")
// Persisting: hello

// Compose layers: encrypt the already-compressed payload.
let secured: DataSource = EncryptionDecorator(CompressionDecorator(FileDataSource()))
let stored = secured.write("hello")
// Persisting: enc(gzip(hello))
print("Stored value:", stored)   // Stored value: enc(gzip(hello))`,
  },
  pros: [
    "Adds or removes responsibilities at runtime without touching the wrapped object's class.",
    "Combines behaviors by stacking decorators, avoiding a subclass for every combination.",
    "Each decorator has a single responsibility and is independently testable.",
    "Honors open/closed: extend behavior by adding wrappers, not editing existing types.",
  ],
  cons: [
    "Many small wrapper objects can make the system harder to understand and debug.",
    "Behavior may depend on wrapping order, which is easy to get wrong.",
    "Removing a specific layer from deep in a stack is awkward.",
    "Decorators and the component must keep identical interfaces, so the interface should stay lean.",
  ],
  relatedPatterns: ["composite", "adapter", "proxy", "strategy", "chain-of-responsibility"],
  whenToReachFor: [
    "add behavior to an object at runtime",
    "wrap an object to extend it without subclassing",
    "stack or combine optional features",
    "logging caching compression encryption layers",
    "avoid subclass explosion for feature combinations",
    "transparent wrapper sharing the same interface",
  ],
};
