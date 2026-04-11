# AI data product delivery

This proof contract covers the validated path for AI and data-product delivery in this bundle.

## Primary route

Route through `data-ml-platform` first, then use the relevant training, retrieval, pipeline, or serving overlay inside that pack when the repo stack needs it.

## Adjacent pack rule

Add `architecture-integration` when model-serving or product contracts span multiple surfaces, or add `database-engineering` when storage, retrieval, lineage, or index boundaries dominate the same delivery slice.

## Built-in helper fit

Use `Librarian` for source-of-truth lookup on frameworks and serving formats, `Oracle` for architecture or quality challenge passes, and `review-work` for the final implementation sweep after substantial data or model changes.

## Support-tier boundary

This workflow is `validated` only for the frozen manifest ID `ai-data-product-delivery`; the broader `data-ml-platform`, `database-engineering`, and related guided surfaces that may support the work remain `guided` unless the manifest promotes them separately.

## Evidence path contract

Keep inspectable proof under `.sisyphus/evidence/` with task-scoped artifacts that show the chosen route, any adjacent-pack escalation, the helper fit actually used, and the resulting lineage, evaluation, serving, or verification logs that another reviewer can inspect without re-running the work.
