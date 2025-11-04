---
name: devops-deployment
description: "Docker containerization, cloud deployment, CI/CD automation, and infrastructure management. Use when: containerizing applications, setting up Docker configurations, deploying to cloud platforms, configuring CI/CD pipelines, managing infrastructure, setting up monitoring. Ensures production-ready deployment."
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

## Cloud Deployment Options

- **Vercel**: Next.js frontend (preferred for web apps)
- **Railway**: Full-stack applications, databases
- **Heroku**: Traditional application hosting
- **AWS**: Enterprise-scale infrastructure
- **Supabase**: Database and backend services

## Related Skills

- **fullstack-integration**: Deployment architecture
- **qa-testing**: Pre-deployment validation
- **quality-controller**: Production readiness checks
- **backend-nestjs**: Backend deployment
- **backend-fastapi**: Python backend deployment
- **frontend-nextjs**: Frontend deployment (web)
- **mobile-react-native**: Mobile deployment (EAS Build, app stores)

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
