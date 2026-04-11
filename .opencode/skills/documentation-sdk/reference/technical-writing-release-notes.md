# Technical writing and release notes overlay for `documentation-sdk`

Use this overlay when documentation quality depends on audience-aware writing, task-oriented structure, release-note clarity, and upgrade guidance that should ship with the change.

## Reach for this overlay when

- docs must explain why a change matters, how to use it, and what changed for existing users,
- migrations, deprecations, or compatibility windows need clear prose instead of raw schema diffs,
- release notes, changelog-adjacent summaries, or doc refreshes must land alongside a feature or fix.

## Working rules

- Write for the reader's task and level of context: front-load prerequisites, expected outcomes, failure modes, and next steps instead of narrating implementation details first.
- Keep code samples and command examples copy-paste-safe, labeled with intent, and scoped to the smallest useful workflow a reader can complete.
- Treat release notes as user-impact communication: call out new capabilities, fixes, breaking changes, deprecations, migrations, and required actions rather than mirroring commit history.
- Update the affected guides, reference docs, snippets, and release-note surfaces in the same change path so docs do not trail the shipped behavior.

## Watchouts

- Avoid documentation that explains internal implementation but leaves the user task, prerequisite, or migration step implicit.
- Avoid release notes that are just commit subjects, ticket numbers, or generic "various improvements" language.
- Avoid examples that omit constraints, auth context, or cleanup steps readers need to reproduce the result safely.

## First-party anchors

- Pair this overlay with `../SKILL.md` to keep release-adjacent doc work tied to the documentation source of truth instead of scattering change explanation across unrelated files.
- Pair this overlay with `../../release-engineering/SKILL.md` when the writing must align with version bumps, channel promotion, or publication timing.
