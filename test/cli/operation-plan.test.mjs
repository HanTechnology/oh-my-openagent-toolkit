import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  AGENTS_BLOCK_CONFLICTS,
  BEGIN_MARKER,
  END_MARKER,
  agentsBlockSha256,
  buildAgentsManagedBlock,
} from '../../src/cli/core/agents-block.mjs';
import { hashBuffer } from '../../src/cli/core/hash.mjs';
import { LOCKFILE_RELATIVE_PATH } from '../../src/cli/core/lockfile.mjs';
import {
  OPERATION_ACTIONS,
  OPERATION_RULES,
  planOperations,
} from '../../src/cli/core/operation-plan.mjs';
import { createTempTargetFromFixture, fixturePath } from './helpers/temp-target.mjs';

const NOW = '2026-05-22T00:00:00.000Z';
const KNOWN_ACTIONS = new Set(Object.values(OPERATION_ACTIONS));

test('plans create, opt-in skip, AGENTS insert, and lockfile write without touching the target', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const beforeEntries = fs.readdirSync(temp.target);
    const managedEntry = manifestFile('.opencode/commands/route-domain.md', 'route command\n', {
      kind: 'command',
      profiles: ['core'],
    });
    const optInEntry = manifestFile('README.md', 'project readme\n', {
      kind: 'root-doc',
      profiles: ['opt-in'],
      strategy: 'opt-in',
    });
    const plan = planOperations({
      agentsContent: null,
      manifest: sampleManifest([managedEntry, optInEntry]),
      now: NOW,
      targetFiles: {},
    });

    assert.equal(plan.ok, true);
    assertKnownActions(plan);
    assert.equal(actionFor(plan, OPERATION_ACTIONS.CREATE, managedEntry.path).write, true);
    assert.equal(actionFor(plan, OPERATION_ACTIONS.SKIP_OPT_IN, optInEntry.path).write, false);
    const agentsInsert = actionFor(plan, OPERATION_ACTIONS.AGENTS_INSERT, 'AGENTS.md');
    assert.equal(agentsInsert.write, true);
    assert.equal(agentsInsert.sourceState, 'missing-file');
    assert.match(agentsInsert.content, /^# AGENTS Guide/m);
    assert.equal(countOccurrences(agentsInsert.content, BEGIN_MARKER), 1);
    assert.notEqual(agentsInsert.content, buildAgentsManagedBlock());
    assert.equal(actionFor(plan, OPERATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH).write, true);
    assert.deepEqual(plan.lockfile.overrides.skip, ['README.md']);
    assert.equal(plan.lockfile.files[0].lastAction, OPERATION_ACTIONS.CREATE);
    assert.equal(plan.plannedWrites.length, 3);
    assert.deepEqual(fs.readdirSync(temp.target), beforeEntries);
  } finally {
    temp.cleanup();
  }
});



test('distinguishes missing target AGENTS from existing empty, whitespace, and non-empty files', () => {
  const cases = [
    { name: 'missing', targetFiles: {}, sourceState: 'missing-file', fullGuide: true },
    { name: 'empty', targetFiles: { 'AGENTS.md': '' }, sourceState: 'existing-empty', fullGuide: false },
    { name: 'whitespace', targetFiles: { 'AGENTS.md': '  \n\t' }, sourceState: 'existing-whitespace', fullGuide: false },
    { name: 'non-empty', targetFiles: { 'AGENTS.md': '# Project AGENTS\n\nKeep this.\n' }, sourceState: 'existing-non-empty', fullGuide: false },
  ];

  for (const entry of cases) {
    const plan = planOperations({
      manifest: sampleManifest([]),
      now: NOW,
      targetFiles: entry.targetFiles,
    });
    const agentsInsert = actionFor(plan, OPERATION_ACTIONS.AGENTS_INSERT, 'AGENTS.md');
    assert.equal(plan.ok, true, entry.name);
    assert.equal(agentsInsert.sourceState, entry.sourceState, entry.name);
    assert.equal(agentsInsert.content.includes('# AGENTS Guide'), entry.fullGuide, entry.name);
    assert.equal(countOccurrences(agentsInsert.content, BEGIN_MARKER), 1, entry.name);
    assert.equal(countOccurrences(agentsInsert.content, END_MARKER), 1, entry.name);
  }
});


