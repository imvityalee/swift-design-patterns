// Smoke test: spin up the bundled server over stdio and exercise every tool.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverPath = resolve(__dirname, "..", "dist", "index.js");

const transport = new StdioClientTransport({ command: "node", args: [serverPath] });
const client = new Client({ name: "smoke", version: "0.0.0" });
await client.connect(transport);

let failures = 0;
const assert = (cond, msg) => {
  if (cond) {
    console.log("  ok -", msg);
  } else {
    failures++;
    console.error("  FAIL -", msg);
  }
};

const tools = await client.listTools();
const names = tools.tools.map((t) => t.name).sort();
console.log("tools:", names.join(", "));
assert(names.length === 4, "exposes 4 tools");
assert(
  ["get_pattern", "get_project_conventions", "list_patterns", "recommend_pattern"].every((n) => names.includes(n)),
  "tool names present",
);

const list = await client.callTool({ name: "list_patterns", arguments: {} });
const listText = list.content[0].text;
assert(/Creational/.test(listText) && /Structural/.test(listText) && /Behavioral/.test(listText), "list_patterns has 3 categories");
assert((listText.match(/`[a-z-]+`/g) || []).length >= 23, "list_patterns lists >= 23 patterns");

const listCreational = await client.callTool({ name: "list_patterns", arguments: { category: "Creational" } });
assert(!/### Structural/.test(listCreational.content[0].text), "category filter excludes other categories");

const get = await client.callTool({ name: "get_pattern", arguments: { pattern: "Abstract Factory" } });
const getText = get.content[0].text;
assert(/# Abstract Factory/.test(getText), "get_pattern resolves by display name");
assert(/```swift/.test(getText), "get_pattern includes swift code");

const getNoCode = await client.callTool({ name: "get_pattern", arguments: { pattern: "observer", includeCode: false } });
assert(!/```swift/.test(getNoCode.content[0].text), "includeCode:false omits code");

const bad = await client.callTool({ name: "get_pattern", arguments: { pattern: "nonexistent" } });
assert(bad.isError === true, "unknown pattern returns isError");

const rec = await client.callTool({ name: "recommend_pattern", arguments: { problem: "I have a huge switch statement that selects between interchangeable algorithms at runtime", limit: 3 } });
const recText = rec.content[0].text;
console.log("  recommend ->", recText.split("\n").filter((l) => /^\d\./.test(l)).join(" | "));
assert(/strategy/i.test(recText), "recommend surfaces Strategy for the algorithm-switch problem");

const rec2 = await client.callTool({ name: "recommend_pattern", arguments: { problem: "add responsibilities to an object dynamically without subclassing" } });
assert(/decorator/i.test(rec2.content[0].text), "recommend surfaces Decorator for add-responsibilities problem");

const tmpl = await client.callTool({ name: "get_project_conventions", arguments: { action: "template" } });
assert(/Swift Architecture & Conventions/.test(tmpl.content[0].text), "conventions template returns the starter");

const conv = await client.callTool({ name: "get_project_conventions", arguments: {} });
assert(/conventions/i.test(conv.content[0].text), "get_project_conventions view returns text (file or not-found+template)");

await client.close();
console.log(failures === 0 ? "\nALL SMOKE CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
