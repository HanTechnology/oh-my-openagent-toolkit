# Browser 3D validation overlay for `qa-validation`

Use this overlay when release risk depends on browser-rendered 3D scenes, GPU capability variation, asset-readiness transitions, or the correctness of degraded and fallback states across representative environments.

## Reach for this overlay when

- a user journey depends on a browser 3D scene rather than static content alone,
- runtime capability detection can switch users between the full scene, a degraded scene, and non-3D fallback content,
- model, texture, shader, or streamed asset readiness can block first meaningful interaction,
- browser, device, or GPU differences can change frame pacing, interaction smoothness, or failure behavior.

## Working rules

- Use `../../../reference/web-3d-support-model.md` as the support baseline: validate that runtime capability detection routes users into the intended full, degraded, or fallback experience instead of assuming uniform browser-3D support.
- Treat browser-3D readiness as staged evidence: confirm shell or loading state, scene-ready state, late-asset completion, and partial or failed asset states, including retry or recovery behavior where the product exposes it.
- Observe frame pacing during the interactions that matter most: load-in, camera motion, hover, drag, scroll-linked scenes, animation bursts, and scene changes. Record visible hitching, long pauses, input lag, or thermal-pressure behavior instead of relying only on average timings.
- Build a representative coverage matrix for the actual risk surface: include the browsers and device classes users rely on, plus at least one lower-headroom or capability-limited path so fallback or degraded behavior is exercised on purpose. Capture browser, OS, device class, and GPU family or renderer detail when available.
- Accept graceful degradation only when the primary task stays understandable and controllable. Reduced effects, lower detail, slower transitions, or static previews can be valid; crashes, blank canvases, stuck loaders, unreadable overlays, or unexplained capability failures are not.
- Keep release calls tied to `../../../reference/quality-gates.md`, and pull reusable evidence shapes from `../../../reference/qa/examples/`; this overlay defines browser-3D verification depth, not shared threshold ownership.

## Watchouts

- Avoid testing only a high-end desktop path and assuming mobile, integrated-GPU, or Safari/WebKit behavior will match.
- Avoid marking asset load as passing when only the first shell appeared but late textures, shaders, geometry, or interaction hooks never became ready.
- Avoid treating an automatic fallback as success unless the capability downgrade was intentional, user-visible, and still supports the required user goal.
