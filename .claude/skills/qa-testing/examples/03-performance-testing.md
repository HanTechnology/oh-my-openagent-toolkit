# Performance Testing with Lighthouse and Core Web Vitals

## Overview

This example demonstrates comprehensive performance testing using Lighthouse, Core Web Vitals metrics, and load testing tools. Performance testing ensures fast page loads, smooth interactions, and optimal resource utilization for excellent user experience.

**Performance Metrics**:
- Core Web Vitals (LCP, FID, CLS)
- Lighthouse Performance Score (target: 90+)
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Total Blocking Time (TBT)
- Speed Index

**Testing Categories**:
- Page Load Performance
- Runtime Performance
- Network Efficiency
- Resource Optimization
- Rendering Performance
- Load Testing and Stress Testing

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Performance Test Framework                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │  Lighthouse  │  │  Core Web    │  │  Load Testing   │   │
│  │     API      │  │   Vitals     │  │   (k6/Locust)   │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Metrics Collection                        │
│  • LCP (Largest Contentful Paint)    < 2.5s (good)         │
│  • FID (First Input Delay)            < 100ms (good)        │
│  • CLS (Cumulative Layout Shift)      < 0.1 (good)          │
│  • FCP (First Contentful Paint)       < 1.8s (good)         │
│  • TTI (Time to Interactive)          < 3.8s (good)         │
│  • TBT (Total Blocking Time)          < 200ms (good)        │
│  • Speed Index                        < 3.4s (good)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Performance Analysis                        │
│  • Opportunities (resource optimization)                    │
│  • Diagnostics (performance issues)                         │
│  • Bottleneck Identification                                │
│  • Recommendations                                           │
└─────────────────────────────────────────────────────────────┘
```

## Core Web Vitals Testing

### Automated Performance Tests

```yaml
# tests/performance/core-web-vitals.test.yaml
test_suite:
  name: "Core Web Vitals Tests"
  description: "Measure and validate Core Web Vitals metrics"
  version: "1.0.0"

  config:
    base_url: "http://localhost:3000"
    performance_budget:
      lighthouse_score: 90
      lcp: 2500  # ms
      fid: 100   # ms
      cls: 0.1   # score
      fcp: 1800  # ms
      tti: 3800  # ms
      tbt: 200   # ms
      speed_index: 3400  # ms

  test_cases:
    # Largest Contentful Paint (LCP)
    - id: "PERF-LCP-001"
      name: "LCP under 2.5 seconds"
      description: "Largest Contentful Paint should occur within 2.5 seconds"
      tags: ["core-web-vitals", "lcp", "critical"]

      steps:
        - action: navigate
          url: "/"
          wait_until: "networkidle"

        - action: measure_web_vitals
          store_as: "vitals"

        - action: screenshot
          name: "lcp-element"
          highlight_selector: "{{vitals.lcp.element}}"

      assertions:
        - type: metric_less_than
          metric: "{{vitals.lcp.value}}"
          threshold: 2500
          message: "LCP should be less than 2.5 seconds (Good)"

        - type: metric_less_than_warning
          metric: "{{vitals.lcp.value}}"
          threshold: 4000
          message: "LCP should be less than 4 seconds (Needs Improvement threshold)"

    # First Input Delay (FID)
    - id: "PERF-FID-001"
      name: "FID under 100 milliseconds"
      description: "First Input Delay should be under 100ms for good interactivity"
      tags: ["core-web-vitals", "fid", "critical"]

      steps:
        - action: navigate
          url: "/todos"

        - action: wait_for
          selector: "button[data-action='add-todo']"

        - action: measure_fid
          interaction:
            type: "click"
            selector: "button[data-action='add-todo']"
          store_as: "fid_measurement"

      assertions:
        - type: metric_less_than
          metric: "{{fid_measurement.value}}"
          threshold: 100
          message: "FID should be less than 100ms (Good)"

        - type: metric_less_than_warning
          metric: "{{fid_measurement.value}}"
          threshold: 300
          message: "FID should be less than 300ms (Needs Improvement threshold)"

    # Cumulative Layout Shift (CLS)
    - id: "PERF-CLS-001"
      name: "CLS under 0.1"
      description: "Cumulative Layout Shift should be minimal for visual stability"
      tags: ["core-web-vitals", "cls", "critical"]

      steps:
        - action: navigate
          url: "/"

        - action: wait_for
          timeout: 5000
          description: "Wait for page to fully load and settle"

        - action: measure_cls
          duration: 5000
          store_as: "cls_measurement"

        - action: get_cls_elements
          store_as: "shifting_elements"

      assertions:
        - type: metric_less_than
          metric: "{{cls_measurement.value}}"
          threshold: 0.1
          message: "CLS should be less than 0.1 (Good)"

        - type: metric_less_than_warning
          metric: "{{cls_measurement.value}}"
          threshold: 0.25
          message: "CLS should be less than 0.25 (Needs Improvement threshold)"

        - type: no_layout_shifts
          message: "No significant layout shifts should occur"

    # Time to Interactive (TTI)
    - id: "PERF-TTI-001"
      name: "TTI under 3.8 seconds"
      description: "Page should become interactive quickly"
      tags: ["performance", "tti"]

      steps:
        - action: navigate
          url: "/dashboard"

        - action: measure_tti
          store_as: "tti_measurement"

      assertions:
        - type: metric_less_than
          metric: "{{tti_measurement.value}}"
          threshold: 3800
          message: "TTI should be less than 3.8 seconds (Good)"

    # First Contentful Paint (FCP)
    - id: "PERF-FCP-001"
      name: "FCP under 1.8 seconds"
      description: "First content should paint quickly"
      tags: ["performance", "fcp"]

      steps:
        - action: navigate
          url: "/"

        - action: measure_fcp
          store_as: "fcp_measurement"

      assertions:
        - type: metric_less_than
          metric: "{{fcp_measurement.value}}"
          threshold: 1800
          message: "FCP should be less than 1.8 seconds (Good)"
