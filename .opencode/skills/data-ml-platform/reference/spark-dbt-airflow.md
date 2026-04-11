# Spark, dbt, and Airflow overlay for `data-ml-platform`

Use this overlay when the data or ML task spans heavy compute in Spark, warehouse transformation contracts in dbt, and scheduled orchestration boundaries in Airflow.

## Reach for this overlay when

- batch ingestion, large joins, feature preparation, or structured processing needs Spark-scale execution,
- dbt should own SQL-model transforms, tests, docs, sources, and freshness expectations,
- Airflow should coordinate DAG and task boundaries, retries, schedules, and cross-system handoffs instead of owning transform logic.

## Working rules

- Keep ownership boundaries explicit: Spark handles distributed compute and file or table production, dbt owns warehouse models and data tests, and Airflow owns dependency order, scheduling, retries, and external task coordination.
- Version DAGs, Spark jobs, dbt models, macros, source definitions, table contracts, partitions, and backfill windows so reruns and audits stay reproducible.
- Make decision knobs visible: partitioning and shuffle strategy, incremental versus full-refresh models, source freshness thresholds, DAG concurrency, retry windows, and idempotent backfill behavior.
- Gate releases with dbt tests, source freshness checks, schema or row-count regressions, and run-level observability that makes failed tasks, missed SLAs, and late upstream inputs obvious.

## Watchouts

- Avoid burying business transforms inside Airflow operators when they belong in Spark code or dbt models.
- Avoid mixing ad hoc backfills with scheduled DAGs unless partition rules, rerun boundaries, and downstream invalidation are explicit.
- Avoid treating a green DAG as success when dbt tests, freshness thresholds, or downstream table contracts are failing.
