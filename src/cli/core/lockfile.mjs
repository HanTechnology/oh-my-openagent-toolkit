import { hashBuffer } from './hash.mjs';
import { manifestToJson } from './manifest.mjs';
import { resolveOutputPath, validatePathSet, validateRelativePath } from './paths.mjs';

export const LOCKFILE_SCHEMA_VERSION = 1;
export const LOCKFILE_RELATIVE_PATH = '.opencode/oh-my-openagent-toolkit.lock.json';

export const LOCKFILE_ERRORS = Object.freeze({
  INVALID_JSON: 'E_LOCKFILE_INVALID_JSON',
  INVALID_SHAPE: 'E_LOCKFILE_INVALID_SHAPE',
  UNSUPPORTED_SCHEMA: 'E_LOCKFILE_UNSUPPORTED_SCHEMA',
});

export class LockfileError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'LockfileError';
    this.code = code;
    this.details = details;
  }
}

export function resolveLockfilePath(targetRoot) {
  return resolveOutputPath(targetRoot, LOCKFILE_RELATIVE_PATH);
}

export function manifestSha256(manifest) {
  return hashBuffer(Buffer.from(manifestToJson(manifest), 'utf8')).sha256;
}

export function buildLockfile(options = {}) {
  const manifest = options.manifest ?? null;
  const previousLockfile = options.previousLockfile ?? null;
  const now = options.now ?? new Date().toISOString();
  const installedAt = options.installedAt ?? previousLockfile?.installedAt ?? now;
  const updatedAt = options.updatedAt ?? now;
  const toolkit = normalizeToolkit(options.toolkit ?? {}, manifest);
  const manifestRecord = {
    sha256: options.manifestSha256 ?? (manifest ? manifestSha256(manifest) : null),
  };

  if (!isSha256(manifestRecord.sha256)) {
    throw new LockfileError(LOCKFILE_ERRORS.INVALID_SHAPE, 'Lockfile manifest.sha256 must be a SHA-256 hex digest.', {
      sha256: manifestRecord.sha256,
    });
  }

  const lockfile = sortJsonValue({
    schema: LOCKFILE_SCHEMA_VERSION,
    toolkit,
    manifest: manifestRecord,
    profile: options.profile ?? previousLockfile?.profile ?? 'core',
    installedAt,
    updatedAt,
    files: normalizeFileRecords(options.files ?? []),
    agentsBlock: normalizeAgentsBlock(options.agentsBlock ?? manifest?.agentsBlock ?? null),
    overrides: normalizeOverrides(options.overrides ?? previousLockfile?.overrides ?? {}),
  });

  return validateLockfile(lockfile);
}

export function lockfileToJson(lockfile) {
  return `${JSON.stringify(sortJsonValue(validateLockfile(lockfile)), null, 2)}\n`;
}

export function parseLockfileContent(content) {
  let parsed;
  try {
    parsed = JSON.parse(String(content));
  } catch (error) {
    throw new LockfileError(LOCKFILE_ERRORS.INVALID_JSON, 'Lockfile must contain valid JSON.', {
      cause: error.message,
    });
  }
  return validateLockfile(parsed);
}

export function validateLockfile(lockfile) {
  if (!lockfile || typeof lockfile !== 'object' || Array.isArray(lockfile)) {
    throw invalidShape('Lockfile must be a JSON object.');
  }
  if (lockfile.schema !== LOCKFILE_SCHEMA_VERSION) {
    throw new LockfileError(LOCKFILE_ERRORS.UNSUPPORTED_SCHEMA, `Unsupported lockfile schema: ${lockfile.schema}`, {
      schema: lockfile.schema,
    });
  }
  validateToolkit(lockfile.toolkit);
  validateManifestRecord(lockfile.manifest);
  validateStringField(lockfile.profile, 'profile');
  validateStringField(lockfile.installedAt, 'installedAt');
  validateStringField(lockfile.updatedAt, 'updatedAt');
  validateAgentsBlock(lockfile.agentsBlock);
  validateOverrides(lockfile.overrides);
  validateFileRecords(lockfile.files);
  return lockfile;
}

export function buildLockfileFileRecord(entry, options = {}) {
  validateRelativePath(entry?.path);
  const sha256 = options.sha256 ?? entry.sha256;
  const sourceSha256 = options.sourceSha256 ?? entry.sha256;
  if (!isSha256(sha256)) throw invalidShape(`Lockfile file has invalid sha256: ${entry.path}`);
  if (!isSha256(sourceSha256)) throw invalidShape(`Lockfile file has invalid sourceSha256: ${entry.path}`);
  if (!['100644', '100755'].includes(entry.mode)) throw invalidShape(`Lockfile file has invalid mode: ${entry.path}`);

  return sortJsonValue({
    path: entry.path,
    sha256,
    sourceSha256,
    mode: entry.mode,
    strategy: entry.strategy ?? 'managed',
    profile: options.profile ?? 'core',
    installedAt: options.installedAt ?? new Date().toISOString(),
    lastAction: options.lastAction ?? 'noop',
  });
}

