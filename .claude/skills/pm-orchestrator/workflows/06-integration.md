# Integration Workflow

## Overview

- **Primary Skill**: fullstack-integration
- **Supporting Skills**: pm-orchestrator, frontend-nextjs, backend-nestjs, qa-testing
- **Dependencies**: implementation (must be complete), system-development (if applicable)
- **Parallel Execution**: Cannot run in parallel (requires completed implementation)

## Workflow Steps

### Phase 1: Integration Planning and Verification

**Objective**: Prepare for system integration and validate readiness

**Actions**:
1. **Read Implementation Context**:
   - .memory/integration-architecture.md (integration design)
   - .memory/api-endpoints.md (backend endpoints status)
   - .memory/ui-components.md (frontend components status)
   - .memory/system-specs.md (system services, if applicable)
   - .memory/active-context.md (current project status)

2. **Verify Implementation Completeness**:
   - Backend: All modules and endpoints implemented
   - Frontend: All pages and components implemented
   - System Services: All specialized services operational (if applicable)
   - Shared Types: Type definitions consistent

3. **Integration Checklist**:
   - ✅ API endpoints match OpenAPI specification
   - ✅ Frontend API client configured
   - ✅ Authentication flows implemented
   - ✅ Error handling consistent
   - ✅ Environment variables configured

### Phase 2: Local Development Environment Integration

**Objective**: Ensure all services run together in development

**Actions**:
1. **Development Environment Setup**:
   - Configure environment variables (.env files)
   - Setup database connection strings
   - Configure API base URLs
   - Setup CORS configuration

2. **Start All Services**:
   ```bash
   # Terminal 1: Backend
   cd workspace/backend
   npm run start:dev

   # Terminal 2: Frontend
   cd workspace/frontend
   npm run dev

   # Terminal 3: System Services (if applicable)
   cd workspace/system
   python -m uvicorn main:app --reload
   ```

3. **Verify Service Communication**:
   - Frontend can reach backend API
   - Backend can reach database
   - System services accessible (if applicable)
   - WebSocket connections established (if applicable)

### Phase 3: Authentication and Authorization Integration

**Objective**: Validate complete auth flows across frontend and backend

**Actions**:
1. **Registration Flow Testing**:
   - User registration form submission
   - Backend validation and user creation
   - Email validation (if applicable)
   - Automatic login after registration
   - Token storage and management

2. **Login Flow Testing**:
   - User login with credentials
   - Backend authentication and token generation
   - Token storage (localStorage/cookies)
   - Redirect to dashboard
   - Token refresh mechanism

3. **Authorization Testing**:
   - Protected route access
   - Role-based access control (if applicable)
   - Token expiration handling
   - Automatic token refresh
   - Logout functionality

4. **Session Management**:
   - Persistent login across refreshes
   - Token refresh before expiration
   - Proper logout and token cleanup
   - "Remember me" functionality (if applicable)

### Phase 4: Data Flow Integration Testing

**Objective**: Validate data flows between frontend and backend

**Actions**:
1. **CRUD Operations Testing**:
   For each major entity:
   - **Create**: Form submission → API call → Database → Response → UI update
   - **Read**: Page load → API call → Data fetch → UI render
   - **Update**: Form submission → API call → Database update → UI update
   - **Delete**: Delete action → API call → Database deletion → UI update

2. **List and Pagination Testing**:
   - Initial list load
   - Pagination controls
   - Page size changes
   - Sorting functionality
   - Filtering functionality
   - Search functionality

3. **Form Validation Integration**:
   - Frontend validation (immediate feedback)
   - Backend validation (data integrity)
   - Error message consistency
   - Validation error display

4. **Optimistic Updates** (if implemented):
   - Immediate UI update
   - Background API call
   - Rollback on error
   - Success confirmation

### Phase 5: Error Handling Integration

**Objective**: Ensure consistent error handling across the stack

**Actions**:
1. **Network Error Handling**:
   - Connection timeout scenarios
   - Network offline scenarios
   - Server unavailable (500) errors
   - User-friendly error messages
   - Retry mechanisms

2. **Validation Error Handling**:
   - Backend validation errors (400)
   - Frontend error display
   - Field-level error messages
   - Form-level error messages

3. **Authentication Error Handling**:
   - Unauthorized (401) responses
   - Token expiration handling
   - Automatic token refresh
   - Redirect to login on auth failure

4. **Business Logic Error Handling**:
   - Application-specific errors
   - Conflict errors (409)
   - Not found errors (404)
   - Forbidden errors (403)

### Phase 6: Real-time Features Integration (if applicable)

**Objective**: Validate real-time communication features

**Actions**:
1. **WebSocket Connection**:
   - Initial connection establishment
   - Authentication over WebSocket
   - Connection lifecycle management
   - Reconnection on disconnect

2. **Real-time Data Sync**:
   - Server-to-client updates
   - Client-to-server events
   - Multi-client synchronization
   - Optimistic updates with server confirmation

3. **Notification System** (if applicable):
   - Push notifications
   - In-app notifications
   - Notification badge updates
   - Notification persistence

### Phase 7: File Upload/Download Integration (if applicable)

**Objective**: Validate file handling across the stack

**Actions**:
1. **File Upload Testing**:
   - Single file upload
   - Multiple file upload
   - Progress tracking
   - File type validation
   - File size validation
   - Error handling

2. **File Processing** (if applicable):
   - Background processing status
   - Progress updates (WebSocket/polling)
   - Processing completion notification
   - Error handling

3. **File Download Testing**:
   - File download initiation
   - Large file streaming
   - Download progress (if applicable)
   - File preview (if applicable)

### Phase 8: System Services Integration (if applicable)

**Objective**: Validate integration with specialized system services

**Actions**:
1. **AI/ML Service Integration**:
   - Request submission to model service
   - Async processing status tracking
   - Result retrieval and display
   - Error handling

2. **Video Processing Integration**:
   - Video upload to processing service
   - Processing status updates
   - Processed video delivery
   - Playback functionality

3. **Real-time Streaming Integration**:
   - Stream initiation
   - Peer connection establishment
   - Media flow validation
   - Stream quality adaptation

### Phase 9: Performance Integration Testing

**Objective**: Validate system performance under realistic conditions

**Actions**:
1. **End-to-End Performance**:
   - Full user flow timing
   - API response times
   - Page load times
   - Time to interactive

2. **Concurrent Operations**:
   - Multiple simultaneous API calls
   - Parallel data loading
   - Race condition testing
   - Resource contention scenarios

3. **Caching Validation**:
   - API response caching
   - Frontend data caching
   - Cache invalidation
   - Cache hit rates

4. **Database Performance**:
   - Query performance
   - Connection pooling
   - Transaction handling
   - Index usage

### Phase 10: Cross-Skill Collaboration for Integration Validation

**Objective**: Validate integration quality with experts

**Collaboration Pattern**:
1. **QA Testing Preparation**:
   - Mention **qa-testing** skill for:
     - E2E test planning
     - Test scenario identification
     - Accessibility testing preparation
     - Performance testing preparation

2. **Quality Validation**:
   - Mention **quality-controller** skill for:
     - Integration quality metrics
     - Performance baseline validation
     - Security validation

3. **Collaboration Documentation**:
   - Update .memory/collaboration.log.md
   - Record integration issues and resolutions
   - Track quality metrics

### Phase 11: Integration Documentation

**Objective**: Document integration patterns and configurations

**Deliverables**:

1. **.memory/integration-status.md**:
   ```markdown
   # Integration Status

   ## Frontend-Backend Integration
   - Authentication: ✅ Complete
   - CRUD Operations: ✅ Complete
   - Real-time Features: ✅ Complete
   - File Handling: ✅ Complete

   ## System Services Integration (if applicable)
   - AI/ML Service: ✅ Complete
   - Performance: 95ms avg latency

   ## Integration Points
   - API Base URL: http://localhost:3001/api
   - WebSocket URL: ws://localhost:3001
   - System Service URL: http://localhost:8000

   ## Known Issues
   - [Issue 1]: [Status and workaround]

   ## Performance Metrics
   - API Response: 150ms avg
   - Page Load: 1.2s avg
   - Time to Interactive: 1.8s avg
   ```

2. **Update .memory/user-flows.md**:
   ```markdown
   # User Flows - Integration Validated

   ## Registration Flow
   1. User submits registration form
   2. Frontend validates input
   3. API call to POST /api/auth/register
   4. Backend creates user
   5. JWT token returned
   6. Token stored in localStorage
   7. User redirected to dashboard
   Status: ✅ Validated

   ## Login Flow
   [Detailed flow...]
   Status: ✅ Validated

   ## [Feature] Flow
   [Detailed flow...]
   Status: ✅ Validated
   ```

### Phase 12: Memory System Updates

**Objective**: Update memory with integration completion

**Memory Updates**:

1. **Update .memory/active-context.md**:
   ```markdown
   ## Current Phase
   Phase: integration_completed
   Progress: 80%

   ## Completed Tasks
   - ✅ Requirements analysis
   - ✅ Research analysis
   - ✅ Architecture design
   - ✅ Implementation (frontend + backend)
   - ✅ Integration testing

   ## Integration Summary
   - Frontend-Backend: Fully integrated
   - Authentication: All flows validated
   - Data Operations: CRUD operations working
   - Real-time: WebSocket functional
   - Performance: Meeting targets

   ## Next Milestones
   1. Quality assurance and E2E testing
   2. Deployment preparation
   ```

2. **Update .memory/project-state.json**:
   ```json
   {
     "currentPhase": "integration_completed",
     "progress": {
       "overall": 80,
       "phases": {
         "requirements_analysis": 100,
         "research_analysis": 100,
         "architecture_design": 100,
         "implementation": 100,
         "integration": 100,
         "quality_assurance": 0
       }
     },
     "integration": {
       "frontend_backend": "complete",
       "authentication": "validated",
       "realtime": "functional",
       "system_services": "integrated"
     }
   }
   ```

3. **Update .memory/decisions.md**:
   ```markdown
   ## [YYYY-MM-DD] Integration Decisions

   ### Error Handling Strategy
   **Decision**: Centralized error handling with user-friendly messages
   **Rationale**: Consistent UX, easier maintenance
   **Impact**: Error handling across all API calls

   ### Real-time Communication
   **Decision**: WebSocket for bidirectional, SSE for server-to-client only
   **Rationale**: WebSocket more flexible for our use case
   **Impact**: Notification system, real-time updates

   ### File Upload Strategy
   **Decision**: Direct upload to backend, backend handles S3
   **Rationale**: Centralized security, easier management
   **Impact**: Upload performance, backend load
   ```

## Completion Criteria

**All criteria must be met before proceeding**:

- ✅ **All Services Running**: Frontend, backend, system services operational together
- ✅ **Authentication Validated**: All auth flows working end-to-end
- ✅ **Data Flows Validated**: CRUD operations working for all entities
- ✅ **Error Handling Consistent**: Errors handled gracefully across stack
- ✅ **Real-time Features Working**: WebSocket/SSE functional (if applicable)
- ✅ **File Handling Working**: Upload/download flows operational (if applicable)
- ✅ **System Services Integrated**: AI/ML or other services integrated (if applicable)
- ✅ **Performance Validated**: Response times and load times meeting targets
- ✅ **Documentation Complete**: Integration status and user flows documented
- ✅ **Memory System Updated**: All integration context recorded

## Verification Steps

1. **Functional Verification**:
   - Run through all major user flows manually
   - Verify all integration points working
   - Check error scenarios handled properly

2. **Performance Verification**:
   - Measure API response times
   - Check page load times
   - Validate Core Web Vitals

3. **Quality Verification**:
   - No console errors in browser
   - No unhandled exceptions in backend
   - All integration tests passing

## Next Workflows

**Sequential**:
→ **08-quality-assurance.md**: Comprehensive testing and validation
→ **07-deployment.md**: Deployment preparation (can start in parallel)

## Common Issues and Resolutions

**Issue**: CORS errors preventing API calls
**Resolution**: Configure Nest.js CORS with frontend origin, check credentials handling

**Issue**: Token refresh loop causing infinite requests
**Resolution**: Add request interceptor guards, implement proper refresh lock mechanism

**Issue**: WebSocket connection dropping frequently
**Resolution**: Implement heartbeat mechanism, add reconnection with exponential backoff

**Issue**: File uploads failing for large files
**Resolution**: Increase request size limits in Nest.js, implement chunked upload

**Issue**: Performance degradation with concurrent users
**Resolution**: Add database connection pooling, implement API rate limiting, optimize queries

## Output Example

**Success Output**:
```
Integration Testing Completed
==============================

Frontend-Backend Integration:
✅ Authentication: All flows validated (login, register, refresh, logout)
✅ CRUD Operations: All entities working (users, [features])
✅ Data Validation: Frontend + backend validation consistent
✅ Error Handling: Graceful error handling across stack

Real-time Features:
✅ WebSocket: Connected and functional
✅ Notifications: Real-time updates working
✅ Connection Management: Auto-reconnect operational

File Handling:
✅ Upload: Single and multiple files working
✅ Progress: Upload progress tracking accurate
✅ Download: File download and streaming working

System Services Integration:
✅ AI/ML Service: Model inference integrated (95ms avg)
✅ Status Updates: Real-time processing status via WebSocket

Performance Metrics:
✅ API Response: 145ms avg (target: <200ms)
✅ Page Load: 1.1s avg (target: <2.5s)
✅ Time to Interactive: 1.7s (target: <3s)
✅ Core Web Vitals: All green

Integration Quality:
✅ All User Flows: Validated end-to-end
✅ Error Scenarios: Tested and handled
✅ Concurrent Operations: No race conditions
✅ Data Consistency: Validated across stack

Next Steps:
→ Quality assurance workflow starting
→ Comprehensive E2E testing
→ Deployment preparation
```
