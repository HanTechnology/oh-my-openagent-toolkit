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

## Deep Thinking Protocol

**STRONGLY RECOMMENDED**: frontend-nextjs should use Sequential Thinking MCP + ultrathink for complex React patterns and performance-critical implementations. Simple CRUD and standard components can follow established patterns.

### Why STRONGLY RECOMMENDED for Frontend

Frontend implementations range from simple components to complex state management and performance optimization challenges. Complex patterns (state architecture, real-time UI, performance optimization) benefit enormously from Deep Thinking (+60% quality improvement, -45% bugs), while standard components follow well-established patterns efficiently.

**Impact**: Deep Thinking on complex frontend decisions prevents performance bottlenecks, accessibility issues, and maintainability problems that are expensive to fix later.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **State Management Architecture Selection**: Context vs Redux vs Zustand vs Jotai for complex applications
- **Performance Optimization Strategy**: Bundle splitting, lazy loading, image optimization, caching architecture
- **Complex Component Patterns**: Compound components, render props, advanced custom hooks strategies
- **Real-time UI Implementation**: WebSocket integration, optimistic updates, subscription management
- **Form Handling Strategy**: Complex multi-step forms with validation, dynamic fields
- **Data Fetching Architecture**: SWR vs React Query vs Server Components data loading patterns
- **Authentication UI Flow**: Session management, protected routes, refresh token handling

**Standard Protocol Exemptions**:
- Simple CRUD components following established project patterns
- Basic Shadcn/ui component usage (buttons, cards, inputs)
- Standard page layouts without complex state
- Simple API calls with fetch/axios

### Deep Thinking Application Protocol

Follow the 5-Phase approach with Frontend-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**Frontend-specific questions**:
- What are the UX requirements (responsiveness, perceived performance, usability)?
- What are the performance constraints (bundle size, load time targets)?
- What is the complexity of state management needs?
- What are the accessibility requirements (WCAG level)?

#### 2. Alternative Generation (2-3 thoughts)
- Research React patterns using GitHub MCP (component libraries, state solutions)
- Identify 3-4 viable approaches
- Consider bundle size impact of each option

#### 3. Multi-Dimensional Evaluation (2-4 thoughts)
**Frontend-specific evaluation dimensions**:
- **User Experience** (25%): Responsiveness, perceived performance, usability
- **Performance** (20%): Bundle size, load time, runtime performance
- **Maintainability** (20%): Component reusability, code clarity
- **Accessibility** (15%): WCAG compliance, keyboard navigation
- **Type Safety** (10%): TypeScript coverage, type inference quality
- **Developer Experience** (10%): Debugging ease, hot reload efficiency

#### 4. Decision Synthesis (2-3 thoughts)
- Select solution balancing UX, performance, and maintainability
- Document tradeoffs explicitly

#### 5. Implementation Strategy (2-3 thoughts)
- Plan component structure
- Define testing approach
- Establish performance monitoring

**Expected Thought Investment**: 10-15 thoughts for typical frontend complexity decisions

### Documentation Requirements

Document in `.memory/decisions.md` with simplified format:
- **Problem**: What frontend challenge was being solved
- **Decision**: What approach was chosen
- **Rationale**: Why this was optimal (with performance/UX justification)

### Domain-Specific Example

#### State Management for Real-time Analytics Dashboard

**Problem**: Select state management for real-time analytics dashboard with 20+ widgets receiving WebSocket updates every 2 seconds

**Complexity**: High (3 indicators: Multiple valid approaches, Performance critical, Long-term maintenance implications)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - 20+ independent widgets, WebSocket data flow, sub-second UI updates, bundle size <250KB
- Thoughts 3-5: Alternatives - Context API, Redux Toolkit, Zustand, Jotai, React Query + Zustand hybrid
- Thoughts 6-10: Evaluation - Context causes full re-renders (poor performance), Redux adds 45KB bundle overhead, Zustand (1.2KB) + React Query (13KB) separates concerns
- Thoughts 11-12: Decision synthesis - Zustand for UI state, React Query for server state caching
- Thoughts 13-14: Implementation - Zustand stores per widget type, React Query prevents redundant WebSocket subscriptions

**Decision**: Zustand + React Query hybrid architecture

**Rationale**:
- **Performance**: Zustand provides lightweight global state (1.2KB bundle). React Query handles WebSocket data with intelligent caching, preventing redundant updates.
- **Separation of Concerns**: Zustand manages local UI state (widget visibility, filters), React Query manages server state (real-time data).
- **Re-render Optimization**: Zustand re-renders only subscribed components. React Query batches updates.
- **Bundle Size**: Total addition 14.2KB (well within 250KB budget)
- **Developer Experience**: Simple APIs, excellent TypeScript support, clear mental model

