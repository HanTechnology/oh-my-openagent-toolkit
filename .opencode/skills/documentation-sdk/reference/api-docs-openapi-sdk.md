# API docs, OpenAPI, and SDK overlay for `documentation-sdk`

Use this overlay when reference docs are driven by a versioned API contract, generated SDK surfaces, and integration examples that must stay readable for both humans and tooling.

## Scope

- OpenAPI or another machine-readable contract is the source of truth for request, response, auth, or error shapes,
- SDK generation or hand-maintained client libraries depend on stable schema names, operation ids, and examples,
- docs generation, snippet curation, or portal publication must stay aligned with released API behavior.

## Required concepts

- Keep one versioned contract surface as the canonical source for endpoints, schemas, auth, pagination, rate limits, and error mapping; documentation and SDKs should derive from that contract instead of competing with it.
- Make names SDK-safe on purpose: operation ids, tags, schema names, enum values, and error shapes should stay stable enough for generated clients and hand-written examples to remain readable.
- Pair every important operation with realistic request and response examples, plus auth and failure-path notes, so users can move from docs to working code without guesswork.
- Keep docs and SDK generation reproducible inside the release flow: spec validation, generated artifacts, and published references should trace back to the same released contract version.

## Watchouts

- Avoid spec-versus-implementation drift where the docs claim parameters, auth, or errors the server no longer matches.
- Avoid toy snippets that compile on paper but omit auth, pagination, idempotency, or retry behavior real integrators need.
- Avoid generated SDKs or portals built from stale schemas, unstable naming, or undocumented breaking changes.

## First-party anchors

- Pair this overlay with the owning backend pack or `architecture-integration` when contract ownership, compatibility policy, or boundary changes drive the work.
- Pair this overlay with `technical-writing-release-notes.md` when API changes also need migrations, upgrade guidance, or user-facing release communication.
