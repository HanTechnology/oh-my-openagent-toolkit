# route-domain

Use this local command from the repo root as a documentation-only router for the local bundle. It gives a fast first-pass classification, points to the right local packs, suggests the best harness category, names the built-in helpers that fit, and reminds operators of the bundle workspace convention in compact form. It does not create plans, own task flow, track status, or run a lifecycle. Routing stays thin here. Support tiers and public-claim boundaries live in the manifest, support policy, and workflow catalog, so a routed surface is not automatically a validated one.

## Command intent

1. Classify the request into one of the six fixed routing buckets.
2. Point to the matching local expert pack or pack pair.
3. Suggest the preferred harness category.
4. Add built-in helpers only where they help.
5. For UI work, start with `frontend-web` or `mobile-app`, then layer the exact `impeccable` imports explicitly when anti-slop refinement is part of the ask. Browser-3D requests stay in this lane under `frontend-web` guided coverage, not in a separate routing bucket.
6. For new greenfield work started from this repo or worktree root, default outputs to `workspace/{project-name}-{domain}`. Existing projects stay in place.

## Support-tier reminder

1. Routing buckets classify request shape; they do not change whether a surface is `validated`, `guided`, or `planned`.
2. README `supported now` claims belong only to manifest entries whose `support_level` is `validated`.
3. Guided surfaces can still be routed here and are current, but they are not public supported-now claims. That includes browser-3D guidance routed through `frontend-web`, with `systems-rust` as escalation-only support and `qa-validation` as the verification lane.
4. Planned surfaces may appear as named future routing targets in supporting docs, but they are not present-tense support claims. XR and CAD browser-3D adjacencies stay in that planned category.

## Routing buckets

1. architecture/integration
2. web/mobile UI
3. backend/API
4. systems/performance
5. data/security
6. QA/deployment

## Fast routing recipe

1. If the request is mostly about system shape, contracts, or cross-stack coordination, route to `architecture/integration`.
2. If it is mostly about screens, flows, interaction quality, app UX, or browser-3D implementation in the browser runtime, route to `web/mobile UI` through `frontend-web` first.
3. If it centers on services, endpoints, auth, or server-side integrations, route to `backend/API`.
4. If it centers on native code, runtime behavior, profiling, or throughput, route to `systems/performance`. Use `systems-rust` for browser-3D only when the problem is a measured WASM or performance escalation.
5. If it centers on data platforms, storage, ML systems, or security posture, route to `data/security`.
6. If it centers on verification, release readiness, rollout, or operational handoff, route to `QA/deployment`. For browser-3D validation depth, pair the implementation route with `qa-validation` instead of treating browser-3D as its own validated workflow.

## Output format

Return a short routing note with these fields:

| Field | What to include |
| --- | --- |
| bucket | One of the six fixed buckets |
| local packs | Primary pack, plus one adjacent pack if truly needed |
| harness category | Preferred starting category |
| built-in helpers | Only the helpers that directly support the request |
| impeccable layering | `none` for non-UI work, or the exact UI refinement imports to add |
| workspace convention | `existing project in place` or `greenfield -> workspace/{project-name}-{domain}` |

## Authoritative source

Use `.opencode/reference/routing-matrix.md` as the source of truth for request shapes, pack mapping, harness categories, built-in helpers, and explicit `impeccable` layering. Use `.opencode/reference/workspace-model.md` for the full workspace-rule explanation and non-goals. Use `.opencode/reference/capability-matrix.json`, `.opencode/reference/support-policy.md`, and `.opencode/reference/workflow-catalog.md` when the request depends on current support-tier or validated-workflow boundaries.
