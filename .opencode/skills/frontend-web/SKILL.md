---
name: frontend-web
description: Deliver browser UI, interaction flows, browser-rendered graphics guidance, and web design systems across framework-specific and runtime overlays without collapsing into a Next.js-only pack.
---

# Frontend Web

Use this pack for browser UI work: web screens, component systems, interaction flows, browser-3D scenes, accessibility, frontend performance, and delivery patterns that live in the web stack.

Defer route choice and lane selection to `../../reference/routing-matrix.md`. For `web/mobile UI`, keep `frontend-web` and `mobile-app` as the primary UI routes, start the harness lane with `visual-engineering`, use `frontend-ui-ux` only when stronger upstream product or interaction judgment helps, and add `impeccable` only as a supplementary refinement layer.

This is the general web UI pack for the repo. It is not limited to one framework. Use the overlays in `reference/` to tune decisions for a specific stack or browser-3D runtime while keeping the shared browser-quality bar intact and without creating separate top-level frontend packs or a new top-level 3D pack. When anti-slop design review matters, use `../../reference/design-anti-slop.md` as the shared ban list. Deprecated wrappers stay non-primary here too.

For setup posture, prefer refining an existing project in place. Treat direct `create` / `init` / `new` flows as greenfield-only and use them only when explicitly requested. Defer the full setup policy to `../../reference/project-setup-policy.md`.

## Core focus

- Build interfaces that are clear, responsive, accessible, and fast.
- Preserve strong component boundaries, predictable state flow, and explicit data loading rules.
- Favor semantic HTML, keyboard support, and WCAG-aware interaction design by default.
- Treat performance, loading states, and error states as part of the product experience.
- Keep browser-rendered scenes resilient with explicit fallbacks, measured rendering cost, and clean runtime teardown.
- Layer the curated `impeccable` pack on purpose only when the ask includes anti-slop review or refinement; it is supplementary, not the starting route.

## Shared web standards

- Keep TypeScript strict where the project uses it.
- Reuse the design system and established component patterns before inventing one-off UI.
- Make loading, empty, error, and success states intentional.
- Keep forms explicit about validation, latency, and recovery.
- Measure bundle, image, and rendering cost on user-facing paths.
- Build for keyboard, screen reader, reduced-motion, and small-screen resilience.
- Treat `../../reference/design-anti-slop.md` as the canonical anti-slop source instead of repeating bans in this pack.

## Default workflow

1. Inspect the existing UI patterns, component boundaries, and design tokens.
2. Choose the closest overlay from `reference/nextjs.md`, `reference/react-web.md`, `reference/vue-nuxt.md`, `reference/svelte-astro.md`, `reference/angular.md`, `reference/browser-3d-platform.md`, `reference/threejs-react-three-fiber.md`, `reference/babylon-playcanvas.md`, `reference/shader-material-workflows.md`, or `reference/gltf-asset-pipeline.md`.
3. Implement structure first, then state flow, then accessibility and performance details.
4. Add `impeccable`, `audit`, `critique`, `polish`, `typeset`, `colorize`, or `adapt` only when the request clearly needs that layer.
5. Run `review-work` after substantial UI changes.

## Collaboration in this repo

- Use `frontend-ui-ux` only as a supporting upstream helper lane when the task needs stronger product, layout, or interaction judgment.
- Use `Explore` before editing so the new work matches existing patterns.
- Use `Librarian` or `Context7` when a framework or library detail matters.
- Pair with `architecture-integration` when the work depends on API contracts or shared boundary decisions.
- Add the owning backend pack when request shape, validation, or auth behavior changes.

## Overlays

- Keep `frontend-web` as the single top-level web pack. Use the narrowest overlay that matches the dominant component, routing, and runtime model.
- Browser-3D guidance stays inside `frontend-web` as overlays. Use those cards for scene-platform, engine, shader, and asset decisions without promoting a new top-level 3D pack.
- `reference/nextjs.md` for App Router, server/client boundaries, caching, and server-driven web delivery.
- `reference/react-web.md` for component-heavy React apps, client routing, SPA patterns, and design-system-led browser UI.
- `reference/vue-nuxt.md` for Vue SFCs, Composition API composables, Nuxt pages/layouts, and SSR-safe route data flows.
- `reference/svelte-astro.md` for Svelte 5 runes, Astro islands, hydration boundaries, and framework interop inside server-rendered shells.
- `reference/angular.md` for standalone Angular apps, signals, DI, router-driven feature structure, and reactive forms.
- `reference/browser-3d-platform.md` for browser-3D capability detection, canvas lifecycle, fallback content, and WebGL2-first progressive enhancement toward WebGPU.
- `reference/threejs-react-three-fiber.md` for Three.js scene runtime work and React Three Fiber integration inside React-driven browser products.
- `reference/babylon-playcanvas.md` for Babylon.js or PlayCanvas engine-family decisions, scene optimization, and staged loading tradeoffs.
- `reference/shader-material-workflows.md` for runtime-specific material, shader, transparency, and post-processing guardrails.
- `reference/gltf-asset-pipeline.md` for glTF or GLB delivery, asset validation, and compact runtime packaging guidance.

## Guardrails

- Do not let one framework's defaults define the whole pack.
- Do not promote browser-3D guidance into a separate top-level pack.
- Do not trade accessibility or resilience for visual novelty.
- Do not hide UX debt behind component abstraction.
