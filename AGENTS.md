# AGENTS Guide

From the repo root, this bundle stays intentionally thin and non-control-plane. Use this file to understand boundaries and reading order, not to re-state the routing table. Local routing, category nuance, helper fit and discovery, browser-helper discovery, adjacent-pack discoverability, and compact workspace reminders belong to `.opencode/reference/routing-matrix.md`. Support and validation claims belong to the support references. Detailed workspace guidance belongs to the workspace reference.

## What each document owns

1. `.opencode/commands/route-domain.md` is the local command entry point.
2. `.opencode/reference/routing-matrix.md` is the authoritative local routing and helper map. It owns request-shape buckets, routing pack choices, recommended starting categories, helper fit and helper discovery, browser-helper discovery, adjacent-pack discoverability including planned adjacent references, supplementary UI refinement notes, and compact workspace reminders.
3. `.opencode/reference/support-policy.md` is the authoritative support-policy reference for public claim boundaries.
4. `.opencode/reference/workflow-catalog.md` is the authoritative validated-workflow inventory.
5. `.opencode/reference/workspace-model.md` is the authoritative workspace-guidance reference.
6. `.opencode/reference/capability-matrix.json` remains the machine-readable source of truth for `validated`, `guided`, and `planned` support tiers.

## Read this bundle in order

1. Start with `.opencode/reference/routing-matrix.md` to classify the request and choose the local route.
2. Check `.opencode/reference/support-policy.md` and `.opencode/reference/workflow-catalog.md` before making any support or validation claim.
3. Read `.opencode/reference/workspace-model.md` when output placement or repo/worktree boundaries matter.

## Separate axes, kept distinct

- `bucket` means the fixed request-shape grouping used for first-pass classification.
- `pack` means the local expert route chosen from the matrix.
- `category` means the recommended starting harness lane, not a permanent lock.
- `helper` means an optional built-in aid named by the matrix when it strengthens execution.
- support or validation status means whether coverage is `validated`, `guided`, or `planned`, and that authority stays with `.opencode/reference/capability-matrix.json`, `.opencode/reference/support-policy.md`, and `.opencode/reference/workflow-catalog.md`.

Keep those axes separate here. This file does not restate the full routing matrix, does not widen support claims, and does not treat upstream helper roles as locally owned policy. Built-in helpers remain upstream-owned and non-normative in this file. For category nuance, helper fit, browser-helper discovery, and adjacent-pack discoverability, defer to `.opencode/reference/routing-matrix.md`.

## Workspace reminder

The bundle-wide workspace rule is simple here: new greenfield work started from the active repo or worktree defaults to `workspace/{project-name}-{domain}`, while existing projects stay in place. For the detailed convention and non-goals, read `.opencode/reference/workspace-model.md`.

If a request needs concrete routing, category guidance, helper selection, browser-helper discovery, or adjacent-pack pairing and discoverability, go to `.opencode/reference/routing-matrix.md` first. If it needs a public support statement, check `.opencode/reference/support-policy.md` and `.opencode/reference/workflow-catalog.md` before claiming anything beyond the current validated surface.
