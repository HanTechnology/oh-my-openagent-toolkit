# Frontend product delivery

This proof contract covers the validated path for browser-facing product work in this bundle.

## Primary route

Route through `frontend-web` first, then choose the matching framework overlay inside that pack if the repo stack needs it.

## Adjacent pack rule

Add `architecture-integration` when contracts, auth, or cross-stack boundary decisions lead the work, or add the owning backend pack when request shape or auth behavior changes are part of the same delivery slice.

## Built-in helper fit

Use `frontend-ui-ux` for product and interaction judgment, `Explore` for pattern discovery before edits, and `review-work` for the final implementation sweep after substantial UI changes.

## Support-tier boundary

This workflow is `validated` only for the frozen manifest ID `frontend-product-delivery`; the adjacent packs, overlays, and broader frontend coverage that may support the work remain `guided` unless the manifest promotes them separately.

## Evidence path contract

Keep inspectable proof under `.sisyphus/evidence/` with task-scoped artifacts that show the chosen route, any adjacent-pack escalation, the helper fit actually used, and the resulting UI proof such as accessibility snapshots, screenshots, or verification logs that another reviewer can inspect without re-running the work.
