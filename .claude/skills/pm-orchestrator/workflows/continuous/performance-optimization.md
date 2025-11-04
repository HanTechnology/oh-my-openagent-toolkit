# Performance Optimization Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: Performance improvements, speed optimization
- **Version Impact**: PATCH (same functionality, better performance)
- **Priority**: Medium-High (depends on severity)
- **Return To**: 06-integration.md

## Purpose

Improve application performance by reducing response times, optimizing resource usage, and enhancing scalability. This workflow handles performance bottlenecks, slow queries, memory leaks, and other performance-related issues.

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: Performance optimization
- Priority: Medium-High
- Version: Patch version increment
- Trigger: Performance metrics below targets or user complaints about speed

## Workflow Steps

### Phase 1: Performance Problem Identification

**Objective**: Identify and quantify performance issues

**Actions**:

1. **Read Performance Context**:
   - .memory/production-metrics.md (current metrics)
   - .memory/user-feedback.md (user reports of slowness)
   - .memory/ci-cd-metrics.md (build/deployment performance)
   - Application monitoring data (APM tools)

2. **Performance Metrics Baseline**:
   Measure current performance:

   **Frontend Metrics**:
   - Core Web Vitals: LCP, FID, CLS
   - Time to Interactive (TTI)
   - First Contentful Paint (FCP)
   - JavaScript bundle size
   - Page load time
   - Network request count/size

   **Backend Metrics**:
   - API response time (average, p50, p95, p99)
   - Database query time
   - Throughput (requests per second)
   - CPU usage
   - Memory usage
   - Cache hit rate

   **Mobile Metrics** (if applicable):
   - App startup time (cold/warm)
   - Screen render time
   - Memory usage
   - Battery consumption
   - Network data usage

3. **Problem Identification**:
   Identify specific bottlenecks:
   - Which operations are slow?
   - Which pages/endpoints are slowest?
   - What is the root cause? (database, network, computation, rendering)
   - How many users affected?
   - What is the business impact?

4. **Performance Targets**:
   Define target improvements:
   ```markdown
   ## Performance Targets

   ### Current State
   - Dashboard load time: 3.2s (LCP)
   - API response time: 450ms (p95)
   - Search query: 2.1s

   ### Target State
   - Dashboard load time: <2.0s (LCP) - 38% improvement
   - API response time: <200ms (p95) - 56% improvement
   - Search query: <500ms - 76% improvement
   ```

### Phase 2: Performance Profiling & Analysis

**Objective**: Understand WHY performance is slow

**Actions**:

1. **Frontend Profiling** (if frontend issue):
   - Chrome DevTools Performance profiling
   - React DevTools Profiler (component render times)
   - Network waterfall analysis
   - Bundle analyzer (identify large dependencies)
   - Lighthouse audit

2. **Backend Profiling** (if backend issue):
   - API endpoint profiling
   - Database query analysis (EXPLAIN plans)
   - N+1 query detection
   - Memory profiling (heap dumps)
   - CPU profiling

3. **Root Cause Identification**:
   Common performance bottlenecks:

   **Frontend**:
   - Large JavaScript bundles
   - Unnecessary re-renders
   - Unoptimized images
   - Blocking third-party scripts
   - Excessive DOM manipulation
   - Memory leaks

   **Backend**:
   - Slow database queries
   - N+1 query problems
   - Missing database indexes
   - Inefficient algorithms
   - Synchronous blocking operations
   - Lack of caching

   **Network**:
   - Too many HTTP requests
   - Large request/response payloads
   - No HTTP caching headers
   - No CDN usage
   - Latency to external services

4. **Impact vs Effort Analysis**:
   Prioritize optimizations:
   - High Impact, Low Effort → Do first
   - High Impact, High Effort → Plan carefully
   - Low Impact, Low Effort → Quick wins
   - Low Impact, High Effort → Skip or defer

### Phase 3: Optimization Strategy Design

