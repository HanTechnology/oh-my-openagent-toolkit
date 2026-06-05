import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { manifestSha256 } from '../../src/cli/core/lockfile.mjs';
import { removeTempTarget } from './helpers/temp-target.mjs';

const GENERATED_AT = '2026-06-04T00:00:00.000Z';
const OLD_VERSION = '0.7.0';
const CURRENT_VERSION = '0.8.0';

test('historical hash generation preserves older versions and refreshes the current version once', async () => {
  const packageRoot = createPackageRoot();
  try {
    const { buildHistoricalRegistry } = await loadGeneratorModule();
    const manifest = readJson(path.join(packageRoot, 'toolkit-manifest.json'));
    const oldVersion = historicalVersion(OLD_VERSION, [{
      kind: 'reference',
      mode: '100644',
      path: '.opencode/reference/old.md',
      sha256: '1'.repeat(64),
    }]);
    const staleCurrentVersion = historicalVersion(CURRENT_VERSION, [{
      kind: 'reference',
      mode: '100644',
      path: '.opencode/reference/stale.md',
      sha256: '2'.repeat(64),
    }]);

    const registry = buildHistoricalRegistry(packageRoot, {
      existingRegistry: {
        generatedAt: GENERATED_AT,
        schema: 1,
        versions: [oldVersion, staleCurrentVersion],
      },
      generatedAt: GENERATED_AT,
    });

    assert.equal(registry.schema, 1);
    assert.equal(registry.generatedAt, GENERATED_AT);
    assert.equal(registry.versions.length, 2);
    assert.deepEqual(registry.versions[0], oldVersion);

    const currentVersions = registry.versions.filter((version) => version.version === CURRENT_VERSION);
    assert.equal(currentVersions.length, 1);
    assert.equal(currentVersions[0].manifestSha256, manifestSha256(manifest));
    assert.deepEqual(currentVersions[0].files, [
      {
        kind: 'command',
        mode: '100755',
        path: '.opencode/commands/current.md',
        sha256: '4'.repeat(64),
      },
      {
        kind: 'reference',
        mode: '100644',
        path: '.opencode/reference/current.md',
        sha256: '3'.repeat(64),
      },
    ]);
    assert.deepEqual(currentVersions[0].agentsBlock, { sha256: '5'.repeat(64) });
  } finally {
    removeTempTarget(packageRoot);
  }
});

let generatorModule;

async function loadGeneratorModule() {
  if (generatorModule) return generatorModule;

  const previousArgv = process.argv;
  const previousExitCode = process.exitCode;
  const previousConsoleLog = console.log;
  process.argv = [process.execPath, 'historical-hashes-generator.test.mjs', '--help'];
  console.log = () => {};
  try {
    generatorModule = await import('../../scripts/generate-historical-hashes.mjs');
    return generatorModule;
  } finally {
    process.argv = previousArgv;
    process.exitCode = previousExitCode;
    console.log = previousConsoleLog;
  }
}

function createPackageRoot() {
  const packageRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-historical-hashes-'));
  const manifest = {
    agentsBlock: {
      sha256: '5'.repeat(64),
    },
    files: [
      {
        kind: 'reference',
        mode: '100644',
        path: '.opencode/reference/current.md',
        sha256: '3'.repeat(64),
      },
      {
        kind: 'command',
        mode: '100755',
        path: '.opencode/commands/current.md',
        sha256: '4'.repeat(64),
      },
    ],
    source: {
      generatedAt: GENERATED_AT,
      gitCommit: null,
    },
    schema: 1,
    toolkit: {
      packageName: 'fixture-toolkit',
      version: CURRENT_VERSION,
    },
  };

  fs.writeFileSync(path.join(packageRoot, 'package.json'), `${JSON.stringify({ version: CURRENT_VERSION })}\n`);
  fs.writeFileSync(path.join(packageRoot, 'toolkit-manifest.json'), `${JSON.stringify(manifest)}\n`);
  return packageRoot;
}

function historicalVersion(version, files) {
  return {
    agentsBlock: {
      sha256: 'a'.repeat(64),
    },
    files,
    manifestSha256: 'b'.repeat(64),
    version,
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
