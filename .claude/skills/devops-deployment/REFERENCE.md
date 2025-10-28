# DevOps Deployment - Technical Reference

> **Purpose**: Technical reference for the devops-deployment skill in the autonomous skills-based development system.
> **Related Skills**: fullstack-integration, backend-nestjs, backend-fastapi, frontend-nextjs, qa-testing, research-analysis, mcp-tools-orchestrator
> **Examples**: See examples/ directory for production-ready deployment patterns.

---

## DevOps Deployment Skill Guidelines

### Core Responsibilities

**CRITICAL**: Operate with complete autonomy for deployment and infrastructure

**Deployment and Infrastructure Management**
- **Docker Containerization**: Complete container setup for all services
- **CI/CD Automation**: Automated build, test, and deployment pipelines
- **Cloud Deployment**: Platform selection and infrastructure configuration
- **Environment Management**: Configuration, secrets, and environment variables
- **Monitoring and Logging**: Application and infrastructure observability
- **Database Operations**: Migration, backup, and recovery automation
- **Performance Optimization**: Infrastructure scaling and resource management

**Technology Leadership**
- Infrastructure architecture and container orchestration
- Deployment strategy and rollback procedures
- Security best practices and compliance
- Cost optimization and resource allocation
- High availability and disaster recovery planning

### Ultimate Goals
- **Production-ready deployment** with complete automation
- **Zero user confirmations required** for deployment decisions
- Seamless integration with fullstack development workflow

---

## Production Examples

This skill provides comprehensive deployment patterns in the `examples/` directory:

### Available Examples

#### 01. Complete Docker Setup (`examples/01-complete-docker-setup.md`)
- **Demonstrates**: Full containerization of Next.js frontend, NestJS backend, and PostgreSQL
- **Key Patterns**: Multi-stage builds, Docker Compose, volume management, networking
- **Integration**: Frontend → Backend → Database with proper container linking
- **Technologies**: Docker latest, Docker Compose V2, multi-stage builds, health checks
- **Use when**: Setting up complete local or production containerized environment

#### 02. CI/CD Pipeline (`examples/02-cicd-pipeline.md`)
- **Demonstrates**: Automated GitHub Actions workflows for build, test, and deploy
- **Key Patterns**: Matrix testing, Docker build caching, automated deployment, rollback
- **Integration**: Git push → CI tests → Docker build → Deployment → Health check
- **Technologies**: GitHub Actions, Docker Hub, environment-based deployment
- **Use when**: Automating deployment pipeline from code to production

#### 03. Production Deployment (`examples/03-production-deployment.md`)
- **Demonstrates**: Complete production infrastructure on cloud platforms
- **Key Patterns**: Railway, Heroku, AWS deployment, SSL, CDN, monitoring, backups
- **Integration**: Docker images → Cloud platform → Database → CDN → Monitoring
- **Technologies**: Railway, Heroku, AWS ECS, CloudFlare, Sentry, database backups
- **Use when**: Deploying to production with full observability and reliability

### Using These Examples
- Examples provide production-ready deployment implementations
- Complete Docker, CI/CD, and cloud deployment patterns
- Cross-references with backend-nestjs, backend-fastapi, frontend-nextjs, and qa-testing
- Infrastructure as Code principles and automation best practices

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Docker configuration and container setup
- Cloud platform selection and deployment
- CI/CD pipeline design and implementation
- Database migration and backup strategies
- Monitoring and logging infrastructure
- Security configuration and SSL setup

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "deploy", "docker", "container", "CI/CD", "production", "infrastructure"
- Related skills mention: "devops-deployment skill" in their outputs
- Context matches: deployment, containerization, infrastructure setup, cloud deployment

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**fullstack-integration**:
- Environment configuration coordination
- CORS and security settings
- Database migration strategy
- Deployment orchestration across frontend and backend
- Monitoring and observability integration

**backend-nestjs** (TypeScript):
- Backend containerization and deployment
- Database connection and migration
- Environment variable management
- API health checks and monitoring
- Production configuration optimization

**backend-fastapi** (Python):
- FastAPI containerization with uvicorn
- Async database connections (asyncpg)
- Environment variable management with pydantic-settings
- Health check endpoints
- Docker exec-form CMD configuration (CRITICAL)

**frontend-nextjs**:
- Frontend containerization and deployment
- Static asset optimization and CDN setup
- Environment variable configuration
- Build optimization and caching
- Client-side error tracking

**qa-testing**:
- CI/CD test automation integration
- Production smoke tests and health checks
- Performance monitoring and alerts
- Deployment validation
- Rollback testing procedures

**research-analysis**:
- Cloud platform evaluation and selection
- Infrastructure cost analysis
- Deployment pattern research
- Monitoring tool evaluation
- Security best practices research

**mcp-tools-orchestrator**:
- GitHub MCP for repository and CI/CD automation
- Context7 MCP for deployment documentation
- Sequential Thinking MCP for infrastructure planning
- Multi-tool deployment orchestration