**Objective**: Plan performance improvements

**Actions**:

1. **Optimization Pattern Selection**:

   **Frontend Optimization Strategies**:
   - Code splitting (lazy loading)
   - Image optimization (compression, WebP, responsive images)
   - Caching (service workers, HTTP caching)
   - Reduce bundle size (tree shaking, remove unused deps)
   - Optimize rendering (memoization, virtualization)
   - Preloading/prefetching critical resources

   **Backend Optimization Strategies**:
   - Database query optimization (indexes, query rewriting)
   - Caching (Redis, in-memory caching)
   - Batch operations (reduce N+1 queries)
   - Async processing (queues for heavy operations)
   - Database connection pooling
   - API response compression

   **Infrastructure Optimization Strategies**:
   - CDN for static assets
   - Load balancing
   - Database read replicas
   - Horizontal scaling
   - Serverless functions for bursty workloads

2. **Skill Coordination**:
   Mention required skills:
   - Frontend optimization → **frontend-nextjs** or **mobile-react-native**
   - Backend optimization → **backend-nestjs** or **backend-fastapi**
   - Infrastructure optimization → **devops-deployment**
   - System-level optimization → **systemdev-specialist**

3. **Risk Assessment**:
   - Will optimization introduce bugs?
   - Can we measure impact accurately?
   - Is there a rollback plan?
   - Are there trade-offs (e.g., caching vs data freshness)?

### Phase 4: Optimization Implementation

**Objective**: Implement performance improvements

**Actions**:

1. **Create Optimization Branch**:
   ```bash
   git checkout -b perf/[optimization-description]
   ```

2. **Implement Optimizations**:
   Mention appropriate skill to implement:

   **Frontend Performance Optimization**:
   ```typescript
   // Example: Code splitting with React.lazy
   const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

   // Example: Memoization
   const MemoizedComponent = React.memo(ExpensiveComponent)

   // Example: Virtualization for long lists
   import { FixedSizeList } from 'react-window'

   // Example: Image optimization
   <Image
     src="/image.jpg"
     alt="Description"
     width={800}
     height={600}
     loading="lazy"
     quality={85}
   />
   ```

   **Backend Performance Optimization**:
   ```typescript
   // Example: Add database index
   // Migration:
   await queryRunner.query(`
     CREATE INDEX idx_users_email ON users(email)
   `)

   // Example: Implement caching
   @Cacheable('users', 60) // Cache for 60 seconds
   async findUserById(id: string) {
     return this.usersRepository.findOne(id)
   }

   // Example: Batch query to prevent N+1
   const users = await this.usersRepository.find({
     relations: ['posts', 'comments'] // Eager load
   })
   ```

3. **Incremental Implementation**:
   - Implement one optimization at a time
   - Measure impact after each optimization
   - Document results
   - Rollback if optimization causes issues

### Phase 5: Performance Verification & Measurement

**Objective**: Verify performance improvements achieved

**Actions**:

1. **Re-measure Performance Metrics**:
   Measure after optimization:

   **Frontend Metrics**:
   ```bash
   # Lighthouse audit
   lighthouse https://staging.myapp.com --view

   # Bundle size analysis
   npm run build
   # Check build output for bundle sizes
   ```

   **Backend Metrics**:
   ```bash
   # API response time testing
   ab -n 1000 -c 10 https://api.myapp.com/endpoint

   # Database query analysis
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com'
   ```

2. **Performance Comparison**:
   Document before/after:
   ```markdown
   ## Performance Improvements

   ### Dashboard Load Time
   - Before: 3.2s (LCP)
   - After: 1.8s (LCP)
   - Improvement: 44% faster ✅ (target: 38%)

   ### API Response Time
   - Before: 450ms (p95)
   - After: 180ms (p95)
   - Improvement: 60% faster ✅ (target: 56%)

   ### Search Query
   - Before: 2.1s
   - After: 420ms
   - Improvement: 80% faster ✅ (target: 76%)
   ```

