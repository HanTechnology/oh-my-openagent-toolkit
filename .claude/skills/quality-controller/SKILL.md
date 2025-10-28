---
name: quality-controller
description: "Quality standards enforcement and validation for project-type-specific quality metrics. Use when: validating code quality and standards, checking performance metrics, enforcing quality gates, measuring compliance with quality frameworks, validating TypeScript coverage, Core Web Vitals, test coverage, security standards. Ensures projects meet defined quality thresholds before progression."
allowed-tools:
  - Read
  - Bash
---

# Quality Controller - Quality Standards Enforcement

**Purpose**: Enforce project-type-specific quality standards and validate that all quality gates are met throughout the development lifecycle.

## Quality Frameworks by Project Type

This skill implements comprehensive quality frameworks defined in **quality-standards.json** for each project type:

### 1. Web Application Quality Standards

#### Code Quality
- **TypeScript Coverage**: Target 95%, Minimum 85%
  - Validation: `cd workspace/frontend && npx tsc --noEmit && npx typescript-coverage-report`
- **Test Coverage**: Target 80%, Minimum 70%
  - Validation: `cd workspace/frontend && npm run test:coverage`
- **Lint Score**: Target 100%, Minimum 95%
  - Validation: `cd workspace/frontend && npm run lint && npm run format:check`
- **Build Success**: Mandatory pass
  - Validation: `cd workspace/frontend && npm run build`

#### Performance
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
  - Tools: Lighthouse, web-vitals
- **Lighthouse Scores**:
  - Performance: Target 90, Minimum 80
  - Accessibility: Target 100, Minimum 95
  - Best Practices: Target 100, Minimum 90
  - SEO: Target 100, Minimum 90
- **Bundle Size**: < 250KB (gzipped)
  - Tools: webpack-bundle-analyzer, next-bundle-analyzer
- **API Response Time**: < 200ms (95th percentile)
  - Tools: k6, artillery, jest-performance

#### Security
- **Vulnerability Scan**: 0 high/critical vulnerabilities
  - Validation: `npm audit --audit-level moderate`
- **Authentication**: Required with OWASP standards
- **Data Validation**: Input sanitization, SQL injection prevention, XSS prevention required

#### Accessibility
- **WCAG Compliance**: WCAG 2.1 AA minimum
  - Automated Testing: axe-core
  - Manual Testing: Required
- **Screen Reader**: NVDA, JAWS, VoiceOver compatibility required
- **Keyboard Navigation**: Full accessibility required

### 2. AI/ML System Quality Standards

#### Model Performance
- **Accuracy Metrics**:
  - Primary Metric Target: 0.95, Minimum: 0.90
  - Validation Accuracy Target: 0.93, Minimum: 0.88
  - Cross-Validation: 5 folds, < 5% variance
- **Inference Performance**:
  - Latency Target: < 100ms (95th percentile)
  - Throughput Target: > 100 requests/second
  - Memory Usage Target: < 2GB peak usage

#### Data Quality
- **Data Validation**:
  - Completeness: > 95% non-null values
  - Accuracy: > 98% validation against ground truth
  - Consistency: > 99% format and type consistency
- **Data Drift Monitoring**:
  - Statistical Tests: KS-test, PSI
  - Alert Threshold: p-value < 0.05
  - Monitoring Frequency: Daily

#### Model Reliability
- **Robustness Testing**: Adversarial testing required, edge case coverage > 95%
- **Model Interpretability**: Feature importance, SHAP/LIME explainability required
- **Ethical Considerations**: Bias testing, fairness metrics, ethical review completed

### 3. Mobile Application Quality Standards

#### Performance
- **App Launch Time**:
  - Cold Start: < 3s
  - Warm Start: < 1s
  - Measurement: Time to interactive
- **Memory Usage**: Target < 150MB, Maximum < 200MB (peak usage)
- **Battery Efficiency**: Minimal impact measured
- **Network Efficiency**: Optimized data usage, graceful offline degradation