test('missing target full guide is idempotent with returned lockfile', () => {
  const first = planOperations({
    manifest: sampleManifest([]),
    now: NOW,
    targetFiles: {},
  });
  const firstWrite = first.plannedWrites.find((entry) => entry.path === 'AGENTS.md');
  assert.equal(first.ok, true);
  assert.ok(firstWrite?.content.includes('# AGENTS Guide'));
  assert.equal(countOccurrences(firstWrite.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(firstWrite.content, END_MARKER), 1);

  const second = planOperations({
    manifest: sampleManifest([]),
    lockfile: first.lockfile,
    now: '2026-05-22T00:00:01.000Z',
    targetFiles: {
      'AGENTS.md': firstWrite.content,
    },
  });

  const agentsNoop = actionFor(second, OPERATION_ACTIONS.NOOP, 'AGENTS.md');
  assert.equal(second.ok, true);
  assert.equal(agentsNoop.ruleId, OPERATION_RULES.AGENTS_CURRENT);
  assert.equal(agentsNoop.sourceState, 'existing-non-empty');
  assert.equal(second.plannedWrites.some((write) => write.path === 'AGENTS.md'), false);
});

test('throws instead of falling back when missing AGENTS needs an unavailable packaged guide', () => {
  const temp = fs.mkdtempSync('/tmp/omo-operation-plan-missing-guide-');
  try {
    assert.throws(
      () => planOperations({
        agentsGuidePackageRoot: temp,
        manifest: sampleManifest([]),
        now: NOW,
        targetFiles: {},
      }),
      /AGENTS\.md/
    );
  } finally {
    fs.rmSync(temp, { force: true, recursive: true });
  }
});

test('toolkit manifest does not manage root AGENTS as a normal file entry', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../../toolkit-manifest.json', import.meta.url), 'utf8'));
  assert.equal(manifest.files.some((entry) => entry.path === 'AGENTS.md'), false);
  assert.equal(manifest.agentsBlock.path, 'src/cli/templates/agents-managed-block.md');
});

test('preserves explicit manifest source identity digest', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route command\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const explicitDigest = '1'.repeat(64);
  const plan = planOperations({
    agentsContent: null,
    manifest: sampleManifest([routeEntry]),
    manifestSha256: explicitDigest,
    now: NOW,
    targetFiles: {},
  });

  assert.equal(plan.ok, true);
  assert.equal(plan.lockfile.manifest.sha256, explicitDigest);
});

test('uses old lockfile hashes for replace and new manifest hashes for noop', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route new\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const configEntry = manifestFile('.opencode/oh-my-openagent.jsonc', '{"new":true}\n', {
    kind: 'plugin-config',
    profiles: ['core'],
  });
  const previousLockfile = previousLockfileFor([
    lockRecord(routeEntry, sha256('route old\n')),
    lockRecord(configEntry, configEntry.sha256),
  ]);
  const plan = planOperations({
    manifest: sampleManifest([routeEntry, configEntry]),
    lockfile: previousLockfile,
    now: NOW,
    targetFiles: {
      '.opencode/commands/route-domain.md': 'route old\n',
      '.opencode/oh-my-openagent.jsonc': '{"new":true}\n',
      'AGENTS.md': buildAgentsManagedBlock(),
    },
  });

  assert.equal(plan.ok, true);
  assert.equal(actionFor(plan, OPERATION_ACTIONS.REPLACE, routeEntry.path).write, true);
  assert.equal(actionFor(plan, OPERATION_ACTIONS.NOOP, configEntry.path).write, false);
  assert.equal(actionFor(plan, OPERATION_ACTIONS.NOOP, 'AGENTS.md').ruleId, OPERATION_RULES.AGENTS_CURRENT);
  assert.deepEqual(
    plan.lockfile.files.map((file) => [file.path, file.lastAction]),
    [
      [routeEntry.path, OPERATION_ACTIONS.REPLACE],
      [configEntry.path, OPERATION_ACTIONS.NOOP],
    ]
  );
});

