import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BEGIN_MARKER,
  END_MARKER,
  agentsBlockSha256,
  buildAgentsManagedBlock,
  buildPackagedAgentsGuideWithManagedBlock,
} from '../../src/cli/core/agents-block.mjs';
import { hashBuffer, hashFile } from '../../src/cli/core/hash.mjs';
import {
  findHistoricalFileHash,
  isKnownHistoricalFileHash,
  loadHistoricalHashRegistry,
} from '../../src/cli/core/historical-hashes.mjs';
import {
  LOCKFILE_RELATIVE_PATH,
  buildLockfile,
  buildLockfileFileRecord,
  manifestSha256,
} from '../../src/cli/core/lockfile.mjs';
import {
  MIGRATION_ACTIONS,
  MIGRATION_RULES,
  planMigration,
} from '../../src/cli/core/migration-plan.mjs';
import { fixturePath } from './helpers/temp-target.mjs';

const KNOWN_PATH = '.opencode/commands/route-domain.md';
const SAME_HASH_WRONG_PATH = '.opencode/reference/same-hash.md';
const NOW = '2026-05-23T00:00:00.000Z';

const EXPECTED_ACTION_VALUES = Object.freeze([
  'adopt-identical',
  'replace-known-stale',
  'create-missing',
  'preserve-project-owned',
  'needs-review',
  'unsafe-conflict',
  'agents-insert',
  'agents-adopt',
  'agents-replace',
  'lockfile-write',
  'noop',
]);

const KNOWN_ACTIONS = new Set(EXPECTED_ACTION_VALUES);

test('historical hash requires exact path and sha256', () => {
  const registry = loadHistoricalHashRegistry();
  const knownHash = hashFile(fixturePath('historical-known-old', KNOWN_PATH)).sha256;
  const sameHashWrongPath = hashFile(fixturePath('historical-known-old', SAME_HASH_WRONG_PATH)).sha256;

  assert.equal(knownHash, sameHashWrongPath);
  assert.equal(isKnownHistoricalFileHash(KNOWN_PATH, knownHash, registry), true);
  assert.equal(isKnownHistoricalFileHash(SAME_HASH_WRONG_PATH, sameHashWrongPath, registry), false);
  assert.equal(isKnownHistoricalFileHash(KNOWN_PATH, '0'.repeat(64), registry), false);

  const match = findHistoricalFileHash(KNOWN_PATH, knownHash, registry);
  assert.equal(typeof match.version, 'string');
  assert.equal(match.file.path, KNOWN_PATH);
});

test('exports exact migration action constants', () => {
  assert.deepEqual(Object.values(MIGRATION_ACTIONS), EXPECTED_ACTION_VALUES);
});

test('plans manifest adoption, stale replacement, manifest review, project preservation, and lockfile write', () => {
  const adoptEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const replaceEntry = manifestFile('.opencode/reference/support-policy.md', 'support current\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const createEntry = manifestFile('.opencode/reference/workflow-catalog.md', 'workflow current\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const preserveEntry = manifestFile('.opencode/oh-my-openagent.jsonc', '{"toolkit":true}\n', {
    kind: 'plugin-config',
    profiles: ['core'],
  });
  const historicalContent = 'support old\n';
  const localOnlyPath = '.opencode/skills/custom/SKILL.md';

  const plan = planMigration({
    historicalHashRegistry: registryWithFile(replaceEntry.path, historicalContent),
    manifest: sampleManifest([adoptEntry, replaceEntry, createEntry, preserveEntry]),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [adoptEntry.path]: 'route current\n',
      [replaceEntry.path]: historicalContent,
      [preserveEntry.path]: '{"project":true}\n',
      [localOnlyPath]: '# Local skill\n',
      'AGENTS.md': buildAgentsManagedBlock(),
    },
  });

  assert.equal(plan.ok, true);
  assert.equal(plan.blocked, false);
  assertKnownActions(plan);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.ADOPT_IDENTICAL, adoptEntry.path).write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.REPLACE_KNOWN_STALE, replaceEntry.path).write, true);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, true);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.NEEDS_REVIEW, preserveEntry.path).write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.PRESERVE_PROJECT_OWNED, localOnlyPath).write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.AGENTS_ADOPT, 'AGENTS.md').write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH).write, true);
  assert.deepEqual(
    plan.lockfile.files.map((file) => [file.path, file.lastAction]),
    [
      [adoptEntry.path, MIGRATION_ACTIONS.ADOPT_IDENTICAL],
      [replaceEntry.path, MIGRATION_ACTIONS.REPLACE_KNOWN_STALE],
      [createEntry.path, MIGRATION_ACTIONS.CREATE_MISSING],
    ]
  );
  assert.deepEqual(plan.lockfile.overrides.localOnly, [preserveEntry.path, localOnlyPath].sort());
  assert.deepEqual(new Set(plan.plannedWrites.map((write) => write.action)), new Set([
    MIGRATION_ACTIONS.REPLACE_KNOWN_STALE,
    MIGRATION_ACTIONS.CREATE_MISSING,
    MIGRATION_ACTIONS.LOCKFILE_WRITE,
  ]));
  assert.equal(plan.plannedWrites.some((write) => write.path === preserveEntry.path), false);
  assert.equal(plan.plannedWrites.some((write) => write.path === localOnlyPath), false);
});

