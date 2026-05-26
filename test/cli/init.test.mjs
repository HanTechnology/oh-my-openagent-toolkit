import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { BEGIN_MARKER, END_MARKER } from '../../src/cli/core/agents-block.mjs';
import { LOCKFILE_RELATIVE_PATH, manifestSha256 } from '../../src/cli/core/lockfile.mjs';
import { runCli } from '../../src/cli/main.mjs';
import { createTempTargetFromFixture, fixturePath, snapshotFixture } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const BIN = path.join(PACKAGE_ROOT, 'bin', 'omo-toolkit.mjs');
const FULL_GUIDE_SENTINELS = [
  '# AGENTS Guide',
  '## What each document owns',
  '.opencode/reference/routing-matrix.md',
];
const FULL_GUIDE_ONLY_SENTINELS = [
  '# AGENTS Guide',
  '## What each document owns',
];

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
    assertFullGuideAgents(temp.target);
    const agentsAfterFirst = fs.readFileSync(path.join(temp.target, 'AGENTS.md'), 'utf8');
    const afterFirst = snapshotTarget(temp.target);

    const second = runBin(['init', '--apply', '--target', temp.target]);
    assert.equal(second.status, 0, second.stderr);
    assert.match(second.stdout, /noop \.opencode\/commands\/route-domain\.md/);
    assert.match(second.stdout, /No changes to apply\./);
    assert.doesNotMatch(second.stdout, /lockfile-write \.opencode\/oh-my-openagent-toolkit\.lock\.json \[write\]/);
    assert.doesNotMatch(second.stdout, /Applied init plan\./);
    assert.equal(fs.readFileSync(path.join(temp.target, 'AGENTS.md'), 'utf8'), agentsAfterFirst);
    assert.deepEqual(snapshotTarget(temp.target), afterFirst);
  } finally {
    temp.cleanup();
  }
});


