---
name: functional-platform
description: Deliver immutable, concurrency-aware services and applications across Elixir, Scala, Haskell, Clojure, Erlang, and F# while keeping runtime and data-model choices explicit.
---

# Functional Platform

Use this pack for functional-platform work: Elixir and Erlang services, Phoenix applications, Scala backends, Haskell libraries, Clojure services, F# applications, and data-first systems where immutable state and effect boundaries shape the design.

Defer first-pass route choice and lane selection to `../../reference/routing-matrix.md`.

This is the general functional-language family pack for the repo. Use the overlay in `reference/elixir-phoenix-scala-clojure.md` to tune decisions for Phoenix, Scala, and Clojure-heavy stacks while keeping the shared expectations for immutability, runtime behavior, message flow, and application structure intact.

## Setup posture

- Prefer modernizing, refining, or extending an existing project in place.
- Treat scaffold, `create`, `init`, or `new` flows as greenfield-only and explicit-request-only. Defer to `.opencode/reference/project-setup-policy.md`.

## Core focus

- Model domain behavior with immutable data, explicit transformations, and clear effect boundaries.
- Keep process, actor, mailbox, queue, stream, or task-based concurrency visible instead of treating every runtime as ordinary threaded code.
- Separate pure or mostly pure domain logic from I/O, persistence, and framework edges.
- Keep schema, spec, or type-driven validation at the boundary where data enters or leaves the application.
- Structure services and applications around modules, OTP trees, pipelines, and stable domain composition rather than incidental mutation.

## Shared functional-platform standards

- Respect the runtime model of each family: OTP processes in Elixir and Erlang, JVM effect or actor runtimes in Scala, pure core plus effect shell in Haskell and F#, and data-first collection flows in Clojure.
- Keep state ownership explicit, whether it lives in an owned process, a stream topology, a persistent data structure, or a controlled effect boundary.
- Make blocking versus non-blocking behavior readable so runtime scheduling and throughput do not become guesswork.
- Use tests that exercise transformations, message flow, and boundary contracts rather than only happy-path controller or handler behavior.
- Keep framework and runtime conventions visible enough that contributors can trace where data is validated, transformed, and dispatched.

## Default workflow

1. Inspect the runtime, build tool, application structure, and current concurrency model.
2. Choose the functional-runtime overlay in `reference/elixir-phoenix-scala-clojure.md`.
3. Define data shapes, effect boundaries, concurrency ownership, and service structure before broad implementation.
4. Implement domain transformations, runtime wiring, and boundary tests together so the operational model stays coherent.
5. Run `review-work` after substantial functional-platform changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local namespace, module, and runtime conventions.
- Use `Librarian` or `Context7` when library APIs, runtime semantics, or framework behavior need a source-of-truth check.
- Use `review-work` when changes materially affect concurrency behavior, process trees, state ownership, or core data flow.

## Overlays

- `reference/elixir-phoenix-scala-clojure.md` for immutable modeling, process or message concurrency, and selected framework or runtime distinctions.

## Guardrails

- Do not port mutable object-oriented patterns directly into runtimes that want data-first or effect-aware structure.
- Do not hide process-tree, queueing, or scheduler behavior inside macros, decorators, or framework glue.
- Do not flatten Elixir, Scala, Haskell, Clojure, Erlang, and F# into one lowest-common-denominator style that ignores runtime strengths.
