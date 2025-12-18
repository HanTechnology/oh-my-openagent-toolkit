# Memory System V2 Specification

## Problem Statement

The current memory system uses 40+ files across different categories:
- 6 core files
- 12+ project-type-specific files
- 15+ expert-specific files
- 7 continuous development files

**Issues Identified**:
1. **Complexity**: Too many files to track and coordinate
2. **Conflict Risk**: Multiple skills updating different files creates sync issues
3. **Cognitive Load**: Hard to understand what goes where
4. **Redundancy**: Similar information scattered across files
5. **Query Difficulty**: Finding specific information requires searching many files

## V2 Design Goals

1. **Reduce to 10 Core Files**: From 40+ to 10 well-organized files
2. **Clear Ownership**: Each file has clear write ownership
3. **Conflict Minimization**: Reduce multi-writer scenarios
4. **Query Efficiency**: Information organized for fast retrieval
5. **Backward Compatible**: Migration path from V1

## V2 Architecture

### Directory Structure

```
.memory/
├── core/                    # Core state files (always present)
│   ├── project.json        # Project metadata and configuration
│   ├── state.json          # Current dynamic state
│   ├── decisions.md        # Decision journal (append-only)
│   └── journal.md          # Activity log (append-only)
│
├── domains/                 # Domain-specific consolidations
│   ├── frontend.md         # All frontend-related context
│   ├── backend.md          # All backend-related context
│   ├── mobile.md           # Mobile-specific context (if applicable)
│   └── system.md           # System/ML/GPU context (if applicable)
│
├── ops/                     # Operations and quality
│   ├── quality.json        # Quality metrics and standards
│   └── releases.md         # Version history and release planning
│
└── .archive/               # Archived sessions (auto-cleanup)
    └── session-{date}.json
```

**Total: 10 Core Files** (vs 40+ in V1)

### File Specifications

---

#### 1. `core/project.json` - Project Metadata

**Purpose**: Static/semi-static project facts
**Owner**: pm-orchestrator (write), all skills (read)
**Update Frequency**: Rarely (project init, major changes)

```json
{
  "schema_version": "2.0",
  "project": {
    "name": "string",
    "type": "web_application|ai_ml_system|mobile_application|api_microservice|data_processing|desktop_application",
    "created_at": "ISO8601",
    "description": "string"
  },
  "lifecycle": {
    "state": "initial_development|continuous_development|major_version_development",
    "current_version": "semver",
    "first_release_date": "ISO8601|null"
  },
  "stack": {
    "frontend": { "framework": "string", "version": "string" },
    "backend": { "framework": "string", "version": "string" },
    "database": { "type": "string", "version": "string" },
    "mobile": { "framework": "string", "version": "string" } | null,
    "system": { "ml_framework": "string", "gpu": "boolean" } | null
  },
  "team": {
    "active_skills": ["string"],
    "primary_skill": "string"
  },
  "config": {
    "quality_profile": "strict|standard|relaxed",
    "deployment_target": "string",
    "ci_cd": { "provider": "string", "config_path": "string" }
  }
}
```

---

#### 2. `core/state.json` - Dynamic State

**Purpose**: Current project state, progress, active work
**Owner**: pm-orchestrator (primary), domain skills (specific sections)
**Update Frequency**: Frequently (every significant action)

```json
{
  "schema_version": "2.0",
  "updated_at": "ISO8601",
  "phase": {
    "current": "requirements|research|architecture|implementation|integration|qa|deployment|continuous",
    "workflow": "string (e.g., '03-architecture-design')",
    "sub_phase": "string|null"
  },
  "progress": {
    "overall": 0-100,
    "by_phase": {
      "requirements": 0-100,
      "research": 0-100,
      "architecture": 0-100,
      "implementation": 0-100,
      "integration": 0-100,
      "qa": 0-100,
      "deployment": 0-100
    }
  },
  "active": {
    "tasks": [
      {
        "id": "string",
        "description": "string",
        "skill": "string",
        "status": "pending|in_progress|blocked|completed",
        "started_at": "ISO8601",
        "blockers": ["string"]
      }
    ],
    "next_milestones": ["string"]
  },
  "session": {
    "id": "string",
    "started_at": "ISO8601",
    "last_activity": "ISO8601",
    "work_completed": ["string"]
  },
  "metrics": {
    "quality": {
      "test_coverage": 0-100,
      "type_coverage": 0-100,
      "lint_score": 0-100,
      "security_issues": { "critical": 0, "high": 0, "medium": 0, "low": 0 }
    },
    "performance": {
      "api_latency_p95_ms": 0,
      "page_load_ms": 0,
      "lighthouse_score": 0-100
    }
  }
}
```

