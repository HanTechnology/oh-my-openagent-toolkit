# Local dev environments overlay for `developer-experience`

Use this overlay when contributor setup is shaped by environment bootstrapping, local services, data seeds, containerized development, cross-platform toolchains, or parity with shared non-production systems.

## Scope

- onboarding depends on prerequisite versions, system packages, or shell and runtime setup,
- local services such as databases, queues, or auth providers must be started or seeded predictably,
- dev containers, Docker Compose, or remote development environments are part of the inner loop.

## Required concepts

- Keep prerequisites explicit and versioned: language runtimes, package managers, CLIs, system libraries, and editor hooks should be easy to discover before the first install.
- Separate checked-in environment examples from local secrets, and document which variables are required, optional, generated, or environment-specific.
- Prefer reproducible bootstrap and reset flows for local services, seed data, and caches so contributors can recover from drift without manual database surgery.
- Model parity deliberately: local environments should preserve contract boundaries, dependencies, and failure modes that matter, without pretending every repo needs a full production clone on a laptop.

## Watchouts

- Avoid hidden OS-specific setup, undocumented shell assumptions, or local-only credentials that make onboarding depend on oral tradition.
- Avoid snowflake seed data, long-lived dirty volumes, or ad hoc service startup steps that nobody can reset safely.
- Avoid forcing contributors into heavyweight container or remote setups when the same contract can be expressed with a lighter local path.

## First-party anchors

- Pair this overlay with `../SKILL.md` to keep contributor-facing setup and feedback expectations tied to the inner loop rather than drifting into ops ownership.
- Pair this overlay with `devops-platform` when local development depends on containerized services, shared infra emulators, or environment-parity decisions.
