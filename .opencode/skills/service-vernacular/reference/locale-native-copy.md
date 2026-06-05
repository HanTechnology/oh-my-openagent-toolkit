# Locale-native copy

Use this reference when service-vernacular touches localized, bilingual, translated, or non-source-language public copy. It is the general locale-native protocol. Korean public copy must also use [korean-native-copy.md](korean-native-copy.md) as the deeper Korean specialization.

This reference guides wording and review only. It does not turn service-vernacular into a localization platform, a primary route, or a support claim.

## Locale scope

A locale = language + region + script + writing direction + cultural conventions. Do not treat a language name alone as the target. `Spanish`, `Arabic`, `Chinese`, and `English` are not precise enough when region, script, direction, legal norms, or audience expectations affect public copy.

Record locale scope in the locale dossier before rewriting:

1. Source language and target locale.
2. Target audience and service domain.
3. Surface and channel.
4. Risk level.
5. Source intent.
6. Protected terms, do-not-translate terms, and approved localized variants.
7. Native/in-market review needs.

## Source intent vs source syntax

Locale-native work preserves source intent, not source syntax. Start by restating what the source copy must help the reader understand, trust, choose, recover from, or do next. Then draft in the target locale's natural order, register, rhythm, and public conventions.

Reject target copy that mirrors the source sentence shape when it makes the target text stiff, unclear, too casual, too formal, legally unsafe, or culturally misplaced. Meaning parity matters more than word-order parity.

## Translation/localization/transcreation decision tree

Record a transcreation decision before drafting. Name one of these paths:

1. Translation: use when factual, procedural, legal, or help copy can keep the source structure without hurting clarity, claims, or reader action.
2. Localization: use when the same source intent needs local formats, examples, units, legal phrasing, punctuation, idiom avoidance, or service terms.
3. Transcreation: use when persuasive copy, campaign copy, headlines, CTAs, brand-heavy product claims, or market-sensitive service prose needs a new target-locale expression to preserve the source intent.

If the copy mixes jobs, split the decision by block. A homepage headline may need transcreation while a pricing footnote or help step needs translation or careful localization.

## Persuasive copy vs factual/procedural/legal/help copy

Persuasive copy can change structure, imagery, rhythm, and proof order when the target locale needs a different path to the same decision. Keep the claim boundary, but don't force the source syntax.

Factual, procedural, legal, and help copy need tighter parity. Keep steps, conditions, obligations, warnings, and contract terms stable. Localize formats and required legal phrasing only when evidence supports the change.

## Target-locale register and rhythm

Check target-locale register, formality, pronouns, honorifics, politeness, punctuation, and sentence rhythm before accepting public copy. Match the reader, service domain, channel, and risk level.

Review these points:

1. Is the register consistent across the surface?
2. Do pronouns, honorifics, and politeness match the audience relationship?
3. Does punctuation feel native to the target locale rather than copied from the source?
4. Does the sentence rhythm fit the surface, such as headline, CTA, alert, docs step, or support answer?
5. Does the line sound like public copy written for this market, not a literal translation?

## Domain terminology and protected terms

Build target-locale terminology from repo evidence, product docs, existing approved copy, support language, and user-provided context. The locale dossier should capture domain terminology, service-native collocations, and do-not-translate/protected terms.

Protect product names, brand names, API names, SDK names, model names, feature names, localization keys, error codes, log identifiers, telemetry names, status codes, enum values, and documented semantics unless the user or contract owner authorizes a change.

Do not translate a protected term just to make a sentence feel more local. Instead, rewrite the surrounding target-locale sentence so the protected term fits naturally.

## Target-locale legal/claim norms

Target-locale legal/claim norms can change what sounds safe, credible, or publishable. Check whether the locale has stricter rules or reader expectations for guarantees, savings claims, medical, financial, safety, compliance, security, AI, employment, accessibility, privacy, or regulated service promises.

When claim evidence is thin, narrow the copy. Do not make a localized claim broader than the source claim or the repo evidence.

## UI and layout risk

Localized UI copy can fail even when the words are right. Check UI expansion/truncation/layout risks before accepting strings.

Review these risks:

1. Text expansion in buttons, nav, tables, cards, toasts, mobile screens, and CLI columns.
2. Truncation that hides the action, warning, unit, object, or claim qualifier.
3. RTL direction, bidirectional mixed text, number placement, and icon direction.
4. CJK line breaking, no-space scripts, punctuation width, and vertical density.
5. Compound-word expansion, long agglutinative forms, and gendered or inflected variants.
6. Variables, placeholders, and protected English terms that need local grammar around them.

Flag UI/layout risk in the output even when implementation belongs to another route.

## Native review expectations

Run target-locale native review for localized public copy. For public, persuasive, regulated, trust-sensitive, or high-traffic surfaces, require native/in-market/domain-aware review by someone who understands the service domain.

A native/in-market review should confirm:

1. Source intent and claim boundary are preserved.
2. The wording reads native to the target locale and channel.
3. Domain terminology and service-native collocations are correct.
4. Do-not-translate terms are protected and placed naturally.
5. Register, formality, politeness, punctuation, and rhythm match the audience.
6. Legal or claim norms are respected.
7. UI/layout risk is named for the owning route.

If native review is unavailable, mark the gap as a remaining uncertainty rather than pretending the copy is market-ready.

## Korean specialization

Korean public copy needs this general locale-native review plus the deeper Korean-specific checks in [korean-native-copy.md](korean-native-copy.md). Use that reference for Korean-native review, Korean information flow, protected English terms in Korean grammar, particles, spacing, B2B technical register, `합니다체`/`해요체` choice, translationese, noun stacks, and read-aloud headline checks.

## Failure fixtures

Label failures as `failed public copy / do not publish` when they show any of these problems:

1. Source syntax copied into the target locale even though the target sentence sounds unnatural.
2. A transcreation decision is missing or mismatched to the surface.
3. Persuasive copy is translated literally and loses the reader's decision moment.
4. Factual, procedural, legal, or help copy changes obligations, conditions, warnings, or steps.
5. Domain terminology or service-native collocations are wrong.
6. Do-not-translate terms are translated, moved, or surrounded by awkward grammar.
7. Legal or claim norms become broader, riskier, or less credible in the target locale.
8. UI expansion, truncation, RTL, CJK, compound-word, or placeholder risks are ignored.
9. Native/in-market review is required but absent.

Negative fixtures are rejection evidence. They are not final localized copy and must not be softened into a recommendation without a fresh target-locale native review.
