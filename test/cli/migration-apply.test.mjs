import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  BEGIN_MARKER,
  END_MARKER,
  agentsBlockSha256,
  buildAgentsManagedBlock,
} from '../../src/cli/core/agents-block.mjs';
import { hashBuffer, hashFile } from '../../src/cli/core/hash.mjs';
import { LOCKFILE_RELATIVE_PATH } from '../../src/cli/core/lockfile.mjs';
import {
  MIGRATION_ACTIONS,
  planMigration,
} from '../../src/cli/core/migration-plan.mjs';
import {
  MIGRATION_LOCK_RELATIVE_PATH,
  applyMigrationPlan,
} from '../../src/cli/core/migration-apply.mjs';

const NOW = '2026-05-23T00:00:00.000Z';
const ROUTE_PATH = '.opencode/commands/route-domain.md';
const SUPPORT_PATH = '.opencode/reference/support-policy.md';
const EXECUTABLE_PATH = '.opencode/reference/validate-opencode-bundle.sh';
const ROUTE_CURRENT = '# Current route\n';
const SUPPORT_CURRENT = '# Current support\n';
const SUPPORT_OLD = '# Historical support\n';
const EXECUTABLE_CURRENT = '#!/usr/bin/env bash\nprintf "ok\\n"\n';
const CURRENT_CONTENT_BY_HASH = new Map();

test('adopt-identical writes no payload bytes but records ownership in lockfile', () => {
  const fixture = createApplyFixture([
    manifestFile(ROUTE_PATH, ROUTE_CURRENT, { kind: 'command', profiles: ['core'] }),
  ], { agentsBlock: false });
  try {
    writeTarget(fixture.targetRoot, ROUTE_PATH, ROUTE_CURRENT);
    const filePath = path.join(fixture.targetRoot, ROUTE_PATH);
    const beforeBytes = fs.readFileSync(filePath);
    const beforeHash = hashFile(filePath).sha256;
    const beforeMtimeNs = fs.statSync(filePath, { bigint: true }).mtimeNs;
    const plan = makePlan(fixture, { [ROUTE_PATH]: ROUTE_CURRENT });

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, true, result.message);
    assert.deepEqual(result.writes, [LOCKFILE_RELATIVE_PATH]);
    assert.deepEqual(fs.readFileSync(filePath), beforeBytes);
    assert.equal(hashFile(filePath).sha256, beforeHash);
    assert.equal(fs.statSync(filePath, { bigint: true }).mtimeNs, beforeMtimeNs);
    const record = readLockfile(fixture.targetRoot).files.find((entry) => entry.path === ROUTE_PATH);
    assert.equal(record.sha256, sha256(ROUTE_CURRENT));
    assert.equal(record.lastAction, MIGRATION_ACTIONS.ADOPT_IDENTICAL);
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, MIGRATION_LOCK_RELATIVE_PATH)), false);
  } finally {
    fixture.cleanup();
  }
});

test('replace-known-stale and create-missing write current payloads and preserve executable mode', () => {
  const fixture = createApplyFixture([
    manifestFile(SUPPORT_PATH, SUPPORT_CURRENT, { kind: 'reference', profiles: ['core'] }),
    manifestFile(EXECUTABLE_PATH, EXECUTABLE_CURRENT, { kind: 'reference', mode: '100755', profiles: ['core'] }),
  ], { agentsBlock: false });
  try {
    writeTarget(fixture.targetRoot, SUPPORT_PATH, SUPPORT_OLD);
    const plan = makePlan(fixture, { [SUPPORT_PATH]: SUPPORT_OLD }, registryWithFile(SUPPORT_PATH, SUPPORT_OLD));
    assert.equal(actionFor(plan, MIGRATION_ACTIONS.REPLACE_KNOWN_STALE, SUPPORT_PATH).write, true);
    assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, EXECUTABLE_PATH).write, true);

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, true, result.message);
    assert.equal(fs.readFileSync(path.join(fixture.targetRoot, SUPPORT_PATH), 'utf8'), SUPPORT_CURRENT);
    assert.equal(fs.readFileSync(path.join(fixture.targetRoot, EXECUTABLE_PATH), 'utf8'), EXECUTABLE_CURRENT);
    assert.equal((fs.statSync(path.join(fixture.targetRoot, EXECUTABLE_PATH)).mode & 0o111) !== 0, true);
    const lockfile = readLockfile(fixture.targetRoot);
    assert.equal(lockfile.files.find((entry) => entry.path === SUPPORT_PATH).lastAction, MIGRATION_ACTIONS.REPLACE_KNOWN_STALE);
    assert.equal(lockfile.files.find((entry) => entry.path === EXECUTABLE_PATH).lastAction, MIGRATION_ACTIONS.CREATE_MISSING);
  } finally {
    fixture.cleanup();
  }
});

