# Analytics and search stores overlay for `database-engineering`

Use this overlay when the database design is shaped by analytical query patterns, warehousing, search indexing, faceting, or freshness tradeoffs outside the primary transactional path.

## Reach for this overlay when

- reporting, OLAP, warehouse-style modeling, or search read patterns dominate the workload,
- the system copies or reshapes data from a transactional source into an analytical or search surface,
- index contracts, schema evolution, lifecycle rules, reindexing, or recovery behavior matter more than CRUD paths.

## Working rules

- Keep the transactional source of truth separate from analytical and search-serving stores, and make sync, freshness, delete semantics, and replay boundaries explicit.
- Define the index or mapping contract on purpose: field names, types, analyzers, partition keys, sort fields, and materialized dimensions should match the real query surface instead of evolving implicitly.
- Plan schema evolution and reindex paths before rollout. Alias swaps, dual-write windows, backfills, and compatibility periods should be visible whenever the shape changes.
- Set lifecycle policy deliberately for partitions, retention, rollover, compaction, tiering, TTL, or snapshots so storage cost and delete behavior do not drift by accident.
- Guard the hot path: keep user-facing writes and queries insulated from heavyweight aggregation, indexing, or rebuild work through batching, async pipelines, and clear freshness expectations.
- Define recovery posture alongside the ingest path: replay sources, snapshot or restore points, rebuild time, and acceptable staleness should be known before the surface becomes critical.
- Monitor query latency, indexing lag, freshness drift, storage growth, and rebuild cost so analytical or search surfaces fail visibly instead of silently decaying.

## Watchouts

- Avoid treating a warehouse, search index, or cache-adjacent store as the silent primary write system.
- Avoid mapping or schema changes that ship without a clear reindex, delete-propagation, and rollback story.
- Avoid analytics or search tuning claims that are not grounded in representative query, cost, and recovery evidence.
