# Security Patch Sub-Workflow

## Overview

- **Primary Skill**: pm-orchestrator (coordination), domain skills (implementation)
- **Parent Workflow**: 09-continuous-development.md
- **Work Type**: Security vulnerability fixes, security improvements
- **Version Impact**: PATCH (security fixes)
- **Priority**: High-Critical (depends on severity)
- **Return To**: 06-integration.md

## Purpose

Fix security vulnerabilities and implement security improvements. This workflow handles CVE patches, security audit findings, penetration test issues, and proactive security enhancements.

## Entry Conditions

- Routed from 09-continuous-development.md Phase 3
- Work type: Security patch
- Priority: High-Critical
- Version: Patch version increment
- Trigger: Security advisory, audit finding, vulnerability scan

## Workflow Steps

### Phase 1: Security Vulnerability Assessment

**Objective**: Understand the security issue

**Actions**:

1. **Read Security Context**:
   - Security advisory (CVE, GitHub Security Advisory)
   - Dependency vulnerability scan results
   - Security audit report
   - Penetration test findings
   - .memory/incident-log.md (if already exploited)

2. **Vulnerability Classification**:

   **By Severity** (CVSS score):
   - **CRITICAL (9.0-10.0)**: Immediate action required
   - **HIGH (7.0-8.9)**: Urgent action required
   - **MEDIUM (4.0-6.9)**: Schedule fix soon
   - **LOW (0.1-3.9)**: Track and plan fix

   **By Type**:
   - Dependency vulnerability (CVE in npm package)
   - Application vulnerability (XSS, SQL injection, CSRF)
   - Configuration issue (exposed secrets, weak permissions)
   - Infrastructure vulnerability (server misconfiguration)

3. **Impact Assessment**:
   - Is this being actively exploited? (check threat intelligence)
   - How many users/systems affected?
   - What data is at risk?
   - What is the attack vector?
   - Is there a public exploit available?
   - What is the business impact if exploited?

4. **Urgency Determination**:
   **CRITICAL - Use hotfix.md instead**:
   - Already being exploited in production
   - Public exploit available
   - Data breach in progress
   - System compromise

   **HIGH - Use security-patch.md (expedited)**:
   - High severity CVE
   - No active exploitation yet
   - Patch available from vendor
   - Affects production but not yet exploited

   **MEDIUM - Use security-patch.md (standard)**:
   - Medium severity CVE
   - No known exploits
   - Low likelihood of exploitation
   - Fix available

### Phase 2: Security Analysis & Research

**Objective**: Understand the vulnerability and fix options

**Actions**:

1. **Vulnerability Research**:
   - Read CVE details (nvd.nist.gov)
   - Check vendor security advisories
   - Review exploit databases (exploit-db.com)
   - Check if actively exploited (CISA KEV)
   - Research mitigation strategies

2. **Affected Code Identification**:
   - Which dependencies affected?
   - Which code paths vulnerable?
   - Which endpoints/features at risk?
   - Are there multiple instances?

3. **Fix Options Analysis**:

   **Dependency Vulnerability**:
   - Upgrade to patched version (preferred)
   - Apply vendor patch
   - Replace with alternative package
   - Mitigate with workaround (temporary)
   - Remove dependency if unused

   **Application Vulnerability**:
   - Input validation/sanitization
   - Output encoding
   - Authentication/authorization fixes
   - Security header configuration
   - Rate limiting/throttling

4. **Compatibility Check**:
   - Are there breaking changes in security patch?
   - Will upgrade affect other dependencies?
   - Database migration required?
   - API contract changes?

### Phase 3: Security Patch Design

**Objective**: Plan the security fix

**Actions**:

1. **Fix Strategy Selection**:

   **For Dependency Vulnerabilities**:
   ```bash
   # Check for security updates
   npm audit
   npm audit fix --force  # Careful with breaking changes

   # Or upgrade specific package
   npm upgrade package-name@latest
   ```

   **For Application Vulnerabilities**:
   - XSS: Implement proper output encoding, CSP headers
   - SQL Injection: Use parameterized queries, ORMs
   - CSRF: Implement CSRF tokens, SameSite cookies
   - Authentication: Strengthen password policies, implement MFA
   - Authorization: Implement proper access controls

2. **Skill Coordination**:
   Mention required skills:
   - Frontend security → **frontend-nextjs** or **mobile-react-native**
   - Backend security → **backend-nestjs** or **backend-fastapi**
   - Infrastructure security → **devops-deployment**

3. **Testing Strategy**:
   - How to verify vulnerability fixed?
   - Security testing approach
   - Regression testing needed

