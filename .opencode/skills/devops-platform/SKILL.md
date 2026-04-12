---
name: devops-platform
description: Deliver platform and delivery guidance for Docker, cloud foundations, infrastructure as code, CI/CD boundaries, observability, rollback, and release safety without claiming orchestration authority.
---

# DevOps Platform

Use this pack for delivery and runtime work: Docker and containerization, cloud foundation guidance, infrastructure as code boundaries, CI/CD design, rollout and rollback planning, monitoring, health checks, and operational readiness. Route category and escalation decisions through `../../reference/routing-matrix.md`, which keeps bounded validation and evidence work in the lighter lane and uses this pack when release, platform, or higher-risk delivery concerns become central.

This is the general platform and delivery pack for the repo. It does not declare its own route, category, or validated workflow authority, those decisions defer to `../../reference/routing-matrix.md` and `../../reference/workflow-catalog.md`. Use the overlays in `reference/docker-kubernetes-ci-cd.md`, `reference/aws-azure-gcp.md`, `reference/terraform-pulumi.md`, `reference/observability-sre.md`, and `reference/github-actions-argo.md` to sharpen container, cloud, IaC, observability, and deployment-handoff guidance while keeping execution ownership with the harness and repository workflows rather than this pack.

## Core focus

- Design Docker and containerization choices around reproducible builds, runtime safety, and operable images.
- Shape cloud account, subscription, project, and network boundaries so identity, policy, and shared-service ownership stay explicit.
- Match the deployment target to workload shape, networking, data dependencies, and operational maturity.
- Treat infrastructure as code as a governed delivery surface: state, locking, scoping, and drift handling matter as much as resource declarations.
- Treat CI/CD as guidance for build, test, scan, promote, and deploy boundaries rather than as an all-owning automation persona.
- Make monitoring, logs, metrics, tracing, SLOs, and health checks part of the deployment design.
- Plan rollback, staged release, and failure handling before the first production push.

## Shared platform standards

- Build once and promote immutable artifacts; prefer versioned tags and digest-aware deployment over mutable `latest` behavior.
- Use this pack for higher-risk platform, rollout, and environment work after `../../reference/routing-matrix.md` points the request into the deeper lane, not as a blanket default for every QA or deployment task.
- Keep cloud identity, network policy, resource hierarchy, and environment classes explicit so shared platform controls do not drift between environments.
- Treat IaC state, locking, and ownership boundaries as release-safety controls, not implementation details.
- Separate CI concerns from CD concerns. CI should validate, test, scan, and publish artifacts; CD should promote and apply the declared release shape.
- Keep readiness, liveness, startup, and service health explicit so bad releases fail fast and safely.
- Treat secrets, service identity, network policy, and least privilege as runtime controls, not application afterthoughts.
- Use observability to support release evidence, incident response, and rollback decisions instead of treating telemetry as a post-deploy accessory.
- Design release and rollback paths together, especially when data migrations, background jobs, or shared caches are involved.
- Point release evidence back to `../../reference/quality-gates.md` when rollout readiness depends on shared QA thresholds.

## Default workflow

1. Read `../../reference/routing-matrix.md` first so the harness lane and escalation level come from the matrix instead of this pack.
2. Inspect the runtime model, target platform, account or project layout, deployment constraints, and operational risks.
3. Choose the relevant overlay or overlay set: `reference/docker-kubernetes-ci-cd.md`, `reference/aws-azure-gcp.md`, `reference/terraform-pulumi.md`, `reference/observability-sre.md`, or `reference/github-actions-argo.md`.
4. Define artifact flow, environment shape, access model, state strategy, health signals, and rollback approach before broad implementation.
5. Implement container, manifest, policy, pipeline, and observability changes together so deployment behavior stays readable.
6. Keep bounded validation and evidence-only work paired with `qa-validation` in the lighter lane, and escalate here when release, rollback, platform, or environment risk becomes the main concern.
7. Run `review-work` after substantial platform or delivery changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local deployment, container, and ops patterns.
- Use `Librarian` or `Context7` when platform APIs, registry behavior, or orchestration details need a source-of-truth check.
- Pair with `security-engineering` for runtime secret handling, TLS posture, workload identity, and hardening.
- Pair with `database-engineering` when release safety depends on migrations, replication, backup, or restore coordination.
- Pair with `qa-validation` when release readiness depends on evidence from browser, accessibility, performance, or security validation, and use `../../reference/quality-gates.md` as the shared release bar.

## Overlays

- `reference/docker-kubernetes-ci-cd.md` for image build and publish flow, immutable artifacts, deployments and rollouts, probe design, runtime secret handling, and CI versus CD boundaries.
- `reference/aws-azure-gcp.md` for landing-zone structure, account or subscription or project boundaries, IAM, network topology, governance controls, and environment-class expectations.
- `reference/terraform-pulumi.md` for state and backend strategy, locking, provider and module or component boundaries, stack or workspace scoping, and drift handling.
- `reference/observability-sre.md` for SLIs and SLOs, error budgets, burn-rate alerting, runbooks, incident response, toil reduction, and coordinated metrics, logs, and traces.
- `reference/github-actions-argo.md` for GitHub Actions workflow triggers and permissions, reusable workflows, environment gates, deployment handoff, and Argo CD Application or ApplicationSet promotion control.

## Guardrails

- Do not turn this pack into a release-state machine or long-running control plane.
- Do not let CI/CD guidance become the place that decides deployment or release outcome, that stays with the harness, repo workflows, and validated workflow docs.
- Do not rely on mutable images, hidden environment drift, or untested rollback assumptions.
