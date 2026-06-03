import type { Pattern } from "./types.js";

/** Render a single pattern as readable Markdown for tool output. */
export function renderPattern(p: Pattern, opts: { includeCode: boolean }): string {
  const lines: string[] = [];
  lines.push(`# ${p.name}  _(${p.category})_`);
  if (p.alsoKnownAs?.length) lines.push(`**Also known as:** ${p.alsoKnownAs.join(", ")}`);
  lines.push("");
  lines.push(`**Intent.** ${p.intent}`);
  lines.push("");
  lines.push(`**Problem.** ${p.problem}`);
  lines.push("");
  lines.push(`**Solution.** ${p.solution}`);
  lines.push("");

  lines.push("**When to use it**");
  for (const a of p.applicability) lines.push(`- ${a}`);
  lines.push("");

  lines.push("**Participants**");
  for (const part of p.participants) lines.push(`- **${part.name}** — ${part.role}`);
  lines.push("");

  if (opts.includeCode) {
    lines.push(`## Conceptual example — ${p.conceptual.title}`);
    lines.push(p.conceptual.summary);
    lines.push("```swift");
    lines.push(p.conceptual.code);
    lines.push("```");
    lines.push("");
    lines.push(`## Real-world example — ${p.realWorld.title}`);
    lines.push(p.realWorld.summary);
    lines.push("```swift");
    lines.push(p.realWorld.code);
    lines.push("```");
    lines.push("");
  }

  lines.push("**Pros**");
  for (const pro of p.pros) lines.push(`- ${pro}`);
  lines.push("");
  lines.push("**Cons**");
  for (const con of p.cons) lines.push(`- ${con}`);
  lines.push("");

  if (p.relatedPatterns.length) {
    lines.push(`**Related patterns:** ${p.relatedPatterns.join(", ")}`);
    lines.push("");
  }
  return lines.join("\n");
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "is",
  "are", "be", "i", "we", "my", "our", "it", "that", "this", "have", "has",
  "want", "need", "how", "do", "can", "should", "would", "when", "use", "using",
  "code", "swift", "class", "type", "object", "objects", "pattern", "patterns",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .split(/[\s/]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

export interface Recommendation {
  pattern: Pattern;
  score: number;
  matched: string[];
}

/**
 * Lexical recommender: scores each pattern against the query by overlap with
 * its searchable text. Weighted so that explicit "whenToReachFor" cues count
 * most, the intent/problem next, and name/category least.
 */
export function recommend(patterns: Pattern[], query: string, limit: number): Recommendation[] {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return [];

  const scored: Recommendation[] = patterns.map((p) => {
    const cueText = p.whenToReachFor.join(" ");
    const cueTokens = tokenize(cueText);
    const proseTokens = tokenize(`${p.intent} ${p.problem} ${p.solution}`);
    const nameTokens = tokenize(`${p.name} ${p.alsoKnownAs?.join(" ") ?? ""}`);

    const matched = new Set<string>();
    let score = 0;
    for (const tok of cueTokens) {
      if (queryTokens.has(tok)) {
        score += 3;
        matched.add(tok);
      }
    }
    for (const tok of proseTokens) {
      if (queryTokens.has(tok)) {
        score += 1;
        matched.add(tok);
      }
    }
    for (const tok of nameTokens) {
      if (queryTokens.has(tok)) {
        score += 2;
        matched.add(tok);
      }
    }
    return { pattern: p, score, matched: [...matched] };
  });

  return scored
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.pattern.name.localeCompare(b.pattern.name))
    .slice(0, limit);
}
