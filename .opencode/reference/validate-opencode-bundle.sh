#!/bin/sh

set -u

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
CONFIG_FILE="$ROOT_DIR/.opencode/oh-my-openagent.jsonc"
CAPABILITY_MATRIX_FILE="$ROOT_DIR/.opencode/reference/capability-matrix.json"
WORKFLOW_CATALOG_FILE="$ROOT_DIR/.opencode/reference/workflow-catalog.md"
WEB_3D_SUPPORT_MODEL_FILE="$ROOT_DIR/.opencode/reference/web-3d-support-model.md"
RUNTIME_ROUTE_FILE="$ROOT_DIR/.opencode/commands/route-domain.md"
ROUTING_MATRIX_FILE="$ROOT_DIR/.opencode/reference/routing-matrix.md"
ROUTING_SIGNALS_FILE="$ROOT_DIR/.opencode/reference/routing-signals.json"
QUALITY_GATES_FILE="$ROOT_DIR/.opencode/reference/quality-gates.md"
DESIGN_ANTI_SLOP_FILE="$ROOT_DIR/.opencode/reference/design-anti-slop.md"
DESIGN_MD_SOURCE_POLICY_FILE="$ROOT_DIR/.opencode/reference/design-md-source-policy.md"
DESIGN_MD_SELECTION_PROTOCOL_FILE="$ROOT_DIR/.opencode/reference/design-md-selection-protocol.md"
DESIGN_MD_CATALOG_FILE="$ROOT_DIR/.opencode/reference/design-md-catalog.md"
DESIGN_MD_REFERENCE_DIR="$ROOT_DIR/.opencode/reference/design-md"
DESIGN_MD_EXAMPLES_DIR="$DESIGN_MD_REFERENCE_DIR/examples"
DESIGN_MD_ATTRIBUTION_FILE="$DESIGN_MD_REFERENCE_DIR/ATTRIBUTION.md"
DESIGN_MD_README_FILE="$DESIGN_MD_REFERENCE_DIR/README.md"
IMPECCABLE_DESIGN_MD_FILE="$ROOT_DIR/.opencode/skills/impeccable/reference/design-md.md"
QA_EXAMPLES_DIR="$ROOT_DIR/.opencode/reference/qa/examples"
PUBLIC_CLAIM_DOCS="
$ROOT_DIR/README.md
$ROOT_DIR/AGENTS.md
$ROOT_DIR/.opencode/reference/routing-matrix.md
$ROOT_DIR/.opencode/reference/workspace-model.md
$ROOT_DIR/.opencode/reference/support-policy.md
$ROOT_DIR/.opencode/reference/workflow-catalog.md
$ROOT_DIR/.opencode/reference/workflows/frontend-product-delivery.md
$ROOT_DIR/.opencode/reference/workflows/backend-service-delivery.md
$ROOT_DIR/.opencode/reference/workflows/cloud-release-readiness.md
$ROOT_DIR/.opencode/reference/workflows/ai-data-product-delivery.md
"

FULL_EXPECTED_SKILLS="
architecture-integration
frontend-web
mobile-app
backend-node
backend-python
backend-jvm
backend-dotnet
backend-go
systems-rust
systems-c-cpp
functional-platform
php-ruby-platform
data-ml-platform
database-engineering
security-engineering
devops-platform
qa-validation
impeccable
adapt
animate
arrange
audit
bolder
clarify
colorize
critique
compass
delight
distill
extract
frontend-design
harden
normalize
onboard
optimize
overdrive
polish
quieter
shape
teach-impeccable
typeset
service-vernacular
"

PLANNED_ADJACENT_SKILLS="
release-engineering
documentation-sdk
developer-experience
"

FULL_EXPECTED_SKILL_COUNT=42
PLANNED_ADJACENT_SKILL_COUNT=3
LIVE_TOP_LEVEL_SKILL_COUNT=45
IMPECCABLE_CONSOLIDATED_SKILL_COUNT=1
IMPECCABLE_COMMAND_COUNT=23
IMPECCABLE_COMPAT_WRAPPER_COUNT=22
IMPECCABLE_COMMAND_WRAPPER_COUNT=21
IMPECCABLE_UMBRELLA_WRAPPER_COUNT=1
IMPECCABLE_REFERENCE_COUNT=36
IMPECCABLE_SCRIPT_COUNT=23
FULL_EXPECTED_EXPERT_PACK_COUNT=17
FULL_EXPECTED_ORIENTATION_SKILL_COUNT=1
FULL_EXPECTED_LANGUAGE_COMPANION_SKILL_COUNT=1

PASS_COUNT=0
FAIL_COUNT=0
WARN_COUNT=0

print_header() {
  printf '%s\n' '========================================'
  printf '%s\n' 'OpenCode Bundle Validator'
  printf '%s\n' '========================================'
}

print_result() {
  status="$1"
  name="$2"
  message="$3"
  case "$status" in
    PASS) PASS_COUNT=$((PASS_COUNT + 1)) ;;
    FAIL) FAIL_COUNT=$((FAIL_COUNT + 1)) ;;
    WARN) WARN_COUNT=$((WARN_COUNT + 1)) ;;
  esac
  printf '%s %s: %s\n' "$status" "$name" "$message"
}

fail() {
  print_result FAIL "$1" "$2"
}

pass() {
  print_result PASS "$1" "$2"
}

warn() {
  print_result WARN "$1" "$2"
}

require_file() {
  label="$1"
  path="$2"
  if [ -f "$path" ]; then
    pass "$label" "$path exists"
  else
    fail "$label" "$path is missing"
  fi
}

require_dir() {
  label="$1"
  path="$2"
  if [ -d "$path" ]; then
    pass "$label" "$path exists"
  else
    fail "$label" "$path is missing"
  fi
}

check_plugin_config_contract() {
  if grep -n -E '^[[:space:]]*"paths"[[:space:]]*:' "$CONFIG_FILE" >/dev/null 2>&1; then
    fail 'Plugin config contract' '.opencode/oh-my-openagent.jsonc must not use top-level paths; v4.3.0 project discovery loads .opencode/skills and .opencode/commands from the toolkit root'
  else
    pass 'Plugin config contract' '.opencode/oh-my-openagent.jsonc avoids obsolete top-level paths wiring'
  fi
}

check_banned_strings() {
  label="$1"
  path="$2"
  pattern="$3"
  tmpfile=$(mktemp)
  if [ -z "$tmpfile" ]; then
    fail "$label" "could not allocate temporary file for scan"
    return
  fi
  if [ -d "$path" ]; then
    grep -r -n -E --exclude='validate-opencode-bundle.sh' --exclude='cleanup-deprecated.mjs' --exclude='pin.mjs' "$pattern" "$path" >"$tmpfile" 2>/dev/null
    status=$?
  else
    grep -n -E "$pattern" "$path" >"$tmpfile" 2>/dev/null
    status=$?
  fi
  if [ "$status" -eq 0 ]; then
    fail "$label" "stale legacy references found in $path"
    sed 's/^/  /' "$tmpfile"
  elif [ "$status" -eq 1 ]; then
    pass "$label" "no matches for $pattern"
  else
    fail "$label" "scan error while checking $path"
  fi
  rm -f "$tmpfile"
}

check_foundation() {
  printf '%s\n' 'Mode: foundation'
  require_file 'Config' "$CONFIG_FILE"
  check_plugin_config_contract
  require_dir 'Skills directory' "$ROOT_DIR/.opencode/skills"
  require_dir 'Commands directory' "$ROOT_DIR/.opencode/commands"
  require_dir 'Reference directory' "$ROOT_DIR/.opencode/reference"
  require_dir 'QA examples directory' "$QA_EXAMPLES_DIR"

  if [ ! -d "$ROOT_DIR/.opencode/command" ]; then
    pass 'Canonical naming' 'no singular .opencode/command directory detected'
  else
    fail 'Canonical naming' 'singular .opencode/command directory must not exist'
  fi
}


check_design_md_integration() {
  require_file 'DESIGN.md source policy' "$DESIGN_MD_SOURCE_POLICY_FILE"
  require_file 'DESIGN.md selection protocol' "$DESIGN_MD_SELECTION_PROTOCOL_FILE"
  require_file 'DESIGN.md catalog' "$DESIGN_MD_CATALOG_FILE"
  require_file 'DESIGN.md reference README' "$DESIGN_MD_README_FILE"
  require_file 'DESIGN.md attribution' "$DESIGN_MD_ATTRIBUTION_FILE"
  require_file 'Impeccable DESIGN.md overlay' "$IMPECCABLE_DESIGN_MD_FILE"

  if python3 - "$DESIGN_MD_EXAMPLES_DIR" <<'PY'
from pathlib import Path
import sys

examples_dir = Path(sys.argv[1])
snapshots = sorted(examples_dir.glob("*/DESIGN.md")) if examples_dir.is_dir() else []
if len(snapshots) != 12:
    raise AssertionError(f"expected exactly 12 curated DESIGN.md snapshots, found {len(snapshots)}")
print("curated DESIGN.md snapshot count checks passed")
PY
  then
    pass 'DESIGN.md curated snapshots' 'exactly 12 example DESIGN.md files are present'
  else
    fail 'DESIGN.md curated snapshots' 'expected exactly 12 DESIGN.md files under .opencode/reference/design-md/examples/'
  fi

  if grep -n -F 'f2d6b17d0dd706c9b0942674e6a6a782652cb127' "$DESIGN_MD_ATTRIBUTION_FILE" "$DESIGN_MD_SOURCE_POLICY_FILE" >/dev/null 2>&1 && \
     grep -n -F 'MIT' "$DESIGN_MD_ATTRIBUTION_FILE" "$DESIGN_MD_SOURCE_POLICY_FILE" >/dev/null 2>&1; then
    pass 'DESIGN.md source pinning' 'upstream commit and MIT license are documented'
  else
    fail 'DESIGN.md source pinning' 'source policy or attribution is missing the pinned commit or MIT license'
  fi

  if grep -r -n -F 'not a primary route' "$DESIGN_MD_SOURCE_POLICY_FILE" "$DESIGN_MD_SELECTION_PROTOCOL_FILE" "$DESIGN_MD_CATALOG_FILE" "$DESIGN_MD_README_FILE" "$IMPECCABLE_DESIGN_MD_FILE" >/dev/null 2>&1 && \
     grep -r -n -F 'not a validated support claim' "$DESIGN_MD_SOURCE_POLICY_FILE" "$DESIGN_MD_SELECTION_PROTOCOL_FILE" "$DESIGN_MD_CATALOG_FILE" "$DESIGN_MD_README_FILE" "$IMPECCABLE_DESIGN_MD_FILE" >/dev/null 2>&1; then
    pass 'DESIGN.md support boundaries' 'reference layer is explicitly not a primary route or validated support claim'
  else
    fail 'DESIGN.md support boundaries' 'required non-primary and non-validated boundary phrases are missing'
  fi

  if [ ! -d "$ROOT_DIR/.opencode/skills/design-md" ]; then
    pass 'DESIGN.md top-level skill' 'no .opencode/skills/design-md route exists'
  else
    fail 'DESIGN.md top-level skill' 'DESIGN.md reference layer must not create a top-level skill route'
  fi

  if python3 - "$CAPABILITY_MATRIX_FILE" <<'PY'
import json
from pathlib import Path
import sys

data = json.loads(Path(sys.argv[1]).read_text())
for capability in data.get("capabilities", []):
    if capability.get("id") == "design-md":
        raise AssertionError("capability-matrix.json must not define a design-md capability")
print("no design-md capability checks passed")
PY
  then
    pass 'DESIGN.md capability creep' 'capability-matrix.json does not define design-md'
  else
    fail 'DESIGN.md capability creep' 'capability-matrix.json must not define design-md'
  fi
}

