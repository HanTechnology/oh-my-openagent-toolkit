# Routing Matrix

From the repo root, this matrix is the sole normative local routing/helper source for `oh-my-openagent-toolkit`. It is intentionally stateless. It classifies request shape, maps the work to local expert packs, suggests a recommended starting category, centralizes built-in helper discovery for the optional upstream helpers that can strengthen execution, and carries compact reminders for the bundle-wide workspace convention. Other local routing summaries should defer to this file. The subordinate sidecar `.opencode/reference/routing-signals.json` may mirror stable anchors from this matrix for machine-readable lookup, but it remains subordinate to this file. It does not own planning, release flow, task lifecycle, helper ownership, or support-tier policy, and it should not be read as saying every routed surface is equally validated.

## Routing rules

1. Use the six fixed buckets only.
2. Choose the dominant bucket first.
3. Add one adjacent local pack when cross-domain work is real, not speculative.
4. Treat the recommended starting category as the first harness lane to try, not as a hard selector or permanent lock.
5. Prefer harness built-ins for planning, review, research, git work, and UI critique instead of recreating those roles locally.
6. Route UI implementation through `frontend-web` or `mobile-app` first, start that lane with `visual-engineering`, and add the right `impeccable` skills explicitly only for supplementary refinement work. Browser-3D work stays under `frontend-web` as guided coverage.
7. Keep the broader local `impeccable` family supplementary to the expert-pack layer. Deprecated wrappers stay included but non-primary.
8. For new greenfield work started from this repo or worktree root, default outputs to `workspace/{project-name}-{domain}`. Existing projects stay in place.
9. For CLI-capable setup or bootstrap work, prefer updating or modernizing an existing project in place and reserve direct `create` / `init` / `new` flows for explicit greenfield asks. Use `.opencode/reference/project-setup-policy.md` for the narrow setup-preference details without replacing this matrix as the routing/helper authority or `.opencode/reference/workspace-model.md` as the placement authority.
10. Treat the workspace rule as documentation-backed bundle guidance, not as a native runtime routing feature.
11. Treat routing buckets and support tiers as separate layers: routing stays thin here, while `validated`, `guided`, and `planned` claims live in `capability-matrix.json`, `support-policy.md`, and `workflow-catalog.md`. Browser-3D is routed as guided coverage, not as a validated bucket or standalone workflow surface.
12. Keep reference path style explicit: shared cross-bundle references use repo-root-relative `.opencode/...` paths, while same-pack overlays use local `reference/...` paths.

## How to read this matrix

- `bucket`: the six fixed request-shape buckets used for first-pass classification.
- `routing pack(s)`: the primary local expert pack route, plus at most one adjacent pack when the work genuinely crosses domains.
- `recommended starting category`: the first harness lane to try for the request; escalate only when scope, coordination, or risk justifies it.
- `relevant built-in skills`: optional helpers that strengthen execution without replacing the local pack route.
- `support status`: not declared by this matrix. Current `validated`, `guided`, and `planned` authority stays in `.opencode/reference/capability-matrix.json`, `.opencode/reference/support-policy.md`, and `.opencode/reference/workflow-catalog.md`.

## Harness category notes

| Category | Routing note |
| --- | --- |
| `visual-engineering` | Preferred starting category for web/mobile UI, browser-facing interaction work, and visual refinement requests. |
| `quick` | Recommended starting lane for bounded implementation, focused validation, and evidence capture when scope and coordination stay light. |
| `deep` | Escalation lane for cross-boundary, high-risk, investigation-heavy, or multi-system work that needs more planning and review. |
| `writing` | Use when authored prose, docs, or messaging is the dominant output instead of implementation-heavy code work. Common triggers: release notes, upgrade guides, ADR prose, or customer-facing change summaries. |
| `ultrabrain` | Reserve for unusually ambiguous or research-heavy work that needs deeper synthesis before implementation. Common triggers: conflicting source-of-truth inputs, option memos, or unclear execution paths that need synthesis before editing. |
| `unspecified-low` / `unspecified-high` | Fallback-only categories when no better named lane fits. Do not treat `unspecified-low` or `unspecified-high` as preferred defaults in this matrix. |

## Support-tier reminder

