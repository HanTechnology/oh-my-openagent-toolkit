---
name: database-specialist
version: "1.0.0"
description: "Database architecture, optimization, and management specialist. Use when: designing database schemas, optimizing queries, planning migrations, configuring replication, troubleshooting performance issues, or implementing data access patterns."
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
