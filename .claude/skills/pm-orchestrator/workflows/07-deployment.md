# Deployment Workflow

## Overview

- **Primary Skill**: devops-deployment
- **Supporting Skills**: pm-orchestrator, fullstack-integration, backend-nestjs, frontend-nextjs
- **Dependencies**: integration (recommended), can start during integration
- **Parallel Execution**: Can prepare deployment while integration testing continues

## Workflow Steps

### Phase 1: Deployment Planning and Requirements

**Objective**: Plan deployment strategy and identify requirements

**Actions**:
1. **Read Project Context**:
   - .memory/integration-architecture.md (deployment architecture)
   - .memory/service-architecture.md (service requirements)
   - .memory/system-specs.md (system services, if applicable)
   - .memory/active-context.md (current status)

2. **Identify Deployment Requirements**:
   - Frontend hosting requirements
   - Backend hosting requirements
   - Database hosting requirements
   - System services hosting (if applicable)
   - CDN requirements
   - SSL/TLS requirements

3. **Select Deployment Platforms**:
   - **Frontend**: Vercel (recommended for Next.js)
   - **Backend**: Railway, Render, AWS ECS, or similar
   - **Database**: Managed PostgreSQL (Railway, AWS RDS, Supabase)
   - **System Services**: AWS EC2/ECS (if GPU needed), Railway (if standard)
   - **CDN**: Cloudflare, AWS CloudFront

### Phase 2: Docker Configuration

**Objective**: Create Docker configurations for all services

**Actions**:
1. **Backend Dockerfile**:
   ```dockerfile
   # workspace/docker/backend.Dockerfile
   FROM node:20-alpine AS base

   # Dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   # Builder
   FROM base AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   # Runner
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV=production

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nestjs

   COPY --from=deps --chown=nestjs:nodejs /app/node_modules ./node_modules
   COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
   COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

   USER nestjs

   EXPOSE 3001

   CMD ["node", "dist/main.js"]
   ```

2. **Frontend Dockerfile** (if self-hosting):
   ```dockerfile
   # workspace/docker/frontend.Dockerfile
   FROM node:20-alpine AS base

   # Dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Builder
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .

   ENV NEXT_TELEMETRY_DISABLED=1

   RUN npm run build

   # Runner
   FROM base AS runner
   WORKDIR /app

   ENV NODE_ENV=production
   ENV NEXT_TELEMETRY_DISABLED=1

   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs

   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

   USER nextjs

   EXPOSE 3000

   ENV PORT=3000
   ENV HOSTNAME="0.0.0.0"

   CMD ["node", "server.js"]
   ```

3. **System Services Dockerfile** (if applicable):
   ```dockerfile
   # workspace/docker/system.Dockerfile
   FROM python:3.11-slim

   # For GPU support, use nvidia/cuda base image instead:
   # FROM nvidia/cuda:12.0-runtime-ubuntu22.04

   WORKDIR /app

   # Install system dependencies
   RUN apt-get update && apt-get install -y \
       libgomp1 \
       && rm -rf /var/lib/apt/lists/*

   # Copy requirements and install
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Copy application
   COPY . .

   EXPOSE 8000

   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

4. **Docker Compose Configuration**:
   ```yaml
   # workspace/docker/docker-compose.yml
   version: '3.9'

   services:
     postgres:
       image: postgres:16-alpine
       container_name: project-db
       environment:
         POSTGRES_USER: ${DB_USER}
         POSTGRES_PASSWORD: ${DB_PASSWORD}
         POSTGRES_DB: ${DB_NAME}
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data
       healthcheck:
         test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
         interval: 10s
         timeout: 5s
         retries: 5

     backend:
       build:
         context: ../backend
         dockerfile: ../docker/backend.Dockerfile
       container_name: project-backend
       environment:
         NODE_ENV: production
         DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
         JWT_SECRET: ${JWT_SECRET}
       ports:
         - "3001:3001"
       depends_on:
         postgres:
           condition: service_healthy
       healthcheck:
         test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/health"]
         interval: 30s
         timeout: 10s
         retries: 3

     frontend:
       build:
         context: ../frontend
         dockerfile: ../docker/frontend.Dockerfile
       container_name: project-frontend
       environment:
         NEXT_PUBLIC_API_URL: http://backend:3001/api
       ports:
         - "3000:3000"
       depends_on:
         - backend

   volumes:
     postgres_data:
   ```

### Phase 3: Environment Configuration

**Objective**: Setup environment variables for all environments

**Actions**:
1. **Create Environment Templates**:
   ```bash
   # workspace/deployment/.env.example
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname

   # JWT
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRES_IN=1d
   JWT_REFRESH_EXPIRES_IN=7d

   # Frontend
   NEXT_PUBLIC_API_URL=http://localhost:3001/api

   # System Services (if applicable)
   SYSTEM_SERVICE_URL=http://localhost:8000

   # External Services
   AWS_ACCESS_KEY_ID=your-key
   AWS_SECRET_ACCESS_KEY=your-secret
   S3_BUCKET=your-bucket

   # Email (if applicable)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email
   SMTP_PASS=your-password
   ```

2. **Environment-Specific Configuration**:
   - `.env.development`: Local development
   - `.env.staging`: Staging environment
   - `.env.production`: Production environment

3. **Secret Management Strategy**:
   - Use platform secret management (Vercel secrets, Railway variables, AWS Secrets Manager)
   - Never commit secrets to repository
   - Rotate secrets regularly
   - Use different secrets per environment

### Phase 4: Database Migration Strategy

**Objective**: Setup database migration and seeding

**Actions**:
1. **Migration Scripts**:
   - Ensure all Prisma/TypeORM migrations created
   - Test migrations on clean database
   - Create rollback procedures
   - Document migration order

2. **Database Seeding** (if needed):
   - Create seed data scripts
   - Implement idempotent seeds
   - Separate development and production seeds

3. **Backup Strategy**:
   - Automated daily backups
   - Pre-deployment backup
   - Backup retention policy (30 days recommended)
   - Backup restoration testing

### Phase 5: CI/CD Pipeline Configuration

**Objective**: Setup automated deployment pipelines

**Actions**:
1. **GitHub Actions Workflow**:
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'

         - name: Install dependencies
           run: npm ci

         - name: Run tests
           run: npm test

         - name: Run linting
           run: npm run lint

     deploy-backend:
       needs: test
       if: github.ref == 'refs/heads/main'
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - name: Deploy to Railway
           uses: bervProject/railway-deploy@main
           with:
             railway_token: ${{ secrets.RAILWAY_TOKEN }}
             service: backend

     deploy-frontend:
       needs: test
       if: github.ref == 'refs/heads/main'
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4

         - name: Deploy to Vercel
           uses: amondnet/vercel-action@v25
           with:
             vercel-token: ${{ secrets.VERCEL_TOKEN }}
             vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
             vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
             vercel-args: '--prod'
   ```

