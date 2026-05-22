---
description: Classify a request with the local routing matrix.
---

# route-domain

Use this local command from the repo root as a documentation-only intake router for the local bundle. Keep it thin and matrix first. Classify the request, name the best local route, and defer the full routing logic to `.opencode/reference/routing-matrix.md`. The matrix owns helper fit, adjacent pack nuance, and workspace reminders.

## Intent

1. Capture the dominant request shape in one of the six fixed buckets.
2. Point to the primary local pack, deferring adjacent-pack specifics to `.opencode/reference/routing-matrix.md`.
3. Suggest that the recommended starting category comes from the matrix, not from this command.
4. Point helper and browser-helper discovery back to the matrix instead of reproducing helper fit locally.
5. Remind the operator of support and workspace boundaries without widening them.

## Deterministic flow

1. Read `.opencode/reference/routing-matrix.md` before routing. Do not route from memory or from this command file.
2. Record the input request in the output.
3. Identify one bucket from the six fixed buckets in the matrix.
4. Choose the primary pack from the matching matrix row.
5. Choose at most one adjacent pack only when the matrix names a real cross domain trigger for it.
6. Choose the category from the matrix row, treating it as the first lane to try rather than a permanent lock.
7. List helpers only from the matrix row or the matrix helper invocation table.
8. State caveats for support tiers, planned adjacent packs, and native versus enhanced behavior by pointing to the owning references.
9. State the workspace/setup note from the matrix, `.opencode/reference/workspace-model.md`, and `.opencode/reference/project-setup-policy.md` when setup choice matters.
10. Fail closed on ambiguity. If the request cannot be placed without changing bucket, primary pack, category, support claim, or workspace/setup outcome, say what is ambiguous instead of inventing a route.

## Output contract

Return a short routing note with these fields:

| Field | What to include |
| --- | --- |
| input | The request text or a compact restatement of it. |
| bucket | One of the six fixed routing buckets from `.opencode/reference/routing-matrix.md`. |
| primary pack | The primary local pack from the matching matrix row. |
| adjacent pack | At most one adjacent pack from the matrix, or `none`. |
| category | Recommended starting category from the matrix, treated as the first lane to try rather than a permanent lock. |
| helpers | Helpers named by the matrix row or helper invocation table, or `none`. |
| caveats | Support, planned adjacent, Impeccable, or native versus enhanced caveats, with authority deferred to the owning reference. |
| workspace/setup note | `existing project in place`, `greenfield -> workspace/{project-name}-{domain}`, or the setup preference from the matrix and setup references. |
| ambiguity behavior | State `fail closed` when ambiguity affects bucket, primary pack, category, support claim, helper fit, or workspace/setup outcome. |

## Routing rules

1. Treat categories as recommended starting points.
2. Treat `unspecified-low` and `unspecified-high` as fallback-only categories when no better named lane fits.
3. Keep support authority separate from routing.
4. Keep workspace guidance documentation-only.
5. Do not restate helper tables, browser-helper discovery, adjacent-pack routing logic, or planned adjacent-pack listings outside the matrix.
6. Keep native versus enhanced command, skill, and harness boundaries in `.opencode/reference/opencode-compatibility-model.md`.

## Authoritative source

Use `.opencode/reference/routing-matrix.md` as the authoritative local routing and helper source. Read that matrix for the full bucket map, pack mapping, recommended starting category guidance, helper and browser-helper discovery, adjacent-pack guidance including planned adjacent references, fallback handling, and workspace reminders. This command is only the entry point and output shape.
