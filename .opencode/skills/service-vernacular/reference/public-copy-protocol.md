# Public-copy protocol

Use this reference when repo evidence, a language dossier, or product notes must become publishable public copy. Evidence is necessary, but evidence-backed text can still fail when it exposes internal planning, proof structure, QA work, routing logic, locale research, translation rationale, transcreation strategy, or author constraints to the reader.

## evidence-to-public-copy workflow

1. Gather product evidence first: visible product surfaces, customer language, docs, support notes, schemas, contracts, current copy, and the locale dossier when localized copy is involved.
2. Classify every meaningful copy block before rewriting: `public display copy`, `internal rationale`, `evidence notes`, `QA notes`, `contract notes`, `locale research notes`, `translation rationale`, `transcreation strategy`, or `implementation/page-planning language`.
3. Fill an `intent card` for each public surface or copy batch.
4. For localized, bilingual, translated, or non-source-language copy, record the source locale, target locale, source intent, protected terms, transcreation decision, and target-locale native review needs before drafting.
5. Draft only the `public display copy` from the reader's problem, decision, outcome, and trusted proof.
6. Move reasoning, source mapping, locale research notes, translation rationale, transcreation strategy, QA coverage, claim limits, and route plans into notes.
7. Run the leakage check before accepting any public string.
8. Run target-locale native review for localized public copy.
9. Run `Korean-native review` and the deeper Korean specialization when Korean public copy exists.

## Copy block definitions

`public display copy` is text a visitor, buyer, user, operator, or support reader can see in the product, homepage, service page, docs, notification, CLI, or public fallback state. It must speak to the reader's task, decision, problem, next action, or outcome.

`internal rationale` explains why the copy is written a certain way. Internal rationale may appear in notes, review comments, or handoff material, but it is forbidden as public display copy.

`evidence notes` record the source behind nouns, verbs, claims, register, protected terms, and proof. They belong in evidence logs, not in public strings.

`QA notes` record test coverage, validation paths, reviewer decisions, fixture status, and pass or fail outcomes. They help reviewers, not readers.

`contract notes` record protected API, SDK, CLI, localization, telemetry, legal, regulated, or support-policy boundaries. They keep claims safe, but they are not buyer-facing prose.

`locale research notes` record target-locale conventions, termbase evidence, in-market examples, script or layout risks, and native-review gaps. They guide the writer, but they must not appear as public display copy.

`translation rationale` explains why target copy follows or departs from the source wording. It belongs in the intent card, review note, or dossier, not in the public string.

`transcreation strategy` explains why persuasive public copy changed structure, proof order, rhythm, imagery, or CTA shape to preserve source intent. Public copy should show the better target-locale line, not the strategy behind it.

`implementation/page-planning language` describes routes, sections, components, page order, proof layers, fallback mechanics, authoring constraints, or how the page is assembled. It belongs in plans, tickets, design notes, or comments, not in public display copy.

## Intent card schema

Use this exact schema before accepting a meaningful public rewrite:

1. `Surface/location`
2. `Audience/reader`
3. `Source locale`
4. `Target locale`
5. `Source intent`
6. `Copy job`
7. `Evidence source`
8. `Claim boundary`
9. `Protected terms/contracts`
10. `Locale-specific glossary/termbase`
11. `Do not translate / protected terms`
12. `Approved localized variants`
13. `Register/formality by audience/surface`
14. `Transcreation decision`
15. `Public-facing draft`
16. `Internal rationale/evidence notes`
17. `Leakage check`
18. `Target-locale native review` for localized public copy
19. `Native/in-market review` for public, persuasive, regulated, trust-sensitive, or high-traffic localized copy
20. `Korean-native review` when Korean copy exists

## Public-copy boundaries

Public copy may say what the product helps the reader understand, choose, trust, recover from, or do next.

Public copy may not expose the reviewer's proof workflow, the implementer's page plan, or the route that will render the block. A reader should not have to know that a hero, route card, proof panel, claim checklist, QA pass, locale research pass, or transcreation decision exists.

Hard fail any public string that describes page mechanics, route sequencing, proof layers, visitor routing, QA coverage, claim-boundary checklists, locale-research work, translation rationale, transcreation strategy, or authoring constraints.

## Public/private leakage boundaries

Public display copy cannot expose translation rationale, locale research notes, QA notes, or transcreation strategy. Those notes stay private in the dossier, intent card, review artifact, handoff, or issue.

Private notes may say why the source wording changed, which target-locale convention was applied, who reviewed the copy, what evidence was used, and which transcreation path was chosen. Public copy may only contain the target-locale reader-facing result.

If the public string needs a phrase like "based on locale research," "our transcreation strategy," "native review passed," "QA verified," or "we preserved source intent," it is still a note, not display copy.

Hard fail these public-copy shapes:

1. The string describes what a page, section, route, card, or panel does instead of what the reader gains or can decide.
2. The string tells the reader that a proof layer, source check, QA pass, native-review pass, or claim-boundary checklist was performed.
3. The string explains internal visitor routing, page sequencing, implementation ownership, or author constraints.
4. The string names evidence as evidence instead of turning the proven fact into useful public copy.
5. The string exposes translation rationale, locale research notes, or transcreation strategy instead of presenting the target-locale result.
6. The string reads like a plan sentence moved into the page without a reader-facing job.

## Negative fixtures

Label observed failures as `failed public copy / do not publish`. Use negative fixtures to explain why a string fails and what kind of public job it needs. Do not present them as accepted copy, final homepage copy, or a recommended product claim.

## Acceptance check

Before accepting public display copy, confirm:

1. The intent card is complete.
2. Notes and rationale are separated from the public string.
3. The claim is backed by evidence and stays inside contract boundaries.
4. The copy names reader value, not internal page mechanics.
5. Public display copy does not expose translation rationale, locale research notes, QA notes, or transcreation strategy.
6. Localized public copy passed target-locale native review, or the missing review is recorded as an open question outside the public string.
7. Korean public copy passed Korean-native review and the deeper Korean specialization when applicable.
