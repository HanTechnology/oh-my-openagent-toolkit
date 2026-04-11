# Workspace Model

This document freezes the bundle-wide workspace execution model for `agentic-dev-ai-team`. It explains where work runs from, where new greenfield outputs should land by default, how existing projects are handled, what this convention does not claim to automate, and what the thinner routing docs should summarize without reinterpreting.

## Bundle-wide execution rules

1. The repo root remains the control/execution root.
2. Greenfield outputs default to `workspace/{project-name}-{domain}` inside the active repo/worktree.
3. Existing projects remain in place.
4. This is a documented bundle convention, not a native runtime feature.
5. Outputs should stay inside the active repo/worktree boundary by default.

## How to apply the convention

Use the current repo or worktree root as the place where the bundle is invoked, routed, and validated. That root is where commands run from, where reference docs are resolved, and where default output placement is anchored.

For new greenfield work started from the active repo or worktree, create the project under `workspace/{project-name}-{domain}` unless the user explicitly requests a different in-boundary location. The `workspace/` convention is the default landing zone for newly generated work, not a claim that the runtime or `.opencode/oh-my-openagent.jsonc` automatically routes files there.

For existing projects already present in the active repo or worktree, keep operating in their current directories. Existing projects remain in place and must not be relocated into `workspace/` just to satisfy this convention.

This rule is bundle-wide. It applies to the bundle's pack selection and helper-guided execution model broadly, not just to one command, one starter flow, or one harness helper. `AGENTS.md`, `route-domain.md`, and `routing-matrix.md` may restate the rule in compact form, but this document remains the detailed authority.

## Boundary and non-goals

The default expectation is that outputs stay inside the active repo/worktree boundary. This convention is about default placement and operator intent, not about pretending the runtime enforces filesystem routing automatically.

Do not describe OpenCode, the harness, or `.opencode/oh-my-openagent.jsonc` as if they natively implement this workspace placement rule. The rule is documentation-backed guidance for how this bundle should be used.