test('reports managed local modifications and suppresses all planned writes', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route new\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const configEntry = manifestFile('.opencode/oh-my-openagent.jsonc', '{"new":true}\n', {
    kind: 'plugin-config',
    profiles: ['core'],
  });
  const plan = planOperations({
    agentsContent: null,
    manifest: sampleManifest([routeEntry, configEntry]),
    lockfile: previousLockfileFor([
      lockRecord(routeEntry, sha256('route old\n')),
      lockRecord(configEntry, sha256('{"old":true}\n')),
    ]),
    now: NOW,
    targetFiles: {
      '.opencode/commands/route-domain.md': 'route local edit\n',
    },
  });

  const conflict = actionFor(plan, OPERATION_ACTIONS.CONFLICT_LOCAL_MODIFICATION, routeEntry.path);
  assert.equal(plan.ok, false);
  assert.equal(conflict.ruleId, OPERATION_RULES.FILE_LOCAL_MODIFICATION);
  assert.equal(actionFor(plan, OPERATION_ACTIONS.CREATE, configEntry.path).write, false);
  assert.equal(hasAction(plan, OPERATION_ACTIONS.LOCKFILE_WRITE), false);
  assert.equal(plan.plannedWrites.length, 0);
});

test('plans local deletion of a lock-owned managed file as a safe restore', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route restored\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const plan = planOperations({
    manifest: sampleManifest([routeEntry]),
    lockfile: previousLockfileFor([lockRecord(routeEntry, sha256('route installed\n'))]),
    now: NOW,
    targetFiles: {
      'AGENTS.md': buildAgentsManagedBlock(),
    },
  });

  const restore = actionFor(plan, OPERATION_ACTIONS.CREATE, routeEntry.path);
  assert.equal(plan.ok, true);
  assert.equal(restore.reason, 'target missing');
  assert.equal(restore.write, true);
  assert.equal(hasAction(plan, OPERATION_ACTIONS.DELETE_CANDIDATE, routeEntry.path), false);
});

test('treats active manifest localOnly paths as project-owned instead of managed writes', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route new\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const previousLockfile = previousLockfileFor([lockRecord(routeEntry, sha256('route old\n'))]);
  previousLockfile.overrides.localOnly = [routeEntry.path];

  const presentPlan = planOperations({
    manifest: sampleManifest([routeEntry]),
    lockfile: previousLockfile,
    now: NOW,
    targetFiles: {
      '.opencode/commands/route-domain.md': 'route old\nlocal edit\n',
      'AGENTS.md': buildAgentsManagedBlock(),
    },
  });

  const presentSkip = actionFor(presentPlan, OPERATION_ACTIONS.SKIP_UNMANAGED, routeEntry.path);
  assert.equal(presentPlan.ok, true);
  assert.equal(presentSkip.write, false);
  assert.equal(presentSkip.ruleId, OPERATION_RULES.FILE_LOCAL_ONLY);
  assert.equal(hasAction(presentPlan, OPERATION_ACTIONS.CREATE, routeEntry.path), false);
  assert.equal(hasAction(presentPlan, OPERATION_ACTIONS.REPLACE, routeEntry.path), false);
  assert.equal(presentPlan.plannedWrites.some((write) => write.path === routeEntry.path), false);
  assert.deepEqual(presentPlan.lockfile.files, []);
  assert.deepEqual(presentPlan.lockfile.overrides.localOnly, [routeEntry.path]);

  const missingPlan = planOperations({
    manifest: sampleManifest([routeEntry]),
    lockfile: previousLockfile,
    now: NOW,
    targetFiles: {
      'AGENTS.md': buildAgentsManagedBlock(),
    },
  });

  assert.equal(missingPlan.ok, true);
  assert.equal(hasAction(missingPlan, OPERATION_ACTIONS.CREATE, routeEntry.path), false);
  assert.equal(missingPlan.plannedWrites.some((write) => write.path === routeEntry.path), false);
  assert.deepEqual(missingPlan.lockfile.files, []);
  assert.deepEqual(missingPlan.lockfile.overrides.localOnly, [routeEntry.path]);
});

test('skips unmanaged existing target files instead of overwriting them', () => {
  const unmanagedContent = fs.readFileSync(
    fixturePath('existing-opencode-unmanaged', '.opencode', 'oh-my-openagent.jsonc'),
    'utf8'
  );
  const configEntry = manifestFile('.opencode/oh-my-openagent.jsonc', '{"toolkit":true}\n', {
    kind: 'plugin-config',
    profiles: ['core'],
  });
  const plan = planOperations({
    agentsContent: '# Project AGENTS\n\nKeep local guidance.\n\n## Local Rules\n\n- Preserve this.\n',
    manifest: sampleManifest([configEntry]),
    now: NOW,
    targetFiles: {
      '.opencode/oh-my-openagent.jsonc': unmanagedContent,
    },
  });

  const skipped = actionFor(plan, OPERATION_ACTIONS.SKIP_UNMANAGED, configEntry.path);
  assert.equal(plan.ok, true);
  assert.equal(skipped.write, false);
  assert.equal(hasAction(plan, OPERATION_ACTIONS.CREATE, configEntry.path), false);
  assert.deepEqual(plan.lockfile.files, []);
  assert.deepEqual(plan.lockfile.overrides.localOnly, [configEntry.path]);
  assert.equal(plan.plannedWrites.some((write) => write.path === configEntry.path), false);
});

