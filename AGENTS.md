# AGENTS Guide

From the repo root, this bundle keeps local routing thin. The local layer classifies incoming work, points to the right expert packs, suggests a harness category, and names the built-in helpers that fit the job. It does not own planning, task state, release flow, or any other control plane behavior. Support tiers and public-claim boundaries live in the manifest, support policy, and workflow catalog rather than in this routing guide, so nothing here should be read as saying every routed surface is equally validated.

## Local routing surfaces

1. `.opencode/commands/route-domain.md` is the only local command surface.
2. `.opencode/reference/routing-matrix.md` is the source of truth for request shapes, pack selection, harness category choice, built-in helpers, UI refinement layering, and compact workspace-rule reminders. It is a routing table, not a support-tier inventory.
3. `.opencode/reference/workspace-model.md` is the authoritative explanation of the bundle-wide workspace convention.

## Support-governance references

1. `.opencode/reference/capability-matrix.json` is the machine-readable source of truth for `validated`, `guided`, and `planned` support tiers.
2. `.opencode/reference/support-policy.md` defines the README public-claim rule.
3. `.opencode/reference/workflow-catalog.md` lists the only current `validated` workflows.

## How to route work here

1. Classify the request into one of six buckets only.
2. Pick the matching local expert pack or pack pair for routing, then rely on the manifest if you need the current support tier.
3. Start with the preferred harness category for the request.
4. Add built-in helpers only when the matrix says they fit.
5. For UI work, route through `frontend-web` or `mobile-app` first, then layer the right `impeccable` skills explicitly when the task needs anti-slop review or refinement. Browser-3D work stays under `frontend-web` as guided coverage, with `systems-rust` used only for measured WASM or performance escalation and `qa-validation` used for verification support.
6. For new greenfield work started from this repo or worktree root, default outputs to `workspace/{project-name}-{domain}`. Existing projects stay in place.
7. Keep routing and support claims separate: a pack can be routable as `guided` coverage, or even named in `planned` expansion docs, without being part of the current `supported now` surface. XR and CAD browser-3D adjacencies stay planned only and are not current validated claims.

## Six routing buckets

| Bucket | Local focus |
| --- | --- |
| architecture/integration | Cross-stack design, API contracts, service boundaries, system shape |
| web/mobile UI | Browser UI, design systems, frontend polish, native app UX |
| backend/API | Service logic, endpoints, auth flows, integrations, server-side delivery |
| systems/performance | Native code, concurrency, profiling, runtime efficiency, low-level reliability |
| data/security | Data platforms, storage, ML systems, threat modeling, hardening, compliance |
| QA/deployment | Validation, release readiness, test coverage, rollout, ops handoff |

## Built-in helper defaults

| Helper | Use it when |
| --- | --- |
| Prometheus | The request needs a plan or a clean execution breakdown before implementation starts |
| Oracle | You need a strong second pass on architecture, quality, or security decisions |
| Librarian | The work depends on repo context, docs lookup, or source-of-truth gathering |
| Explore | You need fast codebase discovery or pattern hunting before editing |
| review-work | The implementation is substantial and needs a final review sweep |
| frontend-ui-ux | UI work needs stronger product, layout, or interaction judgment |
| git-master | The task includes commit history, blame, branch hygiene, or other git-heavy work |

## UI refinement rule

Route `web/mobile UI` requests through `frontend-web` or `mobile-app` first. Browser-3D stays in that same routing lane under `frontend-web`, not as a separate top-level bucket. Bring in `systems-rust` only when profiling or runtime evidence shows a browser-WASM or performance bottleneck, and bring in `qa-validation` when the work needs browser-3D verification coverage. Then add the local `impeccable` family on purpose, not by implication:

1. `impeccable` for the umbrella anti-slop pass.
2. `audit` for flaw finding and cleanup targets.
3. `critique` for sharper product and UX feedback.
4. `polish` for finishing passes.
5. `typeset` for typography and spacing.
6. `colorize` for palette and contrast work.
7. `adapt` for platform or style translation.

The broader local `impeccable` family also includes targeted refinement skills such as `animate`, `arrange`, `bolder`, `clarify`, `delight`, `distill`, `extract`, `harden`, `normalize`, `onboard`, `optimize`, `overdrive`, `quieter`, and `shape`. Deprecated wrappers `frontend-design` and `teach-impeccable` stay included for completeness, but they are not primary routing choices.

Read the routing matrix before picking combinations. For the detailed workspace convention, read `.opencode/reference/workspace-model.md`. For the current validated workflow inventory, read `.opencode/reference/workflow-catalog.md`. If a request spans multiple buckets, start with the dominant one and add the nearest adjacent pack instead of inventing a local orchestration loop. If the task needs a public support statement, check the manifest before claiming more than guided coverage.
