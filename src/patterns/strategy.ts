import type { Pattern } from "../types.js";

export const strategy: Pattern = {
  id: "strategy",
  name: "Strategy",
  category: "Behavioral",
  alsoKnownAs: ["Policy"],
  intent:
    "Define a family of interchangeable algorithms, encapsulate each one behind a common abstraction, and let the algorithm vary independently of the clients that use it.",
  problem:
    "A type accumulates several variants of the same operation (different sorting orders, pricing rules, route-finding strategies). Selecting between them with branching logic makes the type large, hard to test, and painful to extend — every new variant edits the same method.",
  solution:
    "Extract each variant into its own type conforming to a shared protocol. The original type (the Context) holds a reference to a protocol value and delegates the work to it, so swapping behavior is a matter of injecting a different conforming value — at construction time or at runtime.",
  applicability: [
    "You have many related classes that differ only in their behavior.",
    "You need different variants of an algorithm and want to switch between them at runtime.",
    "An algorithm has data the client should not know about; isolate it behind a strategy.",
    "A type has a massive conditional that selects between behaviors of the same kind.",
  ],
  participants: [
    { name: "Strategy", role: "Protocol common to all supported algorithms." },
    { name: "ConcreteStrategy", role: "A specific implementation of the algorithm." },
    {
      name: "Context",
      role: "Holds a Strategy reference and delegates work to it; exposes a setter to swap strategies.",
    },
    { name: "Client", role: "Creates a concrete strategy and injects it into the context." },
  ],
  conceptual: {
    title: "Interchangeable sorting algorithms",
    summary:
      "A Context delegates sorting to whichever Strategy it currently holds; the client swaps the strategy at runtime.",
    code: `protocol SortStrategy {
    func sort<T: Comparable>(_ data: [T]) -> [T]
}

struct AscendingSort: SortStrategy {
    func sort<T: Comparable>(_ data: [T]) -> [T] { data.sorted() }
}

struct DescendingSort: SortStrategy {
    func sort<T: Comparable>(_ data: [T]) -> [T] { data.sorted(by: >) }
}

final class SortContext {
    private var strategy: SortStrategy

    init(strategy: SortStrategy) {
        self.strategy = strategy
    }

    func update(strategy: SortStrategy) {
        self.strategy = strategy
    }

    func run(on data: [Int]) -> [Int] {
        strategy.sort(data)
    }
}

// Client
let context = SortContext(strategy: AscendingSort())
print(context.run(on: [3, 1, 2]))   // [1, 2, 3]

context.update(strategy: DescendingSort())
print(context.run(on: [3, 1, 2]))   // [3, 2, 1]`,
  },
  realWorld: {
    title: "Pluggable shipping-cost calculation in a checkout",
    summary:
      "Each carrier is a strategy. The order computes a price through whichever strategy the user selected, and Swift closures can stand in for trivial strategies.",
    code: `import Foundation

protocol ShippingStrategy {
    var name: String { get }
    func cost(for weightKg: Double, distanceKm: Double) -> Decimal
}

struct StandardShipping: ShippingStrategy {
    let name = "Standard"
    func cost(for weightKg: Double, distanceKm: Double) -> Decimal {
        Decimal(5 + weightKg * 0.5)
    }
}

struct ExpressShipping: ShippingStrategy {
    let name = "Express"
    func cost(for weightKg: Double, distanceKm: Double) -> Decimal {
        Decimal(12 + weightKg * 0.5 + distanceKm * 0.02)
    }
}

struct FreeShipping: ShippingStrategy {
    let name = "Free"
    func cost(for weightKg: Double, distanceKm: Double) -> Decimal { 0 }
}

final class Order {
    var weightKg: Double
    var distanceKm: Double
    private var shipping: ShippingStrategy

    init(weightKg: Double, distanceKm: Double, shipping: ShippingStrategy) {
        self.weightKg = weightKg
        self.distanceKm = distanceKm
        self.shipping = shipping
    }

    func selectShipping(_ strategy: ShippingStrategy) {
        shipping = strategy
    }

    func shippingCost() -> Decimal {
        shipping.cost(for: weightKg, distanceKm: distanceKm)
    }
}

let order = Order(weightKg: 2, distanceKm: 300, shipping: StandardShipping())
print(order.shippingCost())                 // 6

order.selectShipping(ExpressShipping())
print(order.shippingCost())                 // 19

// Promo: free shipping over a threshold — strategies are just values.
if order.weightKg < 5 { order.selectShipping(FreeShipping()) }
print(order.shippingCost())                 // 0`,
  },
  pros: [
    "Swap algorithms at runtime by injecting a different value.",
    "Isolates algorithm internals from the code that uses them.",
    "Replaces conditional branching with polymorphism — open/closed for new variants.",
    "Each strategy is independently testable.",
  ],
  cons: [
    "Adds types/indirection; overkill if behavior rarely changes.",
    "Clients must understand the differences to pick the right strategy.",
    "In Swift, a single-method strategy is often better expressed as a closure.",
  ],
  relatedPatterns: ["state", "template-method", "command", "bridge", "decorator"],
  whenToReachFor: [
    "multiple interchangeable algorithms",
    "switch behavior at runtime",
    "replace a big if/else or switch selecting between behaviors",
    "pluggable policy",
    "different calculation/sorting/pricing variants",
    "inject behavior via protocol or closure",
    "open closed principle for algorithm families",
  ],
};
