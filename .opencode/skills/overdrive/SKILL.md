---
name: overdrive
description: "Push a chosen part of the interface toward technically ambitious motion or interaction while keeping fallbacks, performance, and accessibility intact."
argument-hint: "[target]"
user-invocable: true
---

# Overdrive

Use this flow when the goal is not just polish but one extraordinary implementation move that makes the interface feel unusually capable.

## Preparation

1. Load `impeccable` first.
2. If design context is missing, run `impeccable teach`.
3. Propose two or three directions with clear trade-offs before building.
4. Confirm performance budget, browser support expectations, and reduced-motion fallback requirements.

## Working rules

- Pick one extraordinary moment; do not stack five competing ones.
- Use progressive enhancement so the fallback is still good without the effect.
- Target 60fps on realistic hardware and respect `prefers-reduced-motion`.
- Validate the result visually with browser automation instead of trusting the first implementation.
- Reject any idea that feels impressive only because it is loud, fragile, or brand-inappropriate.

## Good targets

- shared-element or view transitions,
- ambitious but meaningful motion or reveal systems,
- data-heavy surfaces that feel impossibly smooth,
- or interaction models that feel unusually responsive and tactile.

## Finish line

If removing the effect would make the experience noticeably worse, but the fallback still works well, the pass probably succeeded.
