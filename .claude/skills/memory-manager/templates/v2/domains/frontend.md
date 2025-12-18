# Frontend Domain Context

> Consolidated frontend information: architecture, components, pages, API integration, design system.

## Architecture

### Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Framework | Next.js 15.x | React framework |
| Styling | Tailwind CSS 4.x | Utility-first CSS |
| Components | Shadcn/ui | UI component library |
| Icons | Lucide React | Icon library (NO EMOJIS) |
| State | React Query | Server state |
| Forms | React Hook Form + Zod | Form handling |

### Project Structure
```
workspace/frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Shared components
│   │   ├── ui/          # Shadcn/ui components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature components
│   ├── lib/             # Utilities
│   ├── hooks/           # Custom hooks
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
├── public/              # Static assets
└── tests/               # Test files
```

---

## Components

### Implemented
| Component | Path | Description | Tests |
|-----------|------|-------------|-------|
| | | | |

### Pending
- [ ] 

---

## Pages / Routes

| Route | Component | Auth | Description | Status |
|-------|-----------|------|-------------|--------|
| / | HomePage | No | Landing page | Pending |
| /login | LoginPage | No | User login | Pending |
| /register | RegisterPage | No | User registration | Pending |
| /dashboard | DashboardPage | Yes | Main dashboard | Pending |

---

## API Integration

### API Client Configuration
```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

### Integrated Endpoints
| Frontend Action | Backend Endpoint | Method | Status |
|-----------------|------------------|--------|--------|
| | | | |

---

## Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | #0066FF | Buttons, links |
| Secondary | #6B7280 | Secondary text |
| Error | #EF4444 | Error states |
| Success | #10B981 | Success states |
| Warning | #F59E0B | Warning states |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| h1 | Inter | 2.25rem | Bold |
| h2 | Inter | 1.875rem | Semibold |
| body | Inter | 1rem | Regular |

### Spacing
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64

---

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| LCP | <2.5s | - | - |
| FID | <100ms | - | - |
| CLS | <0.1 | - | - |
| Lighthouse Performance | >90 | - | - |
| Lighthouse Accessibility | >95 | - | - |

---

## Notes

<!-- Additional frontend notes and decisions -->
