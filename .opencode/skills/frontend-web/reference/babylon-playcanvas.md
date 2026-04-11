# Babylon.js and PlayCanvas overlay for `frontend-web`

Use this overlay when browser-3D delivery depends on Babylon.js or PlayCanvas and engine-level scene optimization matters more than framework-level UI structure.

## Scope

- Babylon.js or PlayCanvas is the primary engine family for the scene runtime,
- PBR materials, lighting, and scene optimization choices dominate visual quality and performance,
- staged loading, inspection tooling, and asset handoff decisions shape the implementation.

## Required concepts

- Start from the engine's PBR-first material model and built-in lighting pipeline before adding custom shader complexity; the default material path usually carries the cheapest correctness.
- Use engine optimization levers on purpose: mesh count, material count, shadows, post-processing, culling, instancing, and texture resolution all matter more than generic micro-optimizations.
- Treat DPR as a product-performance dial rather than a fixed constant, and stage heavy scene content so first render, interaction readiness, and late asset refinement are separate moments.
- Keep an instrumentation mindset: inspect frame time, draw calls, CPU submission cost, and scene graphs early, and stay aware of how glTF assets land inside the engine runtime.

## Watchouts

- Avoid shipping max-quality DPR, shadows, and post-processing defaults to every device without measuring the real frame budget.
- Avoid assuming Babylon.js and PlayCanvas authoring flows, inspectors, or runtime behavior are interchangeable just because both target the browser.
- Avoid importing glTF scenes blindly when unused materials, nodes, animations, or oversized textures can be removed before runtime.

## First-party anchors

- Pair this overlay with `browser-3d-platform.md` for capability, fallback, and canvas lifecycle rules that stay above any single engine.
- Pair this overlay with `shader-material-workflows.md` and `gltf-asset-pipeline.md` when material tuning or asset packaging becomes the main bottleneck.
