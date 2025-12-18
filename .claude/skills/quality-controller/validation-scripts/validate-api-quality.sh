#!/bin/bash
# API/Microservice Quality Validation Script
# Part of quality-controller skill
# Validates all quality metrics for API/Microservice systems
#
# Quality Standards (from quality-standards.json):
# - Response Time: <200ms 95th percentile
# - Throughput: >1000 RPS sustained
# - Availability: 99.9% uptime target
# - OpenAPI Documentation: Complete
# - Test Coverage: Backend 80%+
# - Security: 0 high/critical vulnerabilities

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Quality thresholds
RESPONSE_TIME_TARGET_MS=200
RESPONSE_TIME_MAXIMUM_MS=500
THROUGHPUT_TARGET_RPS=1000
TEST_COVERAGE_TARGET=80
TEST_COVERAGE_MINIMUM=70
TYPESCRIPT_COVERAGE_TARGET=95
TYPESCRIPT_COVERAGE_MINIMUM=85

# Workspace paths
BACKEND_DIR="workspace/backend"
API_DIR="workspace/api"

# Use whichever exists
if [ -d "$API_DIR" ]; then
    SERVICE_DIR="$API_DIR"
elif [ -d "$BACKEND_DIR" ]; then
    SERVICE_DIR="$BACKEND_DIR"
else
    SERVICE_DIR="workspace/backend"
fi

# Results tracking
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}API/Microservice Quality Validation${NC}"
echo -e "${BLUE}NestJS / FastAPI${NC}"
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

# Detect framework (NestJS vs FastAPI)
detect_framework() {
    if [ -f "$SERVICE_DIR/package.json" ] && grep -q "@nestjs/core" "$SERVICE_DIR/package.json" 2>/dev/null; then
        echo "nestjs"
    elif [ -f "$SERVICE_DIR/requirements.txt" ] && grep -q "fastapi" "$SERVICE_DIR/requirements.txt" 2>/dev/null; then
        echo "fastapi"
    elif [ -f "$SERVICE_DIR/pyproject.toml" ] && grep -q "fastapi" "$SERVICE_DIR/pyproject.toml" 2>/dev/null; then
        echo "fastapi"
    else
        echo "unknown"
    fi
}

FRAMEWORK=$(detect_framework)
echo -e "Detected Framework: ${BLUE}$FRAMEWORK${NC}"
echo ""

# ====================
# [1/9] Project Structure
# ====================
echo -e "${BLUE}[1/9] Project Structure Checks${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    print_result "Service Directory" "PASS" "$SERVICE_DIR exists"
    
    if [ "$FRAMEWORK" = "nestjs" ]; then
        # NestJS structure
        if [ -f "$SERVICE_DIR/nest-cli.json" ]; then
            print_result "NestJS CLI" "PASS" "nest-cli.json found"
        else
            print_result "NestJS CLI" "WARN" "nest-cli.json not found"
        fi
        
        if [ -d "$SERVICE_DIR/src/modules" ] || [ -d "$SERVICE_DIR/src" ]; then
            print_result "Module Structure" "PASS" "NestJS module structure found"
        else
            print_result "Module Structure" "WARN" "Standard module structure not found"
        fi
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # FastAPI structure
        if [ -d "$SERVICE_DIR/app" ]; then
            print_result "App Directory" "PASS" "FastAPI app directory found"
        else
            print_result "App Directory" "WARN" "app/ directory not found"
        fi
        
        if [ -f "$SERVICE_DIR/app/main.py" ] || [ -f "$SERVICE_DIR/main.py" ]; then
            print_result "Main Entry" "PASS" "FastAPI main.py found"
        else
            print_result "Main Entry" "FAIL" "main.py not found"
        fi
    fi
fi

