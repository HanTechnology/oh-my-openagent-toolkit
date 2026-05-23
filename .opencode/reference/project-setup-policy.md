# Project Setup Policy

This reference keeps setup behavior narrow for `oh-my-openagent-toolkit`: prefer refining an existing project in place before proposing greenfield creation.

## Default behavior

1. Start with the existing project when one is already present.
2. Prefer updating, modernizing, or extending that project in place.
3. Treat direct `create` / `init` / `new` flows as greenfield-only behavior. This means app or framework scaffolders, not a documented project-refinement installer.
4. Treat `omo-toolkit init` as a refinement flow for an existing target project. It adds or updates the project-local `.opencode/` bundle and the managed `AGENTS.md` block in place.
5. Do not describe `omo-toolkit init` as a greenfield app scaffold.
6. Use greenfield flows only when a new project is explicitly requested.

## Boundary

This file defines setup preference only. For workspace placement, repo/worktree boundaries, and where greenfield outputs belong, defer to `.opencode/reference/workspace-model.md`.