3. **Regression Testing**:
   Ensure optimization didn't break functionality:
   - Run all tests
   - Verify critical user flows
   - Check for any behavior changes
   - Test on different devices/browsers

4. **Load Testing** (if applicable):
   Test performance under load:
   ```bash
   # Load test with k6 or Apache Bench
   k6 run --vus 100 --duration 30s load-test.js
   ```

### Phase 6: Performance Budget & Monitoring

**Objective**: Prevent performance regressions

**Actions**:

1. **Set Performance Budgets**:
   Define maximum acceptable values:
   ```json
   {
     "budgets": {
       "lighthouse": {
         "performance": 90,
         "lcp": 2500,
         "fid": 100,
         "cls": 0.1
       },
       "bundle": {
         "initial_js": 150000,
         "total_js": 500000
       },
       "api": {
         "p95_response_time": 200,
         "p99_response_time": 500
       }
     }
   }
   ```

2. **CI/CD Performance Gates**:
   Add performance checks to CI/CD:
   ```yaml
   # .github/workflows/performance.yml
   - name: Performance Budget Check
     run: npm run lighthouse-ci
     # Fails build if performance below budget
   ```

3. **Production Monitoring**:
   Set up alerts for performance degradation:
   - Alert if LCP > 2.5s
   - Alert if API p95 > 200ms
   - Alert if error rate increases
   - Weekly performance reports

### Phase 7: Documentation

**Objective**: Document optimizations and learnings

**Actions**:

1. **Performance Optimization Documentation**:
   Create workspace/docs/performance/[optimization-name].md:
   ```markdown
   # Dashboard Performance Optimization

   ## Problem
   Dashboard was loading in 3.2s, target <2s

   ## Root Cause
   - Large JavaScript bundle (450KB)
   - Unoptimized images (2MB total)
   - N+1 query fetching user data

   ## Optimizations Applied
   1. Code splitting: Reduced initial bundle 450KB → 150KB
   2. Image optimization: WebP format, lazy loading, 2MB → 400KB
   3. Database query: Added eager loading, 12 queries → 1 query

   ## Results
   - Load time: 3.2s → 1.8s (44% improvement)
   - Bundle size: 450KB → 150KB (67% reduction)
   - Database queries: 12 → 1 (92% reduction)

   ## Performance Budget
   - LCP: <2.0s
   - Initial JS: <150KB
   - API response: <200ms

   ## Monitoring
   - Lighthouse CI on every deploy
   - Production monitoring with alerts
   ```

2. **Changelog Entry**:
   Add to .memory/version-history.md:
   ```markdown
   ## v1.2.5 (Planned - 2025-01-20)
   ### Performance
   - Dashboard now loads 44% faster (3.2s → 1.8s)
   - Reduced initial JavaScript bundle by 67%
   - API response times improved by 60%
   - Optimized database queries (12 → 1 per page load)
   ```

### Phase 8: Memory System Updates

**Objective**: Update memory with optimization context

**Memory Updates**:

1. **Update .memory/production-metrics.md**:
   ```markdown
   ## Performance Metrics - Dashboard

   ### Historical
   - 2025-01-15: LCP 3.2s, Bundle 450KB
   - 2025-01-20: LCP 1.8s, Bundle 150KB (44% improvement)

   ### Current Targets
   - LCP: <2.0s ✅
   - Bundle: <150KB ✅
   - API p95: <200ms ✅
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "current_work": {
       "type": "performance_optimization",
       "optimization": "dashboard-performance",
       "status": "complete",
       "target_version": "1.2.5",
       "metrics": {
         "lcp_improvement": "44%",
         "bundle_reduction": "67%",
         "api_improvement": "60%"
       }
     }
   }
   ```

### Phase 9: Return to Integration Pipeline