2. **Deployment Stages**:
   - **Test**: Run tests and linting
   - **Build**: Build Docker images or compile code
   - **Deploy Staging**: Deploy to staging environment
   - **Integration Tests**: Run E2E tests on staging
   - **Deploy Production**: Deploy to production (on approval)

### Phase 6: Frontend Deployment (Vercel)

**Objective**: Deploy Next.js frontend to Vercel

**Actions**:
1. **Vercel Configuration**:
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "devCommand": "npm run dev",
     "installCommand": "npm install",
     "framework": "nextjs",
     "outputDirectory": ".next",
     "env": {
       "NEXT_PUBLIC_API_URL": "@api-url"
     }
   }
   ```

2. **Deployment Steps**:
   - Connect GitHub repository to Vercel
   - Configure environment variables
   - Setup custom domain (if applicable)
   - Configure SSL/TLS (automatic with Vercel)
   - Enable Vercel Analytics (optional)

3. **Performance Optimization**:
   - Enable Edge Runtime where applicable
   - Configure ISR (Incremental Static Regeneration)
   - Setup CDN caching
   - Enable image optimization

### Phase 7: Backend Deployment (Railway/Cloud)

**Objective**: Deploy Nest.js backend

**Actions**:
1. **Railway Deployment** (recommended for simplicity):
   - Connect GitHub repository
   - Configure Dockerfile path
   - Setup environment variables
   - Configure health check endpoint
   - Setup PostgreSQL database addon
   - Configure auto-deploy on push

2. **Alternative: AWS ECS Deployment**:
   - Create ECR repository
   - Push Docker image to ECR
   - Create ECS task definition
   - Setup ECS service
   - Configure Application Load Balancer
   - Setup auto-scaling policies

3. **Database Setup**:
   - Create managed PostgreSQL instance
   - Configure connection pooling
   - Setup SSL connection
   - Configure backups
   - Run migrations

### Phase 8: System Services Deployment (if applicable)

**Objective**: Deploy specialized system services

**Actions**:
1. **GPU-Enabled Deployment** (if needed):
   - AWS EC2 with GPU instances (g4dn, p3)
   - Configure CUDA and drivers
   - Deploy Docker container with GPU support
   - Setup auto-scaling (if needed)

2. **Standard Deployment**:
   - Railway Python deployment
   - Configure environment variables
   - Setup health checks
   - Configure logging

3. **Service Integration**:
   - Configure API endpoints
   - Setup authentication
   - Test integration with backend

### Phase 9: Monitoring and Logging Setup

**Objective**: Setup comprehensive monitoring and logging

**Actions**:
1. **Application Monitoring**:
   - Setup error tracking (Sentry recommended)
   - Configure performance monitoring (New Relic, Datadog, or similar)
   - Setup uptime monitoring (UptimeRobot, Pingdom)
   - Configure log aggregation (Logtail, Papertrail)

2. **Health Checks**:
   ```typescript
   // Backend health check endpoint
   @Get('health')
   health() {
     return {
       status: 'ok',
       timestamp: new Date().toISOString(),
       database: 'connected', // Check DB connection
       uptime: process.uptime()
     };
   }
   ```

3. **Alerts Configuration**:
   - Error rate thresholds
   - Response time degradation
   - Server downtime alerts
   - Database connection issues
   - High resource usage

### Phase 10: Security Configuration

**Objective**: Implement security best practices

**Actions**:
1. **SSL/TLS**:
   - Configure HTTPS (automatic with Vercel, Railway)
   - Force HTTPS redirects
   - Configure HSTS headers

2. **Security Headers**:
   ```typescript
   // Nest.js security headers
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         scriptSrc: ["'self'"],
         imgSrc: ["'self'", "data:", "https:"],
       },
     },
     crossOriginEmbedderPolicy: false,
   }));
   ```

3. **Rate Limiting**:
   ```typescript
   // Nest.js rate limiting
   import { ThrottlerModule } from '@nestjs/throttler';

   ThrottlerModule.forRoot([{
     ttl: 60000,
     limit: 10,
   }])
   ```

4. **CORS Configuration**:
   ```typescript
   app.enableCors({
     origin: process.env.FRONTEND_URL,
     credentials: true,
   });
   ```

### Phase 11: Deployment Validation and Testing

**Objective**: Validate production deployment

**Actions**:
1. **Smoke Tests**:
   - Frontend loads correctly
   - API endpoints responsive
   - Database connections working
   - Authentication flows functional

2. **Integration Tests**:
   - Run E2E tests against production
   - Test critical user flows
   - Validate real-time features
   - Test file upload/download

3. **Performance Validation**:
   - Check API response times
   - Validate page load times
   - Test under load (basic load testing)
   - Validate CDN performance

4. **Security Validation**:
   - SSL certificate valid
   - Security headers present
   - CORS configured correctly
   - No exposed secrets

### Phase 12: Documentation and Runbooks

**Objective**: Create operational documentation

**Deliverables**:

1. **.memory/deployment-config.md**:
   ```markdown
   # Deployment Configuration

   ## Environments
   - **Production**: https://app.example.com
   - **Staging**: https://staging.example.com
   - **Development**: http://localhost:3000

   ## Services
   - **Frontend**: Vercel (auto-deploy from main)
   - **Backend**: Railway (auto-deploy from main)
   - **Database**: Railway PostgreSQL (16-alpine)
   - **System Service**: AWS EC2 (g4dn.xlarge with GPU)

   ## Deployment Process
   1. Merge PR to main branch
   2. GitHub Actions runs tests
   3. On success, auto-deploy to staging
   4. Run E2E tests on staging
   5. Manual approval for production
   6. Deploy to production
   7. Validate deployment

   ## Rollback Procedure
   1. Identify issue in production
   2. Revert to previous deployment (Vercel/Railway UI)
   3. Or revert Git commit and push
   4. Validate rollback successful
   5. Investigate and fix issue

   ## Environment Variables
   See deployment/.env.example for complete list

   ## Health Check Endpoints
   - Backend: https://api.example.com/health
   - System Service: https://system.example.com/health
   ```

2. **workspace/deployment/RUNBOOK.md**:
   ```markdown
   # Operations Runbook

   ## Common Operations

   ### Deploy to Production
   1. Merge PR to main
   2. Wait for CI/CD pipeline
   3. Approve production deployment
   4. Monitor for errors

   ### Rollback Deployment
   [Steps...]

   ### Database Migration
   [Steps...]

   ### Scale Services
   [Steps...]

   ## Troubleshooting

   ### Frontend Not Loading
   - Check Vercel deployment status
   - Check browser console for errors
   - Validate API URL environment variable

   ### API Errors
   - Check Railway logs
   - Verify database connection
   - Check environment variables

   ### High Error Rate
   - Check Sentry for error details
   - Review recent deployments
   - Check service health endpoints
   ```

### Phase 13: Memory System Updates

**Objective**: Update memory with deployment completion

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Phase
   Phase: deployment_completed
   Progress: 95%

   ## Deployment Status
   - Frontend: ✅ Deployed to Vercel
   - Backend: ✅ Deployed to Railway
   - Database: ✅ PostgreSQL operational
   - System Services: ✅ Deployed to AWS EC2

   ## Production URLs
   - App: https://app.example.com
   - API: https://api.example.com
   - Docs: https://api.example.com/docs

   ## Next Milestones
   1. Final quality assurance
   2. User acceptance testing
   3. Production launch
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "currentPhase": "deployment_completed",
     "progress": {
       "overall": 95,
       "phases": {
         "deployment": 100,
         "quality_assurance": 90
       }
     },
     "deployment": {
       "frontend": {
         "platform": "vercel",
         "url": "https://app.example.com",
         "status": "deployed"
       },
       "backend": {
         "platform": "railway",
         "url": "https://api.example.com",
         "status": "deployed"
       },
       "database": {
         "type": "postgresql",
         "platform": "railway",
         "status": "operational"
       }
     }
   }
   ```

