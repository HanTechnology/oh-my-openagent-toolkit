Task 8 README/routing/changelog contract evidence
Working directory: /home/hans/dev/AI/dev-ai-agent-team-upgrade/oh-my-openagent-toolkit

$ rg -n "45 top-level|42 core|3 planned adjacent|service-vernacular" README.md CHANGELOG.md .opencode/reference/routing-matrix.md
README.md:9:This repo is a companion to `oh-my-openagent`, not an official upstream distribution and not a replacement for the harness. The skill surface is broad, 45 top-level skill entrypoints under `.opencode/skills/`, made up of 42 core skill surfaces and 3 planned adjacent packs, but the visible validated surface stays narrow: `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`.
README.md:15:| Skill surface | The repo exposes 45 top-level skill entrypoints under `.opencode/skills/`: 42 core skill surfaces plus 3 planned adjacent packs. |
README.md:52:| Local skill surface | Adds 45 top-level skill entrypoints across major delivery lanes: 42 core skill surfaces plus 3 planned adjacent packs. That makes the repo feel like a real working system, not a thin demo layer. | `.opencode/skills/` |
README.md:55:| Service vernacular companion | Adds `service-vernacular` as a supplementary language companion for repo-backed nouns, verbs, surface registers, and rewrite evidence across UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator, onboarding, support, and release notes. It is not a primary route, not a support claim, and not a validated support claim. | `.opencode/skills/service-vernacular/SKILL.md`, `.opencode/skills/service-vernacular/reference/` |
README.md:67:| Language companion | `service-vernacular` | Supplementary language companion for repo-backed domain nouns, verbs, surface registers, `LANGUAGE.md` dossier guidance, and before/after rewrite evidence. It is not a primary route, not a support claim, and not a validated support claim. |
README.md:85:When copy work needs product-specific language before an owner writes UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator text, onboarding, support copy, or release notes, use `service-vernacular` as a supplementary language companion. It keeps `LANGUAGE.md` as canonical, treats `DOMAIN_LANGUAGE.md` as alternate or legacy context, and stays not a primary route, not a support claim, and not a validated support claim.
CHANGELOG.md:19:* Added `service-vernacular` as a local supplementary language companion for repo-backed nouns, verbs, surface registers, and before/after rewrite evidence across user-facing surfaces.
CHANGELOG.md:20:* Updated inventory wording for 45 top-level skill entrypoints, 42 core skill surfaces, and 3 planned adjacent packs, with `service-vernacular` counted as one language companion and not as a planned-adjacent pack.
CHANGELOG.md:21:* Validator coverage now checks the `service-vernacular` skill guardrails, reference coverage, supplementary discoverability, governance absence, and inventory classification.
CHANGELOG.md:22:* Governance absence remains intentional: `service-vernacular` has no routing-signals, capability-matrix, support-policy, or workflow-catalog sidecar entry.
CHANGELOG.md:26:* `service-vernacular` is not a primary route, not a validated workflow, and not a support claim.
CHANGELOG.md:27:* This unreleased note does not publish a release date, tag, VERSION bump, supported-now claim, or validated workflow claim for `service-vernacular`.
CHANGELOG.md:63:- Expanded validator coverage for current inventory counts: 44 top-level skill entrypoints, 41 core skill surfaces, 3 planned adjacent packs, 17 expert packs, and 1 supplementary orientation skill.
.opencode/reference/routing-matrix.md:95:`service-vernacular` is a supplementary language companion for repo-backed nouns, verbs, surface registers, claim boundaries, and before/after rewrite evidence across UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator text, onboarding, support, and release notes.
.opencode/reference/routing-matrix.md:99:`service-vernacular` is not a primary route and not a validated support claim.

$ rg -n "not a primary route|not a validated support claim|not a validated workflow|not a support claim" README.md CHANGELOG.md .opencode/reference/routing-matrix.md .opencode/skills/service-vernacular/SKILL.md
README.md:54:| DESIGN.md reference layer | Adds curated external DESIGN.md reference material for visual-language interpretation. It is not a primary route and not a validated support claim. | `.opencode/reference/design-md/README.md`, `.opencode/reference/design-md-source-policy.md`, `.opencode/reference/design-md-catalog.md` |
README.md:55:| Service vernacular companion | Adds `service-vernacular` as a supplementary language companion for repo-backed nouns, verbs, surface registers, and rewrite evidence across UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator, onboarding, support, and release notes. It is not a primary route, not a support claim, and not a validated support claim. | `.opencode/skills/service-vernacular/SKILL.md`, `.opencode/skills/service-vernacular/reference/` |
README.md:66:| Strategic orientation | `compass` | Bounded goal framing, option comparison, and next-route recommendation before implementation. It is not a primary route and not a validated support claim. |
README.md:67:| Language companion | `service-vernacular` | Supplementary language companion for repo-backed domain nouns, verbs, surface registers, `LANGUAGE.md` dossier guidance, and before/after rewrite evidence. It is not a primary route, not a support claim, and not a validated support claim. |
README.md:83:When a UI request names a specific product feel, the DESIGN.md catalog can help choose a selected slug and extract transferable patterns. It stays reference material for the existing UI routes, not a supported-now promise and not a validated support claim.
README.md:85:When copy work needs product-specific language before an owner writes UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator text, onboarding, support copy, or release notes, use `service-vernacular` as a supplementary language companion. It keeps `LANGUAGE.md` as canonical, treats `DOMAIN_LANGUAGE.md` as alternate or legacy context, and stays not a primary route, not a support claim, and not a validated support claim.
CHANGELOG.md:26:* `service-vernacular` is not a primary route, not a validated workflow, and not a support claim.
.opencode/reference/routing-matrix.md:89:`compass` is not a primary route.
.opencode/reference/routing-matrix.md:99:`service-vernacular` is not a primary route and not a validated support claim.
.opencode/skills/service-vernacular/SKILL.md:12:It is not a primary route, not an implementation executor, not a routing-matrix replacement, and not a support claim.
.opencode/skills/service-vernacular/SKILL.md:78:- This skill is not a primary route and must not add a seventh bucket, workflow, or route-domain entry.
.opencode/skills/service-vernacular/SKILL.md:81:- This skill is not a support claim and must not imply current validated coverage, public support status, or workflow status.

$ support/workflow governance absence
PASS: service-vernacular absent from support-policy and workflow-catalog

$ deterministic contract phrase checks
PASS: README inventory 45 top-level contains '45 top-level'
PASS: README inventory 42 core contains '42 core'
PASS: README inventory 3 planned adjacent contains '3 planned adjacent'
PASS: README service-vernacular contains 'service-vernacular'
PASS: routing service-vernacular contains 'service-vernacular'
PASS: routing not a primary route contains 'not a primary route'
PASS: routing not a validated support claim contains 'not a validated support claim'
PASS: changelog 45 top-level contains '45 top-level'
PASS: changelog 42 core contains '42 core'
PASS: changelog 3 planned adjacent contains '3 planned adjacent'
PASS: changelog service-vernacular contains 'service-vernacular'
PASS: changelog not a primary route contains 'not a primary route'
PASS: changelog not a validated workflow contains 'not a validated workflow'
PASS: changelog not a support claim contains 'not a support claim'
PASS: skill not a primary route contains 'not a primary route'
PASS: skill not a support claim contains 'not a support claim'
EXIT_CODE=0
