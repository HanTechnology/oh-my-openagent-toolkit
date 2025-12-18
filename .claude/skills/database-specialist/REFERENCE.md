# Database Specialist - Technical Reference

## Supported Databases

### Relational Databases
- **PostgreSQL**: Primary recommendation (15+)
- **MySQL/MariaDB**: Alternative relational option (8.0+)

### NoSQL Databases
- **MongoDB**: Document store (6.0+)
- **Redis**: Cache and session store (7.0+)

### ORM/Query Builders
- **TypeORM**: NestJS integration
- **Prisma**: Type-safe ORM
- **SQLAlchemy**: Python async ORM
- **Knex.js**: Query builder

---

## Schema Design Principles

### Normalization (3NF Minimum)

```sql
-- Example: E-commerce Schema (3NF)

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    category_id UUID REFERENCES categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (normalized)
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL,
    shipping_address_id UUID REFERENCES addresses(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items (join table with additional data)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    UNIQUE(order_id, product_id)
);
```

### Indexing Strategy

```sql
-- Primary indexes (automatic with PRIMARY KEY)
-- Foreign key indexes (required for JOIN performance)
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_products_category_id ON products(category_id);

-- Search indexes
CREATE INDEX idx_products_name_gin ON products USING gin(to_tsvector('english', name));
CREATE INDEX idx_users_email ON users(email);

-- Composite indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_products_category_price ON products(category_id, price);

-- Partial indexes for specific conditions
CREATE INDEX idx_orders_pending ON orders(created_at) 
    WHERE status = 'pending';
```

---

## TypeORM Entity Patterns

### Base Entity

```typescript
// base.entity.ts
import { 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  BaseEntity 
} from 'typeorm';

export abstract class TimestampedEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
```

### Entity with Relations

```typescript
// user.entity.ts
import { Entity, Column, OneToMany, Index } from 'typeorm';
import { TimestampedEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('users')
export class User extends TimestampedEntity {
  @Column({ unique: true })
  @Index()
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}

// order.entity.ts
import { Entity, Column, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { TimestampedEntity } from './base.entity';
import { User } from './user.entity';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

@Entity('orders')
@Index(['userId', 'status'])
export class Order extends TimestampedEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
```

---

## Query Optimization

### N+1 Query Prevention

```typescript
// BAD: N+1 queries
const orders = await orderRepository.find();
for (const order of orders) {
  const items = await orderItemRepository.find({ where: { orderId: order.id } });
}

// GOOD: Eager loading with relations
const orders = await orderRepository.find({
  relations: ['items', 'items.product', 'user'],
});

// GOOD: Query builder with joins
const orders = await orderRepository
  .createQueryBuilder('order')
  .leftJoinAndSelect('order.items', 'item')
  .leftJoinAndSelect('item.product', 'product')
  .leftJoinAndSelect('order.user', 'user')
  .where('order.userId = :userId', { userId })
  .orderBy('order.createdAt', 'DESC')
  .getMany();
```

### Query Analysis

```sql
-- Analyze query performance
EXPLAIN ANALYZE
SELECT o.*, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'pending'
ORDER BY o.created_at DESC
LIMIT 10;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## Migration Patterns

### TypeORM Migration

```typescript
// migrations/1705312800000-CreateUsersTable.ts
import { MigrationInterface, QueryRunner, Table, Index } from 'typeorm';

export class CreateUsersTable1705312800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            default: 'NOW()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'users',
      new Index({ name: 'idx_users_email', columnNames: ['email'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```

### Zero-Downtime Migration

```sql
-- Step 1: Add new column (nullable)
ALTER TABLE users ADD COLUMN new_field VARCHAR(255);

-- Step 2: Backfill data (in batches)
UPDATE users SET new_field = old_field WHERE new_field IS NULL LIMIT 1000;

-- Step 3: Add NOT NULL constraint (after backfill complete)
ALTER TABLE users ALTER COLUMN new_field SET NOT NULL;

-- Step 4: Drop old column (after application updated)
ALTER TABLE users DROP COLUMN old_field;
```

---

## Connection Pooling

### TypeORM Configuration

```typescript
// database.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false, // NEVER true in production
  logging: process.env.NODE_ENV === 'development',
  
  // Connection pool settings
  extra: {
    max: 20,                    // Maximum connections
    min: 5,                     // Minimum connections
    idleTimeoutMillis: 30000,   // Close idle connections after 30s
    connectionTimeoutMillis: 5000, // Timeout for new connections
  },
};
```

---

## Redis Integration

### Cache Pattern

```typescript
// cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  constructor(@Inject('REDIS_CLIENT') private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: unknown, ttlSeconds = 3600): Promise<void> {
    await this.redis.setex(key, ttlSeconds, JSON.stringify(value));
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

// Usage in service
async getProduct(id: string): Promise<Product> {
  const cacheKey = `product:${id}`;
  
  // Check cache first
  const cached = await this.cacheService.get<Product>(cacheKey);
  if (cached) return cached;
  
  // Fetch from database
  const product = await this.productRepository.findOne({ where: { id } });
  if (!product) throw new NotFoundException();
  
  // Cache for 5 minutes
  await this.cacheService.set(cacheKey, product, 300);
  
  return product;
}
```

---

## Performance Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Query Time (P95) | <100ms | 100-500ms | >500ms |
| Connection Pool Usage | <70% | 70-90% | >90% |
| Slow Queries/hour | <10 | 10-50 | >50 |
| Index Hit Rate | >99% | 95-99% | <95% |
| Cache Hit Rate | >80% | 60-80% | <60% |

---

## Related Skills

- **backend-nestjs**: TypeORM integration, repository patterns
- **backend-fastapi**: SQLAlchemy async integration
- **security-specialist**: Database access control, encryption at rest
- **devops-deployment**: Database backup, replication setup