test('preserve-project-owned and needs-review leave local bytes unchanged while localOnly is written', () => {
  const reviewPath = '.opencode/reference/project-setup-policy.md';
  const preservedPath = '.opencode/skills/project/SKILL.md';
  const createPath = '.opencode/commands/new-command.md';
  const fixture = createApplyFixture([
    manifestFile(reviewPath, '# Toolkit policy\n', { kind: 'reference', profiles: ['core'] }),
    manifestFile(createPath, '# New command\n', { kind: 'command', profiles: ['core'] }),
  ], { agentsBlock: false });
  try {
    const reviewContent = '# Project policy\n';
    const preservedContent = '# Project skill\n';
    writeTarget(fixture.targetRoot, reviewPath, reviewContent);
    writeTarget(fixture.targetRoot, preservedPath, preservedContent);
    const plan = makePlan(fixture, { [reviewPath]: reviewContent, [preservedPath]: preservedContent });

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, true, result.message);
    assert.equal(fs.readFileSync(path.join(fixture.targetRoot, reviewPath), 'utf8'), reviewContent);
    assert.equal(fs.readFileSync(path.join(fixture.targetRoot, preservedPath), 'utf8'), preservedContent);
    assert.equal(fs.readFileSync(path.join(fixture.targetRoot, createPath), 'utf8'), '# New command\n');
    assert.deepEqual(readLockfile(fixture.targetRoot).overrides.localOnly, [preservedPath, reviewPath].sort());
  } finally {
    fixture.cleanup();
  }
});

test('AGENTS insert, adopt, and replace apply only marker-safe behavior', () => {
  const fixture = createApplyFixture([], { agentsBlock: true });
  try {
    const projectAgents = '# Project AGENTS\n\nProject notes.\n';
    writeTarget(fixture.targetRoot, 'AGENTS.md', projectAgents);
    let plan = makePlan(fixture, { 'AGENTS.md': { content: projectAgents } });
    assert.equal(actionFor(plan, MIGRATION_ACTIONS.AGENTS_INSERT, 'AGENTS.md').write, true);
    let result = applyFixturePlan(fixture, plan);
    assert.equal(result.ok, true, result.message);
    const inserted = fs.readFileSync(path.join(fixture.targetRoot, 'AGENTS.md'), 'utf8');
    assert.match(inserted, /Project notes\./);
    assert.equal(countOccurrences(inserted, BEGIN_MARKER), 1);

    const adoptBefore = fs.statSync(path.join(fixture.targetRoot, 'AGENTS.md'), { bigint: true }).mtimeNs;
    plan = makePlan(fixture, { 'AGENTS.md': { content: inserted } });
    assert.equal(actionFor(plan, MIGRATION_ACTIONS.AGENTS_ADOPT, 'AGENTS.md').write, false);
    result = applyFixturePlan(fixture, plan);
    assert.equal(result.ok, true, result.message);
    assert.equal(fs.statSync(path.join(fixture.targetRoot, 'AGENTS.md'), { bigint: true }).mtimeNs, adoptBefore);

    const historicalBody = 'Historical managed block.\n';
    const historicalAgents = `prefix\n${buildAgentsManagedBlock({ body: historicalBody })}suffix\n`;
    writeTarget(fixture.targetRoot, 'AGENTS.md', historicalAgents);
    plan = makePlan(fixture, { 'AGENTS.md': { content: historicalAgents } }, registryWithAgentsBlock(historicalBody));
    assert.equal(actionFor(plan, MIGRATION_ACTIONS.AGENTS_REPLACE, 'AGENTS.md').write, true);
    result = applyFixturePlan(fixture, plan);
    assert.equal(result.ok, true, result.message);
    const replaced = fs.readFileSync(path.join(fixture.targetRoot, 'AGENTS.md'), 'utf8');
    assert.match(replaced, /^prefix\n/);
    assert.match(replaced, /suffix\n$/);
    assert.doesNotMatch(replaced, /Historical managed block/);
    assert.equal(countOccurrences(replaced, BEGIN_MARKER), 1);
    assert.equal(countOccurrences(replaced, END_MARKER), 1);
  } finally {
    fixture.cleanup();
  }
});

