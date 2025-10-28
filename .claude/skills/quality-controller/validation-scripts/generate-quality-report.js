#!/usr/bin/env node
/**
 * Quality Metrics Report Generator
 * Part of quality-controller skill
 * Generates structured JSON report of all quality metrics
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Quality thresholds from quality-standards.json
const THRESHOLDS = {
  typescript_coverage: { target: 95, minimum: 85 },
  test_coverage: { target: 80, minimum: 70 },
  lighthouse_performance: { target: 90, minimum: 80 },
  lighthouse_accessibility: { target: 100, minimum: 95 },
  lighthouse_best_practices: { target: 100, minimum: 90 },
  lighthouse_seo: { target: 100, minimum: 90 },
};

// Workspace paths
const WORKSPACE_ROOT = process.cwd();
const FRONTEND_DIR = path.join(WORKSPACE_ROOT, 'workspace', 'frontend');
const BACKEND_DIR = path.join(WORKSPACE_ROOT, 'workspace', 'backend');
const MEMORY_DIR = path.join(WORKSPACE_ROOT, '.memory');

console.log('🔍 Generating Quality Metrics Report...\n');

// Utility function to run command safely
function runCommand(command, cwd = WORKSPACE_ROOT) {
  try {
    return execSync(command, { cwd, encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    return null;
  }
}

// Check if directory exists
function dirExists(dir) {
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

// Initialize report
const report = {
  generated_at: new Date().toISOString(),
  project_type: 'web_application',
  overall_status: 'unknown',
  quality_score: 0,
  checks_passed: 0,
  checks_failed: 0,
  checks_warning: 0,
  categories: {},
};

/**
 * Code Quality Metrics
 */
function collectCodeQualityMetrics() {
  console.log('📝 Collecting code quality metrics...');

  const metrics = {
    category: 'code_quality',
    status: 'unknown',
    checks: {},
  };

  // TypeScript Check - Frontend
  if (dirExists(FRONTEND_DIR)) {
    const tscOutput = runCommand('npx tsc --noEmit', FRONTEND_DIR);
    metrics.checks.typescript_frontend = {
      status: tscOutput !== null ? 'pass' : 'fail',
      message: tscOutput !== null ? 'No type errors' : 'Type errors detected',
      critical: true,
    };
  }

  // TypeScript Check - Backend
  if (dirExists(BACKEND_DIR)) {
    const tscOutput = runCommand('npx tsc --noEmit', BACKEND_DIR);
    metrics.checks.typescript_backend = {
      status: tscOutput !== null ? 'pass' : 'fail',
      message: tscOutput !== null ? 'No type errors' : 'Type errors detected',
      critical: true,
    };
  }

  // ESLint - Frontend
  if (dirExists(FRONTEND_DIR)) {
    const lintOutput = runCommand('npm run lint', FRONTEND_DIR);
    const hasErrors = lintOutput ? !lintOutput.includes('error') : false;
    metrics.checks.eslint_frontend = {
      status: hasErrors ? 'pass' : 'fail',
      message: hasErrors ? 'No linting errors' : 'Linting errors detected',
      critical: true,
    };
  }

  // Build Check - Frontend
  if (dirExists(FRONTEND_DIR)) {
    console.log('  Building frontend...');
    const buildOutput = runCommand('npm run build', FRONTEND_DIR);
    metrics.checks.build_frontend = {
      status: buildOutput !== null ? 'pass' : 'fail',
      message: buildOutput !== null ? 'Build successful' : 'Build failed',
      critical: true,
    };
  }

  // Calculate category status
  const checks = Object.values(metrics.checks);
  const failed = checks.filter(c => c.status === 'fail').length;
  metrics.status = failed === 0 ? 'pass' : 'fail';

  return metrics;
}

/**
 * Test Coverage Metrics
 */
