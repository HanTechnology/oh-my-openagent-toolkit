# Changelog

All notable changes to `oh-my-openagent-toolkit` are tracked here.

This repository uses SemVer-style release tags (`vMAJOR.MINOR.PATCH`) even though it is a project-local OpenCode bundle rather than a package artifact. The `VERSION` file is the local toolkit version source of truth; tags and GitHub Releases are added only when a release is published.

Versioning rules:

- Major: breaking changes to routing, support-tier semantics, or documented bundle contracts.
- Minor: new local skill surfaces, new reference layers, or meaningful public workflow/documentation additions.
- Patch: validator fixes, wording corrections, guardrail tightening, and non-breaking documentation updates.


## v0.6.1 - 2026-05-26

Patch release for the `init` AGENTS target-path repair.

#### Fixes

* Fixed missing-target `AGENTS.md` creation so absent target paths receive the packaged full guide plus exactly one managed OMO Toolkit block.
* Preserved marker-safe behavior for existing `AGENTS.md` files: project content outside the managed block stays intact, and existing managed blocks remain the only toolkit-owned region.
* Kept lockfile `agentsBlock` ownership tied to the managed-block hash, not the whole generated guide.

#### Validation

* Validation and smoke coverage now cover missing-target full-guide creation, idempotency, and existing-file marker preservation.
* npm publication remains a manual user step after the GitHub release; this metadata update does not publish the package.

## v0.6.0 - 2026-05-24

Minor toolkit release adding safe migration for legacy/manual installs and explicit guided init UX.

#### Highlights

* Added safe migration docs and CLI flow for existing or manual target installs through `migrate --dry-run`, `migrate --apply`, and `init --migrate --dry-run`.
* Documented migration action labels: `adopt-identical`, `replace-known-stale`, `create-missing`, `preserve-project-owned`, `needs-review`, and `unsafe-conflict`, including marker-safe `AGENTS.md` handling.
* Added explicit guided installer UX through `init --guided`; bare `init` remains dry-run/default-safe, and changing bare TTY `init` to guided by default remains a future decision.
* Documented `localOnly` as lockfile preservation metadata for project-owned files respected by `validate`, `doctor`, `init`, `migrate`, and `update`.

#### Boundaries

* `--dry-run` writes nothing. `--force` and `--overwrite` are rejected guardrails, not migration safety flags.
* Support and validation boundaries stay unchanged: v0.6 migration and guided init do not add primary routes, workflow validation, or native OpenCode behavior.
* Migration uses package-local historical hashes only and does not fetch history at runtime.

## v0.5.0 - 2026-05-22

Minor toolkit release publishing the project-local installer/updater CLI for safe target-project installation, validation, diffing, and updates.

### Highlights

* Added the dependency-light installer/updater CLI for `oh-my-openagent-toolkit`, including `init`, `update`, `validate`, and `doctor` command surfaces plus the `oh-my-openagent-toolkit` and `omo-toolkit` bin aliases.
* Added the declarative source manifest used by package installs and update planning, distinct from the support-tier capability matrix.
* Added lockfile-backed ownership through `.opencode/oh-my-openagent-toolkit.lock.json` so managed files and source identity are tracked explicitly.
* Added marker-managed `AGENTS.md` integration that preserves project-authored content outside the OMO Toolkit managed block.

### Validation

* Release validation covers the source validator, CLI test suite, package dry-run, and external sandbox smoke from `/tmp/opencode/omo-toolkit-release-smoke-pack`.
* Installed-project validation remains CLI-only through `node bin/omo-toolkit.mjs validate --target <path>` and checks managed files, lockfile hashes, duplicate AGENTS blocks, and forbidden top-level `paths`.

### Boundaries

* Support boundary remains unchanged: this release adds installer/update mechanics but does not add a new validated workflow, primary route, support tier, remote fetch, self-update, plugin marketplace, or interactive TUI.
* Source validation remains `bash .opencode/reference/validate-opencode-bundle.sh full`; installed target validation remains separate from the source shell validator.

## v0.4.0 - 2026-05-22

Minor toolkit release aligning local harness discovery documentation and validation with `oh-my-openagent` v4.3.0 project-root behavior.

### Highlights

* Removed obsolete top-level `paths` wiring from `.opencode/oh-my-openagent.jsonc`; the file now stays schema-compatible while project discovery loads local `.opencode/skills` and `.opencode/commands` from the toolkit root.
* Clarified `.opencode/reference/opencode-compatibility-model.md` so `skills.sources` is documented only for extra skill sources, not command or reference roots.
* Added a validator contract that rejects top-level `paths` in the plugin config and records the v4.3.0 toolkit-root discovery boundary.
* Verified root scoping explicitly: the toolkit root discovers `compass`, `service-vernacular`, `impeccable`, and `route-domain`, while the parent root does not discover those project assets.