test('unsafe-conflict and blocked plans apply zero writes', () => {
  const createPath = '.opencode/commands/new-command.md';
  const fixture = createApplyFixture([
    manifestFile(createPath, '# New command\n', { kind: 'command', profiles: ['core'] }),
  ], { agentsBlock: true });
  try {
    const unsafeAgents = `${buildAgentsManagedBlock()}\n${buildAgentsManagedBlock()}`;
    writeTarget(fixture.targetRoot, 'AGENTS.md', unsafeAgents);
    const before = snapshotTarget(fixture.targetRoot);
    const plan = makePlan(fixture, { 'AGENTS.md': { content: unsafeAgents } });
    assert.equal(plan.blocked, true);

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, false);
    assert.equal(result.status, 1);
    assert.deepEqual(snapshotTarget(fixture.targetRoot), before);
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, LOCKFILE_RELATIVE_PATH)), false);
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, MIGRATION_LOCK_RELATIVE_PATH)), false);
  } finally {
    fixture.cleanup();
  }
});

test('migration lock prevents concurrent apply and preserves an existing lock', () => {
  const fixture = createApplyFixture([
    manifestFile(ROUTE_PATH, ROUTE_CURRENT, { kind: 'command', profiles: ['core'] }),
  ], { agentsBlock: false });
  try {
    const lockPath = path.join(fixture.targetRoot, MIGRATION_LOCK_RELATIVE_PATH);
    fs.mkdirSync(path.dirname(lockPath), { recursive: true });
    fs.writeFileSync(lockPath, 'already running\n');
    const plan = makePlan(fixture, {});

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, false);
    assert.equal(result.status, 2);
    assert.equal(result.code, 'migration.concurrent-run');
    assert.equal(fs.readFileSync(lockPath, 'utf8'), 'already running\n');
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, ROUTE_PATH)), false);
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, LOCKFILE_RELATIVE_PATH)), false);
  } finally {
    fixture.cleanup();
  }
});

test('interrupted payload write cleans migration lock and writes no final lockfile ownership', () => {
  const fixture = createApplyFixture([
    manifestFile(ROUTE_PATH, ROUTE_CURRENT, { kind: 'command', profiles: ['core'] }),
  ], { agentsBlock: false });
  try {
    const plan = makePlan(fixture, {});
    fs.mkdirSync(path.join(fixture.targetRoot, ROUTE_PATH), { recursive: true });

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, false);
    assert.equal(result.code, 'migration.apply-failed');
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, LOCKFILE_RELATIVE_PATH)), false);
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, MIGRATION_LOCK_RELATIVE_PATH)), false);
    const parentEntries = fs.readdirSync(path.dirname(path.join(fixture.targetRoot, ROUTE_PATH)));
    assert.deepEqual(parentEntries.filter((entry) => entry.startsWith('route-domain.md.tmp-')), []);
    assert.equal(fs.statSync(path.join(fixture.targetRoot, ROUTE_PATH)).isDirectory(), true);
  } finally {
    fixture.cleanup();
  }
});

test('AGENTS whole-file overwrite is refused for existing project content', () => {
  const fixture = createApplyFixture([], { agentsBlock: true });
  try {
    const projectAgents = '# Project AGENTS\n\nProject notes.\n';
    writeTarget(fixture.targetRoot, 'AGENTS.md', projectAgents);
    const plan = makePlan(fixture, { 'AGENTS.md': { content: projectAgents } });
    plan.plannedWrites.find((entry) => entry.path === 'AGENTS.md').content = buildAgentsManagedBlock();

    const result = applyFixturePlan(fixture, plan);

    assert.equal(result.ok, false);
    assert.equal(fs.readFileSync(path.join(fixture.targetRoot, 'AGENTS.md'), 'utf8'), projectAgents);
    assert.equal(fs.existsSync(path.join(fixture.targetRoot, LOCKFILE_RELATIVE_PATH)), false);
  } finally {
    fixture.cleanup();
  }
});

