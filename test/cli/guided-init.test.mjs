import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { PassThrough, Writable } from 'node:stream';
import test from 'node:test';

import { LOCKFILE_RELATIVE_PATH } from '../../src/cli/core/lockfile.mjs';
import { runCli } from '../../src/cli/main.mjs';
import { createTempTargetFromFixture } from './helpers/temp-target.mjs';

const PACKAGE_ROOT = path.resolve(new URL('../..', import.meta.url).pathname);
const ROUTE_DOMAIN = '.opencode/commands/route-domain.md';

test('init --guided in TTY asks choices and final no writes only a dry-run preview', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const before = snapshotTarget(temp.target);
    const output = await captureRunCli(['init', '--guided', '--target', temp.target], {
      stdin: ttyInput('core\nno\nno\nno\n'),
      stdout: ttyOutput(),
      env: {},
    });

    assert.equal(output.code, 0, output.stderr);
    assert.match(output.stdout, /Select init profile/);
    assert.match(output.stdout, /Install MCP config\?/);
    assert.match(output.stdout, /Install root docs\?/);
    assert.match(output.stdout, /Apply guided init changes\?/);
    assert.match(output.stdout, /Guided init preview only; no files will be written\./);
    assert.match(output.stdout, /Init plan \(dry-run, profile core\):/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('init --guided detects legacy TTY migration choice and delegates to migrate dry-run', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const routePath = path.join(temp.target, ROUTE_DOMAIN);
    fs.mkdirSync(path.dirname(routePath), { recursive: true });
    fs.writeFileSync(routePath, fs.readFileSync(path.join(PACKAGE_ROOT, ROUTE_DOMAIN), 'utf8'));
    const before = snapshotTarget(temp.target);

    const output = await captureRunCli(['init', '--guided', '--target', temp.target], {
      stdin: ttyInput('full\nno\nno\nyes\nno\n'),
      stdout: ttyOutput(),
      env: {},
    });

    assert.equal(output.code, 0, output.stderr);
    assert.match(output.stdout, /Migrate legacy toolkit install\?/);
    assert.match(output.stdout, /Apply guided init changes\?/);
    assert.match(output.stdout, /Migration plan \(dry-run, profile full\):/);
    assert.match(output.stdout, /adopt-identical \.opencode\/commands\/route-domain\.md/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('init --guided non-TTY CI does not hang and writes nothing without apply or yes', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const before = snapshotTarget(temp.target);
    const output = await captureRunCli(['init', '--guided', '--target', temp.target], {
      env: { CI: 'true' },
    });

    assert.equal(output.code, 0, output.stderr);
    assert.match(output.stdout, /outside an interactive TTY/);
    assert.match(output.stdout, /Guided init preview only; no files will be written\./);
    assert.match(output.stdout, /Init plan \(dry-run, profile full\):/);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('init --guided --dry-run --yes keeps explicit dry-run read-only', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const before = snapshotTarget(temp.target);
    const output = await captureRunCli(['init', '--guided', '--dry-run', '--yes', '--target', temp.target], {
      env: { CI: 'true' },
    });

    assert.equal(output.code, 0, output.stderr);
    assert.match(output.stdout, /Init plan \(dry-run, profile full\):/);
    assert.doesNotMatch(output.stdout, /Applied init plan\./);
    assert.equal(fs.existsSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH)), false);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('init --guided --yes applies deterministic safe defaults', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    const output = await captureRunCli(['init', '--guided', '--yes', '--target', temp.target], {
      env: { CI: 'true' },
    });

    assert.equal(output.code, 0, output.stderr);
    assert.match(output.stdout, /Init plan \(apply, profile full\):/);
    assert.match(output.stdout, /Applied init plan\./);
    assert.equal(fs.existsSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH)), true);
    assert.equal(fs.existsSync(path.join(temp.target, '.mcp.json')), false);
    assert.equal(fs.existsSync(path.join(temp.target, 'README.oh-my-openagent-toolkit.md')), false);
  } finally {
    temp.cleanup();
  }
});

