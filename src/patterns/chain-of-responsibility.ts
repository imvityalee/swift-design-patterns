import type { Pattern } from "../types.js";

export const chainOfResponsibility: Pattern = {
  id: "chain-of-responsibility",
  name: "Chain of Responsibility",
  category: "Behavioral",
  alsoKnownAs: ["Chain of Command"],
  intent:
    "Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle it. Chain the receivers and pass the request along the chain until one of them handles it.",
  problem:
    "A request may be handled by one of several objects, but the sender should not have to know which one. Encoding the selection as a growing conditional ties the sender to every possible handler, and adding, reordering, or removing handlers means editing that central decision point.",
  solution:
    "Define a handler abstraction with a reference to the next handler. Each concrete handler decides whether it can process the request; if not, it forwards the request to its successor. The sender only knows the head of the chain, so handlers can be added, removed, or reordered without touching the caller.",
  applicability: [
    "More than one object may handle a request, and the handler is not known a priori.",
    "You want to issue a request to one of several objects without specifying the receiver explicitly.",
    "The set of handlers that can process a request should be configured dynamically.",
    "You want to decouple request senders from the concrete objects that ultimately handle the work.",
  ],
  participants: [
    {
      name: "Handler",
      role: "Declares the interface for handling requests and (optionally) holds a reference to the next handler.",
    },
    {
      name: "ConcreteHandler",
      role: "Handles requests it is responsible for; otherwise forwards them to its successor.",
    },
    {
      name: "Client",
      role: "Builds the chain and submits a request to the first handler.",
    },
  ],
  conceptual: {
    title: "Forwarding a request down a chain",
    summary:
      "Each handler either processes the request or passes it to the next link. The client only talks to the head of the chain.",
    code: `protocol Handler: AnyObject {
    var next: Handler? { get set }
    func handle(_ request: Int) -> String?
}

extension Handler {
    func passOn(_ request: Int) -> String? {
        next?.handle(request)
    }
}

final class SmallHandler: Handler {
    var next: Handler?
    func handle(_ request: Int) -> String? {
        request < 10 ? "Small handled \\(request)" : passOn(request)
    }
}

final class MediumHandler: Handler {
    var next: Handler?
    func handle(_ request: Int) -> String? {
        request < 100 ? "Medium handled \\(request)" : passOn(request)
    }
}

final class LargeHandler: Handler {
    var next: Handler?
    func handle(_ request: Int) -> String? {
        "Large handled \\(request)"
    }
}

// Client wires the chain: small -> medium -> large
let small = SmallHandler()
let medium = MediumHandler()
let large = LargeHandler()
small.next = medium
medium.next = large

print(small.handle(5) ?? "unhandled")     // Small handled 5
print(small.handle(50) ?? "unhandled")    // Medium handled 50
print(small.handle(500) ?? "unhandled")   // Large handled 500`,
  },
  realWorld: {
    title: "Layered request middleware for a network client",
    summary:
      "Each middleware inspects an outgoing request, optionally short-circuits it, and otherwise forwards it down the chain — the same shape used by logging, auth, and caching layers.",
    code: `import Foundation

struct Request {
    var path: String
    var headers: [String: String] = [:]
    var token: String?
}

enum Outcome {
    case sent(Request)
    case rejected(reason: String)
    case servedFromCache(String)
}

protocol Middleware: AnyObject {
    var next: Middleware? { get set }
    func process(_ request: Request) -> Outcome
}

extension Middleware {
    func forward(_ request: Request) -> Outcome {
        next?.process(request) ?? .sent(request)
    }
}

final class AuthMiddleware: Middleware {
    var next: Middleware?
    func process(_ request: Request) -> Outcome {
        guard let token = request.token, !token.isEmpty else {
            return .rejected(reason: "missing auth token")
        }
        var authed = request
        authed.headers["Authorization"] = "Bearer " + token
        return forward(authed)
    }
}

final class CacheMiddleware: Middleware {
    var next: Middleware?
    private let store: [String: String]
    init(store: [String: String]) { self.store = store }
    func process(_ request: Request) -> Outcome {
        if let hit = store[request.path] {
            return .servedFromCache(hit)
        }
        return forward(request)
    }
}

final class LoggingMiddleware: Middleware {
    var next: Middleware?
    func process(_ request: Request) -> Outcome {
        print("LOG: dispatching", request.path)
        return forward(request)
    }
}

// Build chain: logging -> auth -> cache -> (network)
let logging = LoggingMiddleware()
let auth = AuthMiddleware()
let cache = CacheMiddleware(store: ["/profile": "cached-profile"])
logging.next = auth
auth.next = cache

let result = logging.process(Request(path: "/profile", token: "abc123"))
switch result {
case .servedFromCache(let body): print("Cache:", body)
case .sent(let req): print("Sent:", req.path)
case .rejected(let reason): print("Rejected:", reason)
}
// LOG: dispatching /profile
// Cache: cached-profile

let denied = logging.process(Request(path: "/orders", token: nil))
if case .rejected(let reason) = denied { print("Rejected:", reason) }
// LOG: dispatching /orders
// Rejected: missing auth token`,
  },
  pros: [
    "Decouples the sender of a request from its concrete receivers.",
    "Lets you add, remove, or reorder handlers without changing the client.",
    "Each handler has a single, focused responsibility and is independently testable.",
    "Supports the open/closed principle for the set of processing steps.",
  ],
  cons: [
    "A request can fall off the end of the chain unhandled if no link claims it.",
    "Harder to observe and debug because handling is distributed across the chain.",
    "Long chains can add latency and obscure where a request was actually serviced.",
  ],
  relatedPatterns: ["command", "composite", "decorator", "mediator"],
  whenToReachFor: [
    "pass a request through a series of handlers",
    "request pipeline or middleware",
    "decouple sender from receiver",
    "let one of several objects handle a request",
    "configurable processing steps",
    "fall through until something handles it",
    "event or responder chain",
  ],
};
