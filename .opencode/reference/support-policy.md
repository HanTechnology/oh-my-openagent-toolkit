# Support Policy

This document freezes the support-tier contract for `oh-my-openagent-toolkit`. It is authoritative for the tier names, the public-claim rule, and the parser contract that consumes `.opencode/reference/capability-matrix.json`. The model stays intentionally small: one manifest, three tiers, and four flagship workflows.

## Frozen support tiers

| Tier | Meaning | Public claim eligibility |
| --- | --- | --- |
| `validated` | A flagship workflow with proof expectations and validator-backed claim intent. | Eligible for README `supported now` summaries. |
| `guided` | A current pack or overlay with routing and reference coverage, but no end-to-end validated public claim. | Not eligible for README `supported now` summaries. |
| `planned` | A named expansion surface reserved for future implementation or later promotion. | Not eligible for README `supported now` summaries. |

## Validated boundary

The initial validated surface is intentionally narrow. The manifest freezes exactly four flagship workflow IDs as the only initial `validated` capabilities:

- `frontend-product-delivery`
- `backend-service-delivery`
- `cloud-release-readiness`
- `ai-data-product-delivery`

Broader pack and overlay coverage can be documented as `guided` or `planned`, but it must not be summarized publicly as `supported now` until the manifest promotes it to `validated`.

## Public claim rule

1. `.opencode/reference/capability-matrix.json` is the machine-readable source of truth for support tiers.
2. README `supported now` summaries may list only capabilities whose manifest `support_level` is `validated`.
3. `guided` and `planned` capabilities may appear only in explicitly tiered sections such as guided coverage, planned next, catalogs, or roadmap-style references.
4. If a public capability has no declared `support_level`, it is not claimable.

## Parser contract

Any parser or validator that consumes the manifest must enforce all of the following:

1. `support_tiers` is frozen to exactly `validated`, `guided`, and `planned`.
2. `flagship_workflows` contains exactly four workflow IDs.
3. Every entry in `capabilities` has a `support_level` drawn from `support_tiers`.
4. `public_claims.readme_supported_now_requires` is `validated`.
5. The set of manifest entries marked `validated` matches `flagship_workflows` exactly.

The minimal parser check for this governance freeze is:

```python
import json
from pathlib import Path

data = json.loads(Path(".opencode/reference/capability-matrix.json").read_text())
allowed = {"validated", "guided", "planned"}

assert set(data["support_tiers"]) == allowed
assert len(data["flagship_workflows"]) == 4
assert data["public_claims"]["readme_supported_now_requires"] == "validated"
assert {
    capability["id"]
    for capability in data["capabilities"]
    if capability["support_level"] == "validated"
} == set(data["flagship_workflows"])

for capability in data["capabilities"]:
    tier = capability["support_level"]
    if tier not in allowed:
        raise AssertionError(f"unsupported support tier for {capability['id']}: {tier}")
```

This is also the negative-path contract: unsupported tiers such as `experimental` must fail the parser check.

## Change discipline

When support levels or flagship workflows change, update these three files together:

1. `.opencode/reference/capability-matrix.json`
2. `.opencode/reference/support-policy.md`
3. `.opencode/reference/workflow-catalog.md`

Do not add new support tiers casually. Do not widen the initial flagship workflow set beyond the frozen four without making the manifest, policy, catalog, and validator agree in the same change set.
