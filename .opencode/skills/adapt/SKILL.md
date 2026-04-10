---
name: adapt
description: Adapt interfaces for different devices, breakpoints, platforms, and usage contexts without sacrificing core usability.
argument-hint: "[target] [context]"
user-invocable: true
---

# Adapt

Use this flow when a design needs to survive a new context: mobile, tablet, desktop, print, or another platform-specific surface.

## Preparation

1. Load `impeccable` first.
2. If design context is missing, run `impeccable teach`.
3. Review [`../impeccable/reference/responsive-design.md`](../impeccable/reference/responsive-design.md).

## What to improve

- layout changes across device classes,
- touch targets and thumb reach,
- navigation adaptation,
- density and information ordering,
- interruption recovery,
- and context-specific affordances.

## Rules

- Adapt the experience; do not just shrink it.
- Preserve critical functionality across contexts.
- Test the high-risk breakpoints and states explicitly.
- Prefer context-appropriate patterns over false parity.
