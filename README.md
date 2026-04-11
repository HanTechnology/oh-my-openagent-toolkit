# Agentic Dev AI Team

`agentic-dev-ai-team/` is a project-local OpenCode bundle for the `oh-my-openagent` harness. It keeps the local layer narrow: expert packs and the local `impeccable` family live under `.opencode/skills/`, routing stays in a thin set of docs, and planning, execution orchestration, research, and review stay with harness-native categories and built-in helpers.

## What this bundle contains

- a project-local `.opencode/` bundle wired by `.opencode/oh-my-openagent.jsonc`
- 17 expert packs for architecture, web, mobile, backend, systems, data, security, ops, and QA work
- 23 local `impeccable` skills, imported as a full supplementary UI and refinement layer
- 40 total local skills across the bundle
- one thin routing layer: `AGENTS.md`, `.opencode/commands/route-domain.md`, and `.opencode/reference/routing-matrix.md`
- shared reference assets for migration evidence, quality gates, design anti-patterns, QA examples, workspace conventions, and structural validation

The bundle is intentionally stateless. It does not recreate a local control plane, persistent runtime layer, task authority, or local orchestration loop.

## Bundle layout

```text
agentic-dev-ai-team/
|- AGENTS.md
|- README.md
`- .opencode/
   |- oh-my-openagent.jsonc
   |- commands/
   |  `- route-domain.md
   |- reference/
   |  |- migration-matrix.md
   |  |- routing-matrix.md
   |  |- quality-gates.md
   |  |- design-anti-slop.md
   |  |- qa/examples/
   |  `- validate-opencode-bundle.sh
   `- skills/
      |- architecture-integration/
      |- frontend-web/
      |- mobile-app/
      |- backend-node/
      |- backend-python/
      |- backend-jvm/
      |- backend-dotnet/
      |- backend-go/
      |- systems-rust/
      |- systems-c-cpp/
      |- functional-platform/
      |- php-ruby-platform/
      |- data-ml-platform/
      |- database-engineering/
      |- security-engineering/
      |- devops-platform/
      |- qa-validation/
      |- impeccable/
      |- adapt/
      |- animate/
      |- arrange/
      |- audit/
      |- bolder/
      |- clarify/
      |- colorize/
      |- critique/
      |- delight/
      |- distill/
      |- extract/
      |- frontend-design/
      |- harden/
      |- normalize/
      |- onboard/
      |- optimize/
      |- overdrive/
      |- polish/
      |- quieter/
      |- shape/
      |- teach-impeccable/
      `- typeset/
