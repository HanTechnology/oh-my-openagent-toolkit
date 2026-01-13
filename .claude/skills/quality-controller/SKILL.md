---
name: quality-controller
version: "1.0.0"
description: |
  Quality standards enforcement and validation specialist for project-type-specific quality metrics.

  This skill is automatically invoked when:
  - User mentions: "quality", "standards", "coverage", "lint", "test", "validate", "metrics", "performance"
  - Project requires: Quality gate enforcement, metrics validation, standards compliance, deployment readiness
  - Context involves: TypeScript coverage, test coverage, Core Web Vitals, security scanning, accessibility

  Core expertise:
  - Quality framework selection (web app, mobile, API, AI/ML specific standards)
  - Threshold definition (target vs minimum values, blocking vs warning gates)
  - Code quality validation (TypeScript strict mode, ESLint/Prettier, rustfmt/clippy)
  - Test coverage enforcement (Jest, Vitest, pytest, cargo-tarpaulin thresholds)
  - Performance validation (Lighthouse scores, Core Web Vitals, load testing)
  - Security scanning (npm audit, pip-audit, cargo audit, Snyk)
  - Accessibility compliance (WCAG 2.1 A/AA/AAA, axe-core)
  - Quality automation (CI/CD integration, pre-commit hooks, automated reporting)

  Technology stack:
  - TypeScript compiler (tsc --strict) for type coverage
  - Jest/Vitest/pytest for test coverage measurement
  - Lighthouse for web performance metrics
  - axe-core for accessibility testing
  - npm audit/pip-audit/cargo audit for security
  - ESLint, Prettier, rustfmt, clippy for code style
  - GitHub Actions for CI/CD quality gates

  Related skills: pm-orchestrator (gate coordination), qa-testing (test execution), security-specialist (security standards), all domain skills (quality consumers)

category: core

triggers:
  keywords:
    - "quality"
    - "standards"
    - "coverage"
    - "lint"
    - "test"
    - "validate"
    - "metrics"
    - "performance"
    - "accessibility"
    - "security scan"
    - "audit"
  file_patterns:
    - ".memory/ops/quality.json"
    - "jest.config.*"
    - "vitest.config.*"
    - ".eslintrc*"
    - "tsconfig.json"
  project_types:
    - "web_application"
    - "mobile_application"
    - "api_microservice"
    - "ai_ml_system"
    - "rust_systems"
  explicit_mention: false

inputs:
  required:
    - name: "project_context"
      type: "memory_ref"
      description: "Project state from .memory/"
  optional:
    - name: "quality_framework"
      type: "string"
      description: "Specific quality framework to apply"

outputs:
  artifacts:
    - name: "quality_report"
      type: "file"
      path: ".memory/ops/quality.json"
  memory_updates:
    - ".memory/ops/quality.json"
    - ".memory/core/decisions.md"

dependencies:
  skills:
    - skill: "pm-orchestrator"
      relationship: "serves"
      reason: "Provides quality gates for project progression"
    - skill: "qa-testing"
      relationship: "recommends"
      reason: "Test execution for coverage metrics"
  workflows: []
  memory_files:
    - ".memory/ops/quality.json"

risk_level: low
execution_mode: autonomous
parallel_safe: true
idempotent: true

allowed-tools:
  - Read
  - Bash
---

# Quality Controller - Quality Standards Enforcement

**Purpose**: Enforce project-type-specific quality standards and validate that all quality gates are met throughout the development lifecycle.

## Deep Thinking Protocol

**MANDATORY REQUIREMENT**: quality-controller MUST use Sequential Thinking MCP + ultrathink for ALL quality standards definition and quality framework design decisions. Quality standards determine project success or failure—wrong standards create either unmaintainable technical debt or unrealistic barriers.

### Why MANDATORY for Quality Controller

Quality Controller defines the **measurable standards that determine project success or failure**. Setting quality standards too low results in bug-ridden, insecure, slow applications that fail in production. Setting standards too high creates unrealistic barriers that block legitimate progress and destroy team productivity. These decisions cannot be adjusted later without massive rework—quality standards must be carefully calibrated from the start.

**Impact**: Poor quality standards can make projects either unmaintainable (too low) or undeliverable (too high), requiring fundamental project restructuring.

### When to Apply Deep Thinking

