#!/bin/sh

set -u

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
CONFIG_FILE="$ROOT_DIR/.opencode/oh-my-openagent.jsonc"
CAPABILITY_MATRIX_FILE="$ROOT_DIR/.opencode/reference/capability-matrix.json"
RUNTIME_ROUTE_FILE="$ROOT_DIR/.opencode/commands/route-domain.md"
ROUTING_MATRIX_FILE="$ROOT_DIR/.opencode/reference/routing-matrix.md"
QUALITY_GATES_FILE="$ROOT_DIR/.opencode/reference/quality-gates.md"
DESIGN_ANTI_SLOP_FILE="$ROOT_DIR/.opencode/reference/design-anti-slop.md"
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
"

PLANNED_ADJACENT_SKILLS="
release-engineering
documentation-sdk
developer-experience
"

FULL_EXPECTED_SKILL_COUNT=40
PLANNED_ADJACENT_SKILL_COUNT=3
LIVE_TOP_LEVEL_SKILL_COUNT=43
FULL_EXPECTED_IMPECCABLE_COUNT=23
FULL_EXPECTED_EXPERT_PACK_COUNT=17

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
    grep -r -n -E --exclude='validate-opencode-bundle.sh' "$pattern" "$path" >"$tmpfile" 2>/dev/null
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
    pass 'Skill inventory' "all $FULL_EXPECTED_SKILL_COUNT required core skill directories are present ($FULL_EXPECTED_IMPECCABLE_COUNT impeccable + $FULL_EXPECTED_EXPERT_PACK_COUNT expert packs)"
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
    "arrange", "audit", "bolder", "clarify", "colorize", "critique", "delight", "distill",
    "extract", "frontend-design", "harden", "normalize", "onboard", "optimize", "overdrive",
    "polish", "quieter", "shape", "teach-impeccable", "typeset"
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

  if grep -n -F 'Keep `impeccable` supplementary only.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1 && \
     grep -n -F 'Deprecated wrappers stay included but non-primary.' "$ROUTING_MATRIX_FILE" >/dev/null 2>&1; then
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

check_manifest_and_public_claims() {
  require_file 'Capability manifest' "$CAPABILITY_MATRIX_FILE"

  if python3 - "$CAPABILITY_MATRIX_FILE" $PUBLIC_CLAIM_DOCS <<'PY'
import json
import sys
from pathlib import Path

manifest_path = Path(sys.argv[1])
doc_paths = [Path(arg) for arg in sys.argv[2:]]
path = manifest_path
data = json.loads(path.read_text())
allowed = {"validated", "guided", "planned"}
planned_ids = {cap["id"] for cap in data["capabilities"] if cap.get("support_level") == "planned"}
validated_ids = {cap["id"] for cap in data["capabilities"] if cap.get("support_level") == "validated"}

if set(data["support_tiers"]) != allowed:
    raise AssertionError(f"support_tiers must be exactly {sorted(allowed)}")
if len(data["flagship_workflows"]) != 4:
    raise AssertionError("flagship_workflows must contain exactly 4 IDs")
if data["public_claims"]["readme_supported_now_requires"] != "validated":
    raise AssertionError("readme_supported_now_requires must be validated")
if validated_ids != set(data["flagship_workflows"]):
    raise AssertionError("validated capability IDs must match flagship_workflows exactly")

for capability in data["capabilities"]:
    tier = capability.get("support_level")
    if tier not in allowed:
        raise AssertionError(f"unsupported support tier for {capability.get('id')}: {tier}")

for doc_path in doc_paths:
    text = doc_path.read_text()
    if doc_path.name == "routing-matrix.md":
        lines = text.splitlines()
        in_planned_adjacent_section = False
        for line in lines:
            stripped = line.strip()
            if stripped.startswith("## "):
                heading = stripped[3:].lower()
                in_planned_adjacent_section = "planned" in heading and "adjacent" in heading
            if any(planned_id in line for planned_id in planned_ids) and not in_planned_adjacent_section:
                for planned_id in planned_ids:
                    if planned_id in line:
                        raise AssertionError(
                            f"{doc_path} references planned capability {planned_id} outside the explicitly tiered planned-adjacent section"
                        )
    else:
        for planned_id in planned_ids:
            if planned_id in text:
                raise AssertionError(f"{doc_path} references planned capability {planned_id} in a public-claim document")

print("manifest checks passed")
PY
  then
    pass 'Capability manifest contract' 'manifest parses and frozen support-tier / workflow constraints are satisfied'
  else
    fail 'Capability manifest contract' 'manifest JSON or support-tier contract is invalid'
  fi
}

check_full() {
  printf '%s\n' 'Mode: full'
  check_foundation

  require_file 'Routing command' "$RUNTIME_ROUTE_FILE"
  require_file 'Routing matrix' "$ROUTING_MATRIX_FILE"
  require_file 'Quality gates' "$QUALITY_GATES_FILE"
  require_file 'Design anti-slop' "$DESIGN_ANTI_SLOP_FILE"

  check_manifest_and_public_claims

  check_expected_skill_dirs
  check_harness_utilization_contract
  check_workspace_model_coherence
  check_routing_contract

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
    printf '%s\n' 'Full mode expects the current released bundle state: 40 required core skill directories (23 impeccable + 17 expert packs), 3 planned adjacent packs, routing assets, QA/design references, workspace-model coherence, and no legacy runtime surfaces.'
  fi
  exit 1
fi

printf '%s\n' 'PASS: bundle validation succeeded.'
exit 0