---

#### 3. `core/decisions.md` - Decision Journal

**Purpose**: All significant decisions with rationale
**Owner**: All skills (append-only)
**Update Frequency**: On each significant decision

```markdown
# Decision Journal

> Append-only log of all significant project decisions

---

## [2025-01-15] Authentication Strategy

**Skill**: backend-nestjs
**Complexity**: High
**Phase**: architecture

### Context
Multi-tenant SaaS requiring secure user authentication with enterprise SSO support.

### Options Considered
1. **JWT + Session Hybrid**: JWT for stateless auth, sessions for sensitive ops
2. **OAuth2 External**: Delegate to Auth0/Okta
3. **Custom + Redis**: Full custom with Redis session store

### Decision
JWT + Session Hybrid with OAuth2 fallback for enterprise customers.

### Rationale
- 80% users prefer simple email/password
- 20% enterprise need SSO
- Hybrid gives flexibility without full OAuth complexity for all users

### Tradeoffs
- (+) Flexibility for different user segments
- (-) Two auth systems to maintain
- (-) Slightly higher complexity

### Reversibility
Medium - Would require frontend and backend changes to switch

---

## [YYYY-MM-DD] [Decision Title]
...
```

---

#### 4. `core/journal.md` - Activity Log

**Purpose**: Chronological activity log for session continuity
**Owner**: All skills (append-only)
**Update Frequency**: Every significant action

```markdown
# Activity Journal

> Append-only log of project activities for session continuity

---

## Session: 2025-01-15T09:00:00Z

### 09:00 - Session Start
- **Skill**: pm-orchestrator
- **Action**: Session initialized
- **Context**: Resuming from architecture phase

### 09:15 - Architecture Review
- **Skill**: fullstack-integration
- **Action**: Reviewed system architecture
- **Output**: Updated integration-architecture in domains/backend.md

### 09:45 - Backend Implementation Start
- **Skill**: backend-nestjs
- **Action**: Started auth module implementation
- **Output**: workspace/backend/src/auth/ created

### 10:30 - Quality Check
- **Skill**: quality-controller
- **Action**: Ran TypeScript validation
- **Result**: 0 errors, 3 warnings

### 11:00 - Session End
- **Skill**: memory-manager
- **Action**: Context preserved
- **Next**: Continue backend implementation

---

## Session: [Previous Date]
...
```

---

#### 5. `domains/frontend.md` - Frontend Context

**Purpose**: All frontend-related information consolidated
**Owner**: frontend-nextjs, mobile-react-native (primary)
**Update Frequency**: During frontend work

```markdown
# Frontend Domain Context

## Architecture

### Tech Stack
- Framework: Next.js 15.5
- Styling: Tailwind CSS 4.1 + Shadcn/ui
- State: React Query + Zustand
- Icons: Lucide React (NO EMOJIS)

### Project Structure
```
workspace/frontend/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # Shared components
│   ├── lib/           # Utilities
│   └── hooks/         # Custom hooks
```

## Components

### Implemented
| Component | Path | Status | Tests |
|-----------|------|--------|-------|
| MainLayout | components/layout/MainLayout.tsx | Done | Yes |
| AuthForm | components/auth/AuthForm.tsx | Done | Yes |
| Dashboard | app/dashboard/page.tsx | Done | Yes |

### Pending
- [ ] Settings page
- [ ] Profile editor

## Pages/Routes

| Route | Component | Auth Required | Status |
|-------|-----------|---------------|--------|
| / | HomePage | No | Done |
| /login | LoginPage | No | Done |
| /dashboard | DashboardPage | Yes | Done |
| /settings | SettingsPage | Yes | Pending |

## API Integration

### Endpoints Used
| Frontend Action | Backend Endpoint | Status |
|-----------------|------------------|--------|
| Login | POST /api/auth/login | Integrated |
| Get Profile | GET /api/users/me | Integrated |
| Update Profile | PATCH /api/users/me | Pending |

## Design System

### Colors
- Primary: #0066FF
- Secondary: #6B7280
- Error: #EF4444
- Success: #10B981

### Typography
- Headings: Inter Bold
- Body: Inter Regular

## Performance Targets
- LCP: <2.5s (current: 1.8s)
- FID: <100ms (current: 45ms)
- CLS: <0.1 (current: 0.05)
```

