// Core data model for the design-pattern catalog.
// All content is original; the GoF pattern set is general knowledge.

export type Category = "Creational" | "Structural" | "Behavioral";

/** A named role/participant in a pattern's structure. */
export interface Participant {
  /** Role name, e.g. "Context", "Strategy", "ConcreteStrategy". */
  name: string;
  /** What this role is responsible for. */
  role: string;
}

export interface CodeExample {
  /** Short title for the example. */
  title: string;
  /** What the example demonstrates. */
  summary: string;
  /** Self-contained, idiomatic Swift source. */
  code: string;
}

export interface Pattern {
  /** Stable kebab-case id, e.g. "strategy", "abstract-factory". */
  id: string;
  /** Display name, e.g. "Strategy". */
  name: string;
  category: Category;
  /** Other common names for the pattern. */
  alsoKnownAs?: string[];
  /** One- or two-sentence statement of what the pattern accomplishes. */
  intent: string;
  /** The recurring design problem the pattern addresses. */
  problem: string;
  /** How the pattern solves it, in prose. */
  solution: string;
  /** Bullet points: situations where this pattern is the right tool. */
  applicability: string[];
  /** The roles that make up the pattern's structure. */
  participants: Participant[];
  /** Minimal example showing the bare structure of the pattern. */
  conceptual: CodeExample;
  /** Practical iOS/Foundation-flavored example. */
  realWorld: CodeExample;
  pros: string[];
  cons: string[];
  /** ids of related patterns in this catalog. */
  relatedPatterns: string[];
  /**
   * Free-text matching terms used by recommend_pattern: symptoms, intents,
   * and keywords a developer might describe when this pattern applies.
   */
  whenToReachFor: string[];
}
