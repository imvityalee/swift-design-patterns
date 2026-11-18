# Pattern catalog index

All 23 GoF patterns. Each entry links to its full reference (intent, problem,
solution, participants, conceptual + real-world Swift examples, pros/cons).
Use the **Reach for it when** cues to recommend patterns for a described problem.

## Creational

### [Abstract Factory](patterns/abstract-factory.md) _(aka Kit)_

- **Id:** `abstract-factory`
- **Intent:** Provide an interface for creating families of related objects without specifying their concrete types, so a whole family can be swapped together.
- **Reach for it when:** create families of related objects together; swap an entire product family at once; enforce that components match a theme or platform; hide concrete types behind creation protocols; configure a system with one of several variants; avoid mixing incompatible objects
- **Related:** factory-method, builder, prototype, singleton, bridge

### [Builder](patterns/builder.md)

- **Id:** `builder`
- **Intent:** Separate the construction of a complex object from its representation so the same step-by-step process can produce different results.
- **Reach for it when:** object with many optional configuration fields; avoid telescoping or huge initializers; fluent chained configuration api; step by step construction with validation; build different representations from the same steps; assemble a complex object in one place
- **Related:** abstract-factory, factory-method, prototype, composite, singleton

### [Factory Method](patterns/factory-method.md) _(aka Virtual Constructor)_

- **Id:** `factory-method`
- **Intent:** Define an interface for creating an object but let subtypes decide which concrete type to instantiate, deferring instantiation to them.
- **Reach for it when:** decide which concrete type to create at runtime; let subtypes choose the product; centralize object creation logic; decouple client from concrete classes; map an enum or config to a concrete implementation; add new types without editing call sites
- **Related:** abstract-factory, template-method, prototype, builder, singleton

### [Prototype](patterns/prototype.md) _(aka Clone)_

- **Id:** `prototype`
- **Intent:** Create new objects by copying an existing instance — the prototype — instead of constructing them from scratch, so the concrete type and its configured state are reproduced without coupling to the class.
- **Reach for it when:** copy or clone an existing configured object; avoid expensive re-initialization; create instances without naming the concrete class; deep copy nested reference types; registry of reusable templates; duplicate then tweak a baseline; snapshot current configuration as a new object
- **Related:** abstract-factory, factory-method, composite, decorator, memento

### [Singleton](patterns/singleton.md)

- **Id:** `singleton`
- **Intent:** Ensure a class has exactly one instance and provide a single, global point of access to it.
- **Reach for it when:** exactly one shared instance; global access point; shared configuration or cache; thread-safe lazy initialization; single connection or resource manager; static shared accessor; app-wide service object
- **Related:** abstract-factory, facade, prototype, mediator, flyweight

## Structural

### [Adapter](patterns/adapter.md) _(aka Wrapper)_

- **Id:** `adapter`
- **Intent:** Convert the interface of an existing type into another interface that clients expect, letting types that could not otherwise cooperate work together.
- **Reach for it when:** make an incompatible interface fit; wrap a third-party or legacy sdk; convert one interface into another; unify multiple providers behind one protocol; integrate code you cannot modify; isolate an external dependency; bridge mismatched method signatures
- **Related:** bridge, decorator, facade, proxy, composite

### [Bridge](patterns/bridge.md) _(aka Handle/Body)_

- **Id:** `bridge`
- **Intent:** Decouple an abstraction from its implementation so the two can vary independently, replacing a combinatorial class hierarchy with two cooperating hierarchies linked by composition.
- **Reach for it when:** two independent dimensions of variation; avoid class explosion from subclassing combinations; decouple abstraction from implementation; swap backend or platform implementation at runtime; pluggable rendering or transport layer; extend interface and implementation separately
- **Related:** abstract-factory, adapter, strategy, state

### [Composite](patterns/composite.md) _(aka Object Tree)_