check_expected_skill_dirs() {
  missing=0
  expected_count=0
  for skill in $FULL_EXPECTED_SKILLS; do
    expected_count=$((expected_count + 1))
    if [ -d "$ROOT_DIR/.opencode/skills/$skill" ]; then
      :
    else
      printf 'FAIL Skill pack: missing %s\n' "$ROOT_DIR/.opencode/skills/$skill"
      missing=$((missing + 1))
      FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
  done
  if [ "$expected_count" -ne "$FULL_EXPECTED_SKILL_COUNT" ]; then
    fail 'Skill inventory expectation' "validator is configured for $expected_count skills instead of $FULL_EXPECTED_SKILL_COUNT"
  fi
  if [ "$missing" -eq 0 ]; then
    pass 'Skill inventory' "all $FULL_EXPECTED_SKILL_COUNT required core skill directories ($IMPECCABLE_CONSOLIDATED_SKILL_COUNT consolidated impeccable skill + $IMPECCABLE_COMPAT_WRAPPER_COUNT impeccable compatibility wrappers + $FULL_EXPECTED_EXPERT_PACK_COUNT expert packs + $FULL_EXPECTED_ORIENTATION_SKILL_COUNT orientation skill + $FULL_EXPECTED_LANGUAGE_COMPANION_SKILL_COUNT language companion skill), $PLANNED_ADJACENT_SKILL_COUNT planned adjacent packs are present"
  else
    printf 'FAIL Skill inventory: %s missing skill directories\n' "$missing"
  fi

  if python3 - "$ROOT_DIR/.opencode/skills" "$CAPABILITY_MATRIX_FILE" <<'PY'
import json
import sys
from pathlib import Path

skills_dir = Path(sys.argv[1])
manifest_path = Path(sys.argv[2])
core = {
    "architecture-integration", "frontend-web", "mobile-app", "backend-node", "backend-python",
    "backend-jvm", "backend-dotnet", "backend-go", "systems-rust", "systems-c-cpp",
    "functional-platform", "php-ruby-platform", "data-ml-platform", "database-engineering",
    "security-engineering", "devops-platform", "qa-validation", "impeccable", "adapt", "animate",
    "arrange", "audit", "bolder", "clarify", "colorize", "critique", "compass", "delight", "distill",
    "extract", "frontend-design", "harden", "normalize", "onboard", "optimize", "overdrive",
    "polish", "quieter", "shape", "teach-impeccable", "typeset", "service-vernacular"
}
planned = {"release-engineering", "documentation-sdk", "developer-experience"}
actual = {p.name for p in skills_dir.iterdir() if p.is_dir()}

missing_planned = sorted(planned - actual)
unexpected = sorted(actual - core - planned)

data = json.loads(manifest_path.read_text())
planned_manifest = {
    cap["id"]
    for cap in data["capabilities"]
    if cap.get("kind") == "adjacent_pack" and cap.get("support_level") == "planned"
}

if missing_planned:
    raise AssertionError(f"planned adjacent skill directories missing: {', '.join(missing_planned)}")
if unexpected:
    raise AssertionError(f"unexpected top-level skill directories: {', '.join(unexpected)}")
if planned_manifest != planned:
    raise AssertionError(
        f"planned adjacent packs in manifest differ from validator expectation: {sorted(planned_manifest)}"
    )
if len(actual) != len(core) + len(planned):
    raise AssertionError(
        f"expected {len(core) + len(planned)} total top-level skill dirs, found {len(actual)}"
    )

print("planned adjacent skill inventory checks passed")
PY
  then
    pass 'Planned adjacent skill inventory' "$PLANNED_ADJACENT_SKILL_COUNT planned adjacent packs are present and the live top-level inventory remains $LIVE_TOP_LEVEL_SKILL_COUNT directories"
  else
    fail 'Planned adjacent skill inventory' 'planned-adjacent pack presence or manifest alignment is invalid'
  fi
}


check_impeccable_v311_vendor_contract() {
  require_dir 'Impeccable consolidated skill' "$ROOT_DIR/.opencode/skills/impeccable"
  require_file 'Impeccable NOTICE' "$ROOT_DIR/.opencode/skills/impeccable/NOTICE.md"
  require_file 'Impeccable LICENSE' "$ROOT_DIR/.opencode/skills/impeccable/LICENSE"

  if python3 - "$ROOT_DIR" "$IMPECCABLE_CONSOLIDATED_SKILL_COUNT" "$IMPECCABLE_COMPAT_WRAPPER_COUNT" "$IMPECCABLE_REFERENCE_COUNT" "$IMPECCABLE_SCRIPT_COUNT" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
expected_consolidated = int(sys.argv[2])
expected_wrappers = int(sys.argv[3])
expected_references = int(sys.argv[4])
expected_scripts = int(sys.argv[5])
skills_dir = root / '.opencode/skills'
impeccable_dir = skills_dir / 'impeccable'
reference_dir = impeccable_dir / 'reference'
scripts_dir = impeccable_dir / 'scripts'

forbidden_top_level = {'layout', 'document', 'live', 'craft', 'brand', 'product', 'codex', 'pin', 'unpin'}
actual_forbidden = sorted(name for name in forbidden_top_level if (skills_dir / name).is_dir())
if actual_forbidden:
    raise AssertionError(f"forbidden top-level Impeccable skill directories present: {actual_forbidden}")

consolidated = [path.name for path in skills_dir.iterdir() if path.is_dir() and path.name == 'impeccable']
if len(consolidated) != expected_consolidated:
    raise AssertionError(f"expected {expected_consolidated} consolidated Impeccable skill, found {len(consolidated)}")

reference_files = sorted(path.name for path in reference_dir.glob('*.md') if path.name != 'design-md.md')
if len(reference_files) != expected_references:
    raise AssertionError(f"expected {expected_references} upstream reference files excluding design-md.md, found {len(reference_files)}")
if not (reference_dir / 'design-md.md').is_file():
    raise AssertionError('local-only reference/design-md.md overlay is missing')

scripts = sorted(path.name for path in scripts_dir.iterdir() if path.is_file())
if len(scripts) != expected_scripts:
    raise AssertionError(f"expected {expected_scripts} upstream script files, found {len(scripts)}")

wrapper_names = {
    'adapt', 'animate', 'arrange', 'audit', 'bolder', 'clarify', 'colorize', 'critique', 'delight', 'distill',
    'extract', 'frontend-design', 'harden', 'normalize', 'onboard', 'optimize', 'overdrive', 'polish',
    'quieter', 'shape', 'teach-impeccable', 'typeset',
}
missing_wrappers = sorted(name for name in wrapper_names if not (skills_dir / name / 'SKILL.md').is_file())
if missing_wrappers:
    raise AssertionError(f"missing Impeccable compatibility wrappers: {missing_wrappers}")
if len(wrapper_names) != expected_wrappers:
    raise AssertionError(f"validator wrapper map has {len(wrapper_names)} entries instead of {expected_wrappers}")

print('impeccable v3.1.1 vendor contract checks passed')
PY
  then
    pass 'Impeccable v3.1.1 vendor contract' 'consolidated package, upstream counts, local overlay, wrappers, and forbidden top-level routes are aligned'
  else
    fail 'Impeccable v3.1.1 vendor contract' 'consolidated package shape or local hybrid inventory is invalid'
  fi
}

check_impeccable_skill_metadata() {
  if python3 - "$ROOT_DIR/.opencode/skills/impeccable/SKILL.md" <<'PY'
from pathlib import Path
import sys

text = Path(sys.argv[1]).read_text()
required_tokens = [
    'version: 3.1.1',
    'Bash(npx impeccable *)',
    'document',
    'live',
    'layout',
    'See NOTICE.md',
]
missing = [token for token in required_tokens if token not in text]
if missing:
    raise AssertionError(f"impeccable/SKILL.md missing metadata tokens: {missing}")
print('impeccable skill metadata checks passed')
PY
  then
    pass 'Impeccable skill metadata' 'SKILL.md carries v3.1.1, runtime grant, command tokens, and attribution pointer'
  else
    fail 'Impeccable skill metadata' 'SKILL.md is missing required v3.1.1 metadata'
  fi
}

check_impeccable_command_metadata() {
  if python3 - "$ROOT_DIR/.opencode/skills/impeccable/scripts/command-metadata.json" "$IMPECCABLE_COMMAND_COUNT" <<'PY'
from pathlib import Path
import json
import sys

path = Path(sys.argv[1])
expected_count = int(sys.argv[2])
metadata = json.loads(path.read_text())
expected = {
    'adapt', 'animate', 'audit', 'bolder', 'clarify', 'colorize', 'craft', 'critique', 'delight', 'distill',
    'document', 'extract', 'harden', 'layout', 'live', 'onboard', 'optimize', 'overdrive', 'polish',
    'quieter', 'shape', 'teach', 'typeset',
}
actual = set(metadata)
if actual != expected:
    raise AssertionError(f"command metadata keys differ: missing={sorted(expected - actual)}, extra={sorted(actual - expected)}")
if len(metadata) != expected_count:
    raise AssertionError(f"expected {expected_count} command metadata entries, found {len(metadata)}")
for forbidden in ('brand', 'product', 'codex'):
    if forbidden in metadata:
        raise AssertionError(f"{forbidden} must remain a reference/context surface, not command metadata")
print('impeccable command metadata checks passed')
PY
  then
    pass 'Impeccable command metadata' "$IMPECCABLE_COMMAND_COUNT upstream command keys match the v3.1.1 contract"
  else
    fail 'Impeccable command metadata' 'command-metadata.json does not match the v3.1.1 command set'
  fi
}

