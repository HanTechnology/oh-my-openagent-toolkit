---
name: service-vernacular
description: Build repo-backed domain language before rewriting user-facing copy across UI, docs, CLI, API messages, notifications, and operator surfaces without becoming a primary route.
argument-hint: "[surface, product area, or copy sample]"
user-invocable: true
---

# Service Vernacular

`service-vernacular` is a top-level user-invocable supplementary language companion. Use it to turn product and service evidence into clear, service-native wording before a primary route or collaborator applies the work.

It is not a primary route, not an implementation executor, not a routing-matrix replacement, and not a support claim.

## When to use

- User-facing wording sounds like generic SaaS copy and needs product-specific nouns, verbs, workflows, or mental models.
- A project needs a repo-backed `LANGUAGE.md` dossier created or updated before broad copy changes.
- UI text, docs, homepage/service prose, CLI output, notifications, backend or API messages, admin or operator screens, onboarding, support copy, or release notes need one shared language source.
- A rewrite needs before and after examples that show which domain evidence changed the wording.
- The work needs to preserve clarity while removing vague AI-like filler, over-broad claims, or interchangeable product language.

## When not to use

- The task is direct implementation, routing selection, test writing, deployment work, or code review.
- The request belongs fully to `frontend-web`, `mobile-app`, a backend pack, `documentation-sdk`, or another primary owner without a language-system gap.
- The user needs UI copy mechanics only. Pair with Impeccable `clarify` or Impeccable `ux-writing` instead of duplicating those rules here.
- The user needs API or SDK documentation structure, OpenAPI shape, snippets, or release-adjacent docs ownership. Pair with `documentation-sdk` and the owning backend pack.
- The only change would rename API contracts, localization keys, logs, telemetry, SDK-visible fields, or documented public semantics without explicit authorization.

## Setup and context gathering

1. Read the user request and identify the surface: UI, docs, homepage/service prose, CLI, notification, backend/API message, admin/operator, onboarding, support, or release note.
2. Run surface classification before rewrite: separate public display copy from internal rationale, evidence notes, QA notes, contract notes, and implementation/page-planning language.
3. Treat internal rationale, evidence notes, QA notes, contract notes, and implementation/page-planning language as not public display copy. They can guide the rewrite, but they must not leak into public-facing wording.
4. Collect repo evidence before rewriting: current copy, product docs, README or help text, routes, feature names, domain models, user roles, workflows, errors, and support language.
5. Run an evidence-to-public-copy workflow: map each public claim to its evidence source, state the claim boundary, draft only what the public surface needs, and keep rationale or QA notes private.
6. Find `LANGUAGE.md` at the project or service root. Treat `LANGUAGE.md` as canonical when it exists.
7. Read `DOMAIN_LANGUAGE.md` as alternate/legacy context only. When both files exist, `LANGUAGE.md` wins.
8. If neither dossier exists, propose or create `LANGUAGE.md` only after evidence supports the canonical nouns, verbs, audiences, workflows, registers, forbidden terms, and claim boundaries.
9. Keep standard labels when they are clearest, accessibility-critical, legally required, or industry-standard. Generic is allowed when it helps users act.
10. Run Korean-native review for Korean public copy before returning it. Check natural Korean phrasing, service-specific nouns, register, spacing, and whether translated evidence leaked as awkward literal wording.
11. Run the gate on every meaningful rewrite: `Could this copy belong to any generic SaaS app?`. If yes, find better evidence or keep the original if it is already clear.

## Dossier workflow

Use these same-pack references when present:

- `reference/language-dossier.md` for `LANGUAGE.md` structure, evidence requirements, root choice, and `DOMAIN_LANGUAGE.md` precedence.
- `reference/surface-registers.md` for tone and specificity across UI, docs, CLI, notifications, backend/API messages, admin/operator text, onboarding, support, and release notes.
- `reference/slop-detector.md` for spotting generic SaaS wording and applying the generic-copy gate.
- `reference/rewrite-gates.md` for clarity, standard-label preservation, usefulness, accessibility, and before/after rules.
- `reference/contract-safety.md` for protocol, API, localization, log, telemetry, SDK, and documented semantics safety.
- `reference/examples.md` for evidence-backed before and after examples.
- `reference/public-copy-protocol.md` for the evidence-to-public-copy workflow, surface classification, leakage checks, and public/private copy boundaries.
- `reference/web-service-prose.md` for homepage/service prose, landing pages, feature sections, pricing or plan copy, and other web service copy surfaces.
- `reference/korean-native-copy.md` for Korean-native review, Korean public copy quality, register, spacing, and literal-translation checks.

When updating the dossier:

1. Record evidence sources first, including paths, screens, commands, docs, or service names.
2. Add or revise canonical nouns, canonical verbs, audience terms, workflow names, glossary items, forbidden terms, surface registers, claim boundaries, and examples.
3. Mark uncertainty instead of inventing domain language.
4. Keep broad brand slogans out unless the repo proves they belong to the service voice.
5. Prefer plain, specific wording over cleverness, internal jargon, or forced branding.

## Collaboration boundaries

- `service-vernacular` supplies terminology, register evidence, dossier updates, and rewrite rationale.
- Impeccable `clarify` and Impeccable `ux-writing` own interface-copy mechanics such as button labels, error-message shape, empty states, accessibility wording, and form instructions.
- `documentation-sdk` owns API and SDK documentation structure, contract-backed references, examples, snippets, and release-adjacent documentation shape.
- `frontend-web` and `mobile-app` own UI implementation, interaction flow, component behavior, and platform-specific delivery.
- Backend packs own service behavior, endpoint semantics, API contracts, product-facing backend errors, and integration boundaries.
- Use this skill as a companion before or beside those owners, never as a replacement for their route, support posture, or implementation authority.

## Output shape

- intent card: include these fields for each public-copy pass:
  - `Surface/location`
  - `Audience/reader`
  - `Copy job`
  - `Evidence source`
  - `Claim boundary`
  - `Protected terms/contracts`
  - `Public-facing draft`
  - `Internal rationale/evidence notes`
  - `Leakage check`
  - `Korean-native review` when Korean copy exists
- Evidence sources: list the repo files, screens, commands, messages, docs, models, tickets, or user flows that shaped the language pass.
- Dossier updates: state whether `LANGUAGE.md` was created, updated, or left unchanged, and name any `DOMAIN_LANGUAGE.md` context used.
- Before/after examples: show the original wording, the proposed wording, and the evidence that made the new wording more service-native.
- Protected contracts: name any API contracts, localization keys, error codes, logs, telemetry event names, SDK-visible fields, status codes, enum values, or documented semantics left unchanged.
- Remaining uncertainties: list terms, audiences, workflows, or claims that need user or product-owner confirmation.

## Guardrails

- This skill is not a primary route and must not add a seventh bucket, workflow, or route-domain entry.
- This skill is not an implementation executor and must hand code, UI, docs, mobile, or backend changes to the owning route.
- This skill is not a routing-matrix replacement and must defer routing, helper fit, and support posture to `.opencode/reference/routing-matrix.md` and the support references.
- This skill is not a support claim and must not imply current validated coverage, public support status, or workflow status.
- Internal rationale, evidence notes, QA notes, contract notes, and page-planning language are not public display copy. Keep them out of homepage/service prose, UI strings, docs, notifications, CLI output, API messages, support copy, and release notes unless the user explicitly asks to publish that material.
- Do not rewrite machine-readable contracts unless the user explicitly authorizes the contract change.
- Do not over-brand clear functional copy. If a standard label is best for comprehension or accessibility, keep it.
- Do not use domain language that lacks evidence in the repo, product surface, or user-provided context.
