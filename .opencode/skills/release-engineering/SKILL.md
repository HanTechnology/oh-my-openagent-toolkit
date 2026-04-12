---
name: release-engineering
description: Deliver versioning, changelog, publication, promotion, and rollback guidance for shipped artifacts without absorbing deployment or runtime operations.
---

# Release Engineering

Use this pack for versioned delivery work: SemVer policy, changelog and release-note flow, package or artifact publication, prerelease versus stable boundaries, promotion decisions, and rollback framing around shipped changes.

This pack owns the versioned artifact and release communication surface, not runtime orchestration. Use the overlays in `reference/versioning-changelog-publishing.md` and `reference/rollback-promotion-feature-flags.md` when version policy, publication flow, promotion stages, kill switches, or release-safety framing dominates the task, and keep live deploy mechanics in `devops-platform`.

## Core focus

- Define versioning policy and compatibility expectations before the release train starts moving.
- Make changelog and release-note flow user-impact oriented instead of commit-log oriented.
- Treat artifact publication and channel promotion as controlled release surfaces with explicit states.
- Plan rollback, staged promotion, and feature-flag behavior before declaring a release stable.
- Keep release evidence, docs, and QA handoff aligned around the same versioned unit.

## Shared release standards

- Keep one clear source of truth for version numbers, tags, release metadata, and published artifact identity.
- Use immutable release units and explicit channels for draft, prerelease, and stable states instead of mutating one moving target.
- Apply SemVer or the repo's declared variant consistently so compatibility promises stay readable to downstream users.
- Make changelog and release-note entries explain user-visible impact, required actions, and rollback-relevant constraints.
- Treat promotion, rollback, and feature-flag decisions as part of release design, not as after-the-fact operational improvisation.

## Default workflow

1. Inspect the release unit, version source of truth, publication targets, compatibility window, and rollback constraints.
2. Choose the relevant overlay: `reference/versioning-changelog-publishing.md` for version policy and artifact publication, or `reference/rollback-promotion-feature-flags.md` for staged exposure and recovery framing.
3. Define the version change, changelog shape, publication plan, and release channel before automation starts cutting artifacts.
4. Align promotion criteria, rollback paths, and flag behavior with QA evidence and documentation updates.
5. Run `review-work` after substantial release-engineering changes.

## Collaboration in this repo

- Use `Explore` before editing so version files, changelog structure, release notes, and publication scripts match local conventions.
- Use `Librarian` or `Context7` when registry, packaging, or versioning-tool details need a source-of-truth check.
- Pair with `documentation-sdk` when release notes, upgrade guides, or API reference updates must ship with the cut.
- Pair with `qa-validation` when promotion or rollback thresholds depend on explicit release-readiness evidence.
- Pair with `devops-platform` when publication feeds deployment handoff or environment promotion, while keeping runtime operations outside this pack.

## Overlays

- `reference/versioning-changelog-publishing.md` for SemVer policy, changelog shape, immutable artifacts, and publication channels.
- `reference/rollback-promotion-feature-flags.md` for release stages, rollback criteria, feature-flag exposure, and kill-switch framing.

## Guardrails

- Do not let this pack become general deployment or runtime-operations authority.
- Do not blur draft, prerelease, and stable states or hide rollback assumptions behind automation.
- Do not publish mutable or undocumented release units.
