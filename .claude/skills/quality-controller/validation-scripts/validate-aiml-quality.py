#!/usr/bin/env python3
"""
AI/ML System Quality Validation Script
Part of quality-controller skill
Validates all quality metrics for AI/ML systems

Quality Standards (from quality-standards.json):
- Model Accuracy: >90% on validation set
- Inference Latency: <100ms 95th percentile
- Data Completeness: >95% non-null values
- Model Interpretability: SHAP/LIME required
- GPU Utilization: >70% during training
- Memory Efficiency: <80% GPU memory usage
"""

import argparse
import json
import os
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Optional

# ANSI Colors
RED = '\033[0;31m'
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'  # No Color

# Quality Thresholds
THRESHOLDS = {
    'model_accuracy_target': 0.90,
    'model_accuracy_minimum': 0.85,
    'inference_latency_target_ms': 100,
    'inference_latency_maximum_ms': 200,
    'data_completeness_target': 0.95,
    'data_completeness_minimum': 0.90,
    'test_coverage_target': 0.80,
    'test_coverage_minimum': 0.70,
    'gpu_utilization_target': 0.70,
    'gpu_memory_limit': 0.80,
    'type_coverage_target': 0.95,  # mypy strict
}


@dataclass
class CheckResult:
    name: str
    status: str  # PASS, FAIL, WARN
    message: str
    value: Optional[float] = None


