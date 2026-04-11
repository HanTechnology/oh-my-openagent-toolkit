# Agentic Dev AI Team

`agentic-dev-ai-team/` is a project-local OpenCode bundle for the `oh-my-openagent` harness. It keeps the local layer narrow: expert packs, overlays, and the local `impeccable` family live under `.opencode/skills/`, routing stays in a thin set of docs, and planning, execution orchestration, research, and review stay with harness-native categories and built-in helpers.

## Current support model

This bundle uses one manifest backed support model with three tiers:

- `validated` for the narrow `supported now` surface
- `guided` for current routing and reference coverage that is available today but not publicly claimed as fully validated
- `planned` for named expansion surfaces that are reserved in the manifest and not yet current support claims

Use `.opencode/reference/capability-matrix.json` as the source of truth for tiers, `.opencode/reference/support-policy.md` for the README claim rule, and `.opencode/reference/workflow-catalog.md` for the validated workflow registry.

### Validated now

These are the only current `supported now` capabilities because they are the only manifest entries marked `validated`:

- `frontend-product-delivery` for proof-backed frontend product delivery
- `backend-service-delivery` for proof-backed backend and API delivery
- `cloud-release-readiness` for proof-backed release-readiness and rollout work
- `ai-data-product-delivery` for proof-backed AI and data-product delivery

Each validated workflow names a primary route, an adjacent-pack rule, helper fit, a support-tier boundary, and an evidence contract under `.opencode/reference/workflows/`.

### Guided coverage

Most of the bundle’s manifest-backed inventory is current `guided` coverage. That includes the expert packs under `.opencode/skills/` and their implemented overlays. These surfaces are current, routable, and documented, but they are not the README `supported now` claim set unless the manifest promotes them to `validated`.

Guided coverage includes:

- expert-pack routing across architecture, frontend, mobile, backend, systems, data, security, QA, and platform work
- implemented pack-local overlays for specific ecosystems and frameworks
- browser-3D guidance routed through `frontend-web`, with `systems-rust` used only for measured WASM or performance escalation and `qa-validation` used for verification guidance

Other included local assets such as the thin routing docs, shared reference files, and the vendored `impeccable` family support bundle use and refinement, but the README’s tier labels are reserved for manifest-backed capabilities.

### Planned next

Some manifest entries are still `planned`. Those entries reserve future expansion surfaces and keep the roadmap visible without overstating present support. Treat them as known next coverage, not as current routing proof or public support claims.

Planned next currently includes reserved adjacent packs, overlays, and other manifest entries that remain held for later promotion.

For browser-3D specifically, XR and CAD stay compact reserved surfaces in wave 1. They are planned only, so they stay visible as next-step routing context without being presented as current validated support.

## What this bundle contains

- a project-local `.opencode/` bundle wired by `.opencode/oh-my-openagent.jsonc`
- one manifest-backed support model with exactly three tiers: `validated`, `guided`, and `planned`
- four frozen flagship workflows that make up the only current README `supported now` surface
- broad current guided coverage through current expert packs, implemented overlays, and UI refinement skills under `.opencode/skills/`
- named planned adjacent workflow and expansion surfaces that stay visible without being overclaimed as current support
- one thin routing layer: `AGENTS.md`, `.opencode/commands/route-domain.md`, and `.opencode/reference/routing-matrix.md`
- shared reference assets for support policy, workflow catalog, workflow proof contracts, migration evidence, quality gates, QA examples, workspace conventions, and structural validation

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
   |  |- capability-matrix.json
   |  |- support-policy.md
   |  |- workflow-catalog.md
   |  |- routing-matrix.md
   |  |- workspace-model.md
   |  |- quality-gates.md
   |  |- design-anti-slop.md
   |  |- qa/examples/
   |  |- workflows/
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
5. For UI work, start with `frontend-web` or `mobile-app`, then layer the exact `impeccable` imports the routing matrix names. Browser-3D stays inside `frontend-web` guided coverage rather than becoming a separate routing bucket.
6. Apply the bundle workspace convention: new greenfield outputs default to `workspace/{project-name}-{domain}` inside the active repo or worktree, while existing projects stay in place.
7. Use `support-policy.md` and `workflow-catalog.md` when you need to distinguish current `supported now` workflows from broader guided or planned coverage.

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