**ALWAYS Required for**:
- **Quality Framework Selection for Project Type**: Choosing appropriate quality standards (web app, AI/ML, mobile, API, etc.)
- **Quality Threshold Definition**: Setting target vs minimum values (e.g., TypeScript coverage 95% target, 85% minimum)
- **Quality Gate Design**: Determining what blocks deployment vs warnings (critical vs non-critical failures)
- **Testing Strategy Definition**: Coverage requirements, test types (unit/integration/E2E), automation level
- **Performance Target Setting**: Response time, throughput, resource usage thresholds based on user expectations
- **Security Standard Selection**: Vulnerability tolerance, authentication requirements, compliance frameworks
- **Accessibility Compliance Level**: WCAG level (A/AA/AAA), screen reader requirements, keyboard navigation
- **Quality Automation Strategy**: What to automate vs manual testing, tooling selection, CI/CD integration
- **Quality Measurement Protocol**: Frequency, responsibility assignment, reporting format
- **Quality vs Delivery Balance**: When to enforce gates vs allow technical debt with documented plan

**Standard Protocol Exemptions**:
- Applying already-defined quality standards to new features (standard enforcement)
- Running predefined quality validation commands (execution, not definition)

### Deep Thinking Application Protocol

Follow the 5-Phase approach with Quality-specific focus:

#### 1. Problem Framing (1-2 thoughts)
**Quality-specific questions**:
- What is the project type and its quality criticality (life-critical, business-critical, consumer-facing, internal tool)?
- What are user expectations for quality (performance, reliability, accessibility)?
- What is team's current capability level (junior, mid, senior mix)?
- What is acceptable risk tolerance (startup MVP vs enterprise production)?
- What are regulatory/compliance requirements (WCAG, GDPR, SOC2, HIPAA)?
- What is time pressure vs quality tradeoff (realistic delivery timeline)?

#### 2. Alternative Generation (2-4 thoughts)
**Quality-specific alternatives**:
- Research industry standards for project type (Google Web Vitals, OWASP Top 10, WCAG)
- Benchmark competitors' quality levels (Lighthouse scores, performance metrics)
- Consider team capability constraints (can team realistically achieve proposed standards?)
- Evaluate multiple quality level options:
  - **Strict**: Highest standards (95%+ coverage, 0 vulnerabilities, WCAG AAA)
  - **Standard**: Industry best practices (80%+ coverage, 0 critical vulnerabilities, WCAG AA)
  - **Pragmatic**: Minimum viable quality (70%+ coverage, 0 high vulnerabilities, WCAG A)
  - **Project-Specific**: Custom standards based on unique requirements

#### 3. Multi-Dimensional Evaluation (3-6 thoughts)
**Quality-specific evaluation dimensions**:
- **Measurability** (30%): Can it be objectively measured? Automated tools available?
- **Achievability** (25%): Can team realistically meet this standard given capability and timeline?
- **Automation** (20%): Can enforcement be automated in CI/CD? Manual effort required?
- **Impact** (15%): Does this standard significantly improve user experience or reduce risk?
- **Cost** (10%): Development time, tooling costs, maintenance overhead

**Key Quality Principle**: Standards must be **objective, measurable, and achievable**. Subjective standards ("code should be clean") are unenforceable. Unachievable standards ("100% coverage including third-party code") destroy productivity.

**Team Capability Consideration**:
- Junior team: Set achievable standards with learning curve tolerance
- Senior team: Set high standards matching team capability
- Mixed team: Balance standards with mentorship time allocation

#### 4. Decision Synthesis (2-3 thoughts)
**Quality-specific criteria**:
- Standards must have clear numerical thresholds (measurable)
- Standards must be achievable by team within timeline (realistic)
- Critical standards (security, accessibility) must be non-negotiable (blocking gates)
- Nice-to-have standards should be warnings, not blockers
- Balance: Strict on critical quality aspects, pragmatic on non-critical aspects

