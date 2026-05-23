import fs from 'node:fs';
import path from 'node:path';

import { diffBuffers } from '../core/diff.mjs';
import { hashFile } from '../core/hash.mjs';
import { LOCKFILE_RELATIVE_PATH, LockfileError, manifestSha256, parseLockfileContent } from '../core/lockfile.mjs';
import { MANIFEST_PATH, validateManifestFileEntry } from '../core/manifest.mjs';
import { OPERATION_ACTIONS, planOperations } from '../core/operation-plan.mjs';
import { resolveOutputPath, resolvePackageRoot, resolveTargetRoot } from '../core/paths.mjs';

const VALID_PROFILES = new Set(['core', 'full']);
const MODE_FLAGS = new Map([
  ['--check', 'check'],
  ['--dry-run', 'dry-run'],
  ['--diff', 'diff'],
  ['--apply', 'apply'],
]);
const UPDATE_LOCK_RELATIVE_PATH = '.opencode/.oh-my-openagent-toolkit.update.lock';
const ROOT_DOC_TARGETS = Object.freeze({
  'CHANGELOG.md': 'CHANGELOG.oh-my-openagent-toolkit.md',
  LICENSE: 'LICENSE.oh-my-openagent-toolkit',
  'README.md': 'README.oh-my-openagent-toolkit.md',
  VERSION: 'VERSION.oh-my-openagent-toolkit',
});
const UPDATE_AVAILABLE_ACTIONS = new Set([
  OPERATION_ACTIONS.CREATE,
  OPERATION_ACTIONS.REPLACE,
  OPERATION_ACTIONS.DELETE_CANDIDATE,
  OPERATION_ACTIONS.AGENTS_INSERT,
  OPERATION_ACTIONS.AGENTS_REPLACE,
]);

export async function runUpdateCommand(argv = [], options = {}) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;

  let flags;
  try {
    flags = parseUpdateFlags(argv);
  } catch (error) {
    writeLine(stderr, error.message);
    writeLine(stderr, updateUsage());
    return 2;
  }

  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const targetRoot = resolveTargetRoot(argv, options.cwd ?? process.cwd());

  try {
    const baseManifest = readJson(path.join(packageRoot, MANIFEST_PATH));
    const fullManifestDigest = manifestSha256(baseManifest);
    const previousLockfile = readRequiredLockfile(targetRoot);
    const sourceIdentityStale = previousLockfile.manifest.sha256 !== fullManifestDigest;
    const profile = flags.profile ?? previousLockfile.profile;
    const manifest = buildUpdateManifest(baseManifest, { lockfile: previousLockfile, profile });
    const sourcePaths = sourcePathMap(manifest);
    const targetFiles = snapshotTargetFiles(targetRoot, manifest, previousLockfile);
    const plan = planOperations({
      manifest,
      mode: flags.mode,
      profile,
      lockfile: previousLockfile,
      targetFiles,
      manifestSha256: fullManifestDigest,
    });
    const effectivePlan = withEffectiveWriteFlags(plan, effectivePlannedWrites(plan.plannedWrites, { sourceIdentityStale }));
    const displayPlan = withProfileChange(effectivePlan, previousLockfile.profile, profile);

    if (flags.mode === 'diff') {
      printPlan(stdout, displayPlan, { json: flags.json, sourceIdentityStale });
      if (effectivePlan.ok) printDiff(stdout, targetRoot, packageRoot, effectivePlan, manifest, sourcePaths);
    } else {
      printPlan(stdout, displayPlan, { json: flags.json, sourceIdentityStale });
    }

    if (!effectivePlan.ok) return 2;
    if (flags.mode === 'check') return hasUpdates(effectivePlan, previousLockfile.profile, profile, { sourceIdentityStale }) ? 1 : 0;
    if (flags.mode === 'dry-run' || flags.mode === 'diff') return 0;

    return applyUpdate(targetRoot, packageRoot, effectivePlan, manifest, sourcePaths, stdout);
  } catch (error) {
    if (isInvalidStateError(error)) {
      writeLine(stderr, `update invalid-state: ${error.code ?? 'update.invalid-state'} ${error.message}`);
      return 2;
    }
    writeLine(stderr, `update failed: ${error.message}`);
    return 1;
  }
}

