# OpenCode Compatibility Model

This reference separates the OpenCode-portable baseline from behavior supplied by the `oh-my-openagent` harness layer. It is not a routing table, support policy, or second control plane. For local route choice, helper fit, and Impeccable layering, keep using `.opencode/reference/routing-matrix.md`.

## Native OpenCode portable baseline

Native portability means the surface follows current OpenCode docs and schema without needing the `oh-my-openagent` plugin.

1. Use `opencode.json` or `opencode.jsonc` for project OpenCode config. The same schema is used for global config under `~/.config/opencode/opencode.json`.
2. Use standard `.opencode/` directories for local assets, including `.opencode/skills/<name>/SKILL.md` and `.opencode/commands/*.md`.
3. Use native `skills.paths` in `opencode.json` when extra skill folders are needed. Current OpenCode schema also documents `skills.urls`. It does not define `skills.sources` as a native config key.
4. Keep native skill frontmatter to documented fields: `name`, `description`, `license`, `compatibility`, and `metadata`. OpenCode docs describe `metadata` as an optional string-to-string map.
5. Keep native command definitions on documented command fields such as `description`, `agent`, `model`, `subtask`, and the command prompt template.
6. Use the singular `permission` config term for OpenCode tool, task, skill, and agent access rules. This document uses `permission` only in that native OpenCode sense.

Native OpenCode does not promise this bundle's local routing policy, workspace placement convention, Impeccable wrapper taxonomy, or `oh-my-openagent` task and category behavior. Those are documentation-backed bundle rules or harness behavior, not portable OpenCode guarantees.

## oh-my-openagent enhanced behavior

Enhanced behavior means the `oh-my-openagent` plugin or this local companion bundle adds meaning beyond native OpenCode.

1. `oh-my-openagent` is registered from OpenCode config, normally in `opencode.json`, through the plugin entry `oh-my-openagent`. The legacy plugin entry `oh-my-opencode` still loads during the rename transition.
2. The plugin reads user and walked project configs named `.opencode/oh-my-openagent.jsonc`, `.opencode/oh-my-openagent.json`, `.opencode/oh-my-opencode.jsonc`, or `.opencode/oh-my-opencode.json` during the transition.
3. This toolkit's `.opencode/oh-my-openagent.jsonc` is a narrow schema-compatible plugin config placeholder, not path wiring. From the toolkit repo root, `oh-my-openagent` v4.3.0 project discovery loads `.opencode/skills` and `.opencode/commands` automatically; reference files remain documentation linked by those assets.
4. `skills.sources` is an `oh-my-openagent` skill-loading config shape for extra skill sources outside default project discovery, not the same thing as native OpenCode `skills.paths`. The enhanced source entries may include a local `path`, `recursive`, or `glob` setting, or a remote source string. It does not configure command or reference roots.
5. Enhanced skill definitions may carry `allowed-tools`, `argument-hint`, `model`, `agent`, `subtask`, `license`, `compatibility`, and `metadata` in the plugin schema. In this bundle, `allowed-tools` and `argument-hint` should be read as enhanced metadata unless current native OpenCode docs add them later.
6. The Impeccable layer uses enhanced local metadata on the consolidated `impeccable` skill, including `allowed-tools: Bash(npx impeccable *)` and an `argument-hint`. Local compatibility wrappers stay thin, grant-free aliases for the consolidated `/impeccable` command model.
7. Category routing, background agents, built-in MCP injection, Team Mode, task persistence, and hashline editing are harness features. They can improve local operation, but they are not native OpenCode guarantees.
8. The `oh-my-openagent-toolkit` CLI package is distribution mechanics only. It installs or updates this bundle's project-local files from package contents and `toolkit-manifest.json`; it is not native OpenCode configuration, not a plugin registration method, and not `oh-my-openagent` path wiring.

## Boundary rules for this toolkit

1. Do not add custom top-level keys to native `opencode.json` examples. Put `oh-my-openagent` settings in the plugin config files instead.
2. Do not add top-level `paths` to `.opencode/oh-my-openagent.jsonc`; v4.3.0 exposes top-level `skills`, while local `.opencode/skills` and `.opencode/commands` are project-discovered from the toolkit root.
3. Do not describe `.opencode/oh-my-openagent.jsonc` or `.opencode/oh-my-opencode.jsonc` as native OpenCode config files. They are enhanced plugin config files.
4. For `allowed-tools`, `argument-hint`, or `user-invocable`, do not claim native support unless current OpenCode docs or schema prove it. At the time of this reference, current native docs list a smaller skill frontmatter set and ignore unknown skill frontmatter fields.
5. Do not use `skills.sources` when documenting native OpenCode. Use `skills.paths` for native extra skill folders and reserve `skills.sources` for the enhanced layer.
6. Do not use the package CLI as evidence that `.opencode/oh-my-openagent.jsonc` controls command, reference, routing, or workspace paths.
7. If a local document needs routing or helper behavior, link to `.opencode/reference/routing-matrix.md`. If it needs native-versus-enhanced config or metadata wording, link here.

## Quick reference

| Question | Portable answer | Enhanced answer |
| --- | --- | --- |
| Where does project OpenCode config live? | `opencode.json` or `opencode.jsonc` | Plugin config may also live in `.opencode/oh-my-openagent.jsonc` or transitional `.opencode/oh-my-opencode.jsonc`; local toolkit assets are discovered from the active toolkit root |
| How are extra skill folders named? | `skills.paths` in native config | `skills.sources` in `oh-my-openagent` config for extra skill sources; default `.opencode/skills` needs no explicit config |
| Which skill metadata is native? | `name`, `description`, `license`, `compatibility`, `metadata` | `allowed-tools`, `argument-hint`, and richer plugin skill definitions are enhanced |
| How are access rules named? | `permission` | Agent and category settings may add enhanced behavior, but `permission` stays the native OpenCode term |
| Does routing happen here? | No. Native OpenCode discovers assets and runs commands or skills | No. This reference explains compatibility only. Routing remains in `.opencode/reference/routing-matrix.md` |
| Is the npm CLI native OpenCode config? | No. It is outside the native config schema | No. It is package distribution mechanics only, not `oh-my-openagent` path wiring |
