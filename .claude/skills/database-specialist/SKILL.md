---
name: database-specialist
version: "1.0.0"
description: |
  Database architecture, optimization, and management specialist for relational and NoSQL systems.

  This skill is automatically invoked when:
  - User mentions: "database", "schema", "SQL", "PostgreSQL", "MongoDB", "migration", "query", "index"
  - Project requires: Schema design, query optimization, migrations, replication, performance tuning
  - Context involves: ORM configuration, N+1 prevention, connection pooling, data modeling

  Core expertise:
  - Schema design (normalization, denormalization decisions, ER modeling)
  - Query optimization (EXPLAIN ANALYZE, index strategies, query rewriting)
  - Migration management (zero-downtime migrations, rollback planning, versioning)
  - Performance tuning (slow query resolution, connection pooling, caching)
  - High availability (replication, failover, sharding strategies)
  - PostgreSQL advanced features (JSONB, full-text search, partitioning, CTEs)
  - ORM integration (TypeORM, Prisma, SQLAlchemy, SQLx, Diesel)

  Technology stack:
  - PostgreSQL 16+ (primary), MySQL/MariaDB, MongoDB, Redis
  - TypeORM (NestJS), Prisma, SQLAlchemy 2.x async (FastAPI)
  - SQLx (Rust compile-time checks), Diesel (Rust type-safe ORM)
  - pgAdmin, DBeaver (tools), Alembic (migrations)

  Related skills: backend-nestjs (TypeORM), backend-fastapi (SQLAlchemy), rust-systems (SQLx/Diesel), devops-deployment (provisioning), security-specialist (encryption)

category: domain

triggers:
  keywords:
    - "database"
    - "schema"
    - "migration"
    - "query optimization"
    - "index"
    - "SQL"
    - "PostgreSQL"
    - "MySQL"
    - "MongoDB"
    - "Redis"
    - "data model"
    - "ORM"
    - "TypeORM"
    - "Prisma"
    - "N+1"
    - "slow query"
    - "replication"
    - "sharding"
  file_patterns:
    - "**/migrations/**"
    - "**/entities/**/*.entity.ts"
    - "**/models/**/*.model.ts"
    - "**/schema.prisma"
    - "**/*.sql"
  project_types:
    - "web_application"
    - "api_microservice"
    - "data_processing"
  explicit_mention: false

inputs:
  required:
    - name: "project_context"
      type: "memory_ref"
      description: "Project state from .memory/"
  optional:
    - name: "existing_schema"
      type: "file"
      description: "Current database schema or migrations"

outputs:
  artifacts:
    - name: "schema_design"
      type: "file"
      path: "workspace/docs/database-schema.md"
    - name: "migrations"
      type: "directory"
      path: "workspace/backend/migrations/"
  memory_updates:
    - ".memory/domains/backend.md"
    - ".memory/core/decisions.md"

dependencies:
  skills:
    - skill: "backend-nestjs"
      relationship: "recommends"
      reason: "Database changes often require backend updates"
    - skill: "backend-fastapi"
      relationship: "recommends"
      reason: "Database changes often require backend updates"
    - skill: "rust-systems"
      relationship: "recommends"
      reason: "SQLx compile-time query verification, Diesel type-safe ORM"
  workflows: []
  memory_files:
    - ".memory/core/project.json"

risk_level: high
execution_mode: supervised
parallel_safe: false
idempotent: false

allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Database Specialist

**Purpose**: Expert-level database architecture, optimization, and management across multiple database technologies.

## Output Directory

**CRITICAL**: All database artifacts MUST be placed in `workspace/` directory structure.

- Schema documentation → `workspace/docs/database-schema.md`
- Migrations → `workspace/backend/migrations/`
- SQL scripts → `workspace/backend/sql/`
- ER diagrams → `workspace/docs/diagrams/`

**Database Output Structure**:
```
workspace/
├── docs/
│   ├── database-schema.md         # Schema documentation
│   └── diagrams/
│       └── er-diagram.md          # Entity-relationship diagrams
├── backend/
│   ├── migrations/                # Database migrations
│   │   ├── 001_initial.sql
│   │   └── 002_add_users.sql
│   ├── sql/                       # SQL scripts
│   │   ├── seed.sql
│   │   └── views/
│   └── src/
│       ├── entities/              # ORM entities (TypeORM/Prisma)
│       └── repositories/          # Repository pattern
└── prisma/                        # Prisma schema (if using Prisma)
    └── schema.prisma
```

## Core Competencies