#### Compatibility
- **Device Support**: iOS 13+, Android API 21+, all standard screen sizes
- **Platform Integration**: Proper native features implementation
- **Platform Guidelines**: HIG (iOS) / Material Design (Android) compliance

### 4. API/Microservice Quality Standards

#### API Design
- **REST Compliance**: Proper HTTP methods, correct status codes, RESTful naming
- **Documentation**: OpenAPI spec complete and accurate, comprehensive examples
- **Versioning**: Semantic versioning, backward compatibility maintained

#### Performance
- **Response Time**: Target < 200ms (95th percentile)
- **Throughput**: Target > 1000 RPS sustained load
- **Availability**: Target 99.9% uptime

#### Security
- **Authentication**: JWT/OAuth2 implementation
- **Authorization**: RBAC implemented, comprehensive permission checks
- **Data Protection**: Encryption at rest and in transit (TLS 1.3)

### 5. Data Processing System Quality Standards

#### Data Quality
- **Completeness**: > 95% non-null values
- **Accuracy**: > 98% validation against ground truth
- **Consistency**: > 99% format and type consistency
- **Timeliness**: Processing within defined SLAs

#### Performance
- **Processing Throughput**: Meets project-specific requirements
- **Latency**: Processing delay within acceptable bounds
- **Scalability**: Linear scaling characteristics validated

### 6. Desktop Application Quality Standards

#### Performance
- **Launch Time**: < 5s to interactive
- **Memory Usage**: Efficient for desktop environment
- **Responsiveness**: UI remains responsive under load

#### Compatibility
- **Platform Support**: Windows, macOS, Linux as specified
- **Cross-Platform**: Consistent functionality across platforms

## Quality Gates

Quality gates block project progression until standards are met:

### Pre-Development Quality Setup
- Requirements clarity: Acceptance criteria defined
- Technical specifications: Documented
- Quality requirements: Established

### Development Phase
- **Code Review**: Required approvals, automated checks passing, manual review completed
- **Continuous Testing**: Unit tests passing, integration tests passing, quality metrics meeting targets

### Pre-Deployment
- **Comprehensive Testing**: E2E tests passing, performance tests meeting targets, security scan no critical issues
- **Deployment Readiness**: Build success confirmed, environment config validated, rollback plan prepared

### Post-Deployment
- **Monitoring**: Error tracking configured, performance monitoring active, user feedback collected
- **Quality Metrics**: SLA compliance monitored, user satisfaction measured, business metrics tracked

## Quality Measurement Protocols

### Automated Measurement
- **Frequency**: Every commit/build
- **Tools Integration**: CI/CD pipeline
- **Failure Handling**: Block deployment on critical failures

### Manual Measurement
- **Frequency**: Weekly/milestone
- **Responsible Skills**: QA skill + relevant domain skills
- **Documentation**: Required for all manual checks

### Continuous Monitoring
- **Production Metrics**: Real-time
- **Alerting**: Configured for all critical metrics
- **Dashboard**: Accessible to all team members

## Quality Validation Commands

### Web Application
```bash
# TypeScript Coverage
cd workspace/frontend && npx tsc --noEmit && npx typescript-coverage-report
# Expected: 95% coverage

# Test Coverage
cd workspace/frontend && npm run test:coverage
# Expected: 80% coverage

# Lint and Format
cd workspace/frontend && npm run lint && npm run format:check
# Expected: No errors

# Build
cd workspace/frontend && npm run build
# Expected: Successful build

# Security Scan
npm audit --audit-level moderate
# Expected: 0 high/critical vulnerabilities

# Lighthouse (requires running server)
npx lighthouse http://localhost:3000 --output=json --quiet --chrome-flags="--headless"
# Expected: Performance 90+, Accessibility 95+
```

### API/Microservice
```bash
# API Tests
cd workspace/backend && npm run test:api
# Expected: All tests passing

# Load Testing
k6 run load-test.js
# Expected: < 200ms response time, > 1000 RPS

# Security Scan
npm audit --audit-level moderate
# Expected: 0 high/critical vulnerabilities

# API Documentation Validation
npx @redocly/cli lint workspace/specs/openapi.yaml
# Expected: No errors
```