```

## Lighthouse Performance Audits

```yaml
# tests/performance/lighthouse.test.yaml
test_suite:
  name: "Lighthouse Performance Audits"
  description: "Comprehensive Lighthouse performance testing"
  version: "1.0.0"

  config:
    lighthouse_config:
      extends: "lighthouse:default"
      settings:
        onlyCategories: ["performance"]
        throttling:
          rttMs: 40
          throughputKbps: 10240
          cpuSlowdownMultiplier: 1
        screenEmulation:
          mobile: true
          width: 375
          height: 667
          deviceScaleFactor: 2

  test_cases:
    # Overall performance score
    - id: "PERF-LH-001"
      name: "Lighthouse performance score above 90"
      description: "Target high Lighthouse performance score"
      tags: ["lighthouse", "performance", "critical"]

      steps:
        - action: navigate
          url: "/"

        - action: run_lighthouse
          config: "{{lighthouse_config}}"
          store_as: "lighthouse_results"

        - action: generate_lighthouse_report
          results: "{{lighthouse_results}}"
          output: "test-results/lighthouse/homepage.html"

      assertions:
        - type: lighthouse_score_above
          category: "performance"
          threshold: 90
          message: "Lighthouse performance score should be 90 or higher"

        - type: lighthouse_score_above
          category: "performance"
          threshold: 50
          level: "warning"
          message: "Performance score should at least be above 50"

    # Specific Lighthouse audits
    - id: "PERF-LH-002"
      name: "Image optimization"
      description: "Images should be properly sized and optimized"
      tags: ["lighthouse", "images", "optimization"]

      steps:
        - action: run_lighthouse
          url: "/"
          store_as: "results"

      assertions:
        - type: lighthouse_audit_passed
          audit: "uses-optimized-images"
          message: "Images should be optimized"

        - type: lighthouse_audit_passed
          audit: "modern-image-formats"
          message: "Should use modern image formats (WebP, AVIF)"

        - type: lighthouse_audit_passed
          audit: "uses-responsive-images"
          message: "Should use appropriately sized images"

        - type: lighthouse_audit_passed
          audit: "offscreen-images"
          message: "Should defer offscreen images"

    # JavaScript optimization
    - id: "PERF-LH-003"
      name: "JavaScript efficiency"
      description: "JavaScript should be optimized and efficient"
      tags: ["lighthouse", "javascript", "optimization"]

      steps:
        - action: run_lighthouse
          url: "/dashboard"
          store_as: "results"

      assertions:
        - type: lighthouse_audit_passed
          audit: "unused-javascript"
          message: "Should minimize unused JavaScript"

        - type: lighthouse_audit_passed
          audit: "unminified-javascript"
          message: "JavaScript should be minified"

        - type: lighthouse_audit_passed
          audit: "bootup-time"
          message: "JavaScript execution time should be minimal"

        - type: lighthouse_audit_passed
          audit: "mainthread-work-breakdown"
          message: "Main thread work should be minimized"

    # Network optimization
    - id: "PERF-LH-004"
      name: "Network efficiency"
      description: "Network resources should be optimized"
      tags: ["lighthouse", "network", "optimization"]

      steps:
        - action: run_lighthouse
          url: "/"
          store_as: "results"

      assertions:
        - type: lighthouse_audit_passed
          audit: "uses-text-compression"
          message: "Should enable text compression (gzip/brotli)"

        - type: lighthouse_audit_passed
          audit: "uses-long-cache-ttl"
          message: "Should use efficient cache policy"

        - type: lighthouse_audit_passed
          audit: "uses-http2"
          message: "Should use HTTP/2 for resources"

        - type: lighthouse_audit_passed
          audit: "total-byte-weight"
          message: "Should minimize total page weight"

    # Rendering optimization
    - id: "PERF-LH-005"
      name: "Rendering performance"
      description: "Rendering should be optimized"
      tags: ["lighthouse", "rendering"]

      steps:
        - action: run_lighthouse
          url: "/"
          store_as: "results"

      assertions:
        - type: lighthouse_audit_passed
          audit: "render-blocking-resources"
          message: "Should eliminate render-blocking resources"

        - type: lighthouse_audit_passed
          audit: "unminified-css"
          message: "CSS should be minified"

        - type: lighthouse_audit_passed
          audit: "unused-css-rules"
          message: "Should remove unused CSS"

        - type: lighthouse_audit_passed
          audit: "critical-request-chains"
          message: "Should minimize critical request chains"
