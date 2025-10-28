# CI/CD Pipeline Example

**Production-Ready CI/CD with GitHub Actions**

> **When to Use**: Every project requiring automated testing and deployment
> **Skill**: devops-deployment
> **Related**: qa-testing (automated tests), docker-setup (containerization)

---

## Overview

This example demonstrates a complete CI/CD pipeline:
- Automated testing on every PR
- Multi-stage deployment (dev → staging → production)
- Docker image building and publishing
- Security scanning and quality gates
- Zero-downtime deployments
- Rollback mechanisms
- Notifications and monitoring

**Architecture**: GitHub Actions → Docker → Container Registry → Deployment

## System Architecture

```
GitHub Events          CI/CD Pipeline              Deployment
┌─────────────┐       ┌────────────────┐         ┌──────────────┐
│ Pull Request│──────▶│ Test Pipeline  │         │              │
│             │       │ - Lint         │         │              │
│             │       │ - Unit Tests   │         │              │
│             │       │ - E2E Tests    │         │              │
└─────────────┘       └────────────────┘         │              │
                                                  │              │
┌─────────────┐       ┌────────────────┐         │              │
│ Push to Main│──────▶│ Build Pipeline │────────▶│ Development  │
│             │       │ - Build Docker │         │ Environment  │
│             │       │ - Push Registry│         │              │
│             │       │ - Deploy Dev   │         │              │
└─────────────┘       └────────────────┘         └──────────────┘
                              │                          │
                              │                          ▼
┌─────────────┐               │                  ┌──────────────┐
│ Tag Release │               └─────────────────▶│ Staging      │
│ v1.x.x      │                                  │ Environment  │
│             │       ┌────────────────┐         │              │
│             │──────▶│ Release        │         │ (Approval)   │
└─────────────┘       │ - Build        │         └──────────────┘
                      │ - Test         │                │
                      │ - Publish      │                ▼
                      │ - Deploy Prod  │         ┌──────────────┐
                      └────────────────┘         │ Production   │
                                                 │ Environment  │
                                                 └──────────────┘
```

## Complete Implementation

### 1. Pull Request CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI Pipeline

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  # Code quality checks
  lint:
    name: Lint and Format Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run Prettier check
        run: pnpm format:check

      - name: TypeScript type check
        run: pnpm type-check

  # Unit and integration tests
  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20]
    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run unit tests
        run: pnpm test:unit
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: pnpm test:integration
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-${{ matrix.node-version }}

  # E2E tests with Playwright
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  # Security scanning
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # Build check (ensure Docker build works)
  build-check:
    name: Docker Build Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: false
          tags: test:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### 2. Deployment Pipeline (Main Branch)

```yaml
# .github/workflows/deploy.yml
name: Deploy Pipeline

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        type: choice
        options:
          - development
          - staging
          - production

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    name: Build and Push Docker Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
      image-digest: ${{ steps.build.outputs.digest }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            BUILD_DATE=${{ github.event.head_commit.timestamp }}
            VCS_REF=${{ github.sha }}
            VERSION=${{ github.ref_name }}

      - name: Sign image with Cosign
        env:
          COSIGN_EXPERIMENTAL: true
        run: |
          cosign sign --yes ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}@${{ steps.build.outputs.digest }}

  deploy-dev:
    name: Deploy to Development
    needs: build-and-push
    runs-on: ubuntu-latest
    environment:
      name: development
      url: https://dev.example.com
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_DEV }}
          aws-region: us-east-1

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster dev-cluster \
            --service app-service \
            --force-new-deployment \
            --region us-east-1

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster dev-cluster \
            --services app-service \
            --region us-east-1

      - name: Run smoke tests
        run: |
          curl -f https://dev.example.com/health || exit 1

  deploy-staging:
    name: Deploy to Staging
    needs: [build-and-push, deploy-dev]
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://staging.example.com
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_STAGING }}
          aws-region: us-east-1

      - name: Deploy to staging
        run: |
          aws ecs update-service \
            --cluster staging-cluster \
            --service app-service \
            --force-new-deployment

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster staging-cluster \
            --services app-service

      - name: Run integration tests
        run: |
          curl -f https://staging.example.com/health || exit 1
          # Run comprehensive tests against staging

  deploy-production:
    name: Deploy to Production
    needs: [build-and-push, deploy-staging]
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://example.com
    if: startsWith(github.ref, 'refs/tags/v')
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_PROD }}
          aws-region: us-east-1

      - name: Create deployment record
        id: deployment
        run: |
          DEPLOYMENT_ID=$(date +%s)
          echo "deployment_id=$DEPLOYMENT_ID" >> $GITHUB_OUTPUT
          echo "Deployment ID: $DEPLOYMENT_ID"

      - name: Blue-Green deployment
        run: |
          # Deploy to green environment
          aws ecs update-service \
            --cluster prod-cluster \
            --service app-service-green \
            --task-definition app-task:${{ github.sha }} \
            --force-new-deployment

          # Wait for green to be stable
          aws ecs wait services-stable \
            --cluster prod-cluster \
            --services app-service-green

          # Switch traffic to green
          aws elbv2 modify-listener \
            --listener-arn ${{ secrets.PROD_LISTENER_ARN }} \
            --default-actions Type=forward,TargetGroupArn=${{ secrets.GREEN_TARGET_GROUP }}

      - name: Health check
        run: |
          for i in {1..10}; do
            if curl -f https://example.com/health; then
              echo "Health check passed"
              exit 0
            fi
            sleep 10
          done
          echo "Health check failed"
          exit 1

      - name: Rollback on failure
        if: failure()
        run: |
          # Switch back to blue
          aws elbv2 modify-listener \
            --listener-arn ${{ secrets.PROD_LISTENER_ARN }} \
            --default-actions Type=forward,TargetGroupArn=${{ secrets.BLUE_TARGET_GROUP }}

  notify:
    name: Send Notifications
    needs: [deploy-dev, deploy-staging, deploy-production]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Send Slack notification
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "Deployment ${{ job.status }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*Deployment Status:* ${{ job.status }}\n*Branch:* ${{ github.ref_name }}\n*Commit:* ${{ github.sha }}"
                  }
                }
              ]
            }
```

