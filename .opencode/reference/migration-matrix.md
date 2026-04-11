# Migration Matrix

This document is the authoritative legacy-to-OpenCode mapping for phase 1 of the `agentic-dev-ai-team` cutover. It freezes the required legacy inventory, the allowed migration classifications, the 17-pack target taxonomy, and the full local-integrated `impeccable` inventory that downstream tasks must follow exactly.

## Locked phase-1 decisions

- Canonical target is project-local `.opencode/` with plural `skills/`, `commands/`, and `reference/` directories.
- Phase 1 has no local custom agents. Orchestration stays with harness built-ins plus thin local routing docs and one routing command.
- `.memory/` is a hard delete. It is not archived, mirrored, or preserved as an active target behavior.
- `.logs/` continuation and audit expectations are also dropped in phase 1 because they exist only to support the legacy `.memory/` runtime.
- The target model is exactly 17 expert packs plus 23 local-integrated `impeccable` skills, for 40 total local skills in the frozen phase-1 core inventory.
- The `impeccable` layer is a vendored-snapshot companion import, supplementary to the 17 expert packs and not a replacement for them.
- Deprecated wrappers `frontend-design` and `teach-impeccable` are included for completeness, but remain non-primary routing choices.
- The live repo currently carries the planned adjacent packs `release-engineering`, `documentation-sdk`, and `developer-experience`, and the manifest models them as `planned` adjacent packs. They remain outside the frozen 17/23/40 phase-1 core and do not change that core count.
- `impeccable-vendor-policy.md` and `workspace-model.md` are part of the authoritative Task 1 governance freeze and should be kept consistent with this matrix.

## Classification legend

- `migrate as skill` — becomes an OpenCode skill/expert pack.
- `migrate as command` — becomes a thin local command surface.
- `migrate as shared asset` — becomes shared reference, QA, design, or authoring material.
- `replace with harness built-in` — do not recreate locally; rely on Oh My OpenCode / OpenCode harness capability.
- `drop` — remove outright from phase 1 target behavior.

## Parsing contract for automated verification

Automated checks should parse only the tables under these headings:

1. `## Legacy surface migration matrix`
2. `## Frozen target expert packs`
3. `## Frozen local impeccable inventory`

In the legacy matrix, root runtime rows begin with `.` and all other rows are relative to `.claude/skills/`.

## Legacy surface migration matrix