```

## Resource Optimization Testing

```yaml
# tests/performance/resource-optimization.test.yaml
test_suite:
  name: "Resource Optimization Tests"
  description: "Verify optimal resource loading and caching"
  version: "1.0.0"

  test_cases:
    # Image lazy loading
    - id: "PERF-IMG-001"
      name: "Images are lazy loaded"
      description: "Offscreen images should not load until needed"
      tags: ["optimization", "images", "lazy-loading"]

      steps:
        - action: navigate
          url: "/gallery"

        - action: get_network_requests
          filter: "image"
          store_as: "initial_images"

        - action: evaluate
          function: |
            () => {
              const images = Array.from(document.querySelectorAll('img'));
              return {
                total: images.length,
                withLoading: images.filter(img => img.loading === 'lazy').length,
                inViewport: images.filter(img => {
                  const rect = img.getBoundingClientRect();
                  return rect.top < window.innerHeight;
                }).length
              };
            }
          store_as: "image_stats"

        - action: scroll_to_bottom
          smooth: false

        - action: wait_for
          timeout: 2000

        - action: get_network_requests
          filter: "image"
          store_as: "after_scroll_images"

      assertions:
        - type: variable_greater_than
          variable: "image_stats.withLoading"
          value: 0
          message: "Should have images with loading='lazy'"

        - type: lazy_loading_working
          initial: "{{initial_images.length}}"
          after_scroll: "{{after_scroll_images.length}}"
          message: "Additional images should load only after scrolling"

    # Font loading optimization
    - id: "PERF-FONT-001"
      name: "Fonts are optimized"
      description: "Fonts should use font-display and be subset"
      tags: ["optimization", "fonts"]

      steps:
        - action: navigate
          url: "/"

        - action: evaluate
          function: |
            () => {
              const fontFaces = Array.from(document.fonts);
              return fontFaces.map(font => ({
                family: font.family,
                weight: font.weight,
                status: font.status,
                display: font.display
              }));
            }
          store_as: "fonts"

        - action: get_network_requests
          filter: "font"
          store_as: "font_requests"

      assertions:
        - type: all_fonts_have_display
          fonts: "{{fonts}}"
          expected: ["swap", "optional", "fallback"]
          message: "Fonts should use font-display for better loading"

        - type: font_requests_optimized
          requests: "{{font_requests}}"
          max_size: 100000  # 100KB per font
          message: "Font files should be optimized and subset"

    # JavaScript code splitting
    - id: "PERF-JS-001"
      name: "JavaScript is code-split"
      description: "JavaScript should be split into smaller chunks"
      tags: ["optimization", "javascript", "code-splitting"]

      steps:
        - action: navigate
          url: "/"

        - action: get_network_requests
          filter: "script"
          store_as: "homepage_scripts"

        - action: navigate
          url: "/dashboard"

        - action: get_network_requests
          filter: "script"
          store_as: "dashboard_scripts"

      assertions:
        - type: route_specific_chunks
          homepage: "{{homepage_scripts}}"
          dashboard: "{{dashboard_scripts}}"
          message: "Different routes should load different JavaScript chunks"

        - type: chunk_size_reasonable
          scripts: "{{homepage_scripts}}"
          max_size: 500000  # 500KB per chunk
          message: "JavaScript chunks should be reasonably sized"

    # CSS optimization
    - id: "PERF-CSS-001"
      name: "CSS is optimized"
      description: "CSS should be minified and critical CSS inlined"
      tags: ["optimization", "css"]

      steps:
        - action: navigate
          url: "/"
          wait_until: "domcontentloaded"

        - action: evaluate
          function: |
            () => {
              const stylesheets = Array.from(document.styleSheets);
              const inlineStyles = Array.from(document.querySelectorAll('style'));

              return {
                externalStylesheets: stylesheets.filter(s => s.href).length,
                inlineStyles: inlineStyles.length,
                hasCriticalCSS: inlineStyles.some(style =>
                  style.textContent.includes('/* critical */') ||
                  style.id === 'critical-css'
                )
              };
            }
          store_as: "css_stats"

        - action: get_network_requests
          filter: "stylesheet"
          store_as: "css_requests"

      assertions:
        - type: variable_equals
          variable: "css_stats.hasCriticalCSS"
          value: true
          message: "Should have inline critical CSS"

        - type: stylesheets_minified
          requests: "{{css_requests}}"
          message: "CSS files should be minified"

    # Caching strategy
    - id: "PERF-CACHE-001"
      name: "Effective caching strategy"
      description: "Static assets should have long cache durations"
      tags: ["optimization", "caching"]

      steps:
        - action: navigate
          url: "/"

        - action: get_network_requests
          store_as: "requests"

        - action: analyze_cache_headers
          requests: "{{requests}}"
          store_as: "cache_analysis"

      assertions:
        - type: static_assets_cached
          analysis: "{{cache_analysis}}"
          min_duration: 31536000  # 1 year in seconds
          asset_types: ["image", "font", "script", "stylesheet"]
          message: "Static assets should have long cache duration"

        - type: html_cache_appropriate
          analysis: "{{cache_analysis}}"
          max_duration: 3600  # 1 hour
          message: "HTML should have short cache duration or validation"
