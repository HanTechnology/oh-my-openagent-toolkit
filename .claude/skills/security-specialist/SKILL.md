---
name: security-specialist
version: "1.0.0"
description: "Application security expert for vulnerability assessment, secure coding practices, and security architecture. Use when: implementing authentication/authorization, handling sensitive data, fixing security vulnerabilities, conducting security reviews, or configuring security headers."
category: domain

triggers:
  keywords:
    - "security"
    - "authentication"
    - "authorization"
    - "vulnerability"
    - "CVE"
    - "OWASP"
    - "XSS"
    - "CSRF"
    - "SQL injection"
    - "encryption"
    - "secrets"
    - "JWT"
    - "OAuth"
    - "RBAC"
    - "permissions"
    - "password"
    - "hash"
    - "SSL"
    - "TLS"
    - "HTTPS"
    - "CORS"
    - "CSP"
    - "security headers"
  file_patterns:
    - "**/auth/**"
    - "**/security/**"
    - "**/*.guard.ts"
    - "**/middleware/auth*"
    - "**/.env*"
  project_types:
    - "web_application"
    - "api_microservice"
    - "mobile_application"
  explicit_mention: false

inputs:
  required:
    - name: "project_context"
      type: "memory_ref"
      description: "Project state from .memory/"
  optional:
    - name: "vulnerability_report"
      type: "file"
      description: "Security scan results (npm audit, pip-audit, etc.)"

outputs:
  artifacts:
    - name: "security_report"
      type: "file"
      path: "workspace/docs/security-report.md"
    - name: "security_config"
      type: "file"
      path: "workspace/backend/src/security/"
  memory_updates:
    - ".memory/domains/backend.md"
    - ".memory/core/decisions.md"
    - ".memory/ops/quality.json"

dependencies:
  skills:
    - skill: "backend-nestjs"
      relationship: "recommends"
      reason: "Security implementations require backend changes"
    - skill: "backend-fastapi"
      relationship: "recommends"
      reason: "Security implementations require backend changes"
    - skill: "devops-deployment"
      relationship: "recommends"
      reason: "Security configuration in deployment"
  workflows: []
  memory_files:
    - ".memory/core/project.json"

risk_level: critical
execution_mode: supervised
parallel_safe: true
idempotent: true

allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# Security Specialist

**Purpose**: Expert-level application security covering vulnerability assessment, secure coding practices, authentication/authorization design, and security architecture.

## Output Directory

**CRITICAL**: All security artifacts MUST be placed in `workspace/` directory structure.

- Security reports → `workspace/docs/security-report.md`
- Security configurations → `workspace/backend/src/security/`
- Audit logs → `workspace/docs/security-audits/`

**Security Output Structure**:
```
workspace/
├── docs/
│   ├── security-report.md         # Security assessment report
│   └── security-audits/           # Audit history
│       └── audit-YYYY-MM-DD.md
├── backend/
│   └── src/
│       └── security/              # Security implementations
│           ├── guards/
│           │   ├── jwt-auth.guard.ts
│           │   └── roles.guard.ts
│           ├── decorators/
│           │   └── roles.decorator.ts
│           ├── strategies/
│           │   └── jwt.strategy.ts
│           └── security.module.ts
└── .github/
    └── workflows/
        └── security-scan.yml      # Automated security scanning
```

## Core Competencies

### 1. Authentication & Authorization
- Multi-factor authentication (MFA)
- OAuth 2.0 / OpenID Connect
- JWT token security
- Session management
- Role-Based Access Control (RBAC)
- Attribute-Based Access Control (ABAC)

### 2. Vulnerability Assessment
- OWASP Top 10 coverage
- Dependency vulnerability scanning
- Code security review
- Penetration testing guidance

### 3. Secure Coding
- Input validation and sanitization
- Output encoding
- Secure data handling
- Cryptography best practices

### 4. Security Architecture
- Defense in depth
- Zero trust principles
- Secrets management
- Security headers configuration

