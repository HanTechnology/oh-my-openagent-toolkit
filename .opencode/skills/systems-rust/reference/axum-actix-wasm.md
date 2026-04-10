# Axum, Actix, and WASM overlay for `systems-rust`

Use this overlay when the Rust task is shaped by Axum or Actix service delivery, middleware composition, extractor design, or a browser-facing WASM boundary.

## Reach for this overlay when

- the codebase already uses Axum, Actix, or a tower-style middleware stack,
- request extractors, shared state, auth middleware, or error mapping drive the service shape,
- computation may move across a native-to-browser WASM boundary for responsiveness or throughput.

## Working rules

- Keep extractors, request models, and shared state wiring explicit so handlers stay readable and testable.
- Make middleware order visible for auth, tracing, compression, rate limits, and error translation.
- Treat Axum state injection and Actix app data as transport concerns, not the domain model.
- Isolate WASM-friendly crates from server-only crates, and make serialization or copy costs visible at the boundary.
- Keep `wasm-bindgen` exports, browser APIs, and fallback JavaScript glue narrow enough that performance tradeoffs are easy to measure.

## Watchouts

- Avoid mixing Actix patterns into Axum code or tower middleware assumptions into Actix code without an explicit adapter boundary.
- Avoid passing borrow-heavy or allocation-sensitive Rust internals directly across WASM or FFI surfaces.
- Avoid claiming a WASM performance win before measuring transfer costs, startup time, and main-thread behavior.