**Objective**: Hand off to quality assurance pipeline

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "perf: optimize dashboard performance

   - Implement code splitting (lazy load heavy components)
   - Optimize images (WebP format, lazy loading)
   - Fix N+1 query with eager loading
   - Add database index on frequently queried column

   Performance improvements:
   - Dashboard load time: 3.2s → 1.8s (44% faster)
   - Initial bundle size: 450KB → 150KB (67% smaller)
   - API response time: 450ms → 180ms (60% faster)

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin perf/[optimization-description]
   ```

2. **Update Project State**:
   ```json
   {
     "currentPhase": "integration",
     "active_workflow": "06-integration.md"
   }
   ```

3. **Route to Integration**:
   - Return control to pm-orchestrator
   - pm-orchestrator routes to 06-integration.md
   - Integration → Deployment → QA (with performance testing) → Release
   - After release: Monitor performance metrics closely

## Completion Criteria

- ✅ Performance problem identified and quantified
- ✅ Root cause analyzed with profiling
- ✅ Optimizations implemented
- ✅ Performance targets achieved
- ✅ No functional regressions
- ✅ Performance budgets set
- ✅ Monitoring and alerts configured
- ✅ Documentation complete
- ✅ Code committed to perf branch
- ✅ Memory system updated
- ✅ Ready for integration testing

## Return To

**Next Workflow**: 06-integration.md (integration testing with performance verification)

**After Full Pipeline**:
06-integration.md → 07-deployment.md → 08-quality-assurance.md (include performance tests) → release-management.md → Production → 09-continuous-development.md

## Performance Optimization Examples

### Example 1: Database Query Optimization

**Problem**: User list page takes 5 seconds to load

**Execution**:
1. Phase 1: Identify - Slow database query
2. Phase 2: Profile - EXPLAIN ANALYZE shows missing index, N+1 query
3. Phase 3: Design - Add index, implement eager loading
4. Phase 4: Implement
   - Add index on user.email column
   - Change query to use findMany with relations
5. Phase 5: Verify - Load time 5s → 400ms (92% improvement)
6. Phase 6: Set budget - API response <500ms
7. Phase 7: Document optimization
8. Phase 8: Memory updates (v1.2.4 → v1.2.5)
9. Phase 9: Return to integration pipeline

**Version**: v1.2.4 → v1.2.5 (PATCH)

### Example 2: Frontend Bundle Optimization

**Problem**: Initial page load slow, large JavaScript bundle

**Execution**:
1. Phase 1: Identify - 800KB initial bundle
2. Phase 2: Profile - webpack-bundle-analyzer shows large unused dependencies
3. Phase 3: Design - Code splitting, lazy loading, tree shaking
4. Phase 4: Implement
   - Implement React.lazy for heavy components
   - Remove unused dependencies
   - Configure webpack for better tree shaking
5. Phase 5: Verify - Bundle 800KB → 180KB (78% reduction), LCP 4s → 1.6s
6. Phase 6: Set budget - Initial bundle <200KB
7. Phase 7: Document optimization
8. Phase 8: Memory updates (v1.2.5 → v1.2.6)
9. Phase 9: Return to integration pipeline

**Version**: v1.2.5 → v1.2.6 (PATCH)

## Common Issues and Resolutions

**Issue**: Optimization breaks functionality
**Resolution**: Rollback optimization, redesign approach, add more tests before optimizing

**Issue**: Performance improvement not measurable
**Resolution**: Better profiling needed, focus on bottlenecks with bigger impact

**Issue**: Optimization improves one metric but degrades another
**Resolution**: Balance trade-offs, prioritize based on user impact

**Issue**: Performance regression after deployment
**Resolution**: Rollback if severe, investigate root cause, add performance tests to CI/CD

## Success Metrics

- Target performance improvement achieved (quantified)
- No functional regressions
- Performance budgets set and monitored
- User-reported slowness reduced >50%
- Performance maintained over time (no regressions)
