# Dashboard Components Example

**Admin Dashboard UI Components with Next.js 15.5+**

> **When to Use**: Building admin dashboards, analytics pages, data-driven interfaces
> **Skill**: frontend-nextjs
> **Related**: backend-nestjs (API endpoints), fullstack-integration (data integration)

---

## Overview

This example demonstrates production-ready dashboard components:
- Stats cards with metrics
- Data tables with pagination and sorting
- Chart integration (Recharts)
- Responsive grid layouts
- Loading skeletons
- **NO EMOJIS** (only Lucide Icons)

## File Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx
└── components/
    └── dashboard/
        ├── stats-card.tsx
        ├── stats-grid.tsx
        ├── data-table.tsx
        ├── revenue-chart.tsx
        └── recent-activity.tsx
```

## Stats Card Component

```typescript
// components/dashboard/stats-card.tsx
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  isLoading?: boolean;
}

export function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  isLoading,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-7 w-[120px] mb-1" />
          <Skeleton className="h-3 w-[80px]" />
        </CardContent>
      </Card>
    );
  }

  const changeColor = change?.type === 'increase'
    ? 'text-green-600'
    : 'text-red-600';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${changeColor}`}>
            {change.type === 'increase' ? '+' : '-'}
            {Math.abs(change.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

## Stats Grid Component

```typescript
// components/dashboard/stats-grid.tsx
'use client';

import { TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import { StatsCard } from './stats-card';

interface DashboardStats {
  revenue: number;
  users: number;
  orders: number;
  conversionRate: number;
}

interface StatsGridProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Revenue"
        value={stats ? `$${stats.revenue.toLocaleString()}` : '$0'}
        change={{ value: 12.5, type: 'increase' }}
        icon={DollarSign}
        isLoading={isLoading}
      />
      <StatsCard
        title="Active Users"
        value={stats ? stats.users.toLocaleString() : '0'}
        change={{ value: 8.2, type: 'increase' }}
        icon={Users}
        isLoading={isLoading}
      />
      <StatsCard
        title="Total Orders"
        value={stats ? stats.orders.toLocaleString() : '0'}
        change={{ value: 3.1, type: 'decrease' }}
        icon={ShoppingCart}
        isLoading={isLoading}
      />
      <StatsCard
        title="Conversion Rate"
        value={stats ? `${stats.conversionRate}%` : '0%'}
        change={{ value: 2.4, type: 'increase' }}
        icon={TrendingUp}
        isLoading={isLoading}
      />
    </div>
  );
}
```

## Data Table Component

```typescript
// components/dashboard/data-table.tsx
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T;
  header: string;
  cell?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  pageSize?: number;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  isLoading,
  pageSize = 10,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    <div className="h-4 w-[100px] animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {column.cell
                        ? column.cell(row[column.key], row)
                        : String(row[column.key])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{' '}
          {data.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

## Revenue Chart Component

```typescript
// components/dashboard/revenue-chart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## Dashboard Page

```typescript
// app/(dashboard)/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { StatsGrid } from '@/components/dashboard/stats-grid';
import { DataTable, Column } from '@/components/dashboard/data-table';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

const columns: Column<Order>[] = [
  {
    key: 'id',
    header: 'Order ID',
  },
  {
    key: 'customer',
    header: 'Customer',
  },
  {
    key: 'amount',
    header: 'Amount',
    cell: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: 'status',
    header: 'Status',
    cell: (value) => {
      const variant =
        value === 'completed'
          ? 'default'
          : value === 'pending'
          ? 'secondary'
          : 'destructive';
      return <Badge variant={variant}>{value}</Badge>;
    },
  },
  {
    key: 'date',
    header: 'Date',
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        revenue: 45231.89,
        users: 2350,
        orders: 145,
        conversionRate: 3.2,
      });

      setOrders([
        {
          id: 'ORD-001',
          customer: 'John Doe',
          amount: 299.99,
          status: 'completed',
          date: '2025-01-20',
        },
        {
          id: 'ORD-002',
          customer: 'Jane Smith',
          amount: 149.99,
          status: 'pending',
          date: '2025-01-21',
        },
        // Add more mock data
      ]);

      setRevenueData([
        { month: 'Jan', revenue: 4000 },
        { month: 'Feb', revenue: 3000 },
        { month: 'Mar', revenue: 5000 },
        { month: 'Apr', revenue: 4500 },
        { month: 'May', revenue: 6000 },
        { month: 'Jun', revenue: 5500 },
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <StatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <RevenueChart data={revenueData} isLoading={isLoading} />
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={orders.slice(0, 5)}
                columns={columns}
                isLoading={isLoading}
                pageSize={5}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">All Orders</h3>
        <DataTable
          data={orders}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
        />
      </div>
    </div>
  );
}
```

## Key Patterns

### 1. Component Composition
- Small, reusable components (StatsCard)
- Composed into larger features (StatsGrid)
- Props for customization

### 2. Loading States
- Skeleton components for loading
- Consistent loading patterns
- No layout shift during load

### 3. Responsive Design
- CSS Grid with Tailwind
- Breakpoint-based columns
- Mobile-first approach

### 4. Data Visualization
- Recharts for charts
- Responsive containers
- Theme-aware colors

### 5. Type Safety
- Generic components (DataTable<T>)
- Column definitions with types
- Type-safe cell renderers

## Best Practices

### ✅ DO
- Use loading skeletons
- Implement pagination for large datasets
- Make components responsive
- Use Lucide Icons consistently
- Provide empty states
- Use TypeScript generics for reusable components

### ❌ DON'T
- Use emojis for status indicators
- Hardcode data in components
- Forget mobile responsiveness
- Skip accessibility attributes
- Render all data at once (use pagination)

## Common Pitfalls

### Issue: Chart Not Rendering
**Solution**: Ensure ResponsiveContainer has explicit height
```typescript
<ResponsiveContainer width="100%" height={300}> {/* height required */}
```

### Issue: Hydration Mismatch with Date
**Solution**: Use useEffect for client-only rendering
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

## Related Examples

- **Forms**: See `03-form-components-validation.md` for data input
- **Backend**: See `backend-nestjs/examples/02-crud-module.md` for API
- **Testing**: See `qa-testing/examples/01-e2e-test-suite.md` for dashboard testing
