---
name: database-engineering
description: Deliver language-agnostic database design, migration, performance, and reliability guidance across relational, document, and in-memory data systems.
---

# Database Engineering

Use this pack for database work: schema design, data modeling, migrations, query and index tuning, replication planning, backup and restore strategy, and operational reliability across major datastore families.

This is the general database pack for the repo. Use the overlay in `reference/postgres-mysql-mongodb-redis.md` to sharpen engine-specific choices while keeping schema, migration, query-planning, durability, and recovery expectations explicit.

## Core focus

- Design schemas and data models around business invariants, access patterns, and change frequency.
- Treat migrations as production changes: forward compatibility, rollback, and zero-downtime sequencing belong in the design.
- Tune query shape and index strategy with planner evidence instead of intuition alone.
- Make transaction boundaries, consistency needs, caching assumptions, and retention rules visible.
- Plan for replication, high availability, backup, restore, and recovery objectives before the system is under stress.

## Shared database standards

- Choose relational, document, and in-memory stores based on data shape and consistency needs, not habit or framework defaults.
- Keep primary keys, foreign keys, uniqueness, constraints, and data ownership readable in the schema.
- Use representative data, `EXPLAIN`, query plans, and slow-query evidence before claiming a performance win.
- Stage migrations so application code and data changes can coexist during rollout, rollback, and backfill windows.
- Rehearse restore paths and failure scenarios; backups without restore confidence are not enough.

## Default workflow

1. Inspect the current schema, query paths, write patterns, retention rules, and operational constraints.
2. Choose the engine overlay in `reference/postgres-mysql-mongodb-redis.md` when engine-specific tradeoffs matter.
3. Define the schema, migration sequence, rollback shape, and consistency model before broad implementation.
4. Implement schema changes, indexes, query updates, and backup or recovery implications together so operational risk stays visible.
5. Run `review-work` after substantial database changes.

## Collaboration in this repo

- Use `Explore` before editing so new work matches local schema, migration, and query patterns.
- Use `Librarian` or `Context7` when engine behavior, planner rules, or driver capabilities need a source-of-truth check.
- Pair with `architecture-integration` when service boundaries, event contracts, or ownership across systems dominate the task.
- Pair with `security-engineering` when encryption, access control, or sensitive-data handling changes the storage design.
- Pair with `devops-platform` when replication, backup, restore, or failover concerns extend into runtime operations.

## Overlays

- `reference/postgres-mysql-mongodb-redis.md` for engine choice boundaries, indexing and query planning, transactions and consistency, and replication or durability tradeoffs.

## Guardrails

- Do not reduce this pack to ORM-only or web-stack-only guidance.
- Do not ship destructive migrations without compatibility, rollback, and data-recovery thinking.
- Do not assume replicas, backups, or caches are safe defaults without testing their failure behavior.
