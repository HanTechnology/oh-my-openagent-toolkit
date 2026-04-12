---
name: qa-validation
description: Deliver evidence-oriented QA guidance for browser validation, accessibility, performance, security, and cross-browser coverage while pointing detailed thresholds and examples to shared reference assets.
---

# QA Validation

Use this pack for validation work: browser-based testing, accessibility review, performance checks, security validation, cross-browser coverage, and evidence capture. Route category and escalation decisions through `../../reference/routing-matrix.md`, which keeps bounded validation and evidence work in the lighter lane and sends higher-risk release or platform coordination elsewhere.

This pack defines what to verify and what evidence to gather. It does not choose the harness route or release path on its own, those decisions defer to `../../reference/routing-matrix.md` and the validated workflow inventory in `../../reference/workflow-catalog.md`. Use the overlays in `reference/api-contract-load-visual.md`, `reference/mobile-test-matrix.md`, and `reference/browser-3d-validation.md` to sharpen contract matcher choice, provider states, representative load, visual baseline, mobile-matrix coverage, and browser-3D fallback, asset-readiness, and runtime-variation decisions, while detailed thresholds, reusable examples, and shared QA references stay in `../../reference/quality-gates.md` and `../../reference/qa/examples/` instead of being duplicated here.

## Core focus

- Validate real user journeys with browser-based checks, including happy paths, edge cases, and failure handling.
- Cover accessibility with WCAG-oriented checks for semantics, keyboard use, focus order, labels, contrast, and assistive-technology signals.
- Measure performance with Core Web Vitals, page responsiveness, and regression-aware runtime checks.
- Include security validation for auth flows, authorization boundaries, headers, input handling, and vulnerability-scanning results.
- Verify cross-browser and multi-viewport behavior on the flows that matter most.
- Keep the output evidence-oriented: screenshots, snapshots, logs, metrics, and concise pass or fail findings.

## Shared QA standards

- Prefer live browser validation for critical user flows instead of relying only on isolated unit behavior.
- Keep bounded validation, finish-pass checks, and evidence capture small enough for the lighter lane when the matrix says the scope and coordination risk stay low.
- Record enough evidence for another engineer to understand what was tested, where it ran, and why it passed or failed.
- Treat accessibility, performance, and security as first-class QA dimensions, not optional extras after functional checks.
- Verify both success paths and failure paths: invalid input, unauthorized access, degraded network behavior, and recovery states.
- Use the shared QA assets in `../../reference/quality-gates.md` and `../../reference/qa/examples/` as the canonical source for thresholds, examples, and reusable checklists.

## Default workflow

1. Read `../../reference/routing-matrix.md` first so the harness lane and escalation level come from the matrix instead of this pack.
2. Inspect the feature risk, critical flows, supported browsers, and likely failure modes.
3. Pull thresholds and reusable examples from `../../reference/quality-gates.md` and `../../reference/qa/examples/`, then choose the relevant overlay or overlay set: `reference/api-contract-load-visual.md` for contract, load, and visual evidence depth, `reference/mobile-test-matrix.md` for device, form-factor, and real-device coverage policy, or `reference/browser-3d-validation.md` for capability detection outcomes, asset readiness, frame pacing, and degraded browser-3D behavior.
4. Run browser, accessibility, performance, security, contract, load, visual, and mobile-matrix checks at the depth the change requires.
5. Capture screenshots, accessibility snapshots, logs, and metric output so the result is evidence-backed.
6. Escalate through the matrix when the work shifts from bounded validation into release, platform, rollback, or broader delivery risk.
7. Run `review-work` after substantial validation or release-readiness work.

## Collaboration in this repo

- Use `Explore` before editing or validating so new checks match local flow names, routes, and fixtures.
- Use harness browser helpers such as `agent-browser` or `dev-browser` for live browser execution, and use `review-work` for a final review sweep.
- Pair with `security-engineering` when auth, authorization, or vulnerability findings need deeper analysis.
- Pair with `devops-platform` when release readiness depends on environment health, deployment shape, or rollout evidence.

## Overlays

- `reference/api-contract-load-visual.md` for API contract assertions, matcher philosophy, provider states, representative load profiles, visual baseline policy, and release-risk checks on critical surfaces.
- `reference/mobile-test-matrix.md` for device, OS, browser, and form-factor coverage planning, real-device versus simulator policy, localization and accessibility axes, and state-sensitive mobile behavior.
- `reference/browser-3d-validation.md` for browser-3D capability detection outcomes, fallback and degraded-state expectations, asset-readiness stages, frame-time or jank observation, and representative browser-device-GPU coverage.

## Guardrails

- Do not duplicate shared threshold tables, QA examples, or anti-slop reference material inside this pack.
- Do not hardcode one browser harness or one MCP path as the only valid execution surface.
- Do not turn this pack into the place that decides whether a release proceeds.