```

## Runtime Performance Testing

```yaml
# tests/performance/runtime-performance.test.yaml
test_suite:
  name: "Runtime Performance Tests"
  description: "Test JavaScript execution and rendering performance"
  version: "1.0.0"

  test_cases:
    # Long tasks detection
    - id: "PERF-RT-001"
      name: "No long tasks blocking main thread"
      description: "Tasks over 50ms block main thread and should be avoided"
      tags: ["runtime", "main-thread"]

      steps:
        - action: navigate
          url: "/dashboard"

        - action: monitor_long_tasks
          duration: 10000
          store_as: "long_tasks"

        - action: interact_with_page
          interactions:
            - click: "button[data-action='load-data']"
            - wait: 1000
            - scroll: 500
            - wait: 1000

      assertions:
        - type: long_tasks_count
          tasks: "{{long_tasks}}"
          max_count: 0
          threshold: 50
          message: "Should have no tasks over 50ms"

        - type: long_tasks_count
          tasks: "{{long_tasks}}"
          max_count: 2
          threshold: 100
          level: "warning"
          message: "Should minimize tasks over 100ms"

    # Memory leaks
    - id: "PERF-RT-002"
      name: "No memory leaks"
      description: "Memory usage should remain stable"
      tags: ["runtime", "memory"]

      steps:
        - action: navigate
          url: "/todos"

        - action: measure_memory
          store_as: "initial_memory"

        - action: repeat
          times: 10
          steps:
            - action: click
              selector: "button[data-action='create-todo']"
            - action: type
              selector: "input[data-testid='todo-title']"
              value: "Test todo {{index}}"
            - action: click
              selector: "button[data-action='save']"
            - action: wait_for
              timeout: 500
            - action: click
              selector: "button[data-action='delete-todo']"

        - action: measure_memory
          store_as: "after_operations"

        - action: force_garbage_collection

        - action: measure_memory
          store_as: "after_gc"

      assertions:
        - type: memory_growth_acceptable
          initial: "{{initial_memory}}"
          final: "{{after_gc}}"
          max_growth_mb: 10
          message: "Memory should not grow significantly after operations"

    # Animation performance
    - id: "PERF-RT-003"
      name: "Smooth animations (60 FPS)"
      description: "Animations should maintain 60 FPS"
      tags: ["runtime", "animations", "fps"]

      steps:
        - action: navigate
          url: "/animations"

        - action: monitor_fps
          duration: 5000
          store_as: "fps_data"

        - action: trigger_animation
          selector: "[data-animation='slide-in']"

        - action: wait_for_animation_complete

      assertions:
        - type: average_fps_above
          fps_data: "{{fps_data}}"
          threshold: 55
          message: "Should maintain average 55+ FPS"

        - type: dropped_frames_below
          fps_data: "{{fps_data}}"
          threshold: 10
          message: "Should have minimal dropped frames"

    # Event handler performance
    - id: "PERF-RT-004"
      name: "Event handlers execute quickly"
      description: "Event handlers should not block user interactions"
      tags: ["runtime", "events"]

      steps:
        - action: navigate
          url: "/search"

        - action: measure_event_handler_time
          event: "input"
          selector: "input[data-testid='search']"
          input_text: "performance testing"
          store_as: "handler_times"

      assertions:
        - type: all_event_handlers_fast
          times: "{{handler_times}}"
          max_duration: 16  # One frame at 60 FPS
          message: "Event handlers should execute within one frame (16ms)"

        - type: average_handler_time
          times: "{{handler_times}}"
          max_average: 10
          message: "Average event handler time should be under 10ms"
