# Routing Matrix

This matrix is the phase-1 routing source of truth for `agentic-dev-ai-team`. It is intentionally stateless. It classifies request shape, maps the work to local expert packs, suggests a preferred harness category, and names built-in helpers that can strengthen execution. It does not own planning, release flow, or task lifecycle.

## Routing rules

1. Use the six fixed buckets only.
2. Choose the dominant bucket first.
3. Add one adjacent local pack when cross-domain work is real, not speculative.
4. Prefer harness built-ins for planning, review, research, git work, and UI critique instead of recreating those roles locally.
5. Route the curated `impeccable` imports explicitly for UI anti-slop work.

## Bucket matrix

| Bucket | Typical request shapes | Local skill(s) | Preferred harness category | Relevant built-in skills | When to use built-in agents and helpers | Impeccable layering |
| --- | --- | --- | --- | --- | --- | --- |
| architecture/integration | Architecture reviews, API contract design, cross-service coordination, integration strategy, boundary cleanup | `architecture-integration` | `deep` | `review-work` | Use `Prometheus` to frame multi-step architecture work. Use `Oracle` for architecture or security challenge passes. Use `Librarian` or `Explore` for repo discovery before decisions. Use `git-master` only if history explains the integration boundary. | `none` |
| web/mobile UI | Web app UI, design system work, mobile UX, interaction flow cleanup, screen-level implementation, visual refinement | `frontend-web`, `mobile-app` | `unspecified-high` | `frontend-ui-ux`, `review-work` | Use `frontend-ui-ux` when the ask needs product or interaction judgment. Use `Prometheus` for broad UI initiatives. Use `Oracle` for accessibility, quality, or product critique. Use `Explore` to inspect existing patterns. Use `review-work` after significant implementation. | Start with `impeccable` for the umbrella anti-slop pass. Add `audit` for flaw detection, `critique` for sharper UX feedback, `polish` for finishing, `typeset` for typography, `colorize` for palette and contrast, and `adapt` for platform or style translation. |
| backend/API | Endpoint design, service refactors, auth flows, backend integrations, API hardening, server-side feature delivery | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | `deep` | `review-work` | Use `Prometheus` for larger service work. Use `Oracle` for API, auth, or boundary validation. Use `Librarian` for docs-backed framework questions. Use `Explore` to inspect service patterns already in the repo. Use `git-master` when blame or history matters for compatibility decisions. | `none` |
| systems/performance | Rust systems work, C or C++ changes, runtime profiling, concurrency fixes, throughput work, native integration, low-level debugging | `systems-rust`, `systems-c-cpp`, `functional-platform`, `php-ruby-platform` | `deep` | `review-work` | Use `Prometheus` when the work spans profiling, design, and verification. Use `Oracle` for performance and correctness review. Use `Explore` to trace hot paths and surrounding code. Use `Librarian` for narrow runtime or toolchain lookup. Use `git-master` for regressions rooted in prior changes. | `none` |
| data/security | Database design, migrations, storage tuning, ML platform work, threat modeling, security reviews, compliance-sensitive implementation | `data-ml-platform`, `database-engineering`, `security-engineering` | `deep` | `review-work` | Use `Prometheus` for high-risk change planning. Use `Oracle` for security, correctness, and architecture scrutiny. Use `Librarian` for standards or library references. Use `Explore` for schema, query, and call-site discovery. Use `git-master` for security regressions or migration history. | `none` |
| QA/deployment | Test strategy, verification sweeps, release prep, deployment docs, rollback planning, infra delivery, CI or rollout work | `qa-validation`, `devops-platform` | `quick` | `review-work`, `git-master` | Use `Prometheus` when release prep needs a structured plan. Use `Oracle` for risk review before deployment. Use `Explore` to locate tests, pipelines, and environment docs. Use `Librarian` for standards or deployment references. Use `git-master` for branch, commit, and release-history tasks. Use `review-work` after substantial implementation or validation changes. | `none` |

## Cross-bucket pairing guide

| If the request spans | Start here | Add this adjacent pack when needed |
| --- | --- | --- |
| architecture/integration + backend/API | `architecture-integration` | One backend pack that matches the runtime |
| architecture/integration + web/mobile UI | `architecture-integration` | `frontend-web` or `mobile-app` |
| web/mobile UI + backend/API | `frontend-web` or `mobile-app` | One backend pack for contract or endpoint work |
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
