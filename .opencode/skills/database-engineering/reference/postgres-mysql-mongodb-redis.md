# PostgreSQL, MySQL, MongoDB, and Redis overlay for `database-engineering`

Use this overlay when the database task depends on engine choice, planner behavior, transaction guarantees, replication, or durability tradeoffs across relational, document, and in-memory systems.

## Reach for this overlay when

- the stack already uses PostgreSQL, MySQL, MongoDB, or Redis,
- the team is comparing a primary datastore against a document store or cache layer,
- indexing, query planning, consistency, or durability details drive the design.

## Working rules

- Choose PostgreSQL when relational integrity, rich SQL, strong transactional behavior, complex querying, or extensibility matter most.
- Choose MySQL when a transactional relational engine is still the right fit and operational familiarity, InnoDB behavior, or replication conventions shape the environment.
- Choose MongoDB when document boundaries match the domain well, schema flexibility is intentional, and embedding versus referencing is an explicit modeling decision.
- Choose Redis for low-latency cache, ephemeral state, coordination primitives, queues, or rate-limit data; do not treat it as a drop-in replacement for a primary transactional database.
- Plan indexes around the real read and write paths. Use `EXPLAIN` and planner output for PostgreSQL and MySQL, verify aggregation and index coverage in MongoDB, and design Redis keys, TTLs, and eviction behavior on purpose.
- Keep transaction and consistency expectations explicit: PostgreSQL and MySQL are primary transactional engines, MongoDB supports transactions but still benefits from document-local design, and Redis atomic operations are narrower than general relational guarantees.
- Make replication and durability part of the design: PostgreSQL replication and restore strategy, MySQL replication and binlog assumptions, MongoDB replica sets and write concerns, Redis persistence and replica or failover tradeoffs.
- Account for operational cost: indexes slow writes and consume storage, document flexibility can shift complexity into application code, and Redis memory pressure plus eviction can change correctness if the cache boundary is unclear.

## Watchouts

- Avoid choosing MongoDB or Redis only to postpone schema design.
- Avoid planner-blind query tuning or index growth without measuring write overhead and storage cost.
- Avoid treating Redis persistence, replication, or Lua-based atomicity as equivalent to relational durability and transaction semantics.