```

## Load Testing

```yaml
# tests/performance/load-testing.yaml
test_suite:
  name: "Load and Stress Tests"
  description: "Test application performance under load"
  version: "1.0.0"

  test_cases:
    # Concurrent users
    - id: "PERF-LOAD-001"
      name: "Handle 100 concurrent users"
      description: "Application should handle 100 concurrent users"
      tags: ["load-testing", "scalability"]

      steps:
        - action: run_load_test
          config:
            virtual_users: 100
            duration: "5m"
            ramp_up: "1m"
            scenarios:
              browse_homepage:
                weight: 40
                requests:
                  - GET: "/"
                  - wait: "2s"

              login_and_browse:
                weight: 30
                requests:
                  - GET: "/auth/login"
                  - POST: "/api/auth/login"
                    body: { email: "user@example.com", password: "password" }
                  - GET: "/dashboard"
                  - GET: "/todos"

              create_todo:
                weight: 30
                requests:
                  - POST: "/api/auth/login"
                  - GET: "/todos"
                  - POST: "/api/todos"
                    body: { title: "Test todo", description: "Load test" }

          store_as: "load_results"

      assertions:
        - type: response_time_p95
          results: "{{load_results}}"
          threshold: 500
          message: "95th percentile response time should be under 500ms"

        - type: response_time_p99
          results: "{{load_results}}"
          threshold: 1000
          message: "99th percentile response time should be under 1000ms"

        - type: error_rate
          results: "{{load_results}}"
          max_rate: 0.01  # 1%
          message: "Error rate should be under 1%"

        - type: throughput
          results: "{{load_results}}"
          min_rps: 50
          message: "Should handle at least 50 requests per second"

    # Spike testing
    - id: "PERF-LOAD-002"
      name: "Handle traffic spikes"
      description: "Application should handle sudden traffic increases"
      tags: ["load-testing", "spike-testing"]

      steps:
        - action: run_spike_test
          config:
            baseline_users: 10
            spike_users: 200
            spike_duration: "2m"
            scenarios:
              - GET: "/"
              - GET: "/api/todos"

          store_as: "spike_results"

      assertions:
        - type: recovers_from_spike
          results: "{{spike_results}}"
          recovery_time: 30000  # 30 seconds
          message: "Should recover within 30 seconds after spike"

        - type: error_rate_during_spike
          results: "{{spike_results}}"
          max_rate: 0.05  # 5%
          message: "Error rate during spike should be under 5%"

    # Endurance testing
    - id: "PERF-LOAD-003"
      name: "Sustained load endurance"
      description: "Application should handle sustained load without degradation"
      tags: ["load-testing", "endurance"]

      steps:
        - action: run_endurance_test
          config:
            virtual_users: 50
            duration: "30m"
            scenarios:
              - GET: "/"
              - wait: "5s"
              - GET: "/dashboard"
              - wait: "10s"

          store_as: "endurance_results"

      assertions:
        - type: no_performance_degradation
          results: "{{endurance_results}}"
          compare_windows:
            - start: "0m"
              end: "10m"
            - start: "20m"
              end: "30m"
          max_degradation: 0.2  # 20%
          message: "Performance should not degrade more than 20% over time"

        - type: memory_stable
          results: "{{endurance_results}}"
          message: "Memory usage should remain stable"