### AI/ML System
```python
# Model Accuracy Evaluation
python evaluate_model.py --target-accuracy 0.90
# Expected: >90% on validation set

# Inference Latency Test
python benchmark_inference.py --max-latency 100
# Expected: <100ms 95th percentile

# Data Quality Check
python validate_data.py --completeness 0.95
# Expected: >95% data completeness

# Bias Testing
python test_fairness.py
# Expected: Fairness metrics within acceptable range
```

## Integration with Other Skills

### PM Orchestrator
- Reports quality status for decision-making
- Blocks progression if critical quality gates fail
- Provides quality metrics for project state

### Domain Skills (Frontend, Backend, etc.)
- Request quality validation before task completion
- Example: "Before completing component development, validate TypeScript coverage with quality-controller"
- Receive quality feedback and fix issues

### QA Testing
- Collaborates closely with QA for comprehensive validation
- QA performs detailed testing, quality-controller enforces standards
- Combined approach ensures thorough quality assurance

### Memory Manager
- Updates quality metrics in .memory/project-state.json
- Triggers quality trend logging via memory-logging integration

### DevOps Deployment
- Pre-deployment quality gate validation
- Ensures quality standards met before production deployment

## Quality Reporting

When quality validation is requested:

```
Quality Validation Report
========================

Project Type: web_application
Validation Date: 2025-01-21T15:45:00Z

Code Quality:
  ✅ TypeScript Coverage: 94% (Target: 95%, Minimum: 85%)
  ✅ Test Coverage: 87% (Target: 80%, Minimum: 70%)
  ✅ Lint Score: 100% (Target: 100%, Minimum: 95%)
  ✅ Build: SUCCESS

Performance:
  ⏳ Core Web Vitals: Not yet measured (requires deployment)
  ⏳ Lighthouse: Not yet measured (requires deployment)
  ✅ Bundle Size: 180KB gzipped (Target: < 250KB)
  ⏳ API Response Time: Not yet measured (backend pending)

Security:
  ✅ Vulnerability Scan: 0 high/critical (Target: 0)
  ⏳ Authentication: Implementation in progress
  ⏳ Data Validation: Implementation in progress

Accessibility:
  ⏳ WCAG Compliance: Not yet tested
  ⏳ Screen Reader: Not yet tested
  ⏳ Keyboard Navigation: Not yet tested

Overall Quality Status: IN PROGRESS
Critical Blockers: None
Warnings: Performance and accessibility testing pending deployment
Next Steps: Complete authentication implementation, deploy to staging for performance testing
```

## Quality Improvement

Quality controller not only enforces standards but also tracks improvements:

### Feedback Loops
- **Metrics Review**: Weekly
- **Process Improvement**: Retrospective-based
- **Standards Evolution**: Quarterly review

### Benchmarking
- **Internal Comparison**: Track trends over time
- **Industry Standards**: Compare with best practices
- **Competitive Analysis**: When applicable

## Configuration File

This skill uses **quality-standards.json** which contains:

- **quality_frameworks**: Complete definitions for all 6 project types
- **quality_gates**: Pre-development, development, pre-deployment, post-deployment
- **measurement_protocols**: Automated, manual, continuous monitoring
- **quality_improvement**: Feedback loops, benchmarking, training

## Related Skills

- **pm-orchestrator**: Coordinates quality enforcement throughout project
- **qa-testing**: Performs detailed testing, works with quality-controller for validation
- **memory-manager**: Records quality metrics and trends
- **project-detector**: Provides project type for appropriate quality framework
- All domain skills: Request quality validation before task completion

## Output Guidelines

- Provide clear pass/fail status for each quality metric
- Show target vs. actual values
- Identify critical blockers vs. warnings
- Suggest next steps for quality improvement
- Use consistent symbols: ✅ (pass), ❌ (fail), ⏳ (pending), ⚠️ (warning)
