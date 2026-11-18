# Strategy  _(Behavioral)_
**Also known as:** Policy

**Intent.** Define a family of interchangeable algorithms, encapsulate each one behind a common abstraction, and let the algorithm vary independently of the clients that use it.

**Problem.** A type accumulates several variants of the same operation (different sorting orders, pricing rules, route-finding strategies). Selecting between them with branching logic makes the type large, hard to test, and painful to extend — every new variant edits the same method.

**Solution.** Extract each variant into its own type conforming to a shared protocol. The original type (the Context) holds a reference to a protocol value and delegates the work to it, so swapping behavior is a matter of injecting a different conforming value — at construction time or at runtime.

**When to use it**
- You have many related classes that differ only in their behavior.
- You need different variants of an algorithm and want to switch between them at runtime.
- An algorithm has data the client should not know about; isolate it behind a strategy.
- A type has a massive conditional that selects between behaviors of the same kind.

**Participants**
- **Strategy** — Protocol common to all supported algorithms.
- **ConcreteStrategy** — A specific implementation of the algorithm.
- **Context** — Holds a Strategy reference and delegates work to it; exposes a setter to swap strategies.
- **Client** — Creates a concrete strategy and injects it into the context.

## Conceptual example — Interchangeable sorting algorithms
A Context delegates sorting to whichever Strategy it currently holds; the client swaps the strategy at runtime.
```swift
protocol SortStrategy {
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
print(context.run(on: [3, 1, 2]))   // [3, 2, 1]
```

## Real-world example — Pluggable shipping-cost calculation in a checkout
Each carrier is a strategy. The order computes a price through whichever strategy the user selected, and Swift closures can stand in for trivial strategies.
```swift
import Foundation

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
print(order.shippingCost())                 // 0
```

**Pros**
- Swap algorithms at runtime by injecting a different value.
- Isolates algorithm internals from the code that uses them.
- Replaces conditional branching with polymorphism — open/closed for new variants.
- Each strategy is independently testable.

**Cons**
- Adds types/indirection; overkill if behavior rarely changes.
- Clients must understand the differences to pick the right strategy.
- In Swift, a single-method strategy is often better expressed as a closure.

**Related patterns:** state, template-method, command, bridge, decorator