test('init apply preserves existing AGENTS project text outside the managed block', () => {
  const temp = createTempTargetFromFixture('existing-agents');
  try {
    const agentsPath = path.join(temp.target, 'AGENTS.md');
    const before = fs.readFileSync(agentsPath, 'utf8');

    const result = runBin(['init', '--apply', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    const after = fs.readFileSync(agentsPath, 'utf8');
    assertMarkerCounts(after);
    assertNoFullGuideSentinels(after);
    assert.equal(removeManagedBlock(after), before);
  } finally {
    temp.cleanup();
  }
});

test('init apply treats zero-byte AGENTS as existing and writes only the managed block', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const agentsPath = path.join(temp.target, 'AGENTS.md');
    fs.writeFileSync(agentsPath, '');

    const result = runBin(['init', '--apply', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    const after = fs.readFileSync(agentsPath, 'utf8');
    assertMarkerCounts(after);
    assertNoFullGuideSentinels(after);
    assert.equal(removeManagedBlock(after), '');
  } finally {
    temp.cleanup();
  }
});

test('init apply treats whitespace-only AGENTS as existing and writes only the managed block', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const agentsPath = path.join(temp.target, 'AGENTS.md');
    const before = '  \n\t\n';
    fs.writeFileSync(agentsPath, before);

    const result = runBin(['init', '--apply', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    const after = fs.readFileSync(agentsPath, 'utf8');
    assertMarkerCounts(after);
    assertNoFullGuideSentinels(after);
    assert.equal(removeManagedBlock(after), before);
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

test('init apply ignores lockfile localOnly managed-root files for unmanaged conflicts and preserves bytes', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const first = runBin(['init', '--apply', '--target', temp.target]);
    assert.equal(first.status, 0, first.stderr);

    const localOnlyPath = '.opencode/skills/local-only/SKILL.md';
    const localOnlyAbsolutePath = path.join(temp.target, localOnlyPath);
    const localOnlyContent = '# Local Only\n\nProject-owned skill.\n';
    fs.mkdirSync(path.dirname(localOnlyAbsolutePath), { recursive: true });
    fs.writeFileSync(localOnlyAbsolutePath, localOnlyContent);
    addLocalOnlyOverride(temp.target, localOnlyPath);

    const result = runBin(['init', '--apply', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.doesNotMatch(result.stdout, /unmanaged-conflict \.opencode\/skills\/local-only\/SKILL\.md/);
    assert.equal(fs.readFileSync(localOnlyAbsolutePath, 'utf8'), localOnlyContent);
    assert.deepEqual(readTargetLockfile(temp.target).overrides.localOnly, [localOnlyPath]);
  } finally {
    temp.cleanup();
  }
});

test('init apply preserves active manifest localOnly paths without blocking', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const first = runBin(['init', '--apply', '--target', temp.target]);
    assert.equal(first.status, 0, first.stderr);

    const localOnlyPath = '.opencode/commands/route-domain.md';
    const localOnlyAbsolutePath = path.join(temp.target, localOnlyPath);
    const localOnlyContent = '# Project route override\n';
    fs.writeFileSync(localOnlyAbsolutePath, localOnlyContent);
    addLocalOnlyOverride(temp.target, localOnlyPath);

    const result = runBin(['init', '--apply', '--target', temp.target]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /skip-unmanaged \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(result.stdout, /replace \.opencode\/commands\/route-domain\.md/);
    assert.doesNotMatch(result.stdout, /create \.opencode\/commands\/route-domain\.md/);
    assert.equal(fs.readFileSync(localOnlyAbsolutePath, 'utf8'), localOnlyContent);
    assert.deepEqual(readTargetLockfile(temp.target).overrides.localOnly, [localOnlyPath]);
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


test('init --migrate --dry-run delegates to migrate dry-run action lines', () => {
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


function fullManifestDigest() {
  return manifestSha256(JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'toolkit-manifest.json'), 'utf8')));
}

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

function assertInstalledShape(target) {
  assert.equal(fs.existsSync(path.join(target, LOCKFILE_RELATIVE_PATH)), true);
  assert.equal(fs.statSync(path.join(target, '.opencode', 'skills')).isDirectory(), true);
  assert.equal(fs.statSync(path.join(target, '.opencode', 'commands')).isDirectory(), true);
  assert.equal(fs.statSync(path.join(target, '.opencode', 'reference')).isDirectory(), true);
  assert.equal(fs.existsSync(path.join(target, '.opencode', 'oh-my-openagent.jsonc')), true);
  assert.equal(fs.existsSync(path.join(target, '.opencode', 'reference', 'routing-matrix.md')), true);
  assertMarkerCounts(fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8'));
}

function assertFullGuideAgents(target) {
  const agents = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
  for (const sentinel of FULL_GUIDE_SENTINELS) assert.match(agents, new RegExp(escapeRegExp(sentinel)));
  assertMarkerCounts(agents);
}

function assertNoFullGuideSentinels(agents) {
  for (const sentinel of FULL_GUIDE_ONLY_SENTINELS) assert.doesNotMatch(agents, new RegExp(escapeRegExp(sentinel)));
}

function assertMarkerCounts(agents) {
  assert.equal(countOccurrences(agents, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(agents, END_MARKER), 1);
}

function removeManagedBlock(agents) {
  const beginIndex = agents.indexOf(BEGIN_MARKER);
  const endIndex = agents.indexOf(END_MARKER);
  assert.notEqual(beginIndex, -1);
  assert.notEqual(endIndex, -1);
  const rangeEnd = consumeLineEnding(agents, endIndex + END_MARKER.length);
  return agents.slice(0, beginIndex) + agents.slice(rangeEnd);
}

function consumeLineEnding(source, index) {
  if (source.startsWith('\r\n', index)) return index + 2;
  if (source[index] === '\n' || source[index] === '\r') return index + 1;
  return index;
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


function actionLines(output) {
  return output.split('\n').filter((line) => line.startsWith('- '));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