```

## Performance Budgets

```yaml
# tests/performance/performance-budgets.yaml
test_suite:
  name: "Performance Budget Tests"
  description: "Enforce performance budgets for resource sizes and metrics"
  version: "1.0.0"

  config:
    performance_budgets:
      # Resource budgets
      resources:
        html: 50  # KB
        css: 100  # KB
        javascript: 300  # KB
        images: 500  # KB
        fonts: 100  # KB
        total: 1000  # KB

      # Metric budgets
      metrics:
        fcp: 1800  # ms
        lcp: 2500  # ms
        tti: 3800  # ms
        tbt: 200   # ms
        cls: 0.1
        speed_index: 3400  # ms

      # Request count budgets
      requests:
        total: 50
        scripts: 10
        stylesheets: 5
        images: 30
        fonts: 4

  test_cases:
    - id: "PERF-BUDGET-001"
      name: "Resource size budgets"
      description: "Resource sizes should be within defined budgets"
      tags: ["budget", "resources"]

      steps:
        - action: navigate
          url: "/"

        - action: get_network_requests
          store_as: "requests"

        - action: calculate_resource_sizes
          requests: "{{requests}}"
          store_as: "sizes"

      assertions:
        - type: resource_size_under_budget
          resource: "html"
          size: "{{sizes.html}}"
          budget: "{{performance_budgets.resources.html}}"
          message: "HTML size should be under budget"

        - type: resource_size_under_budget
          resource: "css"
          size: "{{sizes.css}}"
          budget: "{{performance_budgets.resources.css}}"
          message: "CSS size should be under budget"

        - type: resource_size_under_budget
          resource: "javascript"
          size: "{{sizes.javascript}}"
          budget: "{{performance_budgets.resources.javascript}}"
          message: "JavaScript size should be under budget"

        - type: resource_size_under_budget
          resource: "images"
          size: "{{sizes.images}}"
          budget: "{{performance_budgets.resources.images}}"
          message: "Images size should be under budget"

        - type: resource_size_under_budget
          resource: "total"
          size: "{{sizes.total}}"
          budget: "{{performance_budgets.resources.total}}"
          message: "Total page size should be under budget"

    - id: "PERF-BUDGET-002"
      name: "Request count budgets"
      description: "Number of requests should be within budgets"
      tags: ["budget", "requests"]

      steps:
        - action: navigate
          url: "/"

        - action: get_network_requests
          store_as: "requests"

        - action: count_requests_by_type
          requests: "{{requests}}"
          store_as: "counts"

      assertions:
        - type: request_count_under_budget
          type: "total"
          count: "{{counts.total}}"
          budget: "{{performance_budgets.requests.total}}"
          message: "Total request count should be under budget"

        - type: request_count_under_budget
          type: "scripts"
          count: "{{counts.scripts}}"
          budget: "{{performance_budgets.requests.scripts}}"
          message: "Script request count should be under budget"

        - type: request_count_under_budget
          type: "stylesheets"
          count: "{{counts.stylesheets}}"
          budget: "{{performance_budgets.requests.stylesheets}}"
          message: "Stylesheet request count should be under budget"