- **Id:** `composite`
- **Intent:** Compose objects into tree structures to represent part-whole hierarchies, and let clients treat individual objects and compositions of objects uniformly through a single interface.
- **Reach for it when:** part-whole hierarchy or tree structure; treat single object and group the same way; recursive nested containers; aggregate an operation over a whole subtree; files and folders or nested ui views; avoid leaf vs container type checks
- **Related:** decorator, iterator, visitor, chain-of-responsibility, flyweight

### [Decorator](patterns/decorator.md) _(aka Wrapper)_

- **Id:** `decorator`
- **Intent:** Attach additional responsibilities to an object dynamically by wrapping it in another object that shares its interface, providing a flexible alternative to subclassing for extending behavior.
- **Reach for it when:** add behavior to an object at runtime; wrap an object to extend it without subclassing; stack or combine optional features; logging caching compression encryption layers; avoid subclass explosion for feature combinations; transparent wrapper sharing the same interface
- **Related:** composite, adapter, proxy, strategy, chain-of-responsibility

### [Facade](patterns/facade.md)

- **Id:** `facade`
- **Intent:** Provide a single, simplified interface to a complex subsystem of many cooperating types, so clients can perform common tasks without wiring the parts together themselves.
- **Reach for it when:** simplify a complex subsystem; single entry point for many objects; hide third-party api behind a clean interface; reduce coupling between client and implementation; orchestrate a multi-step workflow; layer boundary between modules
- **Related:** adapter, mediator, abstract-factory, singleton, proxy

### [Flyweight](patterns/flyweight.md) _(aka Cache)_

- **Id:** `flyweight`
- **Intent:** Share fine-grained objects to support large numbers of them efficiently, by separating the state that can be shared (intrinsic) from the state that varies per use (extrinsic).
- **Reach for it when:** too many similar objects using lots of memory; share immutable data across instances; object pool or cache of reusable instances; intrinsic versus extrinsic state; thousands of particles tiles or glyphs; deduplicate heavy shared assets
- **Related:** composite, singleton, factory-method, state, proxy

### [Proxy](patterns/proxy.md) _(aka Surrogate)_

- **Id:** `proxy`
- **Intent:** Provide a stand-in for another object that controls access to it, letting you insert behavior — lazy creation, access checks, caching, logging — between the client and the real object.
- **Reach for it when:** control access to an expensive or sensitive object; lazy load or defer creation until needed; cache results in front of a real service; add access checks or permission gating; local stand-in for a remote object; wrap an object with logging or rate limiting
- **Related:** decorator, adapter, facade, flyweight, singleton

## Behavioral

### [Chain of Responsibility](patterns/chain-of-responsibility.md) _(aka Chain of Command)_

- **Id:** `chain-of-responsibility`
- **Intent:** Avoid coupling the sender of a request to its receiver by giving more than one object a chance to handle it. Chain the receivers and pass the request along the chain until one of them handles it.
- **Reach for it when:** pass a request through a series of handlers; request pipeline or middleware; decouple sender from receiver; let one of several objects handle a request; configurable processing steps; fall through until something handles it; event or responder chain
- **Related:** command, composite, decorator, mediator

### [Command](patterns/command.md) _(aka Action, Transaction)_

- **Id:** `command`
- **Intent:** Encapsulate a request as an object, letting you parameterize clients with different requests, queue or log requests, and support undoable operations.
- **Reach for it when:** undo and redo support; encapsulate a request as an object; queue or schedule operations; log and replay actions; decouple invoker from receiver; macro or transactional commands; parameterize a button or menu with an action
- **Related:** memento, composite, chain-of-responsibility, strategy, prototype

### [Interpreter](patterns/interpreter.md)

- **Id:** `interpreter`
- **Intent:** Given a language, define a representation for its grammar along with an interpreter that uses the representation to evaluate sentences in the language.
- **Reach for it when:** evaluate a small domain-specific language; parse and interpret expressions; rule engine or filter grammar; abstract syntax tree evaluation; formula or calculator evaluator; represent grammar rules as objects
- **Related:** composite, visitor, iterator, flyweight

