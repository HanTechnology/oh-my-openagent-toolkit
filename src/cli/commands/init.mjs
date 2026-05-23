import fs from 'node:fs';
import path from 'node:path';

import { hashFile } from '../core/hash.mjs';
import { LOCKFILE_RELATIVE_PATH, manifestSha256, parseLockfileContent } from '../core/lockfile.mjs';
import { MANIFEST_PATH, validateManifestFileEntry } from '../core/manifest.mjs';
import { OPERATION_ACTIONS, planOperations } from '../core/operation-plan.mjs';
import { resolveOutputPath, resolvePackageRoot, resolveTargetRoot } from '../core/paths.mjs';

const VALID_PROFILES = new Set(['core', 'full']);
const ROOT_DOC_TARGETS = Object.freeze({
  'CHANGELOG.md': 'CHANGELOG.oh-my-openagent-toolkit.md',
  LICENSE: 'LICENSE.oh-my-openagent-toolkit',
  'README.md': 'README.oh-my-openagent-toolkit.md',
  VERSION: 'VERSION.oh-my-openagent-toolkit',
});
const MANAGED_ROOTS = Object.freeze(['.opencode/skills/', '.opencode/commands/', '.opencode/reference/']);
const PLACEHOLDER_MCP_TOKEN = `<<YOUR_GITHUB_${'PERSONAL_ACCESS_TOKEN'}>>`;

export async function runInitCommand(argv = [], options = {}) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;

  let flags;
  try {
    flags = parseInitFlags(argv);
  } catch (error) {
    writeLine(stderr, error.message);
    writeLine(stderr, initUsage());
    return 2;
  }

  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const targetRoot = resolveTargetRoot(argv, options.cwd ?? process.cwd());

  try {
    const baseManifest = readJson(path.join(packageRoot, MANIFEST_PATH));
    const fullManifestDigest = manifestSha256(baseManifest);
    const manifest = buildInitManifest(baseManifest, { flags, packageRoot });
    const sourcePaths = sourcePathMap(manifest);
    const targetFiles = snapshotTargetFiles(targetRoot, manifest);
    const previousLockfile = readPreviousLockfile(targetRoot);
    const plan = planOperations({
      manifest,
      mode: flags.mode,
      profile: flags.profile,
      lockfile: previousLockfile,
      targetFiles,
      manifestSha256: fullManifestDigest,
    });
    const plannedWrites = effectivePlannedWrites(plan.plannedWrites);
    const displayPlan = withEffectiveWriteFlags(plan, plannedWrites);
    const unmanagedConflicts = findUnmanagedManagedRootConflicts(targetRoot, manifest, previousLockfile);
    const applyBlocked = flags.mode === 'apply' && (unmanagedConflicts.length > 0 || hasSkipUnmanaged(plan));

    printPlan(stdout, displayPlan, { defaultedDryRun: flags.defaultedDryRun, json: flags.json, unmanagedConflicts });

    if (flags.mode === 'dry-run') return plan.ok ? 0 : 1;
    if (!plan.ok || applyBlocked) return 1;

    applyPlannedWrites(targetRoot, packageRoot, plannedWrites, { manifest, sourcePaths });
    writeLine(stdout, plannedWrites.length === 0 ? 'No changes to apply.' : 'Applied init plan.');
    return 0;
  } catch (error) {
    writeLine(stderr, `init failed: ${error.message}`);
    return 1;
  }
}

