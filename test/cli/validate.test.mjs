import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { BEGIN_MARKER, END_MARKER } from '../../src/cli/core/agents-block.mjs';
import { LOCKFILE_RELATIVE_PATH } from '../../src/cli/core/lockfile.mjs';
import { createTempTargetFromFixture, fixturePath } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const BIN = path.join(PACKAGE_ROOT, 'bin', 'omo-toolkit.mjs');
const ROUTE_DOMAIN_PATH = '.opencode/commands/route-domain.md';
const PLUGIN_CONFIG_PATH = '.opencode/oh-my-openagent.jsonc';
const FULL_GUIDE_SENTINELS = ['# AGENTS Guide', '## What each document owns'];

test('validate exits 0 for a valid init apply target', () => {
  const temp = installedTarget();
  try {
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    assertFreshMissingFileInitTarget(temp.target);
    assert.match(result.stdout, /Rules checked: .*install\.file\.hash-mismatch/);
    assert.match(result.stdout, /Summary: PASS \(0 failures\)/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports missing lockfile', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL install\.lockfile\.missing \.opencode\/oh-my-openagent-toolkit\.lock\.json/);
    assert.match(result.stdout, /Summary: FAIL \(1 failures\)/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports invalid lockfile JSON', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    fs.mkdirSync(path.join(temp.target, '.opencode'), { recursive: true });
    fs.copyFileSync(fixturePath('invalid-lockfile', '.omo', 'lockfile.json'), path.join(temp.target, LOCKFILE_RELATIVE_PATH));
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /install\.lockfile\.invalid-json/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports bad plugin config top-level paths', () => {
  const temp = installedTarget();
  try {
    fs.copyFileSync(fixturePath('bad-plugin-config', PLUGIN_CONFIG_PATH), path.join(temp.target, PLUGIN_CONFIG_PATH));
    rewriteLockRecordHash(temp.target, PLUGIN_CONFIG_PATH);
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL install\.plugin\.top-level-paths \.opencode\/oh-my-openagent\.jsonc/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports duplicate AGENTS managed block', () => {
  const temp = installedTarget();
  try {
    fs.copyFileSync(fixturePath('duplicate-agents-block', 'AGENTS.md'), path.join(temp.target, 'AGENTS.md'));
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL install\.agents\.duplicate-block AGENTS\.md/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports file hash mismatch with exact path', () => {
  const temp = installedTarget();
  try {
    fs.appendFileSync(path.join(temp.target, ROUTE_DOMAIN_PATH), '\nlocal change\n');
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, new RegExp(`FAIL install\\.file\\.hash-mismatch ${escapeRegExp(ROUTE_DOMAIN_PATH)}`));
  } finally {
    temp.cleanup();
  }
});

test('validate reports missing lock-owned file', () => {
  const temp = installedTarget();
  try {
    fs.rmSync(path.join(temp.target, ROUTE_DOMAIN_PATH));
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, new RegExp(`FAIL install\\.file\\.missing ${escapeRegExp(ROUTE_DOMAIN_PATH)}`));
  } finally {
    temp.cleanup();
  }
});

test('validate rejects current full-profile lockfiles that omit managed inventory', () => {
  const temp = installedTarget();
  try {
    const lockfile = readLockfile(temp.target);
    lockfile.files = [];
    lockfile.agentsBlock = null;
    fs.rmSync(path.join(temp.target, '.opencode', 'skills'), { recursive: true, force: true });
    fs.rmSync(path.join(temp.target, '.opencode', 'commands'), { recursive: true, force: true });
    fs.rmSync(path.join(temp.target, '.opencode', 'reference'), { recursive: true, force: true });
    fs.rmSync(path.join(temp.target, PLUGIN_CONFIG_PATH), { force: true });
    fs.rmSync(path.join(temp.target, 'AGENTS.md'), { force: true });
    writeLockfile(temp.target, lockfile);

    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, new RegExp(`FAIL install\\.file\\.missing ${escapeRegExp(ROUTE_DOMAIN_PATH)}`));
    assert.match(result.stdout, new RegExp(`FAIL install\\.file\\.missing ${escapeRegExp(PLUGIN_CONFIG_PATH)}`));
    assert.match(result.stdout, /FAIL install\.agents\.missing-block AGENTS\.md/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports manifest mismatch', () => {
  const temp = installedTarget();
  try {
    const lockfile = readLockfile(temp.target);
    lockfile.manifest.sha256 = '0'.repeat(64);
    writeLockfile(temp.target, lockfile);
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL install\.manifest\.mismatch \.opencode\/oh-my-openagent-toolkit\.lock\.json/);
  } finally {
    temp.cleanup();
  }
});

test('validate reports AGENTS hash mismatch', () => {
  const temp = installedTarget();
  try {
    const agentsPath = path.join(temp.target, 'AGENTS.md');
    const agents = fs.readFileSync(agentsPath, 'utf8');
    fs.writeFileSync(agentsPath, agents.replace('supplementary', 'locally edited'));
    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /FAIL install\.agents\.hash-mismatch AGENTS\.md/);
  } finally {
    temp.cleanup();
  }
});

test('validate --json output is parseable', () => {
  const temp = installedTarget();
  try {
    const result = runBin(['validate', '--json', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.ok, true);
    assert.deepEqual(report.issues, []);
    assert.ok(report.rules.includes('install.unmanaged-conflict'));
  } finally {
    temp.cleanup();
  }
});

test('validate exits 0 for project-owned localOnly managed paths', () => {
  const temp = installedTarget();
  try {
    makeLocalOnly(temp.target, ROUTE_DOMAIN_PATH);

    const result = runBin(['validate', '--json', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(result.stdout);
    assert.equal(report.ok, true);
    assert.deepEqual(report.issues, []);
  } finally {
    temp.cleanup();
  }
});

test('validate still fails unmanaged managed-root files not listed as localOnly', () => {
  const temp = installedTarget();
  try {
    const localPath = '.opencode/skills/unlisted/SKILL.md';
    fs.mkdirSync(path.join(temp.target, '.opencode', 'skills', 'unlisted'), { recursive: true });
    fs.writeFileSync(path.join(temp.target, localPath), '# Unlisted local skill\n');

    const result = runBin(['validate', '--target', temp.target]);

    assert.equal(result.status, 1);
    assert.match(result.stdout, new RegExp(`FAIL install\.unmanaged-conflict ${escapeRegExp(localPath)}`));
  } finally {
    temp.cleanup();
  }
});

test('validate reports unmanaged install-root conflicts and forbidden support claims', () => {
  const temp = installedTarget();
  try {
    fs.mkdirSync(path.join(temp.target, '.opencode', 'skills', 'local-only'), { recursive: true });
    fs.writeFileSync(path.join(temp.target, '.opencode', 'skills', 'local-only', 'SKILL.md'), '# Local\n');
    const agentsPath = path.join(temp.target, 'AGENTS.md');
    const agents = fs.readFileSync(agentsPath, 'utf8');
    fs.writeFileSync(agentsPath, agents.replace(END_MARKER, 'This has validated support for all skills.\n' + END_MARKER));
    const lockfile = readLockfile(temp.target);
    lockfile.agentsBlock.sha256 = sha256(blockBody(fs.readFileSync(agentsPath, 'utf8')));
    writeLockfile(temp.target, lockfile);

    const result = runBin(['validate', '--target', temp.target]);
    assert.equal(result.status, 1);
    assert.match(result.stdout, /install\.unmanaged-conflict \.opencode\/skills\/local-only\/SKILL\.md/);
    assert.match(result.stdout, /install\.support\.forbidden-claim AGENTS\.md/);
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

function readLockfile(target) {
  return JSON.parse(fs.readFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), 'utf8'));
}

function writeLockfile(target, lockfile) {
  fs.writeFileSync(path.join(target, LOCKFILE_RELATIVE_PATH), `${JSON.stringify(lockfile, null, 2)}\n`);
}

function rewriteLockRecordHash(target, relativePath) {
  const lockfile = readLockfile(target);
  const record = lockfile.files.find((entry) => entry.path === relativePath);
  assert.ok(record, `expected lock record for ${relativePath}`);
  record.sha256 = sha256(fs.readFileSync(path.join(target, relativePath)));
  writeLockfile(target, lockfile);
}

function makeLocalOnly(target, relativePath) {
  const lockfile = readLockfile(target);
  lockfile.files = lockfile.files.filter((entry) => entry.path !== relativePath);
  lockfile.overrides ??= {};
  lockfile.overrides.skip ??= [];
  lockfile.overrides.localOnly = [...new Set([...(lockfile.overrides.localOnly ?? []), relativePath])].sort((left, right) => left.localeCompare(right, 'en-US'));
  writeLockfile(target, lockfile);
}

function blockBody(agents) {
  const bodyStart = agents.indexOf(BEGIN_MARKER) + BEGIN_MARKER.length;
  const contentStart = agents.indexOf('\n', bodyStart) + 1;
  const bodyEnd = agents.indexOf(END_MARKER);
  return agents.slice(contentStart, bodyEnd).trim() + '\n';
}

function sha256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
