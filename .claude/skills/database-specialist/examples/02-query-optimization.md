# Query Optimization Example

**Diagnosing and Fixing Slow Queries**

> **When to Use**: Performance issues, slow page loads, database bottlenecks
> **Skill**: database-specialist
> **Related**: backend-nestjs (repository layer), devops-deployment (monitoring)

---

## Scenario

Application experiencing slow product listing page (3-5 seconds load time). Need to identify and fix query performance issues.

---

## Step 1: Identify Slow Queries

### Enable Slow Query Logging

```sql
-- PostgreSQL configuration
ALTER SYSTEM SET log_min_duration_statement = 100; -- Log queries > 100ms
ALTER SYSTEM SET log_statement = 'none';
SELECT pg_reload_conf();

-- Check current setting
SHOW log_min_duration_statement;
```

### Analyze Problematic Query

```sql
-- Original slow query (from application logs)
SELECT p.*, v.*, c.name as category_name, 
       (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating,
       (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
FROM products p
LEFT JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;
```

### Run EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT p.*, v.*, c.name as category_name, 
       (SELECT AVG(rating) FROM reviews WHERE product_id = p.id) as avg_rating,
       (SELECT COUNT(*) FROM reviews WHERE product_id = p.id) as review_count
FROM products p
LEFT JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;
```

### EXPLAIN Output (Problematic)

```
Limit  (cost=0.00..2850.45 rows=20 width=450) (actual time=2845.123..2847.456 rows=20 loops=1)
  ->  Nested Loop Left Join  (cost=0.00..142522.50 rows=1000 width=450) (actual time=2845.120..2847.450 rows=20 loops=1)
        ->  Nested Loop Left Join  (cost=0.00..85012.50 rows=1000 width=400) (actual time=142.100..145.200 rows=20 loops=1)
              ->  Seq Scan on products p  (cost=0.00..25.00 rows=1000 width=350) (actual time=0.015..12.345 rows=1000 loops=1)
                    Filter: (is_active = true)
              ->  Index Scan on vendors v  (cost=0.00..8.50 rows=1 width=50) (actual time=0.130..0.132 rows=1 loops=1000)
        ->  Index Scan on categories c  (cost=0.00..8.50 rows=1 width=50) (actual time=0.050..0.052 rows=1 loops=20)
        SubPlan 1  <-- PROBLEM: Correlated subquery
          ->  Aggregate  (cost=25.00..25.01 rows=1 width=32) (actual time=125.000..125.001 rows=1 loops=20)
                ->  Seq Scan on reviews  (cost=0.00..24.50 rows=200 width=4) (actual time=0.010..124.500 rows=15000 loops=20)
                      Filter: (product_id = p.id)
        SubPlan 2  <-- PROBLEM: Another correlated subquery
          ->  Aggregate  (cost=25.00..25.01 rows=1 width=8) (actual time=125.000..125.001 rows=1 loops=20)
                ->  Seq Scan on reviews  (cost=0.00..24.50 rows=200 width=0) (actual time=0.010..124.500 rows=15000 loops=20)
                      Filter: (product_id = p.id)
Planning Time: 1.234 ms
Execution Time: 2850.789 ms
```

---

## Step 2: Identify Issues

### Issue 1: Correlated Subqueries
- Subqueries run for EACH row (N+1 pattern)
- Reviews table scanned 40 times (20 products x 2 subqueries)

### Issue 2: Missing Index on Reviews
- `Seq Scan on reviews` - Full table scan
- No index on `product_id`

### Issue 3: No Index on is_active Filter
- `Seq Scan on products` for active filter

---

## Step 3: Apply Fixes

### Fix 1: Add Missing Indexes

```sql
-- Index for reviews lookup
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Partial index for active products (common filter)
CREATE INDEX idx_products_active_created ON products(created_at DESC) 
    WHERE is_active = true;

-- Composite index for product listing
CREATE INDEX idx_products_active_featured_created 
    ON products(is_active, is_featured, created_at DESC);
```

### Fix 2: Replace Correlated Subqueries with JOIN

```sql
-- Optimized query using LEFT JOIN and aggregation
SELECT 
    p.id,
    p.name,
    p.slug,
    p.base_price,
    p.created_at,
    v.business_name as vendor_name,
    c.name as category_name,
    COALESCE(r.avg_rating, 0) as avg_rating,
    COALESCE(r.review_count, 0) as review_count
FROM products p
LEFT JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN (
    SELECT 
        product_id,
        AVG(rating)::DECIMAL(3,2) as avg_rating,
        COUNT(*) as review_count
    FROM reviews
    WHERE is_approved = true
    GROUP BY product_id
) r ON r.product_id = p.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;
```

### Fix 3: Denormalize for Read Performance

```sql
-- Add denormalized columns to products table
ALTER TABLE products ADD COLUMN rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN review_count INTEGER DEFAULT 0;