4. **Disclosure Handling**:
   - Do we need to notify users?
   - What information to disclose publicly?
   - Coordinate with security team
   - Follow responsible disclosure timeline

### Phase 4: Security Patch Implementation

**Objective**: Implement the security fix

**Actions**:

1. **Create Security Patch Branch**:
   ```bash
   git checkout -b security/[cve-or-description]
   ```

2. **Implement Security Fix**:
   Mention appropriate skill to implement:

   **Dependency Security Patch**:
   ```bash
   # Upgrade vulnerable dependency
   npm install vulnerable-package@8.2.1  # Patched version

   # Verify fix
   npm audit
   # Should show vulnerability resolved

   # Test application still works
   npm test
   ```

   **Application Security Patch**:
   ```typescript
   // Example: Fix XSS vulnerability
   // Before (vulnerable):
   element.innerHTML = userInput  // XSS!

   // After (fixed):
   element.textContent = userInput  // Safe

   // Example: Fix SQL injection
   // Before (vulnerable):
   await db.query(`SELECT * FROM users WHERE id = ${userId}`)  // SQL injection!

   // After (fixed):
   await db.query('SELECT * FROM users WHERE id = $1', [userId])  // Safe

   // Example: Implement CSP header
   app.use(helmet({
     contentSecurityPolicy: {
       directives: {
         defaultSrc: ["'self'"],
         scriptSrc: ["'self'", "'unsafe-inline'"],
         styleSrc: ["'self'", "'unsafe-inline'"],
         imgSrc: ["'self'", "data:", "https:"],
       },
     },
   }))
   ```

3. **Security Testing**:
   - Verify vulnerability fixed
   - Test attack vectors
   - Penetration testing (if major fix)
   - Automated security scanning

### Phase 5: Security Verification

**Objective**: Confirm vulnerability is fixed

**Actions**:

1. **Vulnerability Scan**:
   ```bash
   # Dependency vulnerability scan
   npm audit

   # OWASP dependency check
   dependency-check --scan .

   # Code security scanning
   npm run security-scan  # (if configured)
   ```

2. **Manual Security Testing**:
   Test specific vulnerability:
   - Try to reproduce exploit
   - Test attack vectors
   - Verify fix prevents exploitation
   - Test edge cases

3. **Regression Testing**:
   Ensure security fix didn't break functionality:
   - Run all tests
   - Test critical user flows
   - Verify API still works
   - Check for performance impact

4. **Security Audit** (for major fixes):
   - Internal security review
   - External penetration testing (if available)
   - Code review with security focus

### Phase 6: Documentation & Disclosure

**Objective**: Document fix and handle disclosure

**Actions**:

1. **Security Advisory Documentation**:
   Create workspace/docs/security/[cve-or-advisory].md:
   ```markdown
   # Security Advisory: CVE-2024-XXXXX

   ## Vulnerability
   Dependency `package-name` version <8.2.0 has XSS vulnerability

   ## Severity
   HIGH (CVSS 7.5)

   ## Affected Versions
   - v1.2.0 through v1.2.7

   ## Fixed Version
   - v1.2.8

   ## Mitigation
   Upgrade to v1.2.8 or later

   ## Details
   [Brief technical explanation without exposing exploit details]

   ## Timeline
   - 2025-01-18: Vulnerability disclosed
   - 2025-01-18: Patch implemented
   - 2025-01-19: Patch deployed to production
   - 2025-01-20: Public disclosure

   ## References
   - CVE-2024-XXXXX
   - GitHub Security Advisory: GHSA-xxxx
   ```

2. **Changelog Entry**:
   Add to .memory/version-history.md:
   ```markdown
   ## v1.2.8 (Security Patch - 2025-01-19)
   ### Security
   - **[HIGH]** Fixed XSS vulnerability in user input handling (CVE-2024-XXXXX)
   - Updated vulnerable dependency `package-name` to v8.2.1
   - Implemented Content Security Policy headers
   - Strengthened authentication token validation
   ```

3. **User Notification** (if warranted):
   - Notify users of security update
   - Recommend immediate upgrade (if self-hosted)
   - Provide security advisory link
   - No need to disclose exploit details

4. **Public Disclosure** (coordinate timing):
   - Wait until most users patched (if SaaS: immediate)
   - Follow responsible disclosure timeline
   - Publish security advisory
   - Update SECURITY.md if exists

### Phase 7: Memory System Updates

