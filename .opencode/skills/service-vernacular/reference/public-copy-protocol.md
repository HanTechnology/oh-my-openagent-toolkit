# Public-copy protocol

Use this reference when repo evidence, a language dossier, or product notes must become publishable public copy. Evidence is necessary, but evidence-backed text can still fail when it exposes internal planning, proof structure, QA work, routing logic, or author constraints to the reader.

## evidence-to-public-copy workflow

1. Gather product evidence first: visible product surfaces, customer language, docs, support notes, schemas, contracts, and current copy.
2. Classify every meaningful copy block before rewriting: `public display copy`, `internal rationale`, `evidence notes`, `QA notes`, `contract notes`, or `implementation/page-planning language`.
3. Fill an `intent card` for each public surface or copy batch.
4. Draft only the `public display copy` from the reader's problem, decision, outcome, and trusted proof.
5. Move reasoning, source mapping, QA coverage, claim limits, and route plans into notes.
6. Run the leakage check before accepting any public string.
7. Run `Korean-native review` when Korean public copy exists.

## Copy block definitions

`public display copy` is text a visitor, buyer, user, operator, or support reader can see in the product, homepage, service page, docs, notification, CLI, or public fallback state. It must speak to the reader's task, decision, problem, next action, or outcome.

`internal rationale` explains why the copy is written a certain way. Internal rationale may appear in notes, review comments, or handoff material, but it is forbidden as public display copy.

`evidence notes` record the source behind nouns, verbs, claims, register, protected terms, and proof. They belong in evidence logs, not in public strings.

`QA notes` record test coverage, validation paths, reviewer decisions, fixture status, and pass or fail outcomes. They help reviewers, not readers.

`contract notes` record protected API, SDK, CLI, localization, telemetry, legal, regulated, or support-policy boundaries. They keep claims safe, but they are not buyer-facing prose.

`implementation/page-planning language` describes routes, sections, components, page order, proof layers, fallback mechanics, authoring constraints, or how the page is assembled. It belongs in plans, tickets, design notes, or comments, not in public display copy.

## Intent card schema

Use this exact schema before accepting a meaningful public rewrite:

1. `Surface/location`
2. `Audience/reader`
3. `Copy job`
4. `Evidence source`
5. `Claim boundary`
6. `Protected terms/contracts`
7. `Public-facing draft`
8. `Internal rationale/evidence notes`
9. `Leakage check`
10. `Korean-native review` when Korean copy exists

## Public-copy boundaries

Public copy may say what the product helps the reader understand, choose, trust, recover from, or do next.

Public copy may not expose the reviewer's proof workflow, the implementer's page plan, or the route that will render the block. A reader should not have to know that a hero, route card, proof panel, claim checklist, or QA pass exists.

Hard fail any public string that describes page mechanics, route sequencing, proof layers, visitor routing, QA coverage, claim-boundary checklists, or authoring constraints.

Hard fail these public-copy shapes:

1. The string describes what a page, section, route, card, or panel does instead of what the reader gains or can decide.
2. The string tells the reader that a proof layer, source check, QA pass, or claim-boundary checklist was performed.
3. The string explains internal visitor routing, page sequencing, implementation ownership, or author constraints.
4. The string names evidence as evidence instead of turning the proven fact into useful public copy.
5. The string reads like a plan sentence moved into the page without a reader-facing job.

## Negative fixtures

Label observed failures as `failed public copy / do not publish`. Use negative fixtures to explain why a string fails and what kind of public job it needs. Do not present them as accepted copy, final homepage copy, or a recommended product claim.

## Acceptance check

Before accepting public display copy, confirm:

1. The intent card is complete.
2. Notes and rationale are separated from the public string.
3. The claim is backed by evidence and stays inside contract boundaries.
4. The copy names reader value, not internal page mechanics.
5. Korean public copy passed Korean-native review when applicable.
