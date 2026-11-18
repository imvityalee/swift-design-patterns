# Flyweight  _(Structural)_
**Also known as:** Cache

**Intent.** Share fine-grained objects to support large numbers of them efficiently, by separating the state that can be shared (intrinsic) from the state that varies per use (extrinsic).

**Problem.** Some programs create an enormous number of nearly identical objects — characters in a document, tiles in a map, particles in a simulation. Each object carries heavy data (a glyph outline, a texture, a sprite sheet) that is identical across thousands of instances. Storing that data per instance blows up memory and slows allocation, even though the duplicated bytes never change.

**Solution.** Split each object's state into two parts. Intrinsic state is shared, context-independent, and immutable — store one copy in a flyweight object. Extrinsic state varies per occurrence and is passed in by the caller (or held by the context) when an operation runs. A factory hands out flyweights, returning an existing shared instance whenever the intrinsic state matches instead of allocating a new one.

**When to use it**
- An application uses a very large number of objects that drive up memory cost.
- Most of each object's state can be made extrinsic and supplied from the outside.
- Many groups of objects can be replaced by a few shared flyweights once extrinsic state is removed.
- The application does not depend on object identity for the shared parts.

**Participants**
- **Flyweight** — Stores intrinsic (shared) state and exposes operations that accept extrinsic state as parameters.
- **FlyweightFactory** — Creates and caches flyweights, returning a shared instance for any given intrinsic state.
- **Context** — Holds extrinsic state and a reference to a flyweight; combines the two to perform work.
- **Client** — Obtains flyweights through the factory and maintains the extrinsic state.

## Conceptual example — Shared flyweights from a caching factory
The factory returns the same flyweight for a repeated intrinsic key; extrinsic state is passed to the operation.
```swift
final class Flyweight {
    let intrinsic: String   // shared, immutable

    init(intrinsic: String) {
        self.intrinsic = intrinsic
    }

    func operation(extrinsic: Int) -> String {
        "shared=" + intrinsic + " unique=" + String(extrinsic)
    }
}

final class FlyweightFactory {
    private var pool: [String: Flyweight] = [:]

    func flyweight(for key: String) -> Flyweight {
        if let existing = pool[key] { return existing }
        let created = Flyweight(intrinsic: key)
        pool[key] = created
        return created
    }

    var count: Int { pool.count }
}

let factory = FlyweightFactory()
let a = factory.flyweight(for: "red")
let b = factory.flyweight(for: "red")   // same shared instance
let c = factory.flyweight(for: "blue")

print(a === b)                          // true
print(a.operation(extrinsic: 1))        // shared=red unique=1
print(c.operation(extrinsic: 2))        // shared=blue unique=2
print("Flyweights created:", factory.count)   // Flyweights created: 2
```

## Real-world example — Reusing tree assets in a forest of thousands
Every tree of the same species shares one heavy asset (mesh and texture name). Only position and scale are stored per tree, so a huge forest holds just a handful of flyweights.
```swift
import Foundation

// Intrinsic, shared state: the expensive-to-duplicate asset.
final class TreeType {
    let species: String
    let mesh: String       // pretend this is a large mesh blob
    let texture: String    // and a large texture blob

    init(species: String, mesh: String, texture: String) {
        self.species = species
        self.mesh = mesh
        self.texture = texture
    }
}

// Factory caches one TreeType per species.
final class TreeTypeFactory {
    private var cache: [String: TreeType] = [:]

    func type(species: String) -> TreeType {
        if let hit = cache[species] { return hit }
        let created = TreeType(species: species,
                               mesh: species + "-mesh",
                               texture: species + "-bark")
        cache[species] = created
        return created
    }

    var distinctTypes: Int { cache.count }
}

// Context: extrinsic per-tree state plus a pointer to the shared type.
struct Tree {
    let x: Double
    let y: Double
    let scale: Double
    let type: TreeType

    func describe() -> String {
        "\(type.species) at (\(x), \(y)) scale \(scale)"
    }
}

final class Forest {
    private let factory = TreeTypeFactory()
    private(set) var trees: [Tree] = []

    func plant(species: String, x: Double, y: Double, scale: Double) {
        let type = factory.type(species: species)
        trees.append(Tree(x: x, y: y, scale: scale, type: type))
    }

    var distinctAssets: Int { factory.distinctTypes }
}

let forest = Forest()
for i in 0..<5_000 {
    let species = (i % 2 == 0) ? "Oak" : "Pine"
    forest.plant(species: species, x: Double(i), y: Double(i % 100), scale: 1.0)
}

print("Trees planted:", forest.trees.count)        // Trees planted: 5000
print("Distinct assets in memory:", forest.distinctAssets)   // Distinct assets in memory: 2
```

**Pros**
- Drastically cuts memory use when many objects share identical state.
- Centralizes shared state in one place, reducing duplication.
- Fewer allocations can improve performance in object-heavy systems.

**Cons**
- Trades memory for CPU: extrinsic state must be computed or passed on every call.
- Splitting intrinsic from extrinsic state complicates the code and the API.
- Shared flyweights must be immutable or the sharing causes subtle bugs.

**Related patterns:** composite, singleton, factory-method, state, proxy
