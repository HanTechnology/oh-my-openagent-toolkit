#!/usr/bin/env python3
"""
Skill Consistency Verification Script

Verifies that all skills in the agentic-dev-ai-team system comply with
required standards and conventions defined in ENTERPRISE-STANDARDS.md
and CONSISTENCY-MATRIX.md.

Usage:
    python verify-skill-consistency.py [--verbose] [--fix]

Options:
    --verbose   Show detailed output for each check
    --fix       Attempt to fix issues automatically (where possible)
"""

import os
import sys
import re
import json
import yaml
from pathlib import Path
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum

# Configuration
SKILLS_DIR = Path(__file__).parent.parent.parent  # .claude/skills/
INFRASTRUCTURE_SKILLS = [
    "pm-orchestrator",
    "project-detector", 
    "memory-manager",
    "quality-controller"
]
DOMAIN_SKILLS = [
    "frontend-nextjs",
    "mobile-react-native",
    "backend-nestjs",
    "backend-fastapi",
    "database-specialist",
    "security-specialist",
    "fullstack-integration",
    "systemdev-specialist",
    "devops-deployment",
    "qa-testing",
    "research-analysis",
    "mcp-tools-orchestrator"
]
ALL_SKILLS = INFRASTRUCTURE_SKILLS + DOMAIN_SKILLS

# Development skills that MUST have workspace output compliance
DEV_SKILLS_REQUIRE_WORKSPACE = [
    "frontend-nextjs",
    "mobile-react-native",
    "backend-nestjs",
    "backend-fastapi",
    "database-specialist",
    "security-specialist",
    "fullstack-integration",
    "systemdev-specialist",
    "devops-deployment",
    "qa-testing"
]


class Severity(Enum):
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"


@dataclass
class CheckResult:
    skill: str
    check_name: str
    passed: bool
    severity: Severity
    message: str
    details: Optional[str] = None


@dataclass
class VerificationReport:
    results: List[CheckResult] = field(default_factory=list)
    
    def add(self, result: CheckResult):
        self.results.append(result)
    
    @property
    def errors(self) -> List[CheckResult]:
        return [r for r in self.results if not r.passed and r.severity == Severity.ERROR]
    
    @property
    def warnings(self) -> List[CheckResult]:
        return [r for r in self.results if not r.passed and r.severity == Severity.WARNING]
    
    @property
    def passed_count(self) -> int:
        return len([r for r in self.results if r.passed])
    
    @property
    def total_count(self) -> int:
        return len(self.results)


def read_file(path: Path) -> Optional[str]:
    """Read file contents, return None if file doesn't exist."""
    try:
        return path.read_text(encoding='utf-8')
    except (FileNotFoundError, IOError):
        return None


def parse_yaml_frontmatter(content: str) -> Tuple[Optional[Dict], str]:
    """Extract YAML frontmatter from markdown file."""
    if not content.startswith('---'):
        return None, content
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return None, content
    
    try:
        frontmatter = yaml.safe_load(parts[1])
        body = parts[2]
        return frontmatter, body
    except yaml.YAMLError:
        return None, content


def check_skill_directory_exists(skill: str) -> CheckResult:
    """Verify skill directory exists."""
    skill_dir = SKILLS_DIR / skill
    exists = skill_dir.is_dir()
    return CheckResult(
        skill=skill,
        check_name="directory_exists",
        passed=exists,
        severity=Severity.ERROR,
        message=f"Skill directory exists" if exists else f"Skill directory NOT FOUND: {skill_dir}"
    )


def check_skill_md_exists(skill: str) -> CheckResult:
    """Verify SKILL.md exists."""
    skill_md = SKILLS_DIR / skill / "SKILL.md"
    exists = skill_md.is_file()
    return CheckResult(
        skill=skill,
        check_name="skill_md_exists",
        passed=exists,
        severity=Severity.ERROR,
        message="SKILL.md exists" if exists else "SKILL.md NOT FOUND"
    )


def check_yaml_frontmatter(skill: str) -> CheckResult:
    """Verify SKILL.md has valid YAML frontmatter with required fields."""
    skill_md = SKILLS_DIR / skill / "SKILL.md"
    content = read_file(skill_md)
    
    if not content:
        return CheckResult(
            skill=skill,
            check_name="yaml_frontmatter",
            passed=False,
            severity=Severity.ERROR,
            message="Cannot read SKILL.md"
        )
    
    frontmatter, _ = parse_yaml_frontmatter(content)
    
    if not frontmatter:
        return CheckResult(
            skill=skill,
            check_name="yaml_frontmatter",
            passed=False,
            severity=Severity.ERROR,
            message="Missing or invalid YAML frontmatter"
        )
    
    # Check required fields
    required_fields = ['name', 'description']
    missing_fields = [f for f in required_fields if f not in frontmatter]
    
    if missing_fields:
        return CheckResult(
            skill=skill,
            check_name="yaml_frontmatter",
            passed=False,
            severity=Severity.ERROR,
            message=f"Missing required frontmatter fields: {missing_fields}"
        )
    
    # Check allowed-tools exists
    if 'allowed-tools' not in frontmatter:
        return CheckResult(
            skill=skill,
            check_name="yaml_frontmatter",
            passed=False,
            severity=Severity.WARNING,
            message="Missing 'allowed-tools' in frontmatter"
        )
    
    return CheckResult(
        skill=skill,
        check_name="yaml_frontmatter",
        passed=True,
        severity=Severity.INFO,
        message="Valid YAML frontmatter with required fields"
    )