### 1. Schema Design
- Normalized vs denormalized design decisions
- Entity relationship modeling
- Data type optimization
- Constraint design (PK, FK, UNIQUE, CHECK)
- Indexing strategy

### 2. Query Optimization
- Query plan analysis (EXPLAIN ANALYZE)
- Index optimization
- N+1 query detection and resolution
- Query rewriting for performance
- Connection pooling configuration

### 3. Migration Management
- Zero-downtime migration strategies
- Rollback planning
- Data transformation scripts
- Schema versioning

### 4. Performance Tuning
- Slow query identification and resolution
- Index analysis and recommendations
- Memory and cache configuration
- Query caching strategies

### 5. High Availability
- Replication setup (primary-replica)
- Failover configuration
- Backup and recovery strategies
- Sharding design

## Supported Technologies

### Relational Databases
- **PostgreSQL** (Primary): Full support including:
  - Advanced data types (JSONB, Array, UUID)
  - Full-text search
  - Partitioning
  - CTEs and window functions
  - PL/pgSQL stored procedures
  
- **MySQL/MariaDB**: Full support including:
  - InnoDB optimization
  - Replication configuration
  - Query cache tuning

### NoSQL Databases
- **MongoDB**: Document modeling, aggregation pipelines, indexes
- **Redis**: Caching patterns, pub/sub, data structures

### ORMs
- **TypeORM** (NestJS): Entities, migrations, query builder
- **Prisma**: Schema definition, migrations, client generation
- **SQLAlchemy** (FastAPI): Models, alembic migrations
- **SQLx** (Rust): Compile-time verified async SQL, migrations
- **Diesel** (Rust): Type-safe ORM with schema inference

### Spatial Data & Graph Storage

For Computer Vision and spatial analysis projects requiring geometric data storage:

#### PostgreSQL + PostGIS
- **Spatial Types**: POINT, LINESTRING, POLYGON, MULTIPOLYGON
- **Spatial Indexes**: GiST indexes for geometric queries
- **Spatial Functions**: ST_Contains, ST_Intersects, ST_Distance, ST_Area
- **Use Cases**: Room boundaries, wall segments, floor plan geometry

```sql
-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Spatial table for room boundaries
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES floor_plans(id),
  label VARCHAR(100),
  boundary GEOMETRY(POLYGON, 4326),
  area_sqm DECIMAL(10,2) GENERATED ALWAYS AS (ST_Area(boundary::geography)) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for efficient queries
CREATE INDEX idx_rooms_boundary ON rooms USING GIST(boundary);

-- Find rooms containing a point
SELECT * FROM rooms WHERE ST_Contains(boundary, ST_Point(-73.9857, 40.7484));
```

#### JSONB for Graph Storage
- **Graph Representation**: Adjacency lists, node attributes
- **Flexible Schema**: Dynamic properties per node/edge
- **Indexing**: GIN indexes for JSON queries

```sql
-- Spatial graph storage
CREATE TABLE spatial_graphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  floor_plan_id UUID REFERENCES floor_plans(id),
  graph_data JSONB NOT NULL,
  -- Example structure:
  -- {
  --   "nodes": [{"id": "room_1", "type": "room", "label": "Living Room", "centroid": [x, y]}],
  --   "edges": [{"source": "room_1", "target": "room_2", "type": "door", "properties": {...}}]
  -- }
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- GIN index for efficient JSON queries
CREATE INDEX idx_spatial_graphs_data ON spatial_graphs USING GIN(graph_data);

-- Query rooms by type
SELECT * FROM spatial_graphs 
WHERE graph_data @> '{"nodes": [{"type": "room"}]}';
```

#### CV Analysis Results Storage
```sql
-- Detection results storage
CREATE TABLE detection_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_id UUID REFERENCES images(id),
  element_type VARCHAR(50), -- 'wall', 'door', 'window', 'room'
  bounding_box BOX,
  polygon GEOMETRY(POLYGON),
  confidence DECIMAL(4,3),
  properties JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for element type queries
CREATE INDEX idx_detection_element_type ON detection_results(element_type);
CREATE INDEX idx_detection_confidence ON detection_results(confidence);
```

## Deep Thinking Protocol

**STRONGLY RECOMMENDED** for database decisions due to:
1. **Long-term Impact**: Schema changes are costly to reverse
2. **Performance Critical**: Bad design causes scaling issues
3. **Data Integrity**: Wrong constraints cause data corruption

### When to Apply Deep Thinking

