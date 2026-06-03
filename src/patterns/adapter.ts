import type { Pattern } from "../types.js";

export const adapter: Pattern = {
  id: "adapter",
  name: "Adapter",
  category: "Structural",
  alsoKnownAs: ["Wrapper"],
  intent:
    "Convert the interface of an existing type into another interface that clients expect, letting types that could not otherwise cooperate work together.",
  problem:
    "You want to use an existing class — a third-party SDK, a legacy module, a system API — but its interface does not match the protocol your code is written against. You cannot or should not change the existing class, and rewriting every call site to its shape would scatter the dependency throughout your codebase.",
  solution:
    "Introduce an adapter that conforms to the interface the client expects and holds (or wraps) the incompatible object. The adapter translates each call from the expected interface into one or more calls on the wrapped object, converting arguments and results as needed. The client talks only to the target protocol and stays unaware of the foreign interface behind it.",
  applicability: [
    "You want to use an existing class whose interface does not match what your code requires.",
    "You need to integrate a third-party or legacy component without altering its source.",
    "You want to expose a uniform protocol over several incompatible providers.",
    "You are isolating your code from an external dependency so it can be swapped later.",
  ],
  participants: [
    {
      name: "Target",
      role: "The protocol the client is written against and expects to call.",
    },
    {
      name: "Client",
      role: "Collaborates with objects through the Target protocol only.",
    },
    {
      name: "Adaptee",
      role: "The existing type with a useful but incompatible interface.",
    },
    {
      name: "Adapter",
      role: "Conforms to Target and translates its calls into calls on the wrapped Adaptee.",
    },
  ],
  conceptual: {
    title: "Wrapping an incompatible interface behind a target protocol",
    summary:
      "The client expects a Target protocol; an adapter conforms to it and forwards each call to an adaptee with a different method shape.",
    code: `// What the client expects.
protocol Target {
    func request() -> String
}

// Existing type with an incompatible interface.
final class Adaptee {
    func specificRequest() -> String {
        "data from adaptee"
    }
}

// Adapter conforms to Target, wraps an Adaptee, and translates.
final class Adapter: Target {
    private let adaptee: Adaptee

    init(_ adaptee: Adaptee) {
        self.adaptee = adaptee
    }

    func request() -> String {
        "Adapter: " + adaptee.specificRequest()
    }
}

// Client works only with the Target interface.
func clientCode(_ target: Target) {
    print(target.request())
}

clientCode(Adapter(Adaptee()))   // Adapter: data from adaptee`,
  },
  realWorld: {
    title: "Unifying multiple payment SDKs behind one protocol",
    summary:
      "Two payment providers ship incompatible APIs. Each gets an adapter conforming to a single PaymentProcessor protocol, so checkout code charges any provider the same way and providers can be swapped freely.",
    code: `import Foundation

// The interface the app's checkout is written against.
protocol PaymentProcessor {
    func pay(amount: Decimal, currency: String) -> Bool
}

// Adaptee 1: a third-party SDK using cents and a result enum.
final class StripeSDK {
    enum Outcome { case succeeded, failed }

    func createCharge(amountInCents: Int, currencyCode: String) -> Outcome {
        amountInCents > 0 ? .succeeded : .failed
    }
}

// Adaptee 2: a legacy gateway using doubles and throwing.
final class LegacyGateway {
    struct GatewayError: Error {}

    func submit(value: Double, iso4217: String) throws {
        if value <= 0 { throw GatewayError() }
        // ... performs the transfer ...
    }
}

// Adapter for Stripe: converts Decimal to integer cents.
final class StripeAdapter: PaymentProcessor {
    private let sdk = StripeSDK()

    func pay(amount: Decimal, currency: String) -> Bool {
        let cents = NSDecimalNumber(decimal: amount * 100).intValue
        return sdk.createCharge(amountInCents: cents, currencyCode: currency) == .succeeded
    }
}

// Adapter for the legacy gateway: bridges throwing into a Bool.
final class LegacyAdapter: PaymentProcessor {
    private let gateway = LegacyGateway()

    func pay(amount: Decimal, currency: String) -> Bool {
        do {
            try gateway.submit(value: NSDecimalNumber(decimal: amount).doubleValue, iso4217: currency)
            return true
        } catch {
            return false
        }
    }
}

// Checkout neither knows nor cares which SDK is behind the protocol.
func checkout(using processor: PaymentProcessor, total: Decimal) {
    let ok = processor.pay(amount: total, currency: "USD")
    print(ok ? "Payment approved" : "Payment declined")
}

checkout(using: StripeAdapter(), total: 19.99)   // Payment approved
checkout(using: LegacyAdapter(), total: 42.00)   // Payment approved`,
  },
  pros: [
    "Reuses existing or third-party code without modifying it.",
    "Decouples the client from a concrete external interface, easing future swaps.",
    "Centralizes interface-translation logic in one place (single responsibility).",
    "Lets several incompatible providers be used through one uniform protocol.",
  ],
  cons: [
    "Adds an extra layer of indirection and more types to maintain.",
    "Translating a poorly matched interface can require awkward or lossy conversions.",
    "Overuse can hide that the underlying abstractions simply do not fit well.",
  ],
  relatedPatterns: ["bridge", "decorator", "facade", "proxy", "composite"],
  whenToReachFor: [
    "make an incompatible interface fit",
    "wrap a third-party or legacy sdk",
    "convert one interface into another",
    "unify multiple providers behind one protocol",
    "integrate code you cannot modify",
    "isolate an external dependency",
    "bridge mismatched method signatures",
  ],
};