check_impeccable_runtime_assets() {
  if python3 - "$ROOT_DIR/.opencode/skills/impeccable" "$IMPECCABLE_SCRIPT_COUNT" <<'PY'
from pathlib import Path
import sys

skill_dir = Path(sys.argv[1])
expected_scripts = int(sys.argv[2])
scripts_dir = skill_dir / 'scripts'
script_files = [path for path in scripts_dir.iterdir() if path.is_file()]
if len(script_files) != expected_scripts:
    raise AssertionError(f"expected {expected_scripts} script files, found {len(script_files)}")

checks = {
    'scripts/pin.mjs': ['VALID_COMMANDS', 'loadCommandMetadata', 'command-metadata.json', 'metadata[command]?.description'],
    'scripts/critique-storage.mjs': ['pathToFileURL', 'import.meta.url', 'process.argv[1]', 'IMPECCABLE_CRITIQUE_META'],
    'reference/critique.md': ['.impeccable/critique/ignore.md', 'critique-storage.mjs slug', 'critique-storage.mjs write', 'critique-storage.mjs trend'],
    'reference/polish.md': ['critique-storage.mjs latest'],
}
missing = []
for relative, tokens in checks.items():
    text = (skill_dir / relative).read_text()
    for token in tokens:
        if token not in text:
            missing.append(f'{relative}: {token}')
if missing:
    raise AssertionError(f"runtime asset tokens missing: {missing}")
print('impeccable runtime asset checks passed')
PY
  then
    pass 'Impeccable runtime assets' 'scripts and runtime helper tokens, including Windows entrypoint markers, are present'
  else
    fail 'Impeccable runtime assets' 'script count or required runtime helper tokens are missing'
  fi
}

check_impeccable_compat_wrappers() {
  if python3 - "$ROOT_DIR/.opencode/skills" "$IMPECCABLE_COMPAT_WRAPPER_COUNT" "$IMPECCABLE_COMMAND_WRAPPER_COUNT" "$IMPECCABLE_UMBRELLA_WRAPPER_COUNT" <<'PY'
from pathlib import Path
import sys

skills_dir = Path(sys.argv[1])
expected_total = int(sys.argv[2])
expected_command = int(sys.argv[3])
expected_umbrella = int(sys.argv[4])
expected = {
    'adapt': '/impeccable adapt',
    'animate': '/impeccable animate',
    'arrange': '/impeccable layout',
    'audit': '/impeccable audit',
    'bolder': '/impeccable bolder',
    'clarify': '/impeccable clarify',
    'colorize': '/impeccable colorize',
    'critique': '/impeccable critique',
    'delight': '/impeccable delight',
    'distill': '/impeccable distill',
    'extract': '/impeccable extract',
    'frontend-design': '/impeccable',
    'harden': '/impeccable harden',
    'normalize': '/impeccable polish',
    'onboard': '/impeccable onboard',
    'optimize': '/impeccable optimize',
    'overdrive': '/impeccable overdrive',
    'polish': '/impeccable polish',
    'quieter': '/impeccable quieter',
    'shape': '/impeccable shape',
    'teach-impeccable': '/impeccable teach',
    'typeset': '/impeccable typeset',
}
if len(expected) != expected_total:
    raise AssertionError(f"wrapper map has {len(expected)} entries instead of {expected_total}")
command_wrappers = [target for target in expected.values() if target != '/impeccable']
umbrella_wrappers = [target for target in expected.values() if target == '/impeccable']
if len(command_wrappers) != expected_command or len(umbrella_wrappers) != expected_umbrella:
    raise AssertionError('command/umbrella wrapper counts do not match expected split')

for wrapper, target in expected.items():
    path = skills_dir / wrapper / 'SKILL.md'
    text = path.read_text()
    required = [f'name: {wrapper}', 'local compatibility wrapper', 'not a primary route', f'Redirect to `{target}`.']
    missing = [token for token in required if token not in text]
    if missing:
        raise AssertionError(f"{wrapper} wrapper missing tokens: {missing}")
    if 'allowed-tools' in text:
        raise AssertionError(f"{wrapper} wrapper must not declare allowed-tools")
print('impeccable compatibility wrapper checks passed')
PY
  then
    pass 'Impeccable compatibility wrappers' "$IMPECCABLE_COMPAT_WRAPPER_COUNT wrappers map exactly and contain no runtime grants"
  else
    fail 'Impeccable compatibility wrappers' 'wrapper target mapping or no-runtime-grant contract is invalid'
  fi
}

check_impeccable_governance_absence() {
  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import json
import sys

root = Path(sys.argv[1])
paths = [
    root / '.opencode/reference/support-policy.md',
    root / '.opencode/reference/workflow-catalog.md',
    root / '.opencode/reference/capability-matrix.json',
    root / '.opencode/reference/routing-signals.json',
]
violations = []
for path in paths:
    text = path.read_text()
    if 'impeccable' in text.lower():
        violations.append(str(path.relative_to(root)))
    if path.suffix == '.json':
        json.loads(text)
if violations:
    raise AssertionError('Impeccable must not be promoted in governance/support files: ' + ', '.join(violations))
print('impeccable governance absence checks passed')
PY
  then
    pass 'Impeccable governance absence' 'impeccable is absent from support-policy, workflow-catalog, capability-matrix, and routing-signals'
  else
    fail 'Impeccable governance absence' 'impeccable must not appear in governance/support files or routing sidecar'
  fi
}

check_workspace_model_coherence() {
  require_file 'Workspace model' "$ROOT_DIR/.opencode/reference/workspace-model.md"

  if grep -n -F 'workspace/{project-name}-{domain}' "$ROOT_DIR/.opencode/reference/workspace-model.md" >/dev/null 2>&1; then
    pass 'Workspace model greenfield output' 'greenfield outputs are documented under workspace/{project-name}-{domain}'
  else
    fail 'Workspace model greenfield output' 'workspace/{project-name}-{domain} is not documented'
  fi

  if grep -n -F 'keep operating in their current directories' "$ROOT_DIR/.opencode/reference/workspace-model.md" >/dev/null 2>&1; then
    pass 'Workspace model existing projects' 'existing projects are documented as staying in their current directories'
  else
    fail 'Workspace model existing projects' 'existing-project handling is not documented'
  fi

  tmpfile=$(mktemp)
  if [ -z "$tmpfile" ]; then
    fail 'Workspace model runtime claim' 'could not allocate temporary file for scan'
    return
  fi
  grep -r -n -F --exclude='workspace-model.md' --exclude='validate-opencode-bundle.sh' '.opencode/oh-my-openagent.jsonc automatically routes files there' "$ROOT_DIR/.opencode" >"$tmpfile" 2>/dev/null
  status_a=$?
  grep -r -n -F --exclude='workspace-model.md' --exclude='validate-opencode-bundle.sh' 'natively implement this workspace placement rule' "$ROOT_DIR/.opencode" >>"$tmpfile" 2>/dev/null
  status_b=$?
  if [ "$status_a" -gt 1 ] || [ "$status_b" -gt 1 ]; then
    fail 'Workspace model runtime claim' 'scan error while checking workspace-model runtime-claim boundaries'
    sed 's/^/  /' "$tmpfile"
  elif [ "$status_a" -eq 0 ] || [ "$status_b" -eq 0 ]; then
    fail 'Workspace model runtime claim' 'documentation must not claim native runtime routing enforcement'
    sed 's/^/  /' "$tmpfile"
  else
    pass 'Workspace model runtime claim' 'no native runtime routing enforcement claim found'
  fi
  rm -f "$tmpfile"

  if grep -n -F 'not a claim that the runtime or `.opencode/oh-my-openagent.jsonc` automatically routes files there' "$ROOT_DIR/.opencode/reference/workspace-model.md" >/dev/null 2>&1; then
    pass 'Workspace model config boundary' 'workspace-model keeps .opencode/oh-my-openagent.jsonc in a non-routing role'
  else
    fail 'Workspace model config boundary' '.opencode/oh-my-openagent.jsonc boundary language is missing'
  fi
}

check_routing_contract() {
  require_file 'Routing matrix' "$ROUTING_MATRIX_FILE"
  require_file 'Project setup policy' "$ROOT_DIR/.opencode/reference/project-setup-policy.md"

  if grep -n -F 'From the repo root, this matrix is the sole normative local routing/helper source' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1; then
    pass 'Routing matrix authority' 'routing-matrix.md declares itself the sole normative local routing/helper source'
  else
    fail 'Routing matrix authority' 'routing-matrix.md is missing the sole normative local routing/helper source statement'
  fi

  if grep -n -F 'the authoritative local routing and helper map' "$ROOT_DIR/AGENTS.md" >/dev/null 2>&1 && \
     grep -n -F 'does not restate the full routing matrix' "$ROOT_DIR/AGENTS.md" >/dev/null 2>&1 && \
     grep -n -F 'defer the full routing logic to `.opencode/reference/routing-matrix.md`' "$ROOT_DIR/.opencode/commands/route-domain.md" >/dev/null 2>&1; then
    pass 'Routing doc thinness' 'AGENTS.md and route-domain.md stay matrix-first and do not re-own routing logic'
  else
    fail 'Routing doc thinness' 'AGENTS.md or route-domain.md is missing matrix-first defer language'
  fi

  if grep -n -F 'agent-browser' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'dev-browser' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'Use `frontend-web` as the first route for browser-3D work.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'Use `frontend-ui-ux` when the ask needs product or interaction judgment.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1; then
    pass 'Browser-helper discoverability' 'routing matrix names browser helpers and the writing/ultrabrain categories explicitly'
  else
    fail 'Browser-helper discoverability' 'routing matrix is missing one or more required helper/category references'
  fi

  if grep -n -F 'Most pack and overlay coverage listed here is current `guided` coverage.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'XR and CAD browser-3D adjacencies remain in that planned category.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'browser-3D verification or release evidence' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1; then
    pass 'Adjacent-pack tiering' 'adjacent-pack exposure is explicitly tiered and not presented as validated'
  else
    fail 'Adjacent-pack tiering' 'adjacent-pack tier wording is missing or not explicit enough'
  fi

  if grep -n -F 'web-3d' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1; then
    fail 'Top-level web-3d route' 'routing matrix must not introduce a top-level web-3d route'
  else
    pass 'Top-level web-3d route' 'no top-level web-3d route is declared'
  fi

  if grep -n -F 'Keep Impeccable supplementary only.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'The top level wrappers remain compatibility aliases for existing users.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'They do not create a primary route, a validated workflow, or a separate support tier.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1; then
    pass 'Primary impeccable route' 'impeccable remains supplementary rather than a primary route'
  else
    fail 'Primary impeccable route' 'impeccable layering is not clearly supplementary-only'
  fi

  if grep -n -F 'not a claim that the runtime or `.opencode/oh-my-openagent.jsonc` automatically routes files there' "$ROOT_DIR/.opencode/reference/workspace-model.md" >/dev/null 2>&1 && \
     grep -n -F 'not a native runtime feature' "$ROOT_DIR/.opencode/reference/workspace-model.md" >/dev/null 2>&1; then
    pass 'Workspace runtime boundary' 'workspace guidance stays documentation-only and does not claim runtime enforcement'
  else
    fail 'Workspace runtime boundary' 'workspace model is missing the documentation-only runtime boundary'
  fi

  if grep -n -F 'backend/API | Endpoint design, service refactors, auth flows, backend integrations, API hardening, server-side feature delivery | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | `quick`' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'Start in `quick` for normal service delivery.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'Escalate to `deep` when the work involves public-contract redesign, auth-model change, or multi-service boundary work.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'Treat `unspecified-low` and `unspecified-high` as fallback-only categories when no better named lane fits.' "$ROOT_DIR/.opencode/commands/route-domain.md" >/dev/null 2>&1; then
    pass 'Backend routing contract' 'backend routing uses quick for normal delivery, deep for escalation, and keeps route-domain fallback-only wording'
  else
    fail 'Backend routing contract' 'backend quick/deep routing or route-domain fallback-only wording is inconsistent'
  fi
}

