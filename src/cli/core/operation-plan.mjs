import {
  AGENTS_BLOCK_CONFLICTS,
  buildPackagedAgentsGuideWithManagedBlock,
  inspectAgentsManagedBlock,
  loadPackagedAgentsGuide,
  planAgentsManagedBlock,
} from './agents-block.mjs';
import { hashBuffer } from './hash.mjs';
import { validateManifestFileEntry } from './manifest.mjs';
import {
  LOCKFILE_RELATIVE_PATH,
  buildLockfile,
  buildLockfileFileRecord,
  lockfileToJson,
  manifestSha256,
} from './lockfile.mjs';
import { validateRelativePath } from './paths.mjs';

export const OPERATION_ACTIONS = Object.freeze({
  AGENTS_CONFLICT: 'agents-conflict',
  AGENTS_INSERT: 'agents-insert',
  AGENTS_REPLACE: 'agents-replace',
  CONFLICT_LOCAL_MODIFICATION: 'conflict-local-modification',
  CREATE: 'create',
  DELETE_CANDIDATE: 'delete-candidate',
  LOCKFILE_WRITE: 'lockfile-write',
  NOOP: 'noop',
  REPLACE: 'replace',
  SKIP_OPT_IN: 'skip-opt-in',
  SKIP_UNMANAGED: 'skip-unmanaged',
});

export const OPERATION_PLAN_MODES = Object.freeze(['apply', 'dry-run', 'check', 'diff']);

export const OPERATION_RULES = Object.freeze({
  AGENTS_CONTENT_MISSING: 'agents.content-missing',
  AGENTS_CURRENT: 'agents.current',
  AGENTS_MISSING: 'agents.missing',
  AGENTS_MISSING_LOCKFILE_MANAGED_BLOCK: 'agents.missing-lockfile-managed-block',
  AGENTS_STALE: 'agents.stale',
  FILE_LOCAL_MODIFICATION: 'file.local-modification',
  FILE_LOCAL_ONLY: 'file.local-only',
  FILE_MISSING_LOCKFILE_INSTALLED_ASSET: 'file.missing-lockfile-installed-asset',
  FILE_SOURCE_DELETED_LOCAL_MODIFICATION: 'file.source-deleted-local-modification',
});

const AGENTS_PATH = 'AGENTS.md';

