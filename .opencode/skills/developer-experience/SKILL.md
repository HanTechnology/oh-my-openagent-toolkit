---
name: developer-experience
description: Improve contributor inner loops, onboarding, local setup ergonomics, and fast feedback without absorbing CI, deployment, or runtime operations.
---

# Developer Experience

Use this pack as a bounded planned adjacent surface after `../../reference/routing-matrix.md` points here for contributor-facing workflow work: onboarding, local setup contracts, repo ergonomics, package and workspace conventions, fast feedback loops, and review norms that shape the pre-merge inner loop.

This pack keeps the local developer path explicit, fast, and debuggable once the dominant route is already chosen. It is not the primary place to discover adjacent-pack routing, helper fit, or support posture, so send that first pass back to `../../reference/routing-matrix.md`. Use the overlays in `reference/package-managers-monorepos.md` and `reference/local-dev-environments.md` when workspace shape, toolchain constraints, local services, or environment setup details dominate the task, and keep CI, deployment, and runtime ownership with `devops-platform`.

For setup posture, prefer refining an existing project in place. Treat direct `create` / `init` / `new` flows as greenfield-only and use them only when explicitly requested. Defer the full setup policy to `../../reference/project-setup-policy.md`.

## Core focus

- Reduce time from clone to first successful local change.
- Make setup prerequisites, toolchain versions, scripts, and environment expectations explicit.
- Keep workspace, dependency, and task-runner behavior readable across repos and monorepos.
- Optimize pre-merge feedback loops for lint, typecheck, tests, local preview, and debugging.
- Improve review handoff, contributor guidance, and friction reporting without inventing a separate ops layer.

## Shared standards

- Treat the local dev contract as a product surface: required versions, bootstrap commands, environment files, and local services should be easy to discover and repeat.
- Prefer one clear package-manager and lockfile story per repo or workspace; mixed installers and hidden fallbacks create support debt fast.
- Keep root scripts, package scripts, workspace tasks, and cache behavior predictable so contributors know where to run checks and why.
- Make feedback loops incremental when possible: narrow tasks, fast smoke checks, and reusable setup steps should come before heavyweight full-repo commands.
- Capture setup friction in docs or scripts while it is fresh instead of relying on reviewer memory or tribal knowledge.

## Default workflow

1. Read `../../reference/routing-matrix.md` first so planned-adjacent routing, helper discovery, and non-primary positioning come from the matrix instead of this pack.
2. Inspect current contributor friction: prerequisites, setup steps, workspace layout, local services, and slow feedback loops.
3. Choose the relevant overlay: `reference/package-managers-monorepos.md` for workspace and toolchain shape, or `reference/local-dev-environments.md` for environment bootstrap and parity concerns.
4. Make the local contract explicit through scripts, version managers, environment examples, and contributor-facing instructions before optimizing edge cases.
5. Shorten the inner loop for the highest-frequency tasks first: install, run, test, lint, typecheck, and basic debugging.
6. Run `review-work` after substantial developer-experience changes.

## Collaboration in this repo

- Use `Explore` before editing so local setup scripts, workspace rules, and contributor docs match existing repo conventions.
- Use `Librarian` or `Context7` when package-manager, workspace, or local environment tooling details need a source-of-truth check.
- Treat this pack as planned and non-primary for routing discovery, and defer adjacent-pack choice or helper selection back to `../../reference/routing-matrix.md`.
- Pair with `devops-platform` when local development depends on containers, seeded services, or environment parity, but keep contributor ergonomics as the primary outcome.
- Pair with `documentation-sdk` when onboarding, command docs, or examples need to become durable reference material.

## Overlays

- `reference/package-managers-monorepos.md` for workspace boundaries, lockfile and package-manager choices, task orchestration, and monorepo ergonomics.
- `reference/local-dev-environments.md` for prerequisites, environment files, local services, containerized dev setups, seeded data, and cross-platform setup friction.

## Guardrails

- Do not let this pack absorb CI, deployment, or runtime-operations ownership.
- Do not hide setup rules in tribal knowledge, one-off shell steps, or reviewer folklore.
- Do not let this planned adjacent pack read like a primary routing or support surface.
- Do not optimize one local machine shape while leaving the repo-wide contributor contract implicit.