### 5. Compliance Guidance
- GDPR considerations
- PCI DSS basics
- SOC 2 awareness
- Privacy by design

## OWASP Top 10 Coverage

### A01:2021 - Broken Access Control

**Prevention**:
```typescript
// NestJS Guard Example
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some(role => user.roles?.includes(role));
  }
}

// Usage
@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Delete(':id')
async deleteUser(@Param('id') id: string) { ... }
```

**Checklist**:
- [ ] Deny by default
- [ ] Validate ownership for resource access
- [ ] Log access control failures
- [ ] Rate limit API endpoints
- [ ] Invalidate sessions on logout

### A02:2021 - Cryptographic Failures

**Prevention**:
```typescript
// Password Hashing
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Data Encryption
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

function encrypt(text: string, key: Buffer): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}
```

**Checklist**:
- [ ] Use bcrypt/argon2 for passwords (cost factor >= 12)
- [ ] Use AES-256-GCM for encryption
- [ ] Never store secrets in code
- [ ] Use TLS 1.2+ for data in transit
- [ ] Rotate encryption keys periodically

### A03:2021 - Injection

**Prevention**:
```typescript
// SQL Injection Prevention (TypeORM)
// BAD
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD - Parameterized query
const user = await userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getOne();

// NoSQL Injection Prevention (MongoDB)
// BAD
db.users.find({ email: req.body.email });

// GOOD - Validate input type
if (typeof email !== 'string') throw new BadRequestException();
db.users.find({ email: String(email) });
```

**Checklist**:
- [ ] Use parameterized queries (ORM/prepared statements)
- [ ] Validate and sanitize all inputs
- [ ] Use allowlists for input validation
- [ ] Escape output appropriately

### A04:2021 - Insecure Design

**Prevention**:
- Threat modeling during design phase
- Security requirements in user stories
- Defense in depth architecture
- Fail securely (deny by default)

### A05:2021 - Security Misconfiguration

**Prevention**:
```typescript
// NestJS Security Configuration
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

// CORS Configuration
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

**Checklist**:
- [ ] Remove default credentials
- [ ] Disable unnecessary features
- [ ] Configure security headers
- [ ] Review cloud permissions
- [ ] Keep dependencies updated

### A06:2021 - Vulnerable Components

**Prevention**:
```bash
# Regular dependency auditing
npm audit
npm audit fix

# Python
pip-audit
safety check

# Automated in CI/CD
# .github/workflows/security.yml
- name: Security Audit
  run: |
    npm audit --audit-level=high
    npx snyk test
```

**Checklist**:
- [ ] Regular dependency updates
- [ ] Automated vulnerability scanning
- [ ] Remove unused dependencies
- [ ] Monitor CVE databases

### A07:2021 - Authentication Failures

**Prevention**:
```typescript
// JWT Configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET, // Min 256 bits
  signOptions: {
    expiresIn: '15m', // Short-lived access tokens
    algorithm: 'HS256',
  },
};

// Refresh Token Implementation
@Injectable()
export class AuthService {
  async refreshTokens(refreshToken: string) {
    // Verify refresh token
    const payload = this.verifyRefreshToken(refreshToken);
    
    // Check if token is revoked
    const isRevoked = await this.tokenRepository.isRevoked(refreshToken);
    if (isRevoked) throw new UnauthorizedException('Token revoked');
    
    // Rotate refresh token (one-time use)
    await this.tokenRepository.revoke(refreshToken);
    
    // Issue new tokens
    return this.generateTokens(payload.userId);
  }
}

// Rate Limiting
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10, // 10 requests per minute
    }),
  ],
})
export class AuthModule {}
```

**Checklist**:
- [ ] Strong password policy (min 12 chars, complexity)
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Secure password recovery
- [ ] MFA for sensitive operations

### A08:2021 - Software and Data Integrity

**Prevention**:
- Verify package integrity (package-lock.json)
- Use Subresource Integrity (SRI) for CDN resources
- Sign and verify deployments
- Secure CI/CD pipeline

### A09:2021 - Security Logging and Monitoring

**Prevention**:
```typescript
// Security Event Logging
@Injectable()
export class SecurityLogger {
  private readonly logger = new Logger('Security');

