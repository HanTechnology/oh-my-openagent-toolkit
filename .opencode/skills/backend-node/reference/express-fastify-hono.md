# Express, Fastify, and Hono overlay for `backend-node`

Use this overlay when the backend is a lighter Node HTTP service and route handlers, middleware ordering, schema validation, or edge deployment constraints matter more than a heavy application framework.

## Reach for this overlay when

- the service is built on Express, Fastify, or Hono,
- the team wants explicit handler and middleware ownership,
- performance, startup cost, or edge-friendly delivery is a stronger concern than framework ceremony.

## Working rules

- Keep handlers thin and move business logic into services or modules that are not coupled to `req` and `res` objects.
- Use schema-driven validation and serialization so request shapes, response shapes, and status codes are explicit.
- Make authentication, authorization, and rate limiting visible in middleware or route composition, not scattered across handlers.
- Keep error mapping centralized so the API contract stays consistent across frameworks and deployment targets.
- Generate or maintain OpenAPI from the same schemas or route definitions that drive runtime behavior whenever possible.
- Be clear about framework differences: Express middleware order is everything, Fastify wants typed schemas and hooks, and Hono often lives closer to edge and fetch-style constraints.

## Watchouts

- Avoid mutating request objects with undocumented state that downstream handlers silently depend on.
- Avoid shipping unbounded CPU work inside request handlers on the event loop.
- Avoid framework-specific helpers leaking so deeply into the domain layer that migration becomes expensive.
