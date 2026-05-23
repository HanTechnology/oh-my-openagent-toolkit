import fs from 'node:fs';
import path from 'node:path';

import { agentsBlockSha256, inspectAgentsManagedBlock } from '../core/agents-block.mjs';
import { hashFile } from '../core/hash.mjs';
import { LOCKFILE_RELATIVE_PATH, LockfileError, manifestSha256, parseLockfileContent } from '../core/lockfile.mjs';
import { MANIFEST_PATH } from '../core/manifest.mjs';
import { resolveOutputPath, resolvePackageRoot, resolveTargetRoot } from '../core/paths.mjs';

export const VALIDATE_RULES = Object.freeze({
  LOCKFILE_MISSING: 'install.lockfile.missing',
  LOCKFILE_INVALID_JSON: 'install.lockfile.invalid-json',
  MANIFEST_MISMATCH: 'install.manifest.mismatch',
  FILE_MISSING: 'install.file.missing',
  FILE_HASH_MISMATCH: 'install.file.hash-mismatch',
  PLUGIN_TOP_LEVEL_PATHS: 'install.plugin.top-level-paths',
  AGENTS_MISSING_BLOCK: 'install.agents.missing-block',
  AGENTS_DUPLICATE_BLOCK: 'install.agents.duplicate-block',
  AGENTS_HASH_MISMATCH: 'install.agents.hash-mismatch',
  SUPPORT_FORBIDDEN_CLAIM: 'install.support.forbidden-claim',
  UNMANAGED_CONFLICT: 'install.unmanaged-conflict',
});

const RULE_ORDER = Object.freeze(Object.values(VALIDATE_RULES));
const AGENTS_PATH = 'AGENTS.md';
const PLUGIN_CONFIG_PATH = '.opencode/oh-my-openagent.jsonc';
const MANAGED_ROOTS = Object.freeze(['.opencode/skills/', '.opencode/commands/', '.opencode/reference/']);
const FORBIDDEN_SUPPORT_CLAIMS = Object.freeze([
  /validated\s+support\s+for\s+(all|every|the\s+full|45)\b/i,
  /supports\s+(all|every)\s+skills\b/i,
  /fully\s+validated\s+skill\s+surface\b/i,
]);

export async function runValidateCommand(argv = [], options = {}) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;

  let flags;
  try {
    flags = parseValidateFlags(argv);
  } catch (error) {
    writeLine(stderr, error.message);
    writeLine(stderr, validateUsage());
    return 2;
  }

  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const targetRoot = resolveTargetRoot(argv, options.cwd ?? process.cwd());

  try {
    const report = validateTarget({ packageRoot, targetRoot });
    printReport(stdout, report, { json: flags.json });
    return report.ok ? 0 : 1;
  } catch (error) {
    writeLine(stderr, `validate failed: ${error.message}`);
    return 1;
  }
}

function parseValidateFlags(argv) {
  const flags = { json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--json') flags.json = true;
    else if (arg === '--target') {
      index += 1;
      requireFlagValue(argv[index], '--target');
    } else if (arg.startsWith('--target=')) {
      requireFlagValue(arg.slice('--target='.length), '--target');
    } else {
      throw new Error(`Unknown validate option: ${arg}`);
    }
  }
  return flags;
}