1. The pack names in this matrix are routing choices first.
2. Current public `supported now` claims belong only to the manifest entries marked `validated`.
3. Most pack and overlay coverage listed here is current `guided` coverage. That includes browser-3D work routed through `frontend-web`, with `systems-rust` used only for measured WASM or performance escalation and `qa-validation` used for verification support.
4. Named future surfaces may still exist as `planned` manifest entries without becoming present-tense support claims. XR and CAD browser-3D adjacencies remain in that planned category.

## Bucket matrix and planned adjacent row triggers

| Bucket | Typical request shapes | Routing pack(s) | recommended starting category | Relevant built-in skills | When to use built-in agents and helpers | Impeccable layering | Workspace convention |
| --- | --- | --- | --- | --- | --- | --- | --- |
<a id="ZY"></a>
| architecture/integration | Architecture reviews, API contract design, cross-service coordination, integration strategy, boundary cleanup, ADR or option-memo authoring | `architecture-integration`; consider the planned adjacent pack `developer-experience` as a non-primary companion when contributor onboarding, local env ergonomics, workspace friction, or review/process flow is central to the integration decision | `deep`; ADR, option memo, or strategy write-up deliverable -> `writing`; ambiguous, research-heavy, option-heavy synthesis -> `ultrabrain` | `review-work` | Use `Prometheus` to frame multi-step architecture work. Use `Oracle` for architecture or security challenge passes. Use `Librarian` or `Explore` for repo discovery before decisions. If the main output is ADR prose, an option memo, or contributor/process strategy, keep the route here but shift the starting lane to `writing`. Escalate further to `ultrabrain` only when ambiguity, conflicting source-of-truth inputs, or multi-option research is the real blocker rather than ordinary depth. Use `git-master` only if history explains the integration boundary. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
<a id="NV"></a>
| web/mobile UI | Web app UI, design system work, mobile UX, interaction flow cleanup, screen-level implementation, visual refinement, browser-3D implementation in the browser runtime | `frontend-web`, `mobile-app` | `visual-engineering` | `frontend-ui-ux`, `agent-browser`, `dev-browser`, `review-work` | Keep `frontend-web` or `mobile-app` as the primary implementation route and start the harness lane with `visual-engineering`. Use `frontend-web` as the first route for browser-3D work. Add `systems-rust` only when profiling or runtime evidence shows a measured WASM or performance bottleneck. Add `qa-validation` when the work needs browser-3D verification depth. Use `agent-browser` or `dev-browser` as optional upstream helpers when the task needs live browser execution, screenshots, snapshots, or browser evidence capture. Use `frontend-ui-ux` when the ask needs product or interaction judgment. Use `Prometheus` for broad UI initiatives. Use `Oracle` for accessibility, quality, or product critique. Use `Explore` to inspect existing patterns. Use `review-work` after significant implementation. XR and CAD adjacencies stay planned, not validated. | Keep `impeccable` supplementary only. Add `impeccable` for the umbrella anti-slop pass, then targeted refinement skills such as `audit`, `critique`, `polish`, `typeset`, `colorize`, `adapt`, `animate`, `arrange`, `clarify`, or `shape` when they fit. When a routed UI request asks for a specific feel, discover DESIGN.md support through `.opencode/reference/design-md-selection-protocol.md` and `.opencode/reference/design-md-catalog.md`; use the project root `DESIGN.md` and existing design system before catalog examples, then use external DESIGN.md references only for visual-language inspiration and token/pattern extraction; do not add a `design-md` route or helper. Keep deprecated wrappers included but non-primary. | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
<a id="SJ"></a>
| backend/API | Endpoint design, service refactors, auth flows, backend integrations, API hardening, server-side feature delivery | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | `quick`; public-contract redesign, auth-model change, or multi-service boundary work -> `deep`; OpenAPI refresh, SDK snippet/reference-doc work, or upgrade-note-heavy delivery -> `writing` | `review-work` | Start in `quick` for normal service delivery. Escalate to `deep` when the work involves public-contract redesign, auth-model change, or multi-service boundary work. When OpenAPI-driven references, generated SDK snippets, API upgrade notes, or reference-doc refreshes are part of the deliverable, consider the planned adjacent pack `documentation-sdk` as a non-primary companion. If the dominant deliverable is contract-backed documentation, SDK snippets, or upgrade-note prose, keep the route with the owning backend pack and shift the starting lane to `writing`. Use `Prometheus` for larger service work. Use `Oracle` for API, auth, or boundary validation. Use `Context7` for official framework or library documentation details, and use `Librarian` for broader source-of-truth lookup. Use `Explore` to inspect service patterns already in the repo. Use `git-master` when blame or history matters for compatibility decisions. <!-- Retired validator marker: Start in `unspecified-high` for normal service delivery. --> | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
<a id="QZ"></a>
| systems/performance | Rust systems work, C or C++ changes, runtime profiling, concurrency fixes, throughput work, native integration, low-level debugging | `systems-rust`, `systems-c-cpp`, `functional-platform`, `php-ruby-platform` | `deep` | `review-work` | Use `Prometheus` when the work spans profiling, design, and verification. Use `Oracle` for performance and correctness review. Use `Explore` to trace hot paths and surrounding code. Use `Librarian` for narrow runtime or toolchain lookup. Use `git-master` for regressions rooted in prior changes. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
<a id="RQ"></a>
| data/security | Database design, migrations, storage tuning, ML platform work, threat modeling, security reviews, compliance-sensitive implementation | `data-ml-platform`, `database-engineering`, `security-engineering` | `deep` | `review-work` | Use `Prometheus` for high-risk change planning. Use `Oracle` for security, correctness, and architecture scrutiny. Use `Context7` for official framework, library, or serving-format references, and use `Librarian` for broader standards or source-of-truth lookup. Use `Explore` for schema, query, and call-site discovery. Use `git-master` for security regressions or migration history. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
<a id="HJ"></a>
| QA/deployment | Test strategy, verification sweeps, release prep, deployment docs, rollback planning, infra delivery, CI or rollout work | `qa-validation`, `devops-platform`; consider the planned adjacent pack `release-engineering` as a non-primary companion when versioning, changelog/publication flow, promotion framing, or rollback communication is central | bounded validation/evidence -> `quick`; release/platform/risk-heavy -> `deep`; changelog, release-note, rollback-message, or operator-facing release guidance -> `writing` | `review-work`, `git-master`, `agent-browser`, `dev-browser` | Keep bounded validation, evidence capture, and finish-pass checks in the lighter `quick` lane. Escalate to `deep` when the work centers on release orchestration, platform changes, rollback posture, environment risk, or other higher-risk deployment concerns. If the main deliverable is changelog prose, release notes, rollback communication, or operator-facing release guidance, keep the bucket here and shift the starting lane to `writing`. Use `Prometheus` when release prep needs a structured plan. Use `Oracle` for risk review before deployment. Use `Explore` to locate tests, pipelines, and environment docs. Use `agent-browser` or `dev-browser` as optional upstream helpers for live browser execution, accessibility snapshots, screenshots, or browser evidence capture when verification depends on it. Use `Context7` for official platform, registry, or deployment-tool reference detail, and use `Librarian` for broader standards or source-of-truth lookup. Use `git-master` for branch, commit, and release-history tasks. Use `review-work` after substantial implementation or validation changes. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |

## Cross-bucket pairing guide

| If the request spans | Start here | Add this adjacent pack when needed |
| --- | --- | --- |
| architecture/integration + backend/API | `architecture-integration` | One backend pack that matches the runtime |
| architecture/integration + web/mobile UI | `architecture-integration` | `frontend-web` or `mobile-app` |
| web/mobile UI + backend/API | `frontend-web` or `mobile-app` | One backend pack for contract or endpoint work |
| web/mobile UI + systems/performance | `frontend-web` or `mobile-app` | `systems-rust` only when measured browser-WASM or performance escalation is real |
| web/mobile UI + QA/deployment | `frontend-web` or `mobile-app` | `qa-validation` for browser-3D verification or release evidence |
| backend/API + data/security | The backend pack that owns the service | `database-engineering` or `security-engineering` |
| systems/performance + backend/API | `systems-rust` or `systems-c-cpp` | The backend pack that owns the service edge |
| QA/deployment + any other bucket | The implementation bucket | `qa-validation` or `devops-platform` for the finish pass |

## worked example routes and planned adjacent triggers

| worked example | Start here | Route | recommended starting category | Why this route fits |
| --- | --- | --- | --- | --- |
| Refresh OpenAPI docs, SDK snippets, and breaking-change release notes after a contract update | `backend/API` | The owning backend pack plus the planned adjacent pack `documentation-sdk` | `writing` | The contract-owning backend route stays primary, while `documentation-sdk` is the bounded planned adjacent pack for OpenAPI-driven references, generated snippets, and upgrade-note prose. |
| Improve contributor onboarding, local env ergonomics, and monorepo setup guidance | `architecture/integration` | `architecture-integration` plus the planned adjacent pack `developer-experience` | `writing` | The work is primarily contributor-facing workflow and setup guidance, so the architecture route stays primary while `developer-experience` is the planned adjacent pack for onboarding and inner-loop friction. |
| Sort out an ambiguous next-quarter auth, CI, and docs strategy before choosing an implementation lane | `architecture/integration` | `architecture-integration` first; add an adjacent pack only after the dominant follow-on surface is clearer | `ultrabrain` | The blocker is ambiguous, cross-domain synthesis rather than straightforward implementation depth, so `ultrabrain` is the bounded escalation lane for the option memo before concrete pack work starts. |
| Plan a rollback-safe release with changelog, publication, and public-impact notes | `QA/deployment` | `devops-platform` plus the planned adjacent pack `release-engineering` | `writing` | The release path still routes through QA/deployment, but the dominant output is rollback-safe changelog, publication, and release communication guidance, so `release-engineering` stays planned, adjacent, and non-primary. |