test('lock-owned current migration plans no writes and preserves previous lockfile', () => {
  const routeEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const manifest = sampleManifest([routeEntry]);
  const lockfileAgentsBlock = {
    beginMarker: BEGIN_MARKER,
    endMarker: END_MARKER,
    sha256: agentsBlockSha256(),
  };
  const previousLockfile = buildLockfile({
    agentsBlock: lockfileAgentsBlock,
    files: [buildLockfileFileRecord(routeEntry, {
      installedAt: NOW,
      lastAction: MIGRATION_ACTIONS.CREATE_MISSING,
      profile: 'core',
    })],
    manifest: { ...manifest, agentsBlock: lockfileAgentsBlock },
    manifestSha256: manifestSha256(manifest),
    now: NOW,
    profile: 'core',
    toolkit: {
      version: manifest.toolkit.version,
      packageVersion: manifest.toolkit.version,
      sourceCommit: manifest.source.gitCommit,
    },
  });

  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    lockfile: previousLockfile,
    manifest,
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [routeEntry.path]: 'route current\n',
      'AGENTS.md': buildAgentsManagedBlock(),
    },
  });

  assert.equal(plan.ok, true);
  assert.equal(plan.blocked, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.NOOP, routeEntry.path).write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.NOOP, 'AGENTS.md').ruleId, 'agents.current-managed-block');
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.ADOPT_IDENTICAL, routeEntry.path), false);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.AGENTS_ADOPT, 'AGENTS.md'), false);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH), false);
  assert.deepEqual(plan.plannedWrites, []);
  assert.deepEqual(plan.lockfile, previousLockfile);
});

test('dry-run and diff modes produce no planned writes while preserving the lockfile plan', () => {
  const createEntry = manifestFile('.opencode/reference/routing-matrix.md', 'routing current\n', {
    kind: 'reference',
    profiles: ['core'],
  });

  for (const mode of ['dry-run', 'diff']) {
    const plan = planMigration({
      historicalHashRegistry: emptyRegistry(),
      manifest: sampleManifest([createEntry]),
      mode,
      now: NOW,
      targetFiles: {},
    });

    assert.equal(plan.ok, true);
    assert.equal(plan.mode, mode);
    assert.equal(plan.plannedWrites.length, 0);
    assert.equal(plan.actions.every((action) => action.write === false), true);
    assert.equal(hasAction(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH), true);
    assert.ok(plan.lockfileContent.includes('"localOnly": []'));
  }
});

test('AGENTS missing and historical managed block produce AGENTS-specific migration actions', () => {
  const insertPlan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([]),
    mode: 'apply',
    now: NOW,
    targetFiles: {},
  });

  const insert = actionFor(insertPlan, MIGRATION_ACTIONS.AGENTS_INSERT, 'AGENTS.md');
  assert.equal(insert.write, true);
  assert.equal(insert.content, buildPackagedAgentsGuideWithManagedBlock());
  assert.equal(countOccurrences(insert.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(insert.content, END_MARKER), 1);
  assert.equal(hasAction(insertPlan, MIGRATION_ACTIONS.CREATE_MISSING, 'AGENTS.md'), false);
  assert.equal(insertPlan.plannedWrites.some((write) => write.path === 'AGENTS.md'), true);

  const historicalBody = 'Historical managed block.\n';
  const historicalContent = `${buildAgentsManagedBlock({ body: historicalBody })}Project suffix.\n`;
  const replacePlan = planMigration({
    historicalHashRegistry: registryWithAgentsBlock(historicalBody),
    manifest: sampleManifest([]),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      'AGENTS.md': historicalContent,
    },
  });

  const replace = actionFor(replacePlan, MIGRATION_ACTIONS.AGENTS_REPLACE, 'AGENTS.md');
  assert.equal(replace.write, true);
  assert.equal(replace.ruleId, 'agents.historical-managed-block');
  assert.match(replace.content, /Project suffix\./);
  assert.equal(countOccurrences(replace.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(replace.content, END_MARKER), 1);
});

