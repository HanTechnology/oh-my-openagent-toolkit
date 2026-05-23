import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertNoCaseInsensitiveDuplicates,
  assertRelativePosixPath,
  resolveExistingSafePath,
  resolveSafePath,
  resolveWriteSafePath,
} from './fs-safe.mjs';

export function resolveTargetRoot(argv = process.argv.slice(2), cwd = process.cwd()) {
  const target = readFlagValue(argv, '--target');
  return path.resolve(cwd, target || '.');
}

export function resolveSourceRoot(metaUrl = import.meta.url) {
  return path.resolve(path.dirname(fileURLToPath(metaUrl)), '../..');
}

export function resolvePackageRoot(metaUrl = import.meta.url) {
  return path.resolve(path.dirname(fileURLToPath(metaUrl)), '../../..');
}

export function validateRelativePath(relativePath) {
  return assertRelativePosixPath(relativePath);
}

export function validatePathSet(relativePaths) {
  for (const relativePath of relativePaths) assertRelativePosixPath(relativePath);
  assertNoCaseInsensitiveDuplicates(relativePaths);
  return [...relativePaths].sort();
}

export function resolveReadPath(rootPath, relativePath) {
  return resolveExistingSafePath(rootPath, relativePath);
}

export function resolveCandidatePath(rootPath, relativePath) {
  return resolveSafePath(rootPath, relativePath);
}

export function resolveOutputPath(rootPath, relativePath) {
  return resolveWriteSafePath(rootPath, relativePath);
}

function readFlagValue(argv, flag) {
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === flag) return argv[index + 1] || '';
    if (value.startsWith(`${flag}=`)) return value.slice(flag.length + 1);
  }
  return null;
}
