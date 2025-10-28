# QA Testing - Technical Reference

> **Purpose**: Technical reference for the qa-testing skill in the autonomous skills-based development system.
> **Related Skills**: frontend-nextjs, backend-nestjs, backend-fastapi, fullstack-integration, devops-deployment, mcp-tools-orchestrator
> **Examples**: See examples/ directory for production-ready testing patterns.

---

## QA Testing Skill Guidelines

### Core Testing Responsibilities
**CRITICAL**: Use Playwright MCP ONLY for all E2E testing (NO external testing packages)

**Primary Quality Assurance Areas**
- **End-to-End Testing**: Comprehensive E2E testing using Playwright MCP for core user flows
- **Performance Testing**: Core Web Vitals, load testing, and optimization analysis
- **Accessibility Compliance**: WCAG 2.1 AA standards validation and screen reader testing
- **Security Testing**: Vulnerability assessment and security validation
- **Cross-Browser Testing**: Multi-browser and device compatibility validation
- **Integration Testing**: API testing, component integration, and system validation

### Testing Technology Stack
**Required Testing Tools and Frameworks**
- **Primary E2E Framework**: Playwright MCP (NEVER external packages)
- **Performance Tools**: Core Web Vitals metrics, Lighthouse analysis
- **Accessibility Tools**: Screen readers, WCAG compliance checkers
- **Security Tools**: Security scanning and vulnerability assessment
- **API Testing**: REST/GraphQL endpoint validation and performance testing
- **Cross-Browser**: Chrome, Firefox, Safari, Edge compatibility testing

### Quality Gates and Standards
**Mandatory Quality Criteria**
- **Zero Critical Defects**: All critical issues must be resolved before release
- **Performance Standards**: Core Web Vitals (LCP<2.5s, FID<100ms, CLS<0.1)
- **Accessibility Compliance**: WCAG 2.1 AA standards minimum compliance
- **Cross-Browser Support**: 95% functionality across major browsers
- **API Performance**: Response times under 200ms for critical endpoints
- **Test Coverage**: Minimum 80% coverage for critical user journeys

---

## Production Examples

This skill provides comprehensive testing examples in the `examples/` directory:

### Available Examples

#### 01. E2E Test Suite with Playwright MCP (`examples/01-e2e-test-suite.md`)
- **Demonstrates**: Complete end-to-end testing using Playwright MCP exclusively
- **Key Patterns**: YAML-based test definitions, Page Object Model, user flow testing
- **Integration**: CI/CD integration, automated test execution, failure reporting
- **Technologies**: Playwright MCP tools, test assertions, screenshot comparison
- **Use when**: Implementing comprehensive E2E test coverage

#### 02. Accessibility Testing (`examples/02-accessibility-testing.md`)
- **Demonstrates**: WCAG 2.1 AA compliance testing and validation
- **Key Patterns**: Automated accessibility scanning, keyboard navigation, screen reader testing
- **Integration**: Color contrast validation, ARIA compliance, semantic HTML
- **Technologies**: Accessibility tools, WCAG checkers, screen reader compatibility
- **Use when**: Ensuring accessibility standards compliance

#### 03. Performance Testing (`examples/03-performance-testing.md`)
- **Demonstrates**: Core Web Vitals measurement and performance optimization
- **Key Patterns**: Lighthouse audits, load testing, resource optimization validation
- **Integration**: Performance budgets, continuous monitoring, optimization recommendations
- **Technologies**: Lighthouse, performance APIs, load testing tools
- **Use when**: Validating and optimizing application performance

### Using These Examples
- Examples include complete test suite implementations
- Full Playwright MCP integration patterns
- CI/CD pipeline integration examples
- Cross-references with frontend-nextjs, backend-nestjs, backend-fastapi, and devops-deployment
- Production-ready testing patterns following best practices

---

## Skill Coordination

### Autonomous Operation
This skill operates with **complete autonomy**, requiring **zero user confirmations** for:
- Test strategy design and implementation
- Test framework configuration (Playwright MCP)
- Quality gates and acceptance criteria
- Performance and accessibility standards enforcement

### Skill Invocation Context
This skill is automatically invoked by Claude when:
- User requests involve: "testing", "QA", "quality", "E2E", "accessibility", "performance"
- Related skills mention: "qa-testing skill" in their outputs
- Context matches: test implementation, quality validation, performance testing