## Supplementary local orientation skill

`compass` is a supplementary local orientation skill. It may be used before implementation when the blocker is unclear direction, option framing, or choosing the next route, skill, helper, or plan-agent step.

`compass` is not a primary route.

The six fixed buckets remain the only first-pass routing buckets. This guidance does not add a seventh bucket, does not replace matrix routing, does not replace Prometheus, Oracle, or review-work, and does not create support status.

## Built-in helper notes

Use this table as the compact discovery index for the optional upstream helpers named throughout the matrix. These helpers strengthen execution, but they do not replace the primary local pack route.

| Helper | Routing note |
| --- | --- |
| Prometheus | Use for planning or execution breakdowns that benefit from a clearer start point. |
| Oracle | Use when the request needs a tougher review pass on quality, architecture, or security. |
| Librarian | Use for documentation, source-of-truth lookup, and context gathering. |
| Context7 | Use when framework or library questions need official reference material, API examples, or source-backed documentation details. |
| Explore | Use for fast repo discovery and local pattern hunting before editing. |
| agent-browser | Optional upstream helper for live browser execution, screenshots, DOM inspection, and browser evidence capture during UI or QA work. |
| dev-browser | Optional upstream helper for persistent browser sessions, local app inspection, and repeated browser evidence capture during UI or QA work. |
| review-work | Use after substantial implementation work that needs a final verification sweep. |
| frontend-ui-ux | Use on UI-heavy work that needs stronger product, layout, or interaction judgment. |
| git-master | Use when git history, branch hygiene, or commit investigation is part of the request. |

## Planned adjacent-pack appendix

These packs are explicitly tiered as `planned` adjacent references. The bucket rows above are the first place to surface them in flow, while this appendix stays the compact lookup after the dominant bucket and primary pack are already chosen. They are not primary routes and they are not present-tense support claims.

| Planned adjacent pack | Tier | Bounded trigger | Reference path |
| --- | --- | --- | --- |
| `documentation-sdk` | `planned` adjacent pack | API or SDK docs, OpenAPI-driven references, generated examples, or release-adjacent documentation updates | `.opencode/reference/capability-matrix.json` planned adjacent entry plus the matching adjacent `SKILL.md` under `.opencode/skills/` |
| `developer-experience` | `planned` adjacent pack | Onboarding, local setup contracts, package-manager or workspace ergonomics, or contributor inner-loop friction | `.opencode/reference/capability-matrix.json` planned adjacent entry plus the matching adjacent `SKILL.md` under `.opencode/skills/` |
| `release-engineering` | `planned` adjacent pack | Versioning, changelog or publication flow, promotion framing, or rollback planning for shipped artifacts | `.opencode/reference/capability-matrix.json` planned adjacent entry plus the matching adjacent `SKILL.md` under `.opencode/skills/` |

For the detailed workspace convention and non-goals, read `.opencode/reference/workspace-model.md`. For current support-tier and validated-workflow boundaries, read `.opencode/reference/capability-matrix.json`, `.opencode/reference/support-policy.md`, and `.opencode/reference/workflow-catalog.md`. Use this matrix to route the work, not to widen the validated surface.
