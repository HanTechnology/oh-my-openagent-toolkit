import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { binarySummary, diffBuffers, diffText } from '../../src/cli/core/diff.mjs';
import { hashBuffer, hashFile } from '../../src/cli/core/hash.mjs';

test('hashes SHA-256, size, executable mode, and shebang mode', () => {
  const buffer = Buffer.from('#!/usr/bin/env node\nconsole.log(1)\n');
  assert.deepEqual(hashBuffer(buffer), {
    algorithm: 'sha256',
    sha256: crypto.createHash('sha256').update(buffer).digest('hex'),
    size: buffer.length,
    mode: '100644',
  });
  assert.equal(hashBuffer(buffer, { shebang: true }).mode, '100755');

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-hash-'));
  const filePath = path.join(dir, 'tool.mjs');
  fs.writeFileSync(filePath, buffer, { mode: 0o755 });
  const hashed = hashFile(filePath);
  assert.equal(hashed.sha256, crypto.createHash('sha256').update(buffer).digest('hex'));
  assert.equal(hashed.size, buffer.length);
  assert.equal(hashed.mode, '100755');
});

test('produces stable unified text diffs for LF fixtures', () => {
  assert.equal(
    diffText('one\ntwo\nthree\n', 'one\nTWO\nthree\n', { from: 'a.txt', to: 'b.txt' }),
    '--- a.txt\n+++ b.txt\n@@ -1,3 +1,3 @@\n one\n-two\n+TWO\n three\n',
  );
});

test('produces stable unified text diffs for CRLF fixtures', () => {
  assert.equal(
    diffBuffers(Buffer.from('alpha\r\nbeta\r\n'), Buffer.from('alpha\r\ngamma\r\n'), { from: 'old.txt', to: 'new.txt' }),
    '--- old.txt\n+++ new.txt\n@@ -1,2 +1,2 @@\n alpha\n-beta\n+gamma\n',
  );
});

test('summarizes binary and non-UTF8 content by hash', () => {
  const before = Buffer.from([0x00, 0xff, 0x01]);
  const after = Buffer.from([0x00, 0xff, 0x02]);
  const summary = binarySummary(before, after, { from: 'old.bin', to: 'new.bin' });
  assert.equal(diffBuffers(before, after, { from: 'old.bin', to: 'new.bin' }), summary);
  assert.match(summary, /^Binary files differ: old\.bin -> new\.bin\n/);
  assert.match(summary, /old\.bin: sha256=[a-f0-9]{64} size=3/);
  assert.match(summary, /new\.bin: sha256=[a-f0-9]{64} size=3/);

  const nonUtf8 = diffBuffers(Buffer.from([0xc3, 0x28]), Buffer.from('ok'), { from: 'bad', to: 'ok' });
  assert.match(nonUtf8, /^Binary files differ: bad -> ok\n/);
});
