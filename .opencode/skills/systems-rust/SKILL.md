---
name: systems-rust
description: Deliver Rust systems work across services, CLIs, WASM, and FFI while keeping ownership, async runtime, safety, and performance constraints explicit.
---

# Systems Rust

Use this pack for Rust systems work: performance-sensitive services, async runtimes, command-line tools, WebAssembly modules, native extensions, and cross-language boundaries where memory safety and throughput both matter.

This is the general Rust family pack for the repo. Use the overlay in `reference/axum-actix-wasm.md` to tune decisions for Axum, Actix, and browser-facing WASM delivery while keeping the same expectations for ownership, observability, interop, and runtime clarity.

## Core focus

- Design ownership, borrowing, lifetimes, and crate boundaries so the data flow stays readable under change.
- Keep async runtime choices, task cancellation, channels, and backpressure explicit instead of hiding them behind helper layers.
- Treat WASM and FFI boundaries as contracts with typed inputs, serialization choices, and memory ownership rules.
- Optimize for high performance with zero-copy paths, predictable memory layout, profiling, and measured concurrency decisions.
- Keep error handling, tracing, testing, and release builds aligned with safe operational delivery.

## Shared Rust systems standards

- Keep unsafe blocks, FFI shims, and boundary conversions narrow, visible, and easy to audit.
- Separate transport, runtime, and platform glue from reusable domain or library code.
- Use `wasm-bindgen`, PyO3, `cbindgen`, `uniffi`, or similar boundary tooling deliberately, keeping ownership and type conversion explicit.
- Make target-specific code, feature flags, and cross-compilation assumptions visible in workspace or crate boundaries.
- Use benchmarks, tracing, and representative load tests before claiming a performance win.

## Default workflow

1. Inspect the workspace layout, crate graph, toolchain pinning, target platforms, and runtime model.
2. Choose the Rust-specific overlay in `reference/axum-actix-wasm.md`.
3. Define ownership, async behavior, boundary contracts, and target assumptions before broad implementation.
4. Implement crates, boundary code, tests, and benchmarks together so safety and performance stay aligned.
5. Run `review-work` after substantial Rust systems changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local crate, module, and target-platform patterns.
- Use `Librarian` or `Context7` when framework APIs, interop details, or platform constraints need a source-of-truth check.
- Use `review-work` when Rust, WASM, or FFI changes materially affect safety, throughput, or integration behavior.

## Overlays

- `reference/axum-actix-wasm.md` for extractor and middleware choices in Rust HTTP services plus WASM boundary guidance for browser-facing performance work.

## Guardrails

- Do not hide ownership transfers or allocation-heavy boundary conversions inside convenience helpers.
- Do not mix runtimes, blocking calls, and async assumptions casually across the same request or worker path.
- Do not cross WASM or FFI boundaries with unstable layouts, implicit copies, or poorly defined error contracts.
