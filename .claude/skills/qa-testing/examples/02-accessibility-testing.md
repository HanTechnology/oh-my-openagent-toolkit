# Accessibility Testing with WCAG 2.1 AA Compliance

## Overview

This example demonstrates comprehensive accessibility testing to ensure WCAG 2.1 Level AA compliance using Playwright MCP tools and automated accessibility scanning. Accessibility testing ensures that web applications are usable by people with disabilities, including those using screen readers, keyboard navigation, and other assistive technologies.

**Compliance Standards**:
- WCAG 2.1 Level A (minimum)
- WCAG 2.1 Level AA (target)
- Section 508 (US federal)
- EN 301 549 (EU accessibility standard)

**Testing Categories**:
- Perceivable (text alternatives, color contrast, adaptable content)
- Operable (keyboard navigation, timing, seizures)
- Understandable (readable, predictable, input assistance)
- Robust (compatible with assistive technologies)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Accessibility Test Suite                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ Automated    │  │ Manual       │  │ Assistive Tech  │   │
│  │ Scanning     │  │ Testing      │  │ Testing         │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Testing Tools                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ axe-core     │  │ Playwright   │  │ ARIA Validator  │   │
│  │ (automated)  │  │ MCP Tools    │  │                 │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Validation Checks                         │
│  • Semantic HTML                  • Focus Management        │
│  • ARIA attributes                • Color Contrast          │
│  • Keyboard navigation            • Text Alternatives       │
│  • Screen reader compatibility    • Form Labels             │
│  • Heading hierarchy             • Link Purpose            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Compliance Report                         │
│  • WCAG 2.1 AA violations         • Remediation Guidance    │
│  • Best practice warnings         • Priority Ranking        │
└─────────────────────────────────────────────────────────────┘
```

## Automated Accessibility Scanning

### Core Accessibility Test Suite

```yaml
# tests/a11y/automated-scan.test.yaml
test_suite:
  name: "Automated Accessibility Scan"
  description: "Comprehensive accessibility testing for WCAG 2.1 AA compliance"
  version: "1.0.0"

  config:
    base_url: "http://localhost:3000"
    a11y_standard: "WCAG2AA"
    timeout: 30000
    screenshot_violations: true

  # Page inventory for accessibility testing
  pages:
    - url: "/"
      name: "Homepage"
      tags: ["public", "critical"]

    - url: "/auth/login"
      name: "Login Page"
      tags: ["public", "authentication"]

    - url: "/dashboard"
      name: "Dashboard"
      tags: ["authenticated", "critical"]
      auth_required: true

    - url: "/todos"
      name: "Todo List"
      tags: ["authenticated", "crud"]
      auth_required: true

    - url: "/settings"
      name: "Settings Page"
      tags: ["authenticated"]
      auth_required: true

    - url: "/profile"
      name: "User Profile"
      tags: ["authenticated"]
      auth_required: true

  test_cases:
    # Automated scan of all pages
    - id: "A11Y-AUTO-001"
      name: "Scan all pages for accessibility violations"
      description: "Run axe-core accessibility scanner on all pages"
      tags: ["automated", "wcag2aa", "comprehensive"]

      steps:
        - action: for_each_page
          pages: "{{pages}}"
          steps:
            - action: navigate
              url: "{{page.url}}"
              description: "Navigate to {{page.name}}"

            - action: wait_for
              selector: "body[data-loaded='true']"
              timeout: 10000

            - action: run_axe_scan
              options:
                runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
                resultTypes: ["violations", "incomplete"]
                rules:
                  # Enable all rules
                  color-contrast: { enabled: true }
                  html-has-lang: { enabled: true }
                  valid-lang: { enabled: true }
                  document-title: { enabled: true }
                  duplicate-id: { enabled: true }
                  heading-order: { enabled: true }
                  landmark-one-main: { enabled: true }
                  region: { enabled: true }
                  skip-link: { enabled: true }
              store_as: "a11y_results_{{page.name}}"

            - action: screenshot_if_violations
              condition: "{{a11y_results_{{page.name}}.violations.length > 0}}"
              name: "a11y-violations-{{page.name}}"

      assertions:
        - type: a11y_no_violations
          standard: "wcag2aa"
          message: "No WCAG 2.1 AA violations should exist"
          allow_incomplete: false  # Fail on incomplete checks too

        - type: a11y_violation_count
          max_count: 0
          severity: "critical"
          message: "No critical accessibility violations"

        - type: a11y_violation_count
          max_count: 0
          severity: "serious"
          message: "No serious accessibility violations"
