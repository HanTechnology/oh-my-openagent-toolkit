# Responsive design reference

Use this reference when the task needs adaptation across screen sizes, devices, or contexts.

## Core rules

- Adapt for the real context instead of shrinking the desktop layout.
- Use container-aware composition where component width matters.
- Keep touch targets generous.
- Do not amputate critical functionality on smaller screens.

## What to verify

- Navigation remains clear on narrow screens.
- Text stays readable at larger user zoom levels.
- Dense tables, charts, and filters have an intentional mobile strategy.
- Interruptions and resumed sessions do not break the flow.

## Anti-slop watchouts

- Desktop-first layouts with only font-size reductions.
- Hover-only affordances carried into touch contexts.
- Hidden core actions on mobile because there was no layout plan.