| Legacy surface | Legacy role | Classification | Target surface | Notes |
| --- | --- | --- | --- | --- |
| .claude/CLAUDE.md | Claude runtime system guide, orchestration policy, and auto-invocation contract | replace with harness built-in | Harness built-ins, AGENTS.md, route-domain command, routing/reference docs | Keep only durable routing, quality, and cutover guidance. Do not port Claude-specific auto-invocation, lifecycle-state restoration, or memory continuity semantics. |
| .claude/settings.json | Claude hook, permission, and session lifecycle config | replace with harness built-in | Harness runtime behavior and supported local config only where needed later | SessionStart, PreCompact, and UserPromptSubmit hooks are not migrated. Phase 1 forbids recreating local custom-agent hook logic. |
| .memory/ | Stateful continuation and project memory store | drop | None | Hard-delete policy for phase 1. No archive, no compatibility shim, no hidden continuation layer. |
| .logs/ | Historical logging and continuation sidecar expected by the legacy runtime | drop | None | Drop alongside `.memory/`. Legacy expectations include sessions, skills/experts, collaboration, quality, performance, errors, system, archive, backup, and memory-snapshot style logs. |
| pm-orchestrator | Central orchestration persona and lifecycle authority | replace with harness built-in | Harness built-ins plus local routing docs and route-domain command | Explicit decision: `pm-orchestrator` -> harness built-ins + local routing docs/command. No duplicate local orchestrator authority. |
| pm-orchestrator/workflows/ | Workflow corpus for requirements, research, architecture, implementation, integration, deployment, QA, continuous routing, and release management | migrate as shared asset | routing-matrix.md, quality-gates.md, shared reference docs | Source family is 18 markdown files total: 01-09, `release-management.md`, and 8 continuous sub-workflows. Preserve as reference material, not runtime control flow. |
| pm-orchestrator/workflows/08-quality-assurance.md | Canonical QA workflow playbook | migrate as shared asset | quality-gates.md and reference/qa assets | Primary upstream QA reference for gate order, Playwright-only validation expectations, accessibility, security, and performance coverage. |
| project-detector | Project type detection and team routing persona | migrate as command | route-domain command and routing-matrix.md | Explicit decision: `project-detector` -> routing matrix + route command only. No standalone detector persona survives phase 1. |
| memory-manager | Memory and logging persona for session continuity | drop | None | Explicit decision: `memory-manager` -> drop. This row is mandatory for verification and for the negative-path deletion test. |
| memory-manager/logging-system.yaml | `.logs/` topology and retention structure | drop | None | Documents legacy `.logs/` layout: sessions, experts, collaboration, quality, performance, errors, system, archive, backup. Kept only as migration evidence. |
| memory-manager/memory-logging-integration.yaml | Automatic `.memory/` <-> `.logs/` trigger map | drop | None | Legacy integration expects `.memory/` writes to fan out into `.logs/`. Phase 1 intentionally removes the entire mechanism. |
| quality-controller | Quality gate persona and standards authority | migrate as shared asset | quality-gates.md plus qa-validation | Explicit decision: `quality-controller` -> shared quality assets + `qa-validation`. Do not preserve it as a separate runtime controller. |
| quality-controller/quality-standards.json | Structured quality thresholds by project type | migrate as shared asset | quality-gates.md and reference quality assets | Shared source of truth for measurable quality gates, adapted to the harness-native validation model. |
| quality-controller/examples/01-quality-gate-validation.md | Worked example of pre-release gate execution | migrate as shared asset | reference/qa/examples/ | One of the best legacy QA exemplars; keep as a shared example, not as an executable persona artifact. |
| quality-controller/validation-scripts/* | Portable validation utilities and reports | migrate as shared asset | reference/qa/validation assets | Source family includes `verify-skill-consistency.py`, `validate-api-quality.sh`, `validate-mobile-quality.sh`, `validate-aiml-quality.py`, `generate-quality-report.js`, and `validate-web-app-quality.sh`. |
| frontend-nextjs | Next.js and React web UI specialist | migrate as skill | frontend-web | Explicit decision: `frontend-nextjs` -> `frontend-web` with framework overlays. Keep `nextjs` as an overlay inside reference assets instead of a top-level pack. |
| mobile-react-native | React Native mobile specialist | migrate as skill | mobile-app | Explicit decision: `mobile-react-native` -> `mobile-app` with `react-native`, `flutter`, `swiftui`, and `jetpack-compose` overlays in reference material. |
| backend-nestjs | TypeScript / NestJS backend specialist | migrate as skill | backend-node | Explicit decision: `backend-nestjs` -> `backend-node` with `nestjs`, `express`, `fastify`, and `hono` overlays in reference material. |
| backend-fastapi | Async Python / FastAPI backend specialist | migrate as skill | backend-python | Explicit decision: `backend-fastapi` -> `backend-python` with `fastapi`, `django`, and `flask` overlays in reference material. |
| rust-systems | Rust systems, WASM, and native-extension specialist | migrate as skill | systems-rust | Explicit decision: `rust-systems` -> `systems-rust`. |
| database-specialist | Database architecture, migrations, and optimization specialist | migrate as skill | database-engineering | Explicit decision: `database-specialist` -> `database-engineering`. |
| security-specialist | Security architecture and vulnerability specialist | migrate as skill | security-engineering | Explicit decision: `security-specialist` -> `security-engineering`. |
| fullstack-integration | System architecture and integration specialist | migrate as skill | architecture-integration | Consolidates the architecture, API-contract, and cross-boundary guidance into the new architecture pack. |
| systemdev-specialist | AI/ML, CV, GPU, streaming, and specialized systems expert | migrate as skill | data-ml-platform | Explicit decision: `systemdev-specialist` -> `data-ml-platform`. Preserve the broad specialized-systems remit as a language/domain pack, not a one-off persona. |
| devops-deployment | Deployment, CI/CD, and infrastructure specialist | migrate as skill | devops-platform | Explicit decision: `devops-deployment` + release-management patterns -> `devops-platform`. |
| qa-testing | QA execution and Playwright-centered validation specialist | migrate as skill | qa-validation | Explicit decision: `qa-testing` + portable quality enforcement -> `qa-validation`. |
| qa-testing/examples/01-e2e-test-suite.md | Playwright MCP E2E example corpus | migrate as shared asset | reference/qa/examples/ | Preserve as shared QA example material for harness-native validation work. |
| qa-testing/examples/02-accessibility-testing.md | Accessibility QA example corpus | migrate as shared asset | reference/qa/examples/ | Shared accessibility reference for WCAG validation patterns. |
| qa-testing/examples/03-performance-testing.md | Performance QA example corpus | migrate as shared asset | reference/qa/examples/ | Shared performance and measurement reference for QA validation. |
| research-analysis | Strategic research and comparative analysis persona | replace with harness built-in | Harness librarian, Context7, and websearch | Explicit decision: `research-analysis` -> harness `librarian` / `context7` / `websearch`. No standalone local research persona is recreated. |
| mcp-tools-orchestrator | Multi-tool MCP coordination persona | replace with harness built-in | Harness built-in MCP system | Explicit decision: `mcp-tools-orchestrator` -> harness built-in MCP system. |
| SKILL-MANIFEST-SPEC.md | Legacy skill authoring and manifest contract | migrate as shared asset | Shared OpenCode authoring reference | Preserve the useful authoring constraints and frontmatter patterns as shared documentation, adapted to OpenCode surfaces. |
| CONSISTENCY-MATRIX.md | Cross-skill consistency reference | migrate as shared asset | Shared migration and authoring reference | Useful as a normalization aid for downstream pack migration work. |
| ENTERPRISE-STANDARDS.md | Cross-cutting standards reference | migrate as shared asset | Shared quality/design/reference assets | Preserve durable conventions, but remove Claude-specific assumptions. |
| GIT-MANAGEMENT-SYSTEM.md | Repository and release strategy reference | migrate as shared asset | Shared reference assets | Preserve useful repo-strategy guidance as reference only; do not make it a runtime orchestrator dependency. |

## Frozen target expert packs

These are the only top-level expert packs for phase 1. Framework specificity moves into overlays and reference material rather than new top-level packs.

| Expert pack | Primary legacy source(s) | Why it exists in the target taxonomy |
| --- | --- | --- |
| architecture-integration | fullstack-integration | Retains architecture, API-contract, and integration authority as a dedicated cross-stack pack. |
| frontend-web | frontend-nextjs | Generalizes the web UI surface into a framework-overlay model instead of a Next.js-only persona. |
| mobile-app | mobile-react-native | Generalizes mobile work into one pack with multiple framework overlays. |
| backend-node | backend-nestjs | Covers Node backends broadly while keeping NestJS as one overlay among several. |
| backend-python | backend-fastapi | Covers Python backends broadly while keeping FastAPI as one overlay among several. |
| backend-jvm | Coverage gap added explicitly | Added to cover major JVM backends not represented by a legacy Claude pack. |
| backend-dotnet | Coverage gap added explicitly | Added to cover .NET backends not represented by a legacy Claude pack. |
| backend-go | Coverage gap added explicitly | Added to cover Go backends not represented by a legacy Claude pack. |
| systems-rust | rust-systems | Keeps Rust systems and native-extension expertise as a dedicated systems pack. |
| systems-c-cpp | Coverage gap added explicitly | Added to cover C and C++ systems work that the legacy portfolio did not isolate cleanly. |
| functional-platform | Coverage gap added explicitly | Added to cover functional-language platform work absent from the legacy skill roster. |
| php-ruby-platform | Coverage gap added explicitly | Added to cover PHP and Ruby ecosystems absent from the legacy skill roster. |
| data-ml-platform | systemdev-specialist | Converts the broad AI/ML and specialized systems persona into a reusable platform pack. |
| database-engineering | database-specialist | Retains database architecture and performance work as a dedicated engineering pack. |
| security-engineering | security-specialist | Retains security architecture and validation as a dedicated engineering pack. |
| devops-platform | devops-deployment, release-management patterns | Retains deployment, infra, CI/CD, and release operations as a dedicated platform pack. |
| qa-validation | qa-testing, quality-controller assets | Combines QA execution with shared quality assets instead of preserving a separate runtime controller. |

## Frozen local impeccable inventory

These 23 local-integrated `impeccable` skills are the only approved phase-1 `impeccable` inventory. Together with the 17 expert packs above, they freeze the bundle at 40 total local skills. The layer remains supplementary to the 17 expert packs, and the deprecated wrappers stay included for completeness without becoming primary routing choices.

| Impeccable skill | Role in the target bundle | Local status |
| --- | --- | --- |
| impeccable | Umbrella anti-slop UI/UX guidance layer | primary |
| adapt | Style or platform translation | primary |
| animate | Motion and transition refinement | primary |
| arrange | Layout and spatial arrangement refinement | primary |
| audit | Flaw finding and cleanup targeting | primary |
| bolder | Stronger emphasis and hierarchy refinement | primary |
| clarify | Structure, copy, and interaction clarity refinement | primary |
| colorize | Palette and contrast refinement | primary |
| critique | Structured design and product feedback | primary |
| delight | Delight and experiential polish | primary |
| distill | Simplification and reduction to essentials | primary |
| extract | Reusable pattern and primitive extraction | primary |
| frontend-design | Deprecated wrapper kept for compatibility and completeness | deprecated wrapper, included but non-primary |
| harden | Robustness and production-readiness refinement | primary |
| normalize | Consistency normalization across components and flows | primary |
| onboard | Onboarding and first-use flow refinement | primary |
| optimize | Efficiency and optimization-focused refinement | primary |
| overdrive | Higher-intensity transformation pass | primary |
| polish | Finishing and refinement pass | primary |
| quieter | Noise and clutter reduction | primary |
| shape | Structure and form-direction refinement | primary |
| teach-impeccable | Deprecated wrapper kept for compatibility and completeness | deprecated wrapper, included but non-primary |
| typeset | Typography and spacing refinement | primary |

## Notes for downstream tasks

- `README.md` should keep the finished 17 expert packs + 23 local-integrated `impeccable` skills = 40 total local skills phase-1 core explicit, while `AGENTS.md` and the local routing docs should stay aligned with that support-safe model without needing to restate the full inventory count.
- This matrix and `impeccable-vendor-policy.md` remain the authoritative migration/governance freeze for inventory and import-policy questions; treat legacy `.claude/CLAUDE.md` as source-history evidence rather than current-state runtime authority.
- The legacy runtime expects both `.memory/` and `.logs/` to exist together. Phase 1 intentionally preserves neither runtime surface.
- Shared QA/reference source families already confirmed during inventory: `pm-orchestrator/workflows/08-quality-assurance.md`, `quality-controller/examples/01-quality-gate-validation.md`, `quality-controller/validation-scripts/*`, and `qa-testing/examples/*`.
- New top-level packs such as `backend-jvm`, `backend-dotnet`, `backend-go`, `systems-c-cpp`, `functional-platform`, and `php-ruby-platform` are deliberate taxonomy additions to close legacy coverage gaps instead of forcing a naive 1:1 Claude port.
- The live repo currently carries the planned adjacent packs `release-engineering`, `documentation-sdk`, and `developer-experience`. Treat them as manifest-declared planned surfaces outside the frozen 40-skill phase-1 core, not as a silent change to the 17/23/40 freeze.
- The authoritative current-state freeze for the full local `impeccable` import now lives in this matrix plus `impeccable-vendor-policy.md`, and current bundle docs should stay aligned with that finished 17/23/40 state.
- The authoritative workspace convention now lives in `workspace-model.md`: repo root remains the control/execution root, greenfield outputs default to `workspace/{project-name}-{domain}`, existing projects remain in place, and the rule is a documented bundle convention rather than a native runtime feature.
