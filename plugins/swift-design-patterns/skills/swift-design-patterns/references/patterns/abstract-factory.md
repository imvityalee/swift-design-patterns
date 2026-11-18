# Abstract Factory  _(Creational)_
**Also known as:** Kit

**Intent.** Provide an interface for creating families of related objects without specifying their concrete types, so a whole family can be swapped together.

**Problem.** Your code must produce several kinds of objects that are meant to work together — a button, a checkbox, and a slider that all share one visual theme, for example. If clients instantiate concrete types directly, nothing stops them from mixing a dark-theme button with a light-theme slider, and adding a new theme means editing every call site that constructs a widget.

**Solution.** Declare a factory protocol with one creation method per product in the family. Each concrete factory implements that protocol to build one coherent variant of every product. Clients receive a factory through the protocol and ask it for products, so the entire family is chosen in a single place and the parts are guaranteed to match.

**When to use it**
- Your system must be independent of how its products are created and represented.
- You need to configure a system with one of several families of related products.
- A family of related product objects is designed to be used together and you must enforce that constraint.
- You want to expose only the interfaces of a product library, not its implementations.

**Participants**
- **AbstractFactory** — Protocol declaring a creation method for each kind of product in the family.
- **ConcreteFactory** — Implements the creation methods to produce one coherent variant of every product.
- **AbstractProduct** — Protocol for a kind of product (one per creation method).
- **ConcreteProduct** — A specific product built by a matching concrete factory.
- **Client** — Uses only the AbstractFactory and AbstractProduct protocols; never names a concrete type.

## Conceptual example — Two product families behind one factory protocol
A factory protocol creates two related products. Each concrete factory builds a matching set, so the client never mixes variants.
```swift
protocol ProductA {
    func describe() -> String
}

protocol ProductB {
    func collaborate(with a: ProductA) -> String
}

protocol Factory {
    func makeA() -> ProductA
    func makeB() -> ProductB
}

struct A1: ProductA {
    func describe() -> String { "A1" }
}

struct B1: ProductB {
    func collaborate(with a: ProductA) -> String { "B1 + " + a.describe() }
}

struct Family1Factory: Factory {
    func makeA() -> ProductA { A1() }
    func makeB() -> ProductB { B1() }
}

struct A2: ProductA {
    func describe() -> String { "A2" }
}

struct B2: ProductB {
    func collaborate(with a: ProductA) -> String { "B2 + " + a.describe() }
}

struct Family2Factory: Factory {
    func makeA() -> ProductA { A2() }
    func makeB() -> ProductB { B2() }
}

// Client depends only on the protocols.
func run(with factory: Factory) {
    let a = factory.makeA()
    let b = factory.makeB()
    print(b.collaborate(with: a))
}

run(with: Family1Factory())   // B1 + A1
run(with: Family2Factory())   // B2 + A2
```

## Real-world example — Themed UI component kit
A theme factory produces a matching button and label. Switching the factory swaps the entire look at once, with no chance of mismatched parts.
```swift
import Foundation

protocol ThemedButton {
    func render() -> String
}

protocol ThemedLabel {
    func render(_ text: String) -> String
}

protocol ThemeFactory {
    func makeButton(title: String) -> ThemedButton
    func makeLabel() -> ThemedLabel
}

// Light family
struct LightButton: ThemedButton {
    let title: String
    func render() -> String { "[ " + title + " ] on white" }
}

struct LightLabel: ThemedLabel {
    func render(_ text: String) -> String { text + " (dark text)" }
}

struct LightThemeFactory: ThemeFactory {
    func makeButton(title: String) -> ThemedButton { LightButton(title: title) }
    func makeLabel() -> ThemedLabel { LightLabel() }
}

// Dark family
struct DarkButton: ThemedButton {
    let title: String
    func render() -> String { "[ " + title + " ] on charcoal" }
}

struct DarkLabel: ThemedLabel {
    func render(_ text: String) -> String { text + " (light text)" }
}

struct DarkThemeFactory: ThemeFactory {
    func makeButton(title: String) -> ThemedButton { DarkButton(title: title) }
    func makeLabel() -> ThemedLabel { DarkLabel() }
}

// A screen builds its widgets from whatever factory it is handed.
final class SettingsScreen {
    private let factory: ThemeFactory

    init(factory: ThemeFactory) {
        self.factory = factory
    }

    func body() -> String {
        let label = factory.makeLabel()
        let button = factory.makeButton(title: "Save")
        return label.render("Settings") + " | " + button.render()
    }
}

func factory(forDarkMode dark: Bool) -> ThemeFactory {
    dark ? DarkThemeFactory() : LightThemeFactory()
}

let light = SettingsScreen(factory: factory(forDarkMode: false))
print(light.body())   // Settings (dark text) | [ Save ] on white

let dark = SettingsScreen(factory: factory(forDarkMode: true))
print(dark.body())    // Settings (light text) | [ Save ] on charcoal
```

**Pros**
- Guarantees products from one factory are compatible with each other.
- Isolates concrete classes — clients depend only on protocols.
- Swapping the entire product family is a one-line change at the composition root.
- Supports the open/closed principle for adding new families.

**Cons**
- Adding a new kind of product means changing the factory protocol and every concrete factory.
- Introduces many small types and an extra layer of indirection.
- Can be overkill when only one product family will ever exist.

**Related patterns:** factory-method, builder, prototype, singleton, bridge