function requireFlagValue(value, flag) {
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value.`);
  return value;
}

function validateTarget({ packageRoot, targetRoot }) {
  const issues = [];
  const manifest = readJson(path.join(packageRoot, MANIFEST_PATH));
  const lockfile = readTargetLockfile(targetRoot, issues);
  if (lockfile) {
    validateManifestIdentity(manifest, lockfile, issues);
    validateExpectedManagedFiles(manifest, lockfile, issues);
    validateOwnedFiles(targetRoot, lockfile, issues);
    validateAgentsBlock(targetRoot, lockfile, issues, manifest);
    validatePluginConfig(targetRoot, lockfile, issues);
    validateUnmanagedConflicts(targetRoot, lockfile, issues);
  }

  return {
    ok: issues.length === 0,
    target: targetRoot,
    rules: RULE_ORDER,
    summary: {
      failed: issues.length,
      passed: issues.length === 0,
    },
    issues,
  };
}

function readTargetLockfile(targetRoot, issues) {
  const lockfilePath = resolveOutputPath(targetRoot, LOCKFILE_RELATIVE_PATH);
  if (!fs.existsSync(lockfilePath)) {
    issues.push(issue(VALIDATE_RULES.LOCKFILE_MISSING, LOCKFILE_RELATIVE_PATH, 'Missing toolkit lockfile.'));
    return null;
  }
  try {
    return parseLockfileContent(fs.readFileSync(lockfilePath, 'utf8'));
  } catch (error) {
    const detail = error instanceof LockfileError ? error.code : error.message;
    issues.push(issue(VALIDATE_RULES.LOCKFILE_INVALID_JSON, LOCKFILE_RELATIVE_PATH, `Invalid toolkit lockfile: ${detail}`));
    return null;
  }
}

function validateManifestIdentity(manifest, lockfile, issues) {
  const expectedManifestSha256 = manifestSha256(manifest);
  if (lockfile.manifest.sha256 !== expectedManifestSha256) {
    issues.push(issue(VALIDATE_RULES.MANIFEST_MISMATCH, LOCKFILE_RELATIVE_PATH, 'Lockfile manifest.sha256 does not match this package manifest.', {
      expectedSha256: expectedManifestSha256,
      actualSha256: lockfile.manifest.sha256,
    }));
  }

  const expectedToolkit = {
    version: manifest.toolkit?.version ?? null,
    packageVersion: manifest.toolkit?.packageVersion ?? manifest.toolkit?.version ?? null,
    sourceCommit: manifest.source?.gitCommit ?? null,
  };
  for (const [field, expected] of Object.entries(expectedToolkit)) {
    if ((lockfile.toolkit?.[field] ?? null) === expected) continue;
    issues.push(issue(VALIDATE_RULES.MANIFEST_MISMATCH, LOCKFILE_RELATIVE_PATH, `Lockfile toolkit.${field} does not match this package manifest.`, {
      expected,
      actual: lockfile.toolkit?.[field] ?? null,
    }));
  }
}

function validateExpectedManagedFiles(manifest, lockfile, issues) {
  if (lockfile.profile !== 'full') return;
  const recordsByPath = new Set((lockfile.files ?? []).map((record) => record.path));
  for (const entry of expectedManagedEntries(manifest, lockfile.profile)) {
    if (recordsByPath.has(entry.path)) continue;
    issues.push(issue(VALIDATE_RULES.FILE_MISSING, entry.path, 'Expected managed manifest file is missing from the lockfile.'));
  }
}

function expectedManagedEntries(manifest, profile) {
  return (manifest.files ?? [])
    .filter((entry) => entry.strategy === 'managed' && Array.isArray(entry.profiles) && entry.profiles.includes(profile))
    .sort((left, right) => left.path.localeCompare(right.path, 'en-US'));
}

function validateOwnedFiles(targetRoot, lockfile, issues) {
  for (const record of lockfile.files ?? []) {
    const absolutePath = resolveOutputPath(targetRoot, record.path);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      issues.push(issue(VALIDATE_RULES.FILE_MISSING, record.path, 'Lock-owned file is missing.'));
      continue;
    }
    const actual = hashFile(absolutePath).sha256;
    if (actual !== record.sha256) {
      issues.push(issue(VALIDATE_RULES.FILE_HASH_MISMATCH, record.path, 'Lock-owned file hash does not match the lockfile.', {
        expectedSha256: record.sha256,
        actualSha256: actual,
      }));
    }
  }
}

function validateAgentsBlock(targetRoot, lockfile, issues, manifest) {
  if (!profileUsesAgentsBlock(manifest, lockfile.profile) && !lockfile.agentsBlock) return;
  const agentsPath = resolveOutputPath(targetRoot, AGENTS_PATH);
  if (!fs.existsSync(agentsPath) || !fs.statSync(agentsPath).isFile()) {
    issues.push(issue(VALIDATE_RULES.AGENTS_MISSING_BLOCK, AGENTS_PATH, 'AGENTS.md is missing the managed block.'));
    return;
  }
  const content = fs.readFileSync(agentsPath, 'utf8');
  const inspected = inspectAgentsManagedBlock(content);
  if (inspected.state === 'missing') {
    issues.push(issue(VALIDATE_RULES.AGENTS_MISSING_BLOCK, AGENTS_PATH, 'AGENTS.md is missing the managed block.'));
    return;
  }
  if (inspected.beginCount > 1 || inspected.endCount > 1) {
    issues.push(issue(VALIDATE_RULES.AGENTS_DUPLICATE_BLOCK, AGENTS_PATH, 'AGENTS.md contains more than one managed block.'));
    return;
  }
  if (inspected.code) {
    issues.push(issue(VALIDATE_RULES.AGENTS_MISSING_BLOCK, AGENTS_PATH, 'AGENTS.md has an incomplete managed block.'));
    return;
  }
  if (!lockfile.agentsBlock) {
    issues.push(issue(VALIDATE_RULES.AGENTS_MISSING_BLOCK, AGENTS_PATH, 'Lockfile is missing AGENTS managed block ownership.'));
    return;
  }
  const actualSha256 = agentsBlockSha256(inspected.rawBody);
  if (actualSha256 !== lockfile.agentsBlock.sha256) {
    issues.push(issue(VALIDATE_RULES.AGENTS_HASH_MISMATCH, AGENTS_PATH, 'AGENTS.md managed block hash does not match the lockfile.', {
      expectedSha256: lockfile.agentsBlock.sha256,
      actualSha256,
    }));
  }
  if (FORBIDDEN_SUPPORT_CLAIMS.some((pattern) => pattern.test(inspected.rawBody))) {
    issues.push(issue(VALIDATE_RULES.SUPPORT_FORBIDDEN_CLAIM, AGENTS_PATH, 'AGENTS.md managed block contains a broad support claim.'));
  }
}

function profileUsesAgentsBlock(manifest, profile) {
  if (manifest.profiles?.[profile]?.agentsBlock === false) return false;
  if (Array.isArray(manifest.agentsBlock?.profiles)) return manifest.agentsBlock.profiles.includes(profile);
  return profile === 'core' || profile === 'full';
}

function validatePluginConfig(targetRoot, lockfile, issues) {
  if (!ownsPath(lockfile, PLUGIN_CONFIG_PATH)) return;
  const configPath = resolveOutputPath(targetRoot, PLUGIN_CONFIG_PATH);
  if (!fs.existsSync(configPath) || !fs.statSync(configPath).isFile()) return;
  const content = fs.readFileSync(configPath, 'utf8');
  const parsed = parseJsoncObject(content);
  if (parsed && Object.hasOwn(parsed, 'paths')) {
    issues.push(issue(VALIDATE_RULES.PLUGIN_TOP_LEVEL_PATHS, PLUGIN_CONFIG_PATH, 'Plugin config must not define top-level paths.'));
  }
}

function validateUnmanagedConflicts(targetRoot, lockfile, issues) {
  const ownedPaths = new Set((lockfile.files ?? []).map((record) => record.path));
  for (const relativePath of listTargetFiles(targetRoot)) {
    if (!isManagedInstallPath(relativePath)) continue;
    if (ownedPaths.has(relativePath)) continue;
    issues.push(issue(VALIDATE_RULES.UNMANAGED_CONFLICT, relativePath, 'Managed install root contains an unmanaged file.'));
  }
}

function listTargetFiles(targetRoot) {
  if (!fs.existsSync(targetRoot)) return [];
  const results = [];
  walkTarget(targetRoot, targetRoot, results);
  return results.sort();
}

function walkTarget(root, current, results) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const absolutePath = path.join(current, entry.name);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join(path.posix.sep);
    if (entry.isDirectory()) walkTarget(root, absolutePath, results);
    else if (entry.isFile()) results.push(relativePath);
  }
}

function isManagedInstallPath(relativePath) {
  return relativePath === PLUGIN_CONFIG_PATH || MANAGED_ROOTS.some((root) => relativePath.startsWith(root));
}

function ownsPath(lockfile, relativePath) {
  return (lockfile.files ?? []).some((record) => record.path === relativePath);
}

function parseJsoncObject(content) {
  try {
    const parsed = JSON.parse(stripJsonc(String(content)));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function stripJsonc(content) {
  return content
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/,\s*([}\]])/g, '$1');
}

function issue(ruleId, relativePath, message, details = {}) {
  return { ruleId, path: relativePath, message, ...details };
}

function printReport(stdout, report, { json }) {
  if (json) {
    writeLine(stdout, JSON.stringify(report, null, 2));
    return;
  }

  writeLine(stdout, `Validate target: ${report.target}`);
  writeLine(stdout, `Rules checked: ${report.rules.join(', ')}`);
  if (report.issues.length === 0) {
    writeLine(stdout, 'PASS install validation passed.');
  } else {
    for (const currentIssue of report.issues) {
      writeLine(stdout, `FAIL ${currentIssue.ruleId} ${currentIssue.path} ${currentIssue.message}`);
    }
  }
  writeLine(stdout, `Summary: ${report.ok ? 'PASS' : 'FAIL'} (${report.summary.failed} failures)`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeLine(stream, message = '') {
  stream.write(`${message}\n`);
}

function validateUsage() {
  return 'Usage: omo-toolkit validate [--target <path>] [--json]';
}
