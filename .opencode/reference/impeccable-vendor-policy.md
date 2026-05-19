# Impeccable Vendor Policy

This policy defines how `oh-my-openagent-toolkit` carries Impeccable after the v3.1.1 hybrid migration. It separates upstream-owned package content from local compatibility wrappers, records the current source pin, and sets attribution expectations for local `NOTICE.md` and `LICENSE` files.

## Current Source Record

| Field | Value |
| --- | --- |
| Upstream repository | `pbakaus/impeccable` |
| Current upstream release tag | `skill-v3.1.1` |
| Current upstream commit | `4af581e23f17d112d8f9d6b7a5b7ff37823494e1` |
| Previous local pin | `5a22894b1fd7c50f50c7f801ed8ee7f0ca6cb1bf` |
| Upstream authoring source path | `skill/` |
| Generated OpenCode source path | `.opencode/skills/impeccable/` |
| Upstream release asset | `universal.zip` |
| `universal.zip` sha256 | `ad59e0dd3d3ca0a1b8ae0a4a17a0492d13d2790cb7cd67a1ae7195bee3a5852d` |
| Local upstream package path | `oh-my-openagent-toolkit/.opencode/skills/impeccable/` |
| Local wrapper paths | `oh-my-openagent-toolkit/.opencode/skills/{wrapper}/SKILL.md` |

The release asset and checksum above were captured from Task 1 evidence. Later refreshes must record the new tag, commit, asset name, asset checksum, and any replaced local pin before content changes land.

## Hybrid Ownership Model

The local Impeccable integration now uses 1 upstream consolidated skill, 23 upstream commands, and 22 local compatibility wrappers.

Upstream owns the consolidated package copied from `.opencode/skills/impeccable/` at the pinned commit. That package carries the upstream `SKILL.md`, references, scripts, command metadata, runtime helpers, and any upstream attribution files copied into the local package.

Local code owns the top-level compatibility wrappers. Wrappers keep older local entry points available, but they are not upstream-owned skills. They should stay thin, point to `/impeccable` or `/impeccable <subcommand>`, and avoid independent workflow logic, package metadata, or runtime grants that belong to the consolidated upstream skill.

This policy doesn't change routing or support governance. Impeccable remains supplementary local guidance, not a validated workflow, support tier, or primary route.

## Upstream Command Surface

The 23 upstream commands come from `scripts/command-metadata.json` in the generated package:

- `adapt`
- `animate`
- `audit`
- `bolder`
- `clarify`
- `colorize`
- `craft`
- `critique`
- `delight`
- `distill`
- `document`
- `extract`
- `harden`
- `layout`
- `live`
- `onboard`
- `optimize`
- `overdrive`
- `polish`
- `quieter`
- `shape`
- `teach`
- `typeset`

`brand`, `product`, and `codex` are upstream capability or reference surfaces, not command metadata entries. Keep them available through the consolidated `impeccable` package where upstream documents them. Don't add new top-level local wrappers for them.

## Compatibility Wrapper Policy

The 22 local compatibility wrappers are local aliases for existing entry points. They preserve user muscle memory while directing work into the consolidated upstream command model.

| Local wrapper | Target |
| --- | --- |
| `adapt` | `/impeccable adapt` |
| `animate` | `/impeccable animate` |
| `arrange` | `/impeccable layout` |
| `audit` | `/impeccable audit` |
| `bolder` | `/impeccable bolder` |
| `clarify` | `/impeccable clarify` |
| `colorize` | `/impeccable colorize` |
| `critique` | `/impeccable critique` |
| `delight` | `/impeccable delight` |
| `distill` | `/impeccable distill` |
| `extract` | `/impeccable extract` |
| `frontend-design` | `/impeccable` |
| `harden` | `/impeccable harden` |
| `normalize` | `/impeccable polish` |
| `onboard` | `/impeccable onboard` |
| `optimize` | `/impeccable optimize` |
| `overdrive` | `/impeccable overdrive` |
| `polish` | `/impeccable polish` |
| `quieter` | `/impeccable quieter` |
| `shape` | `/impeccable shape` |
| `teach-impeccable` | `/impeccable teach` |
| `typeset` | `/impeccable typeset` |

The six wrappers that previously carried deprecated local wording, `arrange`, `extract`, `frontend-design`, `normalize`, `onboard`, and `teach-impeccable`, now follow the same compatibility-wrapper policy as the rest. Don't remove them because of old deprecation wording, don't describe them as upstream-owned, and don't promote them above the consolidated `impeccable` skill.

## Attribution Policy

The upstream `SKILL.md` declares Apache 2.0 licensing and references `NOTICE.md`. The local package must therefore carry upstream attribution beside the consolidated skill package.

When vendoring or refreshing Impeccable:

1. Copy upstream root `LICENSE` into `oh-my-openagent-toolkit/.opencode/skills/impeccable/LICENSE`.
2. Copy upstream root `NOTICE.md` into `oh-my-openagent-toolkit/.opencode/skills/impeccable/NOTICE.md`.
3. Verify the local attribution files include `NOTICE`, `LICENSE`, and `Apache` markers.
4. Treat missing attribution in `universal.zip` as a packaging gap to fix locally by copying from the pinned upstream repository root.
5. Keep local wrappers attribution-neutral unless a wrapper gains its own authored material that needs separate notice handling.

## Refresh Playbook

Use this sequence when moving to a later upstream release:

1. Select the upstream tag and commit, then record both before editing local files.
2. Verify the release asset name and checksum. If the asset is `universal.zip`, confirm the sha256 independently.
3. Copy only the generated OpenCode package from `.opencode/skills/impeccable/` into the local consolidated package path.
4. Copy upstream root `NOTICE.md` and `LICENSE` into the local consolidated package when the generated package or `SKILL.md` references them.
5. Preserve the 22 local wrapper directories as local compatibility wrappers unless the plan explicitly changes the local wrapper contract.
6. Recheck that the policy still says 1 upstream consolidated skill, 23 upstream commands, and 22 local compatibility wrappers, or update the counts with matching validator changes.
7. Run the policy token check, the stale-language negative search, and the attribution marker search before handing off.
