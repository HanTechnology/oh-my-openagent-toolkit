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
- **frontend-nextjs**: Frontend deployment

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
