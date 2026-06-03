import type { Pattern } from "../types.js";

export const state: Pattern = {
  id: "state",
  name: "State",
  category: "Behavioral",
  alsoKnownAs: ["Objects for States"],
  intent:
    "Allow an object to alter its behavior when its internal state changes; the object appears to change its class.",
  problem:
    "An object behaves differently depending on which mode it is in, and the rules for moving between modes are scattered across many methods as repeated conditionals. As the number of states grows, every method sprouts a switch on the current state, transitions become inconsistent, and a single illegal transition is hard to prevent.",
  solution:
    "Represent each state as its own type conforming to a common protocol that declares the state-dependent operations. The context holds a reference to the current state object and forwards requests to it. Each concrete state implements the behavior for that mode and decides which state to transition to next, so adding a state means adding a type rather than editing every method.",
  applicability: [
    "An object's behavior depends on its state and it must change behavior at runtime as that state changes.",
    "Methods are dominated by large multipart conditionals that switch on the object's mode.",
    "Transitions between modes follow rules you want to make explicit and keep in one place.",
    "You want to add new states without rewriting the existing ones or the context.",
  ],
  participants: [
    {
      name: "Context",
      role: "Holds a reference to the current state and delegates state-specific work to it; exposes a way to switch the current state.",
    },
    {
      name: "State",
      role: "Protocol declaring the operations whose behavior varies with the context's state.",
    },
    {
      name: "ConcreteState",
      role: "Implements the behavior for one state and, where appropriate, triggers a transition to another state.",
    },
  ],
  conceptual: {
    title: "A context delegating to interchangeable state objects",
    summary:
      "The context forwards handle() to its current state; each state performs its behavior and hands the context the next state to adopt.",
    code: `protocol State: AnyObject {
    func handle(context: Context)
}

final class Context {
    private var state: State

    init(state: State) {
        self.state = state
    }

    func transition(to next: State) {
        state = next
    }

    func request() {
        state.handle(context: self)
    }
}

final class StateA: State {
    func handle(context: Context) {
        print("StateA handling; moving to B")
        context.transition(to: StateB())
    }
}

final class StateB: State {
    func handle(context: Context) {
        print("StateB handling; moving to A")
        context.transition(to: StateA())
    }
}

// Client
let context = Context(state: StateA())
context.request()   // StateA handling; moving to B
context.request()   // StateB handling; moving to A
context.request()   // StateA handling; moving to B`,
  },
  realWorld: {
    title: "A media player's playback state machine",
    summary:
      "Play, pause, and stop mean different things depending on whether the player is stopped, playing, or paused. Each state object encodes the legal transitions, so illegal ones simply do nothing.",
    code: `import Foundation

protocol PlaybackState: AnyObject {
    var name: String { get }
    func play(_ player: AudioPlayer)
    func pause(_ player: AudioPlayer)
    func stop(_ player: AudioPlayer)
}

final class AudioPlayer {
    private var state: PlaybackState

    init() {
        state = StoppedState()
    }

    func setState(_ next: PlaybackState) {
        print("Transition:", state.name, "->", next.name)
        state = next
    }

    func play() { state.play(self) }
    func pause() { state.pause(self) }
    func stop() { state.stop(self) }
}

final class StoppedState: PlaybackState {
    let name = "Stopped"
    func play(_ player: AudioPlayer) { player.setState(PlayingState()) }
    func pause(_ player: AudioPlayer) { print("Ignored: nothing is playing") }
    func stop(_ player: AudioPlayer) { print("Ignored: already stopped") }
}

final class PlayingState: PlaybackState {
    let name = "Playing"
    func play(_ player: AudioPlayer) { print("Ignored: already playing") }
    func pause(_ player: AudioPlayer) { player.setState(PausedState()) }
    func stop(_ player: AudioPlayer) { player.setState(StoppedState()) }
}

final class PausedState: PlaybackState {
    let name = "Paused"
    func play(_ player: AudioPlayer) { player.setState(PlayingState()) }
    func pause(_ player: AudioPlayer) { print("Ignored: already paused") }
    func stop(_ player: AudioPlayer) { player.setState(StoppedState()) }
}

let player = AudioPlayer()
player.play()    // Transition: Stopped -> Playing
player.pause()   // Transition: Playing -> Paused
player.pause()   // Ignored: already paused
player.play()    // Transition: Paused -> Playing
player.stop()    // Transition: Playing -> Stopped
player.pause()   // Ignored: nothing is playing`,
  },
  pros: [
    "Localizes the behavior for each state in its own type, eliminating sprawling conditionals.",
    "Makes transitions explicit and keeps illegal transitions easy to reject.",
    "Adding a new state is open/closed: write a new type instead of editing every method.",
    "State objects can be shared or recreated cheaply when they hold no instance data.",
  ],
  cons: [
    "Introduces a type per state, which is overkill for a machine with only two trivial modes.",
    "Transition logic spread across states can be hard to follow without an overview diagram.",
    "Deciding whether the context or the states own transitions requires care and consistency.",
  ],
  relatedPatterns: ["strategy", "singleton", "flyweight", "memento"],
  whenToReachFor: [
    "behavior depends on internal mode",
    "finite state machine",
    "replace switch on a status enum",
    "explicit legal state transitions",
    "object changes behavior at runtime",
    "playback or connection lifecycle states",
  ],
};