export function planOperations(options = {}) {
  const manifest = requireManifest(options.manifest);
  const mode = normalizeMode(options.mode ?? 'apply');
  const previousLockfile = options.lockfile ?? null;
  const profile = options.profile ?? previousLockfile?.profile ?? defaultProfile(manifest);
  const now = options.now ?? new Date().toISOString();
  const targetFiles = normalizeTargetFiles(options.targetFiles ?? {});
  const manifestDigest = options.manifestSha256 ?? manifestSha256(manifest);
  const actions = [];
  const conflicts = [];
  const nextFileRecords = [];
  const overrideSkip = new Set(previousLockfile?.overrides?.skip ?? []);
  const overrideLocalOnly = new Set(previousLockfile?.overrides?.localOnly ?? []);
  const oldRecordsByPath = indexLockfileFiles(previousLockfile);
  const activeManifestPaths = new Set();
  const retainedManifestPaths = new Set();

  for (const entry of sortedManifestFiles(manifest)) {
    if (isOptInEntry(entry)) {
      retainedManifestPaths.add(entry.path);
      overrideSkip.add(entry.path);
      recordAction(actions, {
        action: OPERATION_ACTIONS.SKIP_OPT_IN,
        kind: 'file',
        path: entry.path,
        profile,
        reason: 'opt-in manifest entry requires an explicit future command option',
        sourceSha256: entry.sha256,
      });
      continue;
    }

    if (!entry.profiles.includes(profile)) continue;
    activeManifestPaths.add(entry.path);
    retainedManifestPaths.add(entry.path);
    planManifestFile({
      actions,
      conflicts,
      entry,
      now,
      oldRecord: oldRecordsByPath.get(entry.path),
      overrideLocalOnly,
      previousLockfile,
      profile,
      targetFile: targetFiles.get(entry.path) ?? null,
      nextFileRecords,
    });
  }

  for (const oldRecord of sortedLockfileRecords(previousLockfile)) {
    if (retainedManifestPaths.has(oldRecord.path)) continue;
    planDeletedSourceFile({
      actions,
      conflicts,
      oldRecord,
      profile,
      targetFile: targetFiles.get(oldRecord.path) ?? null,
    });
  }

  const agentsPlan = planAgentsBlock({ manifest, options, previousLockfile, profile, targetFiles });
  if (agentsPlan) {
    recordAction(actions, agentsPlan.action, { write: agentsPlan.write });
    if (agentsPlan.conflict) conflicts.push(agentsPlan.action);
  }

  let lockfile = null;
  let lockfileContent = null;
  if (conflicts.length === 0) {
    lockfile = buildLockfile({
      agentsBlock: agentsPlan?.agentsBlock ?? previousLockfile?.agentsBlock ?? manifest.agentsBlock ?? null,
      files: nextFileRecords,
      manifest,
      manifestSha256: manifestDigest,
      now,
      overrides: {
        skip: [...overrideSkip],
        localOnly: [...overrideLocalOnly],
      },
      previousLockfile,
      profile,
      toolkit: {
        version: options.toolkit?.version ?? manifest.toolkit?.version ?? null,
        packageVersion: options.toolkit?.packageVersion ?? manifest.toolkit?.packageVersion ?? manifest.toolkit?.version ?? null,
        sourceCommit: options.toolkit?.sourceCommit ?? manifest.source?.gitCommit ?? null,
      },
    });
    lockfileContent = lockfileToJson(lockfile);
    recordAction(actions, {
      action: OPERATION_ACTIONS.LOCKFILE_WRITE,
      kind: 'lockfile',
      path: LOCKFILE_RELATIVE_PATH,
      sha256: hashBuffer(Buffer.from(lockfileContent, 'utf8')).sha256,
    }, { write: true });
  }

  const finalizedActions = finalizeActions(actions, { conflicts, mode });
  const plannedWrites = finalizedActions
    .filter((action) => action.write)
    .map((action) => plannedWriteForAction(action, { lockfileContent }));

  return {
    ok: conflicts.length === 0,
    mode,
    profile,
    actions: finalizedActions,
    conflicts,
    plannedWrites,
    writes: plannedWrites,
    lockfile,
    lockfileContent,
    lockfilePath: LOCKFILE_RELATIVE_PATH,
  };
}

function planManifestFile(context) {
  const {
    actions,
    conflicts,
    entry,
    now,
    oldRecord,
    overrideLocalOnly,
    previousLockfile,
    profile,
    targetFile,
    nextFileRecords,
  } = context;

  if (overrideLocalOnly.has(entry.path)) {
    recordAction(actions, {
      action: OPERATION_ACTIONS.SKIP_UNMANAGED,
      kind: 'file',
      path: entry.path,
      profile,
      reason: 'path is marked project-owned in lockfile overrides.localOnly',
      ruleId: OPERATION_RULES.FILE_LOCAL_ONLY,
      sourceSha256: entry.sha256,
      targetSha256: targetFile?.sha256,
    });
    return;
  }

  if (!targetFile) {
    recordManagedFile(actions, nextFileRecords, entry, {
      action: OPERATION_ACTIONS.CREATE,
      installedAt: oldRecord?.installedAt ?? now,
      profile,
      reason: 'target missing',
      write: true,
    });
    return;
  }

  if (!oldRecord) {
    if (!previousLockfile && targetFile.sha256 === entry.sha256) {
      recordConflict(actions, conflicts, {
        path: entry.path,
        profile,
        reason: 'lockfile missing but target matches manifest payload',
        ruleId: OPERATION_RULES.FILE_MISSING_LOCKFILE_INSTALLED_ASSET,
        sourceSha256: entry.sha256,
        targetSha256: targetFile.sha256,
      });
      return;
    }

    overrideLocalOnly.add(entry.path);
    recordAction(actions, {
      action: OPERATION_ACTIONS.SKIP_UNMANAGED,
      kind: 'file',
      path: entry.path,
      profile,
      reason: 'target exists without lockfile ownership',
      sourceSha256: entry.sha256,
      targetSha256: targetFile.sha256,
    });
    return;
  }

  if (targetFile.sha256 === entry.sha256) {
    recordManagedFile(actions, nextFileRecords, entry, {
      action: OPERATION_ACTIONS.NOOP,
      installedAt: oldRecord.installedAt ?? now,
      profile,
      reason: 'target already matches manifest payload',
      targetSha256: targetFile.sha256,
    });
    return;
  }

  if (oldRecord.sha256 && targetFile.sha256 === oldRecord.sha256) {
    recordManagedFile(actions, nextFileRecords, entry, {
      action: OPERATION_ACTIONS.REPLACE,
      installedAt: oldRecord.installedAt ?? now,
      previousSha256: oldRecord.sha256,
      profile,
      reason: 'target matches previous lockfile payload',
      targetSha256: targetFile.sha256,
      write: true,
    });
    return;
  }

  recordConflict(actions, conflicts, {
    path: entry.path,
    previousSha256: oldRecord.sha256 ?? null,
    profile,
    reason: 'target differs from previous lockfile and current manifest payloads',
    ruleId: OPERATION_RULES.FILE_LOCAL_MODIFICATION,
    sourceSha256: entry.sha256,
    targetSha256: targetFile.sha256,
  });
}

