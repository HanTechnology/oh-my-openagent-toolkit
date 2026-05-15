# Impeccable Vendor Policy

This document defines the current local governance model for the full `impeccable` import in `oh-my-openagent-toolkit`. It is authoritative for the upstream source, pinned upstream ref, local-integrated import policy, sync expectations, deprecated-wrapper handling, and the current core counts used by the bundle.

## Pinned upstream source

| Field | Value |
| --- | --- |
| Upstream repository | `pbakaus/impeccable` |
| Authoritative upstream inventory path | `.opencode/skills/` |
| Upstream skill content path used for vendoring | `source/skills/` |
| Pinned upstream ref | commit `5a22894b1fd7c50f50c7f801ed8ee7f0ca6cb1bf` |
| Local target path | `.opencode/skills/` |

This bundle vendors a pinned upstream copy. It is not automatically mirrored.

## Current local impeccable inventory

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

Together with the 17 local expert packs and 1 supplementary orientation skill, this keeps the current core bundle inventory at 41 total local skills. The live repo may also carry the planned adjacent packs `release-engineering`, `documentation-sdk`, and `developer-experience`, but those remain outside the current 17/23/1/41 core.

## Local-integrated import policy

The local `impeccable` layer is a full local-integrated import rather than a raw upstream mirror. That means:

1. Keep the upstream skill inventory complete for the pinned upstream ref, including deprecated wrappers that are intentionally still part of the upstream tree.
2. Preserve supported upstream skill metadata and supported local extensions when they are required for correct local vendoring.
3. Integrate the snapshot into the local bundle so the wording and surrounding reference docs stay consistent with this repo's routing model, shared anti-slop references, and workspace convention.
4. Do not import unrelated provider-distribution files, control-plane logic, or extra runtime surfaces outside the approved local skill inventory.
5. Treat the local docs in this repo as the authoritative explanation of how the vendored snapshot behaves once integrated here.

## Sync and update playbook

When the local `impeccable` layer is refreshed later, follow this playbook:

1. Choose a candidate upstream commit or tag and record the exact ref before any content is changed locally.
2. Reconfirm the upstream inventory against the pinned upstream ref and verify that the intended local set still contains the full 23-skill import, including `frontend-design` and `teach-impeccable`.
3. Diff the vendored skill content, supported metadata, and any supported local extensions against the current local snapshot.
4. Apply only the local-integrated adjustments needed to keep the bundle consistent with local routing docs, shared references, and workspace conventions.
5. Update this file and any downstream routing or validator surfaces together so counts and semantics do not drift between the current 41-skill core and any live planned adjacent packs.
6. Re-run parser-based verification so the 23-skill inventory, 41-skill core, live planned-adjacent-pack handling, pinned upstream wording, and deprecated-wrapper policy are all proven again.

## Deprecated-wrapper handling policy

`frontend-design` and `teach-impeccable` are intentionally included in the frozen 23-skill inventory because completeness matters for the local full import. They remain deprecated wrappers, not primary local routing choices.

When later docs or validators reference the `impeccable` layer:

1. Keep both wrappers present in the authoritative inventory.
2. Mark them as deprecated wrappers or equivalent non-primary wording.
3. Do not elevate them above the primary `impeccable` skills in routing guidance.
4. Do not treat their deprecated status as a reason to omit them from the local full-import snapshot.
