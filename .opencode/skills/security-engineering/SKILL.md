---
name: security-engineering
description: Deliver application and platform security guidance for auth, authz, secure coding, secrets, vulnerability review, and compliance-adjacent hardening without tying decisions to one stack.
---

# Security Engineering

Use this pack for security-sensitive work: authentication, authorization, secure coding, secrets and key handling, vulnerability analysis, security review, and hardening across application and service boundaries.

This is the general security pack for the repo. Use the overlays in `reference/auth-owasp-secrets.md` and `reference/supply-chain-cloud-security.md` to sharpen authentication, OWASP-style review, secrets, provenance, builder identity, artifact verification, trust-boundary rules, and cloud-security choices while keeping the core guidance language-agnostic and portable.

## Core focus

- Design auth and authz paths that make identity, session or token handling, and access policy checks explicit.
- Apply OWASP-style hardening across input validation, output encoding, transport security, and common abuse paths.
- Keep secure coding expectations visible around dependency trust, unsafe deserialization, injection risk, and boundary validation.
- Treat secrets and keys as managed assets with controlled creation, storage, rotation, revocation, and auditability.
- Assess vulnerabilities by exploitability, blast radius, and remediation priority instead of treating every finding as identical.
- Carry compliance-adjacent awareness where regulated data, privacy, retention, or audit requirements influence the design.

## Shared security standards

- Separate authentication from authorization; proving identity is not the same as granting access.
- Deny by default, scope permissions narrowly, and make ownership or policy checks visible in the request or job path.
- Use strong password hashing, short-lived credentials where possible, generic auth errors, rate limiting, and re-authentication for sensitive actions.
- Keep TLS, security headers, input validation, output handling, and logging hygiene aligned so secrets and user data do not leak through normal operations.
- Rotate secrets and keys deliberately, prefer centrally managed secret stores, and avoid long-lived plaintext credentials in code, images, or local tooling.
- Record security findings with severity, exposure surface, and remediation path so review output leads to action.

## Default workflow

1. Inspect trust boundaries, identity flows, sensitive data paths, and the current attack surface.
2. Choose the relevant security overlay or overlay set: `reference/auth-owasp-secrets.md` for authentication, OWASP, and secrets work, or `reference/supply-chain-cloud-security.md` for dependency trust, provenance, builder or deploy identity, artifact verification, exception policy, and cloud-control exposure.
3. Define the auth model, authz rules, secret handling, and verification approach before broad implementation.
4. Implement controls, validation, logging hygiene, and remediation together so the defense story stays coherent.
5. Run `review-work` after substantial security-sensitive changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local auth, middleware, and config patterns.
- Use `Librarian` or `Context7` when protocol details, library behavior, or hardening guidance need a source-of-truth check.
- Pair with `database-engineering` when encryption at rest, retention, or sensitive-data storage changes database design.
- Pair with `devops-platform` when runtime secret handling, TLS posture, service identity, or network controls are part of the fix.
- Pair with `qa-validation` when the work needs browser, abuse-case, or evidence-driven validation.

## Overlays

- `reference/auth-owasp-secrets.md` for authentication fundamentals, session and re-authentication rules, MFA and TLS posture, secrets lifecycle, and leak-prevention guidance.
- `reference/supply-chain-cloud-security.md` for dependency and artifact trust, provenance, builder and deploy identity, artifact-verification gates, registry posture, exception handling, and cloud-control hardening concerns.

## Guardrails

- Do not tie this pack to a JWT-only, browser-only, or single-framework security model.
- Do not keep secrets, keys, or recovery tokens in source control, container images, or verbose logs.
- Do not treat compliance labels as a substitute for concrete controls, tests, and remediation work.
