import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { BEGIN_MARKER } from '../../src/cli/core/agents-block.mjs';
import { LOCKFILE_RELATIVE_PATH, manifestSha256 } from '../../src/cli/core/lockfile.mjs';
import { runCli } from '../../src/cli/main.mjs';
import { createTempTargetFromFixture, fixturePath, snapshotFixture } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const BIN = path.join(PACKAGE_ROOT, 'bin', 'omo-toolkit.mjs');

test('init dry-run prints planned creates, AGENTS, and lockfile actions without writing', () => {
  const before = snapshotFixture('empty-target');
  const result = runBin(['init', '--dry-run', '--target', fixturePath('empty-target')]);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /create \.opencode\/commands\/route-domain\.md/);
  assert.match(result.stdout, /agents-insert AGENTS\.md/);
  assert.match(result.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json/);
  assert.deepEqual(snapshotFixture('empty-target'), before);
});

test('init defaults to dry-run and rejects conflicting modes as usage errors', async () => {
  const output = await captureRunCli(['init', '--target', fixturePath('empty-target')]);
  assert.equal(output.code, 0);
  assert.match(output.stdout, /defaulting to dry-run/);
  assert.match(output.stdout, /Rerun with --apply/);

  const usage = await captureRunCli(['init', '--dry-run', '--apply', '--target', fixturePath('empty-target')]);
  assert.equal(usage.code, 2);
  assert.match(usage.stderr, /mutually exclusive/);
  assert.doesNotMatch(usage.stderr, /Error:/);
});

test('init apply installs full toolkit payload and is idempotent', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const first = runBin(['init', '--apply', '--target', temp.target]);
    assert.equal(first.status, 0, first.stderr);
    assertInstalledShape(temp.target);
    const afterFirst = snapshotTarget(temp.target);

    const second = runBin(['init', '--apply', '--target', temp.target]);
    assert.equal(second.status, 0, second.stderr);
    assert.match(second.stdout, /noop \.opencode\/commands\/route-domain\.md/);
    assert.match(second.stdout, /No changes to apply\./);
    assert.doesNotMatch(second.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
    assert.doesNotMatch(second.stdout, /Applied init plan\./);
    assert.deepEqual(snapshotTarget(temp.target), afterFirst);
  } finally {
    temp.cleanup();
  }
});


test('init lockfile stores full toolkit manifest identity', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['init', '--apply', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);
    const lockfile = JSON.parse(fs.readFileSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH), 'utf8'));
    assert.equal(lockfile.manifest.sha256, fullManifestDigest());
  } finally {
    temp.cleanup();
  }
});

test('init apply blocks unmanaged .opencode managed-root content without overwriting bytes', () => {
  const temp = createTempTargetFromFixture('existing-opencode-unmanaged');
  try {
    const localSkill = path.join(temp.target, '.opencode', 'skills', 'custom-local-skill', 'SKILL.md');
    const beforeSkill = fs.readFileSync(localSkill, 'utf8');
    const beforeConfig = fs.readFileSync(path.join(temp.target, '.opencode', 'oh-my-openagent.jsonc'), 'utf8');
    const result = runBin(['init', '--apply', '--target', temp.target]);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /unmanaged-conflict \.opencode\/skills\/custom-local-skill\/SKILL\.md/);
    assert.match(result.stdout, /skip-unmanaged \.opencode\/oh-my-openagent\.jsonc/);
    assert.equal(fs.readFileSync(localSkill, 'utf8'), beforeSkill);
    assert.equal(fs.readFileSync(path.join(temp.target, '.opencode', 'oh-my-openagent.jsonc'), 'utf8'), beforeConfig);
  } finally {
    temp.cleanup();
  }
});

test('init with MCP blocks placeholder unless explicitly allowed', () => {
  const blocked = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['init', '--apply', '--with-mcp', '--target', blocked.target]);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /placeholder token/);
    assert.equal(fs.existsSync(path.join(blocked.target, '.mcp.json')), false);
  } finally {
    blocked.cleanup();
  }

  const allowed = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['init', '--apply', '--with-mcp', '--allow-placeholder-mcp', '--target', allowed.target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(fs.readFileSync(path.join(allowed.target, '.mcp.json'), 'utf8'), new RegExp(`<<YOUR_GITHUB_${'PERSONAL_ACCESS_TOKEN'}>>`));
  } finally {
    allowed.cleanup();
  }
});

test('init with root docs writes only toolkit-suffixed target names', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const result = runBin(['init', '--apply', '--with-root-docs', '--target', temp.target]);
    assert.equal(result.status, 0, result.stderr);

    for (const forbidden of ['README.md', 'CHANGELOG.md', 'VERSION', 'LICENSE']) {
      assert.equal(fs.existsSync(path.join(temp.target, forbidden)), false, forbidden);
    }
    for (const expected of ['README.oh-my-openagent-toolkit.md', 'CHANGELOG.oh-my-openagent-toolkit.md', 'VERSION.oh-my-openagent-toolkit', 'LICENSE.oh-my-openagent-toolkit']) {
      assert.equal(fs.existsSync(path.join(temp.target, expected)), true, expected);
    }
  } finally {
    temp.cleanup();
  }
});


function fullManifestDigest() {
  return manifestSha256(JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'toolkit-manifest.json'), 'utf8')));
}

function assertInstalledShape(target) {
  assert.equal(fs.existsSync(path.join(target, LOCKFILE_RELATIVE_PATH)), true);
  assert.equal(fs.statSync(path.join(target, '.opencode', 'skills')).isDirectory(), true);
  assert.equal(fs.statSync(path.join(target, '.opencode', 'commands')).isDirectory(), true);
  assert.equal(fs.statSync(path.join(target, '.opencode', 'reference')).isDirectory(), true);
  assert.equal(fs.existsSync(path.join(target, '.opencode', 'oh-my-openagent.jsonc')), true);
  const agents = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
  assert.equal((agents.match(new RegExp(BEGIN_MARKER, 'g')) ?? []).length, 1);
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

function snapshotTarget(target) {
  const tempFixtureName = path.basename(target);
  if (path.dirname(path.dirname(target)) === os.tmpdir()) return snapshotDirectory(target);
  throw new Error(`Refusing to snapshot non-temp target: ${tempFixtureName}`);
}

function snapshotDirectory(root) {
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
      }
    }
    walk(root);
    process.stdout.write(JSON.stringify(entries));
  `, root], { encoding: 'utf8' });
  return JSON.parse(output);
}