test('treats missing-lockfile installed-looking assets as recovery conflicts', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route command\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const plan = planOperations({
    agentsContent: null,
    manifest: sampleManifest([routeEntry]),
    now: NOW,
    targetFiles: {
      '.opencode/commands/route-domain.md': 'route command\n',
    },
  });

  const conflict = actionFor(plan, OPERATION_ACTIONS.CONFLICT_LOCAL_MODIFICATION, routeEntry.path);
  assert.equal(plan.ok, false);
  assert.equal(conflict.ruleId, OPERATION_RULES.FILE_MISSING_LOCKFILE_INSTALLED_ASSET);
  assert.equal(hasAction(plan, OPERATION_ACTIONS.LOCKFILE_WRITE), false);
  assert.equal(plan.plannedWrites.length, 0);
});

test('plans source-deleted files as delete candidates only when target matches lockfile', () => {
  const obsoleteRecord = {
    installedAt: NOW,
    lastAction: OPERATION_ACTIONS.CREATE,
    mode: '100644',
    path: '.opencode/reference/obsolete.md',
    profile: 'core',
    sha256: sha256('obsolete old\n'),
    sourceSha256: sha256('obsolete old\n'),
    strategy: 'managed',
  };
  const safeDelete = planOperations({
    manifest: sampleManifest([], { agentsBlock: false }),
    lockfile: previousLockfileFor([obsoleteRecord], { agentsBlock: null }),
    now: NOW,
    targetFiles: {
      '.opencode/reference/obsolete.md': 'obsolete old\n',
    },
  });

  assert.equal(safeDelete.ok, true);
  assert.equal(actionFor(safeDelete, OPERATION_ACTIONS.DELETE_CANDIDATE, obsoleteRecord.path).write, true);
  assert.equal(safeDelete.plannedWrites.find((write) => write.path === obsoleteRecord.path).kind, 'delete');
  assert.deepEqual(safeDelete.lockfile.files, []);

  const conflict = planOperations({
    manifest: sampleManifest([], { agentsBlock: false }),
    lockfile: previousLockfileFor([obsoleteRecord], { agentsBlock: null }),
    now: NOW,
    targetFiles: {
      '.opencode/reference/obsolete.md': 'obsolete local edit\n',
    },
  });
  assert.equal(conflict.ok, false);
  assert.equal(
    actionFor(conflict, OPERATION_ACTIONS.CONFLICT_LOCAL_MODIFICATION, obsoleteRecord.path).ruleId,
    OPERATION_RULES.FILE_SOURCE_DELETED_LOCAL_MODIFICATION
  );
  assert.equal(conflict.plannedWrites.length, 0);
});

test('plans source rename as create new managed path and delete old lock-owned path', () => {
  const renamedEntry = manifestFile('.opencode/reference/new-name.md', 'renamed body\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const oldRecord = {
    installedAt: NOW,
    lastAction: OPERATION_ACTIONS.CREATE,
    mode: '100644',
    path: '.opencode/reference/old-name.md',
    profile: 'core',
    sha256: sha256('old body\n'),
    sourceSha256: sha256('old body\n'),
    strategy: 'managed',
  };
  const plan = planOperations({
    manifest: sampleManifest([renamedEntry], { agentsBlock: false }),
    lockfile: previousLockfileFor([oldRecord], { agentsBlock: null }),
    now: NOW,
    targetFiles: {
      '.opencode/reference/old-name.md': 'old body\n',
    },
  });

  assert.equal(plan.ok, true);
  assert.equal(actionFor(plan, OPERATION_ACTIONS.CREATE, renamedEntry.path).write, true);
  assert.equal(actionFor(plan, OPERATION_ACTIONS.DELETE_CANDIDATE, oldRecord.path).write, true);
  assert.equal(plan.plannedWrites.length, 3);
});

