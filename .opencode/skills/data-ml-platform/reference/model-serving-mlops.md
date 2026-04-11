# Model serving and MLOps overlay for `data-ml-platform`

Use this overlay when delivery risk centers on versioned model promotion, serving contracts, rollout strategy, and operational monitoring after training.

## Reach for this overlay when

- a model registry, promotion flow, or deployment target determines how trained artifacts become production releases,
- online or batch scoring contracts, fallback behavior, and rollout safety matter as much as offline metrics,
- governance, approval, or operational handoff expectations must be explicit before deployment.

## Working rules

- Treat the registry entry, model artifact, feature or preprocessing version, schema contract, and runtime image as one release unit backed by immutable version identifiers.
- Make serving contracts explicit: request and response schema, preprocessing and postprocessing, latency or throughput budgets, fallback behavior, and client compatibility windows.
- Choose a release strategy up front: shadow, canary, blue-green, or scheduled batch cutover, with rollback triggers tied to errors, latency, drift, and business regression signals.
- Monitor service and model behavior together with traffic, latency, saturation, prediction quality, feature drift, data drift, calibration, and governance signals required for human review or approvals.

## Watchouts

- Avoid promoting a model version without the exact feature logic, dependency lock, and serving image needed to reproduce it.
- Avoid silent contract drift between training features, stored artifacts, and live request payloads.
- Avoid operational handoff that ends at deployment; dashboards, ownership, and rollback steps must stay attached to the release.