function parseUpdateFlags(argv) {
  const flags = { json: false, mode: null, profile: null };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (MODE_FLAGS.has(arg)) flags.mode = setMode(flags.mode, MODE_FLAGS.get(arg));
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
      throw new Error(`Unknown update option: ${arg}`);
    }
  }

  if (flags.profile !== null && !VALID_PROFILES.has(flags.profile)) throw new Error(`Unsupported profile: ${flags.profile}`);
  flags.mode ??= 'check';
  return flags;
}

function setMode(current, next) {
  if (current && current !== next) throw new Error('--check, --dry-run, --diff, and --apply are mutually exclusive.');
  return next;
}

function requireFlagValue(value, flag) {
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value.`);
  return value;
}

function readRequiredLockfile(targetRoot) {
  const lockfilePath = resolveOutputPath(targetRoot, LOCKFILE_RELATIVE_PATH);
  if (!fs.existsSync(lockfilePath)) {
    const error = new Error(`Missing lockfile at ${LOCKFILE_RELATIVE_PATH}. Run init before update.`);
    error.code = 'update.missing-lockfile';
    throw error;
  }
  return parseLockfileContent(fs.readFileSync(lockfilePath, 'utf8'));
}


function buildUpdateManifest(manifest, { lockfile, profile }) {
  const lockPaths = new Set((lockfile.files ?? []).map((record) => record.path));
  const files = [];
  for (const entry of manifest.files) {
    if (entry.path === '.mcp.json') {
      files.push(lockPaths.has(entry.path) ? asManagedEntry(entry, { profiles: [profile] }) : entry);
      continue;
    }

    if (Object.hasOwn(ROOT_DOC_TARGETS, entry.path)) {
      const targetPath = ROOT_DOC_TARGETS[entry.path];
      files.push(lockPaths.has(targetPath) ? asManagedEntry(entry, { path: targetPath, profiles: [profile] }) : entry);
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

function snapshotTargetFiles(targetRoot, manifest, lockfile) {
  const paths = new Set(['AGENTS.md', LOCKFILE_RELATIVE_PATH]);
  for (const entry of manifest.files) paths.add(entry.path);
  for (const record of lockfile.files ?? []) paths.add(record.path);
  for (const relativePath of lockfile.overrides?.localOnly ?? []) paths.add(relativePath);

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


function effectivePlannedWrites(plannedWrites, { sourceIdentityStale = false } = {}) {
  const writes = plannedWrites.filter((write) => write.path !== LOCKFILE_RELATIVE_PATH);
  const lockfileWrite = plannedWrites.find((write) => write.path === LOCKFILE_RELATIVE_PATH);
  return lockfileWrite && (writes.length > 0 || sourceIdentityStale) ? [...writes, lockfileWrite] : writes;
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

function withProfileChange(plan, previousProfile, profile) {
  if (previousProfile === profile) return plan;
  const profileAction = {
    action: 'profile-change',
    kind: 'profile',
    path: '<profile>',
    from: previousProfile,
    to: profile,
    reason: 'requested profile differs from lockfile profile',
    write: false,
  };
  return { ...plan, actions: [profileAction, ...plan.actions] };
}

function hasUpdates(plan, previousProfile, profile, { sourceIdentityStale = false } = {}) {
  return sourceIdentityStale || previousProfile !== profile || plan.actions.some((action) => UPDATE_AVAILABLE_ACTIONS.has(action.action));
}

function printPlan(stdout, plan, { json, sourceIdentityStale = false }) {
  if (json) {
    writeLine(stdout, JSON.stringify(plan, null, 2));
    return;
  }

  writeLine(stdout, `Update plan (${plan.mode}, profile ${plan.profile}):`);
  for (const action of plan.actions) {
    if (action.action === 'profile-change') {
      writeLine(stdout, `- profile-change ${action.from} -> ${action.to}`);
      continue;
    }
    const rule = action.ruleId ? ` ${action.ruleId}` : '';
    writeLine(stdout, `- ${action.action} ${action.path}${action.write ? ' [write]' : ''}${rule}`);
  }
  if (!hasUpdates(plan, plan.profile, plan.profile, { sourceIdentityStale }) && plan.actions.every((action) => action.action !== 'profile-change')) {
    writeLine(stdout, 'No changes to apply.');
  }
}

function printDiff(stdout, targetRoot, packageRoot, plan, manifest, sourcePaths) {
  const entriesByPath = new Map(manifest.files.map((entry) => [entry.path, entry]));
  const writes = plan.actions.filter((action) => UPDATE_AVAILABLE_ACTIONS.has(action.action));
  for (const action of writes) {
    const before = readTargetBuffer(targetRoot, action.path);
    const after = afterBufferForAction(packageRoot, action, { entriesByPath, sourcePaths });
    writeLine(stdout, `diff ${action.path}`);
    stdout.write(diffBuffers(before, after, { from: `${action.path} (current)`, to: `${action.path} (desired)` }));
  }
}

function readTargetBuffer(targetRoot, relativePath) {
  const absolutePath = resolveOutputPath(targetRoot, relativePath);
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile() ? fs.readFileSync(absolutePath) : Buffer.alloc(0);
}

function afterBufferForAction(packageRoot, action, { entriesByPath, sourcePaths }) {
  if (action.action === OPERATION_ACTIONS.DELETE_CANDIDATE) return Buffer.alloc(0);
  if (action.kind === 'agents') return Buffer.from(action.content ?? '', 'utf8');
  const entry = entriesByPath.get(action.path);
  if (!entry) throw new Error(`No manifest entry for planned update: ${action.path}`);
  return fs.readFileSync(path.join(packageRoot, sourcePaths.get(action.path) ?? entry.path));
}

function applyUpdate(targetRoot, packageRoot, plan, manifest, sourcePaths, stdout) {
  if (plan.plannedWrites.length === 0) {
    writeLine(stdout, 'No changes to apply.');
    return 0;
  }

  const updateLockPath = resolveOutputPath(targetRoot, UPDATE_LOCK_RELATIVE_PATH);
  try {
    fs.mkdirSync(path.dirname(updateLockPath), { recursive: true });
    const fd = fs.openSync(updateLockPath, 'wx');
    fs.writeFileSync(fd, `${process.pid}\n`);
    fs.closeSync(fd);
  } catch (error) {
    if (error.code === 'EEXIST') {
      writeLine(stdout, `- update-conflict ${UPDATE_LOCK_RELATIVE_PATH} update.concurrent-run`);
      return 2;
    }
    throw error;
  }

  try {
    applyPlannedWrites(targetRoot, packageRoot, plan.plannedWrites, { manifest, sourcePaths });
    writeLine(stdout, 'Applied update plan.');
    return 0;
  } finally {
    fs.rmSync(updateLockPath, { force: true });
  }
}

function applyPlannedWrites(targetRoot, packageRoot, plannedWrites, { manifest, sourcePaths }) {
  const entriesByPath = new Map(manifest.files.map((entry) => [entry.path, entry]));
  const lockfileWrite = plannedWrites.find((write) => write.path === LOCKFILE_RELATIVE_PATH);
  const writes = plannedWrites.filter((write) => write.path !== LOCKFILE_RELATIVE_PATH);
  for (const write of writes) applyOneWrite(targetRoot, packageRoot, write, { entriesByPath, sourcePaths });
  if (lockfileWrite) applyOneWrite(targetRoot, packageRoot, lockfileWrite, { entriesByPath, sourcePaths });
}

function applyOneWrite(targetRoot, packageRoot, write, { entriesByPath, sourcePaths }) {
  const outputPath = resolveOutputPath(targetRoot, write.path);
  if (write.kind === 'delete') {
    fs.rmSync(outputPath, { force: true });
    return;
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const entry = entriesByPath.get(write.path);
  const content = write.content === undefined
    ? fs.readFileSync(path.join(packageRoot, sourcePaths.get(write.path) ?? entry.path))
    : Buffer.from(write.content, 'utf8');
  writeFileAtomic(outputPath, content);
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

function updateUsage() {
  return 'Usage: omo-toolkit update [--target <path>] [--check|--dry-run|--diff|--apply] [--profile core|full] [--json]';
}

function isInvalidStateError(error) {
  return error instanceof LockfileError || String(error.code ?? '').startsWith('update.');
}
