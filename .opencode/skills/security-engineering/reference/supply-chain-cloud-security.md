# Supply chain and cloud security overlay for `security-engineering`

Use this overlay when security risk is shaped by dependency trust, artifact provenance, builder or deploy identity, container or registry handling, and cloud control-plane exposure.

## Reach for this overlay when

- third-party packages, actions, images, registries, or build dependencies are part of the trusted path,
- provenance, signing, attestations, SBOMs, or artifact-verification gates matter as much as application code review,
- cloud IAM, workload identity, storage exposure, or network egress boundaries materially affect the security story.

## Working rules

- Make the trust boundaries explicit across source, builder, signer, registry, deployer, and runtime so it is clear who can introduce, approve, promote, or execute an artifact.
- Keep dependency, build, and artifact provenance attached to immutable outputs: pin and review sources deliberately, record what was built, and use signatures, attestations, or SBOMs where the environment supports them.
- Separate builder identity, publish identity, deploy identity, and runtime identity so CI, registries, and workloads do not share broad long-lived credentials.
- Verify artifacts at the points that matter, not only at build time: promotion, deploy, and admission paths should check the expected signature, attestation, or trusted source before moving forward.
- Scope registry, package, artifact-store, and cloud permissions narrowly, and make artifact promotion traceable to reviewed outputs rather than mutable latest-state behavior.
- Treat cloud posture as part of the same supply-chain story: IAM boundaries, service-to-service identity, storage access, network controls, and audit trails should stay visible together.
- If the team needs an exception for an unsigned artifact, unpinned dependency, or broad temporary permission, record the owner, compensating controls, and expiry instead of letting the exception become the default posture.

## Watchouts

- Avoid trusting transitive dependencies, third-party actions, or base images without understanding source, update ownership, and verification expectations.
- Avoid broad cloud roles, shared admin credentials, or plaintext secrets in CI, build, or runtime environments.
- Avoid assuming vulnerability scans alone prove artifact integrity, builder trust, provenance, or cloud-hardening correctness.
