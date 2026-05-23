import assert from 'node:assert/strict';
import test from 'node:test';

import {
  MANIFEST_FILE_KINDS,
  buildToolkitManifest,
  validateManifestFileEntry,
} from '../../src/cli/core/manifest.mjs';

const ALLOWED_FILE_KINDS = new Set(MANIFEST_FILE_KINDS);

test('manifest file kinds use only the schema vocabulary', () => {
  const manifest = buildToolkitManifest({ generatedAt: '2026-05-22T00:00:00.000Z', gitCommit: null });
  const badKinds = manifest.files
    .filter((file) => !ALLOWED_FILE_KINDS.has(file.kind))
    .map((file) => `${file.path}:${file.kind}`);

  assert.deepEqual(badKinds, []);
  assert.equal(fileKind(manifest, '.opencode/oh-my-openagent.jsonc'), 'plugin-config');
  assert.equal(fileKind(manifest, '.mcp.json'), 'plugin-config');
  assert.equal(fileKind(manifest, 'README.md'), 'root-doc');
  assert.equal(fileKind(manifest, 'CHANGELOG.md'), 'root-doc');
  assert.equal(fileKind(manifest, 'VERSION'), 'root-doc');
  assert.equal(fileKind(manifest, 'LICENSE'), 'license');
});

test('manifest file validation rejects unsupported kinds', () => {
  assert.throws(
    () => validateManifestFileEntry({
      path: 'README.md',
      sha256: 'a'.repeat(64),
      size: 1,
      mode: '100644',
      owner: 'toolkit',
      strategy: 'opt-in',
      profiles: ['opt-in'],
      kind: 'bad-kind',
    }),
    /Manifest entry has unsupported kind bad-kind: README\.md/
  );
});

function fileKind(manifest, filePath) {
  return manifest.files.find((file) => file.path === filePath)?.kind;
}
