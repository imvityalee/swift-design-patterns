import type { Pattern } from "../types.js";

export const observer: Pattern = {
  id: "observer",
  name: "Observer",
  category: "Behavioral",
  alsoKnownAs: ["Publish-Subscribe", "Dependents"],
  intent:
    "Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
  problem:
    "Several parts of a system need to react when some object's state changes — a label, a cache, a logger. If the source object calls each interested party directly, it becomes coupled to all of them and must be edited whenever a new listener appears. Polling for changes instead wastes work and reacts late.",
  solution:
    "Give the source object (the Subject) a list of observers and methods to attach and detach them. When its state changes, the subject iterates the list and notifies each observer through a common interface. The subject knows only that its observers conform to that interface, not their concrete types, so listeners can come and go without the subject changing.",
  applicability: [
    "A change to one object requires changing others, and you do not know how many objects need to change.",
    "An object should notify other objects without making assumptions about who they are.",
    "An abstraction has two aspects, one dependent on the other, and you want to vary and reuse them independently.",
    "You want push-based updates instead of clients polling for state changes.",
  ],
  participants: [
    {
      name: "Subject",
      role: "Knows its observers and provides an interface to attach and detach them.",
    },
    {
      name: "Observer",
      role: "Defines the updating interface that objects implement to be notified of changes.",
    },
    {
      name: "ConcreteSubject",
      role: "Stores state of interest and notifies its observers when that state changes.",
    },
    {
      name: "ConcreteObserver",
      role: "Reacts to notifications, typically by reading new state from the subject.",
    },
  ],
  conceptual: {
    title: "A subject broadcasting to attached observers",
    summary:
      "The subject keeps a list of observers and notifies each one when its value changes; observers attach and detach without the subject knowing their types.",
    code: `protocol Observer: AnyObject {
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
// B saw value: 7`,
  },
  realWorld: {
    title: "A weather station pushing readings to displays",
    summary:
      "A weather station is the subject; displays subscribe to it. New readings are pushed to every display through a weak-referenced subscription that can be cancelled, avoiding retain cycles.",
    code: `import Foundation

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
// StatusBar: cool`,
  },
  pros: [
    "Subject and observers are loosely coupled; the subject knows only the observer interface.",
    "You can add or remove observers at runtime without modifying the subject.",
    "Supports broadcast communication: one change notifies an open-ended set of listeners.",
    "Pushes updates as they happen instead of forcing clients to poll.",
  ],
  cons: [
    "Observers are notified in an unspecified order and should not depend on it.",
    "Without care, observers and subjects can form retain cycles or leak; use weak references.",
    "Cascading notifications can be hard to debug and may trigger unexpected updates.",
  ],
  relatedPatterns: ["mediator", "singleton", "command", "memento"],
  whenToReachFor: [
    "notify many objects when state changes",
    "publish subscribe events",
    "broadcast updates to multiple listeners",
    "decouple a data source from its views",
    "react to changes without polling",
    "one to many dependency between objects",
  ],
};