**Objective**: Update memory with security context

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Work
   - Security Patch: CVE-2024-XXXXX XSS fix
   - Status: Patch deployed to production
   - Target Version: v1.2.8
   - Severity: HIGH
   - Verification: Vulnerability scan clean
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "current_work": {
       "type": "security_patch",
       "vulnerability": "CVE-2024-XXXXX",
       "status": "deployed",
       "target_version": "1.2.8",
       "severity": "HIGH",
       "patched_date": "2025-01-19"
     }
   }
   ```

3. **Update .memory/incident-log.md** (if exploited):
   ```markdown
   ## [SECURITY] [2025-01-18] CVE-2024-XXXXX
   - Severity: HIGH
   - Vulnerability: XSS in user input
   - Impact: No known exploitation
   - Patch: v1.2.8
   - Status: Resolved
   ```

### Phase 8: Return to Integration Pipeline

**Objective**: Hand off to expedited quality assurance

**Actions**:

1. **Commit Changes**:
   ```bash
   git add .
   git commit -m "security: fix XSS vulnerability (CVE-2024-XXXXX)

   - Upgrade vulnerable-package to v8.2.1 (patched)
   - Implement proper input sanitization
   - Add Content Security Policy headers
   - Strengthen authentication token validation

   Severity: HIGH (CVSS 7.5)
   No known exploitation in our deployment

   Generated with Claude Code
   Co-Authored-By: Claude <noreply@anthropic.com>"
   git push origin security/[cve-or-description]
   ```

2. **Update Project State**:
   ```json
   {
     "currentPhase": "integration",
     "active_workflow": "06-integration.md",
     "expedited": true
   }
   ```

3. **Route to Expedited Pipeline**:
   - Return control to pm-orchestrator
   - pm-orchestrator routes to 06-integration.md (expedited)
   - Integration (security focus) → Deployment (expedited) → QA (security testing) → Release
   - After release: Monitor for issues, verify fix in production

## Completion Criteria

- ✅ Vulnerability identified and assessed
- ✅ Security fix implemented
- ✅ Vulnerability verified as fixed
- ✅ Security scans passing
- ✅ No regressions introduced
- ✅ Documentation complete
- ✅ User notification sent (if warranted)
- ✅ Code committed to security branch
- ✅ Memory system updated
- ✅ Ready for expedited deployment

## Return To

**Next Workflow**: 06-integration.md (expedited, security-focused testing)

**After Full Pipeline**:
06-integration.md (expedited) → 07-deployment.md (expedited) → 08-quality-assurance.md (security testing) → release-management.md → Production → 09-continuous-development.md

## Security Patch Examples

### Example 1: Dependency CVE

**Advisory**: npm package `lodash <4.17.21` has prototype pollution vulnerability (CVE-2020-8203)

**Execution**:
1. Phase 1: Assessment - HIGH severity, dependency vulnerability
2. Phase 2: Research - Patch available in lodash@4.17.21
3. Phase 3: Design - Upgrade lodash to 4.17.21
4. Phase 4: Implement - npm install lodash@4.17.21
5. Phase 5: Verify - npm audit shows vulnerability resolved
6. Phase 6: Document - Security advisory, changelog
7. Phase 7: Memory updates (v1.2.7 → v1.2.8)
8. Phase 8: Expedited deployment

**Version**: v1.2.7 → v1.2.8 (PATCH - security fix)

### Example 2: XSS Vulnerability

**Finding**: Penetration test discovered XSS in comment system

**Execution**:
1. Phase 1: Assessment - HIGH severity, application vulnerability
2. Phase 2: Research - Missing output encoding, no CSP
3. Phase 3: Design - Implement DOMPurify, add CSP headers
4. Phase 4: Implement
   - Add DOMPurify for HTML sanitization
   - Configure CSP headers
   - Escape all user-generated content
5. Phase 5: Verify - Penetration test confirms fix
6. Phase 6: Document - Security advisory
7. Phase 7: Memory updates (v1.2.8 → v1.2.9)
8. Phase 8: Expedited deployment

**Version**: v1.2.8 → v1.2.9 (PATCH - security fix)

## Common Issues and Resolutions

**Issue**: Security patch breaks functionality
**Resolution**: Test more thoroughly, consider alternative fix, coordinate with vendor

**Issue**: Multiple interdependent vulnerabilities
**Resolution**: Fix all in single patch release, test comprehensively

**Issue**: No patch available from vendor
**Resolution**: Implement workaround, replace dependency, or mitigate risk

**Issue**: Breaking changes in security patch
**Resolution**: May require MAJOR version, plan migration carefully

## Success Metrics

- Vulnerability fixed and verified
- Zero new vulnerabilities introduced
- No functional regressions
- Deployment time: Target <24 hours for HIGH severity
- Zero security incidents post-patch
- User data protected