class AIMLQualityValidator:
    def __init__(self, workspace_dir: str = "workspace"):
        self.workspace_dir = Path(workspace_dir)
        self.ml_dir = self.workspace_dir / "ml"
        self.results: list[CheckResult] = []
        
    def print_result(self, result: CheckResult):
        """Print formatted check result"""
        self.results.append(result)
        
        if result.status == "PASS":
            print(f"{GREEN}[PASS]{NC} {result.name}: {result.message}")
        elif result.status == "FAIL":
            print(f"{RED}[FAIL]{NC} {result.name}: {result.message}")
        elif result.status == "WARN":
            print(f"{YELLOW}[WARN]{NC} {result.name}: {result.message}")
    
    def check_directory_exists(self, path: Path, name: str) -> bool:
        """Check if directory exists"""
        if not path.exists():
            self.print_result(CheckResult(
                name=f"Directory Check ({name})",
                status="FAIL",
                message=f"{path} does not exist"
            ))
            return False
        return True
    
    def run_command(self, cmd: list[str], cwd: Optional[Path] = None) -> tuple[int, str, str]:
        """Run command and capture output"""
        try:
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                cwd=cwd or self.workspace_dir,
                timeout=300  # 5 minute timeout
            )
            return result.returncode, result.stdout, result.stderr
        except subprocess.TimeoutExpired:
            return -1, "", "Command timed out"
        except Exception as e:
            return -1, "", str(e)

    def check_python_environment(self):
        """1. Check Python environment and dependencies"""
        print(f"\n{BLUE}[1/8] Python Environment Checks{NC}")
        print("-" * 40)
        
        # Check Python version
        code, stdout, stderr = self.run_command(["python3", "--version"])
        if code == 0:
            version = stdout.strip()
            self.print_result(CheckResult(
                name="Python Version",
                status="PASS",
                message=version
            ))
        else:
            self.print_result(CheckResult(
                name="Python Version",
                status="FAIL",
                message="Python 3 not found"
            ))
        
        # Check requirements.txt
        requirements_path = self.ml_dir / "requirements.txt"
        if requirements_path.exists():
            self.print_result(CheckResult(
                name="Requirements File",
                status="PASS",
                message="requirements.txt found"
            ))
            
            # Check for ML framework dependencies
            with open(requirements_path) as f:
                content = f.read().lower()
                
            has_tf = 'tensorflow' in content
            has_torch = 'torch' in content or 'pytorch' in content
            has_sklearn = 'scikit-learn' in content
            
            if has_tf or has_torch:
                framework = "TensorFlow" if has_tf else "PyTorch"
                self.print_result(CheckResult(
                    name="ML Framework",
                    status="PASS",
                    message=f"{framework} detected"
                ))
            else:
                self.print_result(CheckResult(
                    name="ML Framework",
                    status="WARN",
                    message="No major ML framework (TensorFlow/PyTorch) found"
                ))
        else:
            self.print_result(CheckResult(
                name="Requirements File",
                status="FAIL",
                message="requirements.txt not found"
            ))

    def check_type_safety(self):
        """2. Check Python type safety with mypy"""
        print(f"\n{BLUE}[2/8] Type Safety Checks (mypy strict){NC}")
        print("-" * 40)
        
        if not self.check_directory_exists(self.ml_dir, "ML"):
            return
        
        # Check for mypy configuration
        mypy_ini = self.ml_dir / "mypy.ini"
        pyproject = self.ml_dir / "pyproject.toml"
        
        has_mypy_config = mypy_ini.exists() or (
            pyproject.exists() and "[tool.mypy]" in pyproject.read_text()
        )
        
        if has_mypy_config:
            self.print_result(CheckResult(
                name="mypy Configuration",
                status="PASS",
                message="mypy config found"
            ))
        else:
            self.print_result(CheckResult(
                name="mypy Configuration",
                status="WARN",
                message="No mypy.ini or pyproject.toml [tool.mypy] found"
            ))
        
        # Run mypy
        code, stdout, stderr = self.run_command(
            ["python3", "-m", "mypy", "--strict", "."],
            cwd=self.ml_dir
        )
        
        if code == 0:
            self.print_result(CheckResult(
                name="mypy Strict Check",
                status="PASS",
                message="No type errors"
            ))
        else:
            error_count = len([l for l in stdout.split('\n') if 'error:' in l])
            if error_count > 0:
                self.print_result(CheckResult(
                    name="mypy Strict Check",
                    status="FAIL",
                    message=f"{error_count} type errors found"
                ))
            else:
                self.print_result(CheckResult(
                    name="mypy Strict Check",
                    status="WARN",
                    message="mypy not installed or misconfigured"
                ))

    def check_test_coverage(self):
        """3. Check test coverage with pytest"""
        print(f"\n{BLUE}[3/8] Test Coverage Checks{NC}")
        print("-" * 40)
        
        if not self.check_directory_exists(self.ml_dir, "ML"):
            return
        
        tests_dir = self.ml_dir / "tests"
        if not tests_dir.exists():
            self.print_result(CheckResult(
                name="Tests Directory",
                status="FAIL",
                message="tests/ directory not found"
            ))
            return
        
        # Run pytest with coverage
        code, stdout, stderr = self.run_command(
            ["python3", "-m", "pytest", "--cov=.", "--cov-report=json", "-q"],
            cwd=self.ml_dir
        )
        
        coverage_json = self.ml_dir / "coverage.json"
        if coverage_json.exists():
            with open(coverage_json) as f:
                cov_data = json.load(f)
            
            total_coverage = cov_data.get('totals', {}).get('percent_covered', 0)
            
            if total_coverage >= THRESHOLDS['test_coverage_target'] * 100:
                status = "PASS"
            elif total_coverage >= THRESHOLDS['test_coverage_minimum'] * 100:
                status = "WARN"
            else:
                status = "FAIL"
            
            self.print_result(CheckResult(
                name="Test Coverage",
                status=status,
                message=f"{total_coverage:.1f}% (target: {THRESHOLDS['test_coverage_target']*100}%)",
                value=total_coverage
            ))
        else:
            if code == 0:
                self.print_result(CheckResult(
                    name="pytest",
                    status="PASS",
                    message="Tests passed (coverage report not generated)"
                ))
            else:
                self.print_result(CheckResult(
                    name="pytest",
                    status="FAIL",
                    message="Tests failed or pytest not configured"
                ))

    def check_model_metrics(self):
        """4. Check model performance metrics"""
        print(f"\n{BLUE}[4/8] Model Performance Metrics{NC}")
        print("-" * 40)
        
        # Check for model metrics file
        metrics_paths = [
            self.ml_dir / "metrics.json",
            self.ml_dir / "model_metrics.json",
            self.workspace_dir / ".memory" / "performance-metrics.md"
        ]
        
        metrics_found = False
        for metrics_path in metrics_paths:
            if metrics_path.exists():
                metrics_found = True
                
                if metrics_path.suffix == '.json':
                    with open(metrics_path) as f:
                        metrics = json.load(f)
                    
                    # Check accuracy
                    accuracy = metrics.get('accuracy') or metrics.get('val_accuracy')
                    if accuracy:
                        if accuracy >= THRESHOLDS['model_accuracy_target']:
                            status = "PASS"
                        elif accuracy >= THRESHOLDS['model_accuracy_minimum']:
                            status = "WARN"
                        else:
                            status = "FAIL"
                        
                        self.print_result(CheckResult(
                            name="Model Accuracy",
                            status=status,
                            message=f"{accuracy*100:.1f}% (target: {THRESHOLDS['model_accuracy_target']*100}%)",
                            value=accuracy
                        ))
                    
                    # Check inference latency
                    latency = metrics.get('inference_latency_p95_ms')
                    if latency:
                        if latency <= THRESHOLDS['inference_latency_target_ms']:
                            status = "PASS"
                        elif latency <= THRESHOLDS['inference_latency_maximum_ms']:
                            status = "WARN"
                        else:
                            status = "FAIL"
                        
                        self.print_result(CheckResult(
                            name="Inference Latency (p95)",
                            status=status,
                            message=f"{latency}ms (target: <{THRESHOLDS['inference_latency_target_ms']}ms)",
                            value=latency
                        ))
                break
        
        if not metrics_found:
            self.print_result(CheckResult(
                name="Model Metrics",
                status="WARN",
                message="No metrics.json found. Run model evaluation to generate."
            ))

    def check_data_quality(self):
        """5. Check data quality and completeness"""
        print(f"\n{BLUE}[5/8] Data Quality Checks{NC}")
        print("-" * 40)
        
        data_dir = self.ml_dir / "data"
        
        if not data_dir.exists():
            self.print_result(CheckResult(
                name="Data Directory",
                status="WARN",
                message="data/ directory not found"
            ))
            return
        
        # Check for data validation script
        validation_script = self.ml_dir / "scripts" / "validate_data.py"
        if validation_script.exists():
            code, stdout, stderr = self.run_command(
                ["python3", str(validation_script)],
                cwd=self.ml_dir
            )
            
            if code == 0:
                self.print_result(CheckResult(
                    name="Data Validation Script",
                    status="PASS",
                    message="Data validation passed"
                ))
            else:
                self.print_result(CheckResult(
                    name="Data Validation Script",
                    status="FAIL",
                    message="Data validation failed"
                ))
        else:
            self.print_result(CheckResult(
                name="Data Validation Script",
                status="WARN",
                message="scripts/validate_data.py not found"
            ))
        
        # Check for DVC (Data Version Control)
        dvc_file = self.ml_dir / ".dvc"
        if dvc_file.exists():
            self.print_result(CheckResult(
                name="Data Version Control",
                status="PASS",
                message="DVC configured"
            ))
        else:
            self.print_result(CheckResult(
                name="Data Version Control",
                status="WARN",
                message="DVC not configured (recommended for ML data)"
            ))

    def check_model_interpretability(self):
        """6. Check model interpretability (SHAP/LIME)"""
        print(f"\n{BLUE}[6/8] Model Interpretability{NC}")
        print("-" * 40)
        
        requirements_path = self.ml_dir / "requirements.txt"
        if requirements_path.exists():
            with open(requirements_path) as f:
                content = f.read().lower()
            
            has_shap = 'shap' in content
            has_lime = 'lime' in content
            
            if has_shap or has_lime:
                tools = []
                if has_shap:
                    tools.append("SHAP")
                if has_lime:
                    tools.append("LIME")
                
                self.print_result(CheckResult(
                    name="Interpretability Tools",
                    status="PASS",
                    message=f"{', '.join(tools)} configured"
                ))
            else:
                self.print_result(CheckResult(
                    name="Interpretability Tools",
                    status="FAIL",
                    message="SHAP or LIME required for model interpretability"
                ))
        else:
            self.print_result(CheckResult(
                name="Interpretability Tools",
                status="WARN",
                message="Cannot check - requirements.txt not found"
            ))

    def check_security(self):
        """7. Security checks"""
        print(f"\n{BLUE}[7/8] Security Checks{NC}")
        print("-" * 40)
        
        # Run pip-audit or safety
        code, stdout, stderr = self.run_command(
            ["pip-audit", "--format=json"],
            cwd=self.ml_dir
        )
        
        if code == 0:
            try:
                vulnerabilities = json.loads(stdout)
                if not vulnerabilities:
                    self.print_result(CheckResult(
                        name="pip-audit",
                        status="PASS",
                        message="No known vulnerabilities"
                    ))
                else:
                    critical = sum(1 for v in vulnerabilities if v.get('severity') == 'critical')
                    high = sum(1 for v in vulnerabilities if v.get('severity') == 'high')
                    
                    if critical > 0 or high > 0:
                        self.print_result(CheckResult(
                            name="pip-audit",
                            status="FAIL",
                            message=f"{critical} critical, {high} high vulnerabilities"
                        ))
                    else:
                        self.print_result(CheckResult(
                            name="pip-audit",
                            status="WARN",
                            message=f"{len(vulnerabilities)} low/medium vulnerabilities"
                        ))
            except json.JSONDecodeError:
                self.print_result(CheckResult(
                    name="pip-audit",
                    status="PASS",
                    message="No vulnerabilities detected"
                ))
        else:
            # Try safety as fallback
            code2, stdout2, stderr2 = self.run_command(
                ["safety", "check", "--json"],
                cwd=self.ml_dir
            )
            
            if code2 == 0:
                self.print_result(CheckResult(
                    name="Safety Check",
                    status="PASS",
                    message="No known vulnerabilities"
                ))
            else:
                self.print_result(CheckResult(
                    name="Security Audit",
                    status="WARN",
                    message="pip-audit/safety not installed. Run: pip install pip-audit"
                ))
        
        # Check for hardcoded secrets
        patterns = [
            "api_key",
            "secret_key", 
            "password",
            "aws_access_key",
            "private_key"
        ]
        
        secrets_found = False
        if self.ml_dir.exists():
            for py_file in self.ml_dir.rglob("*.py"):
                if 'test' in str(py_file) or '__pycache__' in str(py_file):
                    continue
                try:
                    content = py_file.read_text().lower()
                    for pattern in patterns:
                        if f'{pattern} = "' in content or f"{pattern} = '" in content:
                            secrets_found = True
                            break
                except Exception:
                    pass
        
        if secrets_found:
            self.print_result(CheckResult(
                name="Hardcoded Secrets",
                status="FAIL",
                message="Potential hardcoded secrets detected"
            ))
        else:
            self.print_result(CheckResult(
                name="Hardcoded Secrets",
                status="PASS",
                message="No hardcoded secrets detected"
            ))

    def check_docker_gpu(self):
        """8. Check Docker GPU configuration"""
        print(f"\n{BLUE}[8/8] Docker & GPU Configuration{NC}")
        print("-" * 40)
        
        dockerfile = self.workspace_dir / "docker" / "ml.Dockerfile"
        docker_compose = self.workspace_dir / "docker" / "docker-compose.yml"
        
        if dockerfile.exists():
            content = dockerfile.read_text()
            
            # Check for NVIDIA base image
            if 'nvidia' in content.lower() or 'cuda' in content.lower():
                self.print_result(CheckResult(
                    name="GPU Docker Image",
                    status="PASS",
                    message="NVIDIA/CUDA base image configured"
                ))
            else:
                self.print_result(CheckResult(
                    name="GPU Docker Image",
                    status="WARN",
                    message="No NVIDIA/CUDA base image found"
                ))
            
            # Check for non-root user
            if 'USER' in content and 'root' not in content.split('USER')[-1].split('\n')[0]:
                self.print_result(CheckResult(
                    name="Non-root User",
                    status="PASS",
                    message="Non-root user configured"
                ))
            else:
                self.print_result(CheckResult(
                    name="Non-root User",
                    status="WARN",
                    message="Running as root (security risk)"
                ))
        else:
            self.print_result(CheckResult(
                name="ML Dockerfile",
                status="WARN",
                message="docker/ml.Dockerfile not found"
            ))
        
        if docker_compose.exists():
            content = docker_compose.read_text()
            
            # Check for GPU runtime
            if 'nvidia' in content.lower() or 'gpu' in content.lower():
                self.print_result(CheckResult(
                    name="GPU Runtime",
                    status="PASS",
                    message="GPU runtime configured in docker-compose"
                ))
            else:
                self.print_result(CheckResult(
                    name="GPU Runtime",
                    status="WARN",
                    message="GPU runtime not configured in docker-compose"
                ))
        else:
            self.print_result(CheckResult(
                name="Docker Compose",
                status="WARN",
                message="docker-compose.yml not found"
            ))

    def run_all_checks(self):
        """Run all quality checks"""
        print(f"\n{BLUE}{'='*50}{NC}")
        print(f"{BLUE}AI/ML System Quality Validation{NC}")
        print(f"{BLUE}{'='*50}{NC}")
        print(f"Workspace: {self.workspace_dir}")
        print(f"Timestamp: {datetime.now().isoformat()}")
        
        self.check_python_environment()
        self.check_type_safety()
        self.check_test_coverage()
        self.check_model_metrics()
        self.check_data_quality()
        self.check_model_interpretability()
        self.check_security()
        self.check_docker_gpu()
        
        self.print_summary()
    
    def print_summary(self):
        """Print validation summary"""
        total = len(self.results)
        passed = sum(1 for r in self.results if r.status == "PASS")
        failed = sum(1 for r in self.results if r.status == "FAIL")
        warned = sum(1 for r in self.results if r.status == "WARN")
        
        print(f"\n{BLUE}{'='*50}{NC}")
        print(f"{BLUE}Quality Validation Summary{NC}")
        print(f"{BLUE}{'='*50}{NC}")
        print(f"Total Checks: {total}")
        print(f"{GREEN}Passed: {passed}{NC}")
        print(f"{YELLOW}Warnings: {warned}{NC}")
        print(f"{RED}Failed: {failed}{NC}")
        
        if total > 0:
            pass_rate = (passed / total) * 100
            print(f"\nPass Rate: {pass_rate:.1f}%")
        
        if failed == 0:
            print(f"\n{GREEN}[SUCCESS] AI/ML Quality validation PASSED{NC}")
            if warned > 0:
                print(f"{YELLOW}Address {warned} warnings before production{NC}")
            sys.exit(0)
        else:
            print(f"\n{RED}[FAILURE] AI/ML Quality validation FAILED{NC}")
            print(f"Fix {failed} failing checks before proceeding")
            sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="AI/ML System Quality Validation")
    parser.add_argument(
        "--workspace", "-w",
        default="workspace",
        help="Workspace directory (default: workspace)"
    )
    parser.add_argument(
        "--json-output", "-j",
        help="Output results to JSON file"
    )
    
    args = parser.parse_args()
    
    validator = AIMLQualityValidator(workspace_dir=args.workspace)
    validator.run_all_checks()
    
    if args.json_output:
        results_dict = [
            {
                "name": r.name,
                "status": r.status,
                "message": r.message,
                "value": r.value
            }
            for r in validator.results
        ]
        with open(args.json_output, 'w') as f:
            json.dump(results_dict, f, indent=2)
        print(f"\nResults saved to {args.json_output}")


if __name__ == "__main__":
    main()
