# NestJS overlay for `backend-node`

Use this overlay when the Node backend is primarily a NestJS codebase and module, provider, guard, pipe, or interceptor boundaries dominate the work.

## Reach for this overlay when

- the service already uses NestJS modules, controllers, and providers,
- dependency injection and decorator-driven composition are core to the codebase,
- the request path depends on guards, pipes, interceptors, gateways, or queue workers.

## Working rules

- Keep modules bounded by domain or service ownership instead of building one catch-all app module.
- Keep controllers thin, providers explicit, and business rules in services that can be tested without transport glue.
- Put validation and transformation at the DTO boundary with pipes or schema helpers that are visible to the team.
- Treat guards, interceptors, and exception filters as contract tools, not places to hide core domain behavior.
- Keep Swagger or OpenAPI annotations aligned with the real request and response shapes.
- Use gateways, queues, and schedulers deliberately when async delivery or background work leaves the request path.

## Watchouts

- Avoid circular module dependencies that only exist to satisfy decorator wiring.
- Avoid burying authorization or validation rules in custom framework magic that nobody can follow.
- Avoid mixing transport concerns, ORM concerns, and domain decisions in one service class.