test('unsafe-conflict blocks all writes', () => {
  const createEntry = manifestFile('.opencode/reference/workspace-model.md', 'workspace current\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const duplicateAgents = `${buildAgentsManagedBlock()}\n${buildAgentsManagedBlock()}`;
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([createEntry]),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      'AGENTS.md': duplicateAgents,
    },
  });

  const conflict = actionFor(plan, MIGRATION_ACTIONS.UNSAFE_CONFLICT, 'AGENTS.md');
  assert.equal(plan.ok, false);
  assert.equal(plan.blocked, true);
  assert.equal(conflict.ruleId, 'agents.duplicate-block');
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, false);
  assert.equal(plan.conflicts.length, 1);
  assert.equal(plan.lockfile, null);
  assert.equal(plan.lockfileContent, null);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH), false);
  assert.equal(plan.plannedWrites.length, 0);
});

test('directory where manifest file is expected emits unsafe-conflict and blocks all writes', () => {
  const directoryEntry = manifestFile('.opencode/reference/workspace-model.md', 'workspace current\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const createEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([directoryEntry, createEntry], { agentsBlock: false }),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [directoryEntry.path]: { type: 'directory', sha256: '0'.repeat(64) },
    },
  });

  const conflict = actionFor(plan, MIGRATION_ACTIONS.UNSAFE_CONFLICT, directoryEntry.path);
  assert.equal(plan.ok, false);
  assert.equal(plan.blocked, true);
  assert.equal(conflict.ruleId, MIGRATION_RULES.TARGET_DIRECTORY);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.NEEDS_REVIEW, directoryEntry.path), false);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.PRESERVE_PROJECT_OWNED, directoryEntry.path), false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, false);
  assert.equal(plan.conflicts.length, 1);
  assert.equal(plan.lockfile, null);
  assert.equal(plan.lockfileContent, null);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH), false);
  assert.equal(plan.plannedWrites.length, 0);
});

test('unsafe non-manifest managed-root entry emits unsafe-conflict and blocks all writes', () => {
  const createEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const unsafePath = '.opencode/reference/project-symlink.md';
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([createEntry], { agentsBlock: false }),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [unsafePath]: { isSymbolicLink: true },
    },
  });

  const conflict = actionFor(plan, MIGRATION_ACTIONS.UNSAFE_CONFLICT, unsafePath);
  assert.equal(plan.ok, false);
  assert.equal(plan.blocked, true);
  assert.equal(conflict.ruleId, MIGRATION_RULES.TARGET_SYMLINK);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.PRESERVE_PROJECT_OWNED, unsafePath), false);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.NEEDS_REVIEW, unsafePath), false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, false);
  assert.equal(plan.lockfile, null);
  assert.equal(plan.plannedWrites.length, 0);
});

test('invalid target snapshot path emits unsafe-conflict instead of throwing', () => {
  const createEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const invalidPath = '../outside.md';
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([createEntry], { agentsBlock: false }),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [invalidPath]: { type: 'file', sha256: '0'.repeat(64) },
    },
  });

  const conflict = actionFor(plan, MIGRATION_ACTIONS.UNSAFE_CONFLICT, invalidPath);
  assert.equal(plan.ok, false);
  assert.equal(plan.blocked, true);
  assert.equal(conflict.ruleId, MIGRATION_RULES.TARGET_INVALID_PATH);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, false);
  assert.equal(plan.lockfile, null);
  assert.equal(plan.lockfileContent, null);
  assert.equal(plan.plannedWrites.length, 0);
});

