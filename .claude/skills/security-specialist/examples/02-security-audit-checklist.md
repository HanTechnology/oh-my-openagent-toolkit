# Security Audit Checklist Example

**Comprehensive Security Review Process**

> **When to Use**: Pre-deployment security review, periodic security audits, compliance checks
> **Skill**: security-specialist
> **Related**: devops-deployment (infrastructure), qa-testing (security tests)

---

## Audit Scope

This checklist covers a typical web application security audit following OWASP guidelines.

---

## 1. Authentication Security

### Password Handling

| Check | Status | Notes |
|-------|--------|-------|
| Passwords hashed with bcrypt/argon2 | [ ] | Cost factor >= 12 |
| No plaintext passwords in logs | [ ] | Check all log statements |
| No passwords in URLs | [ ] | POST only for auth |
| Password policy enforced | [ ] | Min 12 chars, complexity |
| Password reset secure | [ ] | Time-limited tokens |
| Account lockout implemented | [ ] | After N failed attempts |

### Token Security

| Check | Status | Notes |
|-------|--------|-------|
| JWT secret >= 256 bits | [ ] | Check env config |
| Access token expiry <= 15 min | [ ] | Short-lived |
| Refresh token rotation | [ ] | One-time use |
| Token revocation works | [ ] | Test logout |
| No sensitive data in JWT payload | [ ] | Only ID, roles |
| Algorithm explicitly set (HS256/RS256) | [ ] | Prevent algorithm confusion |

### Session Management

| Check | Status | Notes |
|-------|--------|-------|
| Session timeout configured | [ ] | Idle and absolute |
| Secure cookie flags | [ ] | HttpOnly, Secure, SameSite |
| Session invalidation on logout | [ ] | Server-side |
| Session fixation prevented | [ ] | New session on auth |

**Verification Commands**:

```bash
# Check JWT configuration
grep -r "expiresIn\|signOptions" src/

# Check bcrypt cost factor
grep -r "bcrypt\|SALT_ROUNDS" src/

# Check cookie settings
grep -r "cookie\|httpOnly\|secure\|sameSite" src/
```

---

## 2. Authorization Security

### Access Control

| Check | Status | Notes |
|-------|--------|-------|
| All endpoints protected by default | [ ] | Deny by default |
| RBAC/ABAC implemented correctly | [ ] | Guards on all routes |
| Resource ownership validated | [ ] | User can only access own data |
| Admin functions protected | [ ] | Role check on admin routes |
| Horizontal privilege escalation prevented | [ ] | Can't access other users' data |
| Vertical privilege escalation prevented | [ ] | Can't elevate own roles |

**Test Scenarios**:

```typescript
// Test: User A cannot access User B's data
describe('Authorization', () => {
  it('should deny access to other user resources', async () => {
    const userAToken = await loginAs('userA');
    const userBResourceId = 'user-b-resource-id';
    
    const response = await request(app)
      .get(`/api/resources/${userBResourceId}`)
      .set('Authorization', `Bearer ${userAToken}`);
    
    expect(response.status).toBe(403);
  });

  it('should deny admin actions for regular users', async () => {
    const userToken = await loginAs('regularUser');
    
    const response = await request(app)
      .delete('/api/admin/users/123')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(response.status).toBe(403);
  });
});
```

---

## 3. Input Validation

### Data Validation

| Check | Status | Notes |
|-------|--------|-------|
| All inputs validated (DTOs) | [ ] | class-validator |
| Input length limits enforced | [ ] | MaxLength decorators |
| Input type validation | [ ] | IsString, IsNumber, etc. |
| Email format validation | [ ] | IsEmail decorator |
| UUID format validation | [ ] | IsUUID for IDs |
| Enum values validated | [ ] | IsEnum decorator |
| Nested objects validated | [ ] | ValidateNested + Type |

### Injection Prevention

| Check | Status | Notes |
|-------|--------|-------|
| SQL injection prevented | [ ] | Parameterized queries |
| NoSQL injection prevented | [ ] | Type checking on queries |
| Command injection prevented | [ ] | No shell execution with user input |
| LDAP injection prevented | [ ] | If LDAP used |
| XPath injection prevented | [ ] | If XML processing used |

