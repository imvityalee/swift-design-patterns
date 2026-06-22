# Team setup — auto-enable in a project

For a shared codebase, you can make **every teammate get this plugin
automatically** when they open the project in Claude Code — no manual `/plugin`
commands. Commit the snippet below into your project's
`.claude/settings.json` (checked into your team's repo, *not* this plugin repo).

```json
{
  "extraKnownMarketplaces": {
    "swift-design-patterns": {
      "source": {
        "source": "github",
        "repo": "imvityalee/swift-design-patterns"
      }
    }
  },
  "enabledPlugins": {
    "swift-design-patterns@swift-design-patterns": true
  }
}
```

- `extraKnownMarketplaces` registers the marketplace from the GitHub repo. The
  key (`swift-design-patterns`) is the marketplace's `name` (from
  `.claude-plugin/marketplace.json`).
- `enabledPlugins` auto-enables the plugin. The value is
  `"<plugin-name>@<marketplace-name>"`, both `swift-design-patterns` here.

**First-run behavior:** the teammate gets the standard one-time *trust this
folder* prompt. After trusting, the marketplace is registered and the plugin
enabled automatically. Pin to a release tag for stability (see below).

## Pinning to a release (recommended for teams)

Tracking `main` means teammates pick up changes immediately. To pin to a stable
release instead, point the marketplace source at a tag:

```json
{
  "extraKnownMarketplaces": {
    "swift-design-patterns": {
      "source": {
        "source": "github",
        "repo": "imvityalee/swift-design-patterns",
        "ref": "v0.4.0"
      }
    }
  },
  "enabledPlugins": {
    "swift-design-patterns@swift-design-patterns": true
  }
}
```

> If `ref` is not supported by your Claude Code version, omit it (tracks the
> default branch) and instead control rollout by merging to `main` deliberately.

A ready-to-copy file lives at
[`team-settings.example.json`](./team-settings.example.json).