3. **Update .memory/decisions.md**:
   ```markdown
   ## [YYYY-MM-DD] Deployment Decisions

   ### Frontend Platform
   **Decision**: Vercel
   **Rationale**: Best Next.js support, automatic SSL, edge network, zero-config
   **Alternatives**: Netlify, AWS Amplify
   **Impact**: Deployment simplicity, performance, cost

   ### Backend Platform
   **Decision**: Railway
   **Rationale**: Simple Docker deployment, managed PostgreSQL, affordable
   **Alternatives**: Render, AWS ECS, DigitalOcean
   **Impact**: Operations complexity, cost, scalability

   ### CI/CD
   **Decision**: GitHub Actions
   **Rationale**: Native GitHub integration, free for public repos, flexible
   **Impact**: Deployment automation, testing automation
   ```

## Completion Criteria

**All criteria must be met before proceeding**:

- ✅ **Docker Configurations Created**: All services have Dockerfiles
- ✅ **Environment Variables Configured**: All environments setup
- ✅ **CI/CD Pipeline Working**: Automated deployments functional
- ✅ **Frontend Deployed**: Next.js app accessible
- ✅ **Backend Deployed**: Nest.js API operational
- ✅ **Database Deployed**: PostgreSQL accessible and migrated
- ✅ **System Services Deployed**: Specialized services operational (if applicable)
- ✅ **Monitoring Setup**: Error tracking and logging configured
- ✅ **Security Configured**: HTTPS, security headers, rate limiting
- ✅ **Health Checks Working**: All services have health endpoints
- ✅ **Documentation Complete**: Deployment docs and runbooks created
- ✅ **Memory System Updated**: All deployment context recorded

