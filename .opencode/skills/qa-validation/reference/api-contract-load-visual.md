# API contract, load, and visual overlay for `qa-validation`

Use this overlay when release risk is shaped by API contract drift, representative load behavior, or visual regressions on critical UI flows.

## Reach for this overlay when

- an API change needs contract assertions across success, failure, auth, or version boundaries,
- performance or concurrency risk makes representative load behavior a release concern,
- UI changes need screenshot, snapshot, or visual-diff evidence beyond functional checks.

## Working rules

- Treat contract checks, load profiles, and visual baselines as risk-based evidence layers: choose the mix that fits the change instead of running shallow versions of all three.
- Keep contract tests aligned with the published schema, examples, or pact source of truth, and assert status codes, headers, auth behavior, and error shapes instead of only happy-path payloads.
- Use strict matchers for stable invariants and tolerant matchers for intentionally variable fields so the suite catches drift without failing on timestamps, IDs, or other approved variability.
- When consumer-provider tooling or published contracts exist, keep provider states, fixtures, and versioned contract publication explicit so failures are diagnosable and not tied to hidden setup.
- Model load against representative traffic mix, concurrency, ramp shape, and hot paths, then tie thresholds back to `../../../reference/quality-gates.md` instead of inventing pack-local pass tables here.
- Use visual baselines deliberately on high-value flows, capture viewport, browser, theme, and seeded-state context, and review intentional diffs so baseline updates stay policy-driven instead of automatic.
- Pull reusable evidence shapes from `../../../reference/qa/examples/` when you need example structure; this overlay only decides depth and mix, not shared QA example ownership.

## Watchouts

- Avoid contract tests that prove only nominal success while ignoring auth failures, validation errors, compatibility edges, or provider-state assumptions.
- Avoid synthetic load profiles that are too unrealistic to reveal actual bottlenecks or release risk.
- Avoid snapshot or visual-diff sprawl with no owner, no review habit, or no link to critical user journeys.
