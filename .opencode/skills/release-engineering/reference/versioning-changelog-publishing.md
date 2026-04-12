# Versioning, changelog, and publishing overlay for `release-engineering`

Use this overlay when release work is driven by SemVer policy, version-source-of-truth decisions, changelog quality, and publication of immutable artifacts to package, container, or binary distribution channels.

## Scope

- the release unit spans version numbers, tags, changelog entries, and published artifacts,
- draft, prerelease, and stable channels need explicit boundaries and promotion rules,
- package registries, container registries, or binary distribution steps are part of the same release flow.

## Required concepts

- Define the version source of truth on purpose: manifests, tags, generated metadata, and published artifacts should agree on the release number and compatibility window.
- Apply SemVer or the repo's declared variant consistently so breaking, additive, and fix-level changes map to predictable version bumps and client expectations.
- Keep changelog and release-note structure user-impact oriented: group changes by capability, highlight required actions, and make deprecations or migrations easy to spot.
- Publish immutable artifacts to explicit channels and repositories, and make draft, prerelease, and stable states visible in automation, naming, and release records.

## Watchouts

- Avoid version bumps that hide breaking changes in minor or patch releases, or changelog flows that only mirror commit noise.
- Avoid mutable tags, republished artifacts, or undocumented channel changes that make it impossible to trace what users installed.
- Avoid treating publish automation as the only source of truth when the release record, changelog, and artifact metadata disagree.

## First-party anchors

- Pair this overlay with `../../documentation-sdk/SKILL.md` when release notes, upgrade guides, or API reference updates must ship with the cut.
- Pair this overlay with `rollback-promotion-feature-flags.md` when channel promotion, staged exposure, or rollback planning shapes the release policy as much as versioning itself.