**Verification**:

```typescript
// SQL Injection Test
describe('SQL Injection Prevention', () => {
  it('should handle malicious input safely', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .get('/api/users')
      .query({ search: maliciousInput });
    
    // Should not error, should return empty or filtered results
    expect(response.status).toBe(200);
    
    // Verify table still exists
    const users = await userRepository.find();
    expect(users.length).toBeGreaterThan(0);
  });
});
```

---

## 4. Output Encoding

### XSS Prevention

| Check | Status | Notes |
|-------|--------|-------|
| HTML output encoded | [ ] | DOMPurify or similar |
| JSON responses properly typed | [ ] | No raw HTML in JSON |
| User content sanitized | [ ] | Before storage and display |
| CSP headers configured | [ ] | script-src restrictions |
| X-XSS-Protection header | [ ] | Via Helmet |

**Test**:

```typescript
describe('XSS Prevention', () => {
  it('should sanitize HTML in user content', async () => {
    const maliciousContent = '<script>alert("xss")</script><b>bold</b>';
    
    const response = await request(app)
      .post('/api/comments')
      .send({ content: maliciousContent })
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.body.content).not.toContain('<script>');
    expect(response.body.content).toContain('<b>bold</b>'); // Safe tags allowed
  });
});
```

---

## 5. Security Headers

### HTTP Headers

| Header | Expected Value | Status |
|--------|----------------|--------|
| Content-Security-Policy | Restrictive policy | [ ] |
| X-Content-Type-Options | nosniff | [ ] |
| X-Frame-Options | DENY | [ ] |
| X-XSS-Protection | 1; mode=block | [ ] |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | [ ] |
| Referrer-Policy | strict-origin-when-cross-origin | [ ] |
| Permissions-Policy | Restrictive | [ ] |

**Verification**:

```bash
# Check security headers
curl -I https://your-app.com/api/health

# Expected output should include:
# content-security-policy: default-src 'self'...
# x-content-type-options: nosniff
# x-frame-options: DENY
# strict-transport-security: max-age=31536000; includeSubDomains
```

---

## 6. CORS Configuration

| Check | Status | Notes |
|-------|--------|-------|
| Origins explicitly whitelisted | [ ] | No wildcard in production |
| Credentials require specific origin | [ ] | Not with wildcard |
| Methods restricted | [ ] | Only needed methods |
| Headers restricted | [ ] | Only needed headers |
| Preflight caching configured | [ ] | maxAge set |

**Verification**:

```bash
# Test CORS preflight
curl -X OPTIONS https://api.your-app.com/api/users \
  -H "Origin: https://your-app.com" \
  -H "Access-Control-Request-Method: POST" \
  -I

# Verify origin is not wildcard with credentials
curl -X OPTIONS https://api.your-app.com/api/users \
  -H "Origin: https://malicious-site.com" \
  -I
# Should NOT include Access-Control-Allow-Origin for unknown origins
```

---

## 7. Dependency Security

### Vulnerability Scanning

| Check | Status | Notes |
|-------|--------|-------|
| npm audit clean (no critical/high) | [ ] | `npm audit` |
| No known vulnerable packages | [ ] | Snyk/Dependabot |
| Dependencies up to date | [ ] | Within 6 months |
| Lock file committed | [ ] | package-lock.json |
| No unnecessary dependencies | [ ] | Audit package.json |

**Commands**:

```bash
# NPM audit
npm audit

# Check for outdated packages
npm outdated

# Snyk scan (if available)
npx snyk test

# Check for unused dependencies
npx depcheck
```

---

## 8. Secrets Management

| Check | Status | Notes |
|-------|--------|-------|
| No secrets in code | [ ] | `git secrets --scan` |
| No secrets in logs | [ ] | Audit log statements |
| Environment variables for secrets | [ ] | .env not in git |
| .env.example has no real values | [ ] | Only placeholders |
| Secrets rotated periodically | [ ] | Documented schedule |
| Different secrets per environment | [ ] | Dev/staging/prod |

