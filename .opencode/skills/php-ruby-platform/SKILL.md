---
name: php-ruby-platform
description: Deliver PHP and Ruby application-platform work across Laravel, Symfony, and Rails while keeping routing, validation, data access, jobs, and service boundaries explicit.
---

# PHP Ruby Platform

Use this pack for PHP and Ruby platform work: Laravel applications, Symfony services, Rails apps, server-rendered products, JSON APIs, admin systems, background jobs, and convention-heavy application delivery.

Defer first-pass route choice and lane selection to `../../reference/routing-matrix.md`.

This is the general PHP and Ruby family pack for the repo. Use the overlay in `reference/laravel-symfony-rails.md` to tune decisions for Laravel, Symfony, and Rails while keeping the same expectations for routing, validation, ORM usage, job execution, and testing conventions.

## Setup posture

- Prefer modernizing, refining, or extending an existing project in place.
- Treat scaffold, `create`, `init`, or `new` flows as greenfield-only and explicit-request-only. Defer to `.opencode/reference/project-setup-policy.md`.

## Core focus

- Keep routing, controllers, actions, and request entry points readable from transport boundary to domain logic.
- Make validation, authorization, serialization, and error handling explicit instead of relying on framework magic alone.
- Treat ORM and data access patterns as architectural choices with visible transactions, query behavior, and ownership.
- Keep jobs, queues, mailers, and event-driven work deliberate, idempotent, and easy to trace.
- Preserve testing conventions that match how Laravel, Symfony, and Rails applications are actually structured.

## Shared PHP and Ruby standards

- Keep controllers and actions thin; move durable business rules into services, domain objects, or clearly owned application layers.
- Validate at the boundary with request objects, form requests, form objects, schemas, or equivalent framework-native mechanisms.
- Make ORM usage readable so eager loading, transactions, callbacks, and query boundaries do not become hidden surprises.
- Keep queue, job, and background execution behavior explicit, including retries, idempotency, and failure handling.
- Use framework conventions on purpose, but leave enough structure that routing, validation, and data flow are still easy to audit.

## Default workflow

1. Inspect the framework structure, dependency injection style, route layout, and existing test conventions.
2. Choose the framework overlay in `reference/laravel-symfony-rails.md`.
3. Define route contracts, validation flow, service boundaries, data access, and background-job behavior before broad implementation.
4. Implement transport logic, application services, and tests together so framework conventions stay coherent.
5. Run `review-work` after substantial PHP or Ruby platform changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local controllers, services, routes, and test patterns.
- Use `Librarian` or `Context7` when framework APIs, ORM behavior, or queue semantics need a source-of-truth check.
- Use `review-work` when routing, validation, data access, or job behavior changes materially.

## Overlays

- `reference/laravel-symfony-rails.md` for routing, validation, DI or container boundaries, jobs or queues, and framework testing conventions.

## Guardrails

- Do not bury domain behavior inside controllers, callbacks, helpers, or convenience traits that make request flow hard to trace.
- Do not let framework magic hide validation, transaction scope, authorization, or job retry behavior.
- Do not treat ORM entities or active record models as the only place business rules can live.
