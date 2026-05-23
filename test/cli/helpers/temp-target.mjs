import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { hashFile } from '../../../src/cli/core/hash.mjs';
import { validateRelativePath } from '../../../src/cli/core/paths.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FIXTURES_ROOT = path.resolve(HERE, '../../fixtures');

export function fixturePath(name, ...segments) {
  validateFixtureName(name);
  return path.join(FIXTURES_ROOT, name, ...segments);
}

export function createTempTargetFromFixture(name, options = {}) {
  const source = fixturePath(name);
  if (!fs.statSync(source).isDirectory()) {
    throw new Error(`Fixture must be a directory: ${name}`);
  }

  const prefix = options.prefix || `omo-fixture-${name}-`;
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const target = path.join(tempRoot, name);
  fs.cpSync(source, target, { recursive: true, verbatimSymlinks: true });
  return { fixture: source, tempRoot, target, cleanup: () => removeTempTarget(tempRoot) };
}

export function removeTempTarget(tempRoot) {
  if (!tempRoot || path.dirname(tempRoot) !== os.tmpdir()) {
    throw new Error(`Refusing to remove non-temp fixture path: ${tempRoot}`);
  }
  fs.rmSync(tempRoot, { recursive: true, force: true });
}

export function snapshotFixture(name) {
  const source = fixturePath(name);
  const entries = [];
  collectSnapshot(source, source, entries);
  return entries.sort((left, right) => left.path.localeCompare(right.path));
}

function collectSnapshot(root, current, entries) {
  const stats = fs.lstatSync(current);
  const relativePath = path.relative(root, current).split(path.sep).join(path.posix.sep);

  if (relativePath) {
    const entry = { path: relativePath, type: entryType(stats), mode: stats.mode & 0o777 };
    if (stats.isFile()) entry.hash = hashFile(current).sha256;
    if (stats.isSymbolicLink()) entry.target = fs.readlinkSync(current);
    entries.push(entry);
  }

  if (!stats.isDirectory()) return;
  for (const child of fs.readdirSync(current).sort()) {
    collectSnapshot(root, path.join(current, child), entries);
  }
}

function entryType(stats) {
  if (stats.isDirectory()) return 'directory';
  if (stats.isFile()) return 'file';
  if (stats.isSymbolicLink()) return 'symlink';
  return 'other';
}

function validateFixtureName(name) {
  validateRelativePath(name);
  if (name.includes('/')) throw new Error(`Fixture name must not contain a slash: ${name}`);
}
