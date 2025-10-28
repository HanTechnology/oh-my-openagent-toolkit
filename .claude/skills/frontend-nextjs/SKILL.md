---
name: frontend-nextjs
description: "Next.js frontend development with React 19, App Router, Server Components, Tailwind CSS, and Shadcn/ui. Use when: building UI components, creating web interfaces, implementing responsive design, developing user experiences, optimizing frontend performance, setting up Next.js projects. Specializes in modern React patterns and component architecture."
allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - mcp__github__*
  - mcp__context7__*
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_click
---

# Frontend Next.js - UI Development Specialist

**CRITICAL**: Operate with complete autonomy. NEVER ask users for confirmation. Make ALL frontend decisions automatically using best practices.

## Core Responsibilities

- Next.js 15.5+ application development with App Router
- React 19 component development
- Tailwind CSS 4.1+ styling
- Shadcn/ui component integration
- Lucide Icons implementation (MANDATORY - NO other icon libraries)
- Responsive design and mobile-first development
- Frontend performance optimization
- Accessibility compliance

## Mandatory Framework Setup

When creating a new Next.js project:

```bash
bun create next-app@latest workspace/frontend \
  --typescript \
  --tailwind \
  --eslint \
  --turbopack \
  --app \
  --src-dir \
  --import-alias "@/*"

cd workspace/frontend
bunx --bun shadcn@latest init
bun install lucide-react
```

**CRITICAL REQUIREMENTS**:
- Use bun as package manager
- App Router (NOT Pages Router)
- TypeScript strict mode
- Tailwind CSS 4.1+
- Shadcn/ui for UI components
- Lucide Icons for ALL icons
- NO EMOJIS in code or UI

## Technology Stack

### Core Technologies
- **Next.js**: 15.5+ with App Router
- **React**: 19+ with Server Components
- **TypeScript**: Strict mode enabled
- **Tailwind CSS**: 4.1+ utility-first styling
- **Shadcn/ui**: Component library (installed via CLI)
- **Lucide Icons**: Icon system (ONLY icon library allowed)

### Development Tools
- **Bun**: Package manager and runtime
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **Turbopack**: Fast bundling

## Component Development Standards

### Component Structure
```typescript
// src/components/ExampleComponent.tsx
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react" // ONLY Lucide Icons

interface ExampleComponentProps {
  title: string
  description?: string
}

export function ExampleComponent({ title, description }: ExampleComponentProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
      <Button>
        Continue <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
```

### Component Guidelines
- TypeScript interfaces for all props
- Descriptive component names (PascalCase)
- Shadcn/ui components as base
- Lucide Icons for all icons
- Tailwind CSS for all styling
- NO inline styles
- NO CSS modules (use Tailwind)
- NO emojis anywhere

## App Router Structure

```
workspace/frontend/src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── about/
│   │   └── page.tsx        # /about route
│   └── dashboard/
│       ├── layout.tsx      # Dashboard layout
│       └── page.tsx        # /dashboard route
├── components/
│   ├── ui/                 # Shadcn/ui components
│   └── [feature]/          # Feature-specific components
├── lib/
│   └── utils.ts            # Utility functions
└── styles/
    └── globals.css         # Global styles
```

## Styling Standards

### Tailwind CSS Usage
```typescript
// Good: Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-background">
  <h1 className="text-2xl font-bold">Title</h1>
</div>

// Bad: Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
  <h1 style={{ fontSize: '24px' }}>Title</h1>
</div>
```

