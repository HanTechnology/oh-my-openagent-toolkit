#!/bin/bash
# Web Application Quality Validation Script
# Part of quality-controller skill
# Validates all quality metrics for web applications

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Quality thresholds (from quality-standards.json)
TYPESCRIPT_COVERAGE_TARGET=95
TYPESCRIPT_COVERAGE_MINIMUM=85
TEST_COVERAGE_TARGET=80
TEST_COVERAGE_MINIMUM=70
LINT_SCORE_MINIMUM=95
LIGHTHOUSE_PERFORMANCE_MINIMUM=80
LIGHTHOUSE_ACCESSIBILITY_MINIMUM=95

# Workspace paths
FRONTEND_DIR="workspace/frontend"
BACKEND_DIR="workspace/backend"

# Results tracking
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Web Application Quality Validation${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print test result
print_result() {
    local test_name=$1
    local status=$2
    local message=$3

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}✅ PASS${NC}: $test_name - $message"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}❌ FAIL${NC}: $test_name - $message"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  WARN${NC}: $test_name - $message"
        WARNING_CHECKS=$((WARNING_CHECKS + 1))
    fi
}

# Check if directory exists
check_directory() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        print_result "Directory Check" "FAIL" "$dir does not exist"
        return 1
    fi
    return 0
}

echo -e "${BLUE}[1/7] Code Quality Checks${NC}"
echo "-----------------------------------"

# 1.1. TypeScript Check
if check_directory "$FRONTEND_DIR"; then
    echo "Running TypeScript type check..."
    if cd "$FRONTEND_DIR" && npx tsc --noEmit > /dev/null 2>&1; then
        print_result "TypeScript" "PASS" "No type errors found"
    else
        print_result "TypeScript" "FAIL" "Type errors detected"
    fi
    cd - > /dev/null
fi

if check_directory "$BACKEND_DIR"; then
    echo "Running Backend TypeScript check..."
    if cd "$BACKEND_DIR" && npx tsc --noEmit > /dev/null 2>&1; then
        print_result "Backend TypeScript" "PASS" "No type errors found"
    else
        print_result "Backend TypeScript" "FAIL" "Type errors detected"
    fi
    cd - > /dev/null
fi

# 1.2. Linting Check
if check_directory "$FRONTEND_DIR"; then
    echo "Running ESLint..."
    if cd "$FRONTEND_DIR" && npm run lint > /dev/null 2>&1; then
        print_result "ESLint (Frontend)" "PASS" "No linting errors"
    else
        lint_output=$(npm run lint 2>&1 || true)
        error_count=$(echo "$lint_output" | grep -o "error" | wc -l)
        warning_count=$(echo "$lint_output" | grep -o "warning" | wc -l)

        if [ "$error_count" -gt 0 ]; then
            print_result "ESLint (Frontend)" "FAIL" "$error_count errors, $warning_count warnings"
        else
            print_result "ESLint (Frontend)" "WARN" "0 errors, $warning_count warnings"
        fi
    fi
    cd - > /dev/null
fi

# 1.3. Format Check
if check_directory "$FRONTEND_DIR"; then
    echo "Running Prettier format check..."
    if cd "$FRONTEND_DIR" && npm run format:check > /dev/null 2>&1; then
        print_result "Prettier (Frontend)" "PASS" "Code is properly formatted"
    else
        print_result "Prettier (Frontend)" "WARN" "Code formatting issues detected"
    fi
    cd - > /dev/null
fi

# 1.4. Build Check
if check_directory "$FRONTEND_DIR"; then
    echo "Running production build..."
    if cd "$FRONTEND_DIR" && npm run build > /dev/null 2>&1; then
        print_result "Build (Frontend)" "PASS" "Production build successful"
    else
        print_result "Build (Frontend)" "FAIL" "Production build failed"
    fi
    cd - > /dev/null
fi

echo ""
echo -e "${BLUE}[2/7] Test Coverage Checks${NC}"
echo "-----------------------------------"

