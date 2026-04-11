# Package managers and monorepos overlay for `developer-experience`

Use this overlay when contributor workflow friction is driven by workspace layout, package-manager choice, lockfile policy, or task orchestration across a monorepo or multi-package repo.

## Reach for this overlay when

- workspaces, packages, apps, or shared libraries need a clear install and task story,
- npm, pnpm, Yarn, Bun, Turborepo, Nx, Lage, or similar tooling shapes local commands and cache behavior,
- debugging setup friction depends on hoisting, linking, generated files, or root-versus-package execution rules.

## Working rules

- Pick one package-manager and lockfile contract for the repo, make the bootstrap path explicit, and pin the toolchain with version managers or Corepack-style metadata when needed.
- Keep workspace boundaries readable: apps, packages, shared config, generated code, and build outputs should live behind stable conventions rather than ad hoc cross-package imports.
- Define root tasks and package-level tasks on purpose so contributors know which commands are global checks, which are local iteration loops, and what cache or affected-only behavior they should expect.
- Make dependency resolution rules visible: hoisting, isolated installs, peer dependency handling, and generated client or schema outputs should not surprise someone adding or upgrading a package.

## Watchouts

- Avoid mixed lockfiles, unofficial secondary installers, or scripts that silently switch package managers between docs, CI, and local usage.
- Avoid monorepo layouts where every task must be learned from folklore instead of a discoverable root contract.
- Avoid hidden dependency coupling created by hoisting luck, unchecked relative imports, or generated artifacts committed without ownership rules.

## First-party anchors

- Treat the selected package manager, workspace config, and task-runner config in the repo as the source of truth instead of recreating install rules in multiple docs.
- Pair this overlay with `local-dev-environments.md` when local services, containers, or cross-platform toolchains shape the contributor path as much as workspace layout.
