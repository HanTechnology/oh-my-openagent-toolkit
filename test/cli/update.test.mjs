import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { LOCKFILE_RELATIVE_PATH, manifestSha256 } from '../../src/cli/core/lockfile.mjs';
import { runCli } from '../../src/cli/main.mjs';
import { createTempTargetFromFixture } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const BIN = path.join(PACKAGE_ROOT, 'bin', 'omo-toolkit.mjs');
const UPDATE_LOCK_RELATIVE_PATH = '.opencode/.oh-my-openagent-toolkit.update.lock';
const UPDATE_FILE = '.opencode/commands/route-domain.md';
const EXECUTABLE_FILE = '.opencode/reference/validate-opencode-bundle.sh';
const ROOT_DOC_TARGET = 'README.oh-my-openagent-toolkit.md';
const ROOT_DOC_SOURCE = 'README.md';
const MCP_PATH = '.mcp.json';
const OLD_ROOT_DOC_CONTENT = '# Old Toolkit README\n\nold root doc body\n';
const OLD_MCP_CONTENT = '{\n  \"mcpServers\": {}\n}\n';
const OLD_CONTENT = '# Old Route Domain\n\nold command body\n';

test('bare update behaves like check and exits zero when current', () => {
  const temp = installedTarget();
  try {
    const result = runBin(['update', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Update plan \(check, profile full\):/);
    assert.match(result.stdout, /No changes to apply\./);
  } finally {
    temp.cleanup();
  }
});

test('update mode flags are mutually exclusive usage errors without stack traces', async () => {
  const output = await captureRunCli(['update', '--check', '--dry-run', '--target', PACKAGE_ROOT]);
  assert.equal(output.code, 2);
  assert.match(output.stderr, /mutually exclusive/);
  assert.match(output.stderr, /Usage: omo-toolkit update/);
  assert.doesNotMatch(output.stderr, /Error:/);
});

test('update check detects outdated managed files and dry-run writes nothing', () => {
  const temp = installedOutdatedTarget();
  try {
    const before = snapshotTarget(temp.target);
    const check = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(check.status, 1, check.stderr);
    assert.match(check.stdout, /replace \.opencode\/commands\/route-domain\.md/);
    assert.deepEqual(snapshotTarget(temp.target), before);

    const dryRun = runBin(['update', '--dry-run', '--target', temp.target]);
    assert.equal(dryRun.status, 0, dryRun.stderr);
    assert.match(dryRun.stdout, /Update plan \(dry-run, profile full\):/);
    assert.doesNotMatch(dryRun.stdout, /\[write\]/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('update diff prints unified diffs and writes nothing', () => {
  const temp = installedOutdatedTarget();
  try {
    const before = snapshotTarget(temp.target);
    const result = runBin(['update', '--diff', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /diff \.opencode\/commands\/route-domain\.md/);
    assert.match(result.stdout, /--- \.opencode\/commands\/route-domain\.md \(current\)/);
    assert.match(result.stdout, /\+\+\+ \.opencode\/commands\/route-domain\.md \(desired\)/);
    assert.match(result.stdout, /-old command body/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('update apply writes managed payload then lockfile and removes update lock', () => {
  const temp = installedOutdatedTarget();
  try {
    const desired = fs.readFileSync(path.join(PACKAGE_ROOT, UPDATE_FILE), 'utf8');
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /replace \.opencode\/commands\/route-domain\.md \[write\]/);
    assert.match(result.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
    assert.match(result.stdout, /Applied update plan\./);
    assert.equal(fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8'), desired);
    assert.equal(fs.existsSync(path.join(temp.target, UPDATE_LOCK_RELATIVE_PATH)), false);
    const lockfile = JSON.parse(fs.readFileSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH), 'utf8'));
    assert.equal(lockfile.files.find((record) => record.path === UPDATE_FILE).sha256, sha256(desired));
  } finally {
    temp.cleanup();
  }
});

test('update check and dry-run report locally deleted managed files without writing', () => {
  const temp = installedTarget();
  try {
    fs.rmSync(path.join(temp.target, UPDATE_FILE));
    const before = snapshotTarget(temp.target);

    const check = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(check.status, 1, check.stderr);
    assert.match(check.stdout, /create \.opencode\/commands\/route-domain\.md/);
    assert.deepEqual(snapshotTarget(temp.target), before);

    const dryRun = runBin(['update', '--dry-run', '--target', temp.target]);
    assert.equal(dryRun.status, 0, dryRun.stderr);
    assert.match(dryRun.stdout, /create \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(dryRun.stdout, /\[write\]/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('update apply restores locally deleted executable files with executable mode', () => {
  const temp = installedTarget();
  try {
    const executablePath = path.join(temp.target, EXECUTABLE_FILE);
    fs.rmSync(executablePath);

    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /create \.opencode\/reference\/validate-opencode-bundle\.sh \[write\]/);
    assert.equal(fs.existsSync(executablePath), true);
    assert.equal((fs.statSync(executablePath).mode & 0o111) !== 0, true);
  } finally {
    temp.cleanup();
  }
});


test('update apply on a current target does not write a lockfile-only no-op', () => {
  const temp = installedTarget();
  try {
    const lockfilePath = path.join(temp.target, LOCKFILE_RELATIVE_PATH);
    const beforeLockfile = fs.readFileSync(lockfilePath, 'utf8');
    const beforeMtimeNs = fs.statSync(lockfilePath, { bigint: true }).mtimeNs;
    const before = snapshotTarget(temp.target);
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /No changes to apply\./);
    assert.doesNotMatch(result.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
    assert.equal(fs.readFileSync(lockfilePath, 'utf8'), beforeLockfile);
    assert.equal(fs.statSync(lockfilePath, { bigint: true }).mtimeNs, beforeMtimeNs);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});


test('update preserves current lock-owned opt-in root docs', () => {
  const temp = installedTarget(['--with-root-docs']);
  try {
    const before = snapshotTarget(temp.target);
    const result = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /noop README\.oh-my-openagent-toolkit\.md/);
    assert.doesNotMatch(result.stdout, /delete-candidate .*oh-my-openagent-toolkit/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('update preserves current lock-owned MCP config', () => {
  const temp = installedTarget(['--with-mcp', '--allow-placeholder-mcp']);
  try {
    const before = snapshotTarget(temp.target);
    const result = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /noop \.mcp\.json/);
    assert.doesNotMatch(result.stdout, /skip-opt-in \.mcp\.json/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('update replaces unchanged outdated lock-owned opt-in root docs from package source', () => {
  const temp = installedOutdatedOptInTarget({ initArgs: ['--with-root-docs'], targetPath: ROOT_DOC_TARGET, oldContent: OLD_ROOT_DOC_CONTENT });
  try {
    const desired = fs.readFileSync(path.join(PACKAGE_ROOT, ROOT_DOC_SOURCE), 'utf8');
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /replace README\.oh-my-openagent-toolkit\.md \[write\]/);
    assert.equal(fs.readFileSync(path.join(temp.target, ROOT_DOC_TARGET), 'utf8'), desired);
  } finally {
    temp.cleanup();
  }
});

test('update replaces unchanged outdated lock-owned MCP config from package source', () => {
  const temp = installedOutdatedOptInTarget({ initArgs: ['--with-mcp', '--allow-placeholder-mcp'], targetPath: MCP_PATH, oldContent: OLD_MCP_CONTENT });
  try {
    const desired = fs.readFileSync(path.join(PACKAGE_ROOT, MCP_PATH), 'utf8');
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /replace \.mcp\.json \[write\]/);
    assert.equal(fs.readFileSync(path.join(temp.target, MCP_PATH), 'utf8'), desired);
    const lockfile = JSON.parse(fs.readFileSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH), 'utf8'));
    assert.ok(lockfile.files.some((record) => record.path === MCP_PATH));
  } finally {
    temp.cleanup();
  }
});

test('update conflicts on local modifications to lock-owned opt-in files', () => {
  const temp = installedOutdatedOptInTarget({ initArgs: ['--with-root-docs'], targetPath: ROOT_DOC_TARGET, oldContent: OLD_ROOT_DOC_CONTENT });
  try {
    const local = `${OLD_ROOT_DOC_CONTENT}local change\n`;
    fs.writeFileSync(path.join(temp.target, ROOT_DOC_TARGET), local);
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 2);
    assert.match(result.stdout, /conflict-local-modification README\.oh-my-openagent-toolkit\.md file\.local-modification/);
    assert.equal(fs.readFileSync(path.join(temp.target, ROOT_DOC_TARGET), 'utf8'), local);
  } finally {
    temp.cleanup();
  }
});

test('update does not newly install opt-in artifacts absent from the lockfile', () => {
  const temp = installedTarget();
  try {
    const result = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /skip-opt-in README\.md/);
    assert.match(result.stdout, /skip-opt-in \.mcp\.json/);
    assert.doesNotMatch(result.stdout, /create README\.oh-my-openagent-toolkit\.md/);
    assert.equal(fs.existsSync(path.join(temp.target, ROOT_DOC_TARGET)), false);
    assert.equal(fs.existsSync(path.join(temp.target, MCP_PATH)), false);
  } finally {
    temp.cleanup();
  }
});


test('update detects and applies stale lockfile manifest identity without payload changes', () => {
  const temp = installedTarget();
  try {
    const beforePayload = fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8');
    writeStaleManifestIdentity(temp.target);
    const before = snapshotTarget(temp.target);

    const check = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(check.status, 1, check.stderr);
    assert.match(check.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json/);
    assert.doesNotMatch(check.stdout, /No changes to apply\./);
    assert.deepEqual(snapshotTarget(temp.target), before);

    const apply = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(apply.status, 0, apply.stderr);
    assert.match(apply.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
    assert.equal(fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8'), beforePayload);
    const lockfile = readTargetLockfile(temp.target);
    assert.equal(lockfile.manifest.sha256, fullManifestDigest());

    const current = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(current.status, 0, current.stderr);
    assert.match(current.stdout, /No changes to apply\./);
    assert.doesNotMatch(current.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
  } finally {
    temp.cleanup();
  }
});

test('update apply preserves local modifications and exits conflict state', () => {
  const temp = installedOutdatedTarget();
  try {
    const local = `${OLD_CONTENT}local change\n`;
    fs.writeFileSync(path.join(temp.target, UPDATE_FILE), local);
    const before = snapshotTarget(temp.target);
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 2);
    assert.match(result.stdout, /conflict-local-modification \.opencode\/commands\/route-domain\.md file\.local-modification/);
    assert.equal(fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8'), local);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('update treats active manifest localOnly paths as project-owned during check and apply', () => {
  const temp = installedOutdatedTarget();
  try {
    const localContent = `${OLD_CONTENT}project local override\n`;
    fs.writeFileSync(path.join(temp.target, UPDATE_FILE), localContent);
    addLocalOnlyOverride(temp.target, UPDATE_FILE);
    const before = snapshotTarget(temp.target);

    const check = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(check.status, 0, check.stderr);
    assert.match(check.stdout, /skip-unmanaged \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(check.stdout, /replace \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(check.stdout, /create \.opencode\/commands\/route-domain\.md/);
    assert.deepEqual(snapshotTarget(temp.target), before);

    const apply = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(apply.status, 0, apply.stderr);
    assert.match(apply.stdout, /No changes to apply\./);
    assert.doesNotMatch(apply.stdout, /replace \.opencode\/commands\/route-domain\.md \[write\]/);
    assert.equal(fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8'), localContent);
    assert.deepEqual(readTargetLockfile(temp.target).overrides.localOnly, [UPDATE_FILE]);
  } finally {
    temp.cleanup();
  }
});

test('update apply preserves missing localOnly overrides in the next lockfile', () => {
  const temp = installedTarget();
  try {
    addLocalOnlyOverride(temp.target, UPDATE_FILE);
    fs.rmSync(path.join(temp.target, UPDATE_FILE));
    writeStaleManifestIdentity(temp.target);

    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
    assert.doesNotMatch(result.stdout, /create \.opencode\/commands\/route-domain\.md \[write\]/);
    assert.equal(fs.existsSync(path.join(temp.target, UPDATE_FILE)), false);
    assert.deepEqual(readTargetLockfile(temp.target).overrides.localOnly, [UPDATE_FILE]);
    assert.equal(readTargetLockfile(temp.target).files.some((record) => record.path === UPDATE_FILE), false);
  } finally {
    temp.cleanup();
  }
});

test('update rejects missing and invalid lockfiles as invalid update state', () => {
  const missing = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['update', '--check', '--target', missing.target]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /update\.missing-lockfile/);
  } finally {
    missing.cleanup();
  }

  const invalid = createTempTargetFromFixture('empty-target');
  try {
    const lockfilePath = path.join(invalid.target, LOCKFILE_RELATIVE_PATH);
    fs.mkdirSync(path.dirname(lockfilePath), { recursive: true });
    fs.writeFileSync(lockfilePath, '{not json\n');
    const result = runBin(['update', '--check', '--target', invalid.target]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /E_LOCKFILE_INVALID_JSON/);
  } finally {
    invalid.cleanup();
  }
});

test('update rejects lockfile version mismatch as invalid update state', () => {
  const temp = installedTarget();
  try {
    const lockfile = readTargetLockfile(temp.target);
    lockfile.schema = 2;
    writeTargetLockfile(temp.target, lockfile);
    const result = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(result.status, 2);
    assert.match(result.stderr, /E_LOCKFILE_UNSUPPORTED_SCHEMA/);
  } finally {
    temp.cleanup();
  }
});

test('update profile defaults to lockfile profile and reports profile changes', () => {
  const temp = installedTarget(['--profile', 'core']);
  try {
    const defaulted = runBin(['update', '--check', '--target', temp.target]);
    assert.equal(defaulted.status, 0, defaulted.stderr);
    assert.match(defaulted.stdout, /Update plan \(check, profile core\):/);

    const changed = runBin(['update', '--dry-run', '--profile', 'full', '--target', temp.target]);
    assert.equal(changed.status, 0, changed.stderr);
    assert.match(changed.stdout, /profile-change core -> full/);
  } finally {
    temp.cleanup();
  }
});

test('update apply refuses concurrent lock and preserves existing lock file', () => {
  const temp = installedOutdatedTarget();
  try {
    const lockPath = path.join(temp.target, UPDATE_LOCK_RELATIVE_PATH);
    fs.writeFileSync(lockPath, 'already running\n');
    const before = fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8');
    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 2);
    assert.match(result.stdout, /update\.concurrent-run/);
    assert.equal(fs.readFileSync(path.join(temp.target, UPDATE_FILE), 'utf8'), before);
    assert.equal(fs.readFileSync(lockPath, 'utf8'), 'already running\n');
  } finally {
    temp.cleanup();
  }
});

test('update apply cleans update lock and temp file after interrupted write failure', () => {
  const temp = installedTarget();
  try {
    fs.rmSync(path.join(temp.target, UPDATE_FILE));
    fs.mkdirSync(path.join(temp.target, UPDATE_FILE), { recursive: true });

    const result = runBin(['update', '--apply', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /update failed:/);
    assert.equal(fs.existsSync(path.join(temp.target, UPDATE_LOCK_RELATIVE_PATH)), false);
    const parentEntries = fs.readdirSync(path.dirname(path.join(temp.target, UPDATE_FILE)));
    assert.deepEqual(parentEntries.filter((entry) => entry.startsWith('route-domain.md.tmp-')), []);
    assert.equal(fs.statSync(path.join(temp.target, UPDATE_FILE)).isDirectory(), true);
  } finally {
    temp.cleanup();
  }
});


function readTargetLockfile(target) {
  return JSON.parse(fs.readFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), 'utf8'));
}

function writeTargetLockfile(target, lockfile) {
  fs.writeFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), `${JSON.stringify(lockfile, null, 2)}\n`);
}

function addLocalOnlyOverride(target, relativePath) {
  const lockfile = readTargetLockfile(target);
  lockfile.overrides ??= {};
  lockfile.overrides.skip ??= [];
  lockfile.overrides.localOnly = [...new Set([...(lockfile.overrides.localOnly ?? []), relativePath])].sort((left, right) => left.localeCompare(right, 'en-US'));
  writeTargetLockfile(target, lockfile);
}

function writeStaleManifestIdentity(target) {
  const lockfile = readTargetLockfile(target);
  lockfile.manifest.sha256 = '0'.repeat(64);
  writeTargetLockfile(target, lockfile);
}

function fullManifestDigest() {
  return manifestSha256(JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'toolkit-manifest.json'), 'utf8')));
}

function installedTarget(initArgs = []) {
  const temp = createTempTargetFromFixture('empty-target');
  const result = runBin(['init', '--apply', ...initArgs, '--target', temp.target]);
  assert.equal(result.status, 0, result.stderr);
  if (initArgs.includes('--with-root-docs')) rewriteOptInRootDocLockHashes(temp.target);
  return temp;
}

function rewriteOptInRootDocLockHashes(target) {
  const lockfile = readTargetLockfile(target);
  for (const [targetPath, sourcePath] of [
    [ROOT_DOC_TARGET, ROOT_DOC_SOURCE],
    ['CHANGELOG.oh-my-openagent-toolkit.md', 'CHANGELOG.md'],
    ['LICENSE.oh-my-openagent-toolkit', 'LICENSE'],
    ['VERSION.oh-my-openagent-toolkit', 'VERSION'],
  ]) {
    const record = lockfile.files.find((entry) => entry.path === targetPath);
    if (!record) continue;
    const currentHash = sha256(fs.readFileSync(path.join(PACKAGE_ROOT, sourcePath)));
    record.sha256 = currentHash;
    record.sourceSha256 = currentHash;
  }
  writeTargetLockfile(target, lockfile);
}

function installedOutdatedTarget() {
  const temp = installedTarget();
  const oldHash = sha256(OLD_CONTENT);
  fs.writeFileSync(path.join(temp.target, UPDATE_FILE), OLD_CONTENT);
  const lockfilePath = path.join(temp.target, LOCKFILE_RELATIVE_PATH);
  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  const record = lockfile.files.find((entry) => entry.path === UPDATE_FILE);
  assert.ok(record, 'expected installed route-domain record');
  record.sha256 = oldHash;
  record.sourceSha256 = oldHash;
  record.lastAction = 'replace';
  fs.writeFileSync(lockfilePath, `${JSON.stringify(lockfile, null, 2)}\n`);
  return temp;
}


function installedOutdatedOptInTarget({ initArgs, targetPath, oldContent }) {
  const temp = installedTarget(initArgs);
  const oldHash = sha256(oldContent);
  fs.writeFileSync(path.join(temp.target, targetPath), oldContent);
  const lockfilePath = path.join(temp.target, LOCKFILE_RELATIVE_PATH);
  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  const record = lockfile.files.find((entry) => entry.path === targetPath);
  assert.ok(record, `expected installed opt-in record: ${targetPath}`);
  record.sha256 = oldHash;
  record.sourceSha256 = oldHash;
  record.lastAction = 'replace';
  fs.writeFileSync(lockfilePath, `${JSON.stringify(lockfile, null, 2)}\n`);
  return temp;
}

function runBin(args) {
  return spawnSync(process.execPath, [BIN, ...args], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf8',
  });
}

async function captureRunCli(args) {
  let stdout = '';
  let stderr = '';
  const code = await runCli(args, {
    cwd: PACKAGE_ROOT,
    stdout: { write: (chunk) => { stdout += chunk; } },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });
  return { code, stdout, stderr };
}

function sha256(content) {
  return crypto.createHash('sha256').update(Buffer.from(content, 'utf8')).digest('hex');
}

function snapshotTarget(target) {
  if (path.dirname(path.dirname(target)) !== os.tmpdir()) throw new Error(`Refusing to snapshot non-temp target: ${target}`);
  const entries = [];
  collectSnapshot(target, target, entries);
  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

function collectSnapshot(root, current, entries) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
    const absolute = path.join(current, entry.name);
    const relative = path.relative(root, absolute).split(path.sep).join('/');
    if (entry.isDirectory()) {
      entries.push({ path: relative, type: 'directory' });
      collectSnapshot(root, absolute, entries);
    } else if (entry.isFile()) {
      entries.push({ path: relative, type: 'file', hash: sha256(fs.readFileSync(absolute)) });
    }
  }
}