def check_workspace_compliance(skill: str) -> CheckResult:
    """Verify development skills have workspace output compliance."""
    if skill not in DEV_SKILLS_REQUIRE_WORKSPACE:
        return CheckResult(
            skill=skill,
            check_name="workspace_compliance",
            passed=True,
            severity=Severity.INFO,
            message="Not a development skill (workspace check N/A)"
        )
    
    skill_md = SKILLS_DIR / skill / "SKILL.md"
    content = read_file(skill_md)
    
    if not content:
        return CheckResult(
            skill=skill,
            check_name="workspace_compliance",
            passed=False,
            severity=Severity.ERROR,
            message="Cannot read SKILL.md"
        )
    
    # Check for CRITICAL workspace statement
    critical_patterns = [
        r'\*\*CRITICAL\*\*.*workspace/',
        r'CRITICAL.*MUST.*workspace/',
        r'workspace/.*CRITICAL',
        r'Output Directory.*workspace/'
    ]
    
    has_critical = any(re.search(p, content, re.IGNORECASE) for p in critical_patterns)
    
    if not has_critical:
        return CheckResult(
            skill=skill,
            check_name="workspace_compliance",
            passed=False,
            severity=Severity.ERROR,
            message="Missing CRITICAL workspace/ output directory statement"
        )
    
    return CheckResult(
        skill=skill,
        check_name="workspace_compliance",
        passed=True,
        severity=Severity.INFO,
        message="Workspace output compliance verified"
    )


def check_enterprise_standards_reference(skill: str) -> CheckResult:
    """Verify development skills reference ENTERPRISE-STANDARDS.md."""
    if skill in INFRASTRUCTURE_SKILLS:
        return CheckResult(
            skill=skill,
            check_name="enterprise_standards_ref",
            passed=True,
            severity=Severity.INFO,
            message="Infrastructure skill (enterprise standards ref N/A)"
        )
    
    skill_md = SKILLS_DIR / skill / "SKILL.md"
    content = read_file(skill_md)
    
    if not content:
        return CheckResult(
            skill=skill,
            check_name="enterprise_standards_ref",
            passed=False,
            severity=Severity.ERROR,
            message="Cannot read SKILL.md"
        )
    
    # Check for Enterprise Standards section or reference
    patterns = [
        r'Enterprise Standards',
        r'ENTERPRISE-STANDARDS\.md',
        r'Enterprise.*Compliance',
        r'Cross-Skill.*Standards'
    ]
    
    has_reference = any(re.search(p, content, re.IGNORECASE) for p in patterns)
    
    if not has_reference:
        return CheckResult(
            skill=skill,
            check_name="enterprise_standards_ref",
            passed=False,
            severity=Severity.WARNING,
            message="Missing Enterprise Standards reference section"
        )
    
    return CheckResult(
        skill=skill,
        check_name="enterprise_standards_ref",
        passed=True,
        severity=Severity.INFO,
        message="Enterprise Standards reference found"
    )


def check_examples_directory(skill: str) -> CheckResult:
    """Verify domain skills have examples directory with content."""
    if skill in INFRASTRUCTURE_SKILLS:
        return CheckResult(
            skill=skill,
            check_name="examples_directory",
            passed=True,
            severity=Severity.INFO,
            message="Infrastructure skill (examples N/A)"
        )
    
    examples_dir = SKILLS_DIR / skill / "examples"
    
    if not examples_dir.is_dir():
        return CheckResult(
            skill=skill,
            check_name="examples_directory",
            passed=False,
            severity=Severity.WARNING,
            message="Missing examples/ directory"
        )
    
    # Count example files
    example_files = list(examples_dir.glob("*.md"))
    
    if len(example_files) == 0:
        return CheckResult(
            skill=skill,
            check_name="examples_directory",
            passed=False,
            severity=Severity.WARNING,
            message="examples/ directory is empty"
        )
    
    return CheckResult(
        skill=skill,
        check_name="examples_directory",
        passed=True,
        severity=Severity.INFO,
        message=f"examples/ directory has {len(example_files)} example(s)"
    )


