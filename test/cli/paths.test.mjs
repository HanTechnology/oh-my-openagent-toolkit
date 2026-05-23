import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { FS_SAFE_ERRORS } from '../../src/cli/core/fs-safe.mjs';
import {
  resolveOutputPath,
  resolvePackageRoot,
  resolveReadPath,
  resolveSourceRoot,
  resolveTargetRoot,
  validatePathSet,
  validateRelativePath,
} from '../../src/cli/core/paths.mjs';

test('resolves target root from --target and cwd fallback', () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-paths-cwd-'));
  assert.equal(resolveTargetRoot([], cwd), cwd);
  assert.equal(resolveTargetRoot(['--target', 'relative-project'], cwd), path.join(cwd, 'relative-project'));
  assert.equal(resolveTargetRoot(['--target=/tmp/absolute-project'], cwd), '/tmp/absolute-project');
});

test('resolves source and package root from import.meta.url', () => {
  const sourceRoot = resolveSourceRoot();
  const packageRoot = resolvePackageRoot();
  assert.equal(sourceRoot, path.resolve('src'));
  assert.equal(packageRoot, path.resolve(sourceRoot, '..'));
});

test('validates relative POSIX paths and rejects unsafe input', () => {
  assert.equal(validateRelativePath('dir/file.txt'), 'dir/file.txt');
  assert.throws(() => validateRelativePath('../AGENTS.md'), { code: FS_SAFE_ERRORS.PATH_TRAVERSAL });
  assert.throws(() => validateRelativePath('/tmp/x'), { code: FS_SAFE_ERRORS.ABSOLUTE_PATH });
  assert.throws(() => validateRelativePath('safe\0name'), { code: FS_SAFE_ERRORS.NULL_BYTE });
});

test('rejects case-insensitive duplicate path sets', () => {
  assert.deepEqual(validatePathSet(['a/file.txt', 'b/file.txt']), ['a/file.txt', 'b/file.txt']);
  assert.throws(() => validatePathSet(['Config.json', 'config.JSON']), { code: FS_SAFE_ERRORS.CASE_COLLISION });
});

test('rejects symlink-to-parent escapes for read and write helpers', { skip: process.platform === 'win32' }, () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-paths-root-'));
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-paths-outside-'));
  fs.writeFileSync(path.join(outside, 'secret.txt'), 'nope');
  fs.symlinkSync(outside, path.join(root, 'escape'), 'dir');

  assert.throws(() => resolveReadPath(root, 'escape/secret.txt'), { code: FS_SAFE_ERRORS.SYMLINK_ESCAPE });
  assert.throws(() => resolveOutputPath(root, 'escape/new.txt'), { code: FS_SAFE_ERRORS.SYMLINK_ESCAPE });
});

test('write-safe helper resolves under root without writing files', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-paths-write-'));
  const filePath = resolveOutputPath(root, 'nested/file.txt');
  assert.equal(filePath, path.join(root, 'nested', 'file.txt'));
  assert.equal(fs.existsSync(filePath), false);
});