test('active manifest unknown hash emits needs-review and allows safe unrelated writes', () => {
  const createEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const reviewEntry = manifestFile('.opencode/reference/project-setup-policy.md', 'policy current\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([createEntry, reviewEntry], { agentsBlock: false }),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [reviewEntry.path]: '# Project-owned replacement\n',
    },
  });

  const review = actionFor(plan, MIGRATION_ACTIONS.NEEDS_REVIEW, reviewEntry.path);
  assert.equal(plan.ok, true);
  assert.equal(plan.blocked, false);
  assert.equal(review.review, true);
  assert.equal(review.write, false);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.PRESERVE_PROJECT_OWNED, reviewEntry.path), false);
  assert.deepEqual(plan.lockfile.overrides.localOnly, [reviewEntry.path]);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, true);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH).write, true);
  assert.deepEqual(new Set(plan.plannedWrites.map((write) => write.path)), new Set([createEntry.path, LOCKFILE_RELATIVE_PATH]));
});

test('non-manifest managed-root files emit preserve-project-owned and allow safe unrelated writes', () => {
  const createEntry = manifestFile('.opencode/commands/route-domain.md', 'route current\n', {
    kind: 'command',
    profiles: ['core'],
  });
  const localOnlyPath = '.opencode/reference/project-only.md';
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([createEntry], { agentsBlock: false }),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      [localOnlyPath]: '# Project only\n',
    },
  });

  const preserved = actionFor(plan, MIGRATION_ACTIONS.PRESERVE_PROJECT_OWNED, localOnlyPath);
  assert.equal(plan.ok, true);
  assert.equal(plan.blocked, false);
  assert.equal(preserved.review, true);
  assert.equal(preserved.write, false);
  assert.equal(hasAction(plan, MIGRATION_ACTIONS.NEEDS_REVIEW, localOnlyPath), false);
  assert.deepEqual(plan.lockfile.overrides.localOnly, [localOnlyPath]);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, true);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH).write, true);
  assert.deepEqual(new Set(plan.plannedWrites.map((write) => write.path)), new Set([createEntry.path, LOCKFILE_RELATIVE_PATH]));
});

test('AGENTS needs-review does not block safe unrelated writes', () => {
  const createEntry = manifestFile('.opencode/reference/support-policy.md', 'support current\n', {
    kind: 'reference',
    profiles: ['core'],
  });
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([createEntry]),
    mode: 'apply',
    now: NOW,
    targetFiles: {
      'AGENTS.md': '# Project AGENTS\n\nOMO Toolkit says to read `.opencode/reference/routing-matrix.md` first.\n',
    },
  });

  const review = actionFor(plan, MIGRATION_ACTIONS.NEEDS_REVIEW, 'AGENTS.md');
  assert.equal(plan.ok, true);
  assert.equal(plan.blocked, false);
  assert.equal(review.ruleId, 'agents.unmarked-toolkit-text');
  assert.equal(review.write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.CREATE_MISSING, createEntry.path).write, true);
  assert.equal(plan.plannedWrites.some((write) => write.path === 'AGENTS.md'), false);
  assert.equal(plan.plannedWrites.some((write) => write.path === createEntry.path), true);
});

test('noop is emitted when AGENTS migration is not required', () => {
  const plan = planMigration({
    historicalHashRegistry: emptyRegistry(),
    manifest: sampleManifest([], { agentsBlock: false }),
    mode: 'apply',
    now: NOW,
    targetFiles: {},
  });

  const noop = actionFor(plan, MIGRATION_ACTIONS.NOOP, 'AGENTS.md');
  assert.equal(plan.ok, true);
  assert.equal(noop.ruleId, MIGRATION_RULES.AGENTS_NOT_REQUIRED);
  assert.equal(noop.write, false);
  assert.equal(actionFor(plan, MIGRATION_ACTIONS.LOCKFILE_WRITE, LOCKFILE_RELATIVE_PATH).write, true);
});

function sampleManifest(files, options = {}) {
  const agentsBlock = options.agentsBlock === false
    ? undefined
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
      version: '0.6.0',
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
    agentsBlock,
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

function emptyRegistry() {
  return { versions: [] };
}

function registryWithFile(filePath, content) {
  return {
    versions: [
      {
        version: '0.4.0',
        files: [
          {
            kind: 'reference',
            mode: '100644',
            path: filePath,
            sha256: sha256(content),
          },
        ],
      },
    ],
  };
}

function registryWithAgentsBlock(body) {
  return {
    versions: [
      {
        version: '0.4.0',
        agentsBlock: { sha256: agentsBlockSha256(body) },
        files: [],
      },
    ],
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

function assertKnownActions(plan) {
  assert.deepEqual(
    plan.actions.filter((action) => !KNOWN_ACTIONS.has(action.action)),
    []
  );
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
