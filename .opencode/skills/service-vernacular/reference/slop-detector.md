# Slop detector

Use this detector before and after rewriting copy. It finds language that sounds plausible but carries no product evidence.

## Required gate

Ask this exact question for every meaningful rewrite:

`Could this copy belong to any generic SaaS app?`

If the honest answer is yes, the copy fails until it names the real workflow, audience, object, event, constraint, or recovery path from evidence.

## Practical rubric

Score each dimension from 0 to 2.

| Dimension | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Evidence | No source named | Source named but weakly applied | Source shapes the noun, verb, claim, or surface register |
| Domain nouns | Generic object words | Mix of generic and domain terms | Canonical nouns from `LANGUAGE.md` or verified evidence |
| Domain verbs | Generic actions | Some workflow verbs | Verbs match what users actually do in the product |
| Surface fit | Same wording would be used everywhere | Some surface adaptation | Register matches UI, docs, CLI, notification, API error, admin, onboarding, support, release-note, homepage, or service-page context |
| Usefulness | Sounds polished but vague | Understandable but incomplete | Tells the user what happened, why it matters, or what to do next |
| Claim safety | Adds unsupported claims | Claim is plausible but uncited | Claim is backed by source evidence and within approved boundaries |
| Contract safety | May rename contract fields | Mentions contracts but misses one risk | Preserves protected fields from `contract-safety.md` |

Passing bar: no 0 scores, and at least four dimensions score 2. The required gate still wins. If the copy could fit any generic SaaS app, it fails even with a high score.

## Common slop fingerprints

| Fingerprint | Why it fails | Repair move |
| --- | --- | --- |
| "Manage everything in one place" | No workflow, object, or user need | Name the actual objects and workflow |
| "Unlock powerful insights" | Empty value claim | Name the decision, metric, or evidence the product supports |
| "Seamless collaboration" | Generic promise | Name the team action, handoff, or shared artifact |
| "Boost productivity" | Unmeasured outcome | Name time saved only if measured, otherwise name the concrete task made easier |
| "Take control" | Vague empowerment copy | Name the setting, permission, limit, or action |
| "Something went wrong" | No recovery path | Name what failed and the next safe step when known |

## internal-planning leakage

Internal planning language fails when it tells the reader how the page was arranged instead of giving the reader useful public copy. Phrases such as `Company trust first` and `The Home page opens` describe a review artifact, not the service.

Fail if the copy names page order, component purpose, reviewer intent, or content strategy as if it were visitor-facing text. Repair by writing from the visitor's decision point and moving rationale back into notes.

## QA-language leakage

QA-language leakage happens when guardrails, review findings, or validation notes escape into public copy. Korean strings such as `제품 섹션입니다` often signal that the text is describing a component instead of speaking as the product.

Fail if the copy reads like a test note, reviewer comment, lint rule, or section annotation. Repair by separating the internal finding from the public sentence.

## claim-boundary leakage

Claim boundaries belong in review notes unless the public copy needs a user-visible limitation. A sentence such as `포렌식 확실성을 지어내지 않습니다` explains a reviewer constraint and can sound like an odd public denial.

Fail if the copy exposes internal caution, legal reasoning, or unsupported certainty handling instead of stating only what the product can verify. Repair by checking approved claims and writing the public boundary in plain terms.

## homepage/service prose slop

Homepage and service prose fails when it sounds polished but could sit on any vendor site. It also fails when it talks about the page, the section, or the strategy rather than the company, service, visitor task, destination, or proof.

Check homepage heroes, product/service pages, proof panels, route cards, CTA/link text, captions, diagram labels, metadata, fallback text, and localized copy. Each surface needs evidence from the actual offer and route.

## AI-copy construction fingerprints

| Failure shape | Why it fails | Repair move |
| --- | --- | --- |
| `Company trust first` | Internal ordering note, not public copy | Move to rationale and write the visitor-facing claim from approved proof |
| `The Home page opens` | Page-description prose, not display text | Write the page copy itself or document the observation separately |
| `제품 섹션입니다` | Korean component label, not natural public prose | Name the service role only when evidence supports it |
| `포렌식 확실성을 지어내지 않습니다` | Claim-safety note leaked into Korean copy | Keep the review constraint in notes and publish only verified limits |
| `unlock` | Generic value verb | Name the actual action, access, or result |
| `empower` | Vague agency claim | Name the actor and decision the product supports |
| `seamless` | Unsupported experience promise | Name the handoff or integration behavior that evidence proves |
| `all-in-one` | Broad category claim | List the specific covered capabilities or narrow the scope |
| `future of` | Inflated category-leadership frame | State the current service capability and proof |

## Remediation steps

1. Find the surface. Name whether the text is UI, docs, CLI, notification, backend/API product-facing error, admin/operator, onboarding, support, release notes, homepage hero, product/service page, proof panel, route card, CTA/link, caption/diagram label, metadata/fallback text, or localized copy.
2. Pull evidence. Read the closest source of truth before rewriting.
3. Replace generic nouns with canonical nouns or verified user words.
4. Replace generic verbs with workflow verbs.
5. Add only the amount of context that surface needs.
6. Keep standard labels generic when they are clearer than a domain phrase.
7. Check contract safety before touching errors, APIs, SDKs, logs, telemetry, localization, or CLI output.
8. Re-run the required gate. If the result still sounds portable to any SaaS app, repeat from evidence.

## When generic is correct

Generic is not always slop. It is acceptable when a term is a standard label, a platform convention, an accessibility expectation, a protocol term, or a stable contract field. `Save`, `Cancel`, `Settings`, `Help`, `version`, `status`, `404`, and `error_code` can remain generic when changing them would reduce clarity or break a contract.

## Boundary with Impeccable and documentation-sdk

Do not copy Impeccable's full UI copy rules into this detector. Use Impeccable for detailed interface writing and accessibility mechanics. Do not copy documentation-sdk's structure rules. Use documentation-sdk for API docs, SDK examples, and release-note structure. This detector only decides whether wording has product-specific evidence and safe domain language.