```

## How to use the bundle

1. Start with `AGENTS.md` or `.opencode/reference/routing-matrix.md` to classify the request.
2. Pick the dominant local expert pack, plus one adjacent pack only when the request truly spans domains.
3. Start in the preferred harness category from the routing matrix.
4. Add built-in helpers only when the work calls for them.
5. For UI work, start with `frontend-web` or `mobile-app`, then layer the exact `impeccable` imports the routing matrix names.
6. Apply the bundle workspace convention: new greenfield outputs default to `workspace/{project-name}-{domain}` inside the active repo or worktree, while existing projects stay in place.

## Harness-native execution model

This repo relies on the harness for planning, execution support, discovery, and review instead of recreating those roles locally.

### Categories

- `deep` for architecture, backend, systems, data, and security-heavy implementation
- `unspecified-high` for broad UI and multi-surface execution work
- `quick` for QA, deployment, and short verification-oriented tasks

### Built-in helpers

- `Prometheus` for planning and execution breakdowns before larger changes
- `Explore` for fast repo discovery and pattern hunting
- `Librarian` for source-of-truth lookup and documentation-backed work
- `Oracle` for architecture, quality, and security challenge passes
- `review-work` for a final implementation review sweep
- `frontend-ui-ux` for stronger product, layout, and interaction judgment on UI work
- `git-master` only when the task actually depends on git history or branch hygiene

The local bundle points to packs and references. The harness owns orchestration.

## The 17 expert packs

### Architecture and product surfaces

- `architecture-integration` - cross-stack design, API contracts, service boundaries, and integration shape
- `frontend-web` - browser UI, design systems, frontend implementation, and anti-slop coordination
- `mobile-app` - native and cross-platform app delivery with mobile-specific UX guidance

### Backend families

- `backend-node` - Node-based service delivery with framework overlays
- `backend-python` - Python service delivery with framework overlays
- `backend-jvm` - JVM backend delivery for Java and Kotlin ecosystems
- `backend-dotnet` - .NET service delivery and platform conventions
- `backend-go` - Go services, APIs, and concurrency-oriented backend work

### Systems and polyglot platforms

- `systems-rust` - Rust systems, native integration, and performance-sensitive implementation
- `systems-c-cpp` - C and C++ systems programming, embedded boundaries, and toolchain-aware work
- `functional-platform` - functional-language platform work and framework overlays
- `php-ruby-platform` - PHP and Ruby platform delivery across modern framework families

### Data, security, and delivery

- `data-ml-platform` - ML systems, data platforms, specialized pipelines, and high-throughput platform work
- `database-engineering` - schema design, migrations, query quality, and storage architecture
- `security-engineering` - auth, hardening, threat modeling, and security review support
- `devops-platform` - containers, CI/CD, infrastructure delivery, and rollout readiness
- `qa-validation` - verification strategy, test depth, release-readiness checks, and evidence expectations

## Full local `impeccable` layer

The OpenCode bundle carries the full frozen local `impeccable` layer: 23 skills total, imported as a vendored-snapshot companion family. This layer is supplementary to the 17 expert packs. For implementation authority on UI work, route through `frontend-web` or `mobile-app` first, then add the exact `impeccable` skills that fit the request.

- Primary `impeccable` skills: `impeccable`, `adapt`, `animate`, `arrange`, `audit`, `bolder`, `clarify`, `colorize`, `critique`, `delight`, `distill`, `extract`, `harden`, `normalize`, `onboard`, `optimize`, `overdrive`, `polish`, `quieter`, `shape`, `typeset`
- Deprecated wrappers kept as included but non-primary: `frontend-design`, `teach-impeccable`

Do not promote every imported wrapper to a top-level recommendation. Keep `frontend-web` and `mobile-app` as the primary implementation packs, then add `impeccable` skills as targeted refinement layers.

## Thin routing layer

The local routing layer has exactly three surfaces:

1. `AGENTS.md` - top-level routing guide for bucket selection, helper usage, and UI layering
2. `.opencode/commands/route-domain.md` - documentation-only command for fast request classification
3. `.opencode/reference/routing-matrix.md` - source of truth for request shapes, pack selection, categories, helper fit, explicit `impeccable` layering, and compact workspace-rule reminders

For the full workspace convention, read `.opencode/reference/workspace-model.md`. That document is the authority for where greenfield outputs go by default, why existing projects stay in place, and why this rule is documentation-backed guidance rather than a native runtime feature.

This routing layer is deliberately thin. It classifies work and points to the right pack combination, but it does not track tasks, own release flow, or run local orchestration loops.

## Shared reference assets

- `.opencode/reference/migration-matrix.md` preserves the cutover mapping, frozen 23-skill `impeccable` inventory, and taxonomy evidence
- `.opencode/reference/quality-gates.md` is the canonical threshold source for release-readiness checks
- `.opencode/reference/design-anti-slop.md` is the canonical anti-pattern ban list for UI work
- `.opencode/reference/qa/examples/` contains worked QA examples derived from the earlier bundle
- `.opencode/reference/workspace-model.md` is the authoritative explanation of the bundle-wide workspace convention
- `.opencode/reference/validate-opencode-bundle.sh` is the structural validator for the final phase-1 state

## Local config

`.opencode/oh-my-openagent.jsonc` keeps the local config intentionally small:

```jsonc
{
  "paths": {
    "skills": ["./skills"],
    "commands": ["./commands"],
    "reference": ["./reference"]
  }
}
```

That file only wires the bundle roots. It does not define local custom agents or a secondary control plane.

## Validation

Run the structural validator from the repository root:

```sh
bash agentic-dev-ai-team/.opencode/reference/validate-opencode-bundle.sh foundation
bash agentic-dev-ai-team/.opencode/reference/validate-opencode-bundle.sh full
```

`foundation` checks the bundle skeleton and canonical directory shape.

`full` checks the final phase-1 state:

- all 40 expected skill directories are present
- routing and shared reference assets exist
- retired runtime directories are gone
- kept runtime-facing surfaces are clean of stale retired runtime path references and workspace-rule drift

## Working conventions for this bundle

- Keep local docs stateless and routing-focused.
- Add framework specificity inside pack-local `reference/` overlays, not as new top-level packs.
- Keep shared quality and anti-slop guidance in shared reference assets instead of duplicating it across packs.
- Treat `workspace/{project-name}-{domain}` as the default landing zone for new greenfield outputs inside the active repo or worktree. Existing projects stay where they already live.
- Treat the workspace rule as bundle documentation, not as an automatic runtime routing feature.
- Treat the migration matrix as evidence of the cutover history, not as a runtime authority.

If you are changing the bundle itself, update the relevant routing or reference asset, then rerun the validator in `full` mode.
