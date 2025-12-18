# Activity Journal

> Append-only log of project activities for session continuity.
> Records significant actions, outputs, and context for seamless session restoration.

---

## Session Format

```markdown
## Session: YYYY-MM-DDTHH:MM:SSZ

### HH:MM - Action Title
- **Skill**: skill-name
- **Action**: What was done
- **Output**: What was produced (files, decisions, etc.)
- **Notes**: Any relevant context
```

---

## Sessions

<!-- New sessions are appended at the top -->

## Session: {{SESSION_TIMESTAMP}}

### {{TIME}} - Session Start
- **Skill**: memory-manager
- **Action**: Session initialized
- **Context**: {{INITIAL_CONTEXT}}

<!-- Append session activities here -->