function parseInitFlags(argv) {
  const flags = {
    allowPlaceholderMcp: false,
    defaultedDryRun: false,
    json: false,
    mode: null,
    profile: 'full',
    withMcp: false,
    withRootDocs: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--dry-run') flags.mode = setMode(flags.mode, 'dry-run');
    else if (arg === '--apply') flags.mode = setMode(flags.mode, 'apply');
    else if (arg === '--with-mcp') flags.withMcp = true;
    else if (arg === '--allow-placeholder-mcp') flags.allowPlaceholderMcp = true;
    else if (arg === '--with-root-docs') flags.withRootDocs = true;
    else if (arg === '--json') flags.json = true;
    else if (arg === '--profile') {
      index += 1;
      flags.profile = requireFlagValue(argv[index], '--profile');
    } else if (arg.startsWith('--profile=')) {
      flags.profile = requireFlagValue(arg.slice('--profile='.length), '--profile');
    } else if (arg === '--target') {
      index += 1;
      requireFlagValue(argv[index], '--target');
    } else if (arg.startsWith('--target=')) {
      requireFlagValue(arg.slice('--target='.length), '--target');
    } else {
      throw new Error(`Unknown init option: ${arg}`);
    }
  }

  if (!VALID_PROFILES.has(flags.profile)) throw new Error(`Unsupported profile: ${flags.profile}`);
  if (!flags.mode) {
    flags.mode = 'dry-run';
    flags.defaultedDryRun = true;
  }
  return flags;
}

function setMode(current, next) {
  if (current && current !== next) throw new Error('--dry-run and --apply are mutually exclusive.');
  return next;
}