---

#### 6. `domains/backend.md` - Backend Context

**Purpose**: All backend-related information consolidated
**Owner**: backend-nestjs, backend-fastapi (primary)
**Update Frequency**: During backend work

```markdown
# Backend Domain Context

## Architecture

### Tech Stack
- Framework: NestJS 10.x
- ORM: TypeORM
- Database: PostgreSQL 16
- Auth: JWT + Passport

### Project Structure
```
workspace/backend/
├── src/
│   ├── auth/          # Authentication module
│   ├── users/         # User management
│   ├── [domain]/      # Domain modules
│   └── common/        # Shared utilities
```

## Database Schema

### Entities
```
User
├── id: UUID (PK)
├── email: VARCHAR(255) UNIQUE
├── password_hash: VARCHAR(255)
├── profile: JSON
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

[OtherEntity]
├── ...
```

### Migrations
| Migration | Description | Status |
|-----------|-------------|--------|
| 001_create_users | Users table | Applied |
| 002_create_sessions | Sessions table | Applied |

## API Endpoints

### Auth Module
| Method | Path | Description | Auth | Status |
|--------|------|-------------|------|--------|
| POST | /api/auth/register | User registration | No | Done |
| POST | /api/auth/login | User login | No | Done |
| POST | /api/auth/refresh | Token refresh | Yes | Done |
| POST | /api/auth/logout | User logout | Yes | Done |

### Users Module
| Method | Path | Description | Auth | Status |
|--------|------|-------------|------|--------|
| GET | /api/users/me | Get profile | Yes | Done |
| PATCH | /api/users/me | Update profile | Yes | Done |

## Service Architecture

### Dependencies
```
AuthController → AuthService → UserRepository
                            → JwtService
                            → HashService
```

### External Integrations
- Email: SendGrid (configured)
- Storage: S3 (configured)
- Cache: Redis (configured)

## Security

### Implemented
- [x] Password hashing (bcrypt)
- [x] JWT with refresh tokens
- [x] Rate limiting
- [x] Input validation (class-validator)
- [x] CORS configuration

### Pending
- [ ] 2FA support
- [ ] API key authentication
```

---

#### 7. `domains/mobile.md` - Mobile Context (Optional)

**Purpose**: Mobile app context (created only for mobile projects)
**Owner**: mobile-react-native
**Update Frequency**: During mobile work

```markdown
# Mobile Domain Context

## Architecture

### Tech Stack
- Framework: React Native 0.82 (New Architecture)
- Navigation: React Navigation 7
- State: Zustand + React Query
- Build: EAS Build

## Screens

| Screen | Path | Platform | Status |
|--------|------|----------|--------|
| Login | screens/auth/Login.tsx | Both | Done |
| Home | screens/home/Home.tsx | Both | Done |
| Profile | screens/profile/Profile.tsx | Both | Pending |

## Native Modules

| Module | Purpose | iOS | Android |
|--------|---------|-----|---------|
| Biometrics | Face ID / Fingerprint | Yes | Yes |
| Camera | Photo capture | Yes | Yes |

## Performance

| Metric | Target | Current |
|--------|--------|---------|
| Cold Start | <3s | 2.1s |
| Warm Start | <1s | 0.4s |
| FPS | 60 | 60 |
| Memory | <150MB | 120MB |

## Platform-Specific

### iOS
- Deployment Target: iOS 15+
- Capabilities: Push, Keychain, Camera

### Android
- minSdk: 24 (Android 7.0)
- Permissions: Camera, Storage, Biometric
```