```

## Performance Monitoring Script

```typescript
// scripts/performance-monitor.ts
import { chromium, devices } from 'playwright';
import lighthouse from 'lighthouse';
import * as fs from 'fs';
import * as path from 'path';

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  tti: number;
  tbt: number;
  speedIndex: number;
}

interface LighthouseResult {
  score: number;
  metrics: PerformanceMetrics;
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    savings: number;
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

class PerformanceMonitor {
  private url: string;
  private outputDir: string;

  constructor(url: string, outputDir: string = 'test-results/performance') {
    this.url = url;
    this.outputDir = outputDir;

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async measureCoreWebVitals(): Promise<PerformanceMetrics> {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['Desktop Chrome']);
    const page = await context.newPage();

    // Measure Web Vitals
    await page.goto(this.url, { waitUntil: 'networkidle' });

    const metrics = await page.evaluate(() => {
      return new Promise<PerformanceMetrics>((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          // Process entries to calculate metrics
        });

        observer.observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input'] });

        // Also collect from Performance API
        const perfData = performance.getEntriesByType('navigation')[0] as any;
        const paintEntries = performance.getEntriesByType('paint');

        resolve({
          lcp: 0, // Calculate from observer
          fid: 0, // Calculate from observer
          cls: 0, // Calculate from observer
          fcp: paintEntries.find(e => e.name === 'first-contentful-paint')?.startTime || 0,
          tti: 0, // Calculate
          tbt: 0, // Calculate
          speedIndex: 0 // Calculate
        });
      });
    });

