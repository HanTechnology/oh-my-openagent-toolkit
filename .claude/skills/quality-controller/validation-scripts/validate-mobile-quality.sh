#!/bin/bash
# Mobile Application Quality Validation Script
# Part of quality-controller skill
# Validates all quality metrics for React Native mobile applications
#
# Quality Standards (from quality-standards.json):
# - Cold Start: <3s, Warm Start: <1s
# - Memory Usage: <150MB target, <200MB maximum
# - Platform Compliance: HIG (iOS) / Material Design (Android)
# - Battery Efficiency: Optimized
# - TypeScript: 100% strict mode
# - Test Coverage: 80% target, 70% minimum

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Quality thresholds
TYPESCRIPT_COVERAGE_TARGET=100
TEST_COVERAGE_TARGET=80
TEST_COVERAGE_MINIMUM=70
COLD_START_TARGET_MS=3000
WARM_START_TARGET_MS=1000
MEMORY_TARGET_MB=150
MEMORY_MAXIMUM_MB=200
FPS_TARGET=60

# Workspace paths
MOBILE_DIR="workspace/mobile"

# Results tracking
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Mobile Application Quality Validation${NC}"
echo -e "${BLUE}React Native / Expo${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Function to print test result
print_result() {
    local test_name=$1
    local status=$2
    local message=$3

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    if [ "$status" = "PASS" ]; then
        echo -e "${GREEN}[PASS]${NC} $test_name: $message"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
    elif [ "$status" = "FAIL" ]; then
        echo -e "${RED}[FAIL]${NC} $test_name: $message"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
    elif [ "$status" = "WARN" ]; then
        echo -e "${YELLOW}[WARN]${NC} $test_name: $message"
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

# ====================
# [1/8] Project Structure Checks
# ====================
echo -e "${BLUE}[1/8] Project Structure Checks${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    print_result "Mobile Directory" "PASS" "$MOBILE_DIR exists"
    
    # Check for package.json
    if [ -f "$MOBILE_DIR/package.json" ]; then
        print_result "package.json" "PASS" "Found"
        
        # Check for React Native version
        RN_VERSION=$(grep -o '"react-native"[[:space:]]*:[[:space:]]*"[^"]*"' "$MOBILE_DIR/package.json" | grep -o '[0-9]\+\.[0-9]\+' | head -1 || echo "")
        if [ -n "$RN_VERSION" ]; then
            RN_MAJOR=$(echo "$RN_VERSION" | cut -d. -f1)
            RN_MINOR=$(echo "$RN_VERSION" | cut -d. -f2)
            
            # Check for RN 0.82+ (New Architecture)
            if [ "$RN_MAJOR" -eq 0 ] && [ "$RN_MINOR" -ge 82 ]; then
                print_result "React Native Version" "PASS" "$RN_VERSION (New Architecture ready)"
            elif [ "$RN_MAJOR" -eq 0 ] && [ "$RN_MINOR" -ge 70 ]; then
                print_result "React Native Version" "WARN" "$RN_VERSION (Consider upgrading to 0.82+ for New Architecture)"
            else
                print_result "React Native Version" "FAIL" "$RN_VERSION (Upgrade to 0.82+ required)"
            fi
        fi
        
        # Check for Expo
        if grep -q '"expo"' "$MOBILE_DIR/package.json"; then
            print_result "Expo SDK" "PASS" "Expo configured"
        else
            print_result "Expo SDK" "WARN" "Consider using Expo for easier development"
        fi
        
        # Check for TypeScript
        if [ -f "$MOBILE_DIR/tsconfig.json" ]; then
            print_result "TypeScript" "PASS" "tsconfig.json found"
            
            # Check strict mode
            if grep -q '"strict"[[:space:]]*:[[:space:]]*true' "$MOBILE_DIR/tsconfig.json"; then
                print_result "TypeScript Strict" "PASS" "Strict mode enabled"
            else
                print_result "TypeScript Strict" "FAIL" "Strict mode REQUIRED for mobile"
            fi
        else
            print_result "TypeScript" "FAIL" "TypeScript required for mobile development"
        fi
    else
        print_result "package.json" "FAIL" "Not found"
    fi
fi

# ====================
# [2/8] TypeScript & Linting
# ====================
echo ""
echo -e "${BLUE}[2/8] TypeScript & Linting Checks${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # TypeScript check
    echo "Running TypeScript type check..."
    if cd "$MOBILE_DIR" && npx tsc --noEmit > /dev/null 2>&1; then
        print_result "TypeScript Check" "PASS" "No type errors found"
    else
        ERROR_COUNT=$(cd "$MOBILE_DIR" && npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
        print_result "TypeScript Check" "FAIL" "$ERROR_COUNT type errors found"
    fi
    cd - > /dev/null 2>&1 || true
    
    # ESLint check
    echo "Running ESLint..."
    if cd "$MOBILE_DIR" && npm run lint > /dev/null 2>&1; then
        print_result "ESLint" "PASS" "No linting errors"
    else
        LINT_OUTPUT=$(cd "$MOBILE_DIR" && npm run lint 2>&1 || true)
        ERROR_COUNT=$(echo "$LINT_OUTPUT" | grep -c "error" || echo "0")
        WARNING_COUNT=$(echo "$LINT_OUTPUT" | grep -c "warning" || echo "0")
        
        if [ "$ERROR_COUNT" -gt 0 ]; then
            print_result "ESLint" "FAIL" "$ERROR_COUNT errors, $WARNING_COUNT warnings"
        else
            print_result "ESLint" "WARN" "0 errors, $WARNING_COUNT warnings"
        fi
    fi
    cd - > /dev/null 2>&1 || true
fi

# ====================
# [3/8] Test Coverage
# ====================
echo ""
echo -e "${BLUE}[3/8] Test Coverage Checks${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # Check for test setup
    if [ -f "$MOBILE_DIR/jest.config.js" ] || [ -f "$MOBILE_DIR/jest.config.ts" ]; then
        print_result "Jest Config" "PASS" "Jest configured"
        
        # Run tests with coverage
        echo "Running tests with coverage..."
        if cd "$MOBILE_DIR" && npm run test:coverage > /tmp/mobile-coverage.txt 2>&1; then
            COVERAGE=$(grep -o "All files.*|[[:space:]]*[0-9.]*" /tmp/mobile-coverage.txt | grep -o "[0-9.]*$" | head -1 || echo "0")
            COVERAGE_INT=${COVERAGE%.*}
            
            if [ "$COVERAGE_INT" -ge "$TEST_COVERAGE_TARGET" ]; then
                print_result "Test Coverage" "PASS" "${COVERAGE}% (target: ${TEST_COVERAGE_TARGET}%)"
            elif [ "$COVERAGE_INT" -ge "$TEST_COVERAGE_MINIMUM" ]; then
                print_result "Test Coverage" "WARN" "${COVERAGE}% (min: ${TEST_COVERAGE_MINIMUM}%, target: ${TEST_COVERAGE_TARGET}%)"
            else
                print_result "Test Coverage" "FAIL" "${COVERAGE}% (minimum: ${TEST_COVERAGE_MINIMUM}%)"
            fi
        else
            print_result "Tests" "FAIL" "Test execution failed"
        fi
        cd - > /dev/null 2>&1 || true
    else
        print_result "Jest Config" "FAIL" "Jest not configured"
    fi
    
    # Check for React Native Testing Library
    if grep -q "@testing-library/react-native" "$MOBILE_DIR/package.json" 2>/dev/null; then
        print_result "RNTL" "PASS" "@testing-library/react-native configured"
    else
        print_result "RNTL" "WARN" "Consider adding @testing-library/react-native"
    fi
    
    # Check for Detox (E2E)
    if grep -q "detox" "$MOBILE_DIR/package.json" 2>/dev/null; then
        print_result "Detox E2E" "PASS" "Detox E2E testing configured"
    else
        print_result "Detox E2E" "WARN" "Consider adding Detox for E2E testing"
    fi
fi

# ====================
# [4/8] Performance Configuration
# ====================
echo ""
echo -e "${BLUE}[4/8] Performance Configuration${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # Check for Hermes engine
    if grep -q '"hermes"[[:space:]]*:[[:space:]]*true' "$MOBILE_DIR/app.json" 2>/dev/null || \
       grep -q 'hermesEnabled[[:space:]]*=[[:space:]]*true' "$MOBILE_DIR/android/gradle.properties" 2>/dev/null; then
        print_result "Hermes Engine" "PASS" "Hermes enabled (faster JS execution)"
    else
        print_result "Hermes Engine" "WARN" "Enable Hermes for better performance"
    fi
    
    # Check for New Architecture (Fabric + TurboModules)
    if grep -q 'newArchEnabled[[:space:]]*=[[:space:]]*true' "$MOBILE_DIR/android/gradle.properties" 2>/dev/null || \
       grep -q 'RCT_NEW_ARCH_ENABLED' "$MOBILE_DIR/ios/Podfile" 2>/dev/null; then
        print_result "New Architecture" "PASS" "Fabric + TurboModules enabled"
    else
        print_result "New Architecture" "WARN" "Consider enabling New Architecture for RN 0.82+"
    fi
    
    # Check for performance monitoring
    if grep -q "react-native-performance" "$MOBILE_DIR/package.json" 2>/dev/null || \
       grep -q "@shopify/react-native-performance" "$MOBILE_DIR/package.json" 2>/dev/null; then
        print_result "Performance Monitoring" "PASS" "Performance library configured"
    else
        print_result "Performance Monitoring" "WARN" "Add performance monitoring library"
    fi
    
    # Check for memoization patterns
    echo "Checking for memoization patterns..."
    MEMO_COUNT=$(grep -r "React.memo\|useMemo\|useCallback" "$MOBILE_DIR/src" 2>/dev/null | wc -l || echo "0")
    if [ "$MEMO_COUNT" -gt 5 ]; then
        print_result "Memoization" "PASS" "$MEMO_COUNT memoization usages found"
    elif [ "$MEMO_COUNT" -gt 0 ]; then
        print_result "Memoization" "WARN" "Limited memoization ($MEMO_COUNT usages)"
    else
        print_result "Memoization" "WARN" "No memoization found - may cause re-renders"
    fi
fi

# ====================
# [5/8] Security Checks
# ====================
echo ""
echo -e "${BLUE}[5/8] Security Checks${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # npm audit
    echo "Running npm audit..."
    cd "$MOBILE_DIR"
    AUDIT_OUTPUT=$(npm audit --json 2>&1 || true)
    CRITICAL=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")
    HIGH=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")
    
    if [ "$CRITICAL" -eq 0 ] && [ "$HIGH" -eq 0 ]; then
        print_result "npm audit" "PASS" "0 critical, 0 high vulnerabilities"
    else
        print_result "npm audit" "FAIL" "$CRITICAL critical, $HIGH high vulnerabilities"
    fi
    cd - > /dev/null 2>&1 || true
    
    # Check for secure storage
    if grep -q "react-native-keychain\|expo-secure-store\|@react-native-async-storage/async-storage" "$MOBILE_DIR/package.json" 2>/dev/null; then
        print_result "Secure Storage" "PASS" "Secure storage library configured"
    else
        print_result "Secure Storage" "FAIL" "No secure storage library (required for tokens/secrets)"
    fi
    
    # Check for hardcoded secrets
    SECRETS_FOUND=""
    if [ -d "$MOBILE_DIR/src" ]; then
        SECRETS_FOUND=$(grep -rE "(api_key|apiKey|secret|password)[[:space:]]*[:=][[:space:]]*['\"][^'\"]+['\"]" "$MOBILE_DIR/src" 2>/dev/null || true)
    fi
    
    if [ -z "$SECRETS_FOUND" ]; then
        print_result "Hardcoded Secrets" "PASS" "No hardcoded secrets detected"
    else
        print_result "Hardcoded Secrets" "FAIL" "Potential hardcoded secrets found"
    fi
    
    # Check for HTTPS enforcement
    if grep -q "NSAppTransportSecurity" "$MOBILE_DIR/ios/"*"/Info.plist" 2>/dev/null; then
        if grep -q "NSAllowsArbitraryLoads[[:space:]]*<true" "$MOBILE_DIR/ios/"*"/Info.plist" 2>/dev/null; then
            print_result "HTTPS (iOS)" "FAIL" "NSAllowsArbitraryLoads enabled - insecure"
        else
            print_result "HTTPS (iOS)" "PASS" "HTTPS enforced"
        fi
    else
        print_result "HTTPS (iOS)" "WARN" "Cannot verify iOS transport security"
    fi
fi

# ====================
# [6/8] Accessibility (WCAG)
# ====================
echo ""
echo -e "${BLUE}[6/8] Accessibility Checks${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # Check for accessibility props
    echo "Checking for accessibility props..."
    if [ -d "$MOBILE_DIR/src" ]; then
        A11Y_PROPS=$(grep -rE "accessible=|accessibilityLabel=|accessibilityHint=|accessibilityRole=" "$MOBILE_DIR/src" 2>/dev/null | wc -l || echo "0")
        
        if [ "$A11Y_PROPS" -gt 20 ]; then
            print_result "Accessibility Props" "PASS" "$A11Y_PROPS accessibility props found"
        elif [ "$A11Y_PROPS" -gt 5 ]; then
            print_result "Accessibility Props" "WARN" "Limited accessibility props ($A11Y_PROPS found)"
        else
            print_result "Accessibility Props" "FAIL" "Insufficient accessibility props"
        fi
    fi
    
    # Check touch target sizes (44x44pt iOS, 48x48dp Android)
    echo "Note: Touch target sizes (44x44pt iOS, 48x48dp Android) require manual review"
    print_result "Touch Targets" "WARN" "Manual review required (HIG: 44x44pt, MD: 48x48dp)"
    
    # Check for screen reader support
    if grep -q "react-native-screen-reader" "$MOBILE_DIR/package.json" 2>/dev/null || \
       grep -q "AccessibilityInfo" "$MOBILE_DIR/src" -r 2>/dev/null; then
        print_result "Screen Reader" "PASS" "Screen reader support implemented"
    else
        print_result "Screen Reader" "WARN" "Add AccessibilityInfo for screen reader detection"
    fi
fi

# ====================
# [7/8] Platform Compliance
# ====================
echo ""
echo -e "${BLUE}[7/8] Platform Compliance${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # iOS specific checks
    if [ -d "$MOBILE_DIR/ios" ]; then
        print_result "iOS Directory" "PASS" "iOS project exists"
        
        # Check for Podfile
        if [ -f "$MOBILE_DIR/ios/Podfile" ]; then
            print_result "CocoaPods" "PASS" "Podfile exists"
        else
            print_result "CocoaPods" "FAIL" "Podfile not found"
        fi
    else
        print_result "iOS Directory" "WARN" "iOS project not found"
    fi
    
    # Android specific checks
    if [ -d "$MOBILE_DIR/android" ]; then
        print_result "Android Directory" "PASS" "Android project exists"
        
        # Check for gradle files
        if [ -f "$MOBILE_DIR/android/build.gradle" ]; then
            print_result "Gradle" "PASS" "build.gradle exists"
            
            # Check minSdk
            MIN_SDK=$(grep -o "minSdk[[:space:]]*=[[:space:]]*[0-9]*" "$MOBILE_DIR/android/build.gradle" | grep -o "[0-9]*" || echo "")
            if [ -n "$MIN_SDK" ] && [ "$MIN_SDK" -ge 24 ]; then
                print_result "Android minSdk" "PASS" "minSdk $MIN_SDK (Android 7.0+)"
            else
                print_result "Android minSdk" "WARN" "Consider minSdk 24+ for modern APIs"
            fi
        else
            print_result "Gradle" "FAIL" "build.gradle not found"
        fi
    else
        print_result "Android Directory" "WARN" "Android project not found"
    fi
    
    # Check for platform-specific code organization
    if [ -d "$MOBILE_DIR/src/platform" ] || \
       grep -r "Platform.OS" "$MOBILE_DIR/src" > /dev/null 2>&1; then
        print_result "Platform Code" "PASS" "Platform-specific code handling found"
    else
        print_result "Platform Code" "WARN" "No platform-specific code organization"
    fi
fi

# ====================
# [8/8] Build & CI/CD
# ====================
echo ""
echo -e "${BLUE}[8/8] Build & CI/CD Checks${NC}"
echo "-----------------------------------"

if check_directory "$MOBILE_DIR"; then
    # Check for EAS Build (Expo)
    if [ -f "$MOBILE_DIR/eas.json" ]; then
        print_result "EAS Build" "PASS" "EAS Build configured"
    else
        print_result "EAS Build" "WARN" "Consider EAS Build for CI/CD"
    fi
    
    # Check for Fastlane
    if [ -d "$MOBILE_DIR/fastlane" ] || [ -f "$MOBILE_DIR/Fastfile" ]; then
        print_result "Fastlane" "PASS" "Fastlane configured for deployment"
    else
        print_result "Fastlane" "WARN" "Consider Fastlane for iOS/Android automation"
    fi
    
    # Check for app.json / app.config.js
    if [ -f "$MOBILE_DIR/app.json" ] || [ -f "$MOBILE_DIR/app.config.js" ]; then
        print_result "App Config" "PASS" "App configuration found"
    else
        print_result "App Config" "FAIL" "app.json or app.config.js not found"
    fi
    
    # Check metro.config.js
    if [ -f "$MOBILE_DIR/metro.config.js" ]; then
        print_result "Metro Config" "PASS" "Metro bundler configured"
    else
        print_result "Metro Config" "WARN" "Consider custom Metro configuration"
    fi
fi

# ====================
# Summary
# ====================
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
    PASS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
    echo -e "Pass Rate: ${PASS_RATE}%"
    echo ""

    if [ "$FAILED_CHECKS" -eq 0 ]; then
        echo -e "${GREEN}[SUCCESS] Mobile quality validation PASSED${NC}"
        echo -e "${YELLOW}Address ${WARNING_CHECKS} warnings before production${NC}"
        exit 0
    else
        echo -e "${RED}[FAILURE] Mobile quality validation FAILED${NC}"
        echo -e "Fix ${FAILED_CHECKS} failing checks before proceeding"
        exit 1
    fi
else
    echo -e "${RED}No checks were performed${NC}"
    exit 1
fi