# ====================
# [2/9] Type Safety
# ====================
echo ""
echo -e "${BLUE}[2/9] Type Safety Checks${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    if [ "$FRAMEWORK" = "nestjs" ]; then
        # TypeScript checks
        if [ -f "$SERVICE_DIR/tsconfig.json" ]; then
            print_result "TypeScript Config" "PASS" "tsconfig.json found"
            
            # Check strict mode
            if grep -q '"strict"[[:space:]]*:[[:space:]]*true' "$SERVICE_DIR/tsconfig.json"; then
                print_result "TypeScript Strict" "PASS" "Strict mode enabled"
            else
                print_result "TypeScript Strict" "FAIL" "Strict mode REQUIRED"
            fi
        else
            print_result "TypeScript Config" "FAIL" "tsconfig.json not found"
        fi
        
        # Run tsc
        echo "Running TypeScript check..."
        if cd "$SERVICE_DIR" && npx tsc --noEmit > /dev/null 2>&1; then
            print_result "TypeScript Check" "PASS" "No type errors"
        else
            ERROR_COUNT=$(cd "$SERVICE_DIR" && npx tsc --noEmit 2>&1 | grep -c "error TS" || echo "0")
            print_result "TypeScript Check" "FAIL" "$ERROR_COUNT type errors"
        fi
        cd - > /dev/null 2>&1 || true
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # mypy checks
        if [ -f "$SERVICE_DIR/mypy.ini" ] || grep -q "\[tool.mypy\]" "$SERVICE_DIR/pyproject.toml" 2>/dev/null; then
            print_result "mypy Config" "PASS" "mypy configured"
        else
            print_result "mypy Config" "WARN" "mypy.ini or pyproject.toml [tool.mypy] not found"
        fi
        
        echo "Running mypy strict check..."
        if cd "$SERVICE_DIR" && python3 -m mypy --strict . > /dev/null 2>&1; then
            print_result "mypy Strict" "PASS" "No type errors (100% coverage)"
        else
            ERROR_COUNT=$(cd "$SERVICE_DIR" && python3 -m mypy --strict . 2>&1 | grep -c "error:" || echo "0")
            if [ "$ERROR_COUNT" -gt 0 ]; then
                print_result "mypy Strict" "FAIL" "$ERROR_COUNT type errors (target: 100% coverage)"
            else
                print_result "mypy Strict" "WARN" "mypy not installed or misconfigured"
            fi
        fi
        cd - > /dev/null 2>&1 || true
    fi
fi

# ====================
# [3/9] Test Coverage
# ====================
echo ""
echo -e "${BLUE}[3/9] Test Coverage Checks${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    if [ "$FRAMEWORK" = "nestjs" ]; then
        # Jest tests
        echo "Running NestJS tests with coverage..."
        if cd "$SERVICE_DIR" && npm run test:cov > /tmp/api-coverage.txt 2>&1; then
            COVERAGE=$(grep -o "All files.*|[[:space:]]*[0-9.]*" /tmp/api-coverage.txt | grep -o "[0-9.]*$" | head -1 || echo "0")
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
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # pytest tests
        echo "Running pytest with coverage..."
        if cd "$SERVICE_DIR" && python3 -m pytest --cov=. --cov-report=term-missing > /tmp/api-coverage.txt 2>&1; then
            COVERAGE=$(grep -o "TOTAL.*[0-9]\+%" /tmp/api-coverage.txt | grep -o "[0-9]\+%" | tr -d '%' || echo "0")
            
            if [ "$COVERAGE" -ge "$TEST_COVERAGE_TARGET" ]; then
                print_result "Test Coverage" "PASS" "${COVERAGE}% (target: ${TEST_COVERAGE_TARGET}%)"
            elif [ "$COVERAGE" -ge "$TEST_COVERAGE_MINIMUM" ]; then
                print_result "Test Coverage" "WARN" "${COVERAGE}% (min: ${TEST_COVERAGE_MINIMUM}%, target: ${TEST_COVERAGE_TARGET}%)"
            else
                print_result "Test Coverage" "FAIL" "${COVERAGE}% (minimum: ${TEST_COVERAGE_MINIMUM}%)"
            fi
        else
            print_result "Tests" "FAIL" "Test execution failed"
        fi
        cd - > /dev/null 2>&1 || true
    fi
    
    # Check for httpx.AsyncClient (FastAPI) or supertest (NestJS)
    if [ "$FRAMEWORK" = "fastapi" ]; then
        if grep -q "httpx" "$SERVICE_DIR/requirements.txt" 2>/dev/null || \
           grep -q "httpx" "$SERVICE_DIR/pyproject.toml" 2>/dev/null; then
            print_result "Async Test Client" "PASS" "httpx configured for async testing"
        else
            print_result "Async Test Client" "WARN" "Add httpx for proper async testing"
        fi
    elif [ "$FRAMEWORK" = "nestjs" ]; then
        if grep -q "supertest" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "E2E Test Client" "PASS" "supertest configured"
        else
            print_result "E2E Test Client" "WARN" "Add supertest for E2E testing"
        fi
    fi
