import type { Pattern } from "../types.js";

export const iterator: Pattern = {
  id: "iterator",
  name: "Iterator",
  category: "Behavioral",
  alsoKnownAs: ["Cursor"],
  intent:
    "Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.",
  problem:
    "A collection needs to be traversed, but exposing its internal storage forces clients to depend on that representation and clutters the collection with traversal bookkeeping. You may also want several independent traversals in progress at once, or different traversal orders over the same data.",
  solution:
    "Move the responsibility for traversal into a separate iterator object that tracks the current position and knows how to advance. The aggregate exposes a method to produce an iterator, so clients walk the elements through a uniform interface while the collection keeps its representation private. In Swift this is the IteratorProtocol/Sequence model that powers for-in.",
  applicability: [
    "You want to access a collection's contents without exposing its internal structure.",
    "You need to support multiple, simultaneous traversals of the same collection.",
    "You want a uniform interface for traversing different aggregate structures.",
    "You want to offer different traversal orders (forward, reverse, filtered) over one collection.",
  ],
  participants: [
    {
      name: "Iterator",
      role: "Defines the interface for accessing and advancing through elements (Swift's IteratorProtocol).",
    },
    {
      name: "ConcreteIterator",
      role: "Tracks the current position and produces the next element of a specific aggregate.",
    },
    {
      name: "Aggregate",
      role: "Defines the interface for creating an iterator (Swift's Sequence).",
    },
    {
      name: "ConcreteAggregate",
      role: "Implements iterator creation to return an iterator over its elements.",
    },
  ],
  conceptual: {
    title: "A custom Sequence over a ring buffer",
    summary:
      "The aggregate conforms to Sequence and vends an iterator that walks its private storage, so a plain for-in loop traverses it without seeing the internals.",
    code: `struct Countdown: Sequence {
    let start: Int

    func makeIterator() -> CountdownIterator {
        CountdownIterator(current: start)
    }
}

struct CountdownIterator: IteratorProtocol {
    var current: Int

    mutating func next() -> Int? {
        guard current > 0 else { return nil }
        defer { current -= 1 }
        return current
    }
}

// Client traverses without knowing the internals.
for n in Countdown(start: 3) {
    print(n)
}
// 3
// 2
// 1`,
  },
  realWorld: {
    title: "Paginated API results as a lazy sequence",
    summary:
      "A custom iterator fetches pages on demand and yields items one at a time, so callers consume a potentially large remote collection with ordinary for-in or sequence operators.",
    code: `import Foundation

struct Page {
    let items: [String]
    let nextPage: Int?
}

// Stands in for a synchronous data source (e.g. a cached store).
func fetchPage(_ index: Int) -> Page {
    switch index {
    case 0: return Page(items: ["a", "b"], nextPage: 1)
    case 1: return Page(items: ["c", "d"], nextPage: 2)
    default: return Page(items: ["e"], nextPage: nil)
    }
}

struct PagedItems: Sequence {
    func makeIterator() -> PagedIterator {
        PagedIterator()
    }
}

struct PagedIterator: IteratorProtocol {
    private var buffer: [String] = []
    private var nextPage: Int? = 0

    mutating func next() -> String? {
        while buffer.isEmpty {
            guard let page = nextPage else { return nil }
            let result = fetchPage(page)
            buffer = result.items
            nextPage = result.nextPage
        }
        return buffer.removeFirst()
    }
}

// Consume the whole collection without managing pagination by hand.
let all = Array(PagedItems())
print(all)                                  // ["a", "b", "c", "d", "e"]

let uppercased = PagedItems().map { $0.uppercased() }
print(uppercased)                           // ["A", "B", "C", "D", "E"]

// Independent traversals do not interfere with one another.
var first = PagedItems().makeIterator()
print(first.next() ?? "-")                  // a
print(first.next() ?? "-")                  // b`,
  },
  pros: [
    "Hides a collection's internal representation behind a uniform traversal interface.",
    "Supports multiple independent traversals of the same collection at once.",
    "Lets you offer alternative traversal orders without changing the collection.",
    "In Swift, conforming to Sequence unlocks for-in and the whole sequence algorithm library.",
  ],
  cons: [
    "Adds extra types when a simple indexed loop would do.",
    "An external iterator can become invalid if the collection mutates during traversal.",
    "Custom iterators can be slower than the collection's own optimized access.",
  ],
  relatedPatterns: ["composite", "factory-method", "visitor", "memento"],
  whenToReachFor: [
    "traverse a collection without exposing its internals",
    "conform to Sequence or IteratorProtocol",
    "lazy or on-demand sequence",
    "custom for-in iteration",
    "multiple simultaneous traversals",
    "uniform iteration over different structures",
    "paginate or stream items one at a time",
  ],
};