  logAuthSuccess(userId: string, ip: string) {
    this.logger.log({
      event: 'AUTH_SUCCESS',
      userId,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logAuthFailure(email: string, ip: string, reason: string) {
    this.logger.warn({
      event: 'AUTH_FAILURE',
      email,
      ip,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  logAccessDenied(userId: string, resource: string, action: string) {
    this.logger.warn({
      event: 'ACCESS_DENIED',
      userId,
      resource,
      action,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Checklist**:
- [ ] Log authentication events
- [ ] Log access control failures
- [ ] Log input validation failures
- [ ] Centralized log management
- [ ] Alerting on suspicious activity

### A10:2021 - Server-Side Request Forgery (SSRF)

**Prevention**:
```typescript
// URL Validation
import { URL } from 'url';

function validateUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    
    // Block internal networks
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0'];
    const blockedPrefixes = ['10.', '172.16.', '192.168.', '169.254.'];
    
    if (blockedHosts.includes(url.hostname)) return false;
    if (blockedPrefixes.some(p => url.hostname.startsWith(p))) return false;
    
    // Only allow HTTPS
    if (url.protocol !== 'https:') return false;
    
    return true;
  } catch {
    return false;
  }
}
```

## Deep Thinking Protocol

**STRONGLY RECOMMENDED** for security decisions due to:
1. **High Stakes**: Security failures have severe consequences (data breaches, compliance violations)
2. **Complexity**: Attack vectors are numerous and evolving
3. **Irreversibility**: Security incidents cannot be undone

### When to Apply Deep Thinking

| Scenario | Complexity | Deep Thinking |
|----------|------------|---------------|
| Authentication system design | High | **Required** |
| Authorization model (RBAC/ABAC) | High | **Required** |
| Cryptographic implementation | Very High | **Mandatory** |
| Security vulnerability fix | Medium-High | Yes |
| Security header configuration | Medium | Optional |
| Input validation rules | Low-Medium | Optional |
| Security audit/review | High | **Required** |

### Evaluation Dimensions

- **Attack Surface** (30%): Exposure to potential attacks, threat vectors
- **Defense Depth** (25%): Layers of protection, fail-safe mechanisms
- **Compliance** (20%): OWASP, industry standards, regulatory requirements
- **Usability** (15%): Balance between security and user experience
- **Maintainability** (10%): Long-term security posture management

### Domain-Specific Example

#### JWT Authentication System Design

**Problem**: Design JWT-based authentication for a financial application handling sensitive user data

**Complexity**: Very High (4 indicators: High stakes, multiple attack vectors, compliance requirements, long-term implications)

**Deep Thinking Process**:
- Thoughts 1-2: Requirements - Financial data sensitivity, regulatory compliance, multi-platform support
- Thoughts 3-6: Alternatives - Session-based auth, JWT with refresh tokens, OAuth 2.0/OIDC, API keys
- Thoughts 7-12: Security analysis - Token theft mitigation, refresh token rotation, revocation strategy, algorithm selection
- Thoughts 13-16: OWASP alignment - A07 Authentication Failures coverage, rate limiting, logging
- Thoughts 17-20: Implementation - Token structure, expiry times, secure storage, monitoring

**Decision**: JWT with short-lived access tokens (15 min) + rotating refresh tokens with database-backed revocation

**Rationale**: **Evidence Quality: High Confidence (90%)**
- Attack surface: Minimal token exposure window (15 min), refresh rotation prevents replay
- Defense depth: Token revocation capability, rate limiting, security logging
- Compliance: OWASP A07 full coverage, audit trail for compliance
- Usability: Silent token refresh, seamless user experience
- Maintainability: Standard JWT libraries, well-documented patterns

**Impact**: Zero authentication-related security incidents in production. Passed SOC 2 audit. Session hijacking attempts detected and blocked through monitoring.

### Quality Validation

After Deep Thinking, validate:
- [ ] OWASP Top 10 relevant items addressed
- [ ] Attack vectors identified and mitigated
- [ ] Defense-in-depth implemented
- [ ] Monitoring and logging in place
- [ ] Compliance requirements met

Coordinate with **backend-nestjs/backend-fastapi** for implementation, **devops-deployment** for infrastructure security, and **quality-controller** for security testing standards.

### Success Metrics

Track in `.memory/metrics.md`:
- Security incidents: Target 0 critical/high
- Vulnerability response time: Target <24 hours for critical
- Authentication failure rate: Monitor for anomalies
- Security audit pass rate: Target 100%

## Security Review Procedure

```markdown
1. **Static Analysis**
   - Run linters with security rules (eslint-plugin-security)
   - Check for hardcoded secrets (detect-secrets, gitleaks)
   - Review dependency vulnerabilities

2. **Authentication Review**
   - Token generation and validation
   - Session management
   - Password policies
   - MFA implementation

3. **Authorization Review**
   - Access control consistency
   - Privilege escalation paths
   - Resource ownership validation

4. **Input Validation Review**
   - All user inputs validated
   - Proper output encoding
   - File upload restrictions

5. **Configuration Review**
   - Security headers
   - CORS policy
   - Error handling (no stack traces)
   - Logging configuration

6. **Infrastructure Review**
   - Network segmentation
   - Secrets management
   - TLS configuration
   - Firewall rules
```

## Quality Standards

### Security Requirements

| Requirement | Priority | Status |
|-------------|----------|--------|
| No critical vulnerabilities | Critical | Required |
| No high vulnerabilities | High | Required |
| Password hashing (bcrypt 12+) | Critical | Required |
| JWT expiry < 15min | High | Required |
| Rate limiting on auth | High | Required |
| Security headers (Helmet) | Medium | Required |
| Input validation | Critical | Required |
| Parameterized queries | Critical | Required |

### Security Metrics

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Critical CVEs | 0 | 1 | >1 |
| High CVEs | 0 | 1-2 | >2 |
| Auth failures/hour | <100 | 100-500 | >500 |
| Access denied/hour | <50 | 50-200 | >200 |

## Coordination with Other Skills

### With backend-nestjs / backend-fastapi
- Authentication module implementation
- Authorization guards/decorators
- Input validation pipes

### With frontend-nextjs
- CORS configuration
- CSP headers
- Secure cookie handling

### With devops-deployment
- Secrets management (environment variables)
- TLS certificate configuration
- WAF configuration

### With database-specialist
- Encryption at rest
- Access control
- Audit logging

## Memory Updates

After security work, update:

1. **`.memory/ops/quality.json`** - Security metrics
2. **`.memory/domains/backend.md`** - Security implementations
3. **`.memory/core/decisions.md`** - Security decisions

## Output Guidelines

- Document all security decisions with rationale
- Include CVE references when fixing vulnerabilities
- Provide before/after security posture comparison
- Never include actual secrets or credentials in documentation
- Use placeholders like `{{SECRET}}` for sensitive values

---

## Enterprise Standards Compliance

This skill follows team-wide enterprise standards.

**Required References** (`../ENTERPRISE-STANDARDS.md`):
- [Security Standards](../ENTERPRISE-STANDARDS.md#security-standards) - auth/authz, input validation, secrets management
- [Error Handling](../ENTERPRISE-STANDARDS.md#error-handling) - security event error handling
- [Logging Standards](../ENTERPRISE-STANDARDS.md#logging-standards) - security event logging (auth failures, access denied)
- [Git Conventions](../ENTERPRISE-STANDARDS.md#git-conventions) - security type commits

**Domain-Specific Standards** (see Quality Standards section in this document):
- OWASP Top 10 full coverage
- bcrypt cost factor >= 12
- JWT expiry < 15 minutes
- Rate limiting on auth endpoints
- Zero CVE vulnerability target
