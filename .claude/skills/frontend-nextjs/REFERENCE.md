# Frontend Next.js - Technical Reference

> **Purpose**: Technical reference for the frontend-nextjs skill in the autonomous skills-based development system.
> **Related Skills**: backend-nestjs, backend-fastapi, fullstack-integration, qa-testing, devops-deployment, mcp-tools-orchestrator
> **Examples**: See examples/ directory for production-ready implementation patterns.

---

## Table of Contents
1. [Frontend Specialized Domains](#frontend-specialized-domains)
2. [Technology Stack](#technology-stack)
3. [Production Examples](#production-examples)
4. [Project Initialization](#project-initialization)
5. [Development Workflow](#development-workflow)
6. [Skill Coordination](#skill-coordination)
7. [Project Structure Template](#project-structure-template)
8. [Quality Assurance Checklist](#quality-assurance-checklist)
9. [Command Guide](#command-guide)

---

## Frontend Specialized Domains

### Application Areas
- **Web Application UI Development**: Complete process from creation to deployment
- **Existing Projects**: Analysis, modification, and enhancement
- **Performance Optimization**: SEO, accessibility, responsive design, Core Web Vitals
- **Backend Integration**: API integration with NestJS backend services

### Core Technologies
- Next.js App Router, React Server Components, Tailwind CSS 4.1+
- TypeScript strict mode, Shadcn/ui components, Lucide Icons
- Performance optimization, SEO, accessibility (WCAG 2.1 AA), responsive design

### Ultimate Goals
- **Production-ready Next.js application integrated with NestJS backend**
- **Zero user confirmations required for technical decisions**

---

## Technology Stack

### Frontend Technology Stack (Fixed)
```textmate
- Framework: Next.js v15.5.0+ (App Router)
- Styling: Tailwind CSS v4.1+
- Component System: Shadcn/ui (MANDATORY for UI components)
- Icons: Lucide Icons (MANDATORY - emoji usage prohibited)
- Package Manager: Bun
- Runtime: Node.js 18+
- TypeScript: Required (strict mode)
- Deployment: Vercel
- Backend Integration: NestJS REST/GraphQL APIs OR FastAPI Python APIs
- Authentication: JWT tokens from backend-nestjs OR backend-fastapi
- Data Fetching: React Server Components with backend API calls
- Real-time: WebSocket connections to backend (when needed)
- State Management: React Context + Server Components (when needed)
- Alternative: Next.js Server Actions for simple server-side logic
```

### Backend Collaboration
This skill works closely with **backend-nestjs** (TypeScript) OR **backend-fastapi** (Python) for:
- RESTful API endpoints and data fetching
- JWT authentication and authorization
- WebSocket real-time communication (backend-nestjs) / SSE (backend-fastapi)
- File uploads and storage
- Database operations through backend APIs
- AI/ML model serving (backend-fastapi specialization)

---

## Production Examples

This skill provides comprehensive Next.js implementation examples in the `examples/` directory:

### Available Examples

#### 01. Authentication Pages (`examples/01-authentication-pages.md`)
- **Demonstrates**: Complete authentication UI with JWT integration
- **Key Patterns**: Login/signup forms, protected routes, auth context, JWT handling
- **Backend Integration**: Coordination with backend-nestjs OR backend-fastapi for auth endpoints
- **Technologies**: React Hook Form, Zod validation, JWT storage, route guards
- **Use when**: Implementing user authentication and session management

#### 02. Dashboard Application (`examples/02-dashboard-application.md`)
- **Demonstrates**: Complex data visualization and admin interface
- **Key Patterns**: Server Components, data tables, charts, real-time updates, layouts
- **Backend Integration**: API data fetching, pagination, filtering, sorting
- **Technologies**: React Server Components, Recharts, data fetching patterns
- **Use when**: Building data-intensive admin panels or dashboards

#### 03. E-commerce Product Catalog (`examples/03-ecommerce-product-catalog.md`)
- **Demonstrates**: Product listing, filtering, search, cart functionality
- **Key Patterns**: Dynamic routes, image optimization, state management, SEO
- **Backend Integration**: Product API, cart management, checkout flow
- **Technologies**: Next.js Image, dynamic routes, metadata API, cart state
- **Use when**: Implementing e-commerce or catalog-based applications

#### 04. Real-time Collaboration (`examples/04-real-time-collaboration.md`)
- **Demonstrates**: WebSocket integration, real-time updates, collaborative editing
- **Key Patterns**: WebSocket client, optimistic updates, conflict resolution, presence
- **Backend Integration**: WebSocket Gateway from NestJS backend
- **Technologies**: WebSocket client, React hooks, optimistic UI updates
- **Use when**: Building collaborative or real-time features

### Using These Examples
- Examples include complete component implementations with TypeScript
- Full type definitions and API contract documentation provided
- Tailwind CSS styling patterns and responsive design demonstrated
- Shadcn/ui component integration patterns shown
- Backend API integration with error handling and loading states
- Cross-references with backend-nestjs, backend-fastapi, qa-testing, and devops-deployment skills
- Production-ready patterns following Next.js 15+ best practices

---

## Project Initialization

### ⚠️ MANDATORY: Framework Creation Requirements
**ALWAYS use framework creation commands - DO NOT create files manually!**

For Node.js-based frameworks like Next.js, you MUST use official creation tools to ensure proper project structure and avoid configuration issues.

### Next.js Project Creation Steps
1. **Next.js Project Creation** (using `bun create next-app` - MANDATORY)
   - Use official Next.js creation command with proper flags
   - Never create Next.js files/folders manually
   - Follow the exact command structure provided in Command Guide
2. **Framework-Generated TypeScript and Tailwind CSS Verification**
   - Verify the framework properly configured TypeScript and Tailwind
   - Only make minimal adjustments to framework-generated configuration
3. **Framework-Based Project Structure Validation**
   - Ensure the generated structure follows Next.js App Router conventions
   - Do not restructure framework-generated folders
4. **Framework-Generated ESLint, Prettier Validation**
   - Verify framework-generated linting configuration
   - Only make minimal custom adjustments if absolutely necessary

---

## Development Workflow

### Requirements Analysis Phase
1. **Requirements Parsing and Verification**
    - Review Next.js feature utilization methods
    - Determine SSG/SSR/ISR strategy
    - Prepare questions for ambiguous parts

2. **Architecture Design**
    - App Router structure design
    - Component hierarchy definition
    - State management strategy establishment

3. **Backend Integration Requirements** (if needed)
    - Analyze user authentication necessity (coordinate with backend-nestjs OR backend-fastapi)
    - Identify API endpoints and data contracts
    - Review real-time feature necessity (WebSocket/SSE coordination)
    - Analyze file upload requirements (backend storage endpoints)
    - Identify AI/ML integration needs (backend-fastapi specialization)

### Existing Project Analysis (if applicable)
1. **Next.js Codebase Analysis**
    - Analyze existing project structure and quality
    - Identify improvement points and refactoring targets
    - Understand component dependency relationships
    - Establish Next.js migration strategy

### Front-end Development Order
1. **Next.js Project Structure Creation**
2. **Layout and Common Component Implementation**
3. **Page-specific Component Implementation (App Router)**
4. **Tailwind CSS Styling (Mobile-First)**
5. **Interaction and Animation Implementation**
6. **SEO and Metadata Optimization**
7. **Performance Optimization and Accessibility Review**
8. **Vercel Deployment Preparation**

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for technical decisions including:
- Technology stack selections (Next.js 15+, Tailwind CSS 4.1+, Shadcn/ui)
- Component architecture and structure design
- Performance optimization strategies and implementations
- Deployment configurations and CI/CD setup
- UI/UX implementation decisions

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "Next.js", "React", "frontend", "UI", "web pages", "web application"
- Related skills mention: "frontend-nextjs skill" in their outputs
- Context matches: web application UI development, React components, Next.js features, responsive design

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions and shared memory system:

**backend-nestjs** (TypeScript backend):
- API endpoint integration and contract design
- Authentication flow coordination (JWT handling)
- Data fetching patterns and error handling
- WebSocket real-time communication setup
- File upload and storage API integration

**backend-fastapi** (Python backend):
- Async API endpoint integration with Python backend
- OAuth2 + JWT authentication flow coordination
- Data fetching with async endpoints
- Server-Sent Events (SSE) for real-time updates
- AI/ML model inference integration

**fullstack-integration**:
- System architecture alignment and design patterns
- API contract design and validation
- End-to-end feature implementation coordination
- Integration testing strategy and execution

**qa-testing**:
- Component testing with Playwright MCP
- Accessibility compliance validation (WCAG 2.1 AA)
- Performance validation (Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1)
- Cross-browser testing coordination (Chrome, Firefox, Safari, Edge)
- E2E user flow testing

**devops-deployment**:
- Vercel deployment configuration and optimization
- Environment variable management and security
- Build optimization and CI/CD pipeline setup
- Docker containerization (if needed)
- Production monitoring setup

**mcp-tools-orchestrator**:
- Context7 MCP for Next.js and React documentation
- GitHub MCP for code examples and patterns
- Playwright MCP coordination for E2E testing
- Advanced MCP tool usage patterns

### Coordination Pattern
Skills coordinate through:
1. **Natural Language Mentions**: Mentioning skill names in outputs triggers automatic invocation
2. **Shared Memory System**: All context shared through .memory/ directory files
3. **Autonomous Invocation**: Claude automatically invokes mentioned skills with full context
4. **Zero User Confirmation**: All skill coordination happens autonomously

---

## Project Structure Template

### Next.js Project Structure
```textmate
workspace/frontend/
├── app/                          # App Router (Next.js 13+)
│   ├── globals.css               # Tailwind CSS global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── loading.tsx               # Loading UI
│   ├── error.tsx                 # Error UI
│   ├── not-found.tsx             # 404 page
│   │
│   ├── (routes)/                 # Page route groups
│   │   ├── about/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── services/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── blog/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   │
│   ├── (auth)/                   # Authentication-related route groups (when database is needed)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   │
│   └── api/                      # API Routes
│       ├── contact/
│       │   └── route.ts
│       └── newsletter/
│           └── route.ts
│
├── components/                   # Reusable components
│   ├── ui/                       # Basic UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── index.ts
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   ├── sections/                 # Section-based components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTA.tsx
│   └── common/                   # Common components
│       ├── SEO.tsx
│       ├── ThemeProvider.tsx
│       └── Analytics.tsx
│
├── hooks/                        # Custom Hooks
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   └── useIntersectionObserver.ts
│
├── lib/                          # Utilities and configurations
│   ├── utils.ts                  # Common utilities
│   ├── constants.ts              # Constant definitions
│   ├── validations.ts            # Form validation schemas
│   ├── metadata.ts               # SEO metadata
│   ├── api.ts                    # API client configuration
│   ├── auth.ts                   # Authentication utilities (JWT handling)
│   └── types/                    # API type definitions
│       └── api-types.ts          # Backend API response types
│
├── types/                        # TypeScript type definitions
│   ├── index.ts
│   ├── api.ts
│   └── components.ts
│
├── public/                       # Static files
│   ├── images/                   # Image files
│   ├── icons/                    # Icon files
│   ├── favicon.ico
│   ├── robots.txt
│   └── sitemap.xml
│
├── actions/                      # Server Actions (optional for simple server-side logic)
│   ├── form-submission.ts        # Form submission handlers
│   └── data-fetching.ts          # Server-side data fetching
│
├── services/                     # API service layer (backend integration)
│   ├── api-client.ts             # Base API client
│   ├── auth-service.ts           # Authentication API calls
│   └── data-service.ts           # Data fetching services
│
├── styles/                       # Additional style files
│   └── components.css            # Component-specific styles
│
├── .env.local                    # Environment variables
├── .env.example                  # Environment variables example
├── .gitignore
├── .eslintrc.json                # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── bun.lockb                     # Bun lock file
├── package.json
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── vercel.json                   # Vercel deployment configuration
└── README.md                     # Project documentation
```

---

## Quality Assurance Checklist

### Next.js Basic Requirements
- [ ] Use Next.js 15.5.0+ App Router
- [ ] Complete TypeScript implementation (type safety)
- [ ] Tailwind CSS 4.1+ configuration completed
- [ ] ESLint + Prettier configuration
- [ ] Proper Server/Client Components separation

### App Router Structure
- [ ] Appropriate layout.tsx structure design
- [ ] Implementation of loading.tsx, error.tsx, not-found.tsx
- [ ] Dynamic routing implementation ([slug], [id], etc.)
- [ ] Route Groups utilization (when needed)
- [ ] Parallel Routes and Intercepting Routes (when advanced features needed)

### Performance Optimization (Next.js Specialized)
- [ ] Next.js Image component utilization
- [ ] Appropriate rendering strategy (SSG/SSR/ISR) implementation
- [ ] Bundle size optimization with Bundle Analyzer
- [ ] Code splitting through dynamic imports
- [ ] React Suspense boundary configuration

### SEO and Metadata (Next.js Specialized)
- [ ] Metadata API utilization (generateMetadata)
- [ ] Open Graph image generation (generateImageMetadata)
- [ ] Structured data (JSON-LD) implementation
- [ ] Automatic sitemap.xml generation
- [ ] robots.txt configuration

### Tailwind CSS Utilization
- [ ] Custom theme configuration (colors, fonts, spacing)
- [ ] Responsive design (sm, md, lg, xl, 2xl)
- [ ] Dark mode support (class or media strategy)
- [ ] Component-based styling
- [ ] Tailwind CSS Intellisense utilization

### TypeScript Type Safety
- [ ] Type definitions for all component Props
- [ ] API response type definitions
- [ ] Custom Hook type definitions
- [ ] Strict mode activation
- [ ] Maintain zero type errors

### Accessibility (Next.js + React Specialized)
- [ ] Semantic HTML structure
- [ ] Appropriate ARIA attribute usage
- [ ] Keyboard navigation support
- [ ] Focus Management (modals, routing)
- [ ] alt text and Screen Reader support

### Backend Integration and Authentication
- [ ] API client configuration (base URL, headers, interceptors)
- [ ] JWT authentication implementation (token storage, refresh)
- [ ] API service layer implementation (auth, data services)
- [ ] TypeScript type definitions for API responses
- [ ] Error handling and loading states
- [ ] Authentication state management (Context/hooks)
- [ ] Protected routes implementation
- [ ] API integration testing

---

## Command Guide

**Important Note**: Next.js projects must be created within the project directory. Do not leave the `project root folder`.

### Project Setup
```bash
# Create Next.js project
bun create next-app@latest workspace/frontend --typescript --tailwind --eslint --turbopack --app --src-dir --import-alias "@/*"
# Install dependencies
bun install
# Run development server
bun dev 
# Production build
bun run build
# Run production server
bun start 
# Type check
bun run type-check
# Run lint
bun run lint
# Fix lint issues
bun run lint:fix
```

### Shadcn/ui Setup (MANDATORY)
```bash
# Initialize Shadcn/ui with default configuration
bunx --bun shadcn@latest init

# Install essential Shadcn/ui components
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add input
bunx shadcn@latest add form
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu

# Install additional components as needed
# bunx shadcn@latest add [component-name]
```

### Additional Package Installation (when needed)
```bash
# Animation library
bun add framer-motion
# Form library
bun add react-hook-form @hookform/resolvers zod
# Icon library (MANDATORY)
bun add lucide-react
# Date library
bun add date-fns
# Utility library
bun add clsx tailwind-merge
# Development tools
bun add -D @next/bundle-analyzer
# API client and state management (backend integration)
bun add axios
bun add @tanstack/react-query
# WebSocket client (for real-time features)
bun add socket.io-client
```

### Icon Usage Standards (MANDATORY)

#### Lucide Icons Implementation
- **MANDATORY**: Use Lucide Icons (https://lucide.dev/icons/) for ALL icon requirements
- **PROHIBITED**: Emoji usage in UI components, documentation, or any user interface elements

#### Icon Implementation Guidelines
```tsx
// ✅ CORRECT: Use Lucide Icons
import { CheckCircle, AlertCircle, Home, Settings } from 'lucide-react'

function MyComponent() {
  return (
    <div>
      <CheckCircle className="h-4 w-4 text-green-500" aria-label="Success" />
      <AlertCircle className="h-4 w-4 text-red-500" aria-label="Error" />
    </div>
  )
}

// ❌ INCORRECT: DO NOT use emojis
function BadComponent() {
  return (
    <div>
      <span>✅ Success</span> {/* PROHIBITED */}
      <span>❌ Error</span>   {/* PROHIBITED */}
    </div>
  )
}
```

#### Accessibility Requirements
- All icons MUST have proper ARIA labels
- Use semantic meaning for screen readers
- Ensure adequate color contrast
- Provide text alternatives when necessary

---

## Related Skills and Resources

**Related Skills**:
- **backend-nestjs**: Backend API integration (TypeScript), authentication, data services
- **backend-fastapi**: Backend API integration (Python), async operations, AI/ML serving
- **fullstack-integration**: System architecture, API contracts, end-to-end features
- **qa-testing**: E2E testing with Playwright MCP, accessibility validation
- **devops-deployment**: Vercel deployment, CI/CD pipeline, Docker configuration
- **mcp-tools-orchestrator**: Advanced MCP tool usage, tool coordination

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for implementation patterns

---

This technical reference guide supports Next.js v15.5.0+, Tailwind CSS v4.1+, and the autonomous skills-based development system.