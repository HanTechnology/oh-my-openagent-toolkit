# Quality Controller - Technical Reference

> **Purpose**: Technical reference for the quality-controller skill in the autonomous skills-based development system.
> **Related Skills**: pm-orchestrator (coordination), memory-manager (metrics tracking), qa-testing (validation), all skills (quality enforcement)
> **Configuration**: quality-standards.json defines all quality frameworks and standards.

---

## Quality Controller Skill Guidelines

### Core Responsibilities

**CRITICAL**: Operate with complete autonomy for quality standards enforcement

**Quality Standards Management**
- **Project-Type-Specific Standards**: Enforce standards from quality-standards.json
- **Quality Gate System**: Manage checkpoints blocking progression until standards met
- **Metrics Tracking**: Monitor code quality, performance, security, accessibility
- **Continuous Validation**: Automated and manual quality checks
- **Quality Improvement**: Track trends and drive quality improvements

**Technology Leadership**
- Autonomous quality standard enforcement
- Quality gate decision-making
- Metrics threshold management
- Performance benchmark validation

### Ultimate Goals
- **Production-ready quality** across all deliverables
- **Zero user confirmations required** for quality decisions
- Seamless integration with all skills for continuous quality validation

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Quality standard establishment for project type
- Quality gate pass/fail decisions
- Metrics threshold enforcement
- Performance benchmark validation
- Security vulnerability assessment
- Accessibility compliance checking

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- pm-orchestrator initializes project (quality standards setup)
- Any skill requests quality validation
- Quality gate checkpoints reached
- Deployment readiness validation needed
- Context matches: quality validation, standards enforcement

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**pm-orchestrator**:
- Receives project type for quality framework selection
- Establishes quality standards at project start
- Provides quality gate validation at workflow transitions
- Reports quality metrics for project oversight

**memory-manager**:
- Updates quality metrics in .memory/project-state.json
- Triggers quality log entries for trend analysis
- Provides historical quality data

**qa-testing**:
- Coordinates test coverage validation
- Validates E2E test results against quality standards
- Ensures comprehensive quality validation

**All Specialist Skills**:
- Provides quality validation on request
- Enforces domain-specific quality standards
- Tracks quality metrics for skill deliverables

### Coordination Pattern
1. **Natural Language Mentions**: Skills mention quality-controller for validation
2. **Automatic Checkpoints**: Quality gates at workflow transitions
3. **Metrics Tracking**: Continuous quality metrics monitoring
4. **Zero User Confirmation**: All quality enforcement autonomous

---

## Quality Standards Overview

The quality-controller skill enforces project-type-specific quality standards defined in **quality-standards.json**. This file contains comprehensive quality frameworks for 6 project types.

## Framework Structure

Each project type has a quality framework with these categories:

### Code Quality
Metrics related to code health and maintainability:
- Type coverage (TypeScript, static typing)
- Test coverage (unit, integration, E2E)
- Lint scores and code style compliance
- Build success and compilation

### Performance
Metrics related to runtime performance:
- Load times and response times
- Core Web Vitals (for web applications)
- Throughput and latency
- Resource utilization (memory, CPU, network)

### Security
Metrics related to application security:
- Vulnerability scans and dependency audits
- Authentication and authorization implementation
- Data protection and encryption
- Security testing and compliance

### Accessibility (Web/Mobile)
Metrics related to user accessibility:
- WCAG compliance level
- Screen reader compatibility
- Keyboard navigation support
- Color contrast ratios

### Platform-Specific Metrics
Additional metrics specific to project type:
- Model accuracy and inference performance (AI/ML)
- App store readiness (mobile)
- API design compliance (microservices)
- Data quality metrics (data processing)

## Quality Gate System

Quality gates are checkpoints that block progression until standards are met:

### Gate Levels
1. **Pre-Development**: Requirements and specifications ready
2. **Development**: Code quality and continuous testing standards
3. **Pre-Deployment**: Comprehensive testing and readiness checks
4. **Post-Deployment**: Monitoring and ongoing quality validation

### Gate Enforcement
- **Blocking Gates**: Critical failures prevent progression
- **Warning Gates**: Non-critical issues flagged for attention
- **Informational**: Metrics tracked but don't block

## Measurement Protocols

### Automated Measurement
- Frequency: Every commit/build via CI/CD
- Blocking: Deployment blocked on critical failures
- Tools: Integrated into build pipeline

### Manual Measurement
- Frequency: Weekly or at milestones
- Responsibility: QA skill + domain skills
- Documentation: Required for audit trails

### Continuous Monitoring
- Frequency: Real-time in production
- Alerting: Configured for critical metric violations
- Dashboard: Accessible to all team members

## Quality Metrics by Project Type

### Web Application
**Primary Metrics**:
- TypeScript Coverage: 95%
- Core Web Vitals: LCP<2.5s, FID<100ms, CLS<0.1
- Lighthouse: Performance 90+, Accessibility 95+
- Security: 0 high/critical vulnerabilities

**Validation Commands**:
- `npx tsc --noEmit && npx typescript-coverage-report`
- `npm run test:coverage`
- `npm run lint && npm run format:check`
- `npm audit --audit-level moderate`