## Guided expert-pack coverage

These expert packs are part of the bundle's current `guided` coverage. They are the main routing surfaces for current work, but they are not equal validation claims. Public `supported now` language stays reserved for the four validated workflows until the manifest promotes more coverage.

### Architecture and product surfaces

- `architecture-integration` - cross-stack design, API contracts, service boundaries, and integration shape
- `frontend-web` - browser UI, design systems, frontend implementation, and anti-slop coordination
- `frontend-web` also owns current browser-3D guided coverage. Route browser-3D work here first, escalate to `systems-rust` only for measured WASM or performance bottlenecks, and use `qa-validation` for verification depth. This is guided coverage, not a separate validated workflow surface.
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

## Planned adjacent packs

Some adjacent packs already have files in the bundle, but the manifest keeps them at `planned` today. Treat them as reserved next coverage rather than current guided or validated support.

For browser-3D adjacencies, XR and CAD remain planned only. They are visible roadmap surfaces, not current validated support and not a signal to route browser-3D away from `frontend-web` first.

## Included local `impeccable` layer

The OpenCode bundle carries the full frozen local `impeccable` layer as a vendored-snapshot companion family. This layer is a supplementary local refinement asset, not a separate validated workflow surface and not a manifest-backed support tier. For implementation authority on UI work, route through `frontend-web` or `mobile-app` first, then add the exact `impeccable` skills that fit the request.

- Primary `impeccable` skills: `impeccable`, `adapt`, `animate`, `arrange`, `audit`, `bolder`, `clarify`, `colorize`, `critique`, `delight`, `distill`, `extract`, `harden`, `normalize`, `onboard`, `optimize`, `overdrive`, `polish`, `quieter`, `shape`, `typeset`
- Deprecated wrappers kept as included but non-primary: `frontend-design`, `teach-impeccable`

Do not promote every imported wrapper to a top-level recommendation. Keep `frontend-web` and `mobile-app` as the primary implementation packs, then add `impeccable` skills as targeted refinement layers.

## Thin routing layer

The local routing layer has exactly three surfaces:

1. `AGENTS.md` - top-level routing guide for bucket selection, helper usage, and UI layering
2. `.opencode/commands/route-domain.md` - documentation-only command for fast request classification
3. `.opencode/reference/routing-matrix.md` - source of truth for request shapes, pack selection, categories, helper fit, explicit `impeccable` layering, and compact workspace-rule reminders

Support tiers and public-claim boundaries live elsewhere on purpose:

- `.opencode/reference/capability-matrix.json` is the machine-readable inventory and tier source of truth
- `.opencode/reference/support-policy.md` defines the `validated / guided / planned` contract and the README claim rule
- `.opencode/reference/workflow-catalog.md` lists the only current `validated` workflows and points to their proof contracts

For the full workspace convention, read `.opencode/reference/workspace-model.md`. That document is the authority for where greenfield outputs go by default, why existing projects stay in place, and why this rule is documentation-backed guidance rather than a native runtime feature.

This routing layer is deliberately thin. It classifies work and points to the right pack combination. It does not flatten support tiers, track tasks, own release flow, or run local orchestration loops.

## Shared reference assets

- `.opencode/reference/migration-matrix.md` preserves the cutover mapping, frozen 23-skill `impeccable` inventory, and taxonomy evidence
- `.opencode/reference/capability-matrix.json` is the source of truth for support tiers and current capability inventory
- `.opencode/reference/support-policy.md` defines the support-tier contract and README claim boundary
- `.opencode/reference/workflow-catalog.md` is the human-readable registry for the four validated workflows
- `.opencode/reference/workflows/` contains the proof-contract docs behind the validated workflow set
- `.opencode/reference/quality-gates.md` is the canonical threshold source for release-readiness checks
- `.opencode/reference/design-anti-slop.md` is the canonical anti-pattern ban list for UI work
- `.opencode/reference/qa/examples/` contains worked QA examples derived from the earlier bundle
- `.opencode/reference/workspace-model.md` is the authoritative explanation of the bundle-wide workspace convention
- `.opencode/reference/validate-opencode-bundle.sh` is the structural validator for the current local bundle shape

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

`full` checks the current local bundle shape:

- expected local skill directories are present
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