### 3. Release Pipeline

```yaml
# .github/workflows/release.yml
name: Release Pipeline

on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  create-release:
    name: Create GitHub Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        run: |
          PREV_TAG=$(git describe --abbrev=0 --tags $(git rev-list --tags --skip=1 --max-count=1))
          CHANGELOG=$(git log $PREV_TAG..HEAD --pretty=format:"- %s (%h)" --no-merges)
          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          echo "$CHANGELOG" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref_name }}
          release_name: Release ${{ github.ref_name }}
          body: |
            ## Changes in this Release
            ${{ steps.changelog.outputs.changelog }}

            ## Docker Image
            ```
            docker pull ghcr.io/${{ github.repository }}:${{ github.ref_name }}
            ```
          draft: false
          prerelease: false

  build-artifacts:
    name: Build Release Artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Create tarball
        run: |
          tar -czf release-${{ github.ref_name }}.tar.gz dist/

      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: release-artifact
          path: release-${{ github.ref_name }}.tar.gz
```

### 4. Rollback Mechanism

```yaml
# .github/workflows/rollback.yml
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to rollback'
        required: true
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to rollback to (e.g., v1.0.0)'
        required: true
        type: string

jobs:
  rollback:
    name: Rollback to Previous Version
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - name: Validate version
        run: |
          if ! [[ "${{ inputs.version }}" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            echo "Invalid version format. Must be vX.Y.Z"
            exit 1
          fi

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets[format('AWS_ROLE_{0}', upper(inputs.environment))] }}
          aws-region: us-east-1

      - name: Rollback ECS service
        run: |
          # Get task definition for the specified version
          TASK_DEF=$(aws ecs list-task-definitions \
            --family-prefix app-task \
            --status ACTIVE \
            --query "taskDefinitionArns[?contains(@, '${{ inputs.version }}')]" \
            --output text | head -1)

          if [ -z "$TASK_DEF" ]; then
            echo "Task definition not found for version ${{ inputs.version }}"
            exit 1
          fi

          # Update service to use the old task definition
          aws ecs update-service \
            --cluster ${{ inputs.environment }}-cluster \
            --service app-service \
            --task-definition $TASK_DEF \
            --force-new-deployment

      - name: Wait for rollback
        run: |
          aws ecs wait services-stable \
            --cluster ${{ inputs.environment }}-cluster \
            --services app-service

      - name: Verify rollback
        run: |
          curl -f https://${{ inputs.environment }}.example.com/health || exit 1

      - name: Notify team
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          payload: |
            {
              "text": "Rollback completed for ${{ inputs.environment }} to version ${{ inputs.version }}"
            }
```

### 5. Database Migration Pipeline

```yaml
# .github/workflows/migrate.yml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to migrate'
        required: true
        type: choice
        options:
          - development
          - staging
          - production
      action:
        description: 'Migration action'
        required: true
        type: choice
        options:
          - migrate
          - rollback

jobs:
  migrate:
    name: Run Database Migration
    runs-on: ubuntu-latest
    environment: ${{ inputs.environment }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Create database backup
        run: |
          # Backup before migration
          pg_dump ${{ secrets.DATABASE_URL }} > backup-$(date +%Y%m%d-%H%M%S).sql

      - name: Run migrations
        if: inputs.action == 'migrate'
        run: npm run migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Rollback migrations
        if: inputs.action == 'rollback'
        run: npm run migrate:rollback
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Upload backup
        uses: actions/upload-artifact@v3
        with:
          name: database-backup
          path: backup-*.sql
          retention-days: 30
```

### 6. Performance Monitoring

```yaml
# .github/workflows/performance.yml
name: Performance Monitoring

on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  workflow_dispatch:

jobs:
  lighthouse:
    name: Lighthouse Performance Audit
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://example.com
            https://example.com/dashboard
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

      - name: Check performance budget
        run: |
          if [ $LIGHTHOUSE_SCORE -lt 90 ]; then
            echo "Performance score below threshold!"
            exit 1
          fi

  load-test:
    name: Load Testing
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.0
        with:
          filename: tests/load-test.js
          flags: --out json=results.json

      - name: Upload results
        uses: actions/upload-artifact@v3
        with:
          name: k6-results
          path: results.json
```

