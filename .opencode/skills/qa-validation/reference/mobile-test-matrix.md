# Mobile test matrix overlay for `qa-validation`

Use this overlay when QA scope is shaped by mobile browsers, device classes, OS fragmentation, touch behavior, or native-app style lifecycle differences.

## Reach for this overlay when

- the change materially affects mobile web or mobile-app journeys,
- browser or OS fragmentation, screen classes, or device capabilities influence correctness,
- touch input, localization, accessibility settings, performance sensitivity, or resume and background behavior are meaningful risks.

## Working rules

- Define a risk-based matrix across device classes, OS versions, browsers, and form factors instead of chasing exhaustive combinatorial coverage.
- Use real devices for the slices where touch latency, camera or biometrics, permission prompts, OS integrations, or performance-sensitive behavior matter most; use simulators or emulators for breadth smoke coverage and faster layout triage.
- Include localization and accessibility axes when the product surface depends on text expansion, RTL, dynamic type, screen readers, high-contrast modes, or other assistive settings.
- Cover performance-sensitive journeys on representative lower-end or thermally constrained devices when startup time, scrolling smoothness, animation cost, or battery-sensitive behavior is part of the release risk.
- Exercise state changes deliberately: cold start, warm resume, offline or degraded-network behavior, permission prompts, rotation, split-screen or resize, and background or foreground transitions where they affect the feature.
- Capture matrix evidence with clear device, OS, browser or app build, locale, accessibility settings, and result labeling so release decisions are tied to tested coverage rather than assumptions.

## Watchouts

- Avoid claiming support for device classes or mobile browsers that were never exercised.
- Avoid emulator-only confidence when device-specific inputs, performance, or OS integrations are central to the risk.
- Avoid matrix growth without pruning rules, or the suite will become expensive without improving release confidence.
