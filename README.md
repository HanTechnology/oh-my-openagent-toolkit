# Oh My OpenAgent Toolkit

Project-local OpenCode bundle for teams that want a clearer operating layer on top of `oh-my-openagent`, without pretending to be upstream or a second control plane.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license) [![Built on OpenCode](https://img.shields.io/badge/built%20on-OpenCode-5b5bd6.svg)](https://opencode.ai/docs) [![Companion to oh-my-openagent](https://img.shields.io/badge/companion-oh--my--openagent-2d7a46.svg)](https://github.com/code-yeongyu/oh-my-openagent) [![Validated surface: 4 workflows](https://img.shields.io/badge/validated%20surface-4%20workflows-8a3ffc.svg)](#what-it-adds-on-top-of-upstream)

`oh-my-openagent-toolkit` is a project-local OpenCode bundle built on `oh-my-openagent`. It adds thin local routing, support framing, workspace conventions, and the imported `impeccable` design layer so a cloned repo is easier to navigate, operate, and explain.

This repo is a companion to `oh-my-openagent`, not an official upstream distribution and not a replacement for the harness. The skill surface is broad, 43 top-level entrypoints under `.opencode/skills/`, made up of 40 core skill surfaces and 3 planned adjacent packs, but the visible validated surface stays narrow: `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`.

| At a glance | Summary |
| --- | --- |
| Foundation | `oh-my-openagent` provides the harness layer and execution model. |
| Local layer | `oh-my-openagent-toolkit` adds thin routing, support framing, workspace conventions, and the imported `impeccable` design layer. |
| Skill surface | The repo exposes 43 top-level skill entrypoints under `.opencode/skills/`: 40 core skill surfaces plus 3 planned adjacent packs. |
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
| Local skill surface | Adds 43 top-level skill entrypoints across major delivery lanes: 40 core skill surfaces plus 3 planned adjacent packs. That makes the repo feel like a real working system, not a thin demo layer. | `.opencode/skills/` |
| UI refinement layer | Adds the imported `impeccable` family as a supplementary refinement stack for anti-slop review, critique, and polish. | Start with `frontend-web` or `mobile-app`, then layer `impeccable` skills on purpose |

| Skill family | Representative surfaces | Role |
| --- | --- | --- |
| Architecture and integration | `architecture-integration` | Cross-stack design, API contracts, boundaries, and system shape. |
| Web and mobile UI | `frontend-web`, `mobile-app` | Browser UI, design systems, interaction flows, and client delivery. |
| Backend families | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | Service delivery, endpoints, auth flows, and integrations. |
| Systems and performance | `systems-rust`, `systems-c-cpp`, `functional-platform`, `php-ruby-platform` | Runtime efficiency, low-level reliability, concurrency, and performance work. |
| Data and security | `data-ml-platform`, `database-engineering`, `security-engineering` | Data-platform, storage, ML, hardening, and compliance-sensitive work. |
| QA and deployment | `qa-validation`, `devops-platform` | Validation, release readiness, rollout, and operational finish passes. |
| Refinement layer | `impeccable`, `audit`, `critique`, `polish`, `typeset`, `colorize`, `adapt` | UI refinement and anti-slop improvement layered on top of the primary route. |

The current validated workflow surface is intentionally narrow.

| Support surface | What it means here |
| --- | --- |
| `validated` | Eligible for README `supported now` summaries. This currently means only `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`. |
| `guided` | Current pack or overlay coverage with routing and reference support, but no end-to-end validated public claim. |
| `planned` | Named expansion surface reserved for future implementation or later promotion, not a present-tense support claim. |

| `oh-my-openagent` gives you | `oh-my-openagent-toolkit` gives you | Why the combination is stronger |
| --- | --- | --- |
| General-purpose orchestration, delegation, built-in helpers, and the underlying execution model | Six routing buckets, explicit pack-to-problem mapping, domain-specific skill families, and a refinement stack that sharpens UI and documentation quality | The harness stays general-purpose while the bundle stays domain-aware, so the workflow is stronger than either layer alone |

For UI work, route through `frontend-web` or `mobile-app` first, then add the exact `impeccable` skills that fit the task. The same pattern appears across the rest of the bundle: core domain packs handle the main implementation lane, while focused helpers and refinement layers sharpen the outcome instead of replacing the route.

## What this is not

| Not this | Why |
| --- | --- |
| An official upstream distribution | It is a companion bundle built on top of `oh-my-openagent`, not the upstream distribution itself. |
| A replacement for the harness | The harness remains the foundation and built-in helper model this repo relies on. |
| A second runtime or control plane | The routing docs stay thin on purpose and do not create local task authority, release flow, or orchestration ownership. |
| A separate support tier for `impeccable` | `impeccable` is an included design and refinement layer, not a standalone product or support contract. |

Routed surfaces are not automatically validated surfaces, and broader skill coverage should not be described as `supported now` unless the manifest promotes it to `validated`.

## Quick start

Set this up in the same order the stack is built:

1. Install [OpenCode](https://opencode.ai/docs).
2. Set up [`oh-my-openagent`](https://raw.githubusercontent.com/code-yeongyu/oh-my-openagent/refs/heads/dev/docs/guide/installation.md).
3. Clone this bundle and work from the repo root.

```sh
git clone <repo-url>
cd oh-my-openagent-toolkit
```

Once you are in this repo, read the local docs in this order:

| Step | Read | Why |
| --- | --- | --- |
| 1 | `README.md` | Bundle overview, boundary, and upstream context |
| 2 | `AGENTS.md` | Top-level local reading order and bundle boundaries |
| 3 | `.opencode/reference/routing-matrix.md` | Authoritative local routing and helper map |
| 4 | `.opencode/reference/support-policy.md` and `.opencode/reference/workflow-catalog.md` | Support boundary and the current validated workflow inventory |
| 5 | `.opencode/reference/workspace-model.md` | Repo-root workspace conventions and the `workspace/{project-name}-{domain}` default for new greenfield outputs |

That sequence keeps the layers clear: OpenCode is the foundation, `oh-my-openagent` sets up the harness, and this bundle adds local routing, support framing, and workspace conventions from the repo root. For first-pass orientation inside the repo, follow `README.md` -> `AGENTS.md` -> `routing-matrix.md` -> `support-policy.md` and `workflow-catalog.md` -> `workspace-model.md`.

## Acknowledgements

| Upstream | Role in this repo |
| --- | --- |
| `oh-my-openagent` | Harness foundation, orchestration model, and built-in helper layer |
| `impeccable` | Imported local refinement family for UI work |

This bundle is built as a companion to `oh-my-openagent`, which provides the harness foundation and built-in helper model it relies on. The repo does not replace that upstream foundation, and it does not claim official endorsement or official-distribution status.

It also includes an imported `impeccable` design layer as a local refinement family for UI work. That layer is acknowledged here as an upstream design influence and bundled asset, not as a claim that this repo is the canonical home for it.

If you are publishing or sharing this repo, that is the right way to describe it: a companion bundle with a clearer local operating model, a broad but well-routed skill surface, explicit support boundaries, and a stronger documentation surface built on top of upstream foundations.

## Support the project

If this bundle saves you time or helps your team get oriented faster, you can help fund continued maintenance and documentation work here:

[![Support via Stripe](https://img.shields.io/badge/support%20this%20project-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/bJe8wQbkobMt4Am6IqaZi00)
[![Sponsor maintenance](https://img.shields.io/badge/sponsor%20maintenance-Stripe-635bff?style=for-the-badge&logo=stripe&logoColor=white)](https://buy.stripe.com/8x25kE9cgaIpc2O8QyaZi01)

These links are for optional funding only. They are not a paid support tier, they do not expand the validated workflow surface, and they do not change the support-policy boundaries described in this repo.

## Attribution

`oh-my-openagent-toolkit` is maintained by Nuvreon Corp as a companion bundle built on top of `oh-my-openagent`, with the imported `impeccable` refinement layer included as a local design aid.

## License

This repository is available under the MIT License. See the repository license text when distributed with the bundle, and keep this README wording as the visible OSS license notice for this local copy.
