import crypto from 'node:crypto';
import fs from 'node:fs';

export function hashBuffer(buffer, { executable = false, shebang = false } = {}) {
  return {
    algorithm: 'sha256',
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
    size: buffer.length,
    mode: fileMode({ executable, shebang }),
  };
}

export function hashFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const stats = fs.statSync(filePath);
  const executable = (stats.mode & 0o111) !== 0;
  const shebang = buffer.subarray(0, 2).toString('utf8') === '#!';
  return {
    ...hashBuffer(buffer, { executable, shebang }),
    path: filePath,
  };
}

export function fileMode({ executable = false, shebang = false } = {}) {
  return executable || shebang ? '100755' : '100644';
}