check_sidecar_scaffolding() {
  if [ -f "$ROUTING_SIGNALS_FILE" ]; then
    pass 'Routing sidecar presence' "$ROUTING_SIGNALS_FILE exists"
  else
    fail 'Routing sidecar presence' "$ROUTING_SIGNALS_FILE is missing"
    return
  fi

  if python3 - "$ROUTING_SIGNALS_FILE" "$ROUTING_MATRIX_FILE" <<'PY'
import json
import re
import sys
from pathlib import Path

signals_path = Path(sys.argv[1])
matrix_path = Path(sys.argv[2])

signals = json.loads(signals_path.read_text())
matrix_lines = matrix_path.read_text().splitlines()

if signals.get('schema_version') != 'v1':
    raise AssertionError("routing-signals schema_version must be v1")

if signals.get('matrix_path') != '.opencode/reference/routing-matrix.md':
    raise AssertionError("routing-signals matrix_path must use canonical .opencode/reference/routing-matrix.md")

if not signals['matrix_path'].startswith('.opencode/'):
    raise AssertionError("routing-signals matrix_path must use canonical .opencode/... path style")

allowed_top_keys = {'schema_version', 'matrix_path', 'routes'}
unexpected_top = sorted(set(signals) - allowed_top_keys)
if unexpected_top:
    raise AssertionError(f"unexpected top-level routing-signals keys: {unexpected_top}")

routes = signals.get('routes')
if not isinstance(routes, list) or len(routes) != 6:
    raise AssertionError('routing-signals routes must contain exactly 6 entries')

allowed_route_keys = {
    'route_id', 'bucket', 'primary_pack_ids', 'default_category', 'helper_ids',
    'browser_helper_ids', 'adjacent_pack_ids', 'posture', 'source_anchor'
}
required_route_keys = {
    'route_id', 'bucket', 'primary_pack_ids', 'default_category', 'helper_ids',
    'adjacent_pack_ids', 'posture', 'source_anchor'
}
for route in routes:
    if not isinstance(route, dict):
        raise AssertionError('routing-signals routes must be objects')
    missing = sorted(required_route_keys - set(route))
    if missing:
        raise AssertionError(f"routing-signals route {route.get('route_id')} is missing required keys: {missing}")
    unexpected = sorted(set(route) - allowed_route_keys)
    if unexpected:
        raise AssertionError(f"routing-signals route {route.get('route_id')} has unexpected keys: {unexpected}")
    if 'support_level' in route or 'tier' in route or 'support' in route:
        raise AssertionError(f"routing-signals route {route.get('route_id')} must not carry support-tier-like fields")
    if not isinstance(route.get('matrix_path', '.opencode/reference/routing-matrix.md'), str):
        raise AssertionError('routing-signals route matrix path metadata is invalid')

expected_rows = {
    'architecture/integration': '#ZY',
    'web/mobile UI': '#NV',
    'backend/API': '#SJ',
    'systems/performance': '#QZ',
    'data/security': '#RQ',
    'QA/deployment': '#HJ',
}
for bucket, anchor in expected_rows.items():
    row_present = any(line.strip().startswith(f'| {bucket} |') for line in matrix_lines)
    if not row_present:
        raise AssertionError(f"routing-matrix is missing the bucket row for {bucket}")

route_bucket_to_anchor = {route['bucket']: route['source_anchor'] for route in routes}
for bucket, anchor in expected_rows.items():
    if route_bucket_to_anchor.get(bucket) != anchor:
        raise AssertionError(f"sidecar source_anchor mismatch for {bucket}: expected {anchor}, found {route_bucket_to_anchor.get(bucket)}")

for route in routes:
    posture = route['posture']
    if route['route_id'] == 'web_mobile_ui':
        if posture != 'supplementary':
            raise AssertionError('web_mobile_ui posture must be supplementary')
    elif posture != 'none':
        raise AssertionError(f"{route['route_id']} posture must be none")

    if route['adjacent_pack_ids']:
        if route['route_id'] == 'web_mobile_ui':
            raise AssertionError('web_mobile_ui must not advertise adjacent packs in the sidecar')

    for key in ('primary_pack_ids', 'helper_ids', 'adjacent_pack_ids'):
        if not isinstance(route[key], list):
            raise AssertionError(f"{route['route_id']} {key} must be a list")

print('routing sidecar contract checks passed')
PY
  then
    pass 'Routing sidecar contract' 'sidecar schema, matrix anchors, posture, and canonical path style are aligned'
  else
    fail 'Routing sidecar contract' 'sidecar schema, matrix anchors, posture, or canonical path style is invalid'
  fi
}

check_compass_posture_contract() {
  compass_file="$ROOT_DIR/.opencode/skills/compass/SKILL.md"
  require_file 'Compass skill' "$compass_file"

  if python3 - "$compass_file" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
required = [
    'not a primary route',
    'routing-matrix replacement',
    'not an implementation executor',
    'Prometheus',
    'Oracle',
    'review-work',
    'architecture-integration',
]
missing = [phrase for phrase in required if phrase not in text]
if missing:
    raise AssertionError(f"compass/SKILL.md is missing required guardrail phrases: {missing}")
print('compass skill guardrail phrase checks passed')
PY
  then
    pass 'Compass skill guardrails' 'compass/SKILL.md contains required route, executor, and replacement boundaries'
  else
    fail 'Compass skill guardrails' 'compass/SKILL.md is missing required guardrail phrases'
  fi

  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
compass_file = root / '.opencode/skills/compass/SKILL.md'
readme_file = root / 'README.md'
routing_file = root / '.opencode/reference/routing-matrix.md'
paths = [readme_file, routing_file, compass_file]
forbidden = [
    'AGI',
    'self-modification',
    'unlimited self-improvement',
    'unlimited improvement',
    'autonomous control',
]
violations = []
for path in paths:
    text = path.read_text()
    for phrase in forbidden:
        if phrase in text:
            violations.append(f'{path.relative_to(root)}: {phrase}')

memory_scopes = [(compass_file, compass_file.read_text())]
readme_lines = readme_file.read_text().splitlines()
for line_number, line in enumerate(readme_lines, start=1):
    if 'compass' in line:
        memory_scopes.append((readme_file, f'line {line_number}: {line}'))

routing_lines = routing_file.read_text().splitlines()
section = []
in_compass_section = False
for line in routing_lines:
    if line.startswith('## '):
        in_compass_section = line.strip() == '## Supplementary local orientation skill'
    if in_compass_section:
        section.append(line)
if section:
    memory_scopes.append((routing_file, '\n'.join(section)))
else:
    violations.append(f'{routing_file.relative_to(root)}: missing compass orientation section')

for path, scope in memory_scopes:
    if 'memory' in scope:
        violations.append(f'{path.relative_to(root)}: memory in compass-specific content')
if violations:
    raise AssertionError('forbidden compass framing found: ' + ', '.join(violations))
print('compass forbidden framing checks passed')
PY
  then
    pass 'Compass forbidden framing' 'compass-facing docs avoid autonomy/self-modification framing, and memory only in compass-specific content'
  else
    fail 'Compass forbidden framing' 'compass-facing docs contain forbidden autonomy/self-modification framing or compass-specific memory claims'
  fi

  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import json
import sys

root = Path(sys.argv[1])
text_paths = [
    root / '.opencode/reference/support-policy.md',
    root / '.opencode/reference/workflow-catalog.md',
]
json_paths = [
    root / '.opencode/reference/routing-signals.json',
    root / '.opencode/reference/capability-matrix.json',
]
violations = []
for path in text_paths:
    if 'compass' in path.read_text():
        violations.append(str(path.relative_to(root)))
for path in json_paths:
    text = path.read_text()
    if 'compass' in text:
        violations.append(str(path.relative_to(root)))
    json.loads(text)
if violations:
    raise AssertionError('compass must stay out of governance/support/routing sidecar files: ' + ', '.join(violations))
print('compass governance absence checks passed')
PY
  then
    pass 'Compass governance absence' 'compass is absent from support-policy, workflow-catalog, routing-signals, and capability-matrix'
  else
    fail 'Compass governance absence' 'compass must not appear in governance/support files or routing sidecar'
  fi

  if python3 - "$0" <<'PY'
from pathlib import Path
import sys

text = Path(sys.argv[1]).read_text()
planned_block = text.split('PLANNED_ADJACENT_SKILLS="', 1)[1].split('"', 1)[0]
assignments = {}
for line in text.splitlines():
    if '=' in line and not line.startswith(' '):
        name, value = line.split('=', 1)
        assignments[name] = value.strip()
if 'compass' in planned_block:
    raise AssertionError('compass must not be listed in PLANNED_ADJACENT_SKILLS')
if assignments.get('FULL_EXPECTED_EXPERT_PACK_COUNT') != '17':
    raise AssertionError('expert pack count must remain 17')
if assignments.get('FULL_EXPECTED_ORIENTATION_SKILL_COUNT') != '1':
    raise AssertionError('orientation skill count must remain 1')
print('compass inventory classification checks passed')
PY
  then
    pass 'Compass inventory classification' 'compass remains orientation-only, not planned-adjacent or an expert pack'
  else
    fail 'Compass inventory classification' 'compass inventory classification drifted'
  fi
}


