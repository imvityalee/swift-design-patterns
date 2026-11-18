# Observer  _(Behavioral)_
**Also known as:** Publish-Subscribe, Dependents

**Intent.** Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.

**Problem.** Several parts of a system need to react when some object's state changes — a label, a cache, a logger. If the source object calls each interested party directly, it becomes coupled to all of them and must be edited whenever a new listener appears. Polling for changes instead wastes work and reacts late.

**Solution.** Give the source object (the Subject) a list of observers and methods to attach and detach them. When its state changes, the subject iterates the list and notifies each observer through a common interface. The subject knows only that its observers conform to that interface, not their concrete types, so listeners can come and go without the subject changing.

**When to use it**
- A change to one object requires changing others, and you do not know how many objects need to change.
- An object should notify other objects without making assumptions about who they are.
- An abstraction has two aspects, one dependent on the other, and you want to vary and reuse them independently.
- You want push-based updates instead of clients polling for state changes.

**Participants**
- **Subject** — Knows its observers and provides an interface to attach and detach them.
- **Observer** — Defines the updating interface that objects implement to be notified of changes.
- **ConcreteSubject** — Stores state of interest and notifies its observers when that state changes.
- **ConcreteObserver** — Reacts to notifications, typically by reading new state from the subject.

## Conceptual example — A subject broadcasting to attached observers
The subject keeps a list of observers and notifies each one when its value changes; observers attach and detach without the subject knowing their types.
```swift
protocol Observer: AnyObject {
    func update(value: Int)
}

final class Subject {
    private var observers: [Observer] = []
    var value: Int = 0 {
        didSet { notify() }
    }

    func attach(_ observer: Observer) {
        observers.append(observer)
    }

    func detach(_ observer: Observer) {
        observers.removeAll { $0 === observer }
    }

    private func notify() {
        observers.forEach { $0.update(value: value) }
    }
}

final class ConcreteObserver: Observer {
    let name: String

    init(name: String) {
        self.name = name
    }

    func update(value: Int) {
        print(name, "saw value:", value)
    }
}

// Client
let subject = Subject()
let a = ConcreteObserver(name: "A")
let b = ConcreteObserver(name: "B")

subject.attach(a)
subject.attach(b)
subject.value = 42
// A saw value: 42
// B saw value: 42

subject.detach(a)
subject.value = 7
// B saw value: 7
```

## Real-world example — A weather station pushing readings to displays
A weather station is the subject; displays subscribe to it. New readings are pushed to every display through a weak-referenced subscription that can be cancelled, avoiding retain cycles.
```swift
import Foundation

struct Reading {
    let temperature: Double
    let humidity: Double
}

protocol WeatherObserver: AnyObject {
    func didUpdate(reading: Reading)
}

final class WeatherStation {
    // weak references so displays are not kept alive by the station.
    private var observers: [WeakObserver] = []
    private(set) var latest = Reading(temperature: 0, humidity: 0)

    private struct WeakObserver {
        weak var value: WeatherObserver?
    }

    func subscribe(_ observer: WeatherObserver) {
        observers.append(WeakObserver(value: observer))
    }

    func publish(_ reading: Reading) {
        latest = reading
        observers.removeAll { $0.value == nil }   // prune deallocated
        observers.forEach { $0.value?.didUpdate(reading: reading) }
    }
}

final class PhoneDisplay: WeatherObserver {
    func didUpdate(reading: Reading) {
        print(String(format: "Phone: %.1f°C, %.0f%% humidity",
                      reading.temperature, reading.humidity))
    }
}

final class StatusBar: WeatherObserver {
    func didUpdate(reading: Reading) {
        let trend = reading.temperature > 20 ? "warm" : "cool"
        print("StatusBar:", trend)
    }
}

let station = WeatherStation()
let phone = PhoneDisplay()
let bar = StatusBar()

station.subscribe(phone)
station.subscribe(bar)

station.publish(Reading(temperature: 22.5, humidity: 60))
// Phone: 22.5°C, 60% humidity
// StatusBar: warm

station.publish(Reading(temperature: 18.0, humidity: 80))
// Phone: 18.0°C, 80% humidity
// StatusBar: cool
```

**Pros**
- Subject and observers are loosely coupled; the subject knows only the observer interface.
- You can add or remove observers at runtime without modifying the subject.
- Supports broadcast communication: one change notifies an open-ended set of listeners.
- Pushes updates as they happen instead of forcing clients to poll.

**Cons**
- Observers are notified in an unspecified order and should not depend on it.
- Without care, observers and subjects can form retain cycles or leak; use weak references.
- Cascading notifications can be hard to debug and may trigger unexpected updates.

**Related patterns:** mediator, singleton, command, memento