### AI/ML System
**Primary Metrics**:
- Model Accuracy: >90% validation
- Inference Latency: <100ms 95th percentile
- Data Completeness: >95%
- Model Interpretability: Required (SHAP/LIME)

**Validation Commands**:
- `python evaluate_model.py --target-accuracy 0.90`
- `python benchmark_inference.py --max-latency 100`
- `python validate_data.py --completeness 0.95`

### Mobile Application
**Primary Metrics**:
- Cold Start: <3s
- Memory Usage: <150MB target
- Platform Compliance: HIG/Material Design
- Battery Efficiency: Optimized

### API/Microservice
**Primary Metrics**:
- Response Time: <200ms 95th percentile
- Throughput: >1000 RPS
- Availability: 99.9%
- OpenAPI Documentation: Complete

### Data Processing System
**Primary Metrics**:
- Data Accuracy: >98%
- Processing Throughput: Meets SLA
- Error Handling: Comprehensive
- Monitoring: Real-time

### Desktop Application
**Primary Metrics**:
- Launch Time: <5s
- Cross-Platform: Consistent functionality
- Performance: Responsive under load

## Quality Improvement Framework

### Feedback Loops
- **Metrics Review**: Weekly team review of quality trends
- **Process Improvement**: Retrospective-based adjustments
- **Standards Evolution**: Quarterly review and updates

### Benchmarking
- **Internal Comparison**: Track improvement over time
- **Industry Standards**: Compare with best practices
- **Competitive Analysis**: Learn from similar projects

### Training and Development
- **Quality Awareness**: Team training on standards
- **Tools Proficiency**: Skill development on quality tools
- **Best Practices Sharing**: Knowledge transfer

## Integration Patterns

### With PM Orchestrator
```
pm-orchestrator → quality-controller: "Validate web app quality standards"
quality-controller → analysis: Run TypeScript coverage, lint, tests
quality-controller → pm-orchestrator: "Quality Report: 3/4 gates passed, 1 pending"
pm-orchestrator → decision: Allow progression with pending performance tests
```

### With Domain Skills
```
frontend-nextjs → quality-controller: "Validate component quality before completion"
quality-controller → validation: TypeScript coverage check
quality-controller → frontend-nextjs: "[PASS] TypeScript: 94%, [FAIL] Tests: 0%, [PENDING] Accessibility"
frontend-nextjs → action: Fix test coverage before marking complete
```

### With Memory Manager
```
quality-controller → memory-manager: "Update quality metrics in project state"
memory-manager → update: .memory/project-state.json quality_metrics section
memory-manager → logging: Trigger .logs/quality/quality-metrics-{date}.log entry
memory-manager → quality-controller: "Metrics recorded and logged"
```

### With DevOps Deployment
```
devops-deployment → quality-controller: "Pre-deployment quality gate check"
quality-controller → comprehensive-validation: All quality gates
quality-controller → devops-deployment: "[PASS] All gates passed, deployment approved"
devops-deployment → proceed: Execute deployment
```

## Quality Standards Configuration

The **quality-standards.json** file structure:

```json
{
  "version": "1.0",
  "quality_frameworks": {
    "web_application": { "categories": {...} },
    "ai_ml_system": { "categories": {...} },
    "mobile_application": { "categories": {...} },
    "api_microservice": { "categories": {...} },
    "data_processing_system": { "categories": {...} },
    "desktop_application": { "categories": {...} }
  },
  "quality_gates": {
    "pre_development": {...},
    "development": {...},
    "pre_deployment": {...},
    "post_deployment": {...}
  },
  "measurement_protocols": {
    "automated_measurement": {...},
    "manual_measurement": {...},
    "continuous_monitoring": {...}
  },
  "quality_improvement": {
    "feedback_loops": {...},
    "benchmarking": {...},
    "training_and_development": {...}
  }
}
```

Refer to quality-standards.json for complete metric definitions, thresholds, and validation commands for each project type.

## Best Practices

### For Skills Requesting Validation
1. Request validation at logical checkpoints (not too frequently)
2. Specify which metrics are most relevant
3. Address failures before requesting re-validation
4. Document quality improvements in decisions.md

### For Quality Enforcement
1. Provide actionable feedback (not just pass/fail)
2. Distinguish critical failures from warnings
3. Track quality trends over time
4. Celebrate quality improvements

### For Project Success
1. Establish quality standards early
2. Automate measurement where possible
3. Regular quality reviews
4. Continuous improvement mindset

---

## Related Skills and Resources

**Related Skills**:
- **pm-orchestrator**: Coordinates quality standard establishment and quality gate validation
- **memory-manager**: Tracks quality metrics in .memory/ and .logs/ for trend analysis
- **qa-testing**: Executes tests and provides results for quality validation
- **devops-deployment**: Coordinates pre-deployment quality gate checks
- **All specialist skills**: Request quality validation and address quality issues

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Configuration**: quality-standards.json defines all quality frameworks, metrics, thresholds, and validation commands

---

This technical reference guide supports project-type-specific quality standards enforcement, quality gate management, and the autonomous skills-based development system.