## Configuration Files

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "format:check": "prettier --check .",
    "format:write": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test:unit": "jest --coverage",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "playwright test",
    "build": "next build",
    "migrate": "prisma migrate deploy",
    "migrate:rollback": "prisma migrate rollback"
  }
}
```

### GitHub Environments Setup

```bash
# Configure environments in GitHub repository settings

# Development
- Name: development
- URL: https://dev.example.com
- Secrets:
  - AWS_ROLE_DEV
  - DATABASE_URL

# Staging
- Name: staging
- URL: https://staging.example.com
- Secrets:
  - AWS_ROLE_STAGING
  - DATABASE_URL
- Required reviewers: 1

# Production
- Name: production
- URL: https://example.com
- Secrets:
  - AWS_ROLE_PROD
  - DATABASE_URL
  - BLUE_TARGET_GROUP
  - GREEN_TARGET_GROUP
  - PROD_LISTENER_ARN
- Required reviewers: 2
- Wait timer: 5 minutes
```

### Lighthouse Budget

```json
// lighthouse-budget.json
{
  "performance": 90,
  "accessibility": 95,
  "best-practices": 90,
  "seo": 90,
  "first-contentful-paint": 2000,
  "largest-contentful-paint": 2500,
  "cumulative-layout-shift": 0.1,
  "total-blocking-time": 300
}
```

## CI/CD Best Practices

### 1. Caching Strategy

```yaml
# Optimal caching for faster builds
- uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      ~/.cache
      node_modules
      .next/cache
    key: ${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

### 2. Parallel Jobs

```yaml
# Run independent jobs in parallel
jobs:
  lint:
    # ...
  test:
    # ...
  security:
    # ...
  # All run simultaneously
```

### 3. Matrix Strategy

```yaml
# Test across multiple versions
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### 4. Secrets Management

```bash
# Use GitHub Secrets for sensitive data
# Never commit secrets to repository

# Repository secrets
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
DATABASE_URL
SLACK_WEBHOOK_URL

# Environment-specific secrets
DEV_DATABASE_URL
STAGING_DATABASE_URL
PROD_DATABASE_URL
```

## Monitoring and Observability

### Deployment Metrics

Track key metrics:
- Deployment frequency
- Lead time for changes
- Mean time to recovery (MTTR)
- Change failure rate

### Health Checks

```typescript
// backend/src/health/health.controller.ts
@Get('health')
async healthCheck() {
  return {
    status: 'healthy',
    version: process.env.APP_VERSION,
    timestamp: new Date().toISOString(),
    checks: {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      s3: await this.checkS3(),
    },
  };
}
```

## Rollback Strategies

### 1. Blue-Green Deployment

- Maintain two identical environments
- Switch traffic instantly
- Easy rollback by switching back

### 2. Canary Deployment

```yaml
# Gradual rollout
- 10% traffic to new version
- Monitor metrics for 10 minutes
- 50% traffic if healthy
- 100% traffic if still healthy
```

### 3. Feature Flags

```typescript
// Use feature flags for gradual rollout
if (featureFlags.isEnabled('new-feature', userId)) {
  return newImplementation();
} else {
  return oldImplementation();
}
```

## Security Best Practices

### 1. OIDC Authentication

```yaml
# Use OIDC instead of long-lived credentials
permissions:
  id-token: write
  contents: read

- uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: arn:aws:iam::123456789012:role/GitHubActions
    aws-region: us-east-1
```

### 2. Dependency Scanning

```yaml
# Automated security scanning
- run: npm audit --audit-level=high
- uses: snyk/actions/node@master
```

### 3. Image Signing

```yaml
# Sign container images with Cosign
- run: cosign sign --yes $IMAGE@$DIGEST
```

## Key Patterns

1. **Multi-Stage Pipeline**: Separate concerns (test, build, deploy)
2. **Environment Progression**: dev → staging → production
3. **Automated Testing**: Run tests before deployment
4. **Security Scanning**: Detect vulnerabilities early
5. **Blue-Green Deployment**: Zero-downtime deployments
6. **Rollback Automation**: Quick recovery from failures
7. **Monitoring**: Track deployment health and metrics

## Common Pitfalls

❌ **DON'T**:
- Deploy without tests
- Use long-lived credentials
- Skip security scans
- Forget rollback mechanisms
- Ignore deployment metrics
- Deploy to production directly

✅ **DO**:
- Run comprehensive tests first
- Use OIDC for cloud authentication
- Scan for vulnerabilities
- Implement rollback strategies
- Monitor deployment health
- Use staging environment

## Related Examples

- **Docker Setup**: `01-complete-docker-setup.md`
- **Production Deployment**: `03-production-deployment.md`
- **E2E Testing**: `qa-testing/examples/01-e2e-test-suite.md`
- **Performance Testing**: `qa-testing/examples/03-performance-testing.md`