| Scenario | Complexity | Deep Thinking |
|----------|------------|---------------|
| New table design | Medium | Yes |
| Index addition | Low | Optional |
| Schema migration (data) | High | **Required** |
| Query optimization | Medium | Yes |
| Replication setup | High | **Required** |
| Sharding design | Very High | **Mandatory** |

### Evaluation Dimensions

- **Data Integrity** (30%): Constraints, normalization, consistency
- **Performance** (25%): Query speed, index efficiency, scalability
- **Maintainability** (20%): Schema clarity, migration complexity
- **Flexibility** (15%): Future change accommodation
- **Operational** (10%): Backup, monitoring, debugging ease

## Standard Procedures

### Schema Design Procedure

```markdown
1. **Requirement Analysis**
   - Identify entities and relationships
   - Determine access patterns (read/write ratio)
   - Estimate data volume and growth

2. **Initial Design**
   - Create ER diagram
   - Define tables and columns
   - Establish relationships (1:1, 1:N, M:N)

3. **Normalization Decision**
   - Apply 3NF as baseline
   - Denormalize strategically for read performance
   - Document denormalization decisions

4. **Indexing Strategy**
   - Primary keys (default)
   - Foreign keys (for joins)
   - Query-driven indexes (WHERE, ORDER BY)
   - Composite indexes (multi-column queries)

5. **Constraint Implementation**
   - NOT NULL for required fields
   - UNIQUE for business keys
   - CHECK for data validation
   - DEFAULT for sensible defaults

6. **Documentation**
   - Update .memory/domains/backend.md
   - Add decision rationale to .memory/core/decisions.md
```

### Query Optimization Procedure

```markdown
1. **Identify Slow Queries**
   - Enable slow query logging
   - Use APM tools (if available)
   - Review application logs

2. **Analyze Query Plan**
   ```sql
   EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
   SELECT ... FROM ... WHERE ...;
   ```

3. **Identify Issues**
   - Sequential scans on large tables
   - Missing indexes
   - Inefficient joins
   - N+1 patterns

4. **Apply Optimizations**
   - Add appropriate indexes
   - Rewrite query (subquery → JOIN, etc.)
   - Use pagination for large result sets
   - Implement caching layer

5. **Verify Improvement**
   - Re-run EXPLAIN ANALYZE
   - Measure execution time
   - Test under load
```

### Migration Procedure

```markdown
1. **Plan Migration**
   - Document current state
   - Define target state
   - Identify data transformations
   - Plan rollback strategy

2. **Create Migration Files**
   - Up migration (forward)
   - Down migration (rollback)
   - Data transformation scripts

3. **Test Migration**
   - Test on development database
   - Test with production data copy
   - Verify rollback works

4. **Execute Migration**
   - Backup current database
   - Run migration in maintenance window (if needed)
   - Monitor for errors
   - Verify data integrity

5. **Document Results**
   - Update schema documentation
   - Log in .memory/core/journal.md
```

## Common Patterns

### Entity Design (TypeORM)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'jsonb', nullable: true })
  profile: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Index('idx_users_email')
  @Column()
  email: string;

  // Relationships
  @OneToMany(() => Post, post => post.author)
  posts: Post[];
}
```

### Index Strategies

```sql
-- Single column index (equality queries)
CREATE INDEX idx_users_email ON users(email);

-- Composite index (multi-column queries)
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Partial index (filtered queries)
CREATE INDEX idx_orders_pending ON orders(created_at) 
WHERE status = 'pending';

-- Covering index (index-only scans)
CREATE INDEX idx_products_search ON products(name, price, category_id);
```

### N+1 Query Resolution

```typescript
// BAD: N+1 queries
const users = await userRepository.find();
for (const user of users) {
  const posts = await postRepository.find({ where: { userId: user.id } });
}

// GOOD: Eager loading
const users = await userRepository.find({
  relations: ['posts']
});

// GOOD: Query builder with join
const users = await userRepository
  .createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'post')
  .getMany();
```

## Quality Standards

### Schema Quality

| Metric | Target | Critical |
|--------|--------|----------|
| Normalization | 3NF minimum | Yes |
| Index coverage | >90% queries | Yes |
| Constraint coverage | 100% PKs, 100% FKs | Yes |
| Documentation | 100% tables | No |

### Query Performance

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| p95 latency | <100ms | 100-500ms | >500ms |
| Index hit rate | >99% | 95-99% | <95% |
| Lock wait time | <10ms | 10-100ms | >100ms |

### Migration Safety

| Check | Required |
|-------|----------|
| Rollback tested | Yes |
| Backup created | Yes |
| Zero data loss | Yes |
| Downtime estimate | Required |

## Coordination with Other Skills

### With backend-nestjs / backend-fastapi
- Schema changes require entity updates
- Migration timing coordination
- Query optimization in service layer

### With devops-deployment
- Database provisioning
- Backup configuration
- Monitoring setup

### With quality-controller
- Query performance testing
- Data integrity validation

### With rust-systems
- **SQLx**: Compile-time verified SQL queries with full PostgreSQL/MySQL/SQLite support
- **Diesel**: Type-safe ORM with schema inference and migration system
- **Connection Pooling**: deadpool-postgres, bb8 for async connection management
- **Migrations**: sqlx-cli, diesel_cli for database migrations

**SQLx Compile-Time Query Verification**:
```rust
use sqlx::{PgPool, FromRow};

