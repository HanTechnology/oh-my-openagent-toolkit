# glTF asset pipeline overlay for `frontend-web`

Use this overlay when browser-3D delivery is constrained by how models, materials, textures, and animations reach the runtime rather than by scene code alone.

## Scope

- glTF or GLB is the runtime delivery format for models and scene assets,
- asset size, import behavior, and loading stages affect startup time or interaction readiness,
- extension use, compression choices, and asset validation need deliberate limits.

## Required concepts

- Default runtime delivery to glTF or GLB for browser-3D work, and treat source DCC files as authoring inputs rather than browser-delivered assets.
- Keep assets compact: remove unused nodes, materials, animations, tangents, and oversized textures so runtime work reflects the actual scene contract.
- Use an allowlist mindset for extensions and compression: enable only the formats the chosen runtime, loader path, and target browsers can actually support and debug.
- Validate exported assets and strip unused data before shipping so loader failures, silent fallback behavior, and avoidable download weight are caught upstream.

## Watchouts

- Avoid broad asset-pipeline claims that imply full DCC, export, transcoding, or studio-tool ownership beyond runtime delivery guidance.
- Avoid mixing many optional extensions, compression paths, or material features without checking loader support and fallback behavior in the target engine.
- Avoid shipping cinematic texture sizes, dense animation sets, or source-scene leftovers when the product only needs a small interactive runtime subset.

## First-party anchors

- Pair this overlay with `threejs-react-three-fiber.md` or `babylon-playcanvas.md` once the runtime importer and scene ownership are clear.
- Pair this overlay with `browser-3d-platform.md` for loading and fallback policy, and with `shader-material-workflows.md` when material fidelity drives asset decisions.
