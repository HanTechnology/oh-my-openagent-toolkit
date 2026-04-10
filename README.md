# Agentic Dev AI Team

`agentic-dev-ai-team/` is a project-local OpenCode bundle for the `oh-my-openagent` harness. It keeps the local layer narrow: expert packs live under `.opencode/skills/`, routing stays in a thin set of docs, and planning, execution orchestration, research, and review stay with harness-native categories and built-in helpers.

## What this bundle contains

- a project-local `.opencode/` bundle wired by `.opencode/oh-my-openagent.jsonc`
- 17 expert packs for architecture, web, mobile, backend, systems, data, security, ops, and QA work
- a curated `impeccable` anti-slop UI/UX layer with 7 imported refinement skills
- one thin routing layer: `AGENTS.md`, `.opencode/commands/route-domain.md`, and `.opencode/reference/routing-matrix.md`
- shared reference assets for migration evidence, quality gates, design anti-patterns, QA examples, and structural validation

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
      |- audit/
      |- critique/
      |- polish/
      |- typeset/
      |- colorize/
      `- adapt/
```

## How to use the bundle

1. Start with `AGENTS.md` or `.opencode/reference/routing-matrix.md` to classify the request.
2. Pick the dominant local expert pack, plus one adjacent pack only when the request truly spans domains.
3. Start in the preferred harness category from the routing matrix.
4. Add built-in helpers only when the work calls for them.
5. For UI work, layer the curated `impeccable` imports explicitly instead of relying on generic frontend wording.

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

## Curated `impeccable` anti-slop layer

The OpenCode bundle also carries a curated subset of the upstream `impeccable` UI/UX pack. This layer is supplementary to the 17 expert packs and should be added on purpose when UI quality needs a sharper pass.

- `impeccable` - umbrella anti-slop guidance
- `audit` - flaw finding and cleanup targets
- `critique` - sharper UX and product feedback
- `polish` - finishing passes
- `typeset` - typography and spacing refinement
- `colorize` - palette and contrast refinement
- `adapt` - style or platform translation

For UI work, route through `frontend-web` or `mobile-app` first, then add the exact `impeccable` imports named by the routing matrix.

## Thin routing layer

The local routing layer has exactly three surfaces:

1. `AGENTS.md` - top-level routing guide for bucket selection, helper usage, and UI layering
2. `.opencode/commands/route-domain.md` - documentation-only command for fast request classification
3. `.opencode/reference/routing-matrix.md` - source of truth for request shapes, pack selection, categories, helper fit, and explicit `impeccable` layering

This routing layer is deliberately thin. It classifies work and points to the right pack combination, but it does not track tasks, own release flow, or run local orchestration loops.

## Shared reference assets

- `.opencode/reference/migration-matrix.md` preserves the cutover mapping and taxonomy evidence
- `.opencode/reference/quality-gates.md` is the canonical threshold source for release-readiness checks
- `.opencode/reference/design-anti-slop.md` is the canonical anti-pattern ban list for UI work
- `.opencode/reference/qa/examples/` contains worked QA examples derived from the earlier bundle
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

- all 24 expected skill directories are present
- routing and shared reference assets exist
- retired runtime directories are gone
- kept runtime-facing surfaces are clean of stale retired runtime path references

## Working conventions for this bundle

- Keep local docs stateless and routing-focused.
- Add framework specificity inside pack-local `reference/` overlays, not as new top-level packs.
- Keep shared quality and anti-slop guidance in shared reference assets instead of duplicating it across packs.
- Treat the migration matrix as evidence of the cutover history, not as a runtime authority.

If you are changing the bundle itself, update the relevant routing or reference asset, then rerun the validator in `full` mode.
