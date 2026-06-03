#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync } from "node:fs";
import { join, isAbsolute } from "node:path";
import { patterns, byId, categories } from "./catalog.js";
import { renderPattern, recommend } from "./format.js";
import {
  CONVENTIONS_FILES,
  CONVENTIONS_TEMPLATE,
  conventionsHeader,
  noConventionsMessage,
} from "./conventions.js";

const server = new McpServer({
  name: "swift-design-patterns",
  version: "0.2.1",
});

const CATALOG_SUMMARY = `Catalog of ${patterns.length} GoF design patterns with idiomatic Swift examples.`;

// --- list_patterns ---------------------------------------------------------
server.registerTool(
  "list_patterns",
  {
    title: "List design patterns",
    description:
      "List the available GoF design patterns with their category and intent. " +
      "Optionally filter by category (Creational, Structural, Behavioral). " +
      "Use this first to discover which patterns exist before fetching one with get_pattern.",
    inputSchema: {
      category: z
        .enum(["Creational", "Structural", "Behavioral"])
        .optional()
        .describe("Restrict the listing to a single category."),
    },
  },
  async ({ category }) => {
    const subset = category ? patterns.filter((p) => p.category === category) : patterns;
    const grouped = categories
      .filter((c) => !category || c === category)
      .map((c) => {
        const items = subset
          .filter((p) => p.category === c)
          .map((p) => `- **${p.name}** (\`${p.id}\`) — ${p.intent}`)
          .join("\n");
        return `### ${c}\n${items}`;
      })
      .join("\n\n");
    return {
      content: [{ type: "text", text: `${CATALOG_SUMMARY}\n\n${grouped}` }],
    };
  },
);

// --- get_pattern -----------------------------------------------------------
server.registerTool(
  "get_pattern",
  {
    title: "Get a design pattern",
    description:
      "Fetch the full reference for one design pattern: intent, problem, solution, " +
      "applicability, participants, idiomatic Swift conceptual + real-world examples, " +
      "pros/cons, and related patterns. Accepts the pattern id (e.g. 'abstract-factory') " +
      "or its display name (e.g. 'Abstract Factory'), case-insensitive.",
    inputSchema: {
      pattern: z.string().describe("Pattern id or name, e.g. 'strategy' or 'Strategy'."),
      includeCode: z
        .boolean()
        .optional()
        .describe("Include the Swift code examples (default true). Set false for a quick summary."),
    },
  },
  async ({ pattern, includeCode }) => {
    const key = pattern.trim().toLowerCase().replace(/\s+/g, "-");
    const found =
      byId.get(key) ??
      patterns.find((p) => p.name.toLowerCase() === pattern.trim().toLowerCase());
    if (!found) {
      const names = patterns.map((p) => p.id).join(", ");
      return {
        isError: true,
        content: [
          { type: "text", text: `Unknown pattern "${pattern}". Available ids: ${names}` },
        ],
      };
    }
    return {
      content: [
        { type: "text", text: renderPattern(found, { includeCode: includeCode ?? true }) },
      ],
    };
  },
);

// --- recommend_pattern -----------------------------------------------------
server.registerTool(
  "recommend_pattern",
  {
    title: "Recommend a design pattern",
    description:
      "Given a free-text description of a design problem, symptom, or goal (e.g. " +
      "'I have a huge switch statement that picks between behaviors', or 'I need to add " +
      "responsibilities to objects without subclassing'), return the design patterns most " +
      "likely to fit, ranked, with the matched cues and a short rationale. Use get_pattern " +
      "afterwards to pull the full example for a recommended pattern.",
    inputSchema: {
      problem: z.string().describe("Describe the design problem or what you are trying to achieve."),
      limit: z
        .number()
        .int()
        .min(1)
        .max(10)
        .optional()
        .describe("How many candidates to return (default 3)."),
    },
  },
  async ({ problem, limit }) => {
    const recs = recommend(patterns, problem, limit ?? 3);
    if (recs.length === 0) {
      return {
        content: [
          {
            type: "text",
            text:
              "No strong match from keywords alone. Try describing the symptom more concretely " +
              "(what varies, what you want to decouple, what is hard to change), or call " +
              "list_patterns to browse the catalog.",
          },
        ],
      };
    }
    const body = recs
      .map((r, i) => {
        const matched = r.matched.length ? ` _(matched: ${r.matched.join(", ")})_` : "";
        return `${i + 1}. **${r.pattern.name}** (\`${r.pattern.id}\`, ${r.pattern.category}) — ${r.pattern.intent}${matched}`;
      })
      .join("\n");
    return {
      content: [
        {
          type: "text",
          text: `Top ${recs.length} candidate pattern(s) for: "${problem}"\n\n${body}\n\nCall get_pattern with a pattern id for the full reference and Swift example.`,
        },
      ],
    };
  },
);

// --- get_project_conventions -----------------------------------------------
function resolveProjectDir(): string {
  const dir = process.env.CLAUDE_PROJECT_DIR;
  if (dir && isAbsolute(dir)) return dir;
  return process.cwd();
}

server.registerTool(
  "get_project_conventions",
  {
    title: "Get this project's Swift conventions",
    description:
      "Read the current project's architecture & conventions file (e.g. " +
      ".claude/swift-architecture.md) so pattern advice matches the team's chosen " +
      "architecture, idioms, and custom patterns. ALWAYS call this before proposing or " +
      "implementing a pattern in a real project, and follow what it says over generic " +
      "defaults. With action='template', returns a blank template the team can fill in.",
    inputSchema: {
      action: z
        .enum(["view", "template"])
        .optional()
        .describe("'view' (default) reads the project's conventions; 'template' returns a blank starter."),
    },
  },
  async ({ action }) => {
    if (action === "template") {
      return { content: [{ type: "text", text: CONVENTIONS_TEMPLATE }] };
    }
    const projectDir = resolveProjectDir();
    for (const rel of CONVENTIONS_FILES) {
      const full = join(projectDir, rel);
      if (existsSync(full)) {
        try {
          const body = readFileSync(full, "utf8");
          return { content: [{ type: "text", text: conventionsHeader(rel) + body }] };
        } catch {
          // fall through to the next candidate / not-found message
        }
      }
    }
    return { content: [{ type: "text", text: noConventionsMessage(projectDir) }] };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
