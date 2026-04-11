---
name: impeccable
description: Distinctive anti-slop UI and UX umbrella skill for web and mobile work. Use for design direction, context gathering, anti-pattern avoidance, or to work across the full local 23-skill impeccable family, especially audit, critique, polish, typeset, colorize, and adapt.
license: Apache 2.0
argument-hint: "[craft|teach|extract]"
user-invocable: true
---

# Impeccable

This vendorized pack adapts the upstream `pbakaus/impeccable` skill family into one local-integrated 23-skill layer for the local OpenCode and Oh My OpenAgent workflow.

Treat it as a supplementary layer on top of `frontend-web` and `mobile-app`, not as a replacement for those domain packs and not as a routing authority of its own.

## What this skill is for

Use `impeccable` when UI work needs a stronger point of view across the broader local family:

- design context gathering,
- anti-slop direction setting,
- distinctive typography, color, and spatial decisions,
- structured critique or quality review,
- or a finishing pass before shipping.

The most common companion flows in this local-integrated family are:

- `audit`
- `critique`
- `polish`
- `typeset`
- `colorize`
- `adapt`

The wider imported family also includes focused craft and reference skills plus lightweight deprecated wrappers kept for completeness only. Those wrappers are present so the local bundle stays source-complete, but they are not primary routing choices and should be treated as redirects to `impeccable` or `impeccable teach` as applicable.

## Context gathering protocol

Design quality collapses when the model guesses audience, tone, or product intent from code alone.

Before doing design work, confirm at least these inputs:

- target audience,
- primary use cases,
- brand personality or tone,
- accessibility or platform constraints.

Use this order:

1. If the current instructions already include a design context, use it.
2. Otherwise read `.impeccable.md` from the project root if it exists.
3. If neither source exists, run `impeccable teach` and gather the missing context directly.

Do not infer brand personality from implementation details alone.

## Shared anti-slop source

Treat [`../../reference/design-anti-slop.md`](../../reference/design-anti-slop.md) as the canonical shared anti-slop ban list for this bundle and this entire local `impeccable` family.

- Do not restate or override that file as a second canonical source.
- Use the local references below to apply the shared bans with better design judgment in typography, color, spacing, motion, responsive behavior, and writing.
- Keep any extra local guidance here supplementary to the shared bundle-level bans.

### Typography

- Avoid default-looking type stacks and monoculture font choices.
- Build clear hierarchy with strong size, weight, and spacing contrast.
- Keep body copy readable, bounded, and intentional.

See `reference/typography.md`.

### Color and contrast

- Use purposeful palettes with tinted neutrals and clear contrast.
- Avoid generic purple-blue AI palette defaults and overly harsh pure-black or pure-white usage.

See `reference/color-and-contrast.md`.

### Space and composition

- Vary spacing rhythm on purpose.
- Avoid wrapping every section in nested cards.
- Break grids intentionally, not accidentally.

See `reference/spatial-design.md`.

### Motion and interaction

- Motion should clarify state change, not decorate emptiness.
- Avoid bounce or elastic easing as a local motion guardrail.
- Design loading, empty, error, and success states with the same care as the happy path.

See `reference/motion-design.md` and `reference/interaction-design.md`.

### Responsive adaptation and copy

- Adapt experiences for the real device context instead of shrinking a desktop layout.
- Keep copy short, precise, and specific to the product moment.

See `reference/responsive-design.md` and `reference/ux-writing.md`.

## Default operating mode

When invoked without an argument, use this flow:

1. Confirm or gather design context.
2. Pick a bold but coherent visual direction that fits the product.
3. Load the shared anti-slop bans from [`../../reference/design-anti-slop.md`](../../reference/design-anti-slop.md) and the relevant local references for typography, color, spacing, interaction, motion, responsiveness, or writing.
4. Route execution through `frontend-web` or `mobile-app` for actual implementation.
5. Use the focused local `impeccable` skills for targeted review or refinement, and treat any deprecated wrappers as redirects only.

## Teach mode

If invoked with `teach`, gather the missing design context and write or update a `## Design Context` section in `.impeccable.md` with:

- Users
- Brand personality
- Aesthetic direction
- Design principles

If file edits are not appropriate for the current task, return the exact markdown section and clearly mark it for later insertion.

## Craft mode

If invoked with `craft`, follow `reference/craft.md`.

## Extract mode

If invoked with `extract`, follow `reference/extract.md`.

## AI slop test

If the result looks instantly machine-generated, it failed.

The bar is not novelty for its own sake. The bar is a product surface with real intent, clear hierarchy, and enough taste that someone notices the design choices rather than the template.