# 2.1. Frontend Test Coverage
if check_directory "$FRONTEND_DIR"; then
    echo "Running frontend tests with coverage..."
    if cd "$FRONTEND_DIR" && npm run test:coverage > /tmp/frontend-coverage.txt 2>&1; then
        # Extract coverage percentage (this is a simplified example)
        coverage=$(grep -o "All files.*[0-9]\+\.[0-9]\+" /tmp/frontend-coverage.txt | grep -o "[0-9]\+\.[0-9]\+" | head -1 || echo "0")
        coverage_int=${coverage%.*}

        if [ "$coverage_int" -ge "$TEST_COVERAGE_TARGET" ]; then
            print_result "Frontend Test Coverage" "PASS" "${coverage}% (target: ${TEST_COVERAGE_TARGET}%)"
        elif [ "$coverage_int" -ge "$TEST_COVERAGE_MINIMUM" ]; then
            print_result "Frontend Test Coverage" "WARN" "${coverage}% (minimum: ${TEST_COVERAGE_MINIMUM}%, target: ${TEST_COVERAGE_TARGET}%)"
        else
            print_result "Frontend Test Coverage" "FAIL" "${coverage}% (minimum: ${TEST_COVERAGE_MINIMUM}%)"
        fi
    else
        print_result "Frontend Tests" "FAIL" "Test execution failed"
    fi
    cd - > /dev/null
fi

# 2.2. Backend Test Coverage
if check_directory "$BACKEND_DIR"; then
    echo "Running backend tests with coverage..."
    if cd "$BACKEND_DIR" && npm run test:cov > /tmp/backend-coverage.txt 2>&1; then
        coverage=$(grep -o "All files.*[0-9]\+\.[0-9]\+" /tmp/backend-coverage.txt | grep -o "[0-9]\+\.[0-9]\+" | head -1 || echo "0")
        coverage_int=${coverage%.*}

        if [ "$coverage_int" -ge "$TEST_COVERAGE_TARGET" ]; then
            print_result "Backend Test Coverage" "PASS" "${coverage}% (target: ${TEST_COVERAGE_TARGET}%)"
        elif [ "$coverage_int" -ge "$TEST_COVERAGE_MINIMUM" ]; then
            print_result "Backend Test Coverage" "WARN" "${coverage}% (minimum: ${TEST_COVERAGE_MINIMUM}%, target: ${TEST_COVERAGE_TARGET}%)"
        else
            print_result "Backend Test Coverage" "FAIL" "${coverage}% (minimum: ${TEST_COVERAGE_MINIMUM}%)"
        fi
    else
        print_result "Backend Tests" "FAIL" "Test execution failed"
    fi
    cd - > /dev/null
fi

echo ""
echo -e "${BLUE}[3/7] Security Checks${NC}"
echo "-----------------------------------"

# 3.1. npm audit (Frontend)
if check_directory "$FRONTEND_DIR"; then
    echo "Running npm audit (frontend)..."
    cd "$FRONTEND_DIR"
    audit_output=$(npm audit --json 2>&1 || true)
    critical=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")
    high=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")

    if [ "$critical" -eq 0 ] && [ "$high" -eq 0 ]; then
        print_result "npm audit (Frontend)" "PASS" "0 critical, 0 high vulnerabilities"
    else
        print_result "npm audit (Frontend)" "FAIL" "$critical critical, $high high vulnerabilities"
    fi
    cd - > /dev/null
fi

