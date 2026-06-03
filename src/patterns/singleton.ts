import type { Pattern } from "../types.js";

export const singleton: Pattern = {
  id: "singleton",
  name: "Singleton",
  category: "Creational",
  intent:
    "Ensure a class has exactly one instance and provide a single, global point of access to it.",
  problem:
    "Some resources are inherently unique — a shared configuration store, a connection pool, a logging sink. Allowing several instances leads to conflicting state, duplicated work, or contention over the underlying resource, yet passing one instance through every layer of the code is awkward. You need a guaranteed single instance that any caller can reach.",
  solution:
    "Make the type responsible for its own single instance: hide the initializer so no one else can construct it, and expose one static, lazily created shared value. Every caller goes through that accessor and gets the same object. In Swift a static let on a type is initialized lazily and is thread-safe by construction, which makes the canonical implementation a one-liner.",
  applicability: [
    "There must be exactly one instance of a type and it needs a well-known access point.",
    "The single instance models a genuinely shared resource (cache, configuration, hardware handle).",
    "You want lazy, thread-safe initialization without writing locking code yourself.",
    "Global access is acceptable and the alternative — threading one instance through every call — adds no value.",
  ],
  participants: [
    {
      name: "Singleton",
      role: "Declares the static shared accessor and hides its initializer so external code cannot create instances.",
    },
    {
      name: "Client",
      role: "Reaches the single instance through the static accessor instead of constructing its own.",
    },
  ],
  conceptual: {
    title: "The canonical static-let singleton",
    summary:
      "A private initializer prevents outside construction; a static let exposes the one lazily created, thread-safe instance.",
    code: `final class Singleton {
    static let shared = Singleton()

    private(set) var value = 0

    // Private init blocks external instantiation.
    private init() {}

    func increment() {
        value += 1
    }
}

// All callers see the same instance.
Singleton.shared.increment()
Singleton.shared.increment()
print(Singleton.shared.value)   // 2

// let other = Singleton()  // compile error: 'init' is inaccessible`,
  },
  realWorld: {
    title: "A thread-safe app-wide settings store",
    summary:
      "A settings manager backed by UserDefaults is exposed as one shared instance, with an internal serial queue guarding mutable cached state so concurrent readers and writers stay consistent.",
    code: `import Foundation

final class SettingsManager {
    static let shared = SettingsManager()

    private let defaults = UserDefaults.standard
    // Serial queue serializes access to the in-memory cache.
    private let queue = DispatchQueue(label: "settings.manager")
    private var cache: [String: String] = [:]

    private init() {}

    func value(forKey key: String) -> String? {
        queue.sync {
            if let cached = cache[key] {
                return cached
            }
            let stored = defaults.string(forKey: key)
            if let stored {
                cache[key] = stored
            }
            return stored
        }
    }

    func set(_ value: String, forKey key: String) {
        // Barrier-free serial write keeps cache and defaults in sync.
        queue.sync {
            cache[key] = value
            defaults.set(value, forKey: key)
        }
    }
}

// Anywhere in the app, the same instance is used.
SettingsManager.shared.set("dark", forKey: "theme")
SettingsManager.shared.set("en", forKey: "locale")

print(SettingsManager.shared.value(forKey: "theme") ?? "none")    // dark
print(SettingsManager.shared.value(forKey: "locale") ?? "none")   // en

// A second reference resolves to the very same object.
let again = SettingsManager.shared
print(again.value(forKey: "theme") ?? "none")                     // dark`,
  },
  pros: [
    "Guarantees a single instance and one obvious access point.",
    "Initialization is lazy: the instance is created only on first use.",
    "Swift's static let gives thread-safe initialization for free.",
    "Avoids threading the same object through every layer of the API.",
  ],
  cons: [
    "Acts as global mutable state, which hides dependencies and complicates reasoning.",
    "Hard to substitute in tests; injecting a protocol-typed dependency is usually more testable.",
    "Mutable internal state still needs its own synchronization for concurrent access.",
    "Tempts unrelated responsibilities to accumulate on one ever-present object.",
  ],
  relatedPatterns: ["abstract-factory", "facade", "prototype", "mediator", "flyweight"],
  whenToReachFor: [
    "exactly one shared instance",
    "global access point",
    "shared configuration or cache",
    "thread-safe lazy initialization",
    "single connection or resource manager",
    "static shared accessor",
    "app-wide service object",
  ],
};
