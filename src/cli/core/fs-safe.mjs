import fs from 'node:fs';
import path from 'node:path';

export const FS_SAFE_ERRORS = Object.freeze({
  ABSOLUTE_PATH: 'E_ABSOLUTE_PATH',
  CASE_COLLISION: 'E_CASE_COLLISION',
  NULL_BYTE: 'E_NULL_BYTE',
  OUTSIDE_ROOT: 'E_OUTSIDE_ROOT',
  PATH_TRAVERSAL: 'E_PATH_TRAVERSAL',
  SYMLINK_ESCAPE: 'E_SYMLINK_ESCAPE',
});

export class SafePathError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'SafePathError';
    this.code = code;
    this.details = details;
  }
}

export function toPosixPath(filePath) {
  return filePath.split(path.sep).join(path.posix.sep);
}

export function assertRelativePosixPath(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new SafePathError(FS_SAFE_ERRORS.PATH_TRAVERSAL, 'Path must be a non-empty relative POSIX path.', { path: relativePath });
  }
  if (relativePath.includes('\0')) {
    throw new SafePathError(FS_SAFE_ERRORS.NULL_BYTE, 'Path contains a null byte.', { path: relativePath });
  }
  if (path.posix.isAbsolute(relativePath) || path.win32.isAbsolute(relativePath)) {
    throw new SafePathError(FS_SAFE_ERRORS.ABSOLUTE_PATH, 'Absolute paths are not allowed.', { path: relativePath });
  }
  if (relativePath.includes('\\')) {
    throw new SafePathError(FS_SAFE_ERRORS.PATH_TRAVERSAL, 'Only POSIX separators are allowed.', { path: relativePath });
  }

  const parts = relativePath.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new SafePathError(FS_SAFE_ERRORS.PATH_TRAVERSAL, 'Path must stay below the allowed root.', { path: relativePath });
  }

  return relativePath;
}

export function assertNoCaseInsensitiveDuplicates(relativePaths) {
  const seen = new Map();
  for (const relativePath of relativePaths) {
    const key = relativePath.toLocaleLowerCase('en-US');
    const previous = seen.get(key);
    if (previous && previous !== relativePath) {
      throw new SafePathError(FS_SAFE_ERRORS.CASE_COLLISION, 'Case-insensitive path collision detected.', {
        path: relativePath,
        previous,
      });
    }
    seen.set(key, relativePath);
  }
}

export function assertInsideRoot(rootPath, candidatePath) {
  const root = path.resolve(rootPath);
  const candidate = path.resolve(candidatePath);
  const relative = path.relative(root, candidate);
  if (relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))) {
    return candidate;
  }
  throw new SafePathError(FS_SAFE_ERRORS.OUTSIDE_ROOT, 'Path resolves outside the allowed root.', { root, path: candidate });
}

export function resolveSafePath(rootPath, relativePath) {
  assertRelativePosixPath(relativePath);
  const candidate = path.resolve(rootPath, ...relativePath.split('/'));
  return assertInsideRoot(rootPath, candidate);
}

export function assertNoSymlinkEscape(rootPath, relativePath, { mustExist = false } = {}) {
  const root = fs.realpathSync.native(rootPath);
  const parts = assertRelativePosixPath(relativePath).split('/');
  let current = root;

  for (let index = 0; index < parts.length; index += 1) {
    current = path.join(current, parts[index]);
    let stats;
    try {
      stats = fs.lstatSync(current);
    } catch (error) {
      if (error.code === 'ENOENT' && (!mustExist || index < parts.length - 1)) break;
      throw error;
    }

    if (stats.isSymbolicLink()) {
      const real = fs.realpathSync.native(current);
      try {
        assertInsideRoot(root, real);
      } catch (error) {
        throw new SafePathError(FS_SAFE_ERRORS.SYMLINK_ESCAPE, 'Symlink resolves outside the allowed root.', {
          root,
          path: current,
          real,
        });
      }
      current = real;
    }
  }
}

export function resolveExistingSafePath(rootPath, relativePath) {
  const absolutePath = resolveSafePath(rootPath, relativePath);
  assertNoSymlinkEscape(rootPath, relativePath, { mustExist: true });
  return fs.realpathSync.native(absolutePath);
}

export function resolveWriteSafePath(rootPath, relativePath) {
  const absolutePath = resolveSafePath(rootPath, relativePath);
  assertNoSymlinkEscape(rootPath, relativePath, { mustExist: false });
  return absolutePath;
}