#[derive(Debug, FromRow)]
struct User {
    id: i64,
    email: String,
    name: Option<String>,
    created_at: chrono::DateTime<chrono::Utc>,
}

// Compile-time verified - won't compile if SQL is invalid or types mismatch
pub async fn get_user_by_email(pool: &PgPool, email: &str) -> Result<Option<User>, sqlx::Error> {
    sqlx::query_as!(
        User,
        r#"
        SELECT id, email, name, created_at
        FROM users
        WHERE email = $1
        "#,
        email
    )
    .fetch_optional(pool)
    .await
}

// Runtime query with type safety
pub async fn search_users(pool: &PgPool, query: &str) -> Result<Vec<User>, sqlx::Error> {
    sqlx::query_as::<_, User>(
        "SELECT id, email, name, created_at FROM users WHERE name ILIKE $1"
    )
    .bind(format!("%{}%", query))
    .fetch_all(pool)
    .await
}
```

**Diesel Type-Safe ORM**:
```rust
use diesel::prelude::*;

// Schema generated from database
table! {
    users (id) {
        id -> Int8,
        email -> Varchar,
        name -> Nullable<Varchar>,
        created_at -> Timestamptz,
    }
}

#[derive(Queryable, Selectable)]
#[diesel(table_name = users)]
struct User {
    id: i64,
    email: String,
    name: Option<String>,
    created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Insertable)]
#[diesel(table_name = users)]
struct NewUser<'a> {
    email: &'a str,
    name: Option<&'a str>,
}

pub fn create_user(conn: &mut PgConnection, email: &str, name: Option<&str>) -> QueryResult<User> {
    diesel::insert_into(users::table)
        .values(&NewUser { email, name })
        .returning(User::as_returning())
        .get_result(conn)
}
```

**Connection Pooling for High Performance**:
```rust
use deadpool_postgres::{Config, Pool, Runtime};
use tokio_postgres::NoTls;

pub async fn create_pool() -> Result<Pool, deadpool_postgres::CreatePoolError> {
    let mut cfg = Config::new();
    cfg.host = Some("localhost".to_string());
    cfg.port = Some(5432);
    cfg.dbname = Some("app".to_string());
    cfg.user = Some("user".to_string());
    cfg.password = Some("password".to_string());
    
    cfg.pool = Some(deadpool_postgres::PoolConfig {
        max_size: 16,
        timeouts: deadpool_postgres::Timeouts::wait_millis(5000),
        ..Default::default()
    });
    
    cfg.create_pool(Some(Runtime::Tokio1), NoTls)
}
```

**When to Collaborate with rust-systems**:
- High-performance database access requirements
- Compile-time SQL query verification needs
- Type-safe schema migrations
- Connection pooling for async Rust backends
- Complex query building with Diesel QueryDSL

## Memory Updates

After database work, update:

1. **`.memory/domains/backend.md`** - Schema section
2. **`.memory/core/decisions.md`** - Design decisions
3. **`.memory/core/journal.md`** - Actions taken

## Output Guidelines

- Document schema changes with diagrams (text-based)
- Include EXPLAIN ANALYZE output for optimizations
- Provide before/after metrics for performance work
- Always include rollback instructions for migrations

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - SQL naming (snake_case tables, columns)
- [Error Handling](../ENTERPRISE-STANDARDS.md#error-handling) - DB errors, constraint violation handling
- [Testing Standards](../ENTERPRISE-STANDARDS.md#testing-standards) - migration testing, rollback verification
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - query logging, slow query logging
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - migration commit conventions
- [Security Standards](../ENTERPRISE-STANDARDS.md#security-standards) - parameterized queries, encryption

**Domain-Specific Standards** (see Quality Standards section in this document):
- 3NF normalization baseline
- Index coverage 90%+
- Query p95 latency < 100ms
- Zero-downtime migration strategy