function collectTestCoverageMetrics() {
  console.log('🧪 Collecting test coverage metrics...');

  const metrics = {
    category: 'test_coverage',
    status: 'unknown',
    checks: {},
  };

  // Frontend Test Coverage
  if (dirExists(FRONTEND_DIR)) {
    const coverageOutput = runCommand('npm run test:coverage', FRONTEND_DIR);
    if (coverageOutput) {
      // Extract coverage percentage (simplified)
      const match = coverageOutput.match(/All files\s+\|\s+([\d.]+)/);
      const coverage = match ? parseFloat(match[1]) : 0;

      let status = 'fail';
      if (coverage >= THRESHOLDS.test_coverage.target) status = 'pass';
      else if (coverage >= THRESHOLDS.test_coverage.minimum) status = 'warn';

      metrics.checks.frontend_coverage = {
        status,
        value: coverage,
        target: THRESHOLDS.test_coverage.target,
        minimum: THRESHOLDS.test_coverage.minimum,
        message: `${coverage}% coverage`,
        critical: false,
      };
    }
  }

  // Backend Test Coverage
  if (dirExists(BACKEND_DIR)) {
    const coverageOutput = runCommand('npm run test:cov', BACKEND_DIR);
    if (coverageOutput) {
      const match = coverageOutput.match(/All files\s+\|\s+([\d.]+)/);
      const coverage = match ? parseFloat(match[1]) : 0;

      let status = 'fail';
      if (coverage >= THRESHOLDS.test_coverage.target) status = 'pass';
      else if (coverage >= THRESHOLDS.test_coverage.minimum) status = 'warn';

      metrics.checks.backend_coverage = {
        status,
        value: coverage,
        target: THRESHOLDS.test_coverage.target,
        minimum: THRESHOLDS.test_coverage.minimum,
        message: `${coverage}% coverage`,
        critical: false,
      };
    }
  }

  // Calculate category status
  const checks = Object.values(metrics.checks);
  const failed = checks.filter(c => c.status === 'fail').length;
  const warned = checks.filter(c => c.status === 'warn').length;
  metrics.status = failed === 0 ? (warned === 0 ? 'pass' : 'warn') : 'fail';

  return metrics;
}

/**
 * Security Metrics
 */
function collectSecurityMetrics() {
  console.log('🔒 Collecting security metrics...');

  const metrics = {
    category: 'security',
    status: 'unknown',
    checks: {},
  };

  // npm audit - Frontend
  if (dirExists(FRONTEND_DIR)) {
    const auditOutput = runCommand('npm audit --json', FRONTEND_DIR);
    if (auditOutput) {
      try {
        const audit = JSON.parse(auditOutput);
        const critical = audit.metadata?.vulnerabilities?.critical || 0;
        const high = audit.metadata?.vulnerabilities?.high || 0;

        metrics.checks.npm_audit_frontend = {
          status: (critical === 0 && high === 0) ? 'pass' : 'fail',
          critical_count: critical,
          high_count: high,
          message: `${critical} critical, ${high} high vulnerabilities`,
          critical: true,
        };
      } catch (e) {
        metrics.checks.npm_audit_frontend = {
          status: 'error',
          message: 'Failed to parse audit output',
          critical: false,
        };
      }
    }
  }

  // npm audit - Backend
  if (dirExists(BACKEND_DIR)) {
    const auditOutput = runCommand('npm audit --json', BACKEND_DIR);
    if (auditOutput) {
      try {
        const audit = JSON.parse(auditOutput);
        const critical = audit.metadata?.vulnerabilities?.critical || 0;
        const high = audit.metadata?.vulnerabilities?.high || 0;

        metrics.checks.npm_audit_backend = {
          status: (critical === 0 && high === 0) ? 'pass' : 'fail',
          critical_count: critical,
          high_count: high,
          message: `${critical} critical, ${high} high vulnerabilities`,
          critical: true,
        };
      } catch (e) {
        metrics.checks.npm_audit_backend = {
          status: 'error',
          message: 'Failed to parse audit output',
          critical: false,
        };
      }
    }
  }

  // Calculate category status
  const checks = Object.values(metrics.checks);
  const failed = checks.filter(c => c.status === 'fail').length;
  metrics.status = failed === 0 ? 'pass' : 'fail';

  return metrics;
}

/**
 * Code Standards Metrics
 */