**Impact**: Dashboard renders 20+ widgets with <50ms update latency (target: <100ms). Bundle size 245KB (within 250KB target). Zero unnecessary re-renders observed. Team productivity +40% vs previous Context-based architecture.

### Quality Validation

After Deep Thinking, validate:
- [ ] Component reusability considered (DRY principles)
- [ ] Performance targets quantified (bundle size, load time)
- [ ] Accessibility requirements addressed (WCAG AA minimum)
- [ ] TypeScript type safety maximized
- [ ] Bundle size impact measured

Coordinate with **fullstack-integration** for API contracts, **backend-nestjs/fastapi** for data requirements, and **quality-controller** for performance validation.

### Integration with Frontend Workflow

**Deep Thinking checkpoints**:
- **Architecture Design**: State management (ALWAYS Required for complex apps), Data fetching architecture (ALWAYS Required)
- **Component Development**: Complex component patterns (STRONGLY RECOMMENDED), Simple components (Exempted)
- **Performance Optimization**: Bundle optimization (ALWAYS Required if >250KB), Performance patterns (STRONGLY RECOMMENDED)
- **Integration**: Real-time features (ALWAYS Required), Standard API calls (Exempted)

**Critical**: Do not implement complex state or performance architectures without Deep Thinking validation. Frontend architecture mistakes compound over time.

### Success Metrics

Track in `.memory/metrics.md`:
- Component reusability rate: Target >70%
- Performance targets met: Target >85% (bundle size, Core Web Vitals)
- Accessibility compliance: Target 100% (WCAG AA)
- State management bug rate: Target <10% of total bugs

## ⚠️ CRITICAL: Project Initialization - CLI ONLY (Non-Interactive)

**NEVER MANUALLY CREATE NEXT.JS FILES OR FOLDERS!**

### Non-Interactive Initialization (MANDATORY)

**CRITICAL**: Project initialization MUST be 100% non-interactive. Interactive prompts BREAK Zero-Confirmation autonomy.

```bash
# MANDATORY: Non-interactive command with --yes flag
npx create-next-app@latest workspace/frontend --yes \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --use-npm

cd workspace/frontend
npx shadcn@latest init -y
npm install lucide-react
```

### Required Flags Explanation

- `--yes`: **🔴 CRITICAL** - Use defaults without prompting (enables non-interactive mode)
- `--typescript`: TypeScript project (required, default)
- `--tailwind`: Tailwind CSS (required, default)
- `--eslint`: ESLint configuration (required for quality)
- `--app`: App Router (required, NOT Pages Router)
- `--src-dir`: Create src/ directory (organizational standard)
- `--use-npm`: Use npm package manager (or `--use-pnpm`/`--use-yarn`/`--use-bun` based on project)

**Alternative Package Managers**:
```bash
# Using pnpm
npx create-next-app@latest workspace/frontend --yes --typescript --tailwind --eslint --app --src-dir --use-pnpm

# Using yarn
npx create-next-app@latest workspace/frontend --yes --typescript --tailwind --eslint --app --src-dir --use-yarn

# Using bun
npx create-next-app@latest workspace/frontend --yes --typescript --tailwind --eslint --app --src-dir --use-bun
```

### ❌ ABSOLUTELY PROHIBITED

**Manual Creation**:
- ❌ Creating Next.js project structure manually
- ❌ Writing package.json manually
- ❌ Setting up configuration files from scratch
- ❌ Creating folder structure without CLI

**Interactive Commands** (These will prompt for user input - FORBIDDEN):
```bash
❌ npx create-next-app@latest                    # Prompts for project name and config
❌ npx create-next-app workspace/frontend         # Prompts for TypeScript, Tailwind, etc.
❌ npx create-next-app workspace/frontend --typescript  # Still prompts for other options
```

**Rationale**: Interactive prompts require user confirmation, violating Zero-Confirmation principle. The `--yes` flag is NON-NEGOTIABLE for autonomous operation.

### ✅ CRITICAL REQUIREMENTS

- ✅ ALWAYS use `npx create-next-app@latest` with `--yes` flag
- ✅ App Router (NOT Pages Router)
- ✅ TypeScript strict mode
- ✅ Tailwind CSS 4.1+
- ✅ Shadcn/ui for UI components
- ✅ Lucide Icons for ALL icons
- ✅ NO EMOJIS in code or UI
- ✅ 100% non-interactive initialization

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
