# Language dossier reference

Use this reference when service-vernacular needs a project-local language source of truth before rewriting user-facing text. The dossier records observed domain language, locale evidence, user mental models, and surface-specific register choices. It does not replace Impeccable UI copy mechanics, documentation-sdk structure, routing policy, localization-platform ownership, or support-tier claims.

## Dossier precedence

1. `LANGUAGE.md` is the canonical project-local dossier for service vernacular work.
2. `DOMAIN_LANGUAGE.md` is alternate/legacy context. Read it when present, but treat it as supporting evidence rather than the final authority.
3. When `LANGUAGE.md` and `DOMAIN_LANGUAGE.md` both exist, `LANGUAGE.md` wins.
4. If `DOMAIN_LANGUAGE.md` contains current evidence missing from `LANGUAGE.md`, verify it against repo or product sources before moving it into `LANGUAGE.md`.
5. `LANGUAGE.md` is created or updated when service-vernacular is used and evidence warrants it. It is not mandatory for every toolkit project.

## Evidence requirements

Create or update `LANGUAGE.md` only after reading enough product evidence to separate native language from invented flavor.

Use at least two source types when available:

1. Product UI strings, command output, notification copy, error messages, docs, support articles, or release notes.
2. Domain nouns in schemas, API names, event names, logs, tests, fixtures, examples, runbooks, customer-facing tickets, or onboarding material.
3. User wording from research, support transcripts, sales calls, issue reports, community posts, or documented feedback.
4. Regulated/legal claims that must not be rewritten without explicit authorization.
5. Existing localized copy, approved termbases, in-market copy, or native-review notes when target-locale public copy is involved.

Every meaningful dossier entry should name its evidence source. Prefer file paths, command names, route names, ticket links, or observed surface names over vague claims like "the app says this."

For localized, bilingual, translated, or non-source-language publication, record locale-level evidence before rewriting. Name the source locale, target locale, source intent, locale conventions, protected terms, and native-review gaps separately from public display copy.

## Root selection

For a single app or package, place `LANGUAGE.md` at the project root next to the primary README. In a monorepo, place it at the smallest root that owns the language system being changed. Use the repo root only when the same nouns, verbs, and registers apply across packages.

When a monorepo has separate products with different audiences, create separate dossiers in the owning package roots. Do not force one shared voice across unrelated services.

## Update rules

1. Preserve dated evidence and last-reviewed metadata.
2. Mark uncertain terms as provisional instead of turning guesses into rules.
3. Keep internal implementation names separate from words users should see.
4. Keep standard labels generic when that is clearest, common, or accessibility-critical.
5. Record forbidden terms with the reason they fail, such as vague, over-branded, internal-only, misleading, or contract-sensitive.
6. Do not alter regulated/legal claims without explicit authorization.
7. Keep locale research, translation rationale, native-review notes, and transcreation decisions in dossier or handoff notes, not in public display copy.

## Complete `LANGUAGE.md` template

Copy this template into the selected project root when evidence warrants a dossier. Keep sections that are empty, and mark them `Unknown` rather than deleting them.

