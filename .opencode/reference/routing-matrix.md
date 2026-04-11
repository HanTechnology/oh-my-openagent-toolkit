# Routing Matrix

This matrix is the routing source of truth for `agentic-dev-ai-team`. It is intentionally stateless. It classifies request shape, maps the work to local expert packs, suggests a preferred harness category, names built-in helpers that can strengthen execution, and carries compact reminders for the bundle-wide workspace convention. It does not own planning, release flow, task lifecycle, or support-tier policy, and it should not be read as saying every routed surface is equally validated.

## Routing rules

1. Use the six fixed buckets only.
2. Choose the dominant bucket first.
3. Add one adjacent local pack when cross-domain work is real, not speculative.
4. Prefer harness built-ins for planning, review, research, git work, and UI critique instead of recreating those roles locally.
5. Route UI implementation through `frontend-web` or `mobile-app` first, then add the right `impeccable` skills explicitly for refinement work. Browser-3D work stays under `frontend-web` as guided coverage.
6. Keep the broader local `impeccable` family supplementary to the expert-pack layer. Deprecated wrappers stay included but non-primary.
7. For new greenfield work, default outputs to `workspace/{project-name}-{domain}` inside the active repo or worktree. Existing projects stay in place.
8. Treat the workspace rule as documentation-backed bundle guidance, not as a native runtime routing feature.
9. Treat routing buckets and support tiers as separate layers: routing stays thin here, while `validated`, `guided`, and `planned` claims live in `capability-matrix.json`, `support-policy.md`, and `workflow-catalog.md`. Browser-3D is routed as guided coverage, not as a validated bucket or standalone workflow surface.

## Support-tier reminder

1. The pack names in this matrix are routing choices first.
2. Current public `supported now` claims belong only to the manifest entries marked `validated`.
3. Most pack and overlay coverage listed here is current `guided` coverage. That includes browser-3D work routed through `frontend-web`, with `systems-rust` used only for measured WASM or performance escalation and `qa-validation` used for verification support.
4. Named future surfaces may still exist as `planned` manifest entries without becoming present-tense support claims. XR and CAD browser-3D adjacencies remain in that planned category.

## Bucket matrix

| Bucket | Typical request shapes | Routing pack(s) | Preferred harness category | Relevant built-in skills | When to use built-in agents and helpers | Impeccable layering | Workspace convention |
| --- | --- | --- | --- | --- | --- | --- | --- |
| architecture/integration | Architecture reviews, API contract design, cross-service coordination, integration strategy, boundary cleanup | `architecture-integration` | `deep` | `review-work` | Use `Prometheus` to frame multi-step architecture work. Use `Oracle` for architecture or security challenge passes. Use `Librarian` or `Explore` for repo discovery before decisions. Use `git-master` only if history explains the integration boundary. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
| web/mobile UI | Web app UI, design system work, mobile UX, interaction flow cleanup, screen-level implementation, visual refinement, browser-3D implementation in the browser runtime | `frontend-web`, `mobile-app` | `unspecified-high` | `frontend-ui-ux`, `review-work` | Use `frontend-web` as the first route for browser-3D work. Add `systems-rust` only when profiling or runtime evidence shows a measured WASM or performance bottleneck. Add `qa-validation` when the work needs browser-3D verification depth. Use `frontend-ui-ux` when the ask needs product or interaction judgment. Use `Prometheus` for broad UI initiatives. Use `Oracle` for accessibility, quality, or product critique. Use `Explore` to inspect existing patterns. Use `review-work` after significant implementation. XR and CAD adjacencies stay planned, not validated. | Start with `impeccable` for the umbrella anti-slop pass. Add targeted refinement skills such as `audit`, `critique`, `polish`, `typeset`, `colorize`, `adapt`, `animate`, `arrange`, `clarify`, or `shape` when they fit. Keep deprecated wrappers included but non-primary. | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
| backend/API | Endpoint design, service refactors, auth flows, backend integrations, API hardening, server-side feature delivery | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | `deep` | `review-work` | Use `Prometheus` for larger service work. Use `Oracle` for API, auth, or boundary validation. Use `Librarian` for docs-backed framework questions. Use `Explore` to inspect service patterns already in the repo. Use `git-master` when blame or history matters for compatibility decisions. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
| systems/performance | Rust systems work, C or C++ changes, runtime profiling, concurrency fixes, throughput work, native integration, low-level debugging | `systems-rust`, `systems-c-cpp`, `functional-platform`, `php-ruby-platform` | `deep` | `review-work` | Use `Prometheus` when the work spans profiling, design, and verification. Use `Oracle` for performance and correctness review. Use `Explore` to trace hot paths and surrounding code. Use `Librarian` for narrow runtime or toolchain lookup. Use `git-master` for regressions rooted in prior changes. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
| data/security | Database design, migrations, storage tuning, ML platform work, threat modeling, security reviews, compliance-sensitive implementation | `data-ml-platform`, `database-engineering`, `security-engineering` | `deep` | `review-work` | Use `Prometheus` for high-risk change planning. Use `Oracle` for security, correctness, and architecture scrutiny. Use `Librarian` for standards or library references. Use `Explore` for schema, query, and call-site discovery. Use `git-master` for security regressions or migration history. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |
| QA/deployment | Test strategy, verification sweeps, release prep, deployment docs, rollback planning, infra delivery, CI or rollout work | `qa-validation`, `devops-platform` | `quick` | `review-work`, `git-master` | Use `Prometheus` when release prep needs a structured plan. Use `Oracle` for risk review before deployment. Use `Explore` to locate tests, pipelines, and environment docs. Use `Librarian` for standards or deployment references. Use `git-master` for branch, commit, and release-history tasks. Use `review-work` after substantial implementation or validation changes. | `none` | Existing project in place, or greenfield -> `workspace/{project-name}-{domain}` |

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

## Built-in helper notes

| Helper | Routing note |
| --- | --- |
| Prometheus | Use for planning or execution breakdowns that benefit from a clearer start point. |
| Oracle | Use when the request needs a tougher review pass on quality, architecture, or security. |
| Librarian | Use for documentation, source-of-truth lookup, and context gathering. |
| Explore | Use for fast repo discovery and local pattern hunting before editing. |
| review-work | Use after substantial implementation work that needs a final verification sweep. |
| frontend-ui-ux | Use on UI-heavy work that needs stronger product, layout, or interaction judgment. |
| git-master | Use when git history, branch hygiene, or commit investigation is part of the request. |

For the detailed workspace convention and non-goals, read `workspace-model.md`. For current support-tier and validated-workflow boundaries, read `capability-matrix.json`, `support-policy.md`, and `workflow-catalog.md`. Use this matrix to route the work, not to widen the validated surface.
