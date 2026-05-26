import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { BEGIN_MARKER, END_MARKER } from '../../src/cli/core/agents-block.mjs';
import { LOCKFILE_RELATIVE_PATH } from '../../src/cli/core/lockfile.mjs';
import { createTempTargetFromFixture, fixturePath } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const BIN = path.join(PACKAGE_ROOT, 'bin', 'omo-toolkit.mjs');
const PLUGIN_CONFIG_PATH = '.opencode/oh-my-openagent.jsonc';
const ROUTE_DOMAIN_PATH = '.opencode/commands/route-domain.md';
const FULL_GUIDE_SENTINELS = ['# AGENTS Guide', '## What each document owns'];

test('doctor reports empty target as not installed without writing', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const before = snapshotTarget(temp.target);
    const result = runBin(['doctor', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /Doctor status: unhealthy/);
    assert.match(result.stdout, /Target root: /);
    assert.match(result.stdout, /doctor\.not-installed/);
    assert.match(result.stdout, new RegExp(`node bin/omo-toolkit\.mjs init --dry-run --target ${escapeRegExp(temp.target)}`));
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('doctor exits 0 for valid installed target and does not mutate it', () => {
  const temp = installedTarget();
  try {
    const before = snapshotTarget(temp.target);
    const result = runBin(['doctor', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assertFreshMissingFileInitTarget(temp.target);
    assert.match(result.stdout, /Doctor status: healthy/);
    assert.match(result.stdout, /PASS doctor\.hashes/);
    assert.match(result.stdout, /PASS doctor\.agents\.markers/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('doctor --json emits machine-readable diagnostics', () => {
  const temp = installedTarget();
  try {
    const result = runBin(['doctor', '--json', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.status, 'healthy');
    assert.equal(report.targetRoot, temp.target);
    assert.ok(report.rules.includes('doctor.not-installed'));
    assert.ok(Array.isArray(report.diagnostics));
    assert.ok(Array.isArray(report.checks));
    assert.ok(report.suggestedCommands.includes(`node bin/omo-toolkit.mjs validate --target ${temp.target}`));
  } finally {
    temp.cleanup();
  }
});

test('doctor --json reports localOnly paths as healthy info', () => {
  const temp = installedTarget();
  try {
    makeLocalOnly(temp.target, ROUTE_DOMAIN_PATH);

    const result = runBin(['doctor', '--json', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    const localOnly = report.diagnostics.find((check) => check.ruleId === 'doctor.local-only');
    assert.equal(report.status, 'healthy');
    assert.ok(report.rules.includes('doctor.local-only'));
    assert.equal(localOnly.status, 'info');
    assert.deepEqual(localOnly.preservedPaths, [ROUTE_DOMAIN_PATH]);
  } finally {
    temp.cleanup();
  }
});

test('doctor suggests migrate dry-run before init dry-run for legacy-looking target without lockfile', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    fs.mkdirSync(path.join(temp.target, '.opencode', 'commands'), { recursive: true });
    fs.writeFileSync(path.join(temp.target, ROUTE_DOMAIN_PATH), 'legacy route command\n');

    const result = runBin(['doctor', '--json', '--target', temp.target]);

    assert.equal(result.status, 1);
    const report = JSON.parse(result.stdout);
    const migrate = `node bin/omo-toolkit.mjs migrate --dry-run --target ${temp.target}`;
    const init = `node bin/omo-toolkit.mjs init --dry-run --target ${temp.target}`;
    assert.ok(report.suggestedCommands.includes(migrate));
    assert.ok(report.suggestedCommands.includes(init));
    assert.ok(report.suggestedCommands.indexOf(migrate) < report.suggestedCommands.indexOf(init));
  } finally {
    temp.cleanup();
  }
});

test('doctor reports invalid lockfile with actionable diagnostic', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    fs.mkdirSync(path.join(temp.target, '.opencode'), { recursive: true });
    fs.copyFileSync(fixturePath('invalid-lockfile', '.omo', 'lockfile.json'), path.join(temp.target, LOCKFILE_RELATIVE_PATH));
    const result = runBin(['doctor', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL doctor\.lockfile\.invalid/);
    assert.match(result.stdout, /init --dry-run/);
  } finally {
    temp.cleanup();
  }
});

test('doctor reports top-level plugin paths as config issue', () => {
  const temp = installedTarget();
  try {
    fs.copyFileSync(fixturePath('bad-plugin-config', PLUGIN_CONFIG_PATH), path.join(temp.target, PLUGIN_CONFIG_PATH));
    rewriteLockRecordHash(temp.target, PLUGIN_CONFIG_PATH);
    const result = runBin(['doctor', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL doctor\.plugin\.config Plugin config must not define top-level paths\./);
  } finally {
    temp.cleanup();
  }
});

function installedTarget() {
  const temp = createTempTargetFromFixture('empty-target');
  const result = runBin(['init', '--apply', '--target', temp.target]);
  assert.equal(result.status, 0, result.stderr);
  return temp;
}

function runBin(args) {
  return spawnSync(process.execPath, [BIN, ...args], {
    cwd: PACKAGE_ROOT,
    encoding: 'utf8',
  });
}

function rewriteLockRecordHash(target, relativePath) {
  const lockfilePath = path.join(target, LOCKFILE_RELATIVE_PATH);
  const lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf8'));
  const record = lockfile.files.find((entry) => entry.path === relativePath);
  assert.ok(record, `expected lock record for ${relativePath}`);
  record.sha256 = sha256(fs.readFileSync(path.join(target, relativePath)));
  fs.writeFileSync(lockfilePath, `${JSON.stringify(lockfile, null, 2)}\n`);
}

function readLockfile(target) {
  return JSON.parse(fs.readFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), 'utf8'));
}

function writeLockfile(target, lockfile) {
  fs.writeFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), `${JSON.stringify(lockfile, null, 2)}\n`);
}

function makeLocalOnly(target, relativePath) {
  const lockfile = readLockfile(target);
  lockfile.files = lockfile.files.filter((entry) => entry.path !== relativePath);
  lockfile.overrides ??= {};
  lockfile.overrides.skip ??= [];
  lockfile.overrides.localOnly = [...new Set([...(lockfile.overrides.localOnly ?? []), relativePath])].sort((left, right) => left.localeCompare(right, 'en-US'));
  writeLockfile(target, lockfile);
}

function snapshotTarget(target) {
  if (path.dirname(path.dirname(target)) !== os.tmpdir()) throw new Error(`Refusing to snapshot non-temp target: ${target}`);
  return JSON.parse(execFileSync(process.execPath, ['-e', `
    const fs = require('node:fs');
    const crypto = require('node:crypto');
    const path = require('node:path');
    const root = process.argv[1];
    const entries = [];
    function walk(current) {
      for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name))) {
        const absolute = path.join(current, entry.name);
        const relative = path.relative(root, absolute).split(path.sep).join('/');
        if (entry.isDirectory()) { entries.push({ path: relative, type: 'directory' }); walk(absolute); }
        else if (entry.isFile()) entries.push({ path: relative, type: 'file', hash: crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex') });
      }
    }
    walk(root);
    process.stdout.write(JSON.stringify(entries));
  `, target], { encoding: 'utf8' }));
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertFreshMissingFileInitTarget(target) {
  const agents = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
  for (const sentinel of FULL_GUIDE_SENTINELS) assert.match(agents, new RegExp(escapeRegExp(sentinel)));
  assert.equal(countOccurrences(agents, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(agents, END_MARKER), 1);
}

function countOccurrences(content, needle) {
  let count = 0;
  let searchFrom = 0;
  while (searchFrom < content.length) {
    const index = content.indexOf(needle, searchFrom);
    if (index === -1) break;
    count += 1;
    searchFrom = index + needle.length;
  }
  return count;
}