```

### Focused Accessibility Tests

```yaml
# tests/a11y/keyboard-navigation.test.yaml
test_suite:
  name: "Keyboard Navigation Tests"
  description: "Verify complete keyboard accessibility"
  version: "1.0.0"

  config:
    base_url: "http://localhost:3000"

  test_cases:
    # Tab navigation order
    - id: "A11Y-KB-001"
      name: "Logical tab order on login page"
      description: "Tab key should navigate through interactive elements in logical order"
      tags: ["keyboard", "operable"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: evaluate
          function: "() => document.activeElement.tagName"
          store_as: "initial_focus"

        - action: press_key
          key: "Tab"

        - action: evaluate
          function: "() => ({ tag: document.activeElement.tagName, name: document.activeElement.name, text: document.activeElement.textContent })"
          store_as: "focus_1"

        - action: press_key
          key: "Tab"

        - action: evaluate
          function: "() => ({ tag: document.activeElement.tagName, name: document.activeElement.name })"
          store_as: "focus_2"

        - action: press_key
          key: "Tab"

        - action: evaluate
          function: "() => ({ tag: document.activeElement.tagName, name: document.activeElement.name })"
          store_as: "focus_3"

      assertions:
        - type: variable_equals
          variable: "focus_1.name"
          value: "email"
          message: "First tab should focus email input"

        - type: variable_equals
          variable: "focus_2.name"
          value: "password"
          message: "Second tab should focus password input"

        - type: variable_equals
          variable: "focus_3.tag"
          value: "BUTTON"
          message: "Third tab should focus submit button"

    # Skip links
    - id: "A11Y-KB-002"
      name: "Skip to main content link"
      description: "Skip link should be available and functional"
      tags: ["keyboard", "operable", "wcag2a"]

      steps:
        - action: navigate
          url: "/"

        - action: press_key
          key: "Tab"

        - action: evaluate
          function: "() => document.activeElement.textContent.trim()"
          store_as: "first_focusable_text"

        - action: screenshot
          name: "skip-link-visible"
          description: "Skip link should be visible when focused"

        - action: press_key
          key: "Enter"

        - action: evaluate
          function: "() => document.activeElement.closest('main') !== null"
          store_as: "focus_in_main"

      assertions:
        - type: text_contains
          variable: "first_focusable_text"
          value: "Skip to"
          message: "First focusable element should be skip link"

        - type: variable_equals
          variable: "focus_in_main"
          value: true
          message: "After activating skip link, focus should be in main content"

    # Focus trap in modal
    - id: "A11Y-KB-003"
      name: "Focus trap in modal dialog"
      description: "Focus should be trapped within modal when open"
      tags: ["keyboard", "operable", "modal"]

      before_each:
        - action: navigate
          url: "/todos"
        - action: perform_login
          email: "user@example.com"
          password: "SecurePass123!"

      steps:
        - action: click
          selector: "button[data-action='create-todo']"

        - action: wait_for
          selector: "[role='dialog']"
          visible: true

        - action: evaluate
          function: "() => document.activeElement.closest('[role=\"dialog\"]') !== null"
          store_as: "initial_focus_in_modal"

        # Tab through all focusable elements in modal
        - action: press_key
          key: "Tab"
        - action: press_key
          key: "Tab"
        - action: press_key
          key: "Tab"
        - action: press_key
          key: "Tab"

        - action: evaluate
          function: "() => document.activeElement.closest('[role=\"dialog\"]') !== null"
          store_as: "focus_still_in_modal"

      assertions:
        - type: variable_equals
          variable: "initial_focus_in_modal"
          value: true
          message: "Initial focus should be inside modal"

        - type: variable_equals
          variable: "focus_still_in_modal"
          value: true
          message: "Focus should remain trapped inside modal"

    # Escape key to close modal
    - id: "A11Y-KB-004"
      name: "Escape key closes modal"
      description: "Pressing Escape should close modal and restore focus"
      tags: ["keyboard", "operable"]

      steps:
        - action: navigate
          url: "/todos"

        - action: click
          selector: "button[data-action='create-todo']"

        - action: wait_for
          selector: "[role='dialog']"
          visible: true

        - action: evaluate
          function: "() => document.querySelector('button[data-action=\"create-todo\"]').id = 'trigger-button'; 'trigger-button'"

        - action: press_key
          key: "Escape"

        - action: wait_for
          selector: "[role='dialog']"
          visible: false

        - action: evaluate
          function: "() => document.activeElement.id"
          store_as: "focus_after_close"

      assertions:
        - type: element_not_visible
          selector: "[role='dialog']"
          message: "Modal should close when Escape is pressed"

        - type: variable_equals
          variable: "focus_after_close"
          value: "trigger-button"
          message: "Focus should return to element that opened modal"

    # Arrow key navigation in lists
    - id: "A11Y-KB-005"
      name: "Arrow key navigation in listbox"
      description: "Arrow keys should navigate through list items"
      tags: ["keyboard", "operable", "aria"]

      steps:
        - action: navigate
          url: "/settings"

        - action: click
          selector: "[role='listbox']"

        - action: press_key
          key: "ArrowDown"

        - action: evaluate
          function: "() => document.activeElement.getAttribute('aria-selected')"
          store_as: "first_selected"

        - action: press_key
          key: "ArrowDown"

        - action: evaluate
          function: "() => Array.from(document.querySelectorAll('[role=\"option\"]')).indexOf(document.activeElement)"
          store_as: "second_index"

      assertions:
        - type: variable_equals
          variable: "first_selected"
          value: "true"
          message: "First item should be selected after ArrowDown"

        - type: variable_equals
          variable: "second_index"
          value: 1
          message: "Second ArrowDown should move to second item"
```

## Color Contrast Testing

```yaml
# tests/a11y/color-contrast.test.yaml
test_suite:
  name: "Color Contrast Tests"
  description: "Verify WCAG 2.1 AA color contrast requirements (4.5:1 for normal text, 3:1 for large text)"
  version: "1.0.0"

  test_cases:
    - id: "A11Y-COLOR-001"
      name: "Text color contrast meets WCAG AA"
      description: "All text should have sufficient contrast ratio"
      tags: ["perceivable", "color-contrast", "wcag2aa"]

      steps:
        - action: navigate
          url: "/"

        - action: run_color_contrast_check
          options:
            standard: "wcag2aa"
            include_large_text: true
          store_as: "contrast_results"

        - action: screenshot_violations
          violations: "{{contrast_results.violations}}"
          name: "color-contrast-violations"

      assertions:
        - type: color_contrast_passes
          min_ratio: 4.5
          text_size: "normal"
          message: "Normal text should have minimum 4.5:1 contrast ratio"

        - type: color_contrast_passes
          min_ratio: 3.0
          text_size: "large"
          message: "Large text should have minimum 3:1 contrast ratio"

        - type: a11y_no_violations
          rule: "color-contrast"
          message: "No color contrast violations"

    - id: "A11Y-COLOR-002"
      name: "Interactive elements have sufficient contrast"
      description: "Buttons, links, and form controls should have adequate contrast"
      tags: ["perceivable", "color-contrast"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: evaluate_all_elements
          selector: "button, a, input, select, textarea"
          function: |
            (element) => {
              const style = window.getComputedStyle(element);
              const bgColor = style.backgroundColor;
              const textColor = style.color;
              const borderColor = style.borderColor;

              // Calculate contrast ratio
              const ratio = calculateContrastRatio(textColor, bgColor);

              return {
                element: element.tagName.toLowerCase(),
                text: element.textContent.trim().substring(0, 30),
                textColor,
                bgColor,
                borderColor,
                contrastRatio: ratio.toFixed(2)
              };
            }
          store_as: "element_contrasts"

      assertions:
        - type: all_elements_meet_contrast
          elements: "{{element_contrasts}}"
          min_ratio: 4.5
          message: "All interactive elements should meet contrast requirements"

    - id: "A11Y-COLOR-003"
      name: "Focus indicators have sufficient contrast"
      description: "Focus outlines should be visible (3:1 contrast with background)"
      tags: ["perceivable", "color-contrast", "keyboard"]

      steps:
        - action: navigate
          url: "/"

        - action: press_key
          key: "Tab"

        - action: evaluate
          function: |
            () => {
              const element = document.activeElement;
              const style = window.getComputedStyle(element);
              const outlineColor = style.outlineColor;
              const bgColor = style.backgroundColor;

              return {
                element: element.tagName,
                outlineColor,
                outlineWidth: style.outlineWidth,
                outlineStyle: style.outlineStyle,
                bgColor
              };
            }
          store_as: "focus_style"

        - action: screenshot
          name: "focus-indicator"

      assertions:
        - type: focus_visible
          message: "Focus indicator should be visible"

        - type: focus_contrast_ratio
          min_ratio: 3.0
          message: "Focus indicator should have 3:1 contrast with background"

        - type: variable_not_equals
          variable: "focus_style.outlineStyle"
          value: "none"
          message: "Focus outline should not be disabled"
```

## Screen Reader Compatibility

```yaml
# tests/a11y/screen-reader.test.yaml
test_suite:
  name: "Screen Reader Compatibility Tests"
  description: "Verify proper semantic HTML and ARIA attributes for screen readers"
  version: "1.0.0"

  test_cases:
    # Semantic HTML structure
    - id: "A11Y-SR-001"
      name: "Proper heading hierarchy"
      description: "Page should have logical heading structure (h1 -> h2 -> h3)"
      tags: ["perceivable", "semantic", "wcag2a"]

      steps:
        - action: navigate
          url: "/dashboard"

        - action: evaluate
          function: |
            () => {
              const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
              return headings.map(h => ({
                level: parseInt(h.tagName[1]),
                text: h.textContent.trim()
              }));
            }
          store_as: "headings"

        - action: validate_heading_hierarchy
          headings: "{{headings}}"
          store_as: "hierarchy_valid"

      assertions:
        - type: heading_hierarchy_valid
          message: "Heading levels should not skip (no h1 -> h3)"

        - type: element_count
          selector: "h1"
          count: 1
          message: "Page should have exactly one h1"

        - type: element_exists
          selector: "h1"
          message: "Page must have an h1 heading"

    # Landmark regions
    - id: "A11Y-SR-002"
      name: "Proper landmark regions"
      description: "Page should have semantic landmark regions"
      tags: ["perceivable", "semantic", "wcag2a"]

      steps:
        - action: navigate
          url: "/"

        - action: evaluate
          function: |
            () => {
              return {
                hasHeader: document.querySelector('header, [role="banner"]') !== null,
                hasMain: document.querySelector('main, [role="main"]') !== null,
                hasNav: document.querySelector('nav, [role="navigation"]') !== null,
                hasFooter: document.querySelector('footer, [role="contentinfo"]') !== null,
                mainCount: document.querySelectorAll('main, [role="main"]').length
              };
            }
          store_as: "landmarks"

      assertions:
        - type: variable_equals
          variable: "landmarks.hasHeader"
          value: true
          message: "Page should have a header/banner landmark"

        - type: variable_equals
          variable: "landmarks.hasMain"
          value: true
          message: "Page should have a main content landmark"

        - type: variable_equals
          variable: "landmarks.hasNav"
          value: true
          message: "Page should have a navigation landmark"

        - type: variable_equals
          variable: "landmarks.mainCount"
          value: 1
          message: "Page should have exactly one main landmark"

    # Form labels and descriptions
    - id: "A11Y-SR-003"
      name: "Form inputs have proper labels"
      description: "All form inputs should have associated labels or aria-label"
      tags: ["perceivable", "forms", "wcag2a"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: evaluate
          function: |
            () => {
              const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
              return inputs.map(input => {
                const id = input.id;
                const label = id ? document.querySelector(`label[for="${id}"]`) : input.closest('label');
                const ariaLabel = input.getAttribute('aria-label');
                const ariaLabelledby = input.getAttribute('aria-labelledby');
                const placeholder = input.getAttribute('placeholder');

                return {
                  type: input.type || input.tagName.toLowerCase(),
                  name: input.name,
                  hasLabel: !!label,
                  hasAriaLabel: !!ariaLabel,
                  hasAriaLabelledby: !!ariaLabelledby,
                  onlyPlaceholder: !label && !ariaLabel && !ariaLabelledby && !!placeholder,
                  labelText: label?.textContent.trim() || ariaLabel || ''
                };
              });
            }
          store_as: "form_inputs"

      assertions:
        - type: all_inputs_labeled
          inputs: "{{form_inputs}}"
          message: "All form inputs should have proper labels"

        - type: no_inputs_with_only_placeholder
          inputs: "{{form_inputs}}"
          message: "Inputs should not rely solely on placeholder text for labeling"

    # ARIA attributes validation
    - id: "A11Y-SR-004"
      name: "Valid ARIA attributes"
      description: "All ARIA attributes should be valid and properly used"
      tags: ["robust", "aria"]

      steps:
        - action: navigate
          url: "/dashboard"

        - action: run_aria_validation
          store_as: "aria_results"

      assertions:
        - type: aria_valid_attribute_names
          message: "All aria-* attributes should be valid ARIA attributes"

        - type: aria_valid_attribute_values
          message: "All aria-* attributes should have valid values"

        - type: aria_required_attributes_present
          message: "Required ARIA attributes should be present for ARIA roles"

        - type: a11y_no_violations
          rule: "aria-*"
          message: "No ARIA-related violations"

    # Button and link accessible names
    - id: "A11Y-SR-005"
      name: "Buttons and links have accessible names"
      description: "All interactive elements should have descriptive accessible names"
      tags: ["operable", "wcag2a"]

      steps:
        - action: navigate
          url: "/todos"

        - action: evaluate
          function: |
            () => {
              const elements = Array.from(document.querySelectorAll('button, a[href]'));
              return elements.map(el => {
                const computedName = el.getAttribute('aria-label') ||
                                    el.textContent.trim() ||
                                    el.getAttribute('title') ||
                                    el.querySelector('img')?.getAttribute('alt') || '';

                return {
                  element: el.tagName.toLowerCase(),
                  accessibleName: computedName,
                  hasAccessibleName: computedName.length > 0,
                  isIconOnly: el.children.length > 0 && !el.textContent.trim()
                };
              });
            }
          store_as: "interactive_elements"

      assertions:
        - type: all_elements_have_accessible_name
          elements: "{{interactive_elements}}"
          message: "All buttons and links should have accessible names"

        - type: icon_buttons_have_aria_label
          elements: "{{interactive_elements}}"
          message: "Icon-only buttons should have aria-label"

    # Live regions
    - id: "A11Y-SR-006"
      name: "Proper use of live regions"
      description: "Dynamic content updates should use ARIA live regions"
      tags: ["robust", "aria", "dynamic"]

      steps:
        - action: navigate
          url: "/todos"

        - action: click
          selector: "button[data-action='add-todo']"

        - action: type
          selector: "input[data-testid='new-todo']"
          value: "Test todo item"

        - action: click
          selector: "button[data-action='submit-todo']"

        - action: evaluate
          function: |
            () => {
              const alert = document.querySelector('[role="status"], [role="alert"], [aria-live]');
              return {
                hasLiveRegion: !!alert,
                liveValue: alert?.getAttribute('aria-live'),
                message: alert?.textContent.trim()
              };
            }
          store_as: "live_region"

      assertions:
        - type: variable_equals
          variable: "live_region.hasLiveRegion"
          value: true
          message: "Success message should be in a live region"

        - type: variable_in_list
          variable: "live_region.liveValue"
          list: ["polite", "assertive"]
          message: "Live region should have appropriate aria-live value"
```

## Form Accessibility

```yaml
# tests/a11y/forms.test.yaml
test_suite:
  name: "Form Accessibility Tests"
  description: "Ensure forms are accessible and provide proper error handling"
  version: "1.0.0"

  test_cases:
    # Required field indicators
    - id: "A11Y-FORM-001"
      name: "Required fields are properly indicated"
      description: "Required fields should have both visual and semantic indicators"
      tags: ["understandable", "forms"]

      steps:
        - action: navigate
          url: "/auth/signup"

        - action: evaluate
          function: |
            () => {
              const requiredInputs = Array.from(document.querySelectorAll('input[required], input[aria-required="true"]'));
              return requiredInputs.map(input => {
                const label = input.id ? document.querySelector(`label[for="${input.id}"]`) : null;
                const hasVisualIndicator = label?.querySelector('[aria-hidden="true"]')?.textContent === '*' ||
                                           label?.textContent.includes('*') ||
                                           label?.textContent.toLowerCase().includes('required');

                return {
                  name: input.name,
                  hasRequired: input.hasAttribute('required'),
                  hasAriaRequired: input.getAttribute('aria-required') === 'true',
                  hasVisualIndicator,
                  labelText: label?.textContent.trim()
                };
              });
            }
          store_as: "required_fields"

      assertions:
        - type: all_required_fields_indicated
          fields: "{{required_fields}}"
          message: "Required fields should have both required attribute and visual indicator"

    # Error message association
    - id: "A11Y-FORM-002"
      name: "Error messages are associated with inputs"
      description: "Error messages should be programmatically associated using aria-describedby"
      tags: ["understandable", "forms", "error-handling"]

      steps:
        - action: navigate
          url: "/auth/login"

        - action: click
          selector: "button[type='submit']"

        - action: wait_for
          selector: "[data-error]"

        - action: evaluate
          function: |
            () => {
              const inputs = Array.from(document.querySelectorAll('input[aria-invalid="true"]'));
              return inputs.map(input => {
                const describedBy = input.getAttribute('aria-describedby');
                const errorElement = describedBy ? document.getElementById(describedBy) : null;

                return {
                  name: input.name,
                  ariaInvalid: input.getAttribute('aria-invalid'),
                  hasAriaDescribedby: !!describedBy,
                  errorMessage: errorElement?.textContent.trim(),
                  errorVisible: errorElement ? window.getComputedStyle(errorElement).display !== 'none' : false
                };
              });
            }
          store_as: "error_fields"

      assertions:
        - type: all_invalid_fields_have_aria
          fields: "{{error_fields}}"
          message: "Invalid fields should have aria-invalid and aria-describedby"

        - type: all_error_messages_visible
          fields: "{{error_fields}}"
          message: "Error messages should be visible"

    # Fieldset and legend
    - id: "A11Y-FORM-003"
      name: "Related form controls are grouped"
      description: "Related form controls should be grouped with fieldset/legend"
      tags: ["understandable", "forms"]

      steps:
        - action: navigate
          url: "/settings/notifications"

        - action: evaluate
          function: |
            () => {
              const fieldsets = Array.from(document.querySelectorAll('fieldset'));
              return fieldsets.map(fieldset => {
                const legend = fieldset.querySelector('legend');
                const inputs = fieldset.querySelectorAll('input, select, textarea');

                return {
                  hasLegend: !!legend,
                  legendText: legend?.textContent.trim(),
                  inputCount: inputs.length
                };
              });
            }
          store_as: "fieldsets"

      assertions:
        - type: all_fieldsets_have_legend
          fieldsets: "{{fieldsets}}"
          message: "All fieldsets should have a legend"

    # Input autocomplete
    - id: "A11Y-FORM-004"
      name: "Autocomplete attributes for personal information"
      description: "Personal information inputs should have autocomplete attributes"
      tags: ["understandable", "forms", "wcag21aa"]

      steps:
        - action: navigate
          url: "/auth/signup"

        - action: evaluate
          function: |
            () => {
              const personalInfoInputs = {
                email: document.querySelector('input[type="email"]'),
                name: document.querySelector('input[name="name"]'),
                password: document.querySelector('input[type="password"]')
              };

              return Object.entries(personalInfoInputs).map(([type, input]) => ({
                type,
                hasAutocomplete: input?.hasAttribute('autocomplete'),
                autocompleteValue: input?.getAttribute('autocomplete')
              })).filter(item => item.hasAutocomplete !== undefined);
            }
          store_as: "autocomplete_fields"

      assertions:
        - type: all_personal_info_has_autocomplete
          fields: "{{autocomplete_fields}}"
          expected:
            email: "email"
            name: "name"
            password: "new-password"
          message: "Personal information inputs should have appropriate autocomplete values"
```

## Dynamic Content Accessibility

```yaml
# tests/a11y/dynamic-content.test.yaml
test_suite:
  name: "Dynamic Content Accessibility"
  description: "Test accessibility of dynamically loaded and updated content"
  version: "1.0.0"

  test_cases:
    # Loading states
    - id: "A11Y-DYN-001"
      name: "Loading states are announced"
      description: "Loading indicators should be announced to screen readers"
      tags: ["robust", "dynamic", "aria"]

      steps:
        - action: navigate
          url: "/dashboard"

        - action: click
          selector: "button[data-action='refresh-data']"

        - action: evaluate
          function: |
            () => {
              const loader = document.querySelector('[aria-busy="true"], [role="progressbar"], [role="status"]');
              return {
                hasLoadingIndicator: !!loader,
                ariaBusy: loader?.getAttribute('aria-busy'),
                role: loader?.getAttribute('role'),
                ariaLabel: loader?.getAttribute('aria-label') || loader?.textContent.trim()
              };
            }
          store_as: "loading_state"

        - action: wait_for
          selector: "[aria-busy='false']"
          timeout: 10000

      assertions:
        - type: variable_equals
          variable: "loading_state.hasLoadingIndicator"
          value: true
          message: "Loading state should have proper ARIA indicator"

        - type: variable_in_list
          variable: "loading_state.ariaBusy"
          list: ["true"]
          message: "Loading indicator should have aria-busy='true'"

    # Infinite scroll
    - id: "A11Y-DYN-002"
      name: "Infinite scroll accessibility"
      description: "Infinite scroll should not trap keyboard users"
      tags: ["operable", "keyboard", "dynamic"]

      steps:
        - action: navigate
          url: "/feed"

        - action: scroll_to_bottom

        - action: wait_for
          selector: "[data-loading='true']"

        - action: press_key
          key: "Tab"

        - action: evaluate
          function: "() => document.activeElement.offsetParent !== null"
          store_as: "can_tab_past_feed"

      assertions:
        - type: variable_equals
          variable: "can_tab_past_feed"
          value: true
          message: "Should be able to tab past infinite scroll content"

    # Modal dialogs
    - id: "A11Y-DYN-003"
      name: "Modal dialog accessibility"
      description: "Modal dialogs should follow ARIA authoring practices"
      tags: ["operable", "robust", "modal", "aria"]

      steps:
        - action: navigate
          url: "/todos"

        - action: click
          selector: "button[data-action='create-todo']"

        - action: wait_for
          selector: "[role='dialog']"
          visible: true

        - action: evaluate
          function: |
            () => {
              const dialog = document.querySelector('[role="dialog"]');
              const overlay = document.querySelector('[data-overlay]');

              return {
                hasDialogRole: !!dialog,
                hasAriaModal: dialog?.getAttribute('aria-modal') === 'true',
                hasAriaLabelledby: dialog?.hasAttribute('aria-labelledby'),
                hasAriaLabel: dialog?.hasAttribute('aria-label'),
                title: dialog?.querySelector('h2, h3')?.textContent.trim(),
                overlayAria: overlay?.getAttribute('aria-hidden'),
                backgroundInert: document.querySelector('main')?.hasAttribute('inert')
              };
            }
          store_as: "dialog_props"

      assertions:
        - type: variable_equals
          variable: "dialog_props.hasDialogRole"
          value: true
          message: "Modal should have role='dialog'"

        - type: variable_equals
          variable: "dialog_props.hasAriaModal"
          value: true
          message: "Modal should have aria-modal='true'"

        - type: either_is_true
          variables: ["dialog_props.hasAriaLabelledby", "dialog_props.hasAriaLabel"]
          message: "Modal should have aria-labelledby or aria-label"

    # Toast notifications
    - id: "A11Y-DYN-004"
      name: "Toast notifications are announced"
      description: "Toast/snackbar notifications should use live regions"
      tags: ["robust", "aria", "notifications"]

      steps:
        - action: navigate
          url: "/todos"

        - action: click
          selector: "button[data-action='delete-all']"

        - action: wait_for
          selector: "[role='status'], [role='alert']"
          visible: true

        - action: evaluate
          function: |
            () => {
              const toast = document.querySelector('[role="status"], [role="alert"]');
              return {
                role: toast?.getAttribute('role'),
                ariaLive: toast?.getAttribute('aria-live'),
                ariaAtomic: toast?.getAttribute('aria-atomic'),
                message: toast?.textContent.trim()
              };
            }
          store_as: "toast"

      assertions:
        - type: variable_in_list
          variable: "toast.role"
          list: ["status", "alert"]
          message: "Toast should have role='status' or role='alert'"

        - type: variable_in_list
          variable: "toast.ariaLive"
          list: ["polite", "assertive"]
          message: "Toast should have aria-live attribute"
```

## Accessibility Report Generation

```typescript
// scripts/generate-a11y-report.ts
import fs from 'fs';
import path from 'path';

interface A11yViolation {
  id: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    html: string;
    target: string[];
    failureSummary: string;
  }>;
}

interface A11yResult {
  page: string;
  url: string;
  violations: A11yViolation[];
  passes: number;
  timestamp: string;
}

class AccessibilityReportGenerator {
  private results: A11yResult[] = [];

  addResult(result: A11yResult) {
    this.results.push(result);
  }

  generateHTML(): string {
    const totalViolations = this.results.reduce((sum, r) => sum + r.violations.length, 0);
    const criticalCount = this.countByImpact('critical');
    const seriousCount = this.countByImpact('serious');
    const moderateCount = this.countByImpact('moderate');
    const minorCount = this.countByImpact('minor');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Test Report - WCAG 2.1 AA</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }

    header {
      background: #1e293b;
      color: white;
      padding: 40px 20px;
      margin-bottom: 30px;
    }
    header h1 { font-size: 2.5rem; margin-bottom: 10px; }
    header p { font-size: 1.1rem; opacity: 0.9; }

    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .summary-card h3 { font-size: 0.875rem; color: #64748b; margin-bottom: 8px; }
    .summary-card .number { font-size: 2.5rem; font-weight: bold; }
    .summary-card.critical .number { color: #dc2626; }
    .summary-card.serious .number { color: #ea580c; }
    .summary-card.moderate .number { color: #f59e0b; }
    .summary-card.minor .number { color: #3b82f6; }

    .page-results {
      background: white;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .page-header { margin-bottom: 20px; }
    .page-header h2 { font-size: 1.5rem; margin-bottom: 8px; }
    .page-header .url { color: #64748b; font-size: 0.875rem; }

    .violation {
      border-left: 4px solid;
      padding: 20px;
      margin-bottom: 20px;
      background: #fafafa;
      border-radius: 4px;
    }
    .violation.critical { border-left-color: #dc2626; }
    .violation.serious { border-left-color: #ea580c; }
    .violation.moderate { border-left-color: #f59e0b; }
    .violation.minor { border-left-color: #3b82f6; }

    .violation-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }
    .violation-header h3 { font-size: 1.125rem; }
    .impact-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .impact-badge.critical { background: #fee2e2; color: #dc2626; }
    .impact-badge.serious { background: #ffedd5; color: #ea580c; }
    .impact-badge.moderate { background: #fef3c7; color: #f59e0b; }
    .impact-badge.minor { background: #dbeafe; color: #3b82f6; }

    .violation-description { margin-bottom: 16px; color: #475569; }
    .wcag-link {
      display: inline-block;
      margin-bottom: 16px;
      color: #3b82f6;
      text-decoration: none;
    }
    .wcag-link:hover { text-decoration: underline; }

    .affected-elements {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 16px;
    }
    .affected-elements h4 {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 12px;
    }
    .element-item {
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f1f5f9;
    }
    .element-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .element-html {
      background: #1e293b;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      overflow-x: auto;
      margin-bottom: 8px;
    }
    .element-target {
      font-size: 0.875rem;
      color: #64748b;
      margin-bottom: 4px;
    }
    .failure-summary {
      font-size: 0.875rem;
      color: #dc2626;
    }

    .no-violations {
      text-align: center;
      padding: 60px 20px;
      color: #22c55e;
    }
    .no-violations svg {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    .no-violations h3 { font-size: 1.5rem; margin-bottom: 8px; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>Accessibility Test Report</h1>
      <p>WCAG 2.1 Level AA Compliance Testing</p>
      <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
  </header>

  <div class="container">
    <div class="summary">
      <div class="summary-card">
        <h3>Total Violations</h3>
        <div class="number">${totalViolations}</div>
      </div>
      <div class="summary-card critical">
        <h3>Critical</h3>
        <div class="number">${criticalCount}</div>
      </div>
      <div class="summary-card serious">
        <h3>Serious</h3>
        <div class="number">${seriousCount}</div>
      </div>
      <div class="summary-card moderate">
        <h3>Moderate</h3>
        <div class="number">${moderateCount}</div>
      </div>
      <div class="summary-card minor">
        <h3>Minor</h3>
        <div class="number">${minorCount}</div>
      </div>
    </div>

    ${this.results.map(result => this.renderPageResult(result)).join('')}
  </div>
</body>
</html>
    `;
  }

  private renderPageResult(result: A11yResult): string {
    if (result.violations.length === 0) {
      return `
        <div class="page-results">
          <div class="page-header">
            <h2>${result.page}</h2>
            <div class="url">${result.url}</div>
          </div>
          <div class="no-violations">
            <h3>No Accessibility Violations Found</h3>
            <p>This page passed all WCAG 2.1 AA checks!</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="page-results">
        <div class="page-header">
          <h2>${result.page}</h2>
          <div class="url">${result.url}</div>
        </div>
        ${result.violations.map(v => this.renderViolation(v)).join('')}
      </div>
    `;
  }

  private renderViolation(violation: A11yViolation): string {
    return `
      <div class="violation ${violation.impact}">
        <div class="violation-header">
          <h3>${violation.help}</h3>
          <span class="impact-badge ${violation.impact}">${violation.impact}</span>
        </div>
        <p class="violation-description">${violation.description}</p>
        <a href="${violation.helpUrl}" class="wcag-link" target="_blank" rel="noopener">
          Learn more about ${violation.id}
        </a>
        <div class="affected-elements">
          <h4>Affected Elements (${violation.nodes.length})</h4>
          ${violation.nodes.map(node => `
            <div class="element-item">
              <div class="element-html">${this.escapeHtml(node.html)}</div>
              <div class="element-target">Selector: ${node.target.join(' ')}</div>
              <div class="failure-summary">${node.failureSummary}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  private countByImpact(impact: string): number {
    return this.results.reduce((sum, result) =>
      sum + result.violations.filter(v => v.impact === impact).length, 0
    );
  }

  private escapeHtml(html: string): string {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  saveReport(outputPath: string) {
    const html = this.generateHTML();
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Accessibility report saved to: ${outputPath}`);
  }
}

export { AccessibilityReportGenerator, A11yViolation, A11yResult };
```

## CI/CD Integration

```yaml
# .github/workflows/accessibility-tests.yml
name: Accessibility Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Build application
        run: pnpm build

      - name: Start application
        run: |
          docker-compose up -d
          ./scripts/wait-for-services.sh

      - name: Run accessibility tests
        run: |
          claude-code execute \
            --test-suite tests/a11y/automated-scan.test.yaml \
            --output test-results/a11y-results.json
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Generate accessibility report
        if: always()
        run: |
          node scripts/generate-a11y-report.js \
            --input test-results/a11y-results.json \
            --output test-results/a11y-report.html

      - name: Upload accessibility report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-report
          path: test-results/a11y-report.html

      - name: Check for critical violations
        run: |
          CRITICAL_COUNT=$(jq '[.results[].violations[] | select(.impact=="critical")] | length' test-results/a11y-results.json)
          if [ "$CRITICAL_COUNT" -gt 0 ]; then
            echo "Found $CRITICAL_COUNT critical accessibility violations"
            exit 1
          fi

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('test-results/a11y-results.json'));

            const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
            const critical = results.flatMap(r => r.violations.filter(v => v.impact === 'critical')).length;
            const serious = results.flatMap(r => r.violations.filter(v => v.impact === 'serious')).length;

            const comment = \`## Accessibility Test Results

            - Total Violations: **\${totalViolations}**
            - Critical: **\${critical}**
            - Serious: **\${serious}**

            \${critical > 0 ? '❌ Critical accessibility issues found!' : '✅ No critical issues'}

            [View full report](https://github.com/\${context.repo.owner}/\${context.repo.repo}/actions/runs/\${context.runId})
            \`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

## Related Examples

- **E2E Testing**: `qa-testing/examples/01-e2e-test-suite.md` - Foundational testing patterns
- **Performance Testing**: `qa-testing/examples/03-performance-testing.md` - Performance metrics including accessibility performance
- **Frontend**: `frontend-nextjs/examples/01-authentication-pages.md` - Accessible UI component examples
- **DevOps**: `devops-deployment/examples/02-cicd-pipeline.md` - CI/CD automation

## Key Takeaways

1. **WCAG 2.1 AA Compliance**: Target Level AA as the standard for accessibility
2. **Automated + Manual Testing**: Combine automated scans with manual keyboard/screen reader testing
3. **Early Detection**: Test accessibility during development, not after
4. **Semantic HTML**: Proper HTML5 elements reduce need for ARIA
5. **Keyboard Navigation**: Ensure all functionality is keyboard accessible
6. **Color Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
7. **Screen Reader Support**: Test with actual screen readers (NVDA, JAWS, VoiceOver)
8. **Focus Management**: Visible focus indicators and logical focus order
9. **Form Accessibility**: Proper labels, error messages, and field validation
10. **Dynamic Content**: Use ARIA live regions for dynamic updates

Accessibility is not optional—it's a legal requirement and ethical responsibility.