function planDeletedSourceFile({ actions, conflicts, oldRecord, profile, targetFile }) {
  if (!targetFile) {
    recordAction(actions, {
      action: OPERATION_ACTIONS.NOOP,
      kind: 'file',
      path: oldRecord.path,
      profile,
      reason: 'source deleted and target already missing',
      previousSha256: oldRecord.sha256 ?? null,
    });
    return;
  }

  if (oldRecord.sha256 && targetFile.sha256 === oldRecord.sha256) {
    recordAction(actions, {
      action: OPERATION_ACTIONS.DELETE_CANDIDATE,
      kind: 'file',
      path: oldRecord.path,
      profile,
      reason: 'source deleted and target matches lockfile payload',
      previousSha256: oldRecord.sha256,
      targetSha256: targetFile.sha256,
    }, { write: true });
    return;
  }

  recordConflict(actions, conflicts, {
    path: oldRecord.path,
    previousSha256: oldRecord.sha256 ?? null,
    profile,
    reason: 'source deleted but target no longer matches lockfile payload',
    ruleId: OPERATION_RULES.FILE_SOURCE_DELETED_LOCAL_MODIFICATION,
    sourceSha256: null,
    targetSha256: targetFile.sha256,
  });
}

function planAgentsBlock({ manifest, options, previousLockfile, profile, targetFiles }) {
  if (!profileUsesAgentsBlock(manifest, profile)) return null;
  const agentsSource = agentsContentFromOptions(options, targetFiles);

  if (agentsSource.missingContent) {
    return agentsConflictAction({
      reason: 'AGENTS.md content is required when AGENTS.md exists in the target snapshot',
      ruleId: OPERATION_RULES.AGENTS_CONTENT_MISSING,
      state: 'content-missing',
    });
  }

  const inspectedBlock = inspectAgentsManagedBlock(agentsSource.content);
  if (!previousLockfile && inspectedBlock.state === 'managed') {
    return agentsConflictAction({
      agentsBlock: manifest.agentsBlock ?? null,
      reason: 'lockfile missing but AGENTS.md already has a managed block',
      ruleId: OPERATION_RULES.AGENTS_MISSING_LOCKFILE_MANAGED_BLOCK,
      state: 'managed-without-lockfile',
    });
  }

  const result = planAgentsManagedBlock(agentsSource.content, {
    allowUnmarkedToolkitText: shouldAllowUnmarkedToolkitText(agentsSource, previousLockfile, options),
    lockfile: previousLockfile,
  });
  if (!result.ok) {
    return agentsConflictAction({
      agentsBlock: result.agentsBlock,
      details: result.details,
      reason: result.message,
      ruleId: result.code,
      state: result.state,
    });
  }

  if (result.action === 'insert') {
    return {
      action: {
        action: OPERATION_ACTIONS.AGENTS_INSERT,
        agentsBlock: result.agentsBlock,
        content: result.content,
        kind: 'agents',
        path: AGENTS_PATH,
        reason: agentsSource.state === 'missing-file' ? 'target AGENTS.md missing' : 'managed AGENTS block missing',
        ruleId: OPERATION_RULES.AGENTS_MISSING,
        sourceState: agentsSource.state,
        state: result.state,
      },
      agentsBlock: result.agentsBlock,
      write: true,
    };
  }

  if (result.action === 'update') {
    return {
      action: {
        action: OPERATION_ACTIONS.AGENTS_REPLACE,
        agentsBlock: result.agentsBlock,
        content: result.content,
        kind: 'agents',
        path: AGENTS_PATH,
        previousAgentsBlock: result.previousAgentsBlock,
        reason: 'managed AGENTS block stale',
        ruleId: OPERATION_RULES.AGENTS_STALE,
        sourceState: agentsSource.state,
        state: result.state,
      },
      agentsBlock: result.agentsBlock,
      write: true,
    };
  }

  return {
    action: {
      action: OPERATION_ACTIONS.NOOP,
      agentsBlock: result.agentsBlock,
      kind: 'agents',
      path: AGENTS_PATH,
      reason: 'managed AGENTS block current',
      ruleId: OPERATION_RULES.AGENTS_CURRENT,
      sourceState: agentsSource.state,
      state: result.state,
    },
    agentsBlock: result.agentsBlock,
    write: false,
  };
}

