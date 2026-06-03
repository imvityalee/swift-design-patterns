import type { Pattern } from "../types.js";

export const facade: Pattern = {
  id: "facade",
  name: "Facade",
  category: "Structural",
  intent:
    "Provide a single, simplified interface to a complex subsystem of many cooperating types, so clients can perform common tasks without wiring the parts together themselves.",
  problem:
    "Getting a piece of work done often means orchestrating several lower-level types in the right order, with the right configuration, while honoring dependencies between them. Spreading that orchestration across every call site couples clients to the subsystem's internals: each client must know which objects to create, how to connect them, and what sequence to call. The subsystem becomes hard to evolve because every refactor ripples out to all callers.",
  solution:
    "Introduce a Facade type that exposes a small number of high-level methods covering the common use cases. The facade owns the subsystem objects, knows the correct call sequence, and delegates to them. Clients talk only to the facade and stay decoupled from the moving parts. The subsystem remains fully usable directly for the rare advanced case — the facade is a convenience layer, not a wall.",
  applicability: [
    "You want a simple entry point into a complex subsystem that most clients use the same way.",
    "There is a lot of coupling between clients and the implementation classes of a subsystem.",
    "You want to layer your subsystems: facades become the documented boundary between layers.",
    "You want to wrap a poorly structured or third-party API behind a cleaner, task-oriented surface.",
  ],
  participants: [
    {
      name: "Facade",
      role: "Exposes high-level methods for common tasks and delegates them to the right subsystem objects in the right order.",
    },
    {
      name: "Subsystem classes",
      role: "Do the actual work. They know nothing about the facade and can still be used directly.",
    },
    {
      name: "Client",
      role: "Calls the facade instead of the subsystem classes, staying decoupled from their internals.",
    },
  ],
  conceptual: {
    title: "One call over three subsystem parts",
    summary:
      "The facade hides the construction and ordering of three independent subsystem types behind a single method.",
    code: `struct SubsystemA {
    func step() -> String { "A ready" }
}

struct SubsystemB {
    func step() -> String { "B ready" }
}

struct SubsystemC {
    func finish(_ inputs: [String]) -> String {
        "C done with " + inputs.joined(separator: ", ")
    }
}

final class Facade {
    private let a = SubsystemA()
    private let b = SubsystemB()
    private let c = SubsystemC()

    // One high-level operation that orchestrates the parts.
    func run() -> String {
        let results = [a.step(), b.step()]
        return c.finish(results)
    }
}

// Client only knows the facade.
let facade = Facade()
print(facade.run())   // C done with A ready, B ready`,
  },
  realWorld: {
    title: "A media-export facade over codec, watermark, and storage",
    summary:
      "Exporting a clip means transcoding, stamping a watermark, then writing to disk. The facade sequences three services so the view layer makes a single call.",
    code: `import Foundation

// --- Subsystem: each part is independent and unaware of the facade. ---

struct Transcoder {
    func transcode(_ source: String, to format: String) -> Data {
        let payload = source + ".as." + format
        return Data(payload.utf8)
    }
}

struct Watermarker {
    func stamp(_ data: Data, label: String) -> Data {
        var stamped = data
        stamped.append(Data(("|wm:" + label).utf8))
        return stamped
    }
}

struct FileStore {
    func write(_ data: Data, name: String) -> URL {
        let url = URL(fileURLWithPath: NSTemporaryDirectory())
            .appendingPathComponent(name)
        // In a real app: try data.write(to: url)
        return url
    }
}

// --- Facade: one task-oriented method over the whole pipeline. ---

final class MediaExportFacade {
    private let transcoder = Transcoder()
    private let watermarker = Watermarker()
    private let store = FileStore()

    func exportClip(named name: String,
                    source: String,
                    format: String,
                    watermark: String) -> URL {
        let encoded = transcoder.transcode(source, to: format)
        let stamped = watermarker.stamp(encoded, label: watermark)
        return store.write(stamped, name: name + "." + format)
    }
}

// Client: a view model that does not touch the subsystem types.
let exporter = MediaExportFacade()
let url = exporter.exportClip(named: "vacation",
                              source: "raw-frames",
                              format: "mp4",
                              watermark: "DevCats")
print("Saved file:", url.lastPathComponent)   // Saved file: vacation.mp4`,
  },
  pros: [
    "Shields clients from subsystem complexity and reduces coupling to its internals.",
    "Gives the subsystem a documented, task-oriented entry point.",
    "Lets you refactor or replace subsystem parts without breaking callers.",
    "Supports layered architectures by defining clean boundaries between layers.",
  ],
  cons: [
    "A facade can grow into a god object that knows about too much of the system.",
    "Adds an extra layer that may hide capabilities advanced clients need.",
    "If it leaks subsystem types in its signatures, it fails to actually decouple anything.",
  ],
  relatedPatterns: ["adapter", "mediator", "abstract-factory", "singleton", "proxy"],
  whenToReachFor: [
    "simplify a complex subsystem",
    "single entry point for many objects",
    "hide third-party api behind a clean interface",
    "reduce coupling between client and implementation",
    "orchestrate a multi-step workflow",
    "layer boundary between modules",
  ],
};
