# Oh My OpenAgent Toolkit

Project-local OpenCode bundle for teams that want a clearer operating layer on top of `oh-my-openagent`, without pretending to be upstream or a second control plane.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license) [![Built on OpenCode](https://img.shields.io/badge/built%20on-OpenCode-5b5bd6.svg)](https://opencode.ai/docs) [![Companion to oh-my-openagent](https://img.shields.io/badge/companion-oh--my--openagent-2d7a46.svg)](https://github.com/code-yeongyu/oh-my-openagent) [![Validated surface: 4 workflows](https://img.shields.io/badge/validated%20surface-4%20workflows-8a3ffc.svg)](#validated-surface)

`oh-my-openagent-toolkit` adds local routing, support framing, workspace conventions, package installation helpers, and the imported Impeccable v3.1.1 design layer to an OpenCode project. It is a companion to `oh-my-openagent`, not an official upstream distribution and not a replacement for the harness.

## At a glance

| Topic | Summary |
| --- | --- |
| Foundation | `oh-my-openagent` provides the harness layer, orchestration model, delegation, and built-in helpers. |
| Local layer | This toolkit adds thin routing, domain-specific skill surfaces, support framing, workspace conventions, and package installation/update/validation commands. |
| Skill surface | 45 top-level skill entrypoints under `.opencode/skills/`: 42 core skill surfaces plus 3 planned adjacent packs. |
| Impeccable model | 1 consolidated upstream Impeccable skill, 23 upstream commands, and 22 local compatibility wrappers. |
| Validated now | `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`. |
| Design references | 73 local DESIGN.md snapshots are available for UI visual-language inspiration, not as a route or support claim. |
| Workspace default | New greenfield work started from the repo root lands under `workspace/{project-name}-{domain}`; existing projects stay in place. |

## What this is

This repo is a practical operating layer for running OpenCode from a real project root. It keeps the local docs thin, routes work into a small set of domain buckets, points agents toward the right local pack, and leaves planning, execution, and helper behavior to the harness.

| Layer | What it owns |
| --- | --- |
| `oh-my-openagent` | General-purpose orchestration, delegation, built-in helpers, and execution model. |
| `oh-my-openagent-toolkit` | Routing signals, domain pack organization, support boundaries, workspace guidance, packaged install/update/validate flow, and local documentation. |

The practical split is simple: upstream stays general-purpose, while this bundle makes a cloned project easier to navigate, operate, and explain.

## What this is not

| Not this | Why |
| --- | --- |
| Official upstream distribution | This is a companion bundle built on top of `oh-my-openagent`, not upstream itself. |
| Harness replacement | The harness remains the execution foundation. |
| Second runtime or control plane | Local routing docs do not create task authority, release flow, MCP behavior, or orchestration ownership. |
| Blanket support promise | Routed or discoverable surfaces are not automatically validated surfaces. |
| Standalone Impeccable product | Impeccable is included as a supplementary refinement layer, not as a separate support contract. |

## What it adds

| Surface | What it adds | Where to look |
| --- | --- | --- |
| Thin routing | Six request-shape buckets, pack recommendations, category hints, and helper discovery. | `AGENTS.md`, `.opencode/commands/route-domain.md`, `.opencode/reference/routing-matrix.md` |
| Package CLI | Safe `init`, `migrate`, `update`, `validate`, and `doctor` commands for target projects. | `bin/omo-toolkit.mjs`, `src/cli/` |
| Governance refs | Explicit support, workflow, compatibility, and workspace boundaries. | `.opencode/reference/support-policy.md`, `.opencode/reference/workflow-catalog.md`, `.opencode/reference/opencode-compatibility-model.md`, `.opencode/reference/workspace-model.md` |
| Skill surface | Domain-oriented local packs across architecture, UI, backend, systems, data, security, QA, and deployment. | `.opencode/skills/` |
| Impeccable refinement | Supplementary UI critique, anti-slop review, polishing, typography, color, layout, and interaction guidance. | `.opencode/skills/impeccable/`, compatibility wrappers such as `polish`, `audit`, `critique`, `typeset` |
| DESIGN.md reference layer | 73 offline DESIGN.md snapshots for visual-language interpretation. It is not a primary route and not a validated support claim. | `.opencode/reference/design-md/README.md`, `.opencode/reference/design-md-source-policy.md`, `.opencode/reference/design-md-catalog.md`, `.opencode/reference/design-md-selection-protocol.md` |
| Service vernacular | `service-vernacular` is a supplementary language companion for repo-backed nouns, verbs, surface registers, and rewrite evidence. It is not a primary route and not a support claim. | `.opencode/skills/service-vernacular/SKILL.md`, `.opencode/skills/service-vernacular/reference/` |
| Compass orientation | `compass` helps frame goals, compare options, and choose a next route before implementation. It is not a primary route or validated support claim. | `.opencode/skills/compass/SKILL.md` |

## Validated surface

The public validated surface is intentionally narrow. Broader skill coverage is documented as `guided` or `planned`, not as blanket `supported now` coverage.

| Tier | Meaning |
| --- | --- |
| `validated` | Eligible for README supported-now summaries. Current workflow IDs: `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`. |
| `guided` | Current routing/reference coverage exists, but the surface is not an end-to-end validated public claim. |
| `planned` | Named future or adjacent surface, not present-tense support. |

Support-tier authority lives in `.opencode/reference/capability-matrix.json`, `.opencode/reference/support-policy.md`, and `.opencode/reference/workflow-catalog.md`.

## Quick start

Install OpenCode and the harness first:

1. Install [OpenCode](https://opencode.ai/docs).
2. Set up [`oh-my-openagent`](https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/refs/heads/dev/docs/guide/installation.md).

Then run the package installer from the target project root:

```sh
npx oh-my-openagent-toolkit init --dry-run
npx oh-my-openagent-toolkit init --apply
npx oh-my-openagent-toolkit validate
npx oh-my-openagent-toolkit doctor
```

Add `--target <path>` when you are not running from the target project root.

The package exposes two bin names: `oh-my-openagent-toolkit` and `omo-toolkit`. `omo-toolkit` is an alias inside the `oh-my-openagent-toolkit` package, not a separate npm package.

```sh
npx --package oh-my-openagent-toolkit omo-toolkit --help
bunx --package oh-my-openagent-toolkit omo-toolkit doctor
```

## Safe setup and migration

Default setup is conservative. Bare `init` is a dry-run preview unless you pass an explicit mode. `init --guided` asks for profile, optional MCP config, optional root docs, legacy migration, and final apply choice when running in a TTY. Outside a TTY or in CI, guided init uses deterministic defaults and stays dry-run unless `--apply` or `--yes` is supplied.

Use migration when a target already has toolkit-looking `.opencode/` files, `AGENTS.md`, or a prior manual toolkit copy without matching lockfile ownership.

```sh
npx oh-my-openagent-toolkit migrate --dry-run
npx oh-my-openagent-toolkit migrate --apply
npx oh-my-openagent-toolkit init --migrate --dry-run
npx oh-my-openagent-toolkit update --check
```

`migrate --dry-run` writes nothing. `migrate --apply` writes only safe actions from the plan. `--force` and `--overwrite` are rejected guardrails, not migration safety flags.

| Migration label | Meaning |
| --- | --- |
| `adopt-identical` | Target file already matches the current toolkit payload, so ownership can be recorded without rewriting bytes. |
| `replace-known-stale` | Target file matches a package-local historical toolkit hash and can be replaced safely by `--apply`. |
| `create-missing` | A toolkit file is absent and can be created. |
| `preserve-project-owned` | A file under a managed `.opencode/` root is not part of the toolkit manifest, so it is preserved as project-owned. |
| `needs-review` | A toolkit path has project bytes that do not match current or historical payloads, so it is left alone. |
| `unsafe-conflict` | The CLI cannot safely classify the path or marker shape. Fix this before writes run. |

`AGENTS.md` migration is marker-safe: the CLI may insert, adopt, or replace only the OMO Toolkit managed block. Project-authored content outside managed markers stays untouched. `localOnly` records project-owned paths that `validate`, `doctor`, `init`, `migrate`, and `update` must preserve; it does not change support tiers or validated workflow status.

Root docs and `.mcp.json` are opt-in target artifacts. Default install manages the toolkit `.opencode/` payload, the toolkit lockfile, and the managed block in `AGENTS.md`; it does not overwrite a target project's README, changelog, version file, license, or `.mcp.json`.

## Using the bundle

Start from the repo root and read in this order:

| Step | Read | Why |
| --- | --- | --- |
| 1 | `README.md` | Overview, package usage, and public boundary. |
| 2 | `AGENTS.md` | Local reading order and bundle boundaries. |
| 3 | `.opencode/reference/routing-matrix.md` | Authoritative routing, category, and helper map. |
| 4 | `.opencode/reference/opencode-compatibility-model.md` | Native OpenCode versus `oh-my-openagent` enhanced behavior boundary. |
| 5 | `.opencode/reference/support-policy.md` and `.opencode/reference/workflow-catalog.md` | Support rules and validated workflow inventory. |
| 6 | `.opencode/reference/workspace-model.md` | Repo-root placement conventions and greenfield workspace default. |

For UI work, route through `frontend-web` or `mobile-app` first, then layer Impeccable commands or compatibility wrappers only when they fit. If a UI request names a product feel or the project lacks a strong design direction, use the DESIGN.md selection protocol to shortlist exactly three local reference slugs plus `Custom`; extract transferable traits and adapt them to the current project rather than copying brand identity.

For product-facing language across UI, docs, CLI, notifications, backend/API errors, admin/operator surfaces, onboarding, support, or release notes, use `service-vernacular` as a supplementary language companion. Keep implementation ownership with the primary route.

## Source workflow

Use this path when you want to inspect, patch, or validate the toolkit source itself:

```sh
git clone https://github.com/HanTechnology/oh-my-openagent-toolkit.git
cd oh-my-openagent-toolkit
npm test
npm run validate:source
bash .opencode/reference/validate-opencode-bundle.sh full
```

The source validator checks this repository bundle. It does not validate an installed target project. For installed targets, use:

```sh
node bin/omo-toolkit.mjs validate --target <path>
```

## Governance references

This repo separates public support claims from the broader skill inventory. README supported-now language must stay aligned with the support references below.

| Reference | Use it for |
| --- | --- |
| `.opencode/reference/capability-matrix.json` | Machine-readable support levels for validated, guided, and planned surfaces. |
| `.opencode/reference/support-policy.md` | Support tiers and public claim rules. |
| `.opencode/reference/workflow-catalog.md` | The four validated flagship workflows. |
| `.opencode/reference/opencode-compatibility-model.md` | Native OpenCode baseline and `oh-my-openagent` enhanced behavior boundary. |
| `.opencode/reference/workspace-model.md` | Repo-root execution and `workspace/{project-name}-{domain}` placement. |
| `.opencode/reference/project-setup-policy.md` | Preference for refining existing projects before greenfield creation. |
| `.opencode/reference/web-3d-support-model.md` | Browser 3D ownership and support-tier boundaries. |
| `CHANGELOG.md` | Released changes and historical validation notes. |
| `VERSION` | Current toolkit version. |
| `LICENSE` | Root toolkit license text. |

Report bugs or documentation gaps as GitHub issues with a small reproduction, affected file, and expected outcome. Keep issue reports free of secrets, private URLs, tokens, and sensitive customer data.

Security reporting: there is no dedicated `SECURITY.md` in this repo right now. If GitHub Security Advisories are enabled, use them for private vulnerability reports. Otherwise, open a minimal public issue asking maintainers to provide a private channel, and do not include exploit details, credentials, or private data in that issue.

Support is community maintenance for this public bundle. Funding links do not create paid support, response commitments, or validation boundary changes.

## Support the project

If this bundle saves you time or helps your team get oriented faster, you can help fund continued maintenance and documentation work here:

[![Support via Stripe](https://img.shields.io/badge/support%20this%20project-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://donate.stripe.com/14A00k0FK5o54Amc2KaZi02)
[![Sponsor maintenance](https://img.shields.io/badge/sponsor%20maintenance-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://donate.stripe.com/28E28s604aIpc2O7MuaZi03)

These links are for optional funding only. They are not paid support, do not change workflow validation, and do not change the support-policy boundaries described in this repo.

## Attribution

`oh-my-openagent-toolkit` is maintained by Nuvreon Corp as a companion bundle built on top of `oh-my-openagent`, with Impeccable v3.1.1 included as a local design aid through the consolidated upstream skill and compatibility wrappers.

This bundle is built as a companion to `oh-my-openagent`, which provides the harness foundation and built-in helper model it relies on. The repo does not replace that upstream foundation, and it does not claim official endorsement or official-distribution status.

## License

The toolkit repository is licensed under the MIT License. See [`LICENSE`](LICENSE) for the root license text.

Vendored upstream components keep their own notices and license files. Impeccable v3.1.1 is carried under `.opencode/skills/impeccable/`, and its upstream Apache 2.0 license remains in `.opencode/skills/impeccable/LICENSE`. The root MIT license for this toolkit does not replace that vendored attribution or the Apache license terms that travel with Impeccable.
