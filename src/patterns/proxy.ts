import type { Pattern } from "../types.js";

export const proxy: Pattern = {
  id: "proxy",
  name: "Proxy",
  category: "Structural",
  alsoKnownAs: ["Surrogate"],
  intent:
    "Provide a stand-in for another object that controls access to it, letting you insert behavior — lazy creation, access checks, caching, logging — between the client and the real object.",
  problem:
    "Sometimes you cannot or should not let a client talk to an object directly. The real object may be expensive to create and rarely used, may live on a remote server, may require access control, or may benefit from caching repeated results. Baking all of that into the object itself bloats it and violates single responsibility; making every client handle it is repetitive and error-prone.",
  solution:
    "Create a proxy that implements the same interface as the real subject and holds a reference to it. Clients use the proxy as if it were the real object. The proxy decides when and how to forward calls to the subject — creating it on first use, checking permissions, returning a cached value, or recording the call — and then delegates. Because both share the interface, the proxy is transparent and substitutable.",
  applicability: [
    "Virtual proxy: defer the cost of creating a heavyweight object until it is actually needed.",
    "Protection proxy: control access to an object based on permissions or roles.",
    "Remote proxy: provide a local representative for an object in a different address space.",
    "Caching/smart proxy: store results, reference-count, lock, or log around access to the subject.",
  ],
  participants: [
    {
      name: "Subject",
      role: "Common interface for the real object and the proxy, so they are interchangeable to clients.",
    },
    {
      name: "RealSubject",
      role: "The actual object that does the work the proxy controls access to.",
    },
    {
      name: "Proxy",
      role: "Implements Subject, holds a reference to the RealSubject, and adds control logic before/after delegating.",
    },
    {
      name: "Client",
      role: "Works through the Subject interface and is unaware whether it holds the proxy or the real subject.",
    },
  ],
  conceptual: {
    title: "A virtual proxy that defers creation",
    summary:
      "The proxy and the real subject share a protocol; the proxy lazily builds the real subject on first request, then delegates.",
    code: `protocol Subject {
    func request() -> String
}

final class RealSubject: Subject {
    init() {
        print("RealSubject created (expensive)")
    }
    func request() -> String { "real result" }
}

final class VirtualProxy: Subject {
    private var real: RealSubject?

    func request() -> String {
        if real == nil {
            real = RealSubject()   // created only when first needed
        }
        return real!.request()
    }
}

let subject: Subject = VirtualProxy()
print("Proxy ready")             // Proxy ready (nothing expensive yet)
print(subject.request())         // RealSubject created (expensive) \\n real result
print(subject.request())         // real result (reused, no recreation)`,
  },
  realWorld: {
    title: "A caching proxy in front of an image downloader",
    summary:
      "Both the live downloader and the proxy conform to one protocol. The proxy serves cached images on repeat requests so the network is hit only once per URL.",
    code: `import Foundation

protocol ImageLoading {
    func image(for url: String) -> Data
}

// RealSubject: the costly network-backed loader.
final class RemoteImageLoader: ImageLoading {
    private(set) var requestCount = 0

    func image(for url: String) -> Data {
        requestCount += 1
        // Pretend this performs a network download.
        return Data(("bytes:" + url).utf8)
    }
}

// Proxy: same interface, adds an in-memory cache.
final class CachingImageLoader: ImageLoading {
    private let loader: RemoteImageLoader
    private var cache: [String: Data] = [:]

    init(loader: RemoteImageLoader) {
        self.loader = loader
    }

    func image(for url: String) -> Data {
        if let cached = cache[url] {
            return cached
        }
        let data = loader.image(for: url)
        cache[url] = data
        return data
    }
}

let real = RemoteImageLoader()
let loader: ImageLoading = CachingImageLoader(loader: real)

_ = loader.image(for: "avatar.png")
_ = loader.image(for: "avatar.png")   // served from cache
_ = loader.image(for: "banner.png")

print("Network requests made:", real.requestCount)   // Network requests made: 2`,
  },
  pros: [
    "Controls access to the real object transparently — clients code to one interface.",
    "Enables lazy initialization, caching, access control, and logging without changing the subject.",
    "Follows open/closed: new control behavior arrives as a new proxy.",
    "A remote proxy can hide the fact that an object lives elsewhere.",
  ],
  cons: [
    "Adds another layer of indirection and more types to maintain.",
    "May introduce latency or surprising timing (e.g., lazy creation on a hot path).",
    "Keeping the proxy and subject interfaces in sync is extra work as they evolve.",
  ],
  relatedPatterns: ["decorator", "adapter", "facade", "flyweight", "singleton"],
  whenToReachFor: [
    "control access to an expensive or sensitive object",
    "lazy load or defer creation until needed",
    "cache results in front of a real service",
    "add access checks or permission gating",
    "local stand-in for a remote object",
    "wrap an object with logging or rate limiting",
  ],
};