check_service_vernacular_posture_contract() {
  service_file="$ROOT_DIR/.opencode/skills/service-vernacular/SKILL.md"
  service_reference_dir="$ROOT_DIR/.opencode/skills/service-vernacular/reference"
  require_file 'Service vernacular skill' "$service_file"

  if python3 - "$service_file" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
required = [
    'not a primary route',
    'not an implementation executor',
    'not a routing-matrix replacement',
    'not a support claim',
    'LANGUAGE.md',
    'DOMAIN_LANGUAGE.md',
    'Could this copy belong to any generic SaaS app?',
]
missing = [phrase for phrase in required if phrase not in text]
if missing:
    raise AssertionError(f"service-vernacular/SKILL.md is missing required guardrail phrases: {missing}")
if 'allowed-tools' in text:
    raise AssertionError('service-vernacular/SKILL.md must not declare allowed-tools')
print('service vernacular skill guardrail phrase checks passed')
PY
  then
    pass 'Service vernacular skill guardrails' 'service-vernacular/SKILL.md contains required boundaries, dossier terms, generic-SaaS gate, and no runtime grant'
  else
    fail 'Service vernacular skill guardrails' 'service-vernacular/SKILL.md is missing required guardrails or declares allowed-tools'
  fi

  require_file 'Service vernacular language dossier reference' "$service_reference_dir/language-dossier.md"
  require_file 'Service vernacular surface registers reference' "$service_reference_dir/surface-registers.md"
  require_file 'Service vernacular slop detector reference' "$service_reference_dir/slop-detector.md"
  require_file 'Service vernacular rewrite gates reference' "$service_reference_dir/rewrite-gates.md"
  require_file 'Service vernacular contract safety reference' "$service_reference_dir/contract-safety.md"
  require_file 'Service vernacular examples reference' "$service_reference_dir/examples.md"

  if python3 - "$service_reference_dir" <<'PY'
from pathlib import Path
import sys

reference_dir = Path(sys.argv[1])
checks = {
    'language-dossier.md': [
        'Dossier precedence',
        '`LANGUAGE.md` is the canonical project-local dossier',
        '`DOMAIN_LANGUAGE.md` is alternate/legacy context',
        '`LANGUAGE.md` wins',
    ],
    'surface-registers.md': [
        'Required surfaces covered: UI, docs, CLI, notifications, backend/API product-facing errors, admin/operator, onboarding, support, release notes.',
        'Keep generic standard labels when they are clearest, familiar, or accessibility-critical.',
    ],
    'contract-safety.md': [
        'Protected terms in exact form: machine-readable error codes, status codes, enum values, localization keys, log identifiers, telemetry event names, SDK-visible fields, and documented API semantics.',
        'documented API semantics stayed the same',
    ],
    'rewrite-gates.md': [
        'Gate 5: standard-label preservation',
        'Gate 6: before/after requirements',
        'Could this copy belong to any generic SaaS app?',
    ],
    'examples.md': [
        'before/after pairs',
        'Before:',
        'After:',
        'Contract-safety note:',
    ],
    'slop-detector.md': [
        'Could this copy belong to any generic SaaS app?',
        'Generic is not always slop.',
    ],
}
missing = []
for filename, phrases in checks.items():
    path = reference_dir / filename
    if not path.is_file():
        missing.append(f'{filename}: missing')
        continue
    text = path.read_text()
    for phrase in phrases:
        if phrase not in text:
            missing.append(f'{filename}: {phrase}')
if missing:
    raise AssertionError(f'service vernacular reference coverage missing: {missing}')
print('service vernacular reference coverage checks passed')
PY
  then
    pass 'Service vernacular reference coverage' 'references cover dossier precedence, required surfaces, protected fields, before/after examples, and standard-label preservation'
  else
    fail 'Service vernacular reference coverage' 'reference pack is missing required service-vernacular coverage'
  fi

  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import sys

root = Path(sys.argv[1])
readme = root / 'README.md'
routing = root / '.opencode/reference/routing-matrix.md'
checks = {
    readme: ['service-vernacular', 'supplementary language companion', 'not a primary route', 'not a support claim'],
    routing: ['service-vernacular', 'supplementary', 'not a primary route', 'not a validated support claim'],
}
missing = []
for path, phrases in checks.items():
    text = path.read_text()
    for phrase in phrases:
        if phrase not in text:
            missing.append(f'{path.relative_to(root)}: {phrase}')
if missing:
    raise AssertionError(f'service vernacular supplementary wording missing: {missing}')
print('service vernacular supplementary discoverability checks passed')
PY
  then
    pass 'Service vernacular supplementary discoverability' 'README and routing-matrix mention service-vernacular only as supplementary/non-primary'
  else
    fail 'Service vernacular supplementary discoverability' 'README or routing-matrix is missing supplementary/non-primary service-vernacular wording'
  fi

  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import json
import sys

root = Path(sys.argv[1])
text_paths = [
    root / '.opencode/reference/support-policy.md',
    root / '.opencode/reference/workflow-catalog.md',
]
json_paths = [
    root / '.opencode/reference/routing-signals.json',
    root / '.opencode/reference/capability-matrix.json',
]
violations = []
for path in text_paths:
    if 'service-vernacular' in path.read_text():
        violations.append(str(path.relative_to(root)))
for path in json_paths:
    text = path.read_text()
    if 'service-vernacular' in text:
        violations.append(str(path.relative_to(root)))
    json.loads(text)
if violations:
    raise AssertionError('service-vernacular must stay out of governance/support/routing sidecar files: ' + ', '.join(violations))
print('service vernacular governance absence checks passed')
PY
  then
    pass 'Service vernacular governance absence' 'service-vernacular is absent from support-policy, workflow-catalog, routing-signals, and capability-matrix'
  else
    fail 'Service vernacular governance absence' 'service-vernacular must not appear in governance/support files or routing sidecar'
  fi

  if python3 - "$0" <<'PY'
from pathlib import Path
import sys

text = Path(sys.argv[1]).read_text()
planned_block = text.split('PLANNED_ADJACENT_SKILLS="', 1)[1].split('"', 1)[0]
assignments = {}
for line in text.splitlines():
    if '=' in line and not line.startswith(' '):
        name, value = line.split('=', 1)
        assignments[name] = value.strip()
if 'service-vernacular' in planned_block:
    raise AssertionError('service-vernacular must not be listed in PLANNED_ADJACENT_SKILLS')
if assignments.get('FULL_EXPECTED_EXPERT_PACK_COUNT') != '17':
    raise AssertionError('expert pack count must remain 17')
if assignments.get('FULL_EXPECTED_ORIENTATION_SKILL_COUNT') != '1':
    raise AssertionError('orientation skill count must remain 1')
if assignments.get('FULL_EXPECTED_LANGUAGE_COMPANION_SKILL_COUNT') != '1':
    raise AssertionError('language companion count must remain 1')
print('service vernacular inventory classification checks passed')
PY
  then
    pass 'Service vernacular inventory classification' 'service-vernacular remains one language companion, not planned-adjacent or an expert pack'
  else
    fail 'Service vernacular inventory classification' 'service-vernacular inventory classification drifted'
  fi
}