### Coordination Pattern
1. **Natural Language Mentions**: Mentioning skill names triggers automatic invocation
2. **Shared Memory System**: Infrastructure configuration stored in .memory/ directory
3. **Autonomous Invocation**: Claude automatically invokes skills with full context
4. **Zero User Confirmation**: All deployment operations autonomous

---

## Technology Stack

### Docker Containerization
```
- Docker: Latest version with modern standards
- Docker Compose: V2 specification (compose.yaml)
- Multi-stage Builds: Optimize image sizes
- Health Checks: All containers with health monitoring
- Volume Management: Persistent data and backups
- Networking: Custom bridge networks for service isolation
- Image Optimization: Layer caching, minimal base images
```

### CI/CD Automation
```
- GitHub Actions: Primary CI/CD platform
- Matrix Testing: Multiple Node.js versions, environments
- Docker Build Cache: Optimize build times
- Automated Testing: Unit, integration, E2E tests
- Automated Deployment: Push to production on merge
- Rollback Procedures: Automated rollback on failure
- Environment-based Workflows: Dev, staging, production
```

### Cloud Platforms
```
- Railway: Recommended for full-stack apps (auto-deploy)
- Heroku: Alternative for backend services
- Vercel: Frontend deployment (Next.js optimized)
- AWS ECS/Fargate: Enterprise containerized deployments
- Google Cloud Run: Serverless containers
- Digital Ocean App Platform: Simplified container hosting
```

### Database Management
```
- PostgreSQL: Primary database (containerized or managed)
- Database Migrations: Automated with TypeORM/Prisma
- Backup Automation: Daily backups with retention policy
- Replication: Read replicas for scaling
- Connection Pooling: PgBouncer for performance
```

### Monitoring and Observability
```
- Application Monitoring: Sentry, DataDog, New Relic
- Infrastructure Monitoring: Prometheus, Grafana
- Log Aggregation: Loki, CloudWatch, Papertrail
- Uptime Monitoring: UptimeRobot, Pingdom
- Performance Metrics: Response times, throughput, errors
- Cost Monitoring: Cloud billing alerts and optimization
```

---

## Deployment Implementation Approaches

### Docker Containerization Strategy

**Frontend Container (Next.js)**
- Multi-stage build: dependencies → build → production
- Node.js Alpine base image for minimal size
- Environment variables for runtime configuration
- Health check endpoint for monitoring
- Static asset optimization and caching
- CDN integration for global delivery

**Backend Container (NestJS)**
- Multi-stage build: dependencies → build → production
- Node.js Alpine base image
- Database migration on container start
- Health check endpoints for readiness and liveness
- Secrets management through environment variables
- Log streaming to stdout/stderr

**Database Container (PostgreSQL)**
- Official PostgreSQL image with version pinning
- Named volumes for data persistence
- Initialization scripts for schema setup
- Health checks for availability
- Connection pooling configuration
- Backup volume for automated backups

**Docker Compose Orchestration**
- Service dependency management (depends_on)
- Custom bridge network for inter-service communication
- Environment-specific configurations (dev, prod)
- Volume management for data persistence
- Port mapping and exposure
- Container restart policies

---

### CI/CD Pipeline Architecture

**GitHub Actions Workflows**

**Pull Request Workflow**:
1. Code checkout and dependency caching
2. Linting and type checking
3. Unit and integration tests
4. Docker build validation
5. Security vulnerability scanning
6. Code coverage reporting

**Main Branch Workflow**:
1. All PR checks
2. Docker image build with caching
3. Push to container registry (Docker Hub, AWS ECR)
4. Deploy to staging environment
5. Automated smoke tests
6. Deploy to production (on approval)
7. Health check validation
8. Rollback on failure

**Matrix Testing Strategy**:
- Node.js versions: 20.x, 22.x
- Environments: development, production
- Databases: PostgreSQL versions
- Browsers: Chrome, Firefox, Safari (for E2E)

**Build Optimization**:
- Layer caching for faster builds
- Dependency caching across workflows
- Parallel job execution
- Conditional workflow triggers

---

### Cloud Deployment Patterns

**Railway Deployment** (Recommended)
- Automatic deployment from GitHub
- Environment variable management
- Database provisioning (PostgreSQL)
- Custom domains and SSL certificates
- Horizontal scaling support
- Built-in monitoring and logs
- Zero-downtime deployments

**Heroku Deployment** (Alternative)
- Git-based deployment workflow
- Procfile for process definition
- Add-ons for database, Redis, monitoring
- Automatic SSL certificates
- Dyno scaling for load management
- Release phase for migrations

**AWS ECS/Fargate Deployment** (Enterprise)
- Container orchestration with ECS
- Serverless containers with Fargate
- Application Load Balancer for traffic distribution
- Auto-scaling based on metrics
- CloudWatch for logging and monitoring
- RDS for managed database
- S3 for static assets with CloudFront CDN

**Vercel Deployment** (Frontend)
- Automatic Next.js optimization
- Global CDN deployment
- Environment variables per environment
- Preview deployments for PRs
- Analytics and Web Vitals monitoring
- Edge functions for API routes

---

### Database Operations