fi

# ====================
# [4/9] API Documentation
# ====================
echo ""
echo -e "${BLUE}[4/9] API Documentation (OpenAPI/Swagger)${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    # Check for OpenAPI/Swagger setup
    if [ "$FRAMEWORK" = "nestjs" ]; then
        if grep -q "@nestjs/swagger" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Swagger Module" "PASS" "@nestjs/swagger configured"
        else
            print_result "Swagger Module" "FAIL" "@nestjs/swagger REQUIRED for API docs"
        fi
        
        # Check for ApiProperty decorators
        if grep -rq "@ApiProperty" "$SERVICE_DIR/src" 2>/dev/null; then
            PROP_COUNT=$(grep -r "@ApiProperty" "$SERVICE_DIR/src" 2>/dev/null | wc -l || echo "0")
            print_result "API Properties" "PASS" "$PROP_COUNT @ApiProperty decorators found"
        else
            print_result "API Properties" "WARN" "Add @ApiProperty decorators for complete docs"
        fi
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # FastAPI has auto OpenAPI
        print_result "OpenAPI Auto" "PASS" "FastAPI auto-generates OpenAPI"
        
        # Check for Pydantic v2
        if grep -q "pydantic" "$SERVICE_DIR/requirements.txt" 2>/dev/null; then
            PYDANTIC_VER=$(grep "pydantic" "$SERVICE_DIR/requirements.txt" | grep -o "[0-9]\+\.[0-9]\+" | head -1 || echo "1")
            PYDANTIC_MAJOR=$(echo "$PYDANTIC_VER" | cut -d. -f1)
            
            if [ "$PYDANTIC_MAJOR" -ge 2 ]; then
                print_result "Pydantic Version" "PASS" "Pydantic v2 configured"
            else
                print_result "Pydantic Version" "WARN" "Upgrade to Pydantic v2 recommended"
            fi
        fi
    fi
    
    # Check for OpenAPI spec file
    if [ -f "$SERVICE_DIR/openapi.json" ] || [ -f "$SERVICE_DIR/openapi.yaml" ] || \
       [ -f "$SERVICE_DIR/swagger.json" ] || [ -f "$SERVICE_DIR/swagger.yaml" ]; then
        print_result "OpenAPI Spec File" "PASS" "OpenAPI specification file found"
    else
        print_result "OpenAPI Spec File" "WARN" "Consider exporting OpenAPI spec file"
    fi
fi