### Cross-Skill Collaboration
Coordinates with related skills through natural language mentions:

**frontend-nextjs**:
- UI component testing with Playwright MCP
- Accessibility compliance validation (WCAG 2.1 AA)
- Performance testing (Core Web Vitals)
- Cross-browser compatibility testing

**backend-nestjs** (TypeScript):
- API endpoint testing with Supertest
- Integration testing coordination
- Performance validation (response times <200ms)
- Security testing (authentication, authorization)

**backend-fastapi** (Python):
- API endpoint testing with pytest + httpx.AsyncClient
- Async integration testing patterns
- Performance validation (response times <200ms)
- Security testing (OAuth2, JWT validation)

**fullstack-integration**:
- End-to-end integration testing
- System validation and smoke tests
- User journey testing
- Production readiness validation

**devops-deployment**:
- CI/CD pipeline test integration
- Pre-deployment validation
- Production monitoring setup
- Performance benchmarking

**quality-controller**:
- Quality standards enforcement
- Metrics validation
- Release criteria verification
- Compliance reporting

**mcp-tools-orchestrator**:
- Playwright MCP advanced usage
- GitHub MCP for issue creation
- Test automation optimization
- Tool coordination patterns

### Coordination Pattern
Skills coordinate through:
1. **Natural Language Mentions**: Mentioning skill names triggers automatic invocation
2. **Shared Memory System**: All context shared through .memory/ directory
3. **Autonomous Invocation**: Claude automatically invokes skills with full context
4. **Zero User Confirmation**: All coordination happens autonomously

---

## Testing Implementation Approach

### E2E Testing with Playwright MCP
```javascript
// Example E2E test structure
test('Critical user journey validation', async ({ page }) => {
  await page.goto('/');
  // Core user flow testing
  await expect(page.getByRole('heading')).toBeVisible();
  // Accessibility validation
  await page.keyboard.press('Tab');
  // Performance monitoring
  const metrics = await page.evaluate(() => performance.getEntriesByType('navigation'));
});
```

### **Performance Testing Standards**
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Load Testing**: Handle 100+ concurrent users
- **API Performance**: Response times under 200ms for critical endpoints
- **Resource Optimization**: Minimize bundle size and optimize images

### **Accessibility Compliance**
- **WCAG 2.1 AA Standards**: Full compliance validation
- **Screen Reader Testing**: VoiceOver, NVDA, JAWS compatibility
- **Keyboard Navigation**: Complete keyboard accessibility
- **Color Contrast**: 4.5:1 ratio minimum for normal text

### **Security Testing**
- **Input Validation**: SQL injection and XSS prevention
- **Authentication Testing**: JWT token validation and session management
- **Authorization Testing**: Role-based access control validation
- **Data Protection**: Sensitive data handling and encryption validation

---

## Quality Metrics and Reporting

### Testing Metrics
- **Test Coverage**: Percentage of code/functionality covered by tests
- **Defect Density**: Number of defects per component/module
- **Test Execution Rate**: Percentage of tests passing vs. failing
- **Performance Metrics**: Response times, throughput, resource utilization

### Quality Reporting
- **Daily Quality Status**: Testing progress and issue summary
- **Weekly Quality Report**: Comprehensive quality metrics and trends
- **Release Quality Assessment**: Go/no-go decision support documentation
- **Post-Release Quality Review**: Performance and issue analysis

---

## Related Skills and Resources

**Related Skills**:
- **frontend-nextjs**: UI testing, accessibility validation, performance testing
- **backend-nestjs**: API testing (TypeScript), integration testing, security validation
- **backend-fastapi**: API testing (Python), pytest patterns, async testing
- **fullstack-integration**: End-to-end testing, system validation
- **devops-deployment**: CI/CD integration, deployment testing, monitoring
- **quality-controller**: Quality standards enforcement, metrics validation
- **mcp-tools-orchestrator**: Playwright MCP coordination, advanced tool usage

**Main System Guide**:
- **CLAUDE.md**: System-wide guidelines and autonomous skills coordination

**Production Examples**: See examples/ directory for testing patterns

---

This technical reference guide supports Playwright MCP (EXCLUSIVE), WCAG 2.1 AA compliance, Core Web Vitals standards, and the autonomous skills-based development system.