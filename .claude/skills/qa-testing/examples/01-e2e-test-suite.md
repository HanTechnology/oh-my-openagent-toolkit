# E2E Test Suite with Playwright MCP

## Overview

This example demonstrates comprehensive end-to-end (E2E) testing using **Playwright MCP tools exclusively** through Claude Code. Unlike traditional Playwright test frameworks that use the Playwright Node.js library, this approach uses structured test definitions (YAML) that Claude Code interprets and executes using Playwright MCP tools.

**Key Principle**: QA engineers define test cases in structured YAML format. Claude Code reads these definitions and executes tests using Playwright MCP tools (browser_navigate, browser_click, browser_type, etc.).

**Benefits**:
- Natural language test definitions
- No programming required for basic tests
- AI-powered test execution and debugging
- Automatic screenshot and error reporting
- Conversational test refinement

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Definition Layer                     │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ Test Cases     │  │ Page Objects │  │ Test Data       │ │
│  │ (YAML)         │  │ (YAML)       │  │ (JSON/YAML)     │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Execution Layer                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Claude Code (Test Runner)                │  │
│  │  • Parses YAML test definitions                       │  │
│  │  • Executes test steps using MCP tools                │  │
│  │  • Validates assertions                               │  │
│  │  • Generates reports with screenshots                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Playwright MCP Tools                      │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐│
│  │ navigate   │ │   click    │ │    type    │ │ snapshot ││
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘│
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐│
│  │ wait_for   │ │ screenshot │ │  evaluate  │ │ console  ││
│  └────────────┘ └────────────┘ └────────────┘ └──────────┘│
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Web Application                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Frontend   │  │    Backend   │  │   Database   │     │
│  │  (Next.js)   │  │   (NestJS)   │  │ (PostgreSQL) │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Test Case Definition Schema

### Complete YAML Schema

```yaml
# tests/e2e/schema.yaml
test_suite:
  # Metadata
  name: string                    # Test suite name
  description: string             # Test suite description
  version: string                 # Schema version (e.g., "1.0.0")

  # Configuration
  config:
    base_url: string              # Application base URL
    timeout: number               # Default timeout in ms (default: 30000)
    screenshot_on_failure: boolean # Take screenshot on test failure
    retry: number                 # Number of retries on failure
    headless: boolean             # Run in headless mode

  # Page Objects (reusable element definitions)
  page_objects:
    page_name:
      url: string                 # Page URL path
      description: string         # Page description
      elements:
        element_name:
          selector: string        # CSS selector or text
          description: string     # Element description
          type: string           # Element type (button, input, etc.)

  # Test Data
  test_data:
    dataset_name:
      - field: value

  # Setup (runs before all tests)
  setup:
    - action: string
      params: object

  # Teardown (runs after all tests)
  teardown:
    - action: string
      params: object

  # Test Cases
  test_cases:
    - id: string                  # Unique test ID (e.g., "AUTH-001")
      name: string                # Test name
      description: string         # Test description
      tags: string[]              # Tags for filtering (e.g., ["smoke", "critical"])
      depends_on: string[]        # Test IDs this test depends on

      # Test-specific setup
      before_each:
        - action: string
          params: object

      # Test steps
      steps:
        - action: string          # Action type
          element: string         # Element name (from page_objects)
          selector: string        # Direct selector (alternative to element)
          value: string           # Value for input actions
          params: object          # Additional parameters

      # Assertions
      assertions:
        - type: string            # Assertion type
          selector: string        # Element selector
          value: any              # Expected value
          message: string         # Assertion message

      # Test-specific teardown
      after_each:
        - action: string
          params: object
```

## Page Object Model

### Page Object Definitions

```yaml
# tests/e2e/page-objects/auth.yaml
page_objects:
  login_page:
    url: "/auth/login"
    description: "User authentication page"

    elements:
      email_input:
        selector: "input[name='email']"
        description: "Email address input field"
        type: "input"

      password_input:
        selector: "input[type='password']"
        description: "Password input field"
        type: "input"

      submit_button:
        selector: "button[type='submit']"
        description: "Login submit button"
        type: "button"

      error_alert:
        selector: "[role='alert']"
        description: "Error message container"
        type: "alert"

      remember_me:
        selector: "input[type='checkbox'][name='remember']"
        description: "Remember me checkbox"
        type: "checkbox"

      forgot_password_link:
        selector: "a[href='/auth/forgot-password']"
        description: "Forgot password link"
        type: "link"

      signup_link:
        selector: "a[href='/auth/signup']"
        description: "Sign up link"
        type: "link"

    # Reusable actions
    actions:
      perform_login:
        description: "Execute login flow"
        parameters:
          - name: email
            type: string
            required: true
          - name: password
            type: string
            required: true
          - name: remember_me
            type: boolean
            required: false
            default: false
        steps:
          - action: type
            element: email_input
            value: "{{email}}"
          - action: type
            element: password_input
            value: "{{password}}"
          - action: click_if
            condition: "{{remember_me}}"
            element: remember_me
          - action: click
            element: submit_button

  dashboard_page:
    url: "/dashboard"
    description: "User dashboard page"

    elements:
      user_menu:
        selector: "[data-testid='user-menu']"
        description: "User menu dropdown"
        type: "menu"

      logout_button:
        selector: "button[data-action='logout']"
        description: "Logout button"
        type: "button"

      welcome_message:
        selector: "h1[data-testid='welcome']"
        description: "Welcome message heading"
        type: "heading"

      stats_grid:
        selector: "[data-testid='stats-grid']"
        description: "Statistics grid container"
        type: "container"
```

```yaml
# tests/e2e/page-objects/todos.yaml
page_objects:
  todos_page:
    url: "/todos"
    description: "Todo list management page"

    elements:
      new_todo_input:
        selector: "input[data-testid='new-todo']"
        description: "New todo input field"
        type: "input"

      add_button:
        selector: "button[data-testid='add-todo']"
        description: "Add todo button"
        type: "button"

      todo_list:
        selector: "ul[data-testid='todo-list']"
        description: "Todo items list"
        type: "list"

      todo_item:
        selector: "li[data-testid^='todo-item-']"
        description: "Individual todo item"
        type: "list-item"

      todo_checkbox:
        selector: "input[type='checkbox'][data-testid^='todo-checkbox-']"
        description: "Todo completion checkbox"
        type: "checkbox"

      todo_delete:
        selector: "button[data-testid^='todo-delete-']"
        description: "Delete todo button"
        type: "button"

      todo_edit:
        selector: "button[data-testid^='todo-edit-']"
        description: "Edit todo button"
        type: "button"

      filter_all:
        selector: "button[data-filter='all']"
        description: "Show all todos filter"
        type: "button"

      filter_active:
        selector: "button[data-filter='active']"
        description: "Show active todos filter"
        type: "button"

      filter_completed:
        selector: "button[data-filter='completed']"
        description: "Show completed todos filter"
        type: "button"

      clear_completed:
        selector: "button[data-action='clear-completed']"
        description: "Clear completed todos button"
        type: "button"
```

## Test Suite: Authentication

```yaml
# tests/e2e/auth.test.yaml
test_suite:
  name: "Authentication E2E Tests"
  description: "Test user authentication flows including login, logout, and session management"
  version: "1.0.0"

  config:
    base_url: "http://localhost:3000"
    timeout: 30000
    screenshot_on_failure: true
    retry: 2
    headless: false

  imports:
    - page_objects/auth.yaml

  test_data:
    valid_users:
      - email: "user@example.com"
        password: "SecurePass123!"
        name: "John Doe"
      - email: "admin@example.com"
        password: "AdminPass456!"
        name: "Admin User"

    invalid_credentials:
      - email: "wrong@example.com"
        password: "wrongpass"
        expected_error: "Invalid email or password"
      - email: "invalid-email"
        password: "password123"
        expected_error: "Please enter a valid email address"
      - email: ""
        password: ""
        expected_error: "Email is required"

  test_cases:
    # Successful login flow
    - id: "AUTH-001"
      name: "Successful login with valid credentials"
      description: "User should be able to log in with valid email and password"
      tags: ["smoke", "critical", "authentication"]

      steps:
        - action: navigate
          url: "/auth/login"
          description: "Navigate to login page"

        - action: wait_for
          text: "Sign in to your account"
          timeout: 5000
          description: "Wait for login page to load"

        - action: type
          element: email_input
          value: "user@example.com"
          description: "Enter email address"

        - action: type
          element: password_input
          value: "SecurePass123!"
          description: "Enter password"

        - action: screenshot
          name: "login-form-filled"
          description: "Screenshot of filled login form"

        - action: click
          element: submit_button
          description: "Click login button"

        - action: wait_for
          text: "Dashboard"
          timeout: 10000
          description: "Wait for redirect to dashboard"

      assertions:
        - type: url_contains
          value: "/dashboard"
          message: "Should redirect to dashboard after successful login"

        - type: element_visible
          selector: "[data-testid='user-menu']"
          message: "User menu should be visible"

        - type: text_contains
          selector: "h1[data-testid='welcome']"
          value: "Welcome, John Doe"
          message: "Welcome message should display user's name"

        - type: no_console_errors
          message: "No console errors should occur during login"

        - type: network_request_made
          url: "/api/auth/login"
          method: "POST"
          message: "Login API request should be made"

        - type: network_response_status
          url: "/api/auth/login"
          status: 200
          message: "Login API should return 200 status"

    # Failed login - wrong password
    - id: "AUTH-002"
      name: "Failed login with incorrect password"
      description: "User should see error message when entering wrong password"
      tags: ["authentication", "error-handling"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: type
          element: email_input
          value: "user@example.com"

        - action: type
          element: password_input
          value: "WrongPassword123!"

        - action: click
          element: submit_button

        - action: wait_for
          selector: "[role='alert']"
          timeout: 5000

      assertions:
        - type: url_equals
          value: "/auth/login"
          message: "Should remain on login page"

        - type: element_visible
          selector: "[role='alert']"
          message: "Error alert should be visible"

        - type: text_contains
          selector: "[role='alert']"
          value: "Invalid email or password"
          message: "Error message should indicate invalid credentials"

        - type: network_response_status
          url: "/api/auth/login"
          status: 401
          message: "Login API should return 401 Unauthorized"

    # Form validation tests
    - id: "AUTH-003"
      name: "Email validation on login form"
      description: "Form should validate email format before submission"
      tags: ["authentication", "validation"]
      data_driven: true

      data:
        - input: "invalid-email"
          expected_error: "Please enter a valid email address"
        - input: "test@"
          expected_error: "Please enter a valid email address"
        - input: "@example.com"
          expected_error: "Please enter a valid email address"
        - input: "test..double@example.com"
          expected_error: "Please enter a valid email address"

      steps:
        - action: navigate
          url: "/auth/login"

        - action: type
          element: email_input
          value: "{{input}}"

        - action: type
          element: password_input
          value: "password123"

        - action: blur
          element: email_input

        - action: wait_for
          selector: "[data-error='email']"
          timeout: 2000

      assertions:
        - type: element_visible
          selector: "[data-error='email']"
          message: "Email validation error should be visible"

        - type: text_equals
          selector: "[data-error='email']"
          value: "{{expected_error}}"
          message: "Error message should match expected validation message"

        - type: attribute_equals
          selector: "button[type='submit']"
          attribute: "disabled"
          value: "true"
          message: "Submit button should be disabled when form is invalid"

    # Remember me functionality
    - id: "AUTH-004"
      name: "Remember me checkbox persists session"
      description: "User session should persist when 'Remember me' is checked"
      tags: ["authentication", "session"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: type
          element: email_input
          value: "user@example.com"

        - action: type
          element: password_input
          value: "SecurePass123!"

        - action: click
          element: remember_me

        - action: screenshot
          name: "remember-me-checked"

        - action: click
          element: submit_button

        - action: wait_for
          url: "/dashboard"

        - action: evaluate
          function: "() => localStorage.getItem('auth_remember')"
          store_as: "remember_value"

        - action: close_tab

        - action: new_tab

        - action: navigate
          url: "/"

      assertions:
        - type: url_contains
          value: "/dashboard"
          message: "Should auto-login and redirect to dashboard in new session"

        - type: variable_equals
          variable: "remember_value"
          value: "true"
          message: "Remember me flag should be set in localStorage"

    # Logout flow
    - id: "AUTH-005"
      name: "Successful logout"
      description: "User should be able to log out and session should be cleared"
      tags: ["authentication", "logout"]
      depends_on: ["AUTH-001"]

      before_each:
        - action: perform_login
          email: "user@example.com"
          password: "SecurePass123!"

      steps:
        - action: wait_for
          url: "/dashboard"

        - action: click
          element: user_menu

        - action: wait_for
          selector: "button[data-action='logout']"
          visible: true

        - action: click
          element: logout_button

        - action: wait_for
          url: "/auth/login"
          timeout: 5000

      assertions:
        - type: url_equals
          value: "/auth/login"
          message: "Should redirect to login page after logout"

        - type: evaluate_equals
          function: "() => localStorage.getItem('auth_token')"
          value: null
          message: "Auth token should be removed from localStorage"

        - type: network_request_made
          url: "/api/auth/logout"
          method: "POST"
          message: "Logout API request should be made"

    # Protected route access
    - id: "AUTH-006"
      name: "Unauthenticated user redirected from protected routes"
      description: "Users without authentication should be redirected to login"
      tags: ["authentication", "authorization", "routing"]

      steps:
        - action: evaluate
          function: "() => { localStorage.clear(); sessionStorage.clear(); }"
          description: "Clear all storage to ensure unauthenticated state"

        - action: navigate
          url: "/dashboard"
          description: "Try to access protected route"

        - action: wait_for
          url: "/auth/login"
          timeout: 5000

      assertions:
        - type: url_contains
          value: "/auth/login"
          message: "Should redirect to login page"

        - type: url_contains
          value: "redirect=/dashboard"
          message: "Should include redirect query parameter"

        - type: element_visible
          selector: "[role='alert']"
          message: "Should show authentication required message"

    # Password visibility toggle
    - id: "AUTH-007"
      name: "Password visibility toggle"
      description: "User should be able to toggle password visibility"
      tags: ["authentication", "usability"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: type
          element: password_input
          value: "SecurePass123!"

        - action: attribute_equals_check
          selector: "input[type='password']"
          attribute: "type"
          value: "password"

        - action: click
          selector: "button[data-testid='toggle-password-visibility']"

        - action: wait_for
          selector: "input[type='text'][name='password']"

      assertions:
        - type: attribute_equals
          selector: "input[name='password']"
          attribute: "type"
          value: "text"
          message: "Password input type should change to 'text'"

        - type: input_value
          selector: "input[name='password']"
          value: "SecurePass123!"
          message: "Password value should remain unchanged"
```

## Test Suite: CRUD Operations

```yaml
# tests/e2e/todos-crud.test.yaml
test_suite:
  name: "Todo CRUD Operations E2E Tests"
  description: "Test Create, Read, Update, Delete operations for todo items"
  version: "1.0.0"

  config:
    base_url: "http://localhost:3000"
    timeout: 30000
    screenshot_on_failure: true
    retry: 2

  imports:
    - page_objects/auth.yaml
    - page_objects/todos.yaml

  setup:
    # Login before all tests
    - action: navigate
      url: "/auth/login"
    - action: perform_login
      email: "user@example.com"
      password: "SecurePass123!"
    - action: wait_for
      url: "/dashboard"

  teardown:
    # Cleanup: delete all test todos
    - action: navigate
      url: "/todos"
    - action: click
      selector: "button[data-action='select-all']"
    - action: click
      selector: "button[data-action='delete-selected']"

  test_cases:
    # Create new todo
    - id: "TODO-001"
      name: "Create new todo item"
      description: "User should be able to create a new todo item"
      tags: ["crud", "create", "smoke"]

      steps:
        - action: navigate
          url: "/todos"

        - action: wait_for
          selector: "[data-testid='todo-list']"

        - action: evaluate
          function: "() => document.querySelectorAll('[data-testid^=\"todo-item-\"]').length"
          store_as: "initial_count"

        - action: type
          element: new_todo_input
          value: "Buy groceries"

        - action: screenshot
          name: "new-todo-input-filled"

        - action: click
          element: add_button

        - action: wait_for
          text: "Buy groceries"
          timeout: 5000

        - action: evaluate
          function: "() => document.querySelectorAll('[data-testid^=\"todo-item-\"]').length"
          store_as: "final_count"

      assertions:
        - type: element_visible
          selector: "li:has-text('Buy groceries')"
          message: "New todo should be visible in the list"

        - type: input_value
          element: new_todo_input
          value: ""
          message: "Input field should be cleared after adding todo"

        - type: variable_increment
          variable: "final_count"
          compared_to: "initial_count"
          increment: 1
          message: "Todo count should increase by 1"

        - type: network_request_made
          url: "/api/todos"
          method: "POST"
          message: "Create todo API request should be made"

        - type: network_response_status
          url: "/api/todos"
          status: 201
          message: "Create todo API should return 201 Created"

    # Read/view todo details
    - id: "TODO-002"
      name: "View todo item details"
      description: "User should be able to view todo item details"
      tags: ["crud", "read"]
      depends_on: ["TODO-001"]

      steps:
        - action: navigate
          url: "/todos"

        - action: click
          selector: "li:has-text('Buy groceries')"

        - action: wait_for
          selector: "[data-testid='todo-detail-modal']"
          visible: true

      assertions:
        - type: element_visible
          selector: "[data-testid='todo-detail-modal']"
          message: "Todo detail modal should be visible"

        - type: text_contains
          selector: "[data-testid='todo-title']"
          value: "Buy groceries"
          message: "Modal should display todo title"

        - type: element_visible
          selector: "[data-testid='todo-created-at']"
          message: "Created timestamp should be visible"

    # Update todo
    - id: "TODO-003"
      name: "Update todo item"
      description: "User should be able to edit and update a todo item"
      tags: ["crud", "update"]
      depends_on: ["TODO-001"]

      steps:
        - action: navigate
          url: "/todos"

        - action: hover
          selector: "li:has-text('Buy groceries')"

        - action: click
          selector: "li:has-text('Buy groceries') button[data-testid^='todo-edit-']"

        - action: wait_for
          selector: "input[data-testid='edit-todo-input']"
          visible: true

        - action: clear
          selector: "input[data-testid='edit-todo-input']"

        - action: type
          selector: "input[data-testid='edit-todo-input']"
          value: "Buy groceries and cook dinner"

        - action: screenshot
          name: "todo-being-edited"

        - action: press_key
          key: "Enter"

        - action: wait_for
          text: "Buy groceries and cook dinner"
          timeout: 5000

      assertions:
        - type: element_visible
          selector: "li:has-text('Buy groceries and cook dinner')"
          message: "Updated todo should be visible"

        - type: element_not_visible
          selector: "li:has-text('Buy groceries'):not(:has-text('and cook dinner'))"
          message: "Old todo text should not be visible"

        - type: network_request_made
          url_pattern: "/api/todos/[0-9]+"
          method: "PATCH"
          message: "Update todo API request should be made"

    # Mark todo as complete
    - id: "TODO-004"
      name: "Mark todo as completed"
      description: "User should be able to mark a todo as completed"
      tags: ["crud", "update", "smoke"]
      depends_on: ["TODO-001"]

      steps:
        - action: navigate
          url: "/todos"

        - action: click
          selector: "li:has-text('Buy groceries') input[type='checkbox']"

        - action: wait_for
          selector: "li:has-text('Buy groceries')[data-completed='true']"
          timeout: 3000

      assertions:
        - type: checkbox_checked
          selector: "li:has-text('Buy groceries') input[type='checkbox']"
          message: "Todo checkbox should be checked"

        - type: class_contains
          selector: "li:has-text('Buy groceries')"
          value: "completed"
          message: "Todo item should have 'completed' class"

        - type: attribute_equals
          selector: "li:has-text('Buy groceries')"
          attribute: "data-completed"
          value: "true"
          message: "Todo should have data-completed='true' attribute"

    # Delete todo
    - id: "TODO-005"
      name: "Delete todo item"
      description: "User should be able to delete a todo item with confirmation"
      tags: ["crud", "delete"]
      depends_on: ["TODO-001"]

      steps:
        - action: navigate
          url: "/todos"

        - action: evaluate
          function: "() => document.querySelectorAll('[data-testid^=\"todo-item-\"]').length"
          store_as: "count_before_delete"

        - action: hover
          selector: "li:has-text('Buy groceries')"

        - action: click
          selector: "li:has-text('Buy groceries') button[data-testid^='todo-delete-']"

        - action: wait_for
          selector: "[role='dialog']"
          visible: true
          description: "Wait for confirmation dialog"

        - action: screenshot
          name: "delete-confirmation-dialog"

        - action: click
          selector: "button[data-action='confirm-delete']"

        - action: wait_for
          text: "Todo deleted successfully"
          timeout: 5000

        - action: evaluate
          function: "() => document.querySelectorAll('[data-testid^=\"todo-item-\"]').length"
          store_as: "count_after_delete"

      assertions:
        - type: element_not_visible
          selector: "li:has-text('Buy groceries')"
          message: "Deleted todo should not be visible"

        - type: variable_decrement
          variable: "count_after_delete"
          compared_to: "count_before_delete"
          decrement: 1
          message: "Todo count should decrease by 1"

        - type: network_request_made
          url_pattern: "/api/todos/[0-9]+"
          method: "DELETE"
          message: "Delete todo API request should be made"

        - type: element_visible
          selector: "[role='alert']:has-text('Todo deleted successfully')"
          message: "Success notification should be visible"

    # Bulk operations
    - id: "TODO-006"
      name: "Bulk delete completed todos"
      description: "User should be able to delete all completed todos at once"
      tags: ["crud", "delete", "bulk"]

      before_each:
        # Create and complete multiple todos
        - action: navigate
          url: "/todos"
        - action: create_todo
          title: "Test todo 1"
        - action: create_todo
          title: "Test todo 2"
        - action: create_todo
          title: "Test todo 3"
        - action: complete_todo
          title: "Test todo 1"
        - action: complete_todo
          title: "Test todo 2"

      steps:
        - action: navigate
          url: "/todos"

        - action: evaluate
          function: "() => document.querySelectorAll('[data-completed=\"true\"]').length"
          store_as: "completed_count"

        - action: click
          element: clear_completed

        - action: wait_for
          selector: "[role='dialog']"

        - action: click
          selector: "button[data-action='confirm-bulk-delete']"

        - action: wait_for
          text: "Completed todos cleared"

      assertions:
        - type: element_count
          selector: "[data-completed='true']"
          count: 0
          message: "No completed todos should remain"

        - type: element_visible
          selector: "li:has-text('Test todo 3')"
          message: "Uncompleted todo should still be visible"
```

## Execution with Claude Code

### Example Conversation Flow

```markdown
User: Execute the authentication test suite in tests/e2e/auth.test.yaml

Claude Code:
I'll execute the authentication test suite. Let me start by reading the test definition.

[Reads tests/e2e/auth.test.yaml]

Found 7 test cases in the Authentication E2E Tests suite. I'll execute them in order.

Executing AUTH-001: "Successful login with valid credentials"
1. Navigating to http://localhost:3000/auth/login
   [Uses browser_navigate MCP tool]

2. Waiting for "Sign in to your account" text
   [Uses browser_wait_for MCP tool]
   ✓ Text found

3. Typing email address
   [Uses browser_type MCP tool with selector "input[name='email']"]
   ✓ Email entered

4. Typing password
   [Uses browser_type MCP tool with selector "input[type='password']"]
   ✓ Password entered

5. Taking screenshot: login-form-filled
   [Uses browser_take_screenshot MCP tool]
   ✓ Screenshot saved to test-results/screenshots/login-form-filled.png

6. Clicking login button
   [Uses browser_click MCP tool]
   ✓ Button clicked

7. Waiting for "Dashboard" text
   [Uses browser_wait_for MCP tool]
   ✓ Dashboard loaded

Running assertions:
✓ URL contains "/dashboard"
✓ Element "[data-testid='user-menu']" is visible
✓ Welcome message contains "Welcome, John Doe"
✓ No console errors detected
✓ Network request to "/api/auth/login" was made (POST)
✓ API response status: 200

AUTH-001: PASSED (8.3s)

Executing AUTH-002: "Failed login with incorrect password"
[... continues with remaining tests ...]

Test Suite Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passed:  7/7 (100%)
Failed:  0/7 (0%)
Skipped: 0/7 (0%)
Total Duration: 42.7s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All tests passed! Screenshots and detailed logs saved to test-results/
```

### Interactive Debugging

```markdown
User: Run AUTH-002 test but pause before clicking the submit button

Claude Code:
I'll execute AUTH-002 with a breakpoint before the submit button click.

Executing AUTH-002: "Failed login with incorrect password"
1. ✓ Navigated to login page
2. ✓ Entered email: user@example.com
3. ✓ Entered password: WrongPassword123!

[PAUSED] About to click submit button
Current state:
- URL: http://localhost:3000/auth/login
- Form filled with invalid credentials
- Submit button is enabled

What would you like to do?
- 'continue' to proceed with clicking submit
- 'inspect <selector>' to inspect an element
- 'screenshot' to take a screenshot
- 'modify' to change a step

User: screenshot

Claude Code:
[Takes screenshot]
Screenshot saved to test-results/debug/auth-002-paused.png

User: inspect input[name='email']

Claude Code:
[Uses browser_snapshot and browser_evaluate]

Element: input[name='email']
- Value: "user@example.com"
- Validity: valid
- Attributes: {
    name: "email",
    type: "email",
    required: true,
    autocomplete: "email"
  }
- Computed styles: {
    borderColor: "rgb(209, 213, 219)",
    backgroundColor: "rgb(255, 255, 255)"
  }

User: continue

Claude Code:
Continuing execution...
4. ✓ Clicked submit button
5. ✓ Wait for error alert

Running assertions:
✓ All assertions passed

AUTH-002: PASSED (5.2s)
```

## Assertions and Validation

### Complete Assertion Types Reference

```yaml
# URL Assertions
assertions:
  - type: url_equals
    value: "/dashboard"
    message: "URL should be exactly /dashboard"

  - type: url_contains
    value: "dashboard"
    message: "URL should contain 'dashboard'"

  - type: url_pattern
    pattern: "^/users/[0-9]+$"
    message: "URL should match user detail pattern"

# Element Existence and Visibility
assertions:
  - type: element_visible
    selector: "[data-testid='user-menu']"
    message: "User menu should be visible"

  - type: element_hidden
    selector: "[data-testid='loading-spinner']"
    message: "Loading spinner should be hidden"

  - type: element_exists
    selector: "meta[name='description']"
    message: "Meta description should exist in DOM"

  - type: element_not_exists
    selector: "[data-error]"
    message: "No error elements should exist"

  - type: element_count
    selector: "li[data-testid^='todo-item-']"
    count: 5
    message: "Should have exactly 5 todo items"

  - type: element_count_greater_than
    selector: "li[data-testid^='todo-item-']"
    count: 0
    message: "Should have at least one todo item"

# Text Content Assertions
assertions:
  - type: text_equals
    selector: "h1"
    value: "Welcome to the Dashboard"
    message: "Heading should match exactly"

  - type: text_contains
    selector: "[data-testid='welcome']"
    value: "John Doe"
    message: "Welcome message should contain user name"

  - type: text_pattern
    selector: "[data-testid='order-id']"
    pattern: "^ORD-[0-9]{6}$"
    message: "Order ID should match pattern"

# Attribute Assertions
assertions:
  - type: attribute_equals
    selector: "button[type='submit']"
    attribute: "disabled"
    value: "true"
    message: "Submit button should be disabled"

  - type: attribute_contains
    selector: "img[alt='Profile']"
    attribute: "src"
    value: "cloudinary.com"
    message: "Image should be from Cloudinary CDN"

  - type: class_contains
    selector: "li.todo-item"
    value: "completed"
    message: "Todo should have completed class"

  - type: class_not_contains
    selector: "li.todo-item"
    value: "error"
    message: "Todo should not have error class"

# Form Input Assertions
assertions:
  - type: input_value
    selector: "input[name='email']"
    value: "user@example.com"
    message: "Email input should contain correct value"

  - type: checkbox_checked
    selector: "input[name='remember']"
    message: "Remember me checkbox should be checked"

  - type: checkbox_unchecked
    selector: "input[name='remember']"
    message: "Remember me checkbox should be unchecked"

  - type: select_value
    selector: "select[name='country']"
    value: "US"
    message: "Country select should have US selected"

# Network Assertions
assertions:
  - type: network_request_made
    url: "/api/auth/login"
    method: "POST"
    message: "Login API request should be made"

  - type: network_request_not_made
    url: "/api/analytics"
    message: "Analytics should not be called during login"

  - type: network_response_status
    url: "/api/auth/login"
    status: 200
    message: "Login should return 200 OK"

  - type: network_response_body_contains
    url: "/api/auth/login"
    path: "user.email"
    value: "user@example.com"
    message: "Response should contain user email"

  - type: network_response_time_less_than
    url: "/api/todos"
    duration: 1000
    message: "API should respond within 1 second"

# Console Assertions
assertions:
  - type: no_console_errors
    message: "No console errors should occur"

  - type: no_console_warnings
    message: "No console warnings should occur"

  - type: console_message
    level: "info"
    message_contains: "User logged in successfully"
    message: "Should log successful login message"

# Local Storage / Session Storage
assertions:
  - type: local_storage_key_exists
    key: "auth_token"
    message: "Auth token should be stored in localStorage"

  - type: local_storage_value_equals
    key: "theme"
    value: "dark"
    message: "Theme should be set to dark"

  - type: session_storage_key_not_exists
    key: "temp_data"
    message: "Temporary data should be cleared"

# JavaScript Evaluation
assertions:
  - type: evaluate_equals
    function: "() => localStorage.getItem('user_id')"
    value: "12345"
    message: "User ID should be stored correctly"

  - type: evaluate_truthy
    function: "() => window.analytics !== undefined"
    message: "Analytics should be initialized"

# Visual Comparison
assertions:
  - type: visual_match
    baseline: "test-results/baseline/homepage.png"
    threshold: 0.05
    message: "Homepage should match visual baseline"

  - type: element_screenshot_match
    selector: "[data-testid='header']"
    baseline: "test-results/baseline/header.png"
    threshold: 0.1
    message: "Header should match visual baseline"

# Accessibility
assertions:
  - type: no_accessibility_violations
    standards: ["wcag2a", "wcag2aa"]
    message: "Page should have no accessibility violations"

  - type: element_has_accessible_name
    selector: "button[data-action='delete']"
    message: "Delete button should have accessible name"

# Performance
assertions:
  - type: page_load_time_less_than
    duration: 3000
    message: "Page should load within 3 seconds"

  - type: first_contentful_paint_less_than
    duration: 1500
    message: "FCP should be under 1.5 seconds"
```

## Visual Regression Testing

### Screenshot Baseline Management

```yaml
# tests/e2e/visual-regression.test.yaml
test_suite:
  name: "Visual Regression Tests"
  description: "Detect unintended visual changes across the application"

  config:
    base_url: "http://localhost:3000"
    visual_baseline_dir: "test-results/visual/baseline"
    visual_output_dir: "test-results/visual/current"
    visual_diff_dir: "test-results/visual/diff"
    visual_threshold: 0.1  # 10% difference allowed

  test_cases:
    - id: "VISUAL-001"
      name: "Homepage visual regression"
      description: "Detect visual changes on homepage"
      tags: ["visual", "smoke"]

      steps:
        - action: navigate
          url: "/"

        - action: wait_for
          selector: "[data-loaded='true']"

        - action: screenshot
          name: "homepage-full"
          full_page: true
          options:
            remove_elements:
              - "[data-dynamic='true']"  # Hide dynamic content
              - ".advertisement"
            mask_elements:
              - "[data-user-specific]"  # Mask user-specific content

      visual_assertions:
        - type: visual_match
          current: "visual/current/homepage-full.png"
          baseline: "visual/baseline/homepage-full.png"
          threshold: 0.05
          generate_diff: true

    - id: "VISUAL-002"
      name: "Component library visual regression"
      description: "Test all component variations for visual changes"
      tags: ["visual", "components"]

      steps:
        - action: navigate
          url: "/components/buttons"

        - action: screenshot
          selector: "[data-testid='button-primary']"
          name: "button-primary"

        - action: screenshot
          selector: "[data-testid='button-secondary']"
          name: "button-secondary"

        - action: screenshot
          selector: "[data-testid='button-disabled']"
          name: "button-disabled"

      visual_assertions:
        - type: visual_match_multiple
          screenshots:
            - button-primary
            - button-secondary
            - button-disabled
          threshold: 0.02
```

### Visual Testing Workflow

```bash
#!/bin/bash
# scripts/visual-regression.sh

# Initialize baseline screenshots (one-time or when design changes)
init_baseline() {
  echo "Initializing visual baseline screenshots..."

  # Start application
  docker-compose up -d

  # Wait for app to be ready
  ./scripts/wait-for-services.sh

  # Run tests to generate baseline
  claude-code --execute "
    Execute visual regression tests from tests/e2e/visual-regression.test.yaml
    and save all screenshots to test-results/visual/baseline/
  "

  echo "Baseline screenshots saved to test-results/visual/baseline/"
}

# Run visual regression tests
run_visual_tests() {
  echo "Running visual regression tests..."

  # Generate current screenshots
  claude-code --execute "
    Execute visual regression tests from tests/e2e/visual-regression.test.yaml
    and save all screenshots to test-results/visual/current/
  "

  # Compare with baseline
  node scripts/compare-screenshots.js \
    --baseline test-results/visual/baseline \
    --current test-results/visual/current \
    --diff test-results/visual/diff \
    --threshold 0.1 \
    --output test-results/visual-report.html

  echo "Visual regression report: test-results/visual-report.html"
}

# Update baseline (after approved design changes)
update_baseline() {
  echo "Updating visual baseline screenshots..."

  cp -r test-results/visual/current/* test-results/visual/baseline/

  echo "Baseline updated with current screenshots"
}

case "$1" in
  init)
    init_baseline
    ;;
  test)
    run_visual_tests
    ;;
  update)
    update_baseline
    ;;
  *)
    echo "Usage: $0 {init|test|update}"
    exit 1
esac
```

```javascript
// scripts/compare-screenshots.js
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

async function compareScreenshots(baselineDir, currentDir, diffDir, threshold) {
  const results = [];
  const currentFiles = fs.readdirSync(currentDir);

  for (const file of currentFiles) {
    if (!file.endsWith('.png')) continue;

    const baselinePath = path.join(baselineDir, file);
    const currentPath = path.join(currentDir, file);
    const diffPath = path.join(diffDir, file);

    if (!fs.existsSync(baselinePath)) {
      results.push({
        file,
        status: 'NEW',
        message: 'No baseline found - this is a new screenshot'
      });
      continue;
    }

    const baseline = PNG.sync.read(fs.readFileSync(baselinePath));
    const current = PNG.sync.read(fs.readFileSync(currentPath));
    const { width, height } = baseline;

    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(
      baseline.data,
      current.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    const diffPercentage = (numDiffPixels / (width * height)) * 100;
    const passed = diffPercentage <= threshold;

    if (!passed) {
      fs.writeFileSync(diffPath, PNG.sync.write(diff));
    }

    results.push({
      file,
      status: passed ? 'PASS' : 'FAIL',
      diffPercentage: diffPercentage.toFixed(2),
      diffPixels: numDiffPixels,
      threshold,
      diffImage: passed ? null : diffPath
    });
  }

  return results;
}

// Generate HTML report
function generateReport(results, outputPath) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Visual Regression Test Report</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; }
    .summary { background: #f0f0f0; padding: 20px; margin-bottom: 30px; }
    .result { border: 1px solid #ddd; margin-bottom: 20px; padding: 20px; }
    .result.pass { border-left: 5px solid #22c55e; }
    .result.fail { border-left: 5px solid #ef4444; }
    .result.new { border-left: 5px solid #3b82f6; }
    .images { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .images img { max-width: 100%; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>Visual Regression Test Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p>Total: ${results.length}</p>
    <p>Passed: ${results.filter(r => r.status === 'PASS').length}</p>
    <p>Failed: ${results.filter(r => r.status === 'FAIL').length}</p>
    <p>New: ${results.filter(r => r.status === 'NEW').length}</p>
  </div>

  ${results.map(r => `
    <div class="result ${r.status.toLowerCase()}">
      <h3>${r.file}</h3>
      <p>Status: <strong>${r.status}</strong></p>
      ${r.diffPercentage ? `<p>Difference: ${r.diffPercentage}% (threshold: ${r.threshold}%)</p>` : ''}
      ${r.diffImage ? `
        <div class="images">
          <div><strong>Baseline</strong><br><img src="../baseline/${r.file}"></div>
          <div><strong>Current</strong><br><img src="../current/${r.file}"></div>
          <div><strong>Diff</strong><br><img src="../diff/${r.file}"></div>
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;

  fs.writeFileSync(outputPath, html);
}

module.exports = { compareScreenshots, generateReport };
```

## Network and Console Monitoring

### Network Request Tracking

```yaml
# tests/e2e/network-monitoring.test.yaml
test_suite:
  name: "Network Monitoring Tests"
  description: "Monitor and validate network requests"

  config:
    monitor_network: true  # Enable network request tracking

  test_cases:
    - id: "NET-001"
      name: "API calls optimization"
      description: "Ensure no duplicate or unnecessary API calls"
      tags: ["network", "performance"]

      steps:
        - action: navigate
          url: "/dashboard"

        - action: wait_for
          selector: "[data-loaded='true']"

        - action: get_network_requests
          store_as: "network_requests"

      assertions:
        - type: network_request_count
          url_pattern: "/api/users/me"
          max_count: 1
          message: "User info should be fetched only once"

        - type: network_request_count
          url_pattern: "/api/todos"
          max_count: 1
          message: "Todos should be fetched only once"

        - type: no_network_errors
          message: "No network requests should fail"

        - type: all_api_responses_cached
          urls: ["/api/users/me", "/api/settings"]
          message: "Static data should be cached"

    - id: "NET-002"
      name: "API error handling"
      description: "Verify graceful handling of API errors"
      tags: ["network", "error-handling"]

      before_each:
        # Mock API to return errors
        - action: mock_api
          url: "/api/todos"
          method: "GET"
          response:
            status: 500
            body: { error: "Internal Server Error" }

      steps:
        - action: navigate
          url: "/todos"

        - action: wait_for
          text: "Failed to load todos"

      assertions:
        - type: element_visible
          selector: "[role='alert']"
          message: "Error message should be displayed"

        - type: console_message
          level: "error"
          message_pattern: "Failed to fetch todos"
          message: "Error should be logged to console"

        - type: network_request_made
          url: "/api/todos"
          method: "GET"
          message: "API request should be attempted"
```

### Console Error Detection

```yaml
# tests/e2e/console-monitoring.test.yaml
test_suite:
  name: "Console Monitoring Tests"
  description: "Detect console errors and warnings"

  config:
    monitor_console: true
    fail_on_console_error: true

  test_cases:
    - id: "CONSOLE-001"
      name: "No console errors on homepage"
      description: "Homepage should load without console errors"
      tags: ["console", "smoke"]

      steps:
        - action: navigate
          url: "/"

        - action: wait_for
          selector: "[data-loaded='true']"

        - action: get_console_messages
          store_as: "console_logs"

      assertions:
        - type: no_console_errors
          message: "No console errors should occur"

        - type: no_console_warnings
          exclude_patterns:
            - "React DevTools"
            - "Download the React DevTools"
          message: "No console warnings (except React DevTools)"

    - id: "CONSOLE-002"
      name: "Detect 404 resource errors"
      description: "No 404 errors for resources"
      tags: ["console", "resources"]

      steps:
        - action: navigate
          url: "/"

        - action: wait_for
          selector: "[data-loaded='true']"

      assertions:
        - type: no_console_errors_matching
          pattern: "404.*not found"
          message: "No 404 errors for resources"

        - type: no_console_errors_matching
          pattern: "Failed to load resource"
          message: "All resources should load successfully"
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests with Playwright MCP

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # Run daily at 2 AM

env:
  NODE_VERSION: '20'

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        test-suite:
          - auth
          - todos-crud
          - navigation
          - visual-regression
      fail-fast: false

    services:
      postgres:
        image: postgres:15-alpine
        env:
          POSTGRES_DB: testdb
          POSTGRES_USER: testuser
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build application
        run: pnpm build
        env:
          NODE_ENV: production

      - name: Start application
        run: |
          docker-compose -f docker-compose.test.yml up -d
          chmod +x scripts/wait-for-services.sh
          ./scripts/wait-for-services.sh
        env:
          DATABASE_URL: postgresql://testuser:testpass@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Run database migrations
        run: pnpm migrate:test

      - name: Seed test data
        run: pnpm seed:test

      - name: Setup Claude Code CLI
        run: |
          # Install Claude Code CLI (hypothetical - adjust for actual installation)
          npm install -g @anthropic/claude-code-cli
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Execute E2E tests
        id: e2e-tests
        run: |
          mkdir -p test-results/screenshots
          mkdir -p test-results/reports

          # Execute test suite using Claude Code
          claude-code execute \
            --test-suite tests/e2e/${{ matrix.test-suite }}.test.yaml \
            --output test-results/reports/${{ matrix.test-suite }}.json \
            --screenshot-dir test-results/screenshots \
            --timeout 300000 \
            --retry 1
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          TEST_BASE_URL: http://localhost:3000

      - name: Generate test report
        if: always()
        run: |
          node scripts/generate-test-report.js \
            --input test-results/reports/${{ matrix.test-suite }}.json \
            --output test-results/reports/${{ matrix.test-suite }}.html

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.test-suite }}
          path: |
            test-results/reports/
            test-results/screenshots/
          retention-days: 30

      - name: Upload screenshots on failure
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: failure-screenshots-${{ matrix.test-suite }}
          path: test-results/screenshots/
          retention-days: 30

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(
              fs.readFileSync('test-results/reports/${{ matrix.test-suite }}.json', 'utf8')
            );

            const comment = `## E2E Test Results: ${{ matrix.test-suite }}

            - **Passed:** ${results.passed}/${results.total}
            - **Failed:** ${results.failed}/${results.total}
            - **Duration:** ${results.duration}s

            ${results.failed > 0 ? '### Failed Tests\n' + results.failures.map(f =>
              `- ❌ ${f.id}: ${f.name}\n  ${f.error}`
            ).join('\n') : '✅ All tests passed!'}
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });

      - name: Fail job if tests failed
        if: steps.e2e-tests.outcome == 'failure'
        run: exit 1

      - name: Cleanup
        if: always()
        run: docker-compose -f docker-compose.test.yml down -v

  visual-regression:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download baseline screenshots
        uses: actions/download-artifact@v4
        with:
          name: visual-baseline
          path: test-results/visual/baseline
        continue-on-error: true

      - name: Start application
        run: docker-compose -f docker-compose.test.yml up -d

      - name: Run visual regression tests
        run: |
          claude-code execute \
            --test-suite tests/e2e/visual-regression.test.yaml \
            --screenshot-dir test-results/visual/current
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Compare screenshots
        run: |
          node scripts/compare-screenshots.js \
            --baseline test-results/visual/baseline \
            --current test-results/visual/current \
            --diff test-results/visual/diff \
            --threshold 0.1 \
            --output test-results/visual-report.html

      - name: Upload visual regression report
        uses: actions/upload-artifact@v4
        with:
          name: visual-regression-report
          path: |
            test-results/visual/
            test-results/visual-report.html

  update-baseline:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    needs: [e2e-tests, visual-regression]

    steps:
      - name: Download current screenshots
        uses: actions/download-artifact@v4
        with:
          name: visual-regression-report
          path: test-results/visual

      - name: Upload new baseline
        uses: actions/upload-artifact@v4
        with:
          name: visual-baseline
          path: test-results/visual/current
          retention-days: 90
```

## Test Data Management

```yaml
# tests/e2e/test-data/users.yaml
users:
  admin:
    email: "admin@example.com"
    password: "Admin123!@#"
    role: "ADMIN"
    name: "Admin User"
    permissions:
      - "users:read"
      - "users:write"
      - "users:delete"
      - "settings:write"

  regular_user:
    email: "user@example.com"
    password: "User123!@#"
    role: "USER"
    name: "John Doe"
    permissions:
      - "todos:read"
      - "todos:write"

  premium_user:
    email: "premium@example.com"
    password: "Premium123!@#"
    role: "USER"
    subscription: "PREMIUM"
    name: "Jane Smith"

  disabled_user:
    email: "disabled@example.com"
    password: "Disabled123!@#"
    role: "USER"
    status: "DISABLED"
```

```yaml
# tests/e2e/test-data/todos.yaml
todos:
  sample_todos:
    - title: "Buy groceries"
      description: "Milk, bread, eggs"
      priority: "HIGH"
      due_date: "2024-01-15"

    - title: "Read documentation"
      description: "Playwright MCP tools guide"
      priority: "MEDIUM"
      tags: ["learning", "development"]

    - title: "Write tests"
      description: "E2E tests for authentication"
      priority: "HIGH"
      assignee: "user@example.com"
```

```typescript
// tests/e2e/fixtures/test-data-loader.ts
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export class TestDataLoader {
  private dataDir: string;

  constructor(dataDir: string = 'tests/e2e/test-data') {
    this.dataDir = dataDir;
  }

  load<T>(filename: string): T {
    const filePath = path.join(this.dataDir, filename);
    const content = fs.readFileSync(filePath, 'utf8');
    return yaml.parse(content) as T;
  }

  loadUsers() {
    return this.load('users.yaml');
  }

  loadTodos() {
    return this.load('todos.yaml');
  }

  getUser(key: string) {
    const users = this.loadUsers();
    return users.users[key];
  }

  getTodos(key: string) {
    const todos = this.loadTodos();
    return todos.todos[key];
  }
}
```

## Common Testing Patterns

### 1. Setup and Teardown

```yaml
test_suite:
  # Global setup - runs once before all tests
  setup:
    - action: evaluate
      function: "() => { localStorage.clear(); sessionStorage.clear(); }"
      description: "Clear all storage"

    - action: navigate
      url: "/auth/login"

    - action: perform_login
      email: "user@example.com"
      password: "SecurePass123!"

    - action: wait_for
      url: "/dashboard"

  # Global teardown - runs once after all tests
  teardown:
    - action: navigate
      url: "/settings/test-data"

    - action: click
      selector: "button[data-action='clear-test-data']"

    - action: perform_logout

  test_cases:
    - id: "TEST-001"
      name: "Example test"

      # Test-specific setup
      before_each:
        - action: navigate
          url: "/todos"
        - action: clear_todos

      # Test-specific teardown
      after_each:
        - action: take_screenshot_on_failure
        - action: clear_cookies
```

### 2. Data-Driven Testing

```yaml
test_cases:
  - id: "FORM-VAL-001"
    name: "Email validation with multiple inputs"
    description: "Test email field validation with various invalid inputs"
    data_driven: true

    data_source:
      type: "inline"
      data:
        - { input: "", error: "Email is required" }
        - { input: "invalid", error: "Please enter a valid email" }
        - { input: "test@", error: "Please enter a valid email" }
        - { input: "@example.com", error: "Please enter a valid email" }
        - { input: "test@example.com", error: null }

    steps:
      - action: type
        element: email_input
        value: "{{input}}"

      - action: blur
        element: email_input

      - action: wait_for_condition
        timeout: 2000

    assertions:
      - type: conditional
        condition: "{{error}} !== null"
        then:
          - type: element_visible
            selector: "[data-error='email']"
          - type: text_equals
            selector: "[data-error='email']"
            value: "{{error}}"
        else:
          - type: element_not_visible
            selector: "[data-error='email']"
```

### 3. Retry and Timeout Patterns

```yaml
steps:
  # Retry failed actions
  - action: click
    selector: "button[data-action='submit']"
    retry:
      max_attempts: 3
      delay: 1000
      retry_on:
        - "element not found"
        - "element not clickable"

  # Wait with custom timeout
  - action: wait_for
    selector: "[data-loaded='true']"
    timeout: 30000
    polling_interval: 500

  # Wait for network idle
  - action: wait_for_network_idle
    timeout: 10000
    idle_duration: 500  # Consider idle after 500ms of no network activity

  # Wait for multiple conditions
  - action: wait_for_all
    conditions:
      - type: element_visible
        selector: "[data-testid='user-menu']"
      - type: network_request_complete
        url: "/api/user"
      - type: no_console_errors
    timeout: 15000
```

### 4. Conditional Steps

```yaml
steps:
  # Execute step only if condition is met
  - action: conditional
    condition:
      type: element_visible
      selector: "[data-cookie-banner]"
    then:
      - action: click
        selector: "button[data-action='accept-cookies']"
      - action: wait_for
        selector: "[data-cookie-banner]"
        visible: false

  # Switch case pattern
  - action: evaluate
    function: "() => document.querySelector('[data-user-type]').dataset.userType"
    store_as: "user_type"

  - action: switch
    variable: "user_type"
    cases:
      admin:
        - action: navigate
          url: "/admin/dashboard"
      premium:
        - action: navigate
          url: "/premium/dashboard"
      default:
        - action: navigate
          url: "/dashboard"
```

### 5. Reusable Action Sequences

```yaml
# tests/e2e/actions/common-actions.yaml
actions:
  perform_login:
    description: "Standard login flow"
    parameters:
      - email
      - password
      - remember_me (optional, default: false)
    steps:
      - action: navigate
        url: "/auth/login"
      - action: type
        element: email_input
        value: "{{email}}"
      - action: type
        element: password_input
        value: "{{password}}"
      - action: click_if
        condition: "{{remember_me}}"
        element: remember_me
      - action: click
        element: submit_button
      - action: wait_for
        url: "/dashboard"

  create_todo:
    description: "Create a new todo item"
    parameters:
      - title
      - description (optional)
    steps:
      - action: type
        element: new_todo_input
        value: "{{title}}"
      - action: click_if
        condition: "{{description}}"
        element: expand_description
      - action: type_if
        condition: "{{description}}"
        element: description_input
        value: "{{description}}"
      - action: click
        element: add_button
      - action: wait_for
        text: "{{title}}"

  clear_todos:
    description: "Delete all todos"
    steps:
      - action: navigate
        url: "/todos"
      - action: click
        selector: "button[data-action='select-all']"
      - action: click
        selector: "button[data-action='delete-selected']"
      - action: click
        selector: "button[data-action='confirm']"

# Use in tests
test_cases:
  - id: "TEST-001"
    steps:
      - action: use
        action_name: perform_login
        params:
          email: "user@example.com"
          password: "password123"

      - action: use
        action_name: create_todo
        params:
          title: "Test todo"
          description: "This is a test"
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Element Not Found

```yaml
# Problem: Element selector not matching
assertions:
  - type: element_visible
    selector: "button[type='submit']"
    # Error: Element not found

# Solution 1: Use more specific selector
assertions:
  - type: element_visible
    selector: "form[data-testid='login-form'] button[type='submit']"

# Solution 2: Wait for element to appear
steps:
  - action: wait_for
    selector: "button[type='submit']"
    timeout: 10000
  - action: click
    selector: "button[type='submit']"

# Solution 3: Use text-based selector
steps:
  - action: click
    text: "Sign In"
```

#### 2. Timing Issues

```yaml
# Problem: Test fails intermittently due to timing

# Solution 1: Wait for specific condition
steps:
  - action: wait_for
    selector: "[data-loaded='true']"
    timeout: 30000

# Solution 2: Wait for network idle
steps:
  - action: wait_for_network_idle
    timeout: 10000

# Solution 3: Explicit wait after action
steps:
  - action: click
    selector: "button[data-action='save']"
  - action: wait_for
    text: "Saved successfully"
    timeout: 5000
```

#### 3. Dynamic Content

```yaml
# Problem: Content changes dynamically (timestamps, user-specific data)

# Solution 1: Mask dynamic content in screenshots
steps:
  - action: screenshot
    name: "page-with-dynamic-content"
    options:
      mask_elements:
        - "[data-timestamp]"
        - "[data-user-id]"

# Solution 2: Use partial text matching
assertions:
  - type: text_contains
    selector: "[data-testid='welcome']"
    value: "Welcome,"  # Don't check full name

# Solution 3: Validate pattern instead of exact value
assertions:
  - type: text_pattern
    selector: "[data-testid='order-id']"
    pattern: "^ORD-[0-9]{6}$"
```

#### 4. Authentication State

```yaml
# Problem: Tests interfere with each other's auth state

# Solution 1: Clear storage before each test
before_each:
  - action: evaluate
    function: "() => { localStorage.clear(); sessionStorage.clear(); }"
  - action: navigate
    url: "/auth/login"

# Solution 2: Use isolated browser contexts
config:
  isolated_context: true  # Each test gets fresh browser context

# Solution 3: Explicit logout
after_each:
  - action: perform_logout
  - action: wait_for
    url: "/auth/login"
```

#### 5. Network Request Failures

```yaml
# Problem: API requests fail in tests

# Solution 1: Add retry logic
steps:
  - action: click
    selector: "button[data-action='save']"
    retry:
      max_attempts: 3
      delay: 2000

# Solution 2: Wait for specific network response
steps:
  - action: click
    selector: "button[data-action='load-data']"
  - action: wait_for_network_response
    url: "/api/data"
    status: 200
    timeout: 10000

# Solution 3: Mock unreliable endpoints
before_each:
  - action: mock_api
    url: "/api/external-service"
    response:
      status: 200
      body: { data: "mocked" }
```

### Debugging Techniques

```yaml
# 1. Add breakpoints
steps:
  - action: navigate
    url: "/login"
  - action: breakpoint
    message: "Paused before login attempt"
  - action: type
    element: email_input
    value: "user@example.com"

# 2. Verbose logging
config:
  log_level: "debug"
  log_actions: true
  log_assertions: true

# 3. Screenshot at each step
config:
  screenshot_each_step: true
  screenshot_dir: "test-results/debug-screenshots"

# 4. Save page snapshot
steps:
  - action: save_snapshot
    name: "page-state-after-login"
    include:
      - html
      - network_requests
      - console_logs
      - local_storage
```

## Related Examples

- **Frontend**: `frontend-nextjs/examples/01-authentication-pages.md` - UI components being tested
- **Backend**: `backend-nestjs/examples/01-authentication-module.md` - API endpoints being tested
- **DevOps**: `devops-deployment/examples/02-cicd-pipeline.md` - CI/CD integration
- **Accessibility**: `qa-testing/examples/02-accessibility-testing.md` - Accessibility test patterns
- **Performance**: `qa-testing/examples/03-performance-testing.md` - Performance test patterns

## Key Takeaways

1. **YAML-Based Test Definitions**: Tests are defined in structured YAML format, making them readable and maintainable
2. **Claude Code as Test Runner**: Claude Code interprets YAML and executes tests using Playwright MCP tools
3. **No Programming Required**: QA engineers can write comprehensive E2E tests without coding
4. **AI-Powered Debugging**: Claude Code can intelligently debug test failures
5. **Visual Regression**: Built-in screenshot comparison for visual testing
6. **Network Monitoring**: Track and validate API calls
7. **Console Monitoring**: Detect JavaScript errors and warnings
8. **CI/CD Integration**: Automated test execution in GitHub Actions
9. **Page Object Model**: Organized element selectors for maintainability
10. **Reusable Actions**: Define once, use everywhere

This approach revolutionizes E2E testing by combining the power of Playwright with the intelligence of Claude Code, making testing more accessible and maintainable.
