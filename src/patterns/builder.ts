import type { Pattern } from "../types.js";

export const builder: Pattern = {
  id: "builder",
  name: "Builder",
  category: "Creational",
  intent:
    "Separate the construction of a complex object from its representation so the same step-by-step process can produce different results.",
  problem:
    "An object needs many configuration options, some optional and some interdependent. Stuffing them all into one initializer produces a long, error-prone parameter list (the telescoping-initializer problem), and you cannot validate or default the pieces without scattering logic across call sites. You also may want the construction process reused to build several representations.",
  solution:
    "Move construction into a separate builder that exposes one focused method per part. Calls accumulate state, often returning the builder so they can be chained, and a final build step assembles and validates the finished product. The director (optional) encapsulates a recipe of builder calls so a known configuration can be reused.",
  applicability: [
    "The construction algorithm should be independent of the parts that make up the object.",
    "An object has many optional fields or configuration that is awkward to pass through one initializer.",
    "Different representations of the constructed object are needed from the same building steps.",
    "Construction needs validation or computed defaults before the object is considered complete.",
  ],
  participants: [
    {
      name: "Builder",
      role: "Declares step methods for building parts of the product and a way to retrieve the result.",
    },
    {
      name: "ConcreteBuilder",
      role: "Implements the steps, tracks the work-in-progress state, and assembles the final product.",
    },
    {
      name: "Product",
      role: "The complex object being built.",
    },
    {
      name: "Director",
      role: "Optional. Encapsulates a fixed sequence of builder calls to produce a known configuration.",
    },
  ],
  conceptual: {
    title: "Chained builder assembling a product",
    summary:
      "Each step records one part and returns the builder, then build() validates and produces the immutable result.",
    code: `struct Product {
    let parts: [String]
}

final class ProductBuilder {
    private var parts: [String] = []

    @discardableResult
    func add(_ part: String) -> ProductBuilder {
        parts.append(part)
        return self
    }

    func build() -> Product {
        Product(parts: parts)
    }
}

// Director encapsulates a known recipe.
enum Director {
    static func standard(using builder: ProductBuilder) -> Product {
        builder.add("base").add("body").add("roof").build()
    }
}

// Fluent, ad-hoc construction.
let custom = ProductBuilder()
    .add("base")
    .add("turbo")
    .build()
print(custom.parts)   // ["base", "turbo"]

// Reusable recipe via the director.
let standard = Director.standard(using: ProductBuilder())
print(standard.parts) // ["base", "body", "roof"]`,
  },
  realWorld: {
    title: "Composing a URLRequest",
    summary:
      "A request builder accumulates path, query items, headers, and body through chained calls, then assembles a validated URLRequest in one place.",
    code: `import Foundation

final class RequestBuilder {
    private var path: String
    private var queryItems: [URLQueryItem] = []
    private var headers: [String: String] = [:]
    private var method = "GET"
    private var body: Data?

    init(path: String) {
        self.path = path
    }

    @discardableResult
    func query(_ name: String, _ value: String) -> RequestBuilder {
        queryItems.append(URLQueryItem(name: name, value: value))
        return self
    }

    @discardableResult
    func header(_ field: String, _ value: String) -> RequestBuilder {
        headers[field] = value
        return self
    }

    @discardableResult
    func post(json: [String: String]) -> RequestBuilder {
        method = "POST"
        body = try? JSONSerialization.data(withJSONObject: json)
        headers["Content-Type"] = "application/json"
        return self
    }

    func build() -> URLRequest? {
        var components = URLComponents(string: "https://api.example.com" + path)
        components?.queryItems = queryItems.isEmpty ? nil : queryItems
        guard let url = components?.url else { return nil }

        var request = URLRequest(url: url)
        request.httpMethod = method
        request.httpBody = body
        for (field, value) in headers {
            request.setValue(value, forHTTPHeaderField: field)
        }
        return request
    }
}

let search = RequestBuilder(path: "/v1/search")
    .query("q", "swift")
    .query("limit", "20")
    .header("Authorization", "Bearer token123")
    .build()

print(search?.url?.absoluteString ?? "invalid")
// https://api.example.com/v1/search?q=swift&limit=20

let create = RequestBuilder(path: "/v1/items")
    .post(json: ["name": "Widget"])
    .build()

print(create?.httpMethod ?? "?")   // POST`,
  },
  pros: [
    "Builds objects step by step and defers the final assembly and validation.",
    "Avoids telescoping initializers and long, positional parameter lists.",
    "The same construction code can produce different representations.",
    "Fluent chaining reads naturally and keeps configuration in one place.",
  ],
  cons: [
    "Requires a separate builder type, adding code for simple objects.",
    "For value types with optional fields, Swift's default and named parameters often suffice.",
    "A mutable builder must guard against producing an incomplete or invalid product.",
  ],
  relatedPatterns: ["abstract-factory", "factory-method", "prototype", "composite", "singleton"],
  whenToReachFor: [
    "object with many optional configuration fields",
    "avoid telescoping or huge initializers",
    "fluent chained configuration api",
    "step by step construction with validation",
    "build different representations from the same steps",
    "assemble a complex object in one place",
  ],
};
