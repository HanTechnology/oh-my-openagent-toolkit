# Backend service delivery

This proof contract covers the validated path for service and API delivery in this bundle.

## Primary route

Route through the owning backend pack, `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, or `backend-go`, based on the runtime that owns the service.

## Adjacent pack rule

Add `architecture-integration` when contract design or cross-service boundaries lead the work, or add `database-engineering` or `security-engineering` when storage shape, lineage, auth, or runtime risk becomes a first-class part of the same delivery slice.

## Built-in helper fit

Use `Oracle` for architecture and quality challenge passes, `Librarian` for source-of-truth lookup when framework or protocol details matter, and `review-work` for the final implementation sweep after substantial backend changes.

## Support-tier boundary

This workflow is `validated` only for the frozen manifest ID `backend-service-delivery`; the broader backend packs and overlays that support many other runtime-specific paths remain `guided` unless the manifest promotes them separately.

## Evidence path contract

Keep inspectable proof under `.sisyphus/evidence/` with task-scoped artifacts that show the chosen backend route, any adjacent-pack escalation, the helper fit actually used, and the resulting contract, auth, test, or verification logs that another reviewer can inspect without re-running the work.