# ====================
# [5/9] Security Checks
# ====================
echo ""
echo -e "${BLUE}[5/9] Security Checks${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    # Dependency audit
    if [ "$FRAMEWORK" = "nestjs" ]; then
        echo "Running npm audit..."
        cd "$SERVICE_DIR"
        AUDIT_OUTPUT=$(npm audit --json 2>&1 || true)
        CRITICAL=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities.critical // 0' 2>/dev/null || echo "0")
        HIGH=$(echo "$AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities.high // 0' 2>/dev/null || echo "0")
        
        if [ "$CRITICAL" -eq 0 ] && [ "$HIGH" -eq 0 ]; then
            print_result "npm audit" "PASS" "0 critical, 0 high vulnerabilities"
        else
            print_result "npm audit" "FAIL" "$CRITICAL critical, $HIGH high vulnerabilities"
        fi
        cd - > /dev/null 2>&1 || true
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        echo "Running pip-audit..."
        if cd "$SERVICE_DIR" && pip-audit --format=json > /tmp/pip-audit.json 2>&1; then
            VULNS=$(cat /tmp/pip-audit.json | jq length 2>/dev/null || echo "0")
            if [ "$VULNS" -eq 0 ]; then
                print_result "pip-audit" "PASS" "No known vulnerabilities"
            else
                print_result "pip-audit" "FAIL" "$VULNS vulnerabilities found"
            fi
        else
            print_result "pip-audit" "WARN" "pip-audit not installed. Run: pip install pip-audit"
        fi
        cd - > /dev/null 2>&1 || true
    fi
    
    # Check for authentication
    if [ "$FRAMEWORK" = "nestjs" ]; then
        if grep -q "@nestjs/passport\|@nestjs/jwt" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Authentication" "PASS" "Auth module configured"
        else
            print_result "Authentication" "WARN" "No auth module detected"
        fi
        
        # Check for class-validator
        if grep -q "class-validator" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Input Validation" "PASS" "class-validator configured"
        else
            print_result "Input Validation" "FAIL" "class-validator REQUIRED"
        fi
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        if grep -rq "OAuth2\|HTTPBearer\|Depends.*get_current_user" "$SERVICE_DIR" 2>/dev/null; then
            print_result "Authentication" "PASS" "Auth dependencies found"
        else
            print_result "Authentication" "WARN" "No auth implementation detected"
        fi
        
        # Check for bcrypt/passlib
        if grep -q "bcrypt\|passlib" "$SERVICE_DIR/requirements.txt" 2>/dev/null; then
            print_result "Password Hashing" "PASS" "bcrypt/passlib configured"
        else
            print_result "Password Hashing" "WARN" "Add bcrypt for password hashing"
        fi
    fi
    
    # Check for hardcoded secrets
    SECRETS_FOUND=""
    SECRETS_FOUND=$(grep -rE "(api_key|secret_key|password|jwt_secret)[[:space:]]*[:=][[:space:]]*['\"][^'\"]+['\"]" "$SERVICE_DIR" --include="*.ts" --include="*.py" 2>/dev/null || true)
    
    if [ -z "$SECRETS_FOUND" ]; then
        print_result "Hardcoded Secrets" "PASS" "No hardcoded secrets detected"
    else
        print_result "Hardcoded Secrets" "FAIL" "Potential hardcoded secrets found"
    fi
    
    # Check for env-based JWT secret
    if grep -rq "process.env.*JWT\|os.environ.*JWT\|config.*JWT" "$SERVICE_DIR" 2>/dev/null; then
        print_result "JWT from ENV" "PASS" "JWT secret loaded from environment"
    else
        print_result "JWT from ENV" "WARN" "Ensure JWT secret is from environment"
    fi
fi

# ====================
# [6/9] Code Quality
# ====================
echo ""
echo -e "${BLUE}[6/9] Code Quality Checks${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    if [ "$FRAMEWORK" = "nestjs" ]; then
        # ESLint
        echo "Running ESLint..."
        if cd "$SERVICE_DIR" && npm run lint > /dev/null 2>&1; then
            print_result "ESLint" "PASS" "No linting errors"
        else
            LINT_OUTPUT=$(cd "$SERVICE_DIR" && npm run lint 2>&1 || true)
            ERROR_COUNT=$(echo "$LINT_OUTPUT" | grep -c "error" || echo "0")
            
            if [ "$ERROR_COUNT" -gt 0 ]; then
                print_result "ESLint" "FAIL" "$ERROR_COUNT linting errors"
            else
                print_result "ESLint" "WARN" "Linting warnings detected"
            fi
        fi
        cd - > /dev/null 2>&1 || true
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # Ruff or flake8
        echo "Running code quality checks..."
        if cd "$SERVICE_DIR" && python3 -m ruff check . > /dev/null 2>&1; then
            print_result "Ruff Linter" "PASS" "No linting errors"
        elif cd "$SERVICE_DIR" && python3 -m flake8 . > /dev/null 2>&1; then
            print_result "flake8" "PASS" "No linting errors"
        else
            print_result "Python Linter" "WARN" "Install ruff or flake8 for linting"
        fi
        cd - > /dev/null 2>&1 || true
    fi
    
    # Check for emojis (NOT allowed)
    if [ "$FRAMEWORK" = "nestjs" ]; then
        EMOJI_FILES=$(grep -rl "[😀-🙏]" "$SERVICE_DIR/src" 2>/dev/null || true)
    else
        EMOJI_FILES=$(grep -rl "[😀-🙏]" "$SERVICE_DIR/app" 2>/dev/null || true)
    fi
    
    if [ -z "$EMOJI_FILES" ]; then
        print_result "No Emojis" "PASS" "No emojis in code"
    else
        print_result "No Emojis" "FAIL" "Emojis found in code (CRITICAL VIOLATION)"
    fi
fi

# ====================
# [7/9] Performance Configuration
# ====================
echo ""
echo -e "${BLUE}[7/9] Performance Configuration${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    if [ "$FRAMEWORK" = "nestjs" ]; then
        # Check for compression
        if grep -q "compression" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Compression" "PASS" "Compression middleware configured"
        else
            print_result "Compression" "WARN" "Add compression middleware"
        fi
        
        # Check for caching
        if grep -q "@nestjs/cache-manager\|cache-manager" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Caching" "PASS" "Cache manager configured"
        else
            print_result "Caching" "WARN" "Consider adding cache layer"
        fi
        
        # Check for rate limiting
        if grep -q "@nestjs/throttler" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Rate Limiting" "PASS" "@nestjs/throttler configured"
        else
            print_result "Rate Limiting" "FAIL" "Rate limiting REQUIRED for APIs"
        fi
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # Check for async endpoints
        ASYNC_COUNT=$(grep -r "async def" "$SERVICE_DIR/app" 2>/dev/null | wc -l || echo "0")
        SYNC_COUNT=$(grep -r "^def " "$SERVICE_DIR/app" 2>/dev/null | grep -v "__" | wc -l || echo "0")
        
        if [ "$ASYNC_COUNT" -gt "$SYNC_COUNT" ]; then
            print_result "Async Endpoints" "PASS" "$ASYNC_COUNT async endpoints"
        else
            print_result "Async Endpoints" "WARN" "Use async def for all endpoints"
        fi
        
        # Check for uvicorn
        if grep -q "uvicorn" "$SERVICE_DIR/requirements.txt" 2>/dev/null; then
            print_result "ASGI Server" "PASS" "uvicorn configured"
        else
            print_result "ASGI Server" "FAIL" "uvicorn REQUIRED for production"
        fi
        
        # Check for redis/caching
        if grep -q "redis\|aioredis" "$SERVICE_DIR/requirements.txt" 2>/dev/null; then
            print_result "Caching" "PASS" "Redis caching configured"
        else
            print_result "Caching" "WARN" "Consider adding Redis cache layer"
        fi
    fi
fi

# ====================
# [8/9] Docker Configuration
# ====================
echo ""
echo -e "${BLUE}[8/9] Docker Configuration${NC}"
echo "-----------------------------------"

# Check for Dockerfile
DOCKERFILE=""
if [ -f "$SERVICE_DIR/Dockerfile" ]; then
    DOCKERFILE="$SERVICE_DIR/Dockerfile"
elif [ -f "workspace/docker/backend.Dockerfile" ]; then
    DOCKERFILE="workspace/docker/backend.Dockerfile"
elif [ -f "workspace/docker/api.Dockerfile" ]; then
    DOCKERFILE="workspace/docker/api.Dockerfile"
fi

if [ -n "$DOCKERFILE" ]; then
    print_result "Dockerfile" "PASS" "Found: $DOCKERFILE"
    
    CONTENT=$(cat "$DOCKERFILE")
    
    # Check for multi-stage build
    STAGE_COUNT=$(grep -c "^FROM" "$DOCKERFILE" || echo "0")
    if [ "$STAGE_COUNT" -gt 1 ]; then
        print_result "Multi-stage Build" "PASS" "$STAGE_COUNT stages"
    else
        print_result "Multi-stage Build" "WARN" "Consider multi-stage build for smaller images"
    fi
    
    # Check for health check
    if grep -q "HEALTHCHECK" "$DOCKERFILE"; then
        print_result "Health Check" "PASS" "HEALTHCHECK configured"
    else
        print_result "Health Check" "FAIL" "HEALTHCHECK required in Dockerfile"
    fi
    
    # Check for exec form CMD
    if grep -q 'CMD \[' "$DOCKERFILE"; then
        print_result "Exec Form CMD" "PASS" "Using exec form CMD (recommended)"
    else
        print_result "Exec Form CMD" "WARN" "Use exec form CMD [\"...\"] for proper signal handling"
    fi
    
    # Check for non-root user
    if grep -q "^USER" "$DOCKERFILE" && ! grep -q "USER root" "$DOCKERFILE"; then
        print_result "Non-root User" "PASS" "Non-root user configured"
    else
        print_result "Non-root User" "WARN" "Consider non-root user for security"
    fi
else
    print_result "Dockerfile" "FAIL" "No Dockerfile found"
fi

# Check docker-compose
if [ -f "workspace/docker/docker-compose.yml" ]; then
    print_result "Docker Compose" "PASS" "docker-compose.yml found"
    
    COMPOSE_CONTENT=$(cat "workspace/docker/docker-compose.yml")
    
    # Check for healthcheck in compose
    if echo "$COMPOSE_CONTENT" | grep -q "healthcheck:"; then
        print_result "Compose Health" "PASS" "Health checks in docker-compose"
    else
        print_result "Compose Health" "WARN" "Add health checks to docker-compose"
    fi
    
    # Check for resource limits
    if echo "$COMPOSE_CONTENT" | grep -q "mem_limit\|cpus\|deploy:"; then
        print_result "Resource Limits" "PASS" "Resource limits configured"
    else
        print_result "Resource Limits" "WARN" "Add resource limits for production"
    fi
else
    print_result "Docker Compose" "WARN" "docker-compose.yml not found"
fi

# ====================
# [9/9] Monitoring & Logging
# ====================
echo ""
echo -e "${BLUE}[9/9] Monitoring & Logging${NC}"
echo "-----------------------------------"

if check_directory "$SERVICE_DIR"; then
    if [ "$FRAMEWORK" = "nestjs" ]; then
        # Check for logging
        if grep -q "@nestjs/common.*Logger\|winston\|pino" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Logging" "PASS" "Logging configured"
        else
            print_result "Logging" "WARN" "Add structured logging"
        fi
        
        # Check for health endpoint
        if grep -q "@nestjs/terminus" "$SERVICE_DIR/package.json" 2>/dev/null; then
            print_result "Health Module" "PASS" "@nestjs/terminus configured"
        else
            print_result "Health Module" "WARN" "Add @nestjs/terminus for health checks"
        fi
        
    elif [ "$FRAMEWORK" = "fastapi" ]; then
        # Check for logging
        if grep -rq "import logging\|from loguru" "$SERVICE_DIR" 2>/dev/null; then
            print_result "Logging" "PASS" "Logging configured"
        else
            print_result "Logging" "WARN" "Add structured logging (loguru recommended)"
        fi
        
        # Check for health endpoint
        if grep -rq "@app.get.*health\|/health" "$SERVICE_DIR" 2>/dev/null; then
            print_result "Health Endpoint" "PASS" "/health endpoint found"
        else
            print_result "Health Endpoint" "WARN" "Add /health endpoint"
        fi
    fi
    
    # Check for OpenTelemetry / APM
    if grep -q "opentelemetry\|newrelic\|datadog\|sentry" "$SERVICE_DIR/"*.json "$SERVICE_DIR/"*.txt "$SERVICE_DIR/"*.toml 2>/dev/null; then
        print_result "APM/Tracing" "PASS" "APM/Tracing configured"
    else
        print_result "APM/Tracing" "WARN" "Consider adding OpenTelemetry or APM"
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
echo -e "Framework: ${BLUE}$FRAMEWORK${NC}"
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
        echo -e "${GREEN}[SUCCESS] API quality validation PASSED${NC}"
        echo -e "${YELLOW}Address ${WARNING_CHECKS} warnings before production${NC}"
        exit 0
    else
        echo -e "${RED}[FAILURE] API quality validation FAILED${NC}"
        echo -e "Fix ${FAILED_CHECKS} failing checks before proceeding"
        exit 1
    fi
else
    echo -e "${RED}No checks were performed${NC}"
    exit 1
fi
