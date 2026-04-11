---
name: shape
description: "Plan the UX and UI of a feature before implementation by running discovery, defining key states, and producing a brief that guides the build."
argument-hint: "[feature to shape]"
user-invocable: true
---

# Shape

Use this flow when the right next step is design thinking, not coding: clarify the job, the user, the constraints, and the quality bar before implementation starts.

## Preparation

1. Load `impeccable` first.
2. If design context is missing, run `impeccable teach`.
3. Review the local references that match the feature, usually `../impeccable/reference/spatial-design.md`, `../impeccable/reference/interaction-design.md`, `../impeccable/reference/responsive-design.md`, and `../impeccable/reference/ux-writing.md`.

## Discovery pass

Confirm:
- the user, moment, and primary job to be done,
- the single most important action or understanding,
- realistic data ranges and edge states,
- interaction constraints, platform constraints, and anti-goals,
- and what would make the feature feel successful when shipped.

## Output

Produce a compact design brief with:
1. feature summary,
2. primary user action,
3. design direction,
4. layout strategy,
5. key states,
6. interaction model,
7. content requirements,
8. recommended reference files,
9. open questions.

## Rules

- Do not write code from this skill.
- Ask only the questions that change the brief.
- Confirm the brief before handing implementation to `impeccable`, `impeccable craft`, `frontend-web`, or `mobile-app`.

## Finish line

The implementer should be able to build without guessing what the feature is, what matters most, or how the experience should feel.