function requireFlagValue(value, flag) {
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value.`);
  return value;
}

function buildInitManifest(manifest, { flags, packageRoot }) {
  const files = [];
  for (const entry of manifest.files) {
    if (entry.path === '.mcp.json') {
      if (!flags.withMcp) continue;
      const content = fs.readFileSync(path.join(packageRoot, entry.path), 'utf8');
      if (!flags.allowPlaceholderMcp && content.includes(PLACEHOLDER_MCP_TOKEN)) {
        throw new Error('.mcp.json contains a placeholder token; rerun with --allow-placeholder-mcp to copy it.');
      }
      files.push(asManagedEntry(entry, { profiles: [flags.profile] }));
      continue;
    }

    if (Object.hasOwn(ROOT_DOC_TARGETS, entry.path)) {
      if (!flags.withRootDocs) continue;
      files.push(asManagedEntry(entry, { path: ROOT_DOC_TARGETS[entry.path], profiles: [flags.profile], sourcePath: entry.path }));
      continue;
    }

    files.push(entry);
  }

  return { ...manifest, files };
}

function asManagedEntry(entry, overrides = {}) {
  return validateManifestFileEntry({
    ...entry,
    path: overrides.path ?? entry.path,
    profiles: overrides.profiles ?? entry.profiles,
    strategy: 'managed',
  });
}

function sourcePathMap(manifest) {
  const map = new Map();
  for (const entry of manifest.files) {
    const original = Object.entries(ROOT_DOC_TARGETS).find(([, target]) => target === entry.path)?.[0] ?? entry.path;
    map.set(entry.path, original);
  }
  return map;
}

function snapshotTargetFiles(targetRoot, manifest) {
  const paths = new Set(['AGENTS.md', LOCKFILE_RELATIVE_PATH]);
  for (const entry of manifest.files) paths.add(entry.path);
  const lockfile = readPreviousLockfile(targetRoot);
  for (const record of lockfile?.files ?? []) paths.add(record.path);

  const targetFiles = {};
  for (const relativePath of paths) {
    const absolutePath = resolveOutputPath(targetRoot, relativePath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) continue;
    targetFiles[relativePath] = relativePath === 'AGENTS.md'
      ? { content: fs.readFileSync(absolutePath, 'utf8') }
      : hashFile(absolutePath);
  }
  return targetFiles;
}

function readPreviousLockfile(targetRoot) {
  const lockfilePath = resolveOutputPath(targetRoot, LOCKFILE_RELATIVE_PATH);
  if (!fs.existsSync(lockfilePath)) return null;
  return parseLockfileContent(fs.readFileSync(lockfilePath, 'utf8'));
}

function findUnmanagedManagedRootConflicts(targetRoot, manifest, lockfile) {
  const managedPaths = new Set(manifest.files.map((entry) => entry.path));
  for (const record of lockfile?.files ?? []) managedPaths.add(record.path);
  const conflicts = [];
  for (const relativePath of listTargetFiles(targetRoot)) {
    if (!isManagedRootPath(relativePath)) continue;
    if (managedPaths.has(relativePath)) continue;
    conflicts.push(relativePath);
  }
  return conflicts.sort();
}

function listTargetFiles(targetRoot) {
  if (!fs.existsSync(targetRoot)) return [];
  const results = [];
  walkTarget(targetRoot, targetRoot, results);
  return results;
}

function walkTarget(root, current, results) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const absolutePath = path.join(current, entry.name);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join(path.posix.sep);
    if (entry.isDirectory()) walkTarget(root, absolutePath, results);
    else if (entry.isFile()) results.push(relativePath);
  }
}

function isManagedRootPath(relativePath) {
  return MANAGED_ROOTS.some((root) => relativePath.startsWith(root));
}

function hasSkipUnmanaged(plan) {
  return plan.actions.some((action) => action.action === OPERATION_ACTIONS.SKIP_UNMANAGED && isManagedPath(action.path));
}

function isManagedPath(relativePath) {
  return relativePath === '.opencode/oh-my-openagent.jsonc' || isManagedRootPath(relativePath);
}

function printPlan(stdout, plan, { defaultedDryRun, json, unmanagedConflicts }) {
  if (json) {
    writeLine(stdout, JSON.stringify({ ...plan, defaultedDryRun, unmanagedConflicts }, null, 2));
    return;
  }
  if (defaultedDryRun) writeLine(stdout, 'No mode supplied; defaulting to dry-run. Rerun with --apply to write changes.');
  writeLine(stdout, `Init plan (${plan.mode}, profile ${plan.profile}):`);
  for (const action of plan.actions) {
    writeLine(stdout, `- ${action.action} ${action.path}${action.write ? ' [write]' : ''}`);
  }
  for (const conflictPath of unmanagedConflicts) {
    writeLine(stdout, `- unmanaged-conflict ${conflictPath}`);
  }
}

function effectivePlannedWrites(plannedWrites) {
  const writes = plannedWrites.filter((write) => write.path !== LOCKFILE_RELATIVE_PATH);
  const lockfileWrite = plannedWrites.find((write) => write.path === LOCKFILE_RELATIVE_PATH);
  return lockfileWrite && writes.length > 0 ? [...writes, lockfileWrite] : writes;
}

function withEffectiveWriteFlags(plan, plannedWrites) {
  const writePaths = new Set(plannedWrites.map((write) => write.path));
  return {
    ...plan,
    actions: plan.actions.map((action) => ({
      ...action,
      write: action.write && writePaths.has(action.path),
    })),
    plannedWrites,
    writes: plannedWrites,
  };
}

function applyPlannedWrites(targetRoot, packageRoot, plannedWrites, { manifest, sourcePaths }) {
  const entriesByPath = new Map(manifest.files.map((entry) => [entry.path, entry]));
  const lockfileWrite = plannedWrites.find((write) => write.path === LOCKFILE_RELATIVE_PATH);
  const writes = plannedWrites.filter((write) => write.path !== LOCKFILE_RELATIVE_PATH);
  for (const write of writes) applyOneWrite(targetRoot, packageRoot, write, { entriesByPath, sourcePaths });
  if (lockfileWrite) applyOneWrite(targetRoot, packageRoot, lockfileWrite, { entriesByPath, sourcePaths });
}

function applyOneWrite(targetRoot, packageRoot, write, { entriesByPath, sourcePaths }) {
  if (write.kind === 'delete') return;
  const outputPath = resolveOutputPath(targetRoot, write.path);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const content = write.content === undefined
    ? fs.readFileSync(path.join(packageRoot, sourcePaths.get(write.path) ?? write.path))
    : Buffer.from(write.content, 'utf8');
  writeFileAtomic(outputPath, content);
  const entry = entriesByPath.get(write.path);
  if (entry?.mode === '100755') fs.chmodSync(outputPath, 0o755);
}

function writeFileAtomic(filePath, content) {
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, content);
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    fs.rmSync(tempPath, { force: true });
    throw error;
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeLine(stream, message = '') {
  stream.write(`${message}\n`);
}

function initUsage() {
  return 'Usage: omo-toolkit init [--target <path>] [--profile core|full] [--dry-run|--apply] [--with-mcp] [--allow-placeholder-mcp] [--with-root-docs] [--json]';
}
