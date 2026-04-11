# Web 3D Support Model

This document freezes wave-1 browser-3D governance for `agentic-dev-ai-team`. It defines the exact capability IDs, default support tiers, and ownership boundaries that the manifest must carry until later tasks add the pack-local overlay reference files. It is a governance surface only: it does not create a top-level `web-3d` pack and it does not widen README-level `validated` claims.

## Frozen wave-1 defaults

- Primary owner: `frontend-web`
- Escalation-only owner: `systems-rust` for measured browser-WASM and performance bottlenecks
- Validation owner: `qa-validation` for browser-3D verification guidance
- Optional later adjacent owner: `data-ml-platform` for ML, vision, and 3D-adjacent work only
- Wave-1 topology: no dedicated top-level `web-3d` pack
- Rendering baseline: WebGL2 is the safe compatibility baseline for wave-1 browser-3D work
- Progressive enhancement: WebGPU is additive and optional, not a universal browser baseline
- Engine layering: React Three Fiber is treated as a Three.js-adjacent integration layer, not a separate rendering stack
- Asset boundary: glTF support is runtime asset delivery first and does not promise broad DCC, export, compression, or transcoding coverage
- XR/CAD boundary: `frontend-web/webxr` and `frontend-web/cad-industrial-visualization` stay non-validated in wave 1

## Frozen browser-3D capability set

| Capability ID | Owner | Support level | Wave-1 boundary |
| --- | --- | --- | --- |
| `frontend-web/browser-3d-platform` | `frontend-web` | `guided` | Core browser-3D platform guidance with WebGL2 as the compatibility baseline and WebGPU as progressive enhancement. |
| `frontend-web/threejs-react-three-fiber` | `frontend-web` | `guided` | Three.js plus React Three Fiber guidance, with React Three Fiber kept as a Three.js-adjacent integration layer. |
| `frontend-web/babylon-playcanvas` | `frontend-web` | `guided` | Additional browser-3D engine-family guidance that stays under the main `frontend-web` pack. |
| `frontend-web/shader-material-workflows` | `frontend-web` | `guided` | Runtime-specific shader and material workflows with no default WebGL/WebGPU parity promise. |
| `frontend-web/gltf-asset-pipeline` | `frontend-web` | `guided` | Runtime asset delivery guidance first, not a broad asset-authoring or transcoding promise. |
| `systems-rust/wasm-browser-3d-performance` | `systems-rust` | `guided` | Escalation-only browser-WASM and performance lane for measured bottlenecks in browser-3D workloads. |
| `qa-validation/browser-3d-validation` | `qa-validation` | `guided` | Verification guidance for browser-3D fallback behavior, evidence capture, and runtime validation. |
| `frontend-web/webxr` | `frontend-web` | `planned` | Reserved XR surface for wave 1. It may be guided later, but it is not validated now. |
| `frontend-web/cad-industrial-visualization` | `frontend-web` | `planned` | Reserved CAD and industrial visualization surface for wave 1. It may be guided later, but it is not validated now. |

## Support-tier boundary

- Browser-3D core overlays are frozen as `guided` coverage.
- Browser-WASM performance escalation is frozen as `guided` coverage.
- Browser-3D validation guidance is frozen as `guided` coverage.
- XR and CAD remain `planned` in this wave-1 freeze and must not be promoted to `validated`.
- No browser-3D capability in this document is part of the README `supported now` surface.
