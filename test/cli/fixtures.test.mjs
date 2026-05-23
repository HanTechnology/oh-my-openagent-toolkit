import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { AGENTS_BLOCK_CONFLICTS, BEGIN_MARKER, END_MARKER, planAgentsManagedBlock } from '../../src/cli/core/agents-block.mjs';
import { FS_SAFE_ERRORS } from '../../src/cli/core/fs-safe.mjs';
import { resolveReadPath, validatePathSet } from '../../src/cli/core/paths.mjs';
import {
  FIXTURES_ROOT,
  createTempTargetFromFixture,
  fixturePath,
  snapshotFixture
} from './helpers/temp-target.mjs';

const FIXTURE_NAMES = [
  'empty-target',
  'existing-agents',
  'duplicate-agents-block',
  'existing-opencode-unmanaged',
  'local-modification',
  'partial-agents-block',
  'unmarked-toolkit-agents',
  'bad-plugin-config',
  'crlf-agents',
  'symlink-escape',
  'case-collision',
  'invalid-lockfile',
  'historical-known-old'
];

test('fixture inventory is complete', () => {
  const actual = fs.readdirSync(FIXTURES_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  assert.deepEqual(actual, [...FIXTURE_NAMES].sort());
});

test('temp target copies are mutable without changing committed fixtures', () => {
  for (const name of FIXTURE_NAMES) {
    const before = snapshotFixture(name);
    const temp = createTempTargetFromFixture(name);
    try {
      fs.writeFileSync(path.join(temp.target, 'MUTATED.txt'), `mutated ${name}\n`);
      assert.equal(fs.existsSync(path.join(fixturePath(name), 'MUTATED.txt')), false);
      assert.deepEqual(snapshotFixture(name), before);
    } finally {
      temp.cleanup();
    }
  }
});

test('empty target fixture copies to an empty mutable target', () => {
  const temp = createTempTargetFromFixture('empty-target');
  try {
    assert.deepEqual(fs.readdirSync(temp.target), []);
    fs.writeFileSync(path.join(temp.target, 'AGENTS.md'), '# Temp AGENTS\n');
    assert.equal(fs.existsSync(fixturePath('empty-target', 'AGENTS.md')), false);
  } finally {
    temp.cleanup();
  }
});

test('agents fixtures cover existing, duplicate, CRLF, and local-modification states', () => {
  const existingAgents = fs.readFileSync(fixturePath('existing-agents', 'AGENTS.md'), 'utf8');
  assert.equal(planAgentsManagedBlock(existingAgents).state, 'missing');

  const duplicateAgents = fs.readFileSync(fixturePath('duplicate-agents-block', 'AGENTS.md'), 'utf8');
  const duplicate = planAgentsManagedBlock(duplicateAgents);
  assert.equal(duplicate.code, AGENTS_BLOCK_CONFLICTS.duplicateBlock);
  assert.equal(countOccurrences(duplicateAgents, BEGIN_MARKER), 2);
  assert.equal(countOccurrences(duplicateAgents, END_MARKER), 2);

  const crlfAgents = fs.readFileSync(fixturePath('crlf-agents', 'AGENTS.md'), 'utf8');
  assert.match(crlfAgents, /\r\n/);
  assert.equal(planAgentsManagedBlock(crlfAgents).state, 'missing');

  const localAgents = fs.readFileSync(fixturePath('local-modification', 'AGENTS.md'), 'utf8');
  const localLockfile = JSON.parse(fs.readFileSync(fixturePath('local-modification', '.omo', 'lockfile.json'), 'utf8'));
  const localModification = planAgentsManagedBlock(localAgents, { lockfile: localLockfile });
  assert.equal(localModification.code, AGENTS_BLOCK_CONFLICTS.localModification);

  const partialAgents = fs.readFileSync(fixturePath('partial-agents-block', 'AGENTS.md'), 'utf8');
  assert.equal(planAgentsManagedBlock(partialAgents).code, AGENTS_BLOCK_CONFLICTS.partialBlock);

  const unmarkedAgents = fs.readFileSync(fixturePath('unmarked-toolkit-agents', 'AGENTS.md'), 'utf8');
  assert.equal(planAgentsManagedBlock(unmarkedAgents).code, AGENTS_BLOCK_CONFLICTS.unmarkedToolkitText);
});

test('opencode config fixtures cover unmanaged and bad top-level paths shapes', () => {
  const unmanagedConfig = fs.readFileSync(fixturePath('existing-opencode-unmanaged', '.opencode', 'oh-my-openagent.jsonc'), 'utf8');
  assert.match(unmanagedConfig, /custom-local-skill/);
  assert.doesNotMatch(unmanagedConfig, /^[ \t]*"paths"[ \t]*:/m);

  const badConfig = fs.readFileSync(fixturePath('bad-plugin-config', '.opencode', 'oh-my-openagent.jsonc'), 'utf8');
  assert.match(badConfig, /^[ \t]*"paths"[ \t]*:/m);
});

test('case collision and invalid lockfile fixtures expose later installer error surfaces', () => {
  assert.throws(() => validatePathSet(['.opencode/Skill.md', '.opencode/skill.md']), {
    code: FS_SAFE_ERRORS.CASE_COLLISION
  });

  const invalidLockfile = fs.readFileSync(fixturePath('invalid-lockfile', '.omo', 'lockfile.json'), 'utf8');
  assert.throws(() => JSON.parse(invalidLockfile), SyntaxError);
});

test('symlink escape fixture preserves symlink and trips safe read guard', { skip: process.platform === 'win32' }, () => {
  const temp = createTempTargetFromFixture('symlink-escape');
  try {
    const linkPath = path.join(temp.target, 'escape');
    assert.equal(fs.lstatSync(linkPath).isSymbolicLink(), true);
    assert.equal(fs.readlinkSync(linkPath), '..');
    assert.throws(() => resolveReadPath(temp.target, 'escape/secret.txt'), { code: FS_SAFE_ERRORS.SYMLINK_ESCAPE });
  } finally {
    temp.cleanup();
  }
});

function countOccurrences(content, needle) {
  let count = 0;
  let searchFrom = 0;
  while (searchFrom < content.length) {
    const matchIndex = content.indexOf(needle, searchFrom);
    if (matchIndex === -1) break;
    count += 1;
    searchFrom = matchIndex + needle.length;
  }
  return count;
}
