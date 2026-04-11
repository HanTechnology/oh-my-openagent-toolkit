# Cloud release readiness

This proof contract covers the validated path for rollout safety and release evidence in this bundle.

## Primary route

Route through `devops-platform` first, then use its cloud, IaC, observability, or CI/CD overlays only as needed by the actual release surface.

## Adjacent pack rule

Add `qa-validation` for release-risk evidence and finish-pass checks, or add `security-engineering` when runtime hardening, secrets posture, or workload identity is central to the same release decision.

## Built-in helper fit

Use `Prometheus` when the release path needs a structured breakdown, `Oracle` for quality or security challenge passes before signoff, and `review-work` for the final release-readiness sweep after substantial platform or validation changes.

## Support-tier boundary

This workflow is `validated` only for the frozen manifest ID `cloud-release-readiness`; the wider `devops-platform`, `qa-validation`, and `security-engineering` surfaces that may support the release remain `guided` unless the manifest promotes them separately.

## Evidence path contract

Keep inspectable proof under `.sisyphus/evidence/` with task-scoped artifacts that show the chosen route, any adjacent-pack escalation, the helper fit actually used, and the resulting rollout, rollback, quality-gate, or release-check logs that another reviewer can inspect without re-running the work.