function normalizeToolkit(toolkit, manifest) {
  return sortJsonValue({
    version: toolkit.version ?? manifest?.toolkit?.version ?? null,
    packageVersion: toolkit.packageVersion ?? manifest?.toolkit?.packageVersion ?? manifest?.toolkit?.version ?? null,
    sourceCommit: toolkit.sourceCommit ?? manifest?.source?.gitCommit ?? null,
  });
}

function normalizeFileRecords(files) {
  if (!Array.isArray(files)) throw invalidShape('Lockfile files must be an array.');
  const records = files.map((file) => sortJsonValue({ ...file }));
  validateFileRecords(records);
  return records.sort(compareByPath);
}

function normalizeAgentsBlock(agentsBlock) {
  if (agentsBlock === null) return null;
  if (!agentsBlock || typeof agentsBlock !== 'object' || Array.isArray(agentsBlock)) {
    throw invalidShape('Lockfile agentsBlock must be an object or null.');
  }
  const normalized = sortJsonValue({ ...agentsBlock });
  validateAgentsBlock(normalized);
  return normalized;
}

function normalizeOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw invalidShape('Lockfile overrides must be an object.');
  }
  return sortJsonValue({
    skip: uniqueSortedPaths(overrides.skip ?? []),
    localOnly: uniqueSortedPaths(overrides.localOnly ?? []),
  });
}

function validateToolkit(toolkit) {
  if (!toolkit || typeof toolkit !== 'object' || Array.isArray(toolkit)) {
    throw invalidShape('Lockfile toolkit must be an object.');
  }
  validateNullableString(toolkit.version, 'toolkit.version');
  validateNullableString(toolkit.packageVersion, 'toolkit.packageVersion');
  validateNullableString(toolkit.sourceCommit, 'toolkit.sourceCommit');
}

function validateManifestRecord(manifest) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
    throw invalidShape('Lockfile manifest must be an object.');
  }
  if (!isSha256(manifest.sha256)) throw invalidShape('Lockfile manifest.sha256 must be a SHA-256 hex digest.');
}

function validateAgentsBlock(agentsBlock) {
  if (agentsBlock === null) return;
  if (!agentsBlock || typeof agentsBlock !== 'object' || Array.isArray(agentsBlock)) {
    throw invalidShape('Lockfile agentsBlock must be an object or null.');
  }
  if (!isSha256(agentsBlock.sha256)) throw invalidShape('Lockfile agentsBlock.sha256 must be a SHA-256 hex digest.');
  validateOptionalString(agentsBlock.beginMarker, 'agentsBlock.beginMarker');
  validateOptionalString(agentsBlock.endMarker, 'agentsBlock.endMarker');
}

function validateOverrides(overrides) {
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) {
    throw invalidShape('Lockfile overrides must be an object.');
  }
  uniqueSortedPaths(overrides.skip);
  uniqueSortedPaths(overrides.localOnly);
}

function validateFileRecords(files) {
  if (!Array.isArray(files)) throw invalidShape('Lockfile files must be an array.');
  validatePathSet(files.map((file) => file?.path));
  for (const file of files) validateFileRecord(file);
}

function validateFileRecord(file) {
  if (!file || typeof file !== 'object' || Array.isArray(file)) throw invalidShape('Lockfile file records must be objects.');
  validateRelativePath(file.path);
  if (!isSha256(file.sha256)) throw invalidShape(`Lockfile file has invalid sha256: ${file.path}`);
  if (!isSha256(file.sourceSha256)) throw invalidShape(`Lockfile file has invalid sourceSha256: ${file.path}`);
  if (!['100644', '100755'].includes(file.mode)) throw invalidShape(`Lockfile file has invalid mode: ${file.path}`);
  validateStringField(file.strategy, `files[${file.path}].strategy`);
  validateStringField(file.profile, `files[${file.path}].profile`);
  validateStringField(file.installedAt, `files[${file.path}].installedAt`);
  validateStringField(file.lastAction, `files[${file.path}].lastAction`);
}

function uniqueSortedPaths(paths) {
  if (!Array.isArray(paths)) throw invalidShape('Lockfile override path lists must be arrays.');
  return validatePathSet([...new Set(paths)]);
}

function validateStringField(value, field) {
  if (typeof value !== 'string' || value.length === 0) throw invalidShape(`Lockfile ${field} must be a non-empty string.`);
}

function validateNullableString(value, field) {
  if (value !== null && typeof value !== 'string') throw invalidShape(`Lockfile ${field} must be a string or null.`);
}

function validateOptionalString(value, field) {
  if (value !== undefined && typeof value !== 'string') throw invalidShape(`Lockfile ${field} must be a string when present.`);
}

function isSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function invalidShape(message, details = {}) {
  return new LockfileError(LOCKFILE_ERRORS.INVALID_SHAPE, message, details);
}

function compareByPath(left, right) {
  return left.path.localeCompare(right.path, 'en-US');
}

function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, 'en-US'))
      .map(([key, entryValue]) => [key, sortJsonValue(entryValue)])
  );
}