function shouldAllowUnmarkedToolkitText(agentsSource, previousLockfile, options) {
  if (agentsSource.state === 'missing-file') return true;
  if (!previousLockfile?.agentsBlock?.sha256) return false;
  return agentsSource.content === buildPackagedAgentsGuideWithManagedBlock({
    guidePath: options.agentsGuidePath,
    packageRoot: options.agentsGuidePackageRoot,
  });
}

function agentsConflictAction({ agentsBlock = null, details = {}, reason, ruleId, state }) {
  return {
    action: {
      action: OPERATION_ACTIONS.AGENTS_CONFLICT,
      agentsBlock,
      details,
      kind: 'agents',
      path: AGENTS_PATH,
      reason,
      ruleId: ruleId ?? AGENTS_BLOCK_CONFLICTS.localModification,
      state,
    },
    agentsBlock,
    conflict: true,
    write: false,
  };
}

function recordManagedFile(actions, nextFileRecords, entry, options) {
  const targetSha256 = options.action === OPERATION_ACTIONS.CREATE || options.action === OPERATION_ACTIONS.REPLACE
    ? entry.sha256
    : options.targetSha256 ?? entry.sha256;
  const action = {
    action: options.action,
    kind: 'file',
    mode: entry.mode,
    path: entry.path,
    previousSha256: options.previousSha256,
    profile: options.profile,
    reason: options.reason,
    sourceSha256: entry.sha256,
    strategy: entry.strategy,
    targetSha256,
  };
  recordAction(actions, action, { write: options.write ?? false });
  nextFileRecords.push(buildLockfileFileRecord(entry, {
    installedAt: options.installedAt,
    lastAction: options.action,
    profile: options.profile,
    sha256: entry.sha256,
    sourceSha256: entry.sha256,
  }));
}

function recordConflict(actions, conflicts, options) {
  const action = {
    action: OPERATION_ACTIONS.CONFLICT_LOCAL_MODIFICATION,
    kind: 'file',
    path: options.path,
    previousSha256: options.previousSha256,
    profile: options.profile,
    reason: options.reason,
    ruleId: options.ruleId,
    sourceSha256: options.sourceSha256,
    targetSha256: options.targetSha256,
  };
  recordAction(actions, action);
  conflicts.push(action);
}

function recordAction(actions, action, options = {}) {
  actions.push({ ...withoutUndefined(action), _write: options.write === true });
}

function finalizeActions(actions, { conflicts, mode }) {
  const canWrite = conflicts.length === 0 && mode === 'apply';
  return actions.map((action) => {
    const { _write, ...publicAction } = action;
    return { ...publicAction, write: canWrite && _write === true };
  });
}

function plannedWriteForAction(action, { lockfileContent }) {
  if (action.action === OPERATION_ACTIONS.LOCKFILE_WRITE) {
    return {
      action: action.action,
      kind: action.kind,
      path: action.path,
      content: lockfileContent,
      sha256: action.sha256,
    };
  }
  if (action.action === OPERATION_ACTIONS.DELETE_CANDIDATE) {
    return {
      action: action.action,
      kind: 'delete',
      path: action.path,
      previousSha256: action.previousSha256,
    };
  }
  if (action.kind === 'agents') {
    return {
      action: action.action,
      agentsBlock: action.agentsBlock,
      content: action.content,
      kind: action.kind,
      path: action.path,
    };
  }
  return {
    action: action.action,
    kind: action.kind,
    mode: action.mode,
    path: action.path,
    sha256: action.sourceSha256,
    sourceSha256: action.sourceSha256,
  };
}

