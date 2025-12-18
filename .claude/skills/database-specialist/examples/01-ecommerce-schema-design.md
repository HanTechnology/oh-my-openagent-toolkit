# E-commerce Schema Design Example

**Complete Database Schema for Online Store**

> **When to Use**: Starting a new e-commerce project or redesigning database structure
> **Skill**: database-specialist
> **Related**: backend-nestjs (entities), security-specialist (data encryption)

---

## Requirements Analysis

### Business Requirements
- Multi-tenant marketplace (vendors sell products)
- User accounts with addresses
- Product catalog with categories and variants
- Shopping cart and order management
- Inventory tracking
- Review and rating system

### Technical Requirements
- PostgreSQL 15+
- Estimated scale: 100K users, 1M products, 10M orders/year
- Read-heavy workload (80% reads, 20% writes)
- Sub-100ms query latency for product searches

---

## Schema Design

### Core Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_vendor BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User addresses (1:N relationship)
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(50) DEFAULT 'home',  -- home, work, etc.
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories with hierarchical structure
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vendors (extends users who are vendors)
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_email VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    commission_rate DECIMAL(5, 4) DEFAULT 0.10, -- 10% default
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    base_price DECIMAL(12, 2) NOT NULL CHECK (base_price >= 0),
    compare_at_price DECIMAL(12, 2), -- Original price for "sale" display
    sku VARCHAR(100),
    barcode VARCHAR(100),
    weight DECIMAL(10, 2), -- in grams
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product variants (size, color combinations)
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g., "Red - Large"
    sku VARCHAR(100) UNIQUE,
    price_adjustment DECIMAL(12, 2) DEFAULT 0, -- +/- from base price
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INTEGER DEFAULT 5,
    attributes JSONB DEFAULT '{}', -- {"color": "red", "size": "L"}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Order Management Tables

```sql
-- Orders
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- Human-readable: ORD-2024-00001
    user_id UUID NOT NULL REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    -- pending, confirmed, processing, shipped, delivered, cancelled, refunded
    
    subtotal DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) DEFAULT 0,
    shipping_amount DECIMAL(12, 2) DEFAULT 0,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    total_amount DECIMAL(12, 2) NOT NULL,
    
    shipping_address JSONB NOT NULL, -- Snapshot of address at order time
    billing_address JSONB,
    
    notes TEXT,
    cancelled_reason TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    shipped_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

-- Order items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    
    product_name VARCHAR(255) NOT NULL, -- Snapshot
    variant_name VARCHAR(100),
    sku VARCHAR(100),
    
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(12, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    
    status VARCHAR(50) DEFAULT 'pending', -- For vendor-specific fulfillment
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping cart (session-based or user-based)
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(100), -- For guest carts
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Either user_id or session_id must be present
    CONSTRAINT cart_owner_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

-- Reviews
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id), -- Verified purchase
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(product_id, user_id) -- One review per product per user
);
```

### Indexes for Performance

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Product searches
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_name_trgm ON products USING gin(name gin_trgm_ops);
CREATE INDEX idx_products_slug ON products(slug);

-- Variant lookups
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- Order queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_vendor_id ON order_items(vendor_id);

-- Cart queries
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);

-- Review queries
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_approved ON reviews(is_approved) WHERE is_approved = TRUE;

-- Category hierarchy
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
```

---

## TypeORM Entities

```typescript
// product.entity.ts
import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn 
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';

@Entity('products')
@Index(['vendorId'])
@Index(['categoryId'])
@Index(['isActive'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'vendor_id' })
  vendorId: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.products)
  @JoinColumn({ name: 'vendor_id' })
  vendor: Vendor;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 12, scale: 2 })
  basePrice: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ name: 'review_count', default: 0 })
  reviewCount: number;

  @OneToMany(() => ProductVariant, (variant) => variant.product, { cascade: true })
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

---

## Common Queries

### Product Listing with Pagination

```typescript
async findProducts(options: ProductQueryDto) {
  const query = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.images', 'image', 'image.is_primary = true')
    .leftJoinAndSelect('product.variants', 'variant', 'variant.is_active = true')
    .where('product.is_active = :isActive', { isActive: true });

  // Category filter
  if (options.categoryId) {
    query.andWhere('product.category_id = :categoryId', { 
      categoryId: options.categoryId 
    });
  }

  // Price range
  if (options.minPrice) {
    query.andWhere('product.base_price >= :minPrice', { minPrice: options.minPrice });
  }
  if (options.maxPrice) {
    query.andWhere('product.base_price <= :maxPrice', { maxPrice: options.maxPrice });
  }

  // Search
  if (options.search) {
    query.andWhere('product.name ILIKE :search', { search: `%${options.search}%` });
  }

  // Sorting
  const sortField = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'DESC';
  query.orderBy(`product.${sortField}`, sortOrder);

  // Pagination
  const page = options.page || 1;
  const limit = options.limit || 20;
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
```

### Order with Items and Products

```typescript
async findOrderWithDetails(orderId: string, userId: string) {
  return this.orderRepository
    .createQueryBuilder('order')
    .leftJoinAndSelect('order.items', 'item')
    .leftJoinAndSelect('item.product', 'product')
    .leftJoinAndSelect('product.images', 'image', 'image.is_primary = true')
    .where('order.id = :orderId', { orderId })
    .andWhere('order.user_id = :userId', { userId })
    .getOne();
}
```

---

## Key Patterns

1. **UUID Primary Keys**: For distributed systems and security
2. **Timestamps**: All tables have created_at, important tables have updated_at
3. **Soft References**: Store snapshots (address, product name) in orders for historical accuracy
4. **JSONB for Flexibility**: Variant attributes, shipping addresses
5. **Composite Indexes**: For common query patterns (user_id + status)
6. **Partial Indexes**: For frequently filtered conditions (is_active = true)

## Best Practices

- Use `DECIMAL` for money, never `FLOAT`
- Always include `ON DELETE` behavior for foreign keys
- Create indexes for all foreign keys (JOIN performance)
- Use `CHECK` constraints for data validation
- Store price snapshots in order_items for historical accuracy
- Use `ILIKE` with pg_trgm for case-insensitive search

## Related Examples

- **Migrations**: `02-query-optimization.md` - Migration patterns
- **Backend Integration**: `backend-nestjs/examples/02-crud-module.md`
- **Security**: `security-specialist/examples/01-jwt-authentication.md`