check_harness_utilization_contract() {
  if python3 - "$ROUTING_MATRIX_FILE" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
lines = path.read_text().splitlines()

required_bucket_rows = [
    'architecture/integration | Architecture reviews, API contract design, cross-service coordination, integration strategy, boundary cleanup, ADR or option-memo authoring | `architecture-integration`; consider the planned adjacent pack `developer-experience` as a non-primary companion when contributor onboarding, local env ergonomics, workspace friction, or review/process flow is central to the integration decision | `deep`; ADR, option memo, or strategy write-up deliverable -> `writing`; ambiguous, research-heavy, option-heavy synthesis -> `ultrabrain` |',
    'backend/API | Endpoint design, service refactors, auth flows, backend integrations, API hardening, server-side feature delivery | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | `quick`; public-contract redesign, auth-model change, or multi-service boundary work -> `deep`; OpenAPI refresh, SDK snippet/reference-doc work, or upgrade-note-heavy delivery -> `writing` |',
    'QA/deployment | Test strategy, verification sweeps, release prep, deployment docs, rollback planning, infra delivery, CI or rollout work | `qa-validation`, `devops-platform`; consider the planned adjacent pack `release-engineering` as a non-primary companion when versioning, changelog/publication flow, promotion framing, or rollback communication is central | bounded validation/evidence -> `quick`; release/platform/risk-heavy -> `deep`; changelog, release-note, rollback-message, or operator-facing release guidance -> `writing` |',
]
for expected in required_bucket_rows:
    if not any(expected in line for line in lines):
        raise AssertionError(f"missing exact bucket-row guidance: {expected}")

worked_start = None
for index, line in enumerate(lines):
    if line.strip() == '## worked example routes and planned adjacent triggers':
        worked_start = index + 1
        break
if worked_start is None:
    raise AssertionError('worked-example section heading is missing')

worked_end = len(lines)
for index in range(worked_start, len(lines)):
    if lines[index].strip().startswith('## '):
        worked_end = index
        break
worked_blob = '\n'.join(lines[worked_start:worked_end])
required_worked_rows = [
    'Refresh OpenAPI docs, SDK snippets, and breaking-change release notes after a contract update | `backend/API` | The owning backend pack plus the planned adjacent pack `documentation-sdk` | `writing` |',
    'Sort out an ambiguous next-quarter auth, CI, and docs strategy before choosing an implementation lane | `architecture/integration` | `architecture-integration` first; add an adjacent pack only after the dominant follow-on surface is clearer | `ultrabrain` |',
    'Plan a rollback-safe release with changelog, publication, and public-impact notes | `QA/deployment` | `devops-platform` plus the planned adjacent pack `release-engineering` | `writing` |',
]
for expected in required_worked_rows:
    if expected not in worked_blob:
        raise AssertionError(f"missing exact worked-example row: {expected}")
print("writing/ultrabrain section checks passed")
PY
  then
    pass 'Row-level writing and ultrabrain' 'routing matrix exposes writing and ultrabrain in both bucket rows and worked examples'
  else
    fail 'Row-level writing and ultrabrain' 'routing matrix is missing writing or ultrabrain in bucket rows or worked examples'
  fi

  if python3 - "$ROUTING_MATRIX_FILE" <<'PY'
from pathlib import Path
import sys

path = Path(sys.argv[1])
text = path.read_text()
required_rows = [
    'architecture/integration | Architecture reviews, API contract design, cross-service coordination, integration strategy, boundary cleanup, ADR or option-memo authoring | `architecture-integration`; consider the planned adjacent pack `developer-experience` as a non-primary companion when contributor onboarding, local env ergonomics, workspace friction, or review/process flow is central to the integration decision |',
    'backend/API | Endpoint design, service refactors, auth flows, backend integrations, API hardening, server-side feature delivery | `backend-node`, `backend-python`, `backend-jvm`, `backend-dotnet`, `backend-go` | `quick`; public-contract redesign, auth-model change, or multi-service boundary work -> `deep`; OpenAPI refresh, SDK snippet/reference-doc work, or upgrade-note-heavy delivery -> `writing` |',
    'QA/deployment | Test strategy, verification sweeps, release prep, deployment docs, rollback planning, infra delivery, CI or rollout work | `qa-validation`, `devops-platform`; consider the planned adjacent pack `release-engineering` as a non-primary companion when versioning, changelog/publication flow, promotion framing, or rollback communication is central |',
]
for expected in required_rows:
    if expected not in text:
        raise AssertionError(f"missing planned-adjacent trigger row: {expected}")

required_posture = [
    'These packs are explicitly tiered as `planned` adjacent references.',
    'They are not primary routes and they are not present-tense support claims.',
]
text = path.read_text()
missing = [item for item in required_posture if item not in text]
if missing:
    raise AssertionError(f"missing planned-adjacent posture text: {missing}")
print("planned adjacent posture checks passed")
PY
  then
    pass 'Row-level planned-adjacent triggers' 'routing matrix keeps the planned-adjacent triggers and non-primary posture explicit'
  else
    fail 'Row-level planned-adjacent triggers' 'routing matrix is missing required planned-adjacent trigger or posture text'
  fi

  if grep -n -F 'prefer updating or modernizing an existing project in place' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'prefer refining an existing project in place' "$ROOT_DIR/.opencode/reference/project-setup-policy.md" >/dev/null 2>&1 && \
     grep -n -F 'Treat direct `create` / `init` / `new` flows as greenfield-only behavior.' "$ROOT_DIR/.opencode/reference/project-setup-policy.md" >/dev/null 2>&1; then
    pass 'Setup-policy presence' 'routing matrix and project setup policy both keep setup behavior modernization-first'
  else
    fail 'Setup-policy presence' 'project setup policy or matrix modernization-first wording is missing'
  fi

  if grep -r -n -F --include='SKILL.md' 'prefer refining an existing project in place' "$ROOT_DIR/.opencode/skills/backend-node" "$ROOT_DIR/.opencode/skills/backend-python" "$ROOT_DIR/.opencode/skills/backend-jvm" "$ROOT_DIR/.opencode/skills/backend-dotnet" "$ROOT_DIR/.opencode/skills/backend-go" "$ROOT_DIR/.opencode/skills/frontend-web" "$ROOT_DIR/.opencode/skills/mobile-app" "$ROOT_DIR/.opencode/skills/developer-experience" "$ROOT_DIR/.opencode/skills/functional-platform" "$ROOT_DIR/.opencode/skills/php-ruby-platform" "$ROOT_DIR/.opencode/skills/systems-rust" >/dev/null 2>&1 && \
     grep -r -n -F --include='SKILL.md' 'greenfield-only and explicit-request-only' "$ROOT_DIR/.opencode/skills/backend-node" "$ROOT_DIR/.opencode/skills/backend-python" "$ROOT_DIR/.opencode/skills/backend-jvm" "$ROOT_DIR/.opencode/skills/backend-dotnet" "$ROOT_DIR/.opencode/skills/backend-go" "$ROOT_DIR/.opencode/skills/functional-platform" "$ROOT_DIR/.opencode/skills/php-ruby-platform" "$ROOT_DIR/.opencode/skills/systems-rust" "$ROOT_DIR/.opencode/skills/frontend-web" "$ROOT_DIR/.opencode/skills/mobile-app" "$ROOT_DIR/.opencode/skills/developer-experience" >/dev/null 2>&1; then
    pass 'Modernization-first wording' 'named packs keep modernization-first setup wording'
  else
    fail 'Modernization-first wording' 'one or more named packs are missing modernization-first setup wording'
  fi

  if grep -r -n -E --include='*.md' --exclude='project-setup-policy.md' --exclude='validate-opencode-bundle.sh' 'Metis|Momus' "$ROOT_DIR/.opencode" >/dev/null 2>&1; then
    fail 'Local routing doc exclusions' 'Metis or Momus appear in local routing docs'
  else
    pass 'Local routing doc exclusions' 'Metis and Momus remain out of local routing docs'
  fi
}

check_future_harness_utilization_hooks() {
  # Future invariant scaffold: keep this routine non-breaking until the deeper
  # harness-utilization content lands in the bundle reference docs.
  #
  # The hooks below intentionally do not fail today. They exist so the validator
  # can later enforce row-level routing and adjacent-pack invariants once the
  # referenced content is present and stable.
  future_writing_and_ultrabrain_hooks
  future_adjacent_pack_trigger_hooks
  future_setup_policy_presence_hook
  future_local_routing_doc_exclusions_hook
  future_named_pack_wording_hook
}

future_writing_and_ultrabrain_hooks() {
  : "future hook for row-level writing / ultrabrain coverage"
}

future_adjacent_pack_trigger_hooks() {
  : "future hook for row-level planned adjacent-pack triggers"
}

future_setup_policy_presence_hook() {
  : "future hook for setup-policy presence checks"
  : "future hook for setup-policy reference presence"
}

future_local_routing_doc_exclusions_hook() {
  : "future hook for no Metis / Momus in local routing docs"
  : "future hook for excluding Metis from local routing docs"
  : "future hook for excluding Momus from local routing docs"
}

future_named_pack_wording_hook() {
  : "future hook for no scaffold-first default wording in the named packs"
  : "future hook for modernization-first wording"
  : "future hook for avoiding scaffold-first default wording"
}

check_outlier_pack_contract() {
  outlier_docs="
$ROOT_DIR/.opencode/skills/architecture-integration/SKILL.md
$ROOT_DIR/.opencode/skills/systems-c-cpp/SKILL.md
$ROOT_DIR/.opencode/skills/database-engineering/SKILL.md
$ROOT_DIR/.opencode/skills/security-engineering/SKILL.md
"
  legacy_path='../../reference/routing-matrix.md'

  for path in $outlier_docs; do
    require_file 'Outlier pack doc' "$path"
  done

  if python3 - "$legacy_path" $outlier_docs <<'PY'
from pathlib import Path
import sys

legacy_path = sys.argv[1]
doc_paths = [Path(arg) for arg in sys.argv[2:]]

for doc_path in doc_paths:
    text = doc_path.read_text()
    if '.opencode/reference/routing-matrix.md' not in text:
        raise AssertionError(f"{doc_path} must explicitly defer first-pass routing to .opencode/reference/routing-matrix.md")
    if legacy_path in text:
        raise AssertionError(f"{doc_path} must not use {legacy_path}")
    if '../reference/' in text:
        raise AssertionError(f"{doc_path} must keep same-pack overlay references local to reference/... paths")

print('outlier pack contract checks passed')
PY
  then
    pass 'Outlier pack contract' 'touched outlier packs defer to the matrix and keep same-pack overlays local'
  else
    fail 'Outlier pack contract' 'touched outlier packs drifted from matrix-first or local-overlay path style'
  fi
}


check_release_contract() {
  require_file 'Version file' "$ROOT_DIR/VERSION"
  require_file 'Changelog' "$ROOT_DIR/CHANGELOG.md"

  if python3 - "$ROOT_DIR/VERSION" "$ROOT_DIR/CHANGELOG.md" <<'PY'
from pathlib import Path
import re
import sys

version_path = Path(sys.argv[1])
changelog_path = Path(sys.argv[2])
version = version_path.read_text().strip()
changelog = changelog_path.read_text()

if not re.fullmatch(r"\d+\.\d+\.\d+", version):
    raise AssertionError(f"VERSION must be SemVer MAJOR.MINOR.PATCH, found {version!r}")
headings = re.findall(r"^## v(\d+\.\d+\.\d+) - (\d{4}-\d{2}-\d{2})$", changelog, flags=re.MULTILINE)
if not headings:
    raise AssertionError("CHANGELOG.md must contain headings like ## v0.2.0 - 2026-05-19")
malformed = [line for line in changelog.splitlines() if line.startswith("## ") and not re.fullmatch(r"## v\d+\.\d+\.\d+ - \d{4}-\d{2}-\d{2}", line)]
if malformed:
    raise AssertionError(f"malformed changelog version headings: {malformed}")
latest_version = headings[0][0]
historical_mode = "documented historical mode" in changelog.lower()
if latest_version != version and not historical_mode:
    raise AssertionError(f"latest changelog version v{latest_version} must match VERSION {version}")
print("release version checks passed")
PY
  then
    pass 'Release version contract' 'VERSION, SemVer format, latest changelog heading, and changelog/version alignment are valid'
  else
    fail 'Release version contract' 'VERSION or CHANGELOG.md release contract is invalid'
  fi
}

check_readme_governance_contract() {
  require_file 'README governance source' "$ROOT_DIR/README.md"

  if python3 - "$ROOT_DIR/README.md" <<'PY'
from pathlib import Path
import sys

readme = Path(sys.argv[1]).read_text()
required = {
    "compatibility model": ".opencode/reference/opencode-compatibility-model.md",
    "capability matrix": ".opencode/reference/capability-matrix.json",
    "support policy": ".opencode/reference/support-policy.md",
    "workflow catalog": ".opencode/reference/workflow-catalog.md",
    "workspace model": ".opencode/reference/workspace-model.md",
    "project setup policy": ".opencode/reference/project-setup-policy.md",
    "web-3D model": ".opencode/reference/web-3d-support-model.md",
    "CHANGELOG": "CHANGELOG.md",
    "VERSION": "VERSION",
    "root LICENSE": "LICENSE",
}
missing = [label for label, token in required.items() if token not in readme]
if missing:
    raise AssertionError(f"README.md missing governance references: {missing}")
print("README governance reference checks passed")
PY
  then
    pass 'README governance references' 'README links or references compatibility, support, workflow, workspace, release, and license authorities'
  else
    fail 'README governance references' 'README is missing one or more required governance references'
  fi
}