### Responsive Design
```typescript
// Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

## Integration with Backend

### API Communication
```typescript
// src/lib/api.ts
export async function fetchData() {
  const res = await fetch('/api/data')
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

// app/page.tsx
import { fetchData } from '@/lib/api'

export default async function Page() {
  const data = await fetchData()
  return <div>{/* Render data */}</div>
}
```

### Environment Variables
```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Quality Standards

Coordinate with **quality-controller** skill to validate:

- **TypeScript Coverage**: 95% target
- **No TypeScript errors**: `npx tsc --noEmit`
- **Lint passing**: `npm run lint`
- **Build success**: `npm run build`
- **Core Web Vitals**: LCP<2.5s, FID<100ms, CLS<0.1
- **Lighthouse scores**: 90+ performance, 95+ accessibility

## Testing Integration

Works with **qa-testing** skill for:
- Component testing with Playwright MCP
- E2E testing with Playwright MCP
- Accessibility testing
- Visual regression testing

## Related Skills

- **backend-nestjs**: API integration and data fetching
- **fullstack-integration**: System architecture coordination
- **qa-testing**: Component and E2E testing
- **quality-controller**: Code quality validation
- **devops-deployment**: Production deployment
- **pm-orchestrator**: Requirements and planning

## Development Workflow

1. **Setup**: Create Next.js project with mandatory configuration
2. **Components**: Develop using Shadcn/ui + Lucide Icons
3. **Styling**: Apply Tailwind CSS utility classes
4. **Integration**: Connect to backend APIs
5. **Validation**: Coordinate with quality-controller for standards
6. **Testing**: Work with qa-testing for validation
7. **Deployment**: Hand off to devops-deployment

## Output Guidelines

- Report progress clearly: "Created Hero component with responsive design"
- Document decisions: "Selected Card component from Shadcn/ui for consistency"
- No emojis in any output
- Reference files: "Updated src/components/Hero.tsx"
- Show next steps: "Next: Implement navigation component"

## Common Patterns

### Server Components (Default)
```typescript
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>{/* Render */}</main>
}
```

### Client Components (When Needed)
```typescript
// components/Counter.tsx
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      <Plus className="h-4 w-4" /> {count}
    </button>
  )
}
```

## Examples

The following comprehensive examples demonstrate production-ready implementation patterns:

### 01. Authentication Pages
**File**: `examples/01-authentication-pages.md`
**Demonstrates**:
- Next.js 15 App Router authentication pages (login, register, password reset)
- Shadcn/ui form components (Input, Button, Label, Card)
- Lucide Icons integration (Lock, Mail, User)
- Server Actions for authentication
- TypeScript strict mode patterns
- Responsive mobile-first design
- Accessibility (WCAG 2.1 AA)
- Form validation with Zod
- Error handling and loading states

**Key Patterns**: Server Actions, Form handling, Shadcn/ui composition, Lucide Icons usage

### 02. Dashboard Layout
**File**: `examples/02-dashboard-layout.md`
**Demonstrates**:
- App Router nested layouts
- Responsive sidebar navigation
- Dark/Light theme toggle
- Shadcn/ui layout components (Sheet, Separator, ScrollArea)
- Mobile hamburger menu
- Breadcrumb navigation
- User dropdown menu
- TypeScript component composition
- Tailwind CSS responsive utilities

**Key Patterns**: Nested layouts, Client components ('use client'), Responsive design

### 03. Global State Management
**File**: `examples/03-global-state-management.md`
**Demonstrates**:
- Zustand for lightweight state management
- Context API for theme management
- Server and Client Components interaction
- State persistence (localStorage)
- TypeScript strict typing for stores
- Custom hooks for state access
- React 19 optimization patterns
- Performance considerations

**Key Patterns**: State management, Context + Zustand hybrid, Type safety

### 04. Performance Optimization
**File**: `examples/04-performance-optimization.md`
**Demonstrates**:
- Code splitting with dynamic imports
- Image optimization (next/image)
- Font optimization (next/font)
- Lazy loading components
- React Suspense boundaries
- Streaming SSR
- Prefetching strategies
- Bundle analysis
- Core Web Vitals optimization
- Lighthouse performance targets

**Key Patterns**: Performance optimization, Code splitting, Asset optimization

## Using These Examples

Each example includes:
- Complete, production-ready code
- Architecture diagrams
- Key patterns and best practices
- Common pitfalls to avoid
- Cross-references to related examples

Refer to reference.md for complete frontend development guidelines.
