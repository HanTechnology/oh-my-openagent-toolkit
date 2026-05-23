# Oh My OpenAgent Toolkit

Project-local OpenCode bundle for teams that want a clearer operating layer on top of `oh-my-openagent`, without pretending to be upstream or a second control plane.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license) [![Built on OpenCode](https://img.shields.io/badge/built%20on-OpenCode-5b5bd6.svg)](https://opencode.ai/docs) [![Companion to oh-my-openagent](https://img.shields.io/badge/companion-oh--my--openagent-2d7a46.svg)](https://github.com/code-yeongyu/oh-my-openagent) [![Validated surface: 4 workflows](https://img.shields.io/badge/validated%20surface-4%20workflows-8a3ffc.svg)](#what-it-adds-on-top-of-upstream)

`oh-my-openagent-toolkit` is a project-local OpenCode bundle built on `oh-my-openagent`. It adds thin local routing, support framing, workspace conventions, and the imported Impeccable v3.1.1 design layer so a cloned repo is easier to navigate, operate, and explain. Local Impeccable now consists of 1 consolidated upstream Impeccable skill, 23 upstream commands, and 22 local compatibility wrappers.

This repo is a companion to `oh-my-openagent`, not an official upstream distribution and not a replacement for the harness. The skill surface is broad, 45 top-level skill entrypoints under `.opencode/skills/`, made up of 42 core skill surfaces and 3 planned adjacent packs, but the visible validated surface stays narrow: `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`.

| At a glance | Summary |
| --- | --- |
| Foundation | `oh-my-openagent` provides the harness layer and execution model. |
| Local layer | `oh-my-openagent-toolkit` adds thin routing, support framing, workspace conventions, and the imported Impeccable v3.1.1 design layer. |
| Skill surface | The repo exposes 45 top-level skill entrypoints under `.opencode/skills/`: 42 core skill surfaces plus 3 planned adjacent packs. |
| Impeccable model | Local Impeccable is 1 consolidated upstream Impeccable skill exposing 23 upstream commands, with 22 local compatibility wrappers kept for existing top level entrypoints. |
| Validated now | `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`. |
| Broader coverage | Additional surfaces are documented as `guided` or `planned`, not blanket `supported now` coverage. |
| Repo-root convention | Work from the repo root and default new greenfield outputs to `workspace/{project-name}-{domain}`. |

## What this bundle is

This bundle is a practical operating layer for running OpenCode from a real project root. It gives you a thin routing surface through `AGENTS.md`, `.opencode/commands/route-domain.md`, and `.opencode/reference/routing-matrix.md`, then leaves planning, execution flow, and built-in helper behavior to the harness instead of pretending to be a second control plane.

| Layer | What it supplies |
| --- | --- |
| `oh-my-openagent` | Orchestration, delegation, built-in helpers, and the execution model. |
| `oh-my-openagent-toolkit` | Six routing buckets, sharper local specialization, domain-specific skill surfaces, support framing, workspace conventions, and public-facing guidance. |

The practical split is simple: `oh-my-openagent` stays general-purpose, while `oh-my-openagent-toolkit` gives that harness better routing signals, better domain-specific surfaces, and a more explicit explanation of what this repo can do today.

## Who this is for

This bundle is for a clone user who wants a stronger local operating layer without pretending the repo is its own control plane. It fits people using OpenCode with the `oh-my-openagent` harness who want clearer routing, practical workspace defaults, sharper public documentation, and an explicit explanation of what is currently validated versus what is only guided or planned.

| Reader | Why it fits |
| --- | --- |
| Clone user | You want a stronger local operating layer without inventing a second control plane. |
| Maintainer or collaborator | You want clearer routing, explicit support boundaries, and a repo that is easier to explain to other contributors. |
| Public reader | You want to understand what the bundle adds, what it delegates to upstream, and where the current boundary actually is. |

If you are starting new greenfield work from this repo, the documented default landing zone is `workspace/{project-name}-{domain}`. If you are working in an existing project already inside the repo or worktree, keep that project in place.

## What it adds on top of upstream

This repo adds local structure, not local bureaucracy. In practice, that means a thin routing layer that classifies work into the existing domain buckets, points to the right expert pack, and reminds you which built-in helpers fit the request.

| Surface | What it adds | Where to look |
| --- | --- | --- |
| Thin routing | Classifies work into six routing buckets, points to the right pack, and names the built-in helpers that fit. | `AGENTS.md`, `.opencode/commands/route-domain.md`, `.opencode/reference/routing-matrix.md` |
| Governance and usage refs | Makes support boundaries, workflow inventory, and workspace conventions explicit instead of implied. | `.opencode/reference/support-policy.md`, `.opencode/reference/workflow-catalog.md`, `.opencode/reference/workspace-model.md` |
| Local skill surface | Adds 45 top-level skill entrypoints across major delivery lanes: 42 core skill surfaces plus 3 planned adjacent packs. That makes the repo feel like a real working system, not a thin demo layer. | `.opencode/skills/` |
| UI refinement layer | Adds Impeccable v3.1.1 as a supplementary refinement stack for anti-slop review, critique, and polish. Local top level Impeccable surfaces are compatibility wrappers around the consolidated `/impeccable` command model. | Start with `frontend-web` or `mobile-app`, then layer `/impeccable` commands or compatibility wrappers on purpose |
| DESIGN.md reference layer | Adds curated external DESIGN.md reference material for visual-language interpretation. It is not a primary route and not a validated support claim. | `.opencode/reference/design-md/README.md`, `.opencode/reference/design-md-source-policy.md`, `.opencode/reference/design-md-catalog.md` |
| Service vernacular companion | Adds `service-vernacular` as a supplementary language companion for repo-backed nouns, verbs, surface registers, and rewrite evidence across UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator, onboarding, support, and release notes. It is not a primary route, not a support claim, and not a validated support claim. | `.opencode/skills/service-vernacular/SKILL.md`, `.opencode/skills/service-vernacular/reference/` |

| Skill family | Representative surfaces | Role |
| --- | --- | --- |
| Architecture and integration | `architecture-integration` | Cross-stack design, API contracts, boundaries, and system shape. |
| Web and mobile UI | `frontend-web`, `mobile-app` | Browser UI, design systems, interaction flows, and client delivery. |
| Backend families | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | Service delivery, endpoints, auth flows, and integrations. |
| Systems and performance | `systems-rust`, `systems-c-cpp`, `functional-platform`, `php-ruby-platform` | Runtime efficiency, low-level reliability, concurrency, and performance work. |
| Data and security | `data-ml-platform`, `database-engineering`, `security-engineering` | Data-platform, storage, ML, hardening, and compliance-sensitive work. |
| QA and deployment | `qa-validation`, `devops-platform` | Validation, release readiness, rollout, and operational finish passes. |
| Refinement layer | `impeccable`, `audit`, `critique`, `polish`, `typeset`, `colorize`, `adapt` | Supplementary UI refinement and anti-slop improvement. The named local entries are compatibility wrappers, not primary routes. |
| Strategic orientation | `compass` | Bounded goal framing, option comparison, and next-route recommendation before implementation. It is not a primary route and not a validated support claim. |
| Language companion | `service-vernacular` | Supplementary language companion for repo-backed domain nouns, verbs, surface registers, `LANGUAGE.md` dossier guidance, and before/after rewrite evidence. It is not a primary route, not a support claim, and not a validated support claim. |

The current validated workflow surface is intentionally narrow.

| Support surface | What it means here |
| --- | --- |
| `validated` | Eligible for README `supported now` summaries. This currently means only `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`. |
| `guided` | Current pack or overlay coverage with routing and reference support, but no end-to-end validated public claim. |
| `planned` | Named expansion surface reserved for future implementation or later promotion, not a present-tense support claim. |

| `oh-my-openagent` gives you | `oh-my-openagent-toolkit` gives you | Why the combination is stronger |
| --- | --- | --- |
| General-purpose orchestration, delegation, built-in helpers, and the underlying execution model | Six routing buckets, explicit pack-to-problem mapping, domain-specific skill families, and a refinement stack that sharpens UI and documentation quality | The harness stays general-purpose while the bundle stays domain-aware, so the workflow is stronger than either layer alone |

For UI work, route through `frontend-web` or `mobile-app` first, then add `/impeccable` subcommands or local compatibility wrappers that fit the task. The same pattern appears across the rest of the bundle: core domain packs handle the main implementation lane, while focused helpers and refinement layers sharpen the outcome instead of replacing the route.

When a UI request names a specific product feel, the DESIGN.md catalog can help choose a selected slug and extract transferable patterns. It stays reference material for the existing UI routes, not a supported-now promise and not a validated support claim.

When copy work needs product-specific language before an owner writes UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator text, onboarding, support copy, or release notes, use `service-vernacular` as a supplementary language companion. It keeps `LANGUAGE.md` as canonical, treats `DOMAIN_LANGUAGE.md` as alternate or legacy context, and stays not a primary route, not a support claim, and not a validated support claim.

## What this is not

| Not this | Why |
| --- | --- |
| An official upstream distribution | It is a companion bundle built on top of `oh-my-openagent`, not the upstream distribution itself. |
| A replacement for the harness | The harness remains the foundation and built-in helper model this repo relies on. |
| A second runtime or control plane | The routing docs stay thin on purpose and do not create local task authority, release flow, or orchestration ownership. |
| A separate support tier for `impeccable` | `impeccable` is an included design and refinement layer, not a standalone product or support contract. |

Routed surfaces are not automatically validated surfaces, and broader skill coverage should not be described as `supported now` unless the manifest promotes it to `validated`.

## Quick start

Set up OpenCode and the harness first:

1. Install [OpenCode](https://opencode.ai/docs).
2. Set up [`oh-my-openagent`](https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/refs/heads/dev/docs/guide/installation.md).

Then choose one setup path.

### Path 1: Package/CLI installer

Use this path from the target project root when you want the toolkit installed into that project's local `.opencode/` bundle.

```sh
npx oh-my-openagent-toolkit init --dry-run
npx oh-my-openagent-toolkit init --apply
npx oh-my-openagent-toolkit migrate --dry-run
npx oh-my-openagent-toolkit migrate --apply
npx oh-my-openagent-toolkit init --migrate --dry-run
npx oh-my-openagent-toolkit init --guided
npx oh-my-openagent-toolkit init --guided --yes
npx oh-my-openagent-toolkit update --check
npx oh-my-openagent-toolkit validate
bunx oh-my-openagent-toolkit doctor
```

Add `--target <path>` when you are not running from the target project root.

The package exposes two bin names: `oh-my-openagent-toolkit` and `omo-toolkit`. `omo-toolkit` is an alias inside the `oh-my-openagent-toolkit` package, not a separate npm package. Use package-scoped alias commands when you want the shorter name:

```sh
npx --package oh-my-openagent-toolkit omo-toolkit --help
bunx --package oh-my-openagent-toolkit omo-toolkit doctor
```

Default `init` manages the toolkit `.opencode/` payload, the toolkit lockfile, and the managed block in `AGENTS.md`. Root docs and `.mcp.json` are opt-in target artifacts. The default install does not overwrite a target project's README, changelog, version file, license, or `.mcp.json`; add opt-in flags only when you intend to copy those references.

v0.6 keeps setup safe by default. Bare `init` remains a dry-run preview when you do not pass a mode, and it is still the default-safe installer path. `init --guided` is the explicit guided installer flow. In a TTY, guided init asks for the profile, optional MCP config, optional root docs, legacy migration, and final apply choice. Outside a TTY or in CI, it uses deterministic defaults and stays dry-run unless you pass `--apply` or `--yes`. `init --guided --yes` chooses deterministic defaults and applies them unless `--dry-run` was supplied explicitly. Changing bare TTY `init` to guided by default remains a future decision, not v0.6 behavior.

### v0.6 migration and guided init

Use migration when a target already has toolkit-looking `.opencode/` files, `AGENTS.md`, or a prior manual toolkit copy without matching lockfile ownership. Migration uses historical hashes shipped inside the package. It does not fetch history from the network at runtime.

`migrate --dry-run` is the first command to run. `--dry-run` writes nothing: it only prints the plan, conflicts, review items, and `localOnly` paths. `migrate --apply` writes only safe actions from that plan. In v0.6, `--force` and `--overwrite` are not migration safety flags. They are rejected guardrails, not supported ways to replace project-owned files.

Migration action labels mean:

| Label | Meaning |
| --- | --- |
| `adopt-identical` | The target file already matches the current toolkit payload, so migration records ownership without rewriting the file. |
| `replace-known-stale` | The target file matches a package-local historical toolkit hash, so `--apply` can replace it with the current package payload. |
| `create-missing` | A toolkit file is absent from the target, so `--apply` can create it. |
| `preserve-project-owned` | A file under a managed `.opencode/` root is not part of the toolkit manifest, so migration leaves it alone and records it as project-owned. |
| `needs-review` | A toolkit path has project bytes that do not match the current payload or a known historical payload, so migration leaves it alone and asks you to review it. |
| `unsafe-conflict` | The target has a path or marker shape the CLI cannot safely classify, such as a directory where a file is expected, a symlink, an invalid path, or broken `AGENTS.md` markers. No writes run until you fix it. |

`AGENTS.md` migration is marker-safe. The CLI may insert, adopt, or replace only the OMO Toolkit managed block. Project-authored content outside the managed markers stays untouched. Unknown managed blocks or unmarked toolkit-like text become `needs-review`; duplicate, nested, or partial markers become `unsafe-conflict`.

`localOnly` is the lockfile list for project-owned paths the toolkit must preserve. Migration records preserved or review-needed files there, and `validate`, `doctor`, `init`, `migrate`, and `update` respect those paths as project-owned instead of treating them as managed toolkit bytes. `localOnly` does not change support tiers or validated workflow status.

`doctor` is read-only. When it sees legacy or manual `.opencode` targets without a toolkit lockfile, doctor suggests `migrate --dry-run` before `init --dry-run`.

Installed target validation is CLI-only: run `npx oh-my-openagent-toolkit validate` from the target root or add `--target <path>`. From a toolkit checkout or unpacked package, `node bin/omo-toolkit.mjs validate --target <path>` checks the same installed-target surface. The shell source validator remains for this repo source bundle and accepts only `foundation` or `full`.

### Path 2: Clone/source workflow

Use this path when you want to inspect, patch, or validate the toolkit source itself.

```sh
git clone <repo-url>
cd oh-my-openagent-toolkit
bash .opencode/reference/validate-opencode-bundle.sh foundation
bash .opencode/reference/validate-opencode-bundle.sh full
```

The clone workflow does not validate an installed target project. Use `node bin/omo-toolkit.mjs validate --target <path>` for that.

Neither setup path changes the support boundary. The current validated workflow surface stays limited to the four workflows listed above, and installer/update mechanics do not change support tiers.

Once you are in this repo, read the local docs in this order:

| Step | Read | Why |
| --- | --- | --- |
| 1 | `README.md` | Bundle overview, boundary, and upstream context |
| 2 | `AGENTS.md` | Top-level local reading order and bundle boundaries |
| 3 | `.opencode/reference/routing-matrix.md` | Authoritative local routing and helper map |
| 4 | `.opencode/reference/opencode-compatibility-model.md` | Native OpenCode versus `oh-my-openagent` enhanced behavior boundary |
| 5 | `.opencode/reference/support-policy.md` and `.opencode/reference/workflow-catalog.md` | Support boundary and the current validated workflow inventory |
| 6 | `.opencode/reference/workspace-model.md` | Repo-root workspace conventions and the `workspace/{project-name}-{domain}` default for new greenfield outputs |

That sequence keeps the layers clear: OpenCode is the foundation, `oh-my-openagent` sets up the harness, and this bundle adds local routing, support framing, and workspace conventions from the repo root. For first-pass orientation inside the repo, follow `README.md` -> `AGENTS.md` -> `routing-matrix.md` -> `opencode-compatibility-model.md` -> `support-policy.md` and `workflow-catalog.md` -> `workspace-model.md`.

## Acknowledgements

| Upstream | Role in this repo |
| --- | --- |
| `oh-my-openagent` | Harness foundation, orchestration model, and built-in helper layer |
| `impeccable` | Imported Impeccable v3.1.1 refinement layer for UI work, carried locally through one consolidated upstream skill and compatibility wrappers |

This bundle is built as a companion to `oh-my-openagent`, which provides the harness foundation and built-in helper model it relies on. The repo does not replace that upstream foundation, and it does not claim official endorsement or official-distribution status.

It also includes Impeccable v3.1.1 as a local refinement family for UI work. That layer is bundled through the consolidated upstream skill and local compatibility wrappers. It is acknowledged here as an upstream design influence and bundled asset, not as a claim that this repo is the canonical home for it.

If you are publishing or sharing this repo, that is the right way to describe it: a companion bundle with a clearer local operating model, a broad but well-routed skill surface, explicit support boundaries, and a stronger documentation surface built on top of upstream foundations.

## Support and governance

This repo separates public support claims from the broader skill inventory. The support tier source of truth is `.opencode/reference/capability-matrix.json`; README `supported now` language must stay aligned with `.opencode/reference/support-policy.md` and `.opencode/reference/workflow-catalog.md`.

| Reference | Use it for |
| --- | --- |
| `.opencode/reference/support-policy.md` | Support tiers and public claim rules. |
| `.opencode/reference/workflow-catalog.md` | The four validated flagship workflows. |
| `.opencode/reference/opencode-compatibility-model.md` | Native OpenCode baseline and `oh-my-openagent` enhanced behavior boundary. |
| `.opencode/reference/capability-matrix.json` | Machine readable support levels for validated, guided, and planned surfaces. |
| `.opencode/reference/workspace-model.md` | Repo root execution and `workspace/{project-name}-{domain}` placement. |
| `.opencode/reference/project-setup-policy.md` | Preference for refining existing projects before greenfield creation. |
| `.opencode/reference/web-3d-support-model.md` | Browser 3D ownership and support tier boundaries. |
| `CHANGELOG.md` | Released changes and historical validation notes. |
| `VERSION` | Current toolkit version. |

Report bugs or documentation gaps as GitHub issues with a small reproduction, affected file, and expected outcome. Keep issue reports free of secrets, private URLs, tokens, and sensitive customer data.

Security reporting: there is no dedicated `SECURITY.md` in this repo right now. If GitHub Security Advisories are enabled, use them for private vulnerability reports. Otherwise, open a minimal public issue asking the maintainers to provide a private channel, and do not include exploit details, credentials, or private data in that issue.

Support is community maintenance for this public bundle. Funding links do not create paid support, response commitments, or validation boundary changes.

## Support the project

If this bundle saves you time or helps your team get oriented faster, you can help fund continued maintenance and documentation work here:

[![Support via Stripe](https://img.shields.io/badge/support%20this%20project-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/bJe8wQbkobMt4Am6IqaZi00)
[![Sponsor maintenance](https://img.shields.io/badge/sponsor%20maintenance-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/8x25kE9cgaIpc2O8QyaZi01)

These links are for optional funding only. They are not paid support, they do not change workflow validation, and they do not change the support-policy boundaries described in this repo.

## Attribution

`oh-my-openagent-toolkit` is maintained by Nuvreon Corp as a companion bundle built on top of `oh-my-openagent`, with Impeccable v3.1.1 included as a local design aid through the consolidated upstream skill and compatibility wrappers.

## License

The toolkit repository is licensed under the MIT License. See [`LICENSE`](LICENSE) for the root license text.

Vendored upstream components keep their own notices and license files. Impeccable v3.1.1 is carried under `.opencode/skills/impeccable/`, and its upstream Apache 2.0 license remains in `.opencode/skills/impeccable/LICENSE`. The root MIT license for this toolkit does not replace that vendored attribution or the Apache license terms that travel with Impeccable.