test('init --guided --yes delegates legacy migration and blocks unsafe conflicts without writes', async () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    fs.mkdirSync(path.join(temp.target, ROUTE_DOMAIN), { recursive: true });
    const before = snapshotTarget(temp.target);
    const output = await captureRunCli(['init', '--guided', '--yes', '--target', temp.target], {
      env: { CI: 'true' },
    });

    assert.equal(output.code, 2);
    assert.match(output.stdout, /Migration plan \(apply, profile full\):/);
    assert.match(output.stdout, /unsafe-conflict \.opencode\/commands\/route-domain\.md/);
    assert.equal(fs.existsSync(path.join(temp.target, LOCKFILE_RELATIVE_PATH)), false);
    assert.deepEqual(snapshotTarget(temp.target), before);
  } finally {
    temp.cleanup();
  }
});

test('init --diff usage is limited to migration paths', async () => {
  const plain = await captureRunCli(['init', '--diff', '--target', PACKAGE_ROOT]);
  assert.equal(plain.code, 2);
  assert.match(plain.stderr, /--diff belongs to migration\/update/);
  assert.doesNotMatch(plain.stderr, /Error:/);

  const temp = createTempTargetFromFixture('empty-target');
  try {
    const guided = await captureRunCli(['init', '--guided', '--diff', '--target', temp.target], { env: { CI: 'true' } });
    assert.equal(guided.code, 2);
    assert.match(guided.stderr, /guided init can only diff when migration is selected/);
    assert.doesNotMatch(guided.stderr, /Error:/);
  } finally {
    temp.cleanup();
  }
});

test('init rejects force and overwrite as usage errors without stack traces', async () => {
  for (const flag of ['--force', '--overwrite']) {
    const output = await captureRunCli(['init', flag, '--target', PACKAGE_ROOT]);
    assert.equal(output.code, 2, flag);
    assert.match(output.stderr, new RegExp(`${flag} is not supported`));
    assert.match(output.stderr, /Usage: omo-toolkit init/);
    assert.doesNotMatch(output.stderr, /Error:/);
  }

  const migrateAlias = await captureRunCli(['init', '--migrate', '--force', '--target', PACKAGE_ROOT]);
  assert.equal(migrateAlias.code, 2);
  assert.match(migrateAlias.stderr, /--force is not supported for migration/);
  assert.match(migrateAlias.stderr, /Usage: omo-toolkit migrate/);
  assert.doesNotMatch(migrateAlias.stderr, /Error:/);
});

async function captureRunCli(args, options = {}) {
  const stdout = options.stdout ?? plainOutput();
  const stderr = options.stderr ?? plainOutput();
  const code = await runCli(args, {
    cwd: PACKAGE_ROOT,
    env: options.env ?? {},
    stdin: options.stdin,
    stdout,
    stderr,
  });
  return { code, stdout: stdout.text, stderr: stderr.text };
}

function ttyInput(content) {
  const stream = new PassThrough();
  stream.isTTY = true;
  setImmediate(() => {
    stream.end(content);
  });
  return stream;
}

function ttyOutput() {
  const output = plainOutput();
  output.isTTY = true;
  return output;
}

function plainOutput() {
  let text = '';
  const output = new Writable({
    write(chunk, _encoding, callback) {
      text += chunk.toString();
      callback();
    },
  });
  Object.defineProperty(output, 'text', { get: () => text });
  return output;
}

function snapshotTarget(target) {
  if (path.dirname(path.dirname(target)) !== os.tmpdir()) throw new Error(`Refusing to snapshot non-temp target: ${target}`);
  if (!fs.existsSync(target)) return [];
  const output = execFileSync(process.execPath, ['-e', `
    const fs = require('node:fs');
    const crypto = require('node:crypto');
    const path = require('node:path');
    const root = process.argv[1];
    const entries = [];
    function walk(current) {
      for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const absolute = path.join(current, entry.name);
        const relative = path.relative(root, absolute).split(path.sep).join('/');
        if (entry.isDirectory()) { entries.push({ path: relative, type: 'directory' }); walk(absolute); }
        else if (entry.isFile()) entries.push({ path: relative, type: 'file', hash: crypto.createHash('sha256').update(fs.readFileSync(absolute)).digest('hex') });
        else if (entry.isSymbolicLink()) entries.push({ path: relative, type: 'symlink', target: fs.readlinkSync(absolute) });
      }
    }
    walk(root);
    process.stdout.write(JSON.stringify(entries));
  `, target], { encoding: 'utf8' });
  return JSON.parse(output);
}
