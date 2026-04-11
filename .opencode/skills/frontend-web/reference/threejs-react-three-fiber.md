# Three.js and React Three Fiber overlay for `frontend-web`

Use this overlay when a browser-3D feature runs on Three.js directly or when React Three Fiber is the React integration layer around a Three.js scene.

## Scope

- Three.js owns the renderer, scene graph, loaders, or post-processing path,
- React Three Fiber coordinates scene composition inside a React app shell,
- render-loop discipline, object lifecycle, and scene performance are the main engineering risks.

## Required concepts

- Keep the runtime relationship explicit: Three.js is the rendering stack, and React Three Fiber is the adapter that lets React describe and coordinate that stack.
- Keep hot scene data out of normal React churn: refs, frame callbacks, or narrow external stores should own per-frame mutation instead of broad component re-render loops.
- Reuse loader and asset caches deliberately, and dispose geometries, materials, textures, render targets, and controls when they no longer belong to the active scene.
- Instrument the real workload: watch frame time, draw calls, material count, texture memory, and scene complexity before deciding where to simplify.

## Watchouts

- Avoid treating React state as the default clock for animation, camera motion, or pointer-driven scene updates.
- Avoid splitting scene ownership between ad hoc imperative Three.js code and React Three Fiber trees without a clear lifecycle boundary.
- Avoid orphaned GPU resources, duplicated loaders, or effect stacks that survive route changes and silently grow render cost.

## First-party anchors

- Pair this overlay with `react-web.md` when the surrounding product shell is a React application and the 3D surface is one part of a larger browser UI.
- Pair this overlay with `browser-3d-platform.md`, `shader-material-workflows.md`, and `gltf-asset-pipeline.md` for runtime setup, material decisions, and asset delivery rules.
