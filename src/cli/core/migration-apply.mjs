import fs from 'node:fs';
import path from 'node:path';

import { inspectAgentsManagedBlock } from './agents-block.mjs';
import { LOCKFILE_RELATIVE_PATH } from './lockfile.mjs';
import { MIGRATION_ACTIONS } from './migration-plan.mjs';
import { resolveOutputPath } from './paths.mjs';

export const MIGRATION_LOCK_RELATIVE_PATH = '.opencode/.oh-my-openagent-toolkit.migrate.lock';

export function applyMigrationPlan(options = {}) {
  const targetRoot = requiredString(options.targetRoot, 'targetRoot');
  const packageRoot = requiredString(options.packageRoot, 'packageRoot');
  const plan = requiredPlan(options.plan);
  const manifest = requiredManifest(options.manifest);
  const sourcePaths = normalizeSourcePaths(options.sourcePaths);

  if (plan.blocked || plan.ok === false || hasUnsafeConflict(plan)) {
    return nonSuccess('migration.blocked', 'Migration plan is blocked; no writes were applied.');
  }

  const plannedWrites = Array.isArray(plan.plannedWrites) ? plan.plannedWrites : [];
  if (plannedWrites.length === 0) {
    return { ok: true, applied: false, status: 0, writes: [] };
  }

  const orderedWrites = orderWrites(plannedWrites);
  const lock = acquireMigrationLock(targetRoot);
  if (!lock.ok) return lock;

  try {
    const entriesByPath = new Map(manifest.files.map((entry) => [entry.path, entry]));
    const applied = [];
    for (const write of orderedWrites.payloadWrites) {
      applyPayloadWrite(targetRoot, packageRoot, write, { entriesByPath, sourcePaths });
      applied.push(write.path);
    }
    for (const write of orderedWrites.agentsWrites) {
      applyAgentsWrite(targetRoot, write);
      applied.push(write.path);
    }
    if (orderedWrites.lockfileWrite) {
      applyLockfileWrite(targetRoot, orderedWrites.lockfileWrite);
      applied.push(orderedWrites.lockfileWrite.path);
    }
    return { ok: true, applied: true, status: 0, writes: applied };
  } catch (error) {
    return nonSuccess('migration.apply-failed', error.message, { error });
  } finally {
    releaseMigrationLock(lock);
  }
}

function orderWrites(plannedWrites) {
  const payloadWrites = [];
  const agentsWrites = [];
  let lockfileWrite = null;

  for (const write of plannedWrites) {
    if (write.path === LOCKFILE_RELATIVE_PATH || write.kind === 'lockfile') {
      lockfileWrite = write;
    } else if (write.kind === 'agents' || write.path === 'AGENTS.md') {
      agentsWrites.push(write);
    } else {
      payloadWrites.push(write);
    }
  }

  return { payloadWrites, agentsWrites, lockfileWrite };
}

function applyPayloadWrite(targetRoot, packageRoot, write, { entriesByPath, sourcePaths }) {
  if (![MIGRATION_ACTIONS.REPLACE_KNOWN_STALE, MIGRATION_ACTIONS.CREATE_MISSING].includes(write.action)) {
    throw new Error(`Unsupported payload migration write action: ${write.action}`);
  }
  const entry = entriesByPath.get(write.path);
  if (!entry) throw new Error(`No manifest entry for migration payload write: ${write.path}`);
  const outputPath = resolveOutputPath(targetRoot, write.path);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const sourcePath = sourcePaths.get(write.path) ?? entry.sourcePath ?? entry.path;
  const content = write.content === undefined
    ? fs.readFileSync(path.join(packageRoot, sourcePath))
    : Buffer.from(write.content, 'utf8');
  writeFileAtomic(outputPath, content);
  if (entry.mode === '100755' || write.mode === '100755') fs.chmodSync(outputPath, 0o755);
}

