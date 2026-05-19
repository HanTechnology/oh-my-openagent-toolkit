# Changelog

All notable changes to `oh-my-openagent-toolkit` are tracked here.

This repository uses SemVer-style release tags (`vMAJOR.MINOR.PATCH`) even though it is a project-local OpenCode bundle rather than a package artifact. The `VERSION` file is the local toolkit version source of truth; tags and GitHub Releases are added only when a release is published.

Versioning rules:

- Major: breaking changes to routing, support-tier semantics, or documented bundle contracts.
- Minor: new local skill surfaces, new reference layers, or meaningful public workflow/documentation additions.
- Patch: validator fixes, wording corrections, guardrail tightening, and non-breaking documentation updates.

## v0.2.0 - 2026-05-19

Impeccable v3.1.1 Hybrid migration entry for toolkit version `0.2.0`.

### Highlights

* Clarified version scope: this toolkit is `0.2.0`, while the bundled upstream Impeccable skill is version `3.1.1` from upstream tag `skill-v3.1.1`.
* Migrated to the hybrid Impeccable model: 1 upstream consolidated skill, 23 upstream commands, and 22 local compatibility wrappers.
* Preserved local compatibility wrappers so existing top-level shortcuts continue to point users toward `/impeccable` command targets.
* Brought in the upstream command and capability surface, including `document` and `live` commands, `brand`, `product`, and `codex` reference surfaces, critique persistence, and craft gates.
* Updated validator coverage for the hybrid taxonomy, wrapper redirects, upstream command metadata, capability references, critique storage, craft gates, support boundaries, and forbidden wrapper claims.
* Updated attribution handling so upstream `NOTICE.md`, `LICENSE`, and Apache 2.0 markers travel with the consolidated Impeccable package.

### Boundaries

* Support and workflow boundaries remain unchanged. Impeccable remains supplementary guidance plus compatibility routing inside this toolkit, not a new primary route or public support expansion.
* `brand`, `product`, and `codex` are upstream capability or reference surfaces, not new top-level local wrappers.
* No tag or GitHub Release is published by this changelog entry.

## v0.1.0 - 2026-05-15

First managed release for the toolkit, focused on the new DESIGN.md reference layer and the new `compass` orientation skill.

### Highlights

- Added the DESIGN.md reference layer for visual-language interpretation. It includes curated external DESIGN.md examples, source attribution, selection guidance, and catalog material while staying supplementary to existing UI routes.
- Added `compass` as a bounded strategic-orientation skill for ambiguous pre-implementation requests. It helps reframe goals, compare 2-3 viable directions, recommend the next route, skill, helper, or planning step, and then hand implementation to the selected owner.
- Updated routing guidance so DESIGN.md material and `compass` remain discoverability and orientation aids, not new primary routes, support tiers, or validated workflow claims.
- Expanded validator coverage for current inventory counts: 44 top-level skill entrypoints, 41 core skill surfaces, 3 planned adjacent packs, 17 expert packs, and 1 supplementary orientation skill.
- Added guardrail checks so `compass` stays out of support-policy, workflow-catalog, routing-signals, and capability-matrix governance unless a future release intentionally changes those contracts.
- Aligned the impeccable vendor-policy inventory wording with the new 41-skill core count.

### Validation

- `sh .opencode/reference/validate-opencode-bundle.sh full`: `62 PASS, 0 WARN, 0 FAIL`
- Negative validator probes confirmed invalid modes and unexpected top-level skill directories fail as intended.

### Boundaries

- This release does not make DESIGN.md a primary route or validated support claim.
- This release does not make `compass` a primary route, routing-matrix replacement, implementation executor, or support claim.
- The validated workflow surface remains limited to `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`.