function collectCodeStandardsMetrics() {
  console.log('📐 Collecting code standards metrics...');

  const metrics = {
    category: 'code_standards',
    status: 'unknown',
    checks: {},
  };

  // Check for emojis (CRITICAL - not allowed)
  if (dirExists(FRONTEND_DIR)) {
    const srcDir = path.join(FRONTEND_DIR, 'src');
    if (dirExists(srcDir)) {
      const emojiCheck = runCommand(
        `grep -r -l "[😀-🙏]" "${srcDir}" || true`,
        WORKSPACE_ROOT
      );

      metrics.checks.no_emojis = {
        status: !emojiCheck || emojiCheck.trim() === '' ? 'pass' : 'fail',
        message: !emojiCheck || emojiCheck.trim() === ''
          ? 'No emojis found'
          : 'Emojis detected in code',
        critical: true,
      };
    }
  }

  // Check icon library (only Lucide allowed)
  if (dirExists(FRONTEND_DIR)) {
    const packageJsonPath = path.join(FRONTEND_DIR, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = fs.readFileSync(packageJsonPath, 'utf8');
      const hasLucide = packageJson.includes('lucide-react');
      const hasOtherIcons = /react-icons|heroicons|@mui\/icons|font-awesome/.test(packageJson);

      let status = 'fail';
      let message = 'No icon library';

      if (hasLucide && !hasOtherIcons) {
        status = 'pass';
        message = 'Only Lucide Icons used';
      } else if (hasOtherIcons) {
        status = 'fail';
        message = 'Other icon libraries detected (only Lucide allowed)';
      } else if (!hasLucide) {
        status = 'warn';
        message = 'Lucide Icons not installed';
      }

      metrics.checks.icon_library = {
        status,
        message,
        critical: true,
      };
    }
  }

  // Calculate category status
  const checks = Object.values(metrics.checks);
  const failed = checks.filter(c => c.status === 'fail').length;
  metrics.status = failed === 0 ? 'pass' : 'fail';

  return metrics;
}

/**
 * Main execution
 */
async function generateReport() {
  try {
    // Collect all metrics
    report.categories.code_quality = collectCodeQualityMetrics();
    report.categories.test_coverage = collectTestCoverageMetrics();
    report.categories.security = collectSecurityMetrics();
    report.categories.code_standards = collectCodeStandardsMetrics();

    // Calculate overall statistics
    Object.values(report.categories).forEach(category => {
      Object.values(category.checks).forEach(check => {
        if (check.status === 'pass') report.checks_passed++;
        else if (check.status === 'fail') report.checks_failed++;
        else if (check.status === 'warn') report.checks_warning++;
      });
    });

    // Calculate overall status
    if (report.checks_failed === 0) {
      report.overall_status = report.checks_warning === 0 ? 'pass' : 'warn';
    } else {
      report.overall_status = 'fail';
    }

    // Calculate quality score (0-100)
    const total = report.checks_passed + report.checks_failed + report.checks_warning;
    if (total > 0) {
      report.quality_score = Math.round(
        ((report.checks_passed + report.checks_warning * 0.5) / total) * 100
      );
    }

    // Save report
    const reportPath = path.join(MEMORY_DIR, 'quality-metrics.json');
    if (dirExists(MEMORY_DIR)) {
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`\n✅ Quality report saved to: ${reportPath}`);
    } else {
      // Output to stdout if .memory doesn't exist
      console.log('\n📊 Quality Report:\n');
      console.log(JSON.stringify(report, null, 2));
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('Quality Metrics Summary');
    console.log('='.repeat(50));
    console.log(`Overall Status: ${report.overall_status.toUpperCase()}`);
    console.log(`Quality Score: ${report.quality_score}/100`);
    console.log(`Checks Passed: ${report.checks_passed}`);
    console.log(`Checks Warning: ${report.checks_warning}`);
    console.log(`Checks Failed: ${report.checks_failed}`);
    console.log('='.repeat(50));

    // Exit with appropriate code
    process.exit(report.overall_status === 'fail' ? 1 : 0);
  } catch (error) {
    console.error('❌ Error generating quality report:', error.message);
    process.exit(1);
  }
}

// Run report generation
generateReport();
