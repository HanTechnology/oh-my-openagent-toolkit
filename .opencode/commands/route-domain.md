# route-domain

Use this local command from the repo root as a documentation-only intake router for the local bundle. Keep it thin. Classify the request, name the best local route, and defer the full routing logic to `.opencode/reference/routing-matrix.md`.

## Intent

1. Capture the dominant request shape in one of the six fixed buckets.
2. Point to the matching local pack, or pack pair when cross-domain work is real.
3. Suggest a recommended starting category, not a hard selector.
4. Name only the built-in helpers that directly help.
5. Remind the operator of support and workspace boundaries without widening them.

## Output contract

Return a short routing note with these fields:

| Field | What to include |
| --- | --- |
| bucket | One of the six fixed routing buckets |
| pack(s) | Primary local pack, plus one adjacent pack only when genuinely needed |
| category | Recommended starting category, treated as the first lane to try rather than a permanent lock |
| helpers | Only the built-in helpers that directly support the request |
| support caveat | Routing is not support authority. Current `validated`, `guided`, and `planned` authority stays in `.opencode/reference/capability-matrix.json`, `.opencode/reference/support-policy.md`, and `.opencode/reference/workflow-catalog.md` |
| workspace note | `existing project in place` or `greenfield -> workspace/{project-name}-{domain}` |

## Routing rules

1. Treat categories as recommended starting points.
2. Treat `unspecified-low` and `unspecified-high` as fallback-only categories when no better named lane fits.
3. Keep support authority separate from routing.
4. Keep workspace guidance documentation-only.

## Authoritative source

Use `.opencode/reference/routing-matrix.md` as the authoritative local routing and helper source. Read that matrix for the full bucket map, pack mapping, recommended starting category guidance, helper notes, fallback handling, and workspace reminders.