def check_reference_md(skill: str) -> CheckResult:
    """Verify domain skills have REFERENCE.md."""
    if skill in INFRASTRUCTURE_SKILLS:
        return CheckResult(
            skill=skill,
            check_name="reference_md",
            passed=True,
            severity=Severity.INFO,
            message="Infrastructure skill (REFERENCE.md N/A)"
        )
    
    reference_md = SKILLS_DIR / skill / "REFERENCE.md"
    exists = reference_md.is_file()
    
    return CheckResult(
        skill=skill,
        check_name="reference_md",
        passed=exists,
        severity=Severity.WARNING if not exists else Severity.INFO,
        message="REFERENCE.md exists" if exists else "Missing REFERENCE.md"
    )


def check_deep_thinking_protocol(skill: str) -> CheckResult:
    """Verify skill has Deep Thinking Protocol section."""
    skill_md = SKILLS_DIR / skill / "SKILL.md"
    content = read_file(skill_md)
    
    if not content:
        return CheckResult(
            skill=skill,
            check_name="deep_thinking_protocol",
            passed=False,
            severity=Severity.ERROR,
            message="Cannot read SKILL.md"
        )
    
    patterns = [
        r'Deep Thinking',
        r'Sequential Thinking',
        r'ultrathink'
    ]
    
    has_deep_thinking = any(re.search(p, content, re.IGNORECASE) for p in patterns)
    
    if not has_deep_thinking:
        return CheckResult(
            skill=skill,
            check_name="deep_thinking_protocol",
            passed=False,
            severity=Severity.WARNING,
            message="Missing Deep Thinking Protocol section"
        )
    
    return CheckResult(
        skill=skill,
        check_name="deep_thinking_protocol",
        passed=True,
        severity=Severity.INFO,
        message="Deep Thinking Protocol section found"
    )


def verify_skill(skill: str) -> List[CheckResult]:
    """Run all verification checks for a single skill."""
    results = []
    
    # Check directory exists first
    dir_result = check_skill_directory_exists(skill)
    results.append(dir_result)
    
    if not dir_result.passed:
        return results
    
    # Run other checks
    results.append(check_skill_md_exists(skill))
    results.append(check_yaml_frontmatter(skill))
    results.append(check_workspace_compliance(skill))
    results.append(check_enterprise_standards_reference(skill))
    results.append(check_examples_directory(skill))
    results.append(check_reference_md(skill))
    results.append(check_deep_thinking_protocol(skill))
    
    return results


def verify_all_skills(verbose: bool = False) -> VerificationReport:
    """Verify all skills and generate report."""
    report = VerificationReport()
    
    print("=" * 60)
    print("SKILL CONSISTENCY VERIFICATION")
    print("=" * 60)
    print(f"\nSkills Directory: {SKILLS_DIR}")
    print(f"Total Skills to Verify: {len(ALL_SKILLS)}")
    print(f"  - Infrastructure: {len(INFRASTRUCTURE_SKILLS)}")
    print(f"  - Domain: {len(DOMAIN_SKILLS)}")
    print()
    
    for skill in ALL_SKILLS:
        results = verify_skill(skill)
        for result in results:
            report.add(result)
        
        # Summary per skill
        skill_errors = [r for r in results if not r.passed and r.severity == Severity.ERROR]
        skill_warnings = [r for r in results if not r.passed and r.severity == Severity.WARNING]
        
        status = "✅" if not skill_errors else "❌"
        warning_str = f" ⚠️{len(skill_warnings)}" if skill_warnings else ""
        print(f"{status} {skill}{warning_str}")
        
        if verbose:
            for result in results:
                if not result.passed:
                    icon = "❌" if result.severity == Severity.ERROR else "⚠️"
                    print(f"   {icon} {result.check_name}: {result.message}")
            print()
    
    return report


def print_summary(report: VerificationReport):
    """Print verification summary."""
    print()
    print("=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)
    print(f"Total Checks: {report.total_count}")
    print(f"Passed: {report.passed_count}")
    print(f"Errors: {len(report.errors)}")
    print(f"Warnings: {len(report.warnings)}")
    print()
    
    if report.errors:
        print("ERRORS (must fix):")
        for error in report.errors:
            print(f"  ❌ [{error.skill}] {error.check_name}: {error.message}")
        print()
    
    if report.warnings:
        print("WARNINGS (should fix):")
        for warning in report.warnings:
            print(f"  ⚠️ [{warning.skill}] {warning.check_name}: {warning.message}")
        print()
    
    if not report.errors and not report.warnings:
        print("✅ All checks passed! Skill system is consistent.")
    elif not report.errors:
        print("✅ No errors found. Warnings should be addressed.")
    else:
        print("❌ Errors found. Please fix before proceeding.")
    
    return len(report.errors) == 0


def main():
    verbose = "--verbose" in sys.argv or "-v" in sys.argv
    
    report = verify_all_skills(verbose=verbose)
    success = print_summary(report)
    
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