test('dry-run, check, and diff modes return zero planned writes', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route command\n', {
    kind: 'command',
    profiles: ['core'],
  });

  for (const mode of ['dry-run', 'check', 'diff']) {
    const plan = planOperations({
      agentsContent: null,
      manifest: sampleManifest([routeEntry]),
      mode,
      now: NOW,
      targetFiles: {},
    });
    assert.equal(plan.ok, true);
    assert.equal(plan.plannedWrites.length, 0);
    assert.equal(plan.actions.every((action) => action.write === false), true);
    assert.equal(hasAction(plan, OPERATION_ACTIONS.LOCKFILE_WRITE), true);
  }
});

test('propagates AGENTS replace and conflict actions with stable rule IDs', () => {
  const previousBody = 'Previous generated body.\n';
  const staleAgentsPlan = planOperations({
    manifest: sampleManifest([]),
    lockfile: previousLockfileFor([], {
      agentsBlock: { sha256: agentsBlockSha256(previousBody) },
    }),
    now: NOW,
    targetFiles: {
      'AGENTS.md': buildAgentsManagedBlock({ body: previousBody }),
    },
  });

  const replace = actionFor(staleAgentsPlan, OPERATION_ACTIONS.AGENTS_REPLACE, 'AGENTS.md');
  assert.equal(staleAgentsPlan.ok, true);
  assert.equal(replace.ruleId, OPERATION_RULES.AGENTS_STALE);
  assert.equal(replace.write, true);

  const duplicateContent = fs.readFileSync(fixturePath('duplicate-agents-block', 'AGENTS.md'), 'utf8');
  const duplicatePlan = planOperations({
    manifest: sampleManifest([]),
    now: NOW,
    targetFiles: {
      'AGENTS.md': duplicateContent,
    },
  });

  const conflict = actionFor(duplicatePlan, OPERATION_ACTIONS.AGENTS_CONFLICT, 'AGENTS.md');
  assert.equal(duplicatePlan.ok, false);
  assert.equal(conflict.ruleId, AGENTS_BLOCK_CONFLICTS.duplicateBlock);
  assert.equal(duplicatePlan.plannedWrites.length, 0);
});

function sampleManifest(files, options = {}) {
  const agentsBlock = options.agentsBlock === false
    ? false
    : {
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
    toolkit: {
      version: '0.4.0',
    },
    source: {
      gitCommit: 'abc123',
    },
    profiles: {
      core: {
        default: true,
        agentsBlock: options.agentsBlock !== false,
      },
      full: {
        default: true,
        agentsBlock: options.agentsBlock !== false,
      },
    },
    files,
    agentsBlock: agentsBlock || undefined,
  };
}

function manifestFile(filePath, content, options) {
  const buffer = Buffer.from(content, 'utf8');
  const hashed = hashBuffer(buffer);
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

function previousLockfileFor(files, options = {}) {
  return {
    schema: 1,
    toolkit: {
      version: '0.4.0',
      packageVersion: '0.4.0',
      sourceCommit: 'old123',
    },
    manifest: {
      sha256: sha256('old manifest\n'),
    },
    profile: 'core',
    installedAt: NOW,
    updatedAt: NOW,
    files,
    agentsBlock: options.agentsBlock === undefined ? { sha256: agentsBlockSha256() } : options.agentsBlock,
    overrides: {
      skip: [],
      localOnly: [],
    },
  };
}

function lockRecord(entry, sha256Value) {
  return {
    installedAt: NOW,
    lastAction: OPERATION_ACTIONS.CREATE,
    mode: entry.mode,
    path: entry.path,
    profile: 'core',
    sha256: sha256Value,
    sourceSha256: sha256Value,
    strategy: entry.strategy,
  };
}

function sha256(content) {
  return hashBuffer(Buffer.from(content, 'utf8')).sha256;
}

function actionFor(plan, action, filePath) {
  const match = plan.actions.find((entry) => entry.action === action && entry.path === filePath);
  assert.ok(match, `Expected ${action} for ${filePath}`);
  return match;
}

function hasAction(plan, action, filePath = null) {
  return plan.actions.some((entry) => entry.action === action && (filePath === null || entry.path === filePath));
}

function countOccurrences(content, needle) {
  let count = 0;
  let searchFrom = 0;

  while (searchFrom < content.length) {
    const matchIndex = content.indexOf(needle, searchFrom);

    if (matchIndex === -1) {
      break;
    }

    count += 1;
    searchFrom = matchIndex + needle.length;
  }

  return count;
}

function assertKnownActions(plan) {
  assert.deepEqual(
    plan.actions.filter((action) => !KNOWN_ACTIONS.has(action.action)),
    []
  );
}