function applyAgentsWrite(targetRoot, write) {
  if (![MIGRATION_ACTIONS.AGENTS_INSERT, MIGRATION_ACTIONS.AGENTS_REPLACE].includes(write.action)) {
    throw new Error(`Unsupported AGENTS migration write action: ${write.action}`);
  }
  if (typeof write.content !== 'string') throw new Error(`AGENTS migration write requires planned content: ${write.path}`);

  const agentsPath = resolveOutputPath(targetRoot, 'AGENTS.md');
  const exists = fs.existsSync(agentsPath);
  const current = exists && fs.statSync(agentsPath).isFile() ? fs.readFileSync(agentsPath, 'utf8') : '';

  if (write.action === MIGRATION_ACTIONS.AGENTS_INSERT && exists && current.length > 0 && !write.content.includes(current)) {
    throw new Error('Refusing AGENTS insert that does not preserve existing AGENTS.md content.');
  }
  if (write.action === MIGRATION_ACTIONS.AGENTS_REPLACE) {
    const inspected = inspectAgentsManagedBlock(current);
    if (inspected.state !== 'managed') throw new Error('Refusing AGENTS replacement without one existing managed block.');
    if (!write.content.startsWith(inspected.prefix) || !write.content.endsWith(inspected.suffix)) {
      throw new Error('Refusing AGENTS replacement that changes content outside the managed block.');
    }
  }

  fs.mkdirSync(path.dirname(agentsPath), { recursive: true });
  writeFileAtomic(agentsPath, Buffer.from(write.content, 'utf8'));
}

function applyLockfileWrite(targetRoot, write) {
  if (typeof write.content !== 'string') throw new Error('Migration lockfile write requires lockfile content.');
  const lockfilePath = resolveOutputPath(targetRoot, LOCKFILE_RELATIVE_PATH);
  fs.mkdirSync(path.dirname(lockfilePath), { recursive: true });
  writeFileAtomic(lockfilePath, Buffer.from(write.content, 'utf8'));
}

function acquireMigrationLock(targetRoot) {
  const lockPath = resolveOutputPath(targetRoot, MIGRATION_LOCK_RELATIVE_PATH);
  const token = `${process.pid}:${Date.now()}:${Math.random().toString(16).slice(2)}\n`;
  try {
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    const fd = fs.openSync(lockPath, 'wx');
    try {
      fs.writeFileSync(fd, token);
    } finally {
      fs.closeSync(fd);
    }
    return { ok: true, lockPath, token, owned: true };
  } catch (error) {
    if (error.code === 'EEXIST') {
      return nonSuccess('migration.concurrent-run', 'Another migration apply appears to be running.', { status: 2 });
    }
    throw error;
  }
}

function releaseMigrationLock(lock) {
  if (!lock?.owned) return;
  try {
    if (fs.existsSync(lock.lockPath) && fs.readFileSync(lock.lockPath, 'utf8') === lock.token) {
      fs.rmSync(lock.lockPath, { force: true });
    }
  } catch {
    // Best-effort cleanup only; never mask the apply result.
  }
}

export function writeFileAtomic(filePath, content) {
  const tempPath = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(tempPath, content);
    fs.renameSync(tempPath, filePath);
  } catch (error) {
    fs.rmSync(tempPath, { force: true });
    throw error;
  }
}

function hasUnsafeConflict(plan) {
  return (plan.actions ?? []).some((action) => action.action === MIGRATION_ACTIONS.UNSAFE_CONFLICT)
    || (plan.conflicts ?? []).some((action) => action.action === MIGRATION_ACTIONS.UNSAFE_CONFLICT);
}

function normalizeSourcePaths(sourcePaths) {
  if (!sourcePaths) return new Map();
  if (sourcePaths instanceof Map) return sourcePaths;
  return new Map(Object.entries(sourcePaths));
}

function requiredString(value, name) {
  if (typeof value !== 'string' || value.length === 0) throw new Error(`applyMigrationPlan requires ${name}.`);
  return value;
}

function requiredPlan(plan) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) throw new Error('applyMigrationPlan requires a migration plan.');
  return plan;
}

function requiredManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.files)) {
    throw new Error('applyMigrationPlan requires manifest.files.');
  }
  return manifest;
}

function nonSuccess(code, message, options = {}) {
  return { ok: false, applied: false, status: options.status ?? 1, code, message, error: options.error };
}
