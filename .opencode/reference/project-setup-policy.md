# Project Setup Policy

This reference keeps setup behavior narrow for `oh-my-openagent-toolkit`: prefer refining an existing project in place before proposing greenfield creation.

## Default behavior

1. Start with the existing project when one is already present.
2. Prefer updating, modernizing, or extending that project in place.
3. Treat direct `create` / `init` / `new` flows as greenfield-only behavior.
4. Use those greenfield flows only when a new project is explicitly requested.

## Boundary

This file defines setup preference only. For workspace placement, repo/worktree boundaries, and where greenfield outputs belong, defer to `.opencode/reference/workspace-model.md`.