### Validation

* Release-time validation: `sh -n .opencode/reference/validate-opencode-bundle.sh` passed, and `bash .opencode/reference/validate-opencode-bundle.sh full` reported `95 PASS, 0 WARN, 0 FAIL`.
* Config smoke test against `oh-my-openagent` v4.3.0 loaded `.opencode/oh-my-openagent.jsonc` with `hasPaths=false`.

### Boundaries

* This release does not add a new skill, primary route, validated workflow, or support tier.
* `service-vernacular` remains a supplementary language companion and stays absent from routing-signals, capability-matrix, support-policy, and workflow-catalog sidecars.
* Toolkit assets remain project-scoped: run from `oh-my-openagent-toolkit/` when expecting local skills or `/route-domain` to be discoverable.

## v0.3.0 - 2026-05-22

Local toolkit release publishing all local-only governance, routing, Impeccable compatibility, validation, and `service-vernacular` work accumulated after `v0.2.0`.

### Highlights

* Added `service-vernacular` as a local supplementary language companion for repo-backed nouns, verbs, surface registers, and before/after rewrite evidence across user-facing surfaces.
* Added the `service-vernacular` reference set for language dossiers, surface registers, rewrite examples, slop detection, rewrite gates, and contract-safety boundaries.
* Added explicit OpenCode compatibility governance, including `LICENSE` and `.opencode/reference/opencode-compatibility-model.md`, to distinguish native OpenCode contracts from enhanced `oh-my-openagent` behavior.
* Normalized the Impeccable command and reference facades so compatibility wrappers stay redirects or aliases while upstream command surfaces and references remain clearly supplementary.
* Classified Impeccable compatibility wrappers and planned adjacent packs across the local skill inventory, keeping planned packs discoverable without promoting them to validated routes.
* Clarified routing helper discovery, onboarding flow, release-engineering adjacency, support-policy wording, workflow-catalog boundaries, and compact workspace guidance.
* Expanded bundle validation for compatibility surfaces, Impeccable wrapper taxonomy, planned adjacent classification, release-evidence freshness contracts, and `service-vernacular` inventory and guardrails.
* Removed obsolete task-8 validation evidence files from the tracked release state; validation evidence that makes current release or workflow claims is now governed by freshness metadata.

### Validation

* Release-time validation: `sh -n .opencode/reference/validate-opencode-bundle.sh` passed, and `bash .opencode/reference/validate-opencode-bundle.sh full` reported `94 PASS, 0 WARN, 0 FAIL`.

### Boundaries

* `service-vernacular` is not a primary route, not a validated workflow, and not a support claim.
* Governance absence remains intentional: `service-vernacular` has no routing-signals, capability-matrix, support-policy, or workflow-catalog sidecar entry.
* The validated workflow surface remains limited to `frontend-product-delivery`, `backend-service-delivery`, `cloud-release-readiness`, and `ai-data-product-delivery`.

## v0.2.0 - 2026-05-19

Impeccable v3.1.1 Hybrid migration entry for toolkit version `0.2.0`.

### Highlights

* Clarified version scope: this toolkit is `0.2.0`, while the bundled upstream Impeccable skill is version `3.1.1` from upstream tag `skill-v3.1.1`.
* Migrated to the hybrid Impeccable model: 1 upstream consolidated skill, 23 upstream commands, and 22 local compatibility wrappers.
* Preserved local compatibility wrappers so existing top-level shortcuts continue to point users toward `/impeccable` command targets.
* Brought in the upstream command and capability surface, including `document` and `live` commands, `brand`, `product`, and `codex` reference surfaces, critique persistence, and craft gates.
* Updated validator coverage for the hybrid taxonomy, wrapper redirects, upstream command metadata, capability references, critique storage, craft gates, support boundaries, and forbidden wrapper claims.
* Updated attribution handling so upstream `NOTICE.md`, `LICENSE`, and Apache 2.0 markers travel with the consolidated Impeccable package.

### Validation

* Historical release-time validator record: `sh .opencode/reference/validate-opencode-bundle.sh full`: `71 PASS, 0 WARN, 0 FAIL`.
* This v0.2.0 release note is not a live pass-count claim for the current working tree; current validator success is based on `0 FAIL`.

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
