import type { Pattern } from "../types.js";

export const factoryMethod: Pattern = {
  id: "factory-method",
  name: "Factory Method",
  category: "Creational",
  alsoKnownAs: ["Virtual Constructor"],
  intent:
    "Define an interface for creating an object but let subtypes decide which concrete type to instantiate, deferring instantiation to them.",
  problem:
    "A class needs to create objects but should not hard-code which concrete type to produce — the right choice depends on context, configuration, or the subtype in use. Calling a concrete initializer directly couples the creator to one product and forces edits to that creator whenever a new product is introduced.",
  solution:
    "Replace direct construction calls with a call to a factory method. A base type defines the factory method (sometimes with a default), and subtypes override it to return the concrete product they need. The surrounding code works against the product protocol and the factory method, so it stays the same as new products and creators are added.",
  applicability: [
    "A type cannot anticipate the class of objects it must create.",
    "A type wants its subtypes to specify the objects it creates.",
    "You want to localize the knowledge of which concrete product to build in one overridable method.",
    "Creation involves logic (selection, caching, configuration) that should not live at every call site.",
  ],
  participants: [
    {
      name: "Product",
      role: "Protocol for the objects the factory method creates.",
    },
    {
      name: "ConcreteProduct",
      role: "A specific implementation of the Product protocol.",
    },
    {
      name: "Creator",
      role: "Declares the factory method and uses its result; may provide a default implementation.",
    },
    {
      name: "ConcreteCreator",
      role: "Overrides the factory method to return a particular ConcreteProduct.",
    },
  ],
  conceptual: {
    title: "Subtypes choose the product",
    summary:
      "The creator's logic calls a factory method; each subtype overrides it to decide which concrete product is built.",
    code: `protocol Product {
    func use() -> String
}

struct ConcreteProductA: Product {
    func use() -> String { "Product A" }
}

struct ConcreteProductB: Product {
    func use() -> String { "Product B" }
}

class Creator {
    // The factory method — overridden by subtypes.
    func makeProduct() -> Product {
        ConcreteProductA()
    }

    // Logic shared by all creators, written against the abstraction.
    func operate() -> String {
        let product = makeProduct()
        return "Created: " + product.use()
    }
}

final class CreatorB: Creator {
    override func makeProduct() -> Product {
        ConcreteProductB()
    }
}

print(Creator().operate())    // Created: Product A
print(CreatorB().operate())   // Created: Product B`,
  },
  realWorld: {
    title: "Decoding payments to the right processor",
    summary:
      "A factory method maps a payment kind to a concrete processor. New payment types plug in by extending the factory, not by editing the checkout flow.",
    code: `import Foundation

protocol PaymentProcessor {
    func pay(amount: Decimal) -> String
}

struct CreditCardProcessor: PaymentProcessor {
    func pay(amount: Decimal) -> String {
        "Charged " + "\\(amount)" + " to card"
    }
}

struct ApplePayProcessor: PaymentProcessor {
    func pay(amount: Decimal) -> String {
        "Authorized " + "\\(amount)" + " via Apple Pay"
    }
}

struct PayPalProcessor: PaymentProcessor {
    func pay(amount: Decimal) -> String {
        "Sent " + "\\(amount)" + " through PayPal"
    }
}

enum PaymentMethod: String {
    case card, applePay, payPal
}

// The factory method centralizes the selection logic.
enum PaymentFactory {
    static func makeProcessor(for method: PaymentMethod) -> PaymentProcessor {
        switch method {
        case .card: return CreditCardProcessor()
        case .applePay: return ApplePayProcessor()
        case .payPal: return PayPalProcessor()
        }
    }
}

final class Checkout {
    func complete(amount: Decimal, using method: PaymentMethod) -> String {
        let processor = PaymentFactory.makeProcessor(for: method)
        return processor.pay(amount: amount)
    }
}

let checkout = Checkout()
print(checkout.complete(amount: 42, using: .card))      // Charged 42 to card
print(checkout.complete(amount: 19, using: .applePay))  // Authorized 19 via Apple Pay
print(checkout.complete(amount: 7, using: .payPal))     // Sent 7 through PayPal`,
  },
  pros: [
    "Decouples client code from the concrete types it instantiates.",
    "Centralizes creation logic so it is written and changed in one place.",
    "Adding a new product means adding a creator or case, not editing every call site.",
    "Supports the open/closed and single-responsibility principles.",
  ],
  cons: [
    "Can introduce a parallel hierarchy of creators alongside the products.",
    "More indirection than a direct initializer for a single, stable product.",
    "Subclass-based factory methods add inheritance where a closure or enum factory might be simpler in Swift.",
  ],
  relatedPatterns: ["abstract-factory", "template-method", "prototype", "builder", "singleton"],
  whenToReachFor: [
    "decide which concrete type to create at runtime",
    "let subtypes choose the product",
    "centralize object creation logic",
    "decouple client from concrete classes",
    "map an enum or config to a concrete implementation",
    "add new types without editing call sites",
  ],
};