```markdown
# LANGUAGE.md

## Purpose

This file is the canonical domain-language dossier for [product or service]. It records evidence-backed terms, surface registers, locale-level evidence, claim boundaries, and rewrite examples for user-facing language.

## Evidence sources

| Source | Locale or audience | Path, URL, or surface | What it proves | Last checked |
| --- | --- | --- | --- | --- |
| [source name] | [source locale, target locale, or audience] | [path or observed surface] | [nouns, verbs, audience, workflow, claim, tone, locale convention] | [YYYY-MM-DD] |

## Locale scope

| Field | Value | Evidence |
| --- | --- | --- |
| Source locale | [language, region, script, direction, or Unknown] | [source] |
| Target locale | [language, region, script, direction, or Unknown] | [source] |
| Source intent | [what the source copy helps the reader understand, trust, choose, recover from, or do next] | [source] |
| Target audience and surface | [audience, market, channel, UI/docs/CLI/support/public surface] | [source] |
| Translation/localization/transcreation decision | [translation, localization, transcreation, mixed by block, or Unknown] | [source] |
| Locale conventions | [date, number, units, punctuation, pronouns, formality, honorifics, direction, spacing, rhythm] | [source] |
| Native/in-market review need | [required, recommended, unavailable, or not applicable] | [source] |

## Users and audiences

| Audience | Context | Needs | Terms they use | Terms to avoid |
| --- | --- | --- | --- | --- |
| [audience] | [where they meet the product] | [what they are trying to do] | [observed words] | [confusing or internal words] |

## Workflows

| Workflow | User goal | Entry point | Success language | Failure language |
| --- | --- | --- | --- | --- |
| [workflow] | [goal] | [UI, CLI, API, docs, support, notification, admin] | [words that confirm progress] | [words that explain recovery] |

## Canonical nouns

| Canonical noun | Meaning | Evidence | Accepted variants | Do not use |
| --- | --- | --- | --- | --- |
| [noun] | [definition] | [source] | [variants for specific surfaces] | [forbidden variants] |

## Canonical verbs

| Canonical verb | Meaning | Evidence | Use when | Do not use |
| --- | --- | --- | --- | --- |
| [verb] | [definition] | [source] | [workflow or surface] | [near miss verbs] |

## Glossary

| Term | User-facing definition | Internal notes | Evidence |
| --- | --- | --- | --- |
| [term] | [plain definition] | [implementation detail, if needed] | [source] |

## Locale-specific glossary and termbase

Use this section for the locale-specific glossary/termbase and approved localized variants.

| Term | Source locale wording | Target locale wording | Approved localized variants | Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| [term] | [source wording] | [target wording] | [approved localized variants] | [source] | [domain, grammar, morphology, or market note] |

## Do not translate / protected terms

| Term | Protection reason | Allowed target-locale handling | Surrounding grammar notes | Evidence |
| --- | --- | --- | --- | --- |
| [term] | [product name, API, SDK, model, legal, contract, localization key, code, enum, telemetry, or brand] | [keep exact, localize only as approved, or Unknown] | [particle, inflection, spacing, placeholder, direction, or agreement note] | [source] |

## Forbidden terms

| Term | Why it fails | Replacement | Evidence |
| --- | --- | --- | --- |
| [term] | [generic, vague, misleading, internal-only, over-branded, contract-sensitive, locale-inappropriate] | [replacement] | [source] |

## Surface registers

| Surface | Audience | Register/formality | Canonical nouns | Canonical verbs | Standard labels that stay generic | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| UI | [reader] | [task-focused, plain, formal, casual, honorific, or Unknown] | [nouns] | [verbs] | [Save, Cancel, Settings, or other clear standards] | [constraints] |
| Docs | [reader] | [teaching, precise, formal, casual, or Unknown] | [nouns] | [verbs] | [standard headings or API labels] | [constraints] |
| CLI | [reader] | [direct, script-safe, terse, or Unknown] | [nouns] | [verbs] | [help, version, init, status] | [constraints] |
| Notifications | [reader] | [timely, short, calm, or Unknown] | [nouns] | [verbs] | [standard severity labels] | [constraints] |
| Backend/API product-facing errors | [reader] | [specific, recovery-oriented, contract-safe, or Unknown] | [nouns] | [verbs] | [status or protocol labels] | [contracts] |
| Admin/operator | [reader] | [diagnostic, calm, or Unknown] | [nouns] | [verbs] | [standard operational labels] | [constraints] |
| Onboarding | [reader] | [guided, confidence-building, or Unknown] | [nouns] | [verbs] | [standard setup labels] | [constraints] |
| Support | [reader] | [empathetic, evidence-based, or Unknown] | [nouns] | [verbs] | [known support categories] | [constraints] |
| Release notes | [reader] | [impact-first, concrete, or Unknown] | [nouns] | [verbs] | [known change categories] | [constraints] |

## Locale-specific claim/legal notes

| Claim or legal topic | Source-locale wording | Target-locale constraint | Allowed target-locale wording | Requires approval | Never imply |
| --- | --- | --- | --- | --- | --- |
| [claim/legal note] | [source claim] | [local legal, regulatory, cultural, or credibility constraint] | [approved or narrowed wording] | [owner or source] | [unsupported local claim] |

## Cultural adaptation notes

| Surface or copy block | Source cue | Target-locale adaptation | Evidence | Risk if ignored |
| --- | --- | --- | --- | --- |
| [surface/block] | [idiom, metaphor, proof order, example, date/unit, CTA, politeness, humor, or visual-text dependency] | [adaptation or Unknown] | [source] | [misread, mistrust, legal risk, weak CTA, layout issue] |

## Claim boundaries

| Claim type | Allowed wording | Requires approval | Never imply |
| --- | --- | --- | --- |
| Product capability | [evidence-backed claim] | [owner or source] | [unsupported claim] |
| Reliability or performance | [measured claim] | [metric owner] | [unmeasured guarantee] |
| Regulated/legal claim | [approved wording] | [explicit authorization] | [new regulated/legal claim] |
| API or SDK behavior | [documented semantics] | [contract owner] | [semantic change through copy] |
| Locale-specific claim/legal note | [target-locale approved wording] | [local claim owner or legal source] | [broader localized claim] |

## Native-review evidence and open questions

Record native-review evidence separately from public copy. If review is missing, keep the gap visible instead of marking target copy as market-ready.

| Target locale | Reviewer or evidence source | Review type | Result | Open questions | Last checked |
| --- | --- | --- | --- | --- | --- |
| [target locale] | [native reviewer, in-market reviewer, domain reviewer, or evidence source] | [native, in-market, domain-aware, unavailable] | [approved, rejected, provisional, Unknown] | [terms, register, legal, claim, layout, cultural fit] | [YYYY-MM-DD] |

## Examples

| Surface | Before | After | Evidence used | Why the rewrite is not generic |
| --- | --- | --- | --- | --- |
| [surface] | [current text] | [rewritten text] | [source] | [domain noun, verb, workflow, audience signal, or locale convention] |

## Transcreation examples

Use transcreation examples only when the target-locale expression changes structure, rhythm, proof order, or imagery to preserve source intent.

| Surface | Source locale draft | Source intent | Target locale draft | Transcreation decision | Evidence used | Native-review note |
| --- | --- | --- | --- | --- | --- | --- |
| [surface] | [source copy] | [reader decision, claim, or outcome] | [target copy] | [translation, localization, transcreation, or mixed] | [source] | [approved, provisional, rejected, or Unknown] |

## Last-reviewed metadata

| Field | Value |
| --- | --- |
| Last reviewed | [YYYY-MM-DD] |
| Reviewed by | [name, role, or agent] |
| Evidence window | [date range or source set] |
| Open questions | [known gaps, including native-review evidence, locale conventions, and claim/legal notes] |
| Next review trigger | [release, product rename, new surface, target locale, support spike] |
```

## Handoff notes

Use Impeccable when a UI surface needs detailed button, empty-state, error, accessibility, or interaction-copy mechanics. Use documentation-sdk when docs, OpenAPI references, SDK examples, or release-note structure dominate the task. Use service-vernacular to decide which domain words, locale evidence, and registers those collaborators should apply.