---

#### 8. `domains/system.md` - System Context (Optional)

**Purpose**: AI/ML, GPU, specialized system context
**Owner**: systemdev-specialist
**Update Frequency**: During system work

```markdown
# System Domain Context

## Architecture

### Tech Stack
- ML Framework: TensorFlow 2.15
- GPU: CUDA 12.x
- Serving: TensorFlow Serving
- Processing: FFmpeg, OpenCV

## Model Architecture

### Primary Model
- Type: Classification CNN
- Input: 224x224x3 images
- Output: 10 classes
- Accuracy: 94.2% (val)

### Model Files
| File | Size | Version |
|------|------|---------|
| model.h5 | 45MB | 1.2.0 |
| model.tflite | 12MB | 1.2.0 |

## Performance

| Metric | Target | Current |
|--------|--------|---------|
| Inference (p95) | <100ms | 85ms |
| Throughput | 100 req/s | 120 req/s |
| GPU Utilization | >70% | 78% |
| Memory | <8GB | 6.2GB |

## Data Pipeline

```
Input → Preprocessing → Model → Postprocessing → Output
         (OpenCV)       (TF)      (NumPy)
```

## GPU Configuration

- Device: NVIDIA RTX 4090
- CUDA: 12.2
- cuDNN: 8.9
- Memory: 24GB (6.2GB used)
```

---

#### 9. `ops/quality.json` - Quality Metrics

**Purpose**: Quality standards and current metrics
**Owner**: quality-controller
**Update Frequency**: After each quality check

```json
{
  "schema_version": "2.0",
  "updated_at": "ISO8601",
  "standards": {
    "profile": "strict",
    "test_coverage": { "target": 80, "minimum": 70 },
    "type_coverage": { "target": 95, "minimum": 85 },
    "lint_score": { "target": 100, "minimum": 95 },
    "security": { "max_critical": 0, "max_high": 0 }
  },
  "current": {
    "frontend": {
      "test_coverage": 78,
      "type_errors": 0,
      "lint_errors": 0,
      "lint_warnings": 3,
      "accessibility_score": 95,
      "lighthouse": { "performance": 92, "accessibility": 98, "seo": 95 }
    },
    "backend": {
      "test_coverage": 85,
      "type_errors": 0,
      "lint_errors": 0,
      "security_vulnerabilities": { "critical": 0, "high": 0, "medium": 2 }
    },
    "mobile": {
      "test_coverage": 72,
      "type_errors": 0,
      "performance": { "cold_start_ms": 2100, "fps": 60 }
    }
  },
  "history": [
    {
      "date": "2025-01-15",
      "frontend_coverage": 78,
      "backend_coverage": 85,
      "security_issues": 2
    }
  ],
  "gates": {
    "pre_commit": { "status": "passing", "last_run": "ISO8601" },
    "pre_deploy": { "status": "passing", "last_run": "ISO8601" }
  }
}
```

---

#### 10. `ops/releases.md` - Release Management

**Purpose**: Version history and release planning
**Owner**: pm-orchestrator
**Update Frequency**: On releases and planning

```markdown
# Release Management

## Current Version

**v1.2.0** (2025-01-10)

## Version History

### v1.2.0 (2025-01-10) - MINOR
**Features**:
- Added user profile editing
- Implemented dark mode toggle
- Added export functionality

**Fixes**:
- Fixed login timeout issue (#123)
- Resolved memory leak in dashboard (#125)

**Performance**:
- Improved API response time by 20%

---

### v1.1.0 (2025-01-03) - MINOR
**Features**:
- User dashboard
- Basic analytics

---

### v1.0.0 (2024-12-20) - MAJOR (Initial Release)
**Features**:
- Core authentication
- User management
- Basic CRUD operations

---

## Release Plan

### v1.3.0 (Target: 2025-01-25)
**Planned Features**:
- [ ] Team collaboration (#45)
- [ ] Real-time notifications (#52)
- [ ] API rate limiting (#58)

**Progress**: 35%

### v1.4.0 (Target: 2025-02-10)
**Planned Features**:
- [ ] Advanced analytics
- [ ] Export to PDF
- [ ] Webhook integrations

---

## CI/CD Metrics

| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Deployments | 5 | 4 | +25% |
| Success Rate | 100% | 95% | +5% |
| Avg Deploy Time | 4m 30s | 5m 10s | -13% |
| Rollbacks | 0 | 1 | -100% |

## Technical Debt

### High Priority
- [ ] Refactor auth service (complexity)
- [ ] Upgrade TypeORM to v0.4

### Medium Priority
- [ ] Add more unit tests for UserService
- [ ] Optimize N+1 queries in dashboard

### Low Priority
- [ ] Clean up deprecated API endpoints
- [ ] Update documentation
```