**Migration Strategy**
- Version-controlled migrations (TypeORM/Prisma)
- Automated migration on deployment
- Rollback procedures for failed migrations
- Zero-downtime migration patterns
- Data validation after migration

**Backup and Recovery**
- Automated daily backups
- Backup retention policy (30 days)
- Point-in-time recovery capability
- Backup restoration testing
- Off-site backup storage

**Performance Optimization**
- Connection pooling (PgBouncer)
- Read replicas for scaling reads
- Database indexing strategy
- Query performance monitoring
- Cache layer (Redis) for frequent queries

---

### Monitoring and Alerting

**Application Monitoring**
- Error tracking and alerting (Sentry)
- Performance monitoring (response times, throughput)
- User session tracking
- Custom metrics and dashboards
- Log aggregation and search

**Infrastructure Monitoring**
- Container health and resource usage
- Database performance metrics
- Network latency and throughput
- Disk usage and I/O
- Memory and CPU utilization

**Alerting Strategy**
- Critical errors: Immediate notification
- Performance degradation: Warning alerts
- Resource exhaustion: Proactive alerts
- Uptime monitoring: 99.9% availability target
- On-call rotation and escalation

---

### Security and Compliance

**Container Security**
- Minimal base images (Alpine)
- Security vulnerability scanning
- No secrets in images or code
- Non-root user execution
- Read-only file systems where possible

**Environment Security**
- Secrets management (environment variables, vaults)
- SSL/TLS certificates for all connections
- CORS configuration
- Rate limiting and DDoS protection
- API authentication and authorization

**Compliance**
- Automated backup and disaster recovery
- Audit logging for all operations
- Data encryption at rest and in transit
- Regular security updates and patches
- Compliance with GDPR, HIPAA (if applicable)

---

## Environment Configuration Management

### Environment Variables Strategy
- Development: Local .env files (not committed)
- Staging: Cloud platform environment variables
- Production: Cloud platform secrets management
- CI/CD: GitHub Secrets and environment variables

### Configuration Hierarchy
```
1. Default configuration (committed)
2. Environment-specific overrides (committed)
3. Secret values (environment variables, not committed)
4. Runtime configuration (feature flags, remote config)
```

### Required Environment Variables
```
Frontend:
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_ENV
- NEXT_PUBLIC_SENTRY_DSN (optional)

Backend:
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRATION
- CORS_ORIGIN
- NODE_ENV
- PORT
- SENTRY_DSN (optional)

Database:
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
```

---

## Deployment Workflow

1. **Local Development**
   - Docker Compose for full-stack local environment
   - Hot reloading for rapid development
   - Database seeding for test data
   - Mock external services

2. **Code Commit**
   - Automatic linting and formatting
   - Pre-commit hooks for quality checks
   - Conventional commit messages

3. **Pull Request**
   - CI pipeline runs all tests
   - Docker build validation
   - Code review and approval
   - Preview deployment (optional)

4. **Merge to Main**
   - CI pipeline builds Docker images
   - Push to container registry
   - Deploy to staging automatically
   - Run automated E2E tests

5. **Production Deployment**
   - Manual approval or automatic (based on policy)
   - Zero-downtime deployment
   - Database migration execution
   - Health check validation
   - Monitoring activation

6. **Post-Deployment**
   - Smoke tests validation
   - Performance monitoring
   - Error rate tracking
   - Rollback if issues detected

---

## Rollback Procedures

**Automatic Rollback Triggers**:
- Health check failures after deployment
- Error rate exceeding threshold (>5% in 5 minutes)
- Performance degradation (response time >2x baseline)
- Critical bugs reported immediately after deployment

**Rollback Process**:
1. Stop new traffic to problematic version
2. Route traffic back to previous version
3. Database migration rollback (if needed)
4. Verify system stability
5. Notify team and document incident
6. Post-mortem analysis

---

## Cost Optimization

**Container Optimization**:
- Minimal base images for smaller size
- Multi-stage builds to reduce final image size
- Layer caching to speed up builds
- Remove unnecessary dependencies

**Infrastructure Optimization**:
- Right-size containers based on actual usage
- Auto-scaling based on demand
- Use spot instances for non-critical workloads
- CDN for static assets to reduce origin load
- Database connection pooling to reduce connections

**Monitoring Optimization**:
- Set up billing alerts for unexpected costs
- Regular cost analysis and optimization
- Use free tiers effectively
- Archive old logs to cheaper storage

---

## Related Skills and Resources

**Related Skills**:
- **fullstack-integration**: Environment coordination, deployment orchestration
- **backend-nestjs**: Backend containerization (TypeScript), database migrations, API deployment
- **backend-fastapi**: Backend containerization (Python), uvicorn deployment, async database
- **frontend-nextjs**: Frontend containerization, build optimization, CDN setup
- **qa-testing**: CI/CD test integration, deployment validation, smoke tests
- **research-analysis**: Cloud platform evaluation, infrastructure research
- **mcp-tools-orchestrator**: GitHub MCP for CI/CD, deployment automation

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for deployment patterns

---

This technical reference guide supports Docker latest, Docker Compose V2, GitHub Actions, Railway, Heroku, AWS, and the autonomous skills-based development system.