    await browser.close();
    return metrics;
  }

  async runLighthouseAudit(): Promise<LighthouseResult> {
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9222']
    });

    const { lhr } = await lighthouse(this.url, {
      port: 9222,
      onlyCategories: ['performance'],
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1
      },
      screenEmulation: {
        mobile: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
      }
    });

    await browser.close();

    const performanceScore = lhr.categories.performance.score * 100;
    const metrics: PerformanceMetrics = {
      lcp: lhr.audits['largest-contentful-paint'].numericValue,
      fid: lhr.audits['max-potential-fid'].numericValue,
      cls: lhr.audits['cumulative-layout-shift'].numericValue,
      fcp: lhr.audits['first-contentful-paint'].numericValue,
      tti: lhr.audits['interactive'].numericValue,
      tbt: lhr.audits['total-blocking-time'].numericValue,
      speedIndex: lhr.audits['speed-index'].numericValue
    };

    const opportunities = Object.values(lhr.audits)
      .filter((audit: any) => audit.details?.type === 'opportunity')
      .map((audit: any) => ({
        id: audit.id,
        title: audit.title,
        description: audit.description,
        savings: audit.numericValue || 0
      }));

    const diagnostics = Object.values(lhr.audits)
      .filter((audit: any) => audit.details?.type === 'debugdata' || audit.score < 1)
      .map((audit: any) => ({
        id: audit.id,
        title: audit.title,
        description: audit.description
      }));

    return {
      score: performanceScore,
      metrics,
      opportunities,
      diagnostics
    };
  }

  async generateReport(results: LighthouseResult): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Performance Report</title>
  <style>
    body { font-family: sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .score { font-size: 3rem; font-weight: bold; }
    .score.good { color: #0cce6b; }
    .score.average { color: #ffa400; }
    .score.poor { color: #ff4e42; }
    .metric { display: inline-block; margin: 20px; text-align: center; }
    .metric-value { font-size: 2rem; font-weight: bold; }
    .opportunity { background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px; }
  </style>
</head>
<body>
  <h1>Performance Report</h1>
  <h2>Lighthouse Score</h2>
  <div class="score ${results.score >= 90 ? 'good' : results.score >= 50 ? 'average' : 'poor'}">
    ${results.score}
  </div>

  <h2>Core Web Vitals</h2>
  ${this.renderMetric('LCP', results.metrics.lcp, 'ms', 2500, 4000)}
  ${this.renderMetric('FID', results.metrics.fid, 'ms', 100, 300)}
  ${this.renderMetric('CLS', results.metrics.cls, '', 0.1, 0.25)}
  ${this.renderMetric('FCP', results.metrics.fcp, 'ms', 1800, 3000)}
  ${this.renderMetric('TTI', results.metrics.tti, 'ms', 3800, 7300)}
  ${this.renderMetric('TBT', results.metrics.tbt, 'ms', 200, 600)}

  <h2>Opportunities (${results.opportunities.length})</h2>
  ${results.opportunities.map(opp => `
    <div class="opportunity">
      <h3>${opp.title}</h3>
      <p>${opp.description}</p>
      <p><strong>Potential savings:</strong> ${opp.savings}ms</p>
    </div>
  `).join('')}

  <h2>Diagnostics (${results.diagnostics.length})</h2>
  ${results.diagnostics.map(diag => `
    <div class="opportunity">
      <h3>${diag.title}</h3>
      <p>${diag.description}</p>
    </div>
  `).join('')}
</body>
</html>
    `;

    const reportPath = path.join(this.outputDir, 'performance-report.html');
    fs.writeFileSync(reportPath, html);
    console.log(`Performance report saved to: ${reportPath}`);
  }

  private renderMetric(name: string, value: number, unit: string, goodThreshold: number, poorThreshold: number): string {
    const className = value <= goodThreshold ? 'good' : value <= poorThreshold ? 'average' : 'poor';
    return `
      <div class="metric">
        <div>${name}</div>
        <div class="metric-value ${className}">${value.toFixed(2)}${unit}</div>
      </div>
    `;
  }
}

// Usage
async function main() {
  const monitor = new PerformanceMonitor('http://localhost:3000');

  console.log('Measuring Core Web Vitals...');
  const webVitals = await monitor.measureCoreWebVitals();
  console.log('Core Web Vitals:', webVitals);

  console.log('Running Lighthouse audit...');
  const lighthouseResults = await monitor.runLighthouseAudit();
  console.log('Lighthouse Score:', lighthouseResults.score);

  console.log('Generating report...');
  await monitor.generateReport(lighthouseResults);

  // Fail if performance score is below threshold
  if (lighthouseResults.score < 90) {
    console.error(`Performance score (${lighthouseResults.score}) is below target (90)`);
    process.exit(1);
  }
}

main();
```

## CI/CD Integration

```yaml
# .github/workflows/performance-tests.yml
name: Performance Tests

on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  lighthouse:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Build application
        run: pnpm build

      - name: Start application
        run: |
          docker-compose up -d
          ./scripts/wait-for-services.sh

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/dashboard
            http://localhost:3000/todos
          uploadArtifacts: true
          temporaryPublicStorage: true
          runs: 3

      - name: Check Lighthouse scores
        run: |
          PERF_SCORE=$(jq '.[] | select(.url=="http://localhost:3000") | .categories.performance.score' lighthouse-results.json)
          if (( $(echo "$PERF_SCORE < 0.9" | bc -l) )); then
            echo "Performance score ($PERF_SCORE) is below 0.9"
            exit 1
          fi

  load-testing:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Start application
        run: docker-compose up -d

      - name: Run k6 load test
        uses: grafana/k6-action@v0.3.1
        with:
          filename: tests/performance/load-test.js
          flags: --out json=test-results/load-test-results.json

      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: load-test-results
          path: test-results/load-test-results.json
```

## Related Examples

- **E2E Testing**: `qa-testing/examples/01-e2e-test-suite.md` - Complementary testing approach
- **Accessibility**: `qa-testing/examples/02-accessibility-testing.md` - Accessibility performance impacts
- **DevOps**: `devops-deployment/examples/02-cicd-pipeline.md` - Automated performance testing in CI
- **Frontend**: `frontend-nextjs/examples/04-performance-optimization.md` - Frontend optimization techniques

## Key Takeaways

1. **Core Web Vitals First**: Focus on LCP, FID, and CLS as primary metrics
2. **Performance Budgets**: Set and enforce budgets for resources and metrics
3. **Continuous Monitoring**: Test performance in CI/CD, not just manually
4. **Real User Conditions**: Test with throttling to simulate real network conditions
5. **Optimize Images**: Lazy loading, modern formats (WebP/AVIF), responsive images
6. **Code Splitting**: Split JavaScript into smaller chunks for faster initial load
7. **Efficient Caching**: Long cache durations for static assets, validation for dynamic content
8. **Minimize Main Thread Work**: Avoid long tasks that block user interactions
9. **Load Testing**: Test under realistic load to identify bottlenecks
10. **Iterative Improvement**: Performance optimization is ongoing, not one-time

Performance directly impacts user experience, SEO rankings, and conversion rates.