# 3.2. npm audit (Backend)
if check_directory "$BACKEND_DIR"; then
    echo "Running npm audit (backend)..."
    cd "$BACKEND_DIR"
    audit_output=$(npm audit --json 2>&1 || true)
    critical=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")
    high=$(echo "$audit_output" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")

    if [ "$critical" -eq 0 ] && [ "$high" -eq 0 ]; then
        print_result "npm audit (Backend)" "PASS" "0 critical, 0 high vulnerabilities"
    else
        print_result "npm audit (Backend)" "FAIL" "$critical critical, $high high vulnerabilities"
    fi
    cd - > /dev/null
fi

echo ""
echo -e "${BLUE}[4/7] Performance Checks${NC}"
echo "-----------------------------------"

# Note: These would require actual running application
echo "ℹ️  Performance checks require running application"
echo "ℹ️  Run Lighthouse manually or use CI/CD integration"
echo "ℹ️  Command: lighthouse https://your-app.com --output=json --output-path=./lighthouse-report.json"
print_result "Lighthouse Check" "WARN" "Manual check required (requires deployed app)"

echo ""
echo -e "${BLUE}[5/7] Accessibility Checks${NC}"
echo "-----------------------------------"

echo "ℹ️  Accessibility validation requires running application with Playwright MCP"
echo "ℹ️  Use: mcp__playwright__browser_snapshot for accessibility tree analysis"
print_result "Accessibility Check" "WARN" "Manual check required (use Playwright MCP)"

echo ""
echo -e "${BLUE}[6/7] Code Standards Checks${NC}"
echo "-----------------------------------"

# 6.1. Check for emojis in code (CRITICAL - not allowed)
if check_directory "$FRONTEND_DIR"; then
    emoji_files=$(grep -r -l "[😀-🙏]" "$FRONTEND_DIR/src" 2>/dev/null || true)
    if [ -z "$emoji_files" ]; then
        print_result "No Emojis Check" "PASS" "No emojis found in frontend code"
    else
        print_result "No Emojis Check" "FAIL" "Emojis found in code (CRITICAL VIOLATION)"
        echo "$emoji_files"
    fi
fi

# 6.2. Check for Lucide Icons usage (should be only icon library)
if check_directory "$FRONTEND_DIR"; then
    if [ -f "$FRONTEND_DIR/package.json" ]; then
        has_lucide=$(grep -q "lucide-react" "$FRONTEND_DIR/package.json" && echo "yes" || echo "no")
        has_other_icons=$(grep -E "(react-icons|heroicons|@mui/icons|font-awesome)" "$FRONTEND_DIR/package.json" && echo "yes" || echo "no")

        if [ "$has_lucide" = "yes" ] && [ "$has_other_icons" = "no" ]; then
            print_result "Icon Library Check" "PASS" "Only Lucide Icons used"
        elif [ "$has_other_icons" = "yes" ]; then
            print_result "Icon Library Check" "FAIL" "Other icon libraries detected (only Lucide allowed)"
        else
            print_result "Icon Library Check" "WARN" "No icon library detected"
        fi
    fi
fi

echo ""
echo -e "${BLUE}[7/7] Docker Configuration Checks${NC}"
echo "-----------------------------------"

# 7.1. Check Dockerfile exists
if [ -f "workspace/docker/backend.Dockerfile" ]; then
    print_result "Backend Dockerfile" "PASS" "Dockerfile exists"
else
    print_result "Backend Dockerfile" "WARN" "Dockerfile not found"
fi

if [ -f "workspace/docker/frontend.Dockerfile" ]; then
    print_result "Frontend Dockerfile" "PASS" "Dockerfile exists"
else
    print_result "Frontend Dockerfile" "WARN" "Dockerfile not found"
fi

# 7.2. Check docker-compose.yml
if [ -f "workspace/docker/docker-compose.yml" ]; then
    print_result "Docker Compose" "PASS" "docker-compose.yml exists"

    # Check for health checks
    if grep -q "healthcheck:" "workspace/docker/docker-compose.yml"; then
        print_result "Health Checks" "PASS" "Health checks configured in docker-compose"
    else
        print_result "Health Checks" "WARN" "No health checks found in docker-compose"
    fi
else
    print_result "Docker Compose" "WARN" "docker-compose.yml not found"
fi

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Quality Validation Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Total Checks: ${TOTAL_CHECKS}"
echo -e "${GREEN}Passed: ${PASSED_CHECKS}${NC}"
echo -e "${YELLOW}Warnings: ${WARNING_CHECKS}${NC}"
echo -e "${RED}Failed: ${FAILED_CHECKS}${NC}"
echo ""

# Calculate pass rate
if [ "$TOTAL_CHECKS" -gt 0 ]; then
    pass_rate=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo -e "Pass Rate: ${pass_rate}%"
    echo ""

    if [ "$FAILED_CHECKS" -eq 0 ]; then
        echo -e "${GREEN}✅ Quality validation PASSED${NC}"
        echo -e "${YELLOW}⚠️  Address ${WARNING_CHECKS} warnings before production${NC}"
        exit 0
    else
        echo -e "${RED}❌ Quality validation FAILED${NC}"
        echo -e "Fix ${FAILED_CHECKS} failing checks before proceeding"
        exit 1
    fi
else
    echo -e "${RED}No checks were performed${NC}"
    exit 1
fi
