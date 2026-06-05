# Examples

These examples show the shape expected from service-vernacular output. Each example names domain evidence and explains why the rewrite is not generic. The fictional domain is incident response software so the before/after pairs can stay concrete.

## UI text

Surface: UI

Before: "Manage items"

After: "Review active incidents"

Domain evidence: Navigation labels, incident list screen, and support tickets all use `incident` for the primary work object. The list filters by active, muted, and resolved incidents.

Why this is not generic: It names the actual work object and state. A generic SaaS app could manage items, but this product helps responders review incidents.

## Backend/API product-facing error

Surface: error

Before: "Action failed."

After: "This runbook step is locked by another responder. Refresh the incident timeline before editing."

Domain evidence: The error catalog has `RUNBOOK_STEP_LOCKED`, status `409`, and a handler comment naming responder locks on runbook steps.

Contract-safety note: Keep machine-readable error code `RUNBOOK_STEP_LOCKED` and status code `409` unchanged. Rewrite only the human-facing message.

Why this is not generic: It names the locked runbook step, the responder conflict, and the recovery action.

## CLI text

Surface: CLI

Before: "Sync complete."

After: "Synced 12 on-call schedules and 3 escalation policies."

Domain evidence: CLI help, fixtures, and API resource names use `on-call schedule` and `escalation policy` as canonical nouns.

Contract-safety note: Keep command names, flags, exit codes, and parseable output fields unchanged.

Why this is not generic: It reports the specific incident-response resources that changed, not a vague sync result.

## Docs text

Surface: docs

Before: "Use automation to improve your workflow."

After: "Use escalation rules to page the next responder when an incident stays unacknowledged."

Domain evidence: The guide, schema, and examples all describe escalation rules, responders, incidents, and acknowledgement windows.

Why this is not generic: It names the domain rule, trigger, actor, and workflow outcome.

## Notification text

Surface: notification

Before: "You have a new update."

After: "Payment API incident escalated to the database on-call. Ack within 5 minutes to stay primary."

Domain evidence: Notification template variables include service name, incident title, escalation target, acknowledgement window, and responder role.

Why this is not generic: It tells the responder what happened, which service is affected, who is next, and what action preserves ownership.

## Onboarding text

Surface: onboarding

Before: "Set up your workspace to get started."

After: "Add your first service, then connect an on-call schedule so incidents know who to page."

Domain evidence: Activation docs and setup analytics show first value comes from adding a service and connecting an on-call schedule.

Why this is not generic: It teaches the product's first workflow and names the objects that make incidents routable.

## Operator/admin text

Surface: operator/admin

Before: "System health degraded."

After: "Webhook delivery is delayed for 4 incident streams. Retry queue is draining."

Domain evidence: Operator dashboard panels track webhook delivery, incident streams, retry queue depth, and drain rate.

Why this is not generic: It gives the operator subsystem, scope, and current recovery state instead of a vague health label.

## Support text

Surface: support

Before: "Sorry for the inconvenience. Try again later."

After: "The alert reached your team, but the Slack handoff failed. Reconnect the Slack workspace, then replay the incident notification from the timeline."

Domain evidence: Support macros and integration logs distinguish alert delivery from Slack handoff failures and expose replay from the incident timeline.

Why this is not generic: It names the failed integration step and gives a recovery path tied to the product workflow.

## Release-note text

Surface: release notes

Before: "Improved notifications."

After: "Incident notifications now show the escalation policy that selected the current on-call responder."

Domain evidence: The release diff adds escalation policy names to incident notification payloads and UI templates.

Contract-safety note: Do not claim new delivery guarantees or change webhook payload semantics unless the API contract changed.

Why this is not generic: It states the shipped user impact in incident-response terms and avoids a broad improvement claim.

## Homepage/service/Korean negative fixtures

These Nuvreon-shaped fixtures are labeled `failed public copy / do not publish`. They are examples of what to reject, not recommended public copy.

### Korean product-section fixture

Surface: product/service page

Fixture label: `failed public copy / do not publish`

Failed public copy: `RoboLink AI Core는 하나의 대표 Physical AI 제품 섹션입니다.`

Why it fails: It reads like an internal section label, mixes Korean with product taxonomy, and claims representative status without source evidence.

Direction, not final Nuvreon copy: Return to verified product evidence. Write natural Korean that names the product role only if approved sources support that role.

### Korean company-review fixture

Surface: homepage hero

Fixture label: `failed public copy / do not publish`

Failed public copy: `회사 검토 자료가 보인 뒤 방문자를 안내합니다.`

Why it fails: It exposes review sequencing and tells the visitor about internal material instead of speaking from the company surface.

Direction, not final Nuvreon copy: Keep review order in notes. Public copy should address the visitor's first decision with approved company identity and service evidence.

### Korean claim-boundary fixture

Surface: proof panel

Fixture label: `failed public copy / do not publish`

Failed public copy: `검토 자료는 ... 포렌식 확실성을 지어내지 않습니다.`

Why it fails: It leaks claim-safety rationale into display copy and frames the page around what reviewers avoided.

Direction, not final Nuvreon copy: Keep the constraint in the review record. Public copy should state only verified proof and approved limits.

### Korean operation-list fixture

Surface: caption/diagram label

Fixture label: `failed public copy / do not publish`

Failed public copy: `Core가 명령을 점검, 정규화, 기록, 라우팅, 준비합니다.`

Why it fails: It stacks internal process verbs and may imply a broader command pipeline than the public evidence proves.

Direction, not final Nuvreon copy: Use diagram evidence to name the visible flow and keep any internal operation list out of public labels unless it is documented and user-relevant.

### English route-order fixture

Surface: route card

Fixture label: `failed public copy / do not publish`

Failed public copy: `Company trust first. Product and service choices second.`

Why it fails: It is a content-order instruction, not visitor-facing route copy. It also makes every route feel like a strategy note.

Direction, not final Nuvreon copy: Put route order in IA notes. Public route cards should name each destination and why a visitor would choose it.

### English homepage-description fixture

Surface: metadata/fallback text

Fixture label: `failed public copy / do not publish`

Failed public copy: `The Home page opens with the company identity...`

Why it fails: It describes the page artifact and leaves the public message unfinished. As metadata or fallback text, it would leak review narration into search or previews.

Direction, not final Nuvreon copy: Write standalone public metadata from the approved company identity, service scope, and route purpose. Keep page observations in internal notes.