check_evidence_freshness_contract() {
  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
candidates = []
for evidence_dir in [root / ".sisyphus/evidence", root.parent / ".sisyphus/evidence"]:
    if evidence_dir.is_dir():
        candidates.extend(path for path in evidence_dir.rglob("*") if path.is_file() and path.suffix in {".md", ".txt"})

claim_re = re.compile(r"\b(current release status|current workflow status|current release|current workflow|release_status\s*[:=]\s*current|workflow_status\s*[:=]\s*current)\b", re.I)
field_res = [
    re.compile(r"\bfreshness\s*[:=]", re.I),
    re.compile(r"\bgenerated(?:_at)?\s*[:=]", re.I),
    re.compile(r"\bvalidated(?:_at)?\s*[:=]", re.I),
    re.compile(r"\bversion\s*[:=]\s*v?\d+\.\d+\.\d+\b", re.I),
]
violations = []
for path in candidates:
    text = path.read_text(errors="replace")
    if not claim_re.search(text):
        continue
    missing = [regex.pattern for regex in field_res if not regex.search(text)]
    if missing:
        violations.append(f"{path}: missing freshness metadata fields")
if violations:
    raise AssertionError("; ".join(violations))
print("evidence freshness checks passed")
PY
  then
    pass 'Evidence freshness contract' 'current-claim evidence summaries are absent or carry freshness metadata'
  else
    fail 'Evidence freshness contract' 'current release/workflow evidence summaries are missing freshness metadata'
  fi
}

check_workspace_forbidden_claims() {
  if python3 - "$ROOT_DIR" <<'PY'
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
scan_roots = [root / "README.md", root / "AGENTS.md", root / ".opencode"]
forbidden_phrases = [
    "automatically enforces workspace",
    "automatically enforces the workspace",
    "automatically routes files",
    "automatically places files",
    "runtime enforces filesystem routing",
    "runtime enforces workspace",
    "runtime routes files",
    "runtime routes work into workspace",
    "runtime places files",
    "routed by runtime",
    "enforced by runtime",
    ".opencode/oh-my-openagent.jsonc automatically routes files",
    ".opencode/oh-my-openagent.jsonc automatically places files",
    "natively implements this workspace placement rule",
    "natively implement this workspace placement rule",
]
allowed_boundary_phrases = [
    "not a claim that the runtime or `.opencode/oh-my-openagent.jsonc` automatically routes files there",
    "not a native runtime feature",
    "not about pretending the runtime enforces filesystem routing automatically",
    "do not describe opencode, the harness, or `.opencode/oh-my-openagent.jsonc` as if they natively implement this workspace placement rule",
    "does not make opencode route work or place files by itself",
    "do not describe `.opencode/oh-my-openagent.jsonc` or `.opencode/oh-my-opencode.jsonc` as native opencode config files",
    "documentation-backed bundle guidance, not as a native runtime routing feature",
]
violations = []
files = []
for item in scan_roots:
    if item.is_file():
        files.append(item)
    elif item.is_dir():
        files.extend(path for path in item.rglob("*.md") if path.name != "validate-opencode-bundle.sh")
for path in files:
    text = path.read_text(errors="replace")
    for line_number, line in enumerate(text.splitlines(), start=1):
        normalized = line.lower()
        if any(phrase in normalized for phrase in allowed_boundary_phrases):
            continue
        if any(phrase in normalized for phrase in forbidden_phrases):
            violations.append(f"{path.relative_to(root)}:{line_number}: {line.strip()}")
if violations:
    raise AssertionError("forbidden workspace runtime-enforcement claims found: " + "; ".join(violations))
print("workspace forbidden claim checks passed")
PY
  then
    pass 'Workspace forbidden claims' 'docs avoid runtime auto-enforcement claims while retaining documentation-only guidance'
  else
    fail 'Workspace forbidden claims' 'workspace docs contain forbidden runtime auto-enforcement or routing claims'
  fi
}

check_skill_surface_metadata_contract() {
  if python3 - "$ROOT_DIR/.opencode/skills" <<'PY'
from pathlib import Path
import re
import sys

skills_dir = Path(sys.argv[1])
wrappers = {
    'adapt', 'animate', 'arrange', 'audit', 'bolder', 'clarify', 'colorize', 'critique', 'delight', 'distill',
    'extract', 'frontend-design', 'harden', 'normalize', 'onboard', 'optimize', 'overdrive', 'polish',
    'quieter', 'shape', 'teach-impeccable', 'typeset',
}
planned = {'release-engineering', 'documentation-sdk', 'developer-experience'}
violations = []
for name in sorted(wrappers):
    text = (skills_dir / name / 'SKILL.md').read_text()
    required = ['surface: compatibility-wrapper', 'primary-route: "false"', 'runtime-grant: "false"']
    missing = [token for token in required if token not in text]
    if missing:
        violations.append(f"{name}: missing {missing}")
    if re.search(r"\ballowed-tools\s*:", text):
        violations.append(f"{name}: compatibility wrapper must not declare allowed-tools")
for name in sorted(planned):
    text = (skills_dir / name / 'SKILL.md').read_text()
    required = ['surface: planned-adjacent', 'primary-route: "false"', 'support-tier: planned']
    missing = [token for token in required if token not in text]
    if missing:
        violations.append(f"{name}: missing {missing}")
    forbidden_patterns = [
        r"support-tier:\s*(validated|guided)",
        r"support_level\s*[:=]\s*(validated|guided)",
        r"\bvalidated\b[^\n]{0,80}\b(current|support|supported now)\b",
        r"\b(current|supported now)\b[^\n]{0,80}\b(validated|support)\b",
    ]
    for pattern in forbidden_patterns:
        if re.search(pattern, text, flags=re.I):
            violations.append(f"{name}: planned pack claims current/validated support via {pattern}")
if violations:
    raise AssertionError('; '.join(violations))
print('skill surface metadata checks passed')
PY
  then
    pass 'Skill surface metadata' 'compatibility wrappers and planned adjacent packs carry the required non-primary metadata posture'
  else
    fail 'Skill surface metadata' 'wrapper or planned-adjacent metadata/support posture is invalid'
  fi
}

check_impeccable_command_surface_contract() {
  if python3 - "$ROOT_DIR/.opencode/skills/impeccable" <<'PY'
from pathlib import Path
import re
import sys

skill_dir = Path(sys.argv[1])
user_facing = [skill_dir / 'SKILL.md'] + sorted((skill_dir / 'reference').glob('*.md'))
pattern = re.compile(r"\bnode\s+(?:['\"])?\.opencode/skills/impeccable/scripts/", re.I)
violations = []
for path in user_facing:
    text = path.read_text(errors='replace')
    for line_number, line in enumerate(text.splitlines(), start=1):
        if pattern.search(line):
            violations.append(f"{path.relative_to(skill_dir)}:{line_number}: {line.strip()}")
if violations:
    raise AssertionError('user-facing direct node Impeccable script instructions found: ' + '; '.join(violations))
print('impeccable command-surface checks passed')
PY
  then
    pass 'Impeccable command surface' 'user-facing Impeccable docs avoid direct node script instructions'
  else
    fail 'Impeccable command surface' 'user-facing Impeccable docs contain direct node .opencode/skills/impeccable/scripts instructions'
  fi
}