function normalizeMode(mode) {
  if (!OPERATION_PLAN_MODES.includes(mode)) throw new Error(`Unsupported operation plan mode: ${mode}`);
  return mode;
}

function requireManifest(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new Error('Operation planner requires a manifest object.');
  if (!Array.isArray(manifest.files)) throw new Error('Operation planner requires manifest.files.');
  return manifest;
}

function sortedManifestFiles(manifest) {
  return manifest.files
    .map((entry) => validateManifestFileEntry(entry))
    .sort((left, right) => left.path.localeCompare(right.path, 'en-US'));
}

function sortedLockfileRecords(lockfile) {
  return [...(lockfile?.files ?? [])].sort((left, right) => left.path.localeCompare(right.path, 'en-US'));
}

function indexLockfileFiles(lockfile) {
  const records = new Map();
  for (const record of lockfile?.files ?? []) {
    validateRelativePath(record.path);
    records.set(record.path, record);
  }
  return records;
}

function normalizeTargetFiles(input) {
  const files = new Map();
  for (const [path, value] of targetFileEntries(input)) {
    validateRelativePath(path);
    if (value === null || value === false || value?.exists === false) continue;
    const normalized = normalizeTargetFileValue(path, value);
    files.set(path, normalized);
  }
  return files;
}

function targetFileEntries(input) {
  if (input instanceof Map) return input.entries();
  if (Array.isArray(input)) return input.map((entry) => [entry.path, entry]);
  if (input && typeof input === 'object') return Object.entries(input);
  throw new Error('targetFiles must be an object, array, or Map.');
}

function normalizeTargetFileValue(path, value) {
  const targetFile = Buffer.isBuffer(value) || typeof value === 'string'
    ? { content: value }
    : { ...value };
  if (targetFile.content !== undefined && targetFile.sha256 === undefined) {
    targetFile.sha256 = hashBuffer(toBuffer(targetFile.content)).sha256;
  }
  if (typeof targetFile.sha256 !== 'string' || !/^[a-f0-9]{64}$/.test(targetFile.sha256)) {
    throw new Error(`Target file requires a SHA-256 hex digest or content: ${path}`);
  }
  return targetFile;
}

function agentsContentFromOptions(options, targetFiles) {
  if (Object.hasOwn(options, 'agentsContent')) {
    if (options.agentsContent === null) {
      return missingAgentsSource(options);
    }
    return existingAgentsSource(String(options.agentsContent));
  }
  const targetFile = targetFiles.get(AGENTS_PATH);
  if (!targetFile) return missingAgentsSource(options);
  if (targetFile.content === undefined) return { missingContent: true };
  return existingAgentsSource(String(targetFile.content));
}

function missingAgentsSource(options) {
  return {
    content: loadPackagedAgentsGuide({
      guidePath: options.agentsGuidePath,
      packageRoot: options.agentsGuidePackageRoot,
    }),
    state: 'missing-file',
  };
}

function existingAgentsSource(content) {
  return {
    content,
    state: classifyExistingAgentsSource(content),
  };
}

function classifyExistingAgentsSource(content) {
  if (content.length === 0) return 'existing-empty';
  if (content.trim().length === 0) return 'existing-whitespace';
  return 'existing-non-empty';
}

function profileUsesAgentsBlock(manifest, profile) {
  if (manifest.profiles?.[profile]?.agentsBlock === false) return false;
  if (Array.isArray(manifest.agentsBlock?.profiles)) return manifest.agentsBlock.profiles.includes(profile);
  return profile === 'core' || profile === 'full';
}

function isOptInEntry(entry) {
  return entry.strategy === 'opt-in' || entry.profiles.includes('opt-in');
}

function defaultProfile(manifest) {
  if (manifest.profiles?.core) return 'core';
  if (manifest.profiles?.full) return 'full';
  return 'core';
}

function toBuffer(value) {
  return Buffer.isBuffer(value) ? value : Buffer.from(String(value), 'utf8');
}

function withoutUndefined(value) {
  return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined));
}