---

## Migration from V1 to V2

### Mapping Table

| V1 File | V2 Location | Notes |
|---------|-------------|-------|
| active-context.md | core/state.json + core/journal.md | Split dynamic/log |
| decisions.md | core/decisions.md | Keep as-is |
| project-state.json | core/project.json + core/state.json | Split static/dynamic |
| session-history.json | core/state.json (session) | Consolidated |
| collaboration.log.md | core/journal.md | Merged |
| artifacts.manifest.json | core/state.json | Consolidated |
| ui-components.md | domains/frontend.md | Merged |
| api-endpoints.md | domains/backend.md | Merged |
| user-flows.md | domains/frontend.md | Merged |
| database-schema.md | domains/backend.md | Merged |
| service-architecture.md | domains/backend.md | Merged |
| model-architecture.md | domains/system.md | Merged |
| test-coverage.md | ops/quality.json | Structured |
| quality-metrics.md | ops/quality.json | Structured |
| version-history.md | ops/releases.md | Merged |
| release-plan.md | ops/releases.md | Merged |
| technical-debt.md | ops/releases.md | Merged |
| ci-cd-metrics.md | ops/releases.md | Merged |
| production-metrics.md | core/state.json + ops/quality.json | Split |
| user-feedback.md | ops/releases.md (backlog) | Merged |
| incident-log.md | core/journal.md + ops/releases.md | Split |

### Migration Script

```bash
#!/bin/bash
# migrate-memory-v1-to-v2.sh

MEMORY_DIR=".memory"

# Create V2 directory structure
mkdir -p "$MEMORY_DIR/core"
mkdir -p "$MEMORY_DIR/domains"
mkdir -p "$MEMORY_DIR/ops"
mkdir -p "$MEMORY_DIR/.archive"

# Archive V1 files
ARCHIVE_DATE=$(date +%Y%m%d)
mkdir -p "$MEMORY_DIR/.archive/v1-$ARCHIVE_DATE"
mv "$MEMORY_DIR"/*.md "$MEMORY_DIR/.archive/v1-$ARCHIVE_DATE/" 2>/dev/null || true
mv "$MEMORY_DIR"/*.json "$MEMORY_DIR/.archive/v1-$ARCHIVE_DATE/" 2>/dev/null || true

# Initialize V2 core files
echo '{"schema_version":"2.0"}' > "$MEMORY_DIR/core/project.json"
echo '{"schema_version":"2.0","updated_at":"'$(date -Iseconds)'"}' > "$MEMORY_DIR/core/state.json"
echo "# Decision Journal\n\n> Migrated from V1 on $(date)" > "$MEMORY_DIR/core/decisions.md"
echo "# Activity Journal\n\n> Migrated from V1 on $(date)" > "$MEMORY_DIR/core/journal.md"

echo "Migration complete. V1 files archived to $MEMORY_DIR/.archive/v1-$ARCHIVE_DATE/"
```

## Benefits of V2

| Aspect | V1 (40+ files) | V2 (10 files) | Improvement |
|--------|----------------|---------------|-------------|
| File Count | 40+ | 10 | -75% |
| Conflict Risk | High (multi-writer) | Low (clear ownership) | Significantly reduced |
| Query Time | Search many files | Predictable locations | Faster |
| Cognitive Load | High | Low | Easier to understand |
| Disk I/O | Many small files | Fewer larger files | More efficient |

## Backward Compatibility

V2 memory-manager will:
1. Auto-detect V1 structure on session start
2. Offer to migrate or continue with V1
3. Support both structures during transition period
4. Log migration status in journal
