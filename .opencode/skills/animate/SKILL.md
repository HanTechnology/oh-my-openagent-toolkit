---
name: animate
description: "Add purposeful motion, transitions, and micro-interactions that clarify state change, feedback, and delight without sacrificing performance or accessibility."
argument-hint: "[target]"
user-invocable: true
---

# Animate

Use this flow when the interface already works but key interactions still feel abrupt, static, or under-explained.

## Preparation

1. Load `impeccable` first.
2. If design context is missing, run `impeccable teach`.
3. Review `../impeccable/reference/motion-design.md` and `../impeccable/reference/interaction-design.md`.
4. Confirm the performance budget and reduced-motion expectations for the target surface.

## What to add

- entrance motion that clarifies hierarchy,
- interaction feedback for hover, focus, press, submit, success, and error states,
- smoother state changes for show or hide, expand or collapse, loading, and navigation,
- and at most one higher-drama moment if the product and platform can support it.

## Rules

- Motion should explain change, not decorate emptiness.
- Prefer `transform` and `opacity`; avoid layout-jank animation.
- Respect `prefers-reduced-motion` with a clear static fallback.
- One coherent motion system beats scattered animations everywhere.

## Finish line

The result should feel faster, clearer, and more intentional without turning the interface into a demo reel.