**Verification**:

```bash
# Scan for secrets in git history
git secrets --scan-history

# Or use gitleaks
gitleaks detect --source . --verbose

# Check for common patterns
grep -r "password\|secret\|api_key\|private_key" src/ --include="*.ts" | grep -v "process.env"
```

---

## 9. Error Handling

| Check | Status | Notes |
|-------|--------|-------|
| No stack traces in production | [ ] | Generic error messages |
| No sensitive data in errors | [ ] | No passwords, tokens |
| Errors logged server-side | [ ] | With context for debugging |
| Consistent error format | [ ] | Standard error DTOs |
| 500 errors don't leak info | [ ] | Generic message |

**Test**:

```typescript
describe('Error Handling', () => {
  it('should not expose stack traces in production', async () => {
    const response = await request(app)
      .get('/api/cause-error')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.body.stack).toBeUndefined();
    expect(response.body.message).not.toContain('at ');
    expect(response.body.message).not.toContain('.ts:');
  });
});
```

---

## 10. Logging & Monitoring

### Security Logging

| Check | Status | Notes |
|-------|--------|-------|
| Authentication events logged | [ ] | Success and failure |
| Authorization failures logged | [ ] | With user context |
| Input validation failures logged | [ ] | With sanitized input |
| Admin actions logged | [ ] | Full audit trail |
| Logs don't contain sensitive data | [ ] | No passwords/tokens |
| Log injection prevented | [ ] | Sanitize log inputs |

### Alerting

| Check | Status | Notes |
|-------|--------|-------|
| Failed login threshold alert | [ ] | > N failures/hour |
| Brute force detection | [ ] | Same IP/email patterns |
| Unusual activity alerts | [ ] | Off-hours admin access |
| Error rate alerts | [ ] | Spike in 500 errors |

---

## 11. Rate Limiting

| Check | Status | Notes |
|-------|--------|-------|
| Global rate limit configured | [ ] | Per IP/user |
| Auth endpoints rate limited | [ ] | Strict limits |
| API endpoints rate limited | [ ] | Reasonable limits |
| Rate limit headers returned | [ ] | X-RateLimit-* |
| Rate limit bypass prevented | [ ] | Can't circumvent with headers |

**Verification**:

```bash
# Test rate limiting
for i in {1..20}; do
  curl -w "%{http_code}\n" -o /dev/null -s \
    -X POST https://api.your-app.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
# Should see 429 responses after limit exceeded
```

---

## 12. File Upload Security

| Check | Status | Notes |
|-------|--------|-------|
| File type validation | [ ] | Whitelist extensions |
| File size limits | [ ] | Reasonable max size |
| Filename sanitization | [ ] | Remove path chars |
| Storage outside webroot | [ ] | Or use CDN |
| Virus scanning | [ ] | If handling user uploads |
| No execution permissions | [ ] | On uploaded files |

---

## Audit Report Template

```markdown
# Security Audit Report

**Application**: [App Name]
**Date**: [YYYY-MM-DD]
**Auditor**: [Name/Team]
**Scope**: [Full/Partial - specify areas]

## Executive Summary

- **Critical Issues**: X
- **High Issues**: X
- **Medium Issues**: X
- **Low Issues**: X
- **Passed Checks**: X/Y

## Critical Findings

### [CRIT-001] [Title]
- **Category**: Authentication/Authorization/Input Validation/etc.
- **Location**: [File/Endpoint]
- **Description**: [What was found]
- **Impact**: [What could happen]
- **Remediation**: [How to fix]
- **Priority**: Immediate

## Recommendations

1. [Prioritized list of actions]

## Appendix

- Full checklist results
- Test evidence
- Tool output
```

---

## Related Examples

- **JWT Implementation**: `01-jwt-authentication.md`
- **Backend Security**: `backend-nestjs/examples/01-authentication-module.md`
- **Deployment Security**: `devops-deployment/examples/03-production-deployment.md`