check_manifest_and_public_claims() {
  require_file 'Capability manifest' "$CAPABILITY_MATRIX_FILE"
  require_file 'Workflow catalog' "$WORKFLOW_CATALOG_FILE"
  require_file 'Web 3D support model' "$WEB_3D_SUPPORT_MODEL_FILE"

  if python3 - "$ROOT_DIR" "$CAPABILITY_MATRIX_FILE" "$WORKFLOW_CATALOG_FILE" "$WEB_3D_SUPPORT_MODEL_FILE" $PUBLIC_CLAIM_DOCS <<'PY'
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
manifest_path = Path(sys.argv[2])
catalog_path = Path(sys.argv[3])
web_3d_model_path = Path(sys.argv[4])
doc_paths = [Path(arg) for arg in sys.argv[5:]]

data = json.loads(manifest_path.read_text())
catalog_text = catalog_path.read_text()
web_3d_text = web_3d_model_path.read_text()
allowed_tiers = {"validated", "guided", "planned"}
allowed_kinds = {"flagship_workflow", "expert_pack", "overlay", "adjacent_pack"}
allowed_buckets = {"architecture/integration", "web/mobile UI", "backend/API", "systems/performance", "data/security", "QA/deployment"}
expected_workflows = {
    "frontend-product-delivery": ".opencode/reference/workflows/frontend-product-delivery.md",
    "backend-service-delivery": ".opencode/reference/workflows/backend-service-delivery.md",
    "cloud-release-readiness": ".opencode/reference/workflows/cloud-release-readiness.md",
    "ai-data-product-delivery": ".opencode/reference/workflows/ai-data-product-delivery.md",
}
expected_web_3d_guided = {
    "frontend-web/browser-3d-platform": ("frontend-web", ".opencode/skills/frontend-web/reference/browser-3d-platform.md"),
    "frontend-web/threejs-react-three-fiber": ("frontend-web", ".opencode/skills/frontend-web/reference/threejs-react-three-fiber.md"),
    "frontend-web/babylon-playcanvas": ("frontend-web", ".opencode/skills/frontend-web/reference/babylon-playcanvas.md"),
    "frontend-web/shader-material-workflows": ("frontend-web", ".opencode/skills/frontend-web/reference/shader-material-workflows.md"),
    "frontend-web/gltf-asset-pipeline": ("frontend-web", ".opencode/skills/frontend-web/reference/gltf-asset-pipeline.md"),
    "systems-rust/wasm-browser-3d-performance": ("systems-rust", ".opencode/skills/systems-rust/reference/wasm-browser-3d-performance.md"),
    "qa-validation/browser-3d-validation": ("qa-validation", ".opencode/skills/qa-validation/reference/browser-3d-validation.md"),
}
expected_web_3d_planned = {
    "frontend-web/webxr": ("frontend-web", ".opencode/reference/web-3d-support-model.md"),
    "frontend-web/cad-industrial-visualization": ("frontend-web", ".opencode/reference/web-3d-support-model.md"),
}
web_3d_expected = {**expected_web_3d_guided, **expected_web_3d_planned}

if set(data.get("support_tiers", [])) != allowed_tiers:
    raise AssertionError(f"support_tiers must be exactly {sorted(allowed_tiers)}")
if data.get("workflow_catalog_path") != ".opencode/reference/workflow-catalog.md":
    raise AssertionError("workflow_catalog_path must use .opencode/reference/workflow-catalog.md")
if data.get("workflow_reference_root") != ".opencode/reference/workflows":
    raise AssertionError("workflow_reference_root must use .opencode/reference/workflows")
if data.get("workflow_doc_contract_fields") != ["Primary route", "Adjacent pack rule", "Built-in helper fit", "Support-tier boundary", "Evidence path contract"]:
    raise AssertionError("workflow_doc_contract_fields must match the proof-doc heading contract")
if data.get("public_claims", {}).get("readme_supported_now_requires") != "validated":
    raise AssertionError("readme_supported_now_requires must be validated")
if set(data.get("flagship_workflows", [])) != set(expected_workflows):
    raise AssertionError("flagship_workflows must contain exactly the four frozen workflow IDs")
if len(data.get("flagship_workflows", [])) != len(expected_workflows):
    raise AssertionError("flagship_workflows must not contain duplicate workflow IDs")

capabilities = data.get("capabilities", [])
ids = [cap.get("id") for cap in capabilities]
duplicate_ids = sorted({cap_id for cap_id in ids if ids.count(cap_id) > 1})
if duplicate_ids:
    raise AssertionError(f"duplicate capability IDs found: {duplicate_ids}")
capability_by_id = {cap["id"]: cap for cap in capabilities}
known_owner_ids = {cap["id"] for cap in capabilities if cap.get("kind") in {"expert_pack", "adjacent_pack"}}
planned_ids = {cap["id"] for cap in capabilities if cap.get("support_level") == "planned"}

for capability in capabilities:
    cap_id = capability.get("id")
    kind = capability.get("kind")
    tier = capability.get("support_level")
    bucket = capability.get("routing_bucket")
    path_value = capability.get("path")
    if kind not in allowed_kinds:
        raise AssertionError(f"unsupported capability kind for {cap_id}: {kind}")
    if tier not in allowed_tiers:
        raise AssertionError(f"unsupported support tier for {cap_id}: {tier}")
    if bucket not in allowed_buckets:
        raise AssertionError(f"unknown routing bucket for {cap_id}: {bucket}")
    if not isinstance(path_value, str) or not path_value.startswith(".opencode/") or ".." in Path(path_value).parts:
        raise AssertionError(f"capability {cap_id} must use a safe .opencode/... path")
    if not (root / path_value).is_file():
        raise AssertionError(f"capability {cap_id} path is missing: {path_value}")
    if kind == "flagship_workflow":
        if cap_id not in expected_workflows:
            raise AssertionError(f"extra validated workflow ID or flagship workflow found: {cap_id}")
        if tier != "validated":
            raise AssertionError(f"flagship workflow {cap_id} must be validated")
        if path_value != expected_workflows[cap_id]:
            raise AssertionError(f"flagship workflow {cap_id} path must match the manifest proof-contract path")
        if not path_value.startswith(".opencode/reference/workflows/"):
            raise AssertionError(f"flagship workflow {cap_id} must live under .opencode/reference/workflows/")
        if "owner" in capability:
            raise AssertionError(f"flagship workflow {cap_id} must not declare an owner")
    elif kind in {"expert_pack", "adjacent_pack"}:
        if "owner" in capability:
            raise AssertionError(f"{kind} {cap_id} must not declare an owner")
        if path_value != f".opencode/skills/{cap_id}/SKILL.md":
            raise AssertionError(f"{kind} {cap_id} must point at its top-level SKILL.md")
    elif kind == "overlay":
        owner = capability.get("owner")
        if owner not in known_owner_ids:
            raise AssertionError(f"overlay {cap_id} owner is unknown: {owner}")
        if not cap_id.startswith(owner + "/"):
            raise AssertionError(f"overlay {cap_id} must be namespaced under owner {owner}")
        if cap_id in expected_web_3d_planned:
            if path_value != ".opencode/reference/web-3d-support-model.md":
                raise AssertionError(f"planned browser-3D overlay {cap_id} must point at the support model")
        elif not path_value.startswith(f".opencode/skills/{owner}/reference/"):
            raise AssertionError(f"overlay {cap_id} must live under its owner's reference directory")

validated_ids = {cap["id"] for cap in capabilities if cap.get("support_level") == "validated"}
if validated_ids != set(expected_workflows):
    raise AssertionError("validated capability IDs must match flagship_workflows exactly")
if {cap["id"] for cap in capabilities if cap.get("kind") == "flagship_workflow"} != set(expected_workflows):
    raise AssertionError("flagship workflow capability IDs must match the frozen workflow set exactly")

catalog_ids = set(re.findall(r"^### `([^`]+)`$", catalog_text, flags=re.MULTILINE))
if catalog_ids != set(expected_workflows):
    raise AssertionError(f"catalog workflow IDs differ from manifest: {sorted(catalog_ids)}")
for workflow_id, relative_path in expected_workflows.items():
    if f"- proof contract: `{relative_path}`" not in catalog_text:
        raise AssertionError(f"workflow catalog proof-contract path mismatch for {workflow_id}")
    workflow_text = (root / relative_path).read_text()
    for field in data["workflow_doc_contract_fields"]:
        if f"## {field}" not in workflow_text:
            raise AssertionError(f"{relative_path} is missing required heading ## {field}")

for doc_path in doc_paths:
    text = doc_path.read_text()
    if doc_path.name == "routing-matrix.md":
        in_planned_adjacent_section = False
        for line in text.splitlines():
            stripped = line.strip()
            if stripped.startswith("## "):
                heading = stripped[3:].lower()
                in_planned_adjacent_section = "planned" in heading and "adjacent" in heading
            if any(planned_id in line for planned_id in planned_ids) and not in_planned_adjacent_section:
                for planned_id in planned_ids:
                    if planned_id in line:
                        raise AssertionError(f"{doc_path} references planned capability {planned_id} outside the explicitly tiered planned-adjacent section")
    else:
        for planned_id in planned_ids:
            if planned_id in text and doc_path not in {manifest_path, web_3d_model_path}:
                raise AssertionError(f"{doc_path} references planned capability {planned_id} in a public-claim document")

for cap_id, (owner, path_value) in expected_web_3d_guided.items():
    capability = capability_by_id.get(cap_id)
    if not capability:
        raise AssertionError(f"missing guided browser-3D capability {cap_id}")
    if capability.get("support_level") != "guided" or capability.get("owner") != owner or capability.get("path") != path_value:
        raise AssertionError(f"guided browser-3D capability {cap_id} has incorrect owner, tier, or path")
for cap_id, (owner, path_value) in expected_web_3d_planned.items():
    capability = capability_by_id.get(cap_id)
    if not capability:
        raise AssertionError(f"missing planned browser-3D capability {cap_id}")
    if capability.get("support_level") != "planned" or capability.get("owner") != owner or capability.get("path") != path_value:
        raise AssertionError(f"planned browser-3D capability {cap_id} has incorrect owner, tier, or path")
for cap_id in web_3d_expected:
    if capability_by_id[cap_id].get("support_level") == "validated":
        raise AssertionError(f"browser-3D capability {cap_id} must not be validated")
    if f"`{cap_id}`" not in web_3d_text:
        raise AssertionError(f"web-3d support model is missing capability ID {cap_id}")
if (root / ".opencode/skills/web-3d").exists():
    raise AssertionError(".opencode/skills/web-3d must not exist")
for phrase in [
    "no dedicated top-level `web-3d` pack",
    "WebGL2 is the safe compatibility baseline",
    "WebGPU is additive and optional",
    "React Three Fiber is treated as a Three.js-adjacent integration layer",
    "glTF support is runtime asset delivery first",
    "No browser-3D capability in this document is part of the README `supported now` surface.",
]:
    if phrase not in web_3d_text:
        raise AssertionError(f"web-3d support model is missing required phrase: {phrase}")

print("manifest, workflow, capability matrix, and browser-3D checks passed")
PY
  then
    pass 'Capability manifest contract' 'manifest, workflow proof-doc, capability matrix, and browser-3D contracts are satisfied'
  else
    fail 'Capability manifest contract' 'manifest, workflow proof-doc, capability matrix, or browser-3D contract is invalid'
  fi
}

check_full() {
  printf '%s\n' 'Mode: full'
  check_foundation

  require_file 'Routing command' "$RUNTIME_ROUTE_FILE"
  require_file 'Routing matrix' "$ROUTING_MATRIX_FILE"
  require_file 'Quality gates' "$QUALITY_GATES_FILE"
  require_file 'Design anti-slop' "$DESIGN_ANTI_SLOP_FILE"

  check_release_contract
  check_readme_governance_contract
  check_manifest_and_public_claims
  check_evidence_freshness_contract

  check_expected_skill_dirs
  check_impeccable_v311_vendor_contract
  check_impeccable_skill_metadata
  check_impeccable_command_metadata
  check_impeccable_runtime_assets
  check_impeccable_command_surface_contract
  check_impeccable_compat_wrappers
  check_skill_surface_metadata_contract
  check_impeccable_governance_absence
  check_sidecar_scaffolding
  check_compass_posture_contract
  check_service_vernacular_posture_contract
  check_outlier_pack_contract
  check_harness_utilization_contract
  check_workspace_model_coherence
  check_workspace_forbidden_claims
  check_routing_contract
  check_design_md_integration

  if [ ! -d "$ROOT_DIR/.claude" ]; then
    pass 'Legacy .claude directory' 'absent as required'
  else
    fail 'Legacy .claude directory' 'must be absent in the current bundle state'
  fi

  if [ ! -d "$ROOT_DIR/.memory" ]; then
    pass 'Legacy .memory directory' 'absent as required'
  else
    fail 'Legacy .memory directory' 'must be absent in the current bundle state'
  fi

  check_banned_strings 'Legacy reference scan (README)' "$ROOT_DIR/README.md" '\.claude/'
  check_banned_strings 'Legacy reference scan (AGENTS)' "$ROOT_DIR/AGENTS.md" '\.claude/'
  check_banned_strings 'Legacy reference scan (.opencode)' "$ROOT_DIR/.opencode" '\.claude/'
}

usage() {
  printf 'Usage: %s foundation|full\n' "$0"
}

print_header

if [ "$#" -ne 1 ]; then
  usage
  exit 2
fi

mode="$1"
case "$mode" in
  foundation)
    check_foundation
    ;;
  full)
    check_full
    ;;
  *)
    usage
    exit 2
    ;;
esac

printf '\nSummary: %s PASS, %s WARN, %s FAIL\n' "$PASS_COUNT" "$WARN_COUNT" "$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf '%s\n' 'FAIL: bundle validation did not pass.'
  if [ "$mode" = "full" ]; then
    printf '%s\n' 'Full mode expects the current released bundle state: 42 required core skill directories (1 consolidated impeccable skill + 22 impeccable compatibility wrappers + 17 expert packs + 1 orientation skill + 1 language companion skill), 3 planned adjacent packs, routing assets, QA/design references, workspace-model coherence, and no legacy runtime surfaces.'
  fi
  exit 1
fi

printf '%s\n' 'PASS: bundle validation succeeded.'
exit 0
