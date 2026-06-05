# Rewrite gates

Use these gates before accepting service-vernacular output. They keep rewrites clear, useful, accessible, evidence-backed, and safe across surfaces.

## Gate 1: evidence first

A rewrite must name the evidence behind its main noun, verb, claim, or register choice. Evidence can be a product surface, source file, schema, error catalog, support article, research note, runbook, docs page, release note, or observed user wording.

Fail if the rewrite only sounds better but cannot point to domain evidence.

## Gate 2: clarity before style

The user should understand the message without knowing internal architecture. Prefer concrete nouns, direct verbs, and short sentences. Do not replace a clear standard label with a branded or clever phrase.

Fail if the rewrite makes the user infer the object, action, consequence, or next step.

## Gate 3: accessibility and comprehension

Copy must work for screen readers, keyboard users, translation, small screens, assistive labels, and low-context moments. For UI, pair this gate with Impeccable when detailed interaction-copy mechanics matter.

Fail if link text, labels, alt text, state text, or instructions lose standalone meaning.

## Gate 4: usefulness over cleverness

The rewrite should help the user decide, act, recover, or understand. Wit, wordplay, and brand flavor lose to accuracy and speed.

Fail if the sentence is memorable but less useful than the original.

## Gate 5: standard-label preservation

Generic standard labels may remain generic when clearest. Keep standard labels when users expect them, assistive technology benefits from them, platform conventions depend on them, or contract stability requires them.

Examples that may stay generic when clear: `Save`, `Cancel`, `Settings`, `Help`, `Search`, `Filter`, `Next`, `Back`, `version`, `status`, `init`, `Error`, `Warning`, `Added`, `Changed`, and `Fixed`.

Fail if a rewrite invents a domain phrase for a standard action and makes the product harder to use.

## Gate 6: before/after requirements

Every accepted rewrite batch should include:

1. Surface name.
2. Before text.
3. After text.
4. Evidence used.
5. Why the rewrite is not generic.
6. Contract-safety note when the text touches API, CLI, localization, logs, telemetry, SDK, or status semantics.
7. Source locale, target locale, transcreation decision, and native-review status when copy is localized, bilingual, translated, or non-source-language public copy.

Fail if the rewrite cannot be audited from before to after.

## Gate 7: evidence-backed rewrite rules

1. Change nouns only when evidence supports the new noun.
2. Change verbs only when they match the user's workflow.
3. Change claims only when the product evidence supports them.
4. Change tone only to fit the surface and user state.
5. Keep uncertainty visible. If evidence is weak, mark the rewrite provisional instead of presenting it as doctrine.
6. Do not alter regulated/legal claims without explicit authorization.

Fail if a rewrite adds a capability, guarantee, support promise, performance promise, or regulated/legal claim that the source material does not prove.

## Gate 8: contract safety

Run `contract-safety.md` before accepting changes to backend/API product-facing errors, CLI output, localization strings, SDK docs, telemetry references, logs, or release notes that cite public semantics.

Fail if the rewrite changes a protected contract field without explicit authorization.

## Gate 9: publishability gate

Public copy must be publishable as-is for the named surface, not merely useful as a review note. Homepage, service, proof, route, CTA, link, caption, metadata, fallback, and localized copy must read like text a visitor could see.

Fail if the rewrite describes the page, strategy, QA finding, or internal rationale instead of giving the public sentence.

## Gate 10: public display copy

For public display copy, check the visible string without surrounding notes. The sentence must name the offer, action, proof, route, or limit that the surface needs and must not depend on hidden reviewer context.

Fail if a homepage or service sentence only works after reading the internal explanation.

## Gate 11: internal-rationale separation

Keep rationale, evidence notes, review constraints, and claim-limit reasoning separate from the copy that ships. Before/after blocks may include both, but the accepted `After` text must contain only publishable wording.

Fail if phrases such as content order, company trust first, section purpose, QA outcome, or claim-safety reasoning leak into display copy.

## Gate 12: target-locale native review

Localized, bilingual, translated, or non-source-language public copy must pass target-locale native review before it is called publishable. The review checks source intent, claim boundary, register, cultural fit, domain terminology, protected terms, and surface context.

Fail if the copy sounds translated, uses the source locale's sentence shape, lacks required native-review evidence, or hides a missing native review inside the public string.

## Gate 13: transcreation decision

Record the transcreation decision before drafting each localized block: translation, localization, transcreation, or mixed by block. Persuasive heroes, CTAs, proof panels, and campaign-like service prose may change structure, rhythm, proof order, or imagery to keep the same reader decision. Factual, procedural, legal, help, CLI, API, and contract-adjacent copy need tighter parity.

Fail if the rewrite copies source syntax when the target locale needs a native expression, or if transcreation adds a promise, audience, route, commitment, or support scope that the source evidence does not support.

## Gate 14: locale terminology and termbase

Localized copy must use locale terminology from the dossier, glossary, termbase, existing approved localized copy, user language, and protected-term list. Keep do-not-translate terms, localization keys, API names, model names, product names, status codes, enum values, telemetry names, and approved English terms unchanged unless the contract owner authorizes a change.

Fail if a localized rewrite translates a protected term for style, chooses a term that conflicts with the termbase, or forces a protected English term into awkward target-locale grammar instead of rewriting the surrounding sentence.

## Gate 15: locale claim parity

Compare source and target copy for locale claim parity: claim strength, actor, object, audience, next action, obligation, condition, risk, legal qualifier, support scope, and proof boundary must stay aligned unless an approved locale-specific rule narrows the target claim.

Fail if the target locale adds certainty, removes a qualifier, changes the user's commitment, softens a required warning, broadens a regulated claim, or turns a support note into a public promise.

## Gate 16: Korean-native review

Korean public copy must pass a native-register check for grammar, spacing, rhythm, mixed-language terms, and surface fit. Keep approved English product names only when they are the public convention.

Fail if Korean text reads like English syntax, a literal translation, a component annotation, or a reviewer note.

## Gate 17: CTA/link predictability

CTA and link text must predict the destination and commitment level. Check the target URL, modal, form, auth state, or route before accepting the verb.

Fail if the link could surprise the user, overstate the action, or use a vague verb when the destination is specific.

## Gate 18: headline rhythm

Headlines should have a clear subject, a readable cadence, and a surface-appropriate claim. Public homepage and service headlines can be concise, but they still need meaning and proof boundaries.

Fail if the headline is a stacked slogan, a generic value claim, an internal page summary, or a rhythm copied from English into Korean without native flow.

## Gate 19: EN/KO meaning parity

When English and Korean copy describe the same public surface, compare meaning, claim strength, actor, object, and next action. The languages may differ in rhythm, but they must not differ in promise.

Fail if one locale adds capability, certainty, support scope, product category, or visitor instruction that the other locale does not support.

## Final acceptance check

Ask the slop-detector gate last:

`Could this copy belong to any generic SaaS app?`

If yes, return to the evidence source and rewrite again, unless the text is a standard label that is generic by design.
