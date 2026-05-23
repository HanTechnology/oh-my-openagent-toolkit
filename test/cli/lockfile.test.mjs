import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { BEGIN_MARKER, END_MARKER, agentsBlockSha256 } from '../../src/cli/core/agents-block.mjs';
import { hashBuffer } from '../../src/cli/core/hash.mjs';
import {
  LOCKFILE_ERRORS,
  LOCKFILE_RELATIVE_PATH,
  LOCKFILE_SCHEMA_VERSION,
  LockfileError,
  buildLockfile,
  buildLockfileFileRecord,
  lockfileToJson,
  manifestSha256,
  parseLockfileContent,
  resolveLockfilePath,
  validateLockfile,
} from '../../src/cli/core/lockfile.mjs';
import { fixturePath } from './helpers/temp-target.mjs';

const NOW = '2026-05-22T00:00:00.000Z';

test('resolves the project-local lockfile path under .opencode', () => {
  const targetRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-lockfile-path-'));
  const expectedPath = path.join(targetRoot, '.opencode', 'oh-my-openagent-toolkit.lock.json');

  assert.equal(LOCKFILE_SCHEMA_VERSION, 1);
  assert.equal(LOCKFILE_RELATIVE_PATH, '.opencode/oh-my-openagent-toolkit.lock.json');
  assert.equal(resolveLockfilePath(targetRoot), expectedPath);
  assert.equal(fs.existsSync(expectedPath), false);
});

test('builds schema v1 lockfiles with required top-level and file fields', () => {
  const manifest = sampleManifest();
  const entry = manifest.files[0];
  const fileRecord = buildLockfileFileRecord(entry, {
    installedAt: NOW,
    lastAction: 'create',
    profile: 'core',
  });
  const lockfile = buildLockfile({
    files: [fileRecord],
    manifest,
    now: NOW,
    profile: 'core',
  });

  assert.equal(lockfile.schema, 1);
  assert.equal(lockfile.toolkit.version, '0.4.0');
  assert.equal(lockfile.toolkit.packageVersion, '0.4.0');
  assert.equal(lockfile.toolkit.sourceCommit, 'abc123');
  assert.equal(lockfile.manifest.sha256, manifestSha256(manifest));
  assert.equal(lockfile.profile, 'core');
  assert.equal(lockfile.installedAt, NOW);
  assert.equal(lockfile.updatedAt, NOW);
  assert.deepEqual(lockfile.overrides, { localOnly: [], skip: [] });
  assert.equal(lockfile.agentsBlock.sha256, agentsBlockSha256());

  assert.deepEqual(Object.keys(lockfile.files[0]).sort(), [
    'installedAt',
    'lastAction',
    'mode',
    'path',
    'profile',
    'sha256',
    'sourceSha256',
    'strategy',
  ]);
  assert.equal(lockfile.files[0].path, '.opencode/commands/route-domain.md');
  assert.equal(lockfile.files[0].sha256, entry.sha256);
  assert.equal(lockfile.files[0].sourceSha256, entry.sha256);
  assert.equal(lockfile.files[0].lastAction, 'create');
});

test('serializes and parses valid lockfiles deterministically', () => {
  const manifest = sampleManifest();
  const lockfile = buildLockfile({
    files: [buildLockfileFileRecord(manifest.files[0], { installedAt: NOW, lastAction: 'noop', profile: 'core' })],
    manifest,
    now: NOW,
  });

  const content = lockfileToJson(lockfile);
  assert.equal(content.endsWith('\n'), true);
  assert.deepEqual(parseLockfileContent(content), lockfile);
});

test('reports stable lockfile parse and schema errors', () => {
  const invalidContent = fs.readFileSync(fixturePath('invalid-lockfile', '.omo', 'lockfile.json'), 'utf8');
  assert.throws(() => parseLockfileContent(invalidContent), {
    name: 'LockfileError',
    code: LOCKFILE_ERRORS.INVALID_JSON,
  });

  assert.throws(
    () => validateLockfile({ ...buildLockfile({ manifest: sampleManifest(), now: NOW }), schema: 2 }),
    {
      name: 'LockfileError',
      code: LOCKFILE_ERRORS.UNSUPPORTED_SCHEMA,
    }
  );
  assert.throws(() => parseLockfileContent('[]'), LockfileError);
});

function sampleManifest() {
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
        agentsBlock: true,
      },
    },
    files: [
      manifestFile('.opencode/commands/route-domain.md', 'route command\n', {
        kind: 'command',
        profiles: ['core'],
      }),
    ],
    agentsBlock: {
      beginMarker: BEGIN_MARKER,
      endMarker: END_MARKER,
      kind: 'template',
      path: 'src/cli/templates/agents-managed-block.md',
      profiles: ['core'],
      sha256: agentsBlockSha256(),
      strategy: 'merge-managed-block',
    },
  };
}

function manifestFile(filePath, content, options) {
  const buffer = Buffer.from(content, 'utf8');
  const hashed = hashBuffer(buffer);
  return {
    kind: options.kind,
    mode: '100644',
    owner: 'toolkit',
    path: filePath,
    profiles: options.profiles,
    sha256: hashed.sha256,
    size: hashed.size,
    strategy: options.strategy ?? 'managed',
  };
}
