# Contract safety

Use this reference before rewriting language tied to APIs, SDKs, CLIs, logs, telemetry, localization, integrations, or public behavior. Service-vernacular may improve human-facing wording, but it must not smuggle in a contract change.

## Protected contract fields

Do not rename, remove, reformat, or reinterpret these fields through a copy rewrite unless the owning contract change explicitly authorizes it:

Protected terms in exact form: machine-readable error codes, status codes, enum values, localization keys, log identifiers, telemetry event names, SDK-visible fields, and documented API semantics.

1. Machine-readable error codes, including fields such as `error_code`, `code`, `type`, or catalog identifiers.
2. Status codes, including HTTP status codes, gRPC status codes, process exit codes, webhook delivery status, and job state codes.
3. Enum values, including API enums, SDK enums, database-backed states, feature flag values, and documented string literals.
4. Localization keys, including i18n message identifiers, namespace paths, ICU keys, and translation memory keys.
5. Log identifiers, including event ids, logger names, structured log field names, alert ids, and incident correlation ids.
6. Telemetry event names, including analytics events, metric names, span names, trace attributes, and dashboard dimensions.
7. SDK-visible fields, including generated property names, method names, operation ids, schema names, public exceptions, and typed response fields.
8. Documented API semantics, including auth requirements, pagination behavior, rate limits, idempotency rules, retry semantics, deprecation windows, compatibility promises, and error meanings.

## What service-vernacular may rewrite

1. Human-facing error message text when it is separate from the machine-readable code.
2. Help text, docs explanation, or support guidance that describes an existing contract without changing it.
3. UI labels that sit above a stable API field, when the submitted field name remains unchanged.
4. Release-note wording that explains user impact without changing availability, compatibility, or migration requirements.
5. Operator guidance that maps known log or telemetry identifiers to a clearer recovery step while preserving the identifiers.
6. Localized human-facing wording around protected fields, when localization keys, placeholders, ICU syntax, contract terms, and documented semantics stay unchanged.

## Localized wording and protected terms

Locale-native rewriting may change the human-facing sentence around a protected term, but not the protected term itself. Treat localization keys, translation memory identifiers, placeholders, ICU variable names, do-not-translate terms, API names, SDK names, error codes, enum values, telemetry names, log identifiers, and documented semantics as contract material unless the owner authorizes a change.

A contract-safe localized rewrite records which terms were protected, which surrounding words changed, how the termbase was used, and why the target-locale sentence keeps the same recovery path, obligation, warning, or public behavior.

Fail localized human-facing wording if it translates a key, drops a placeholder, changes variable meaning, moves a protected term into ambiguous grammar, or broadens the source contract claim.

## Safety workflow

1. Identify whether the string is display copy, a key, a value, or both.
2. Search for the string in source, tests, docs, SDKs, localization, logs, and telemetry before changing it.
3. If the same string is parsed by code, exported in an API, used as a translation key, or consumed by analytics, treat it as protected.
4. Split human-facing copy from contract fields only when the owning implementation route approves the change.
5. Preserve the original code, status, enum, key, log id, telemetry event, SDK-visible field, and documented API semantics in before/after evidence.
6. Ask for explicit authorization before changing regulated/legal claims or documented public contract claims.

## Product-facing error pattern

Keep the machine field stable and improve only the message:

```json
{
  "error_code": "RUNBOOK_STEP_LOCKED",
  "status": 409,
  "message": "This runbook step is locked by another responder. Refresh the incident timeline before editing."
}
```

In this example, `RUNBOOK_STEP_LOCKED` and `409` are protected. The message can be rewritten if the new wording preserves the same recovery path and semantics.

## Unsafe rewrite patterns

| Unsafe change | Risk |
| --- | --- |
| Renaming `INVALID_TOKEN` to `SESSION_EXPIRED` in copy and code without an auth contract change | Changes error meaning for clients |
| Replacing HTTP `403` with `404` to sound safer | Changes documented API semantics |
| Changing enum `pending_review` to `awaiting_approval` because it reads better | Breaks API, SDK, data, or automation consumers |
| Replacing localization key `billing.invoice.failed` with a sentence | Breaks translation lookup |
| Renaming telemetry event `incident_acknowledged` to `alert_seen` | Breaks dashboards and analysis |
| Hiding an SDK-visible field name behind a friendlier term in generated docs | Makes client code harder to map to docs |

## Required evidence note

For any rewrite touching this surface, record:

1. Protected fields found.
2. Human-facing text changed.
3. Evidence source used.
4. Contract owner or authorization when a protected field changes.
5. Confirmation that documented API semantics stayed the same.

If that note cannot be written, stop the rewrite and hand the contract question to the owning implementation route.
