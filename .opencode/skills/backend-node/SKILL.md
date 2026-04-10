---
name: backend-node
description: Deliver Node.js and TypeScript backends across NestJS and lighter HTTP frameworks without letting one framework own API, validation, auth, or service design.
---

# Backend Node

Use this pack for Node.js backend work: HTTP APIs, service modules, auth flows, background jobs, event-driven edges, and server-side delivery patterns that live in the JavaScript or TypeScript ecosystem.

This is the general Node backend pack for the repo. Use the overlays in `reference/` to tune decisions for NestJS or the lighter Express, Fastify, and Hono family while keeping the same quality bar for contracts, validation, documentation, and operational behavior.

## Core focus

- Design API contracts that stay readable across controllers, handlers, queues, and integrations.
- Keep validation, serialization, and error mapping explicit at the request boundary.
- Choose authentication and authorization flows deliberately: sessions, JWTs, service credentials, guards, or policy middleware.
- Treat async work as architecture: request lifecycle, background jobs, webhooks, queues, caching, and real-time edges.
- Keep documentation, observability, and failure behavior close to the service surface.

## Shared Node backend standards

- Keep TypeScript strict where the codebase supports it, and do not hide domain rules inside framework magic.
- Separate transport concerns from service logic. Controllers or route handlers should translate requests, not own the business model.
- Use schema or DTO validation on every external boundary. Inputs, auth context, and error shapes should be predictable.
- Document public or shared endpoints with OpenAPI or an equally explicit contract surface.
- Be deliberate about concurrency on the event loop. Offload long-running or retry-heavy work to background processors instead of stretching request timeouts.
- Make refresh, revocation, RBAC or policy checks, and rate limiting visible in the request path rather than implied.

## Default workflow

1. Inspect the existing service shape, middleware stack, and runtime constraints.
2. Choose the closest overlay from `reference/nestjs.md` or `reference/express-fastify-hono.md`.
3. Define the contract, validation rules, auth path, and async behavior before spreading logic across handlers.
4. Implement the request path, queue or job path, and documentation surface together so the backend stays operable.
5. Run `review-work` after substantial backend changes.

## Collaboration in this repo

- Use `Explore` before editing so the new work matches local service and middleware patterns.
- Use `Librarian` or `Context7` when framework, library, or protocol details need a source-of-truth check.
- Pair with `architecture-integration` when API contracts, integration boundaries, or cross-service ownership dominate the task.

## Overlays

- `reference/nestjs.md` for decorator-heavy NestJS services, DI modules, guards, pipes, interceptors, and gateway or queue patterns.
- `reference/express-fastify-hono.md` for lighter Node HTTP services, schema-driven routing, middleware pipelines, and edge-friendly APIs.

## Guardrails

- Do not let one framework's conventions define the whole Node backend pack.
- Do not bury validation, auth, or error contracts inside decorators or middleware nobody can trace.
- Do not keep CPU-heavy or retry-heavy work on the hot request path by accident.
