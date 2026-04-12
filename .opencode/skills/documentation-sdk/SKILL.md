---
name: documentation-sdk
description: Deliver API and SDK-facing documentation guidance for design-first contracts, generated references, examples, and release-adjacent doc updates without widening into generic product docs.
---

# Documentation SDK

Use this pack for API and SDK documentation work: source-of-truth contracts, reference docs, OpenAPI-driven content, examples and snippets, generated SDK surfaces, and release-adjacent documentation updates.

This pack keeps API and integration docs accurate, usable, and generation-friendly. Use the overlays in `reference/api-docs-openapi-sdk.md` and `reference/technical-writing-release-notes.md` when contract structure, snippet quality, docs pipelines, or release-note-adjacent writing dominates the task, and keep generic product docs or architecture narratives outside this pack.

## Core focus

- Make API and source-of-truth docs authoritative for humans and tools.
- Keep SDK docs, examples, and generated references aligned with the actual contract surface.
- Prefer task-oriented explanations plus copy-paste-safe snippets for common integration paths.
- Update docs and release-adjacent notes as part of change delivery instead of after the release.
- Make compatibility windows, deprecations, and upgrade requirements explicit at the documentation boundary.

## Shared standards

- Treat the contract surface, such as OpenAPI or an equally explicit schema, as the canonical source for reference documentation and generated SDK output.
- Keep examples realistic and labeled with intent so readers can move from docs to working code without reverse-engineering missing context.
- Separate conceptual explanation from reference detail: guides should explain why and when, while API references and SDK docs should stay structured and precise.
- Make docs generation reproducible inside the release flow so published references and released SDK artifacts trace back to the same contract version.
- Update deprecations, upgrade guidance, and release-note-adjacent summaries in the same change path as the underlying API or SDK behavior.

## Default workflow

1. Inspect the contract source of truth, current docs surface, SDK consumers, and any release-note or upgrade touchpoints.
2. Choose the relevant overlay: `reference/api-docs-openapi-sdk.md` for contract-driven references and SDK shape, or `reference/technical-writing-release-notes.md` for explanation quality and release-adjacent writing.
3. Refresh the canonical contract and reference outputs before polishing portal copy or examples.
4. Add realistic snippets, upgrade notes, and compatibility guidance where users are most likely to need them.
5. Run `review-work` after substantial documentation or SDK-surface changes.

## Collaboration in this repo

- Use `Explore` before editing so new docs match local API naming, example style, and existing reference structure.
- Use `Librarian` or `Context7` when OpenAPI, code generation, or documentation tooling details need a source-of-truth check.
- Pair with `architecture-integration` or the owning backend pack when contract ownership, schema evolution, or integration boundaries dominate the task.
- Pair with `release-engineering` when doc updates must align with version cuts, changelog flow, or publication timing.

## Overlays

- `reference/api-docs-openapi-sdk.md` for source-of-truth contracts, OpenAPI structure, SDK-safe naming, generated references, and example shape.
- `reference/technical-writing-release-notes.md` for task-oriented guides, upgrade and compatibility wording, release-note framing, and adjacent doc refreshes.

## Guardrails

- Do not let this pack expand into generic product docs, marketing copy, or broad architecture narratives.
- Do not let generated output drift away from the contract source of truth or let snippets drift away from shipped behavior.
- Do not treat release notes as a substitute for durable API or SDK reference documentation.