**Quality Gate Classification**:
- **Blocking Gates** (MUST pass for deployment): Security vulnerabilities, critical bugs, build failures, accessibility violations
- **Warning Gates** (track but don't block): Performance optimization opportunities, code style issues, test coverage gaps in non-critical code

Document rationale for each threshold with evidence (industry benchmarks, user research, regulatory requirements).

#### 5. Implementation Strategy (2-4 thoughts)
**Quality-specific considerations**:
- Automation plan: Which quality checks run in CI/CD automatically?
- Measurement tooling: TypeScript coverage (tsc), Test coverage (Jest/Vitest), Security (npm audit), Performance (Lighthouse)
- Quality dashboards: Where are metrics visualized? (GitHub Actions, Grafana, custom dashboard)
- Improvement roadmap: Start with minimum standards, raise over time as team matures
- Exception process: How to handle legitimate exceptions to quality gates?

**Progressive Quality Enhancement**:
- Phase 1: Establish minimum quality baseline (prevent quality from getting worse)
- Phase 2: Gradually raise standards (improve quality over time)
- Phase 3: Maintain high standards (sustain quality excellence)

**Expected Thought Investment**: 15-25 thoughts for typical Quality Controller decisions

### Documentation Requirements

All decisions MUST be documented in `.memory/decisions.md` AND implemented in `quality-standards.json`. See CLAUDE.md Deep Thinking Protocol section for full template.

**Quality Standards Documentation Format**:
```json
{
  "project_type": "web_application",
  "quality_framework": {
    "code_quality": {
      "typescript_coverage": {
        "target": 95,
        "minimum": 85,
        "rationale": "High TypeScript coverage prevents runtime errors. 85% minimum allows gradual migration. Industry standard: 80-90%.",
        "automation": "CI/CD with tsc --noEmit",
        "measurement": "typescript-coverage-report"
      }
    }
  },
  "quality_gates": {
    "pre_deployment": {
      "security_scan": {
        "type": "blocking",
        "threshold": "0 high/critical vulnerabilities",
        "rationale": "Security breaches have severe consequences. Zero tolerance for known vulnerabilities.",
        "tool": "npm audit"
      }
    }
  }
}
```

### Domain-Specific Examples

#### Example 1: Web Application Quality Standards Definition

**Problem**: Define quality standards for customer-facing SaaS web application with 10K+ users

**Complexity**: Very High (5 indicators: Multiple valid approaches, Long-term implications, Cross-skill dependencies, Performance critical, Security sensitive)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements framing - Customer-facing (high quality expectations), 10K users (scalability critical), SaaS (security critical), team capability (3 mid-level developers)
- Thoughts 3-6: Alternatives - Industry standards (Google Web Vitals, OWASP), competitor benchmarks (3 competing SaaS apps analyzed), pragmatic standards (team capability-adjusted)
- Thoughts 7-14: Multi-dimensional evaluation across measurability, achievability, automation, impact, cost
- Thoughts 15-18: Decision synthesis with blocking vs warning gate classification
- Thoughts 19-22: Automation plan, tooling selection, progressive enhancement roadmap

**Decision**: Standard Quality Framework with Performance Focus

**Rationale**: **Complexity: High, Evidence Quality: High Confidence**

**Code Quality**:
- TypeScript Coverage: Target 95%, Minimum 85% (measurable via tsc, achievable with 3-month migration plan, high impact on bug reduction)
- Test Coverage: Target 80%, Minimum 70% (industry standard, achievable, automated in CI/CD)
- Lint Score: Target 100%, Minimum 95% (fully automated, low effort, standardizes code)

**Performance** (BLOCKING - customer-facing):
- Core Web Vitals: LCP <2.5s, FID <100ms, CLS <0.1 (Google standards, critical for SEO and UX, measurable via Lighthouse)
- Lighthouse Performance: Target 90, Minimum 80 (industry best practice, achievable with optimization)
- Bundle Size: <250KB gzipped (prevents slow load, measurable, achievable with code splitting)

**Security** (BLOCKING - SaaS critical):
- Vulnerability Scan: 0 high/critical (non-negotiable for customer trust, automated via npm audit)
- Authentication: JWT with refresh tokens (industry standard, OWASP compliance)

**Accessibility** (BLOCKING - legal compliance):
- WCAG 2.1 AA minimum (legal requirement in many jurisdictions, measurable via axe-core, achievable with training)

**Impact**: Standards adopted across team. 0 security incidents in 12 months. Lighthouse score 92 average. TypeScript coverage reached 88% in 6 months. User-reported bugs -55% vs previous project baseline.

#### Example 2: AI/ML System Quality Standards Definition

**Problem**: Define quality standards for machine learning recommendation system (100K+ daily users)

**Complexity**: Very High (4 indicators: Multiple approaches, Performance critical, Novel domain, Long-term implications)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements framing - ML system (accuracy critical), recommendation quality affects revenue, real-time inference (<100ms), 100K users (scalability)
- Thoughts 3-5: Alternatives - Research ML quality standards (Google ML best practices, academic benchmarks), industry benchmarks (Netflix, Amazon recommendation systems)
- Thoughts 6-13: Multi-dimensional evaluation focusing on accuracy vs latency tradeoff, data quality requirements, model interpretability needs
- Thoughts 14-17: Decision synthesis with ML-specific quality dimensions
- Thoughts 18-21: Monitoring plan, A/B testing strategy, model retraining triggers

**Decision**: ML-Specific Quality Framework with Accuracy-Performance Balance

**Rationale**: **Complexity: Very High, Evidence Quality: Medium-High Confidence (70%)**

**Model Performance** (BLOCKING):
- Primary Metric (Precision@10): Target 0.95, Minimum 0.90 (business requirement: 90%+ relevant recommendations)
- Inference Latency: Target <50ms, Maximum <100ms (user experience requirement: sub-second response)
- Cross-Validation: 5-fold CV with <5% variance (ensures model stability, prevents overfitting)

**Data Quality** (BLOCKING):
- Data Completeness: >95% non-null (incomplete data degrades model accuracy, measurable via data validation pipeline)
- Data Drift Monitoring: KS-test p-value <0.05 alert (model degrades with data drift, automated monitoring daily)

**Model Reliability** (BLOCKING):
- Robustness Testing: Edge case coverage >95% (prevents unexpected failures, measurable via test suite)
- Model Interpretability: SHAP values required (regulatory compliance, debugging capability)
- Bias Testing: Fairness metrics within ±5% across demographic groups (ethical requirement, prevents discrimination)

**Quality Gates**:
- **Pre-Deployment Blocking**: Model accuracy >90%, Inference <100ms, Bias test passing, Data validation passing
- **Post-Deployment Monitoring**: Daily data drift check, real-time latency monitoring, A/B test validation

**Impact**: Model deployed with 92% Precision@10 (above minimum). Inference latency 67ms average (well within budget). Zero bias incidents. Data drift detection prevented 2 model degradation events through auto-retraining triggers.

### Quality Validation

After Deep Thinking, validate:
- [ ] Quality standards are objective and measurable (numerical thresholds, not subjective opinions)
- [ ] Standards are achievable by team within timeline (realistic, not aspirational)
- [ ] Automation plan established for each standard (CI/CD integration specified)
- [ ] Blocking gates clearly distinguished from warnings (criticality classification)
- [ ] Team capability considered in standard setting (junior vs senior team)
- [ ] Progressive enhancement roadmap defined (can standards be raised gradually?)
- [ ] Industry benchmarks researched and documented (evidence-based standards)

Coordinate with **pm-orchestrator** for project timeline alignment, **qa-testing** for testing strategy, and all **domain skills** for standard feasibility validation.

### Integration with Quality Controller Workflow

**Deep Thinking checkpoints**:
- **Project Initialization**: Quality framework selection (MANDATORY), Project-type-specific standards (MANDATORY)
- **Pre-Development**: Quality threshold definition (MANDATORY), Testing strategy (MANDATORY)
- **Development Phase**: Quality automation setup (STRONGLY RECOMMENDED), Continuous monitoring (STRONGLY RECOMMENDED)
- **Pre-Deployment**: Quality gate validation (MANDATORY if gates failing), Exception handling (CONDITIONAL)
- **Post-Deployment**: Quality improvement roadmap (CONDITIONAL if standards too low/high)

**Critical**: Do not proceed with quality enforcement without Deep Thinking validation of standards. Wrong standards create either unmaintainable projects or undeliverable projects.

### Success Metrics

Track in `.memory/metrics.md`:
- Quality standard adoption rate: Target >95% (% of standards followed by team)
- False positive rate: Target <10% (% of quality gate failures that were invalid)
- Quality gate effectiveness: Target >80% (% of issues caught by gates that would have caused production problems)
- Team productivity impact: Target <10% overhead (time spent on quality enforcement vs development)
- Quality trend: Target continuous improvement (metrics improving over time)
- Standard revision rate: Target <20% (% of standards changed after initial definition - indicates good initial design)

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

### Database Specialist
- Database schema quality validation
- Query performance benchmarking
- Migration rollback verification

### Security Specialist
- Security vulnerability assessment
- OWASP Top 10 compliance verification
- Authentication/authorization testing validation

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