## Verification Steps

1. **Deployment Verification**:
   - All services accessible via HTTPS
   - Health check endpoints responding
   - No deployment errors in logs

2. **Functional Verification**:
   - Run smoke tests on production
   - Test critical user flows
   - Validate integrations working

3. **Security Verification**:
   - SSL certificate valid
   - Security headers present
   - No secrets exposed in client code

## Next Workflows

**Sequential**:
→ **08-quality-assurance.md**: Final QA and user acceptance testing

**Parallel** (can continue):
→ **08-quality-assurance.md**: Quality assurance can validate deployed application

## Common Issues and Resolutions

**Issue**: Build failures in CI/CD
**Resolution**: Check build logs, verify environment variables, test build locally with production settings

**Issue**: Database connection errors
**Resolution**: Verify DATABASE_URL format, check network access, validate SSL settings

**Issue**: CORS errors in production
**Resolution**: Update CORS configuration with production frontend URL, check credentials setting

**Issue**: Environment variables not loading
**Resolution**: Verify platform-specific variable syntax, check variable names match code, restart services

**Issue**: High response times
**Resolution**: Check database query performance, enable connection pooling, configure CDN caching

## Output Example

**Success Output**:
```
Deployment Completed
====================

Infrastructure:
✅ Docker Configurations: Created for all services
✅ CI/CD Pipeline: GitHub Actions configured
✅ Environment Variables: All environments configured
✅ Database Migrations: Applied successfully

Production Deployment:
✅ Frontend: https://app.example.com (Vercel)
   - SSL: Valid (Auto-renewed)
   - Performance: Lighthouse 95
   - Deployment: Auto from main branch

✅ Backend: https://api.example.com (Railway)
   - Health: https://api.example.com/health (200 OK)
   - Docs: https://api.example.com/docs
   - Database: PostgreSQL 16 (Railway)
   - Deployment: Auto from main branch

✅ System Services: https://system.example.com (AWS EC2)
   - Instance: g4dn.xlarge with GPU
   - Health: Operational
   - Performance: 95ms avg latency

Monitoring & Security:
✅ Error Tracking: Sentry configured
✅ Logging: Logtail integrated
✅ Uptime Monitoring: UptimeRobot (99.9% target)
✅ SSL/TLS: Configured on all services
✅ Security Headers: Helmet configured
✅ Rate Limiting: 100 req/min per IP

Documentation:
✅ Deployment Config: .memory/deployment-config.md
✅ Runbook: workspace/deployment/RUNBOOK.md
✅ Environment Templates: Created

Next Steps:
→ Final quality assurance on production
→ User acceptance testing
→ Production launch preparation
```
