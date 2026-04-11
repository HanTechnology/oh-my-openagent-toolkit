# Shader and material workflows overlay for `frontend-web`

Use this overlay when browser-3D work is constrained by material behavior, custom shading, transparency, or post-processing rather than by page-level UI structure.

## Scope

- the task needs custom materials, shader hooks, post-processing, or non-default transparency behavior,
- material and lighting choices have visible impact on frame time or scene readability,
- runtime-specific shader caveats matter more than engine selection alone.

## Required concepts

- Start with engine and material defaults first; add custom shader code only after the built-in material model fails a concrete visual or performance requirement.
- Minimize shader and material variants so pipeline compilation, state changes, and debugging stay manageable across real device mixes.
- Treat overdraw, blending, and transparency as explicit cost centers: layered alpha, particles, decals, and post effects need ordering and fill-rate discipline.
- Keep shader advice runtime-specific and honest: WebGL and WebGPU paths do not imply feature parity, matching precision, or interchangeable debugging workflows by default.

## Watchouts

- Avoid promising one shader path will behave the same across WebGL and WebGPU without engine-level caveats and fallback rules.
- Avoid exploding material variants through loosely scoped feature flags, `#define` branches, or duplicated near-identical materials.
- Avoid using transparency, screen-space effects, or custom post stacks as free polish when they can dominate fill rate and hide scene readability problems.

## First-party anchors

- Pair this overlay with `threejs-react-three-fiber.md` or `babylon-playcanvas.md` so shader advice stays grounded in the active engine runtime.
- Pair this overlay with `browser-3d-platform.md` when runtime fallback, context handling, or GPU capability boundaries affect material choices.
