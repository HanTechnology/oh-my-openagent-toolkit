# Extract flow

Use this flow when `impeccable` is invoked with `extract`.

## Flow

1. Find the real design system, shared UI surface, or token layer already in use.
2. Identify repeated patterns that are clearly reusable now, not hypothetically reusable later.
3. Extract stable components, tokens, or interaction patterns with names that match the local codebase.
4. Migrate the repeated usages to the shared version.
5. Delete the obsolete one-off implementations.
6. Re-run `audit` or `polish` if the extraction changed visual quality.

## Good extraction targets

- repeated components with the same intent,
- duplicated spacing, color, type, or elevation tokens,
- common empty, loading, or form-state patterns.

## Bad extraction targets

- one-off hero art direction,
- context-specific layouts with different intent,
- abstractions created only to avoid small, local duplication.