function applyFixturePlan(fixture, plan) {
  return applyMigrationPlan({
    targetRoot: fixture.targetRoot,
    packageRoot: fixture.packageRoot,
    manifest: fixture.manifest,
    plan,
  });
}

function createApplyFixture(files, options = {}) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode/omo-toolkit-v06-apply-'));
  const packageRoot = path.join(tempRoot, 'package');
  const targetRoot = path.join(tempRoot, 'target');
  fs.mkdirSync(packageRoot, { recursive: true });
  fs.mkdirSync(targetRoot, { recursive: true });
  const manifest = sampleManifest(files, options);
  for (const file of files) writePackage(packageRoot, file.path, contentForHash(file.sha256));
  return { tempRoot, packageRoot, targetRoot, manifest, cleanup: () => fs.rmSync(tempRoot, { recursive: true, force: true }) };
}

function contentForHash(sha256Value) {
  const content = CURRENT_CONTENT_BY_HASH.get(sha256Value);
  if (!content) throw new Error(`Missing fixture content for hash ${sha256Value}`);
  return content;
}

function makePlan(fixture, targetFiles, historicalHashRegistry = emptyRegistry()) {
  return planMigration({ historicalHashRegistry, manifest: fixture.manifest, mode: 'apply', now: NOW, targetFiles });
}

function sampleManifest(files, options = {}) {
  const agentsBlock = options.agentsBlock === false ? undefined : {
    beginMarker: BEGIN_MARKER,
    endMarker: END_MARKER,
    kind: 'template',
    path: 'src/cli/templates/agents-managed-block.md',
    profiles: ['core', 'full'],
    sha256: agentsBlockSha256(),
    strategy: 'merge-managed-block',
  };
  return {
    schema: 1,
    toolkit: { version: '0.6.0' },
    source: { gitCommit: 'abc123' },
    profiles: {
      core: { default: true, agentsBlock: options.agentsBlock !== false },
      full: { default: true, agentsBlock: options.agentsBlock !== false },
    },
    files,
    agentsBlock,
  };
}

function manifestFile(filePath, content, options) {
  CURRENT_CONTENT_BY_HASH.set(sha256(content), content);
  const buffer = Buffer.from(content, 'utf8');
  const hashed = hashBuffer(buffer, { executable: options.mode === '100755' });
  return {
    kind: options.kind,
    mode: options.mode ?? '100644',
    owner: 'toolkit',
    path: filePath,
    profiles: options.profiles,
    sha256: hashed.sha256,
    size: hashed.size,
    strategy: options.strategy ?? 'managed',
  };
}

function registryWithFile(filePath, content) {
  return { versions: [{ version: '0.4.0', files: [{ kind: 'reference', mode: '100644', path: filePath, sha256: sha256(content) }] }] };
}

function registryWithAgentsBlock(body) {
  return { versions: [{ version: '0.4.0', agentsBlock: { sha256: agentsBlockSha256(body) }, files: [] }] };
}

function emptyRegistry() {
  return { versions: [] };
}

function writePackage(packageRoot, relativePath, content) {
  const filePath = path.join(packageRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function writeTarget(targetRoot, relativePath, content) {
  const filePath = path.join(targetRoot, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function readLockfile(targetRoot) {
  return JSON.parse(fs.readFileSync(path.join(targetRoot, LOCKFILE_RELATIVE_PATH), 'utf8'));
}

function actionFor(plan, action, filePath) {
  const match = plan.actions.find((entry) => entry.action === action && entry.path === filePath);
  assert.ok(match, `Expected ${action} for ${filePath}`);
  return match;
}

function sha256(content) {
  return hashBuffer(Buffer.from(content, 'utf8')).sha256;
}

function snapshotTarget(targetRoot) {
  const entries = [];
  collectSnapshot(targetRoot, targetRoot, entries);
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
      entries.push({ path: relative, type: 'file', hash: hashFile(absolute).sha256 });
    }
  }
}

function countOccurrences(content, needle) {
  let count = 0;
  let searchFrom = 0;
  while (searchFrom < content.length) {
    const matchIndex = content.indexOf(needle, searchFrom);
    if (matchIndex === -1) break;
    count += 1;
    searchFrom = matchIndex + needle.length;
  }
  return count;
}
