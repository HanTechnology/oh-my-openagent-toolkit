# Impeccable Vendor Policy

This document freezes the local governance model for the full `impeccable` import in `agentic-dev-ai-team`. It is authoritative for the upstream source, pinned snapshot, local-integrated import policy, sync expectations, deprecated-wrapper handling, and the frozen counts for the bundle.

## Upstream snapshot freeze

| Field | Value |
| --- | --- |
| Upstream repository | `pbakaus/impeccable` |
| Authoritative upstream inventory path | `.opencode/skills/` |
| Upstream skill content path used for vendoring | `source/skills/` |
| Pinned snapshot ref | commit `5a22894b1fd7c50f50c7f801ed8ee7f0ca6cb1bf` |
| Import date for this governance freeze | `2026-04-10` |
| Local target path | `agentic-dev-ai-team/.opencode/skills/` |

This bundle uses a vendored snapshot policy. It is a vendored snapshot, not automatic mirroring.

## Frozen local impeccable inventory

The local `impeccable` layer is frozen at exactly 23 skills:

- `impeccable`
- `adapt`
- `animate`
- `arrange`
- `audit`
- `bolder`
- `clarify`
- `colorize`
- `critique`
- `delight`
- `distill`
- `extract`
- `frontend-design`
- `harden`
- `normalize`
- `onboard`
- `optimize`
- `overdrive`
- `polish`
- `quieter`
- `shape`
- `teach-impeccable`
- `typeset`

Together with the 17 local expert packs, this freezes the bundle at 40 total local skills.

## Local-integrated import policy

The local `impeccable` layer is a full local-integrated import rather than a raw upstream mirror. That means:

1. Keep the upstream skill inventory complete for the pinned snapshot, including deprecated wrappers that are intentionally still part of the upstream tree.
2. Preserve supported upstream skill metadata and supported local extensions when they are required for correct local vendoring.
3. Integrate the snapshot into the local bundle so the wording and surrounding reference docs stay consistent with this repo's routing model, shared anti-slop references, and workspace convention.
4. Do not import unrelated provider-distribution files, control-plane logic, or extra runtime surfaces outside the approved local skill inventory.
5. Treat the local docs in this repo as the authoritative explanation of how the vendored snapshot behaves once integrated here.

## Sync and update playbook

When the local `impeccable` layer is refreshed later, follow this playbook:

1. Choose a candidate upstream commit or tag and record the exact ref before any content is changed locally.
2. Reconfirm the upstream inventory against the pinned snapshot and verify that the intended local set still contains the full 23-skill import, including `frontend-design` and `teach-impeccable`.
3. Diff the vendored skill content, supported metadata, and any supported local extensions against the current local snapshot.
4. Apply only the local-integrated adjustments needed to keep the bundle consistent with local routing docs, shared references, and workspace conventions.
5. Update this file, `migration-matrix.md`, and any downstream routing or validator surfaces together so counts and semantics do not drift.
6. Re-run parser-based verification so the 23-skill freeze, 40 total local skill count, vendored snapshot wording, and deprecated-wrapper policy are all proven again.

## Deprecated-wrapper handling policy

`frontend-design` and `teach-impeccable` are intentionally included in the frozen 23-skill inventory because completeness matters for the local full import. They remain deprecated wrappers, not primary local routing choices.

When later docs or validators reference the `impeccable` layer:

1. Keep both wrappers present in the authoritative inventory.
2. Mark them as deprecated wrappers or equivalent non-primary wording.
3. Do not elevate them above the primary `impeccable` skills in routing guidance.
4. Do not treat their deprecated status as a reason to omit them from the local full-import snapshot.
