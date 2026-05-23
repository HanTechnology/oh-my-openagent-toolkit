import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  AGENTS_BLOCK_CONFLICTS,
  BEGIN_MARKER,
  END_MARKER,
  agentsBlockSha256,
  buildAgentsManagedBlock,
} from '../../src/cli/core/agents-block.mjs';
import {
  AGENTS_MIGRATION_ACTIONS,
  AGENTS_MIGRATION_RULES,
  classifyAgentsMigration,
} from '../../src/cli/core/agents-migration.mjs';
import { fixturePath } from './helpers/temp-target.mjs';

test('missing AGENTS classifies as agents-insert', () => {
  const result = classifyAgentsMigration(null, { exists: false });

  assert.equal(result.ok, true);
  assert.equal(result.blocked, false);
  assert.equal(result.review, false);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.insert);
  assert.equal(result.state, 'missing-file');
  assert.equal(result.ruleId, AGENTS_MIGRATION_RULES.missingFile);
  assert.equal(result.write, true);
  assert.equal(result.changed, true);
  assert.equal(result.source, '');
  assert.equal(result.content, buildAgentsManagedBlock());
});

test('safe unmarked project AGENTS classifies as agents-insert', () => {
  const projectContent = fs.readFileSync(fixturePath('existing-agents', 'AGENTS.md'), 'utf8');
  const result = classifyAgentsMigration(projectContent);

  assert.equal(result.ok, true);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.insert);
  assert.equal(result.state, 'unmarked-safe');
  assert.equal(result.ruleId, AGENTS_MIGRATION_RULES.unmarkedSafe);
  assert.equal(result.write, true);
  assert.equal(result.changed, true);
  assert.equal(result.source, projectContent);
  assert.match(result.content, /Keep these existing local instructions\./);
  assert.match(result.content, /Preserve project-specific guidance\./);
  assert.equal(countOccurrences(result.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(result.content, END_MARKER), 1);
});

test('current marked block classifies as agents-adopt without a write', () => {
  const prefix = '# Project AGENTS\r\n\r\nKeep prefix bytes exact.\r\n';
  const suffix = 'Keep suffix bytes exact.\r\n';
  const projectContent = `${prefix}${buildAgentsManagedBlock()}${suffix}`;
  const result = classifyAgentsMigration(projectContent);

  assert.equal(result.ok, true);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.adopt);
  assert.equal(result.state, 'current');
  assert.equal(result.ruleId, AGENTS_MIGRATION_RULES.currentManagedBlock);
  assert.equal(result.write, false);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
  assert.equal(result.agentsBlock.sha256, agentsBlockSha256());
  assert.equal(result.previousAgentsBlock.sha256, agentsBlockSha256());
});

test('historical marked block classifies as agents-replace and preserves only outside-marker bytes', () => {
  const historicalBody = 'Historical OMO Toolkit managed body.\n';
  const historicalBlock = buildAgentsManagedBlock({ body: historicalBody });
  const prefix = '# Project AGENTS\r\n\r\nKeep prefix bytes exact.\r\n';
  const suffix = 'Keep suffix bytes exact.\r\n';
  const projectContent = `${prefix}${historicalBlock}${suffix}`;
  const historicalSha256 = agentsBlockSha256(historicalBody);
  const result = classifyAgentsMigration(projectContent, {
    historicalRegistry: {
      versions: [
        {
          version: '0.4.0',
          agentsBlock: { sha256: historicalSha256 },
        },
      ],
    },
  });

  assert.equal(result.ok, true);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.replace);
  assert.equal(result.state, 'historical');
  assert.equal(result.ruleId, AGENTS_MIGRATION_RULES.historicalManagedBlock);
  assert.equal(result.write, true);
  assert.equal(result.changed, true);
  assert.equal(result.previousAgentsBlock.sha256, historicalSha256);
  assert.deepEqual(result.details.historicalMatch, { sha256: historicalSha256, version: '0.4.0' });
  assert.equal(result.content.slice(0, prefix.length), prefix);
  assert.equal(result.content.slice(-suffix.length), suffix);
  assert.equal(result.content.slice(prefix.length, result.content.length - suffix.length), buildAgentsManagedBlock());
  assert.equal(countOccurrences(result.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(result.content, END_MARKER), 1);
});

test('unknown marked block classifies as needs-review without a write', () => {
  const projectContent = `# Project AGENTS\n\n${buildAgentsManagedBlock({ body: 'Custom managed body.\n' })}Keep local instructions.\n`;
  const result = classifyAgentsMigration(projectContent, {
    historicalAgentsBlockSha256s: ['0'.repeat(64)],
  });

  assert.equal(result.ok, true);
  assert.equal(result.review, true);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.needsReview);
  assert.equal(result.state, 'unknown-managed-block');
  assert.equal(result.ruleId, AGENTS_MIGRATION_RULES.unknownManagedBlock);
  assert.equal(result.write, false);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

test('unmarked toolkit-like text classifies as needs-review without a write', () => {
  const projectContent = '# Project AGENTS\n\nOMO Toolkit says to read `.opencode/reference/routing-matrix.md` first.\n';
  const result = classifyAgentsMigration(projectContent);

  assert.equal(result.ok, true);
  assert.equal(result.review, true);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.needsReview);
  assert.equal(result.state, 'unmarked');
  assert.equal(result.ruleId, AGENTS_BLOCK_CONFLICTS.unmarkedToolkitText);
  assert.equal(result.write, false);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

test('duplicate markers classify as unsafe-conflict and block writes', () => {
  const block = buildAgentsManagedBlock();
  const projectContent = `# Project AGENTS\n\n${block}\n${block}`;
  const result = classifyAgentsMigration(projectContent);

  assertUnsafeConflict(result, projectContent, 'duplicate', AGENTS_BLOCK_CONFLICTS.duplicateBlock);
});

test('nested markers classify as unsafe-conflict and block writes', () => {
  const projectContent = `${BEGIN_MARKER}\n${BEGIN_MARKER}\nNested text.\n${END_MARKER}\n${END_MARKER}\n`;
  const result = classifyAgentsMigration(projectContent);

  assertUnsafeConflict(result, projectContent, 'nested', AGENTS_BLOCK_CONFLICTS.nestedBlock);
});

test('partial markers classify as unsafe-conflict and block writes', () => {
  const projectContent = `# Project AGENTS\n\n${BEGIN_MARKER}\nManaged text without an end marker.\n`;
  const result = classifyAgentsMigration(projectContent);

  assertUnsafeConflict(result, projectContent, 'partial', AGENTS_BLOCK_CONFLICTS.partialBlock);
});

function assertUnsafeConflict(result, projectContent, state, ruleId) {
  assert.equal(result.ok, false);
  assert.equal(result.blocked, true);
  assert.equal(result.review, false);
  assert.equal(result.action, AGENTS_MIGRATION_ACTIONS.unsafeConflict);
  assert.equal(result.state, state);
  assert.equal(result.ruleId, ruleId);
  assert.equal(result.write, false);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
}

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
