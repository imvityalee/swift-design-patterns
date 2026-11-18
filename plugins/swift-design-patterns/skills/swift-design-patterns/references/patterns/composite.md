# Composite  _(Structural)_
**Also known as:** Object Tree

**Intent.** Compose objects into tree structures to represent part-whole hierarchies, and let clients treat individual objects and compositions of objects uniformly through a single interface.

**Problem.** You have a structure that is naturally recursive — files and folders, UI views nesting other views, an order made of line items and sub-bundles. Client code that wants to total a size, render, or aggregate must constantly ask 'is this a leaf or a container?' and branch accordingly. That type-checking spreads everywhere and breaks whenever the tree shape changes.

**Solution.** Define one Component protocol shared by both leaves and containers. A Leaf implements the operation directly; a Composite holds a collection of child Components and implements the operation by delegating to its children and combining the results. Because both conform to the same protocol, a Composite's children may themselves be composites, and client code calls the same method regardless of depth — recursion lives inside the structure, not in the caller.

**When to use it**
- You want to represent part-whole hierarchies of objects (trees).
- Clients should ignore the difference between a single object and a composition of objects.
- The structure is recursive and arbitrarily deep.
- An operation should apply to a whole subtree by walking it transparently.

**Participants**
- **Component** — Common protocol for objects in the tree; declares the shared operation(s).
- **Leaf** — A node with no children; implements the operation for a single object.
- **Composite** — A node that stores child Components and implements the operation by aggregating its children.
- **Client** — Manipulates objects through the Component protocol, unaware of leaf-vs-composite.

## Conceptual example — Uniform operation over a tree
Leaf and Composite share one protocol. A Composite computes its result by combining the results of its children, which may themselves be composites.
```swift
protocol Component {
    func sum() -> Int
}

struct Leaf: Component {
    let value: Int
    func sum() -> Int { value }
}

final class Composite: Component {
    private var children: [Component] = []

    func add(_ child: Component) {
        children.append(child)
    }

    func sum() -> Int {
        children.reduce(0) { $0 + $1.sum() }
    }
}

// Build a tree: root -> [Leaf(1), branch -> [Leaf(2), Leaf(3)]]
let branch = Composite()
branch.add(Leaf(value: 2))
branch.add(Leaf(value: 3))

let root = Composite()
root.add(Leaf(value: 1))
root.add(branch)

print(root.sum())   // 6
```

## Real-world example — File-system size of files and folders
A FileSystemNode protocol unifies files and directories. Computing the total size of a directory recurses through its contents transparently, whether each entry is a file or a nested directory.
```swift
import Foundation

protocol FileSystemNode {
    var name: String { get }
    func size() -> Int                 // bytes
    func describe(indent: String)
}

struct File: FileSystemNode {
    let name: String
    let bytes: Int

    func size() -> Int { bytes }

    func describe(indent: String) {
        print(indent + name, "(" + String(bytes) + " bytes)")
    }
}

final class Directory: FileSystemNode {
    let name: String
    private var contents: [FileSystemNode] = []

    init(name: String) {
        self.name = name
    }

    func add(_ node: FileSystemNode) {
        contents.append(node)
    }

    func size() -> Int {
        contents.reduce(0) { $0 + $1.size() }
    }

    func describe(indent: String) {
        print(indent + name + "/", "(" + String(size()) + " bytes total)")
        for node in contents {
            node.describe(indent: indent + "  ")
        }
    }
}

let images = Directory(name: "images")
images.add(File(name: "logo.png", bytes: 2048))
images.add(File(name: "banner.jpg", bytes: 8192))

let project = Directory(name: "project")
project.add(File(name: "README.md", bytes: 512))
project.add(images)

// Client treats files and directories the same way.
print("Total:", project.size(), "bytes")   // Total: 10752 bytes
project.describe(indent: "")
// project/ (10752 bytes total)
//   README.md (512 bytes)
//   images/ (10240 bytes total)
//     logo.png (2048 bytes)
//     banner.jpg (8192 bytes)
```

**Pros**
- Clients treat leaves and composites uniformly, eliminating type checks.
- Makes deep, recursive tree structures easy to build and traverse.
- Open/closed: new component kinds plug in without changing client code.
- Recursive aggregation logic lives in the structure, not scattered in callers.

**Cons**
- A single shared protocol can become overly general, with operations that don't fit every node.
- It can be hard to restrict what types a particular composite may contain (type safety vs. uniformity).
- Very deep trees risk stack overflow with naive recursion and can be hard to debug.

**Related patterns:** decorator, iterator, visitor, chain-of-responsibility, flyweight