-- Create trigger to update on review changes
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0)::DECIMAL(3,2)
            FROM reviews
            WHERE product_id = NEW.product_id AND is_approved = true
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE product_id = NEW.product_id AND is_approved = true
        ),
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();
```

### Final Optimized Query

```sql
-- Simple and fast with denormalized data
SELECT 
    p.id,
    p.name,
    p.slug,
    p.base_price,
    p.rating,
    p.review_count,
    p.created_at,
    v.business_name as vendor_name,
    c.name as category_name
FROM products p
LEFT JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;
```

---

## Step 4: Verify Improvement

### New EXPLAIN ANALYZE

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT 
    p.id, p.name, p.slug, p.base_price, p.rating, p.review_count, p.created_at,
    v.business_name as vendor_name, c.name as category_name
FROM products p
LEFT JOIN vendors v ON p.vendor_id = v.id
LEFT JOIN categories c ON p.category_id = c.id
WHERE p.is_active = true
ORDER BY p.created_at DESC
LIMIT 20;
```

### Optimized Output

```
Limit  (cost=0.85..12.50 rows=20 width=200) (actual time=0.125..0.890 rows=20 loops=1)
  ->  Nested Loop Left Join  (cost=0.85..582.50 rows=1000 width=200) (actual time=0.123..0.885 rows=20 loops=1)
        ->  Nested Loop Left Join  (cost=0.57..452.50 rows=1000 width=180) (actual time=0.100..0.750 rows=20 loops=1)
              ->  Index Scan using idx_products_active_created on products p  (cost=0.29..322.50 rows=1000 width=150) (actual time=0.025..0.450 rows=20 loops=1)
              ->  Index Scan using vendors_pkey on vendors v  (cost=0.28..0.13 rows=1 width=30) (actual time=0.012..0.013 rows=1 loops=20)
                    Index Cond: (id = p.vendor_id)
        ->  Index Scan using categories_pkey on categories c  (cost=0.28..0.13 rows=1 width=20) (actual time=0.005..0.006 rows=1 loops=20)
              Index Cond: (id = p.category_id)
Planning Time: 0.456 ms
Execution Time: 0.945 ms
```

---

## Performance Comparison

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Execution Time | 2850ms | 0.95ms | **3000x faster** |
| Full Table Scans | 41 | 0 | Eliminated |
| Index Usage | Minimal | Full | All joins indexed |
| Buffer Hits | Low | High | Cache efficient |

---

## TypeORM Optimized Repository

```typescript
// product.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  async findActiveProducts(options: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const { 
      page = 1, 
      limit = 20, 
      categoryId, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const query = this.repository
      .createQueryBuilder('product')
      .select([
        'product.id',
        'product.name',
        'product.slug',
        'product.basePrice',
        'product.rating',
        'product.reviewCount',
        'product.createdAt',
      ])
      .leftJoin('product.vendor', 'vendor')
      .addSelect(['vendor.businessName'])
      .leftJoin('product.category', 'category')
      .addSelect(['category.name'])
      .leftJoinAndSelect(
        'product.images', 
        'image', 
        'image.isPrimary = :isPrimary', 
        { isPrimary: true }
      )
      .where('product.isActive = :isActive', { isActive: true });

    if (categoryId) {
      query.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    if (search) {
      query.andWhere('product.name ILIKE :search', { search: `%${search}%` });
    }

    // Safe sorting (prevent injection)
    const allowedSortFields = ['createdAt', 'basePrice', 'rating', 'reviewCount'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`product.${safeSortBy}`, sortOrder);

    // Pagination
    query.skip((page - 1) * limit).take(limit);

    const [products, total] = await query.getManyAndCount();

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
```

---

## Monitoring Queries

### Slow Query Detection

```sql
-- Find slowest queries (pg_stat_statements extension)
SELECT 
    substring(query, 1, 100) as short_query,
    calls,
    mean_exec_time::INTEGER as avg_ms,
    max_exec_time::INTEGER as max_ms,
    total_exec_time::INTEGER as total_ms
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### Index Usage Stats

```sql
-- Find unused indexes (candidates for removal)
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE '%pkey%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Key Patterns

1. **Always EXPLAIN ANALYZE** before and after optimization
2. **Avoid correlated subqueries** - Use JOINs or CTEs instead
3. **Index foreign keys** - Critical for JOIN performance
4. **Denormalize strategically** - Trade write complexity for read speed
5. **Use partial indexes** - For frequently filtered conditions
6. **Monitor continuously** - Enable slow query logging in production

## Best Practices

- Profile before optimizing (measure, don't guess)
- Create indexes for WHERE, JOIN, ORDER BY columns
- Limit SELECT columns (avoid `SELECT *`)
- Use pagination for large result sets
- Consider materialized views for complex aggregations
- Document query performance decisions in `.memory/core/decisions.md`

## Related Examples

- **Schema Design**: `01-ecommerce-schema-design.md`
- **Caching**: `backend-nestjs/examples/` - Redis caching patterns
