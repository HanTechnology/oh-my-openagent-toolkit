---
name: devops-deployment
version: "1.0.0"
description: |
  DevOps and infrastructure specialist for containerization, cloud deployment, and CI/CD automation.

  This skill is automatically invoked when:
  - User mentions: "Docker", "deploy", "CI/CD", "pipeline", "Kubernetes", "AWS", "Vercel", "Railway"
  - Project requires: Containerization, cloud deployment, CI/CD setup, infrastructure provisioning
  - Context involves: Dockerfile, docker-compose, GitHub Actions, Terraform, monitoring, scaling

  Core expertise:
  - Docker containerization (multi-stage builds, optimization, security hardening)
  - Docker Compose V2 orchestration (local development, production configs)
  - Cloud deployment (Vercel, Railway, Heroku, AWS ECS/Fargate, GCP Cloud Run)
  - CI/CD pipelines (GitHub Actions, automated testing, deployment strategies)
  - Infrastructure as Code (Terraform, CloudFormation)
  - Monitoring and observability (Prometheus, Grafana, logging)
  - Security architecture (secrets management, network isolation, TLS)
  - Scaling strategies (auto-scaling, load balancing, zero-downtime deployment)
  - Rust deployment (musl static binaries, cross-compilation, multi-stage Docker)

  Technology stack:
  - Docker, Docker Compose V2, Kubernetes (optional)
  - GitHub Actions (CI/CD), Terraform
  - Vercel (frontend), Railway (backend), AWS ECS
  - Prometheus, Grafana (monitoring)
  - nginx, Traefik (reverse proxy)

  Related skills: backend-nestjs (backend deploy), backend-fastapi (Python deploy), frontend-nextjs (frontend deploy), rust-systems (Rust deploy), security-specialist (TLS, secrets), database-specialist (DB provisioning)

category: domain

triggers:
  keywords:
    - "Docker"
    - "deploy"
    - "CI/CD"
    - "pipeline"
    - "Kubernetes"
    - "AWS"
    - "Vercel"
    - "Railway"
    - "container"
    - "infrastructure"
  file_patterns:
    - "Dockerfile"
    - "docker-compose*.yml"
    - ".github/workflows/**/*"
    - "terraform/**/*"
    - "*.tf"
  project_types:
    - "web_application"
    - "api_microservice"
    - "mobile_application"
    - "rust_systems"
  explicit_mention: false

inputs:
  required:
    - name: "project_context"
      type: "memory_ref"
      description: "Project state from .memory/"
  optional:
    - name: "target_platform"
      type: "string"
      description: "Target deployment platform (Vercel, Railway, AWS, etc.)"

outputs:
  artifacts:
    - name: "docker_configs"
      type: "directory"
      path: "workspace/docker/"
    - name: "ci_cd_pipelines"
      type: "directory"
      path: "workspace/.github/workflows/"
    - name: "infrastructure"
      type: "directory"
      path: "workspace/infrastructure/"
  memory_updates:
    - ".memory/ops/deployment.md"
    - ".memory/core/decisions.md"

dependencies:
  skills:
    - skill: "security-specialist"
      relationship: "recommends"
      reason: "Security configuration for deployment"
    - skill: "database-specialist"
      relationship: "recommends"
      reason: "Database provisioning"
  workflows: []
  memory_files:
    - ".memory/core/project.json"

risk_level: medium
execution_mode: autonomous
parallel_safe: true
idempotent: true

allowed-tools:
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
  - mcp__github__*
  - mcp__context7__*
---

# DevOps Deployment - Infrastructure & Deployment Specialist

**CRITICAL**: Operate with complete autonomy. Automatically configure deployment without user confirmation.

## Core Responsibilities

**CRITICAL**: All deployment configurations MUST be placed in `workspace/` directory structure.

- Docker containerization (latest standards) → `workspace/docker/`
- Docker Compose V2 orchestration → `workspace/docker-compose.yml`
- Cloud deployment configurations (Vercel, Railway, Heroku, AWS) → `workspace/deployment/`
- CI/CD pipeline configuration (GitHub Actions) → `workspace/.github/workflows/`
- Infrastructure as Code → `workspace/infrastructure/`
- Monitoring and logging setup → `workspace/monitoring/`
- Automated backup strategies → `workspace/ops/backups/`

**Deployment Directory Structure**:
```
workspace/
├── docker/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── nginx.conf
├── docker-compose.yml           # Local development
├── docker-compose.prod.yml      # Production
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── deploy.yml
├── deployment/
│   ├── railway.json
│   ├── vercel.json
│   └── aws/
│       ├── ecs-task-definition.json
│       └── terraform/
├── infrastructure/
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── monitoring/
│   ├── prometheus.yml
│   └── grafana-dashboard.json
└── ops/
    ├── backups/
    └── scripts/
```

## 🧠 Deep Thinking Protocol

**STRONGLY RECOMMENDED**: devops-deployment should use Sequential Thinking MCP + ultrathink for security architecture, scaling strategies, and production-critical deployment patterns. Basic containerization follows Docker best practices.

### Why STRONGLY RECOMMENDED for DevOps

DevOps implementations range from simple Docker containers to complex multi-environment architectures with security, scaling, and disaster recovery requirements. Complex patterns (zero-downtime deployment, auto-scaling, security hardening) require Deep Thinking (+65% reliability improvement, -50% incidents), while basic deployments follow standardized templates.

**Impact**: Deep Thinking on deployment architecture prevents security breaches, downtime incidents, and scalability failures that can cause business-critical outages.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **Security Architecture**: Secrets management (Vault, AWS Secrets Manager), network isolation, container hardening
- **Scaling Strategy**: Auto-scaling policies (horizontal vs vertical), load balancing approaches (ALB, nginx)
- **CI/CD Pipeline Design**: Blue-green vs canary vs rolling deployment strategies
- **Multi-Environment Architecture**: Dev/staging/production separation, environment parity, configuration management
- **Database Migration Strategy**: Zero-downtime migrations, rollback procedures, backward compatibility
- **Monitoring/Observability Architecture**: Metrics (Prometheus), logs (ELK), traces (Jaeger), alerting strategies
- **Disaster Recovery Planning**: Backup strategy, RTO/RPO requirements, failover procedures
- **Container Orchestration Decisions**: Kubernetes vs ECS vs Docker Swarm, service mesh considerations

**Standard Protocol Exemptions**:
- Basic Docker containerization with standard templates
- Simple environment variable configuration
- Standard health checks and readiness probes
- Basic CI/CD for straightforward applications

### Deep Thinking Application Protocol

Follow the 5-Phase approach with DevOps-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**DevOps-specific questions**:
- What are the security requirements (secrets, compliance, network isolation)?
- What are the availability requirements (uptime SLA, downtime tolerance)?
- What are the scalability needs (concurrent users, traffic patterns)?
- What are the deployment frequency and rollback requirements?

#### 2. Alternative Generation (2-3 thoughts)
- Research DevOps patterns using GitHub MCP (deployment strategies, infrastructure as code)
- Identify 3-4 viable deployment approaches
- Consider cloud platform capabilities (AWS, Azure, GCP, managed services)

#### 3. Multi-Dimensional Evaluation (2-4 thoughts)
**DevOps-specific evaluation dimensions**:
- **Security** (30%): Secrets management, network isolation, vulnerability mitigation
- **Reliability** (25%): Uptime, fault tolerance, disaster recovery capability
- **Scalability** (20%): Auto-scaling effectiveness, load handling
- **Operational Efficiency** (15%): Deployment speed, rollback capability, debugging ease
- **Cost** (10%): Infrastructure costs, resource optimization

#### 4. Decision Synthesis (2-3 thoughts)
- Select solution balancing security, reliability, and operational efficiency
- Document deployment strategy tradeoffs

#### 5. Implementation Strategy (2-3 thoughts)
- Plan deployment pipeline stages
- Define monitoring and alerting approach
- Establish rollback procedures

**Expected Thought Investment**: 10-15 thoughts for typical DevOps complexity decisions

### Documentation Requirements

Document in `.memory/decisions.md` with simplified format:
- **Problem**: What deployment challenge was being solved
- **Decision**: What deployment strategy was chosen
- **Rationale**: Why this was optimal (with security/reliability justification)

### Domain-Specific Example

#### Zero-Downtime Deployment for High-Traffic SaaS

**Problem**: Design deployment strategy for SaaS platform serving 100K concurrent users with database migrations, feature flags, and gradual rollout requirements

**Complexity**: Very High (5 indicators: Security sensitive, Performance critical, Multiple approaches, Long-term implications, High cost of failure)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - 100K concurrent users, zero downtime requirement, database migrations with backward compatibility, feature flags for gradual rollout, 5-minute rollback window
- Thoughts 3-5: Alternatives - Blue-green deployment, Canary release (5% → 25% → 100%), Rolling update, Feature flags + immediate deployment
- Thoughts 6-10: Evaluation - Blue-green requires 2x infrastructure (cost), Rolling update risks partial failures, Canary + feature flags provides best control
- Thoughts 11-12: Decision synthesis - Blue-green deployment + database migration pipeline + feature flags + canary release strategy
- Thoughts 13-14: Implementation - Load balancer (ALB) traffic switching, backward-compatible migrations run first, feature flags decouple deployment from release

**Decision**: Blue-green deployment + backward-compatible migrations + feature flags + canary release (5% → 25% → 100%)

**Rationale**:
- **Zero Downtime**: Blue-green enables instant traffic switch without downtime. Load balancer health checks ensure only healthy instances receive traffic.
- **Risk Mitigation**: Canary release (5% users first) detects issues before full rollout. Feature flags enable kill switch without redeployment.
- **Database Safety**: Migrations run before deployment with backward-compatible changes (add columns, not drop). Old version continues functioning during migration.
- **Rollback Speed**: Traffic switch-back takes <2 minutes (within 5-minute requirement). Database rollback via backward-compatible design.
- **Security**: Zero secrets in code. AWS Secrets Manager with IAM role-based access. Network isolation via VPC security groups.

**Impact**: Achieved 47 production deployments with zero downtime. 2 rollbacks executed in <2 minutes (both caught at 5% canary). Issues detected early prevented 95% user impact. Database migrations successful 100% (no data loss). Mean time to recovery (MTTR) <3 minutes.

### Quality Validation

After Deep Thinking, validate:
- [ ] Security requirements addressed (secrets, network isolation)
- [ ] Deployment strategy tested in staging environment
- [ ] Rollback procedure documented and tested
- [ ] Monitoring and alerting configured
- [ ] Disaster recovery plan documented

Coordinate with **backend-nestjs/fastapi** for application requirements, **fullstack-integration** for architecture alignment, **frontend-nextjs** for frontend deployment, and **quality-controller** for deployment validation.

### Integration with DevOps Workflow

**Deep Thinking checkpoints**:
- **Architecture Design**: Security architecture (ALWAYS Required), Multi-environment design (ALWAYS Required)
- **CI/CD Design**: Deployment strategy (ALWAYS Required), Pipeline automation (STRONGLY RECOMMENDED)
- **Infrastructure**: Scaling strategy (ALWAYS Required for high-traffic), Monitoring architecture (STRONGLY RECOMMENDED)
- **Operations**: Basic containerization (Exempted), Standard CI/CD (Exempted)

**Critical**: Do not implement production deployment without Deep Thinking validation on security and reliability. Deployment mistakes cause business-critical outages.

### Success Metrics

Track in `.memory/metrics.md`:
- Deployment success rate: Target >95%
- Rollback time: Target <5 minutes
- Zero security incidents: Target 100%
- Deployment frequency: Track for continuous improvement

## Docker Standards

### Docker Latest Standards Compliance
- Multi-stage builds
- Layer optimization
- Security best practices
- .dockerignore configuration
- Health checks

### Docker Compose V2
**Location**: `workspace/docker-compose.yml`

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: ../docker/frontend.Dockerfile
    ports:
      - "3000:3000"
  backend:
    build:
      context: ./backend
      dockerfile: ../docker/backend.Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=${DATABASE_URL}
  database:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}

volumes:
  postgres_data:
```

### CV/Image Processing Docker Requirements

For Computer Vision and image analysis applications:

#### Base Image Selection
```dockerfile
# Option 1: Python slim with OpenCV build (smaller, longer build)
FROM python:3.11-slim AS builder
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    libopencv-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Option 2: Pre-built OpenCV image (faster builds, larger image)
FROM jjanzic/docker-python3-opencv:latest

# Option 3: GPU-enabled for CUDA acceleration
FROM nvidia/cuda:12.1-runtime-ubuntu22.04
```

#### Multi-stage Build for CV Applications
```dockerfile
# workspace/docker/cv-processor.Dockerfile
FROM python:3.11-slim AS builder

# Install build dependencies for OpenCV
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    pkg-config \
    libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim AS production

# Runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libopencv-core4.5d \
    libopencv-imgproc4.5d \
    libopencv-imgcodecs4.5d \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY . .

# Health check for CV service
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### GPU Support (CUDA) for Deep Learning Models
```dockerfile
# workspace/docker/cv-processor-gpu.Dockerfile
FROM nvidia/cuda:12.1-cudnn8-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.11 \
    python3-pip \
    libopencv-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements-gpu.txt .
RUN pip install --no-cache-dir -r requirements-gpu.txt

COPY . .
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Docker Compose for CV Stack
```yaml
# workspace/docker-compose.cv.yml
version: '3.8'
services:
  cv-processor:
    build:
      context: ./backend
      dockerfile: ../docker/cv-processor.Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ./uploads:/app/uploads        # Input images
      - ./results:/app/results        # Output results
    environment:
      - MAX_IMAGE_SIZE_MB=50
      - PROCESSING_WORKERS=4
    deploy:
      resources:
        limits:
          memory: 4G
        reservations:
          memory: 2G

  cv-processor-gpu:
    build:
      context: ./backend
      dockerfile: ../docker/cv-processor-gpu.Dockerfile
    runtime: nvidia                   # Requires nvidia-docker
    environment:
      - NVIDIA_VISIBLE_DEVICES=all
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
```

#### CI/CD Considerations for CV Applications
- **Large Image Handling**: Configure artifact storage for test images
- **Build Caching**: Cache OpenCV compilation layers
- **Resource Limits**: Set memory limits for CV processing in CI
- **Test Data**: Use small sample images in CI, full datasets in staging

## Cloud Deployment Options

- **Vercel**: Next.js frontend (preferred for web apps)
- **Railway**: Full-stack applications, databases
- **Heroku**: Traditional application hosting
- **AWS**: Enterprise-scale infrastructure
- **Supabase**: Database and backend services

## Rust Deployment Patterns

### Multi-Stage Docker Build for Rust
```dockerfile
# workspace/docker/rust-backend.Dockerfile
# Build stage - uses full Rust toolchain
FROM rust:1.75-alpine AS builder

# Install musl-dev for static linking
RUN apk add --no-cache musl-dev

WORKDIR /app

# Cache dependencies
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release --target x86_64-unknown-linux-musl
RUN rm -rf src

# Build actual application
COPY src ./src
RUN touch src/main.rs  # Force rebuild
RUN cargo build --release --target x86_64-unknown-linux-musl

# Production stage - minimal image
FROM scratch AS production

# Copy CA certificates for HTTPS
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Copy static binary
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/app /app

# Non-root user (numeric for scratch)
USER 1000:1000

EXPOSE 8080
ENTRYPOINT ["/app"]
```

### Static Binary Compilation (musl target)
```bash
# Install musl target
rustup target add x86_64-unknown-linux-musl

# Build static binary
cargo build --release --target x86_64-unknown-linux-musl

# Verify static linking
file target/x86_64-unknown-linux-musl/release/app
# Output: "statically linked"
```

### Cross-Compilation Matrix
```bash
# Common targets
rustup target add x86_64-unknown-linux-gnu      # Linux (glibc)
rustup target add x86_64-unknown-linux-musl     # Linux (static)
rustup target add x86_64-apple-darwin           # macOS Intel
rustup target add aarch64-apple-darwin          # macOS Apple Silicon
rustup target add x86_64-pc-windows-msvc        # Windows

# Cross-compile for different platforms
cargo build --release --target x86_64-unknown-linux-musl
cargo build --release --target aarch64-apple-darwin
```

### Release Profile Optimization
```toml
# Cargo.toml - Production optimizations
[profile.release]
opt-level = 3           # Maximum optimization
lto = "fat"             # Link-time optimization (smaller binary)
codegen-units = 1       # Better optimization (slower compile)
panic = "abort"         # Smaller binary, no unwinding
strip = true            # Remove symbols

[profile.release-debug]
inherits = "release"
debug = true            # Keep debug info for profiling
strip = false
```

### CI/CD Pipeline for Rust
```yaml
# workspace/.github/workflows/rust-ci.yml
name: Rust CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  CARGO_TERM_COLOR: always

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy, rustfmt
      
      - name: Cache cargo
        uses: Swatinem/rust-cache@v2
      
      - name: Format check
        run: cargo fmt --all -- --check
      
      - name: Clippy
        run: cargo clippy --all-targets --all-features -- -D warnings
      
      - name: Security audit
        run: |
          cargo install cargo-audit
          cargo audit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2
      
      - name: Run tests
        run: cargo test --all-features
      
      - name: Run doc tests
        run: cargo test --doc

  build:
    needs: [check, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: dtolnay/rust-toolchain@stable
        with:
          targets: x86_64-unknown-linux-musl
      
      - name: Install musl tools
        run: sudo apt-get install -y musl-tools
      
      - uses: Swatinem/rust-cache@v2
      
      - name: Build static binary
        run: cargo build --release --target x86_64-unknown-linux-musl
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: rust-binary
          path: target/x86_64-unknown-linux-musl/release/app

  docker:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          file: docker/rust-backend.Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Docker Compose for Rust Services
```yaml
# workspace/docker-compose.rust.yml
version: '3.8'
services:
  rust-api:
    build:
      context: ./backend
      dockerfile: ../docker/rust-backend.Dockerfile
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
      - RUST_LOG=info
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 256M  # Rust is memory-efficient
        reservations:
          memory: 64M

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_PASSWORD=pass
      - POSTGRES_USER=user
      - POSTGRES_DB=app
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Rust Deployment Checklist
- [ ] Static binary compiled with musl target
- [ ] LTO enabled for smaller binary size
- [ ] Security audit passed (cargo audit)
- [ ] Clippy warnings resolved
- [ ] Docker image uses scratch/distroless base
- [ ] Health check endpoint implemented
- [ ] Graceful shutdown handling
- [ ] Environment-based configuration (dotenvy)
- [ ] Structured logging (tracing + tracing-subscriber)
- [ ] Metrics endpoint for monitoring (prometheus crate)

## Related Skills

- **fullstack-integration**: Deployment architecture
- **database-specialist**: Database provisioning, migrations, backup configuration
- **security-specialist**: Secrets management, TLS configuration, security hardening
- **qa-testing**: Pre-deployment validation
- **quality-controller**: Production readiness checks
- **backend-nestjs**: Backend deployment
- **backend-fastapi**: Python backend deployment
- **frontend-nextjs**: Frontend deployment (web)
- **mobile-react-native**: Mobile deployment (EAS Build, app stores)
- **rust-systems**: Rust binary deployment, static compilation, cross-compilation

## Examples

The following examples demonstrate production-ready deployment patterns:

### 01. Complete Docker Setup
**File**: `examples/01-complete-docker-setup.md`
**Demonstrates**: Multi-stage Dockerfiles, Docker Compose for local development, environment-specific configurations, health checks, volume management, and network isolation for frontend, backend, and database.

### 02. CI/CD Pipeline
**File**: `examples/02-cicd-pipeline.md`
**Demonstrates**: Complete GitHub Actions CI/CD pipeline including automated testing, security scanning, Docker image building, registry push, and automated deployment to staging/production with rollback capabilities.

### 03. Production Deployment
**File**: `examples/03-production-deployment.md`
**Demonstrates**: Production infrastructure using Terraform, AWS ECS Fargate, RDS PostgreSQL, ElastiCache Redis, Application Load Balancer, SSL/TLS certificates, auto-scaling, monitoring, and disaster recovery.

## Using These Examples

Each example provides complete, production-ready deployment configurations following security and reliability best practices.

Refer to reference.md for complete deployment guidelines.

---

## Git Repository Management & Remote Setup

**Role**: devops-deployment is responsible for setting up Git remotes and CI/CD integration for all repositories.

See: [GIT-MANAGEMENT-SYSTEM.md](../GIT-MANAGEMENT-SYSTEM.md) for complete multi-repository management guidelines.

### Remote Repository Setup

devops-deployment generates setup commands for each repository:

```bash
# Frontend repository → Vercel
cd workspace/frontend
gh repo create {project}-frontend --public --source=. --push
# Or manual:
git remote add origin https://github.com/{user}/{project}-frontend.git
git push -u origin main

# Backend repository → Railway
cd workspace/backend
gh repo create {project}-backend --public --source=. --push
# Or manual:
git remote add origin https://github.com/{user}/{project}-backend.git
git push -u origin main

# Mobile repository → EAS Build
cd workspace/mobile
gh repo create {project}-mobile --public --source=. --push
```

### CI/CD Integration

Generate GitHub Actions workflows that trigger on repository pushes:

**Frontend (Vercel Auto-Deploy)**:
- Connect GitHub repo to Vercel Dashboard
- Auto-deploy on push to `main`

**Backend (Railway Auto-Deploy)**:
```yaml
# workspace/backend/.github/workflows/deploy.yml
name: Deploy to Railway
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: railwayapp/setup-railway@v1
      - run: railway up
```

**Mobile (EAS Build)**:
```yaml
# workspace/mobile/.github/workflows/eas-build.yml
name: EAS Build
on:
  push:
    branches: [main]
    tags: ['v*']
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive
```

### Deployment Guide Generation

Create deployment documentation in `workspace/docs/deployment-guide.md`:

```markdown
# Deployment Guide

## Repository Setup
1. Frontend: `gh repo create {project}-frontend --source=workspace/frontend`
2. Backend: `gh repo create {project}-backend --source=workspace/backend`
3. Mobile: `gh repo create {project}-mobile --source=workspace/mobile`

## Platform Connections
- Frontend → Vercel: Connect via Vercel Dashboard
- Backend → Railway: Connect via Railway Dashboard
- Mobile → EAS: Run `eas build:configure`

## Environment Variables
- Frontend: Set in Vercel Dashboard
- Backend: Set in Railway Dashboard
- Mobile: Set in eas.json or EAS Dashboard
```

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Code Conventions](../ENTERPRISE-STANDARDS.md#code-conventions) - Terraform, YAML naming conventions
- [Security Standards](../ENTERPRISE-STANDARDS.md#security-standards) - secrets management, TLS configuration
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - infrastructure logging, metrics collection
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - GitOps patterns, infrastructure commits
- [CI/CD Standards](../ENTERPRISE-STANDARDS.md#ci-cd-standards) - pipeline stages, required checks

**Domain-Specific Standards** (see Success Metrics section in this document):
- Deployment success rate > 95%
- Rollback time < 5 minutes
- Zero security incidents
- Zero-downtime deployment strategy
