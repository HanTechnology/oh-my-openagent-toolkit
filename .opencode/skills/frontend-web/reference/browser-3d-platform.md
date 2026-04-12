# Browser 3D platform overlay for `frontend-web`

Use this overlay when browser work is shaped by canvas lifecycle, GPU capability detection, fallback behavior, or the choice to ship WebGPU as progressive enhancement on top of a safe WebGL2 baseline.

## Scope

- the dominant problem is browser-3D runtime setup rather than framework routing or page composition,
- canvas sizing, device-pixel-ratio policy, and resize behavior affect product quality or performance,
- capability checks, fallback content, and context loss recovery must be handled deliberately.

## Required concepts

- Treat WebGL2 as the compatibility baseline for browser-3D guidance, and treat WebGPU as additive when capability detection proves it is available.
- Size canvases from the layout contract on purpose: keep CSS size and drawing-buffer size aligned, clamp DPR where needed, and re-measure on resize instead of assuming full-screen defaults.
- Plan for context lifecycle: handle context loss and restoration, release observers and event hooks, and dispose renderer-owned resources when scenes unmount or routes change.
- Keep fallback content accessible and real: loading, unsupported-browser, failure, and reduced-motion paths should still communicate the product intent without requiring the 3D surface to succeed.

## Watchouts

- Avoid assuming WebGPU support, identical WebGL and WebGPU behavior, or a single browser/runtime path across the whole audience.
- Avoid treating canvas setup as styling only; mismatched DPR, resize drift, and hidden fixed-cost redraws create blurry output and runaway GPU work.
- Avoid leaking GPU resources, animation loops, or input listeners after scene teardown or navigation.

## First-party anchors

- Pair this overlay with `threejs-react-three-fiber.md` or `babylon-playcanvas.md` once an engine family owns the scene runtime.
- Pair this overlay with `gltf-asset-pipeline.md` and `shader-material-workflows.md` when asset delivery or material behavior becomes the limiting factor.
