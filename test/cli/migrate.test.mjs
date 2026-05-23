import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { buildAgentsManagedBlock } from '../../src/cli/core/agents-block.mjs';
import { LOCKFILE_RELATIVE_PATH } from '../../src/cli/core/lockfile.mjs';
import { runCli } from '../../src/cli/main.mjs';
import { createTempTargetFromFixture } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const BIN = path.join(PACKAGE_ROOT, 'bin', 'omo-toolkit.mjs');
const ROUTE_DOMAIN = '.opencode/commands/route-domain.md';

await test('help lists migrate command', async () => {
  const output = await captureRunCli(['help']);
  assert.equal(output.code, 0);
  assert.match(output.stdout, /migrate\s+Migrate existing toolkit files into lockfile ownership/);
});

test('migrate defaults to dry-run and writes nothing', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const before = snapshotTarget(temp.target);
    const result = runBin(['migrate', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Migration plan \(dry-run, profile full\):/);
    assert.match(result.stdout, /create-missing \.opencode\/commands\/route-domain\.md file\.missing/);
    assert.match(result.stdout, /agents-insert AGENTS\.md agents\.missing-file/);
    assert.match(result.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json lockfile\.write/);
    assert.doesNotMatch(result.stdout, /\[write\]/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('migrate apply adopts identical files, creates missing payloads, and writes lockfile ownership', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const routePath = path.join(temp.target, ROUTE_DOMAIN);
    const routeContent = fs.readFileSync(path.join(PACKAGE_ROOT, ROUTE_DOMAIN), 'utf8');
    fs.mkdirSync(path.dirname(routePath), { recursive: true });
    fs.writeFileSync(routePath, routeContent);

    const result = runBin(['migrate', '--apply', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /adopt-identical \.opencode\/commands\/route-domain\.md/);
    assert.match(result.stdout, /create-missing \.opencode\/oh-my-openagent\.jsonc file\.missing \[write\]/);
    assert.match(result.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json lockfile\.write \[write\]/);
    assert.match(result.stdout, /Applied migration plan\./);
    assert.equal(fs.readFileSync(routePath, 'utf8'), routeContent);
    const lockfile = readTargetLockfile(temp.target);
    assert.ok(lockfile.files.some((record) => record.path === ROUTE_DOMAIN && record.lastAction === 'adopt-identical'));
    assert.ok(lockfile.files.some((record) => record.path === '.opencode/oh-my-openagent.jsonc' && record.lastAction === 'create-missing'));
  } finally {
    temp.cleanup();
  }
});

test('migrate apply is idempotent after a successful migration', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const first = runBin(['migrate', '--apply', '--target', temp.target]);
    assert.equal(first.status, 0, first.stderr);

    const before = snapshotTarget(temp.target);
    const lockfilePath = path.join(temp.target, LOCKFILE_RELATIVE_PATH);
    const beforeLockfile = fs.readFileSync(lockfilePath, 'utf8');
    const second = runBin(['migrate', '--apply', '--target', temp.target]);

    assert.equal(second.status, 0, second.stderr);
    assert.doesNotMatch(second.stdout, /lockfile-write/);
    assert.doesNotMatch(second.stdout, /\[write\]/);
    assert.match(second.stdout, /No changes to apply\./);
    assert.equal(fs.readFileSync(lockfilePath, 'utf8'), beforeLockfile);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('migrate --yes applies only when no explicit mode flag is supplied', () => {
  const impliedApply = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['migrate', '--yes', '--target', impliedApply.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Migration plan \(apply, profile full\):/);
    assert.equal(fs.existsSync(path.join(impliedApply.target, LOCKFILE_RELATIVE_PATH)), true);
  } finally {
    impliedApply.cleanup();
  }

  const explicitDryRun = createTempTargetFromFixture('empty-target');
  try {
    const before = snapshotTarget(explicitDryRun.target);
    const result = runBin(['migrate', '--dry-run', '--yes', '--target', explicitDryRun.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Migration plan \(dry-run, profile full\):/);
    assert.deepEqual(snapshotTarget(explicitDryRun.target), before);
  } finally {
    explicitDryRun.cleanup();
  }

  const explicitDiff = createTempTargetFromFixture('empty-target');
  try {
    const apply = runBin(['migrate', '--yes', '--target', explicitDiff.target]);
    assert.equal(apply.status, 0, apply.stderr);
    const before = snapshotTarget(explicitDiff.target);
    const result = runBin(['migrate', '--diff', '--yes', '--target', explicitDiff.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Migration plan \(diff, profile full\):/);
    assert.deepEqual(snapshotTarget(explicitDiff.target), before);
  } finally {
    explicitDiff.cleanup();
  }
});

test('migrate rejects force and overwrite as usage errors without stack traces', async () => {
  for (const flag of ['--force', '--overwrite']) {
    const output = await captureRunCli(['migrate', flag, '--target', PACKAGE_ROOT]);
    assert.equal(output.code, 2, flag);
    assert.match(output.stderr, new RegExp(`${flag} is not supported`));
    assert.match(output.stderr, /Usage: omo-toolkit migrate/);
    assert.doesNotMatch(output.stderr, /Error:/);
  }
});

test('migrate apply exits non-zero and writes nothing for unsafe conflicts', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    fs.mkdirSync(path.join(temp.target, ROUTE_DOMAIN), { recursive: true });
    const before = snapshotTarget(temp.target);
    const result = runBin(['migrate', '--apply', '--target', temp.target]);

    assert.equal(result.status, 2);
    assert.match(result.stdout, /unsafe-conflict \.opencode\/commands\/route-domain\.md/);
    assert.equal(fs.existsSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH)), false);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('migrate --diff prints safe diffs while blocked by unsafe conflicts', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    fs.mkdirSync(path.join(temp.target, ROUTE_DOMAIN), { recursive: true });
    const before = snapshotTarget(temp.target);

    const result = runBin(['migrate', '--diff', '--target', temp.target]);

    assert.equal(result.status, 2);
    assert.match(result.stdout, /unsafe-conflict \.opencode\/commands\/route-domain\.md target\.directory/);
    assert.match(result.stdout, /create-missing \.opencode\/oh-my-openagent\.jsonc file\.missing/);
    assert.match(result.stdout, /diff \.opencode\/oh-my-openagent\.jsonc/);
    assert.match(result.stdout, /diff AGENTS\.md/);
    assert.doesNotMatch(result.stdout, /diff \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(result.stdout, /\[write\]/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('migrate --json --dry-run emits clean report JSON with localOnly and mode metadata', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const projectOwnedPath = path.join(temp.target, ROUTE_DOMAIN);
    fs.mkdirSync(path.dirname(projectOwnedPath), { recursive: true });
    fs.writeFileSync(projectOwnedPath, '# Project-owned route command\n');

    const result = runBin(['migrate', '--json', '--dry-run', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    const report = JSON.parse(result.stdout);
    assert.deepEqual(Object.keys(report), [
      'actions',
      'conflicts',
      'reviews',
      'localOnly',
      'plannedWrites',
      'blocked',
      'ok',
      'defaultedMode',
    ]);
    assert.equal(report.ok, true);
    assert.equal(report.blocked, false);
    assert.equal(report.defaultedMode, false);
    assert.deepEqual(report.localOnly, [ROUTE_DOMAIN]);
    assert.equal(typeof report.plannedWrites, 'number');
    assert.equal(Array.isArray(report.plannedWrites), false);
    assert.equal(report.plannedWrites, 0);
    assert.equal(report.actions.some((action) => action.action === 'needs-review' && action.path === ROUTE_DOMAIN), true);
  } finally {
    temp.cleanup();
  }
});

test('migrate --json --diff emits parseable JSON without textual diffs', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['migrate', '--json', '--diff', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    assert.doesNotMatch(result.stdout, /^diff /m);
    const report = JSON.parse(result.stdout);
    assert.equal(report.ok, true);
    assert.equal(report.blocked, false);
    assert.equal(report.defaultedMode, false);
    assert.equal(report.actions.some((action) => action.action === 'create-missing'), true);
  } finally {
    temp.cleanup();
  }
});

test('migrate --json marks defaulted mode when no mode flag is supplied', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['migrate', '--json', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.defaultedMode, true);
    assert.equal(report.ok, true);
  } finally {
    temp.cleanup();
  }
});

test('migrate --diff prints diffs only for write-payload actions and writes nothing', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const adoptedPath = path.join(temp.target, ROUTE_DOMAIN);
    const reviewPath = path.join(temp.target, '.opencode/reference/support-policy.md');
    const preservePath = path.join(temp.target, '.opencode/reference/project-only.md');
    fs.mkdirSync(path.dirname(adoptedPath), { recursive: true });
    fs.mkdirSync(path.dirname(reviewPath), { recursive: true });
    fs.mkdirSync(path.dirname(preservePath), { recursive: true });
    fs.writeFileSync(adoptedPath, fs.readFileSync(path.join(PACKAGE_ROOT, ROUTE_DOMAIN)));
    fs.writeFileSync(reviewPath, '# Project-owned support policy\n');
    fs.writeFileSync(preservePath, '# Project-only reference\n');
    fs.writeFileSync(path.join(temp.target, 'AGENTS.md'), buildAgentsManagedBlock());
    const before = snapshotTarget(temp.target);

    const result = runBin(['migrate', '--diff', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /adopt-identical \.opencode\/commands\/route-domain\.md file\.current-identical/);
    assert.match(result.stdout, /agents-adopt AGENTS\.md agents\.current-managed-block/);
    assert.match(result.stdout, /preserve-project-owned \.opencode\/reference\/project-only\.md file\.non-manifest-managed-root/);
    assert.match(result.stdout, /needs-review \.opencode\/reference\/support-policy\.md file\.project-owned/);
    assert.doesNotMatch(result.stdout, /diff \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(result.stdout, /diff AGENTS\.md/);
    assert.doesNotMatch(result.stdout, /diff \.opencode\/reference\/project-only\.md/);
    assert.doesNotMatch(result.stdout, /diff \.opencode\/reference\/support-policy\.md/);
    assert.match(result.stdout, /diff \.opencode\/oh-my-openagent\.jsonc/);
    assert.match(result.stdout, /--- \.opencode\/oh-my-openagent\.jsonc \(current\)/);
    assert.match(result.stdout, /\+\+\+ \.opencode\/oh-my-openagent\.jsonc \(desired\)/);
    assert.doesNotMatch(result.stdout, /diff \.mcp\.json/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('migrate --diff includes replace-known-stale payload diffs without writing', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  const customPackageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-migrate-package-'));
  try {
    const routePath = path.join(temp.target, ROUTE_DOMAIN);
    fs.mkdirSync(path.dirname(routePath), { recursive: true });
    fs.copyFileSync(path.join(PACKAGE_ROOT, ROUTE_DOMAIN), routePath);
    writeCustomMigrationPackage(customPackageRoot, ROUTE_DOMAIN, '# Changed route command\n');
    const before = snapshotTarget(temp.target);

    const result = await captureRunCli(['migrate', '--diff', '--target', temp.target], { packageRoot: customPackageRoot });

    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, /replace-known-stale \.opencode\/commands\/route-domain\.md file\.known-historical/);
    assert.match(result.stdout, /diff \.opencode\/commands\/route-domain\.md/);
    assert.match(result.stdout, /--- \.opencode\/commands\/route-domain\.md \(current\)/);
    assert.match(result.stdout, /\+\+\+ \.opencode\/commands\/route-domain\.md \(desired\)/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
    fs.rmSync(customPackageRoot, { force: true, recursive: true });
  }
});

test('init --migrate --dry-run delegates to migrate dry-run action output', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const migrate = runBin(['migrate', '--dry-run', '--target', temp.target]);
    const alias = runBin(['init', '--migrate', '--dry-run', '--target', temp.target]);

    assert.equal(migrate.status, 0, migrate.stderr);
    assert.equal(alias.status, 0, alias.stderr);
    assert.deepEqual(actionLines(alias.stdout), actionLines(migrate.stdout));
  } finally {
    temp.cleanup();
  }
});

function readTargetLockfile(target) {
  return JSON.parse(fs.readFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), 'utf8'));
}

function runBin(args) {
  return spawnSync(process.execPath, [BIN, ...args], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
}

async function captureRunCli(args, options = {}) {
  let stdout = '';
  let stderr = '';
  const code = await runCli(args, {
    cwd: PACKAGE_ROOT,
    ...options,
    stdout: { write: (chunk) => { stdout += chunk; } },
    stderr: { write: (chunk) => { stderr += chunk; } },
  });
  return { code, stdout, stderr };
}

function writeCustomMigrationPackage(packageRoot, relativePath, content) {
  const sourcePath = path.join(packageRoot, relativePath);
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.writeFileSync(sourcePath, content);
  fs.writeFileSync(path.join(packageRoot, 'toolkit-manifest.json'), JSON.stringify({
    schema: 1,
    toolkit: { version: '0.6.0-test' },
    source: { gitCommit: 'test' },
    profiles: {
      full: { default: true, agentsBlock: false },
      core: { default: true, agentsBlock: false },
    },
    files: [{
      kind: 'command',
      mode: '100644',
      owner: 'toolkit',
      path: relativePath,
      profiles: ['full', 'core'],
      sha256: hashText(content),
      size: Buffer.byteLength(content),
      strategy: 'managed',
    }],
  }, null, 2));
}

function hashText(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function actionLines(output) {
  return output.split('\n').filter((line) => line.startsWith('- '));
}

function snapshotTarget(target) {
  if (path.dirname(path.dirname(target)) !== os.tmpdir()) throw new Error(`Refusing to snapshot non-temp target: ${target}`);
  if (!fs.existsSync(target)) return [];
  const output = execFileSync(process.execPath, ['-e', `
    const fs = require('node:fs');
    const crypto = require('node:crypto');
    const path = require('node:path');
    const root = process.argv[1];
    const entries = [];
    function walk(current) {
      for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const absolute = path.join(current, entry.name);
        const relative = path.relative(root, absolute).split(path.sep).join('/');
        if (entry.isDirectory()) { entries.push({ path: relative, type: 'directory' }); walk(absolute); }
        else if (entry.isFile()) entries.push({ path: relative, type: 'file', hash: crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex') });
        else if (entry.isSymbolicLink()) entries.push({ path: relative, type: 'symlink', target: fs.readlinkSync(absolute) });
      }
    }
    walk(root);
    process.stdout.write(JSON.stringify(entries));
  `, target], { encoding: 'utf8' });
  return JSON.parse(output);
}