### [Iterator](patterns/iterator.md) _(aka Cursor)_

- **Id:** `iterator`
- **Intent:** Provide a way to access the elements of an aggregate object sequentially without exposing its underlying representation.
- **Reach for it when:** traverse a collection without exposing its internals; conform to Sequence or IteratorProtocol; lazy or on-demand sequence; custom for-in iteration; multiple simultaneous traversals; uniform iteration over different structures; paginate or stream items one at a time
- **Related:** composite, factory-method, visitor, memento

### [Mediator](patterns/mediator.md) _(aka Intermediary, Controller)_

- **Id:** `mediator`
- **Intent:** Define an object that encapsulates how a set of objects interact. Mediator promotes loose coupling by keeping objects from referring to each other explicitly, and lets you vary their interaction independently.
- **Reach for it when:** objects reference each other in a tangled web; decouple components that talk directly; centralize coordination logic; ui controls that enable/disable each other; reduce many-to-many dependencies; chat room or hub routing messages between peers
- **Related:** observer, facade, command

### [Memento](patterns/memento.md) _(aka Token, Snapshot)_

- **Id:** `memento`
- **Intent:** Without violating encapsulation, capture and externalize an object's internal state so that the object can be restored to this state later.
- **Reach for it when:** implement undo and redo; snapshot and restore object state; rollback to a previous checkpoint; save state without breaking encapsulation; transactional state with revert on failure; history stack of past states
- **Related:** command, iterator, prototype, state

### [Observer](patterns/observer.md) _(aka Publish-Subscribe, Dependents)_

- **Id:** `observer`
- **Intent:** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.
- **Reach for it when:** notify many objects when state changes; publish subscribe events; broadcast updates to multiple listeners; decouple a data source from its views; react to changes without polling; one to many dependency between objects
- **Related:** mediator, singleton, command, memento

### [State](patterns/state.md) _(aka Objects for States)_

- **Id:** `state`
- **Intent:** Allow an object to alter its behavior when its internal state changes; the object appears to change its class.
- **Reach for it when:** behavior depends on internal mode; finite state machine; replace switch on a status enum; explicit legal state transitions; object changes behavior at runtime; playback or connection lifecycle states
- **Related:** strategy, singleton, flyweight, memento

### [Strategy](patterns/strategy.md) _(aka Policy)_

- **Id:** `strategy`
- **Intent:** Define a family of interchangeable algorithms, encapsulate each one behind a common abstraction, and let the algorithm vary independently of the clients that use it.
- **Reach for it when:** multiple interchangeable algorithms; switch behavior at runtime; replace a big if/else or switch selecting between behaviors; pluggable policy; different calculation/sorting/pricing variants; inject behavior via protocol or closure; open closed principle for algorithm families
- **Related:** state, template-method, command, bridge, decorator

### [Template Method](patterns/template-method.md)

- **Id:** `template-method`
- **Intent:** Define the skeleton of an algorithm in an operation, deferring some steps to subclasses; let subclasses redefine certain steps without changing the algorithm's structure.
- **Reach for it when:** fixed algorithm skeleton with variable steps; remove duplication across similar workflows; override only certain steps via subclass; import or processing pipeline variants; hook methods with default behavior; invariant sequence shared by subclasses
- **Related:** strategy, factory-method, builder

### [Visitor](patterns/visitor.md)

- **Id:** `visitor`
- **Intent:** Represent an operation to be performed on the elements of an object structure; let you define a new operation without changing the classes of the elements on which it operates.
- **Reach for it when:** add operations without changing element classes; stable element types growing set of operations; double dispatch by concrete type; traverse a tree or ast applying an operation; separate algorithms from the object structure; export validate or evaluate over a hierarchy
- **Related:** composite, iterator, interpreter
