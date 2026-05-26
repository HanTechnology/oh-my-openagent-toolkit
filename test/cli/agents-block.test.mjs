import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  AGENTS_BLOCK_CONFLICTS,
  BEGIN_MARKER,
  END_MARKER,
  agentsBlockSha256,
  buildAgentsManagedBlock,
  canonicalAgentsBlockBody,
  loadPackagedAgentsGuide,
  planAgentsManagedBlock
} from '../../src/cli/core/agents-block.mjs';


test('loads packaged root AGENTS guide independent of cwd', () => {
  const originalCwd = process.cwd();
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-agents-guide-cwd-'));
  try {
    process.chdir(temp);
    const guide = loadPackagedAgentsGuide();
    assert.match(guide, /^# AGENTS Guide/m);
    assert.match(guide, /\.opencode\/reference\/routing-matrix\.md/);
  } finally {
    process.chdir(originalCwd);
    fs.rmSync(temp, { force: true, recursive: true });
  }
});

test('fails clearly when packaged root AGENTS guide is unavailable', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'omo-agents-guide-missing-'));
  try {
    assert.throws(
      () => loadPackagedAgentsGuide({ packageRoot: temp }),
      /AGENTS\.md/
    );
  } finally {
    fs.rmSync(temp, { force: true, recursive: true });
  }
});

test('inserts one managed block after a safe title and intro', () => {
  const titleAndIntro = '# Project AGENTS\r\n\r\nKeep this exact intro.\r\nIt spans two lines.\r\n\r\n';
  const laterBody = '## Local Rules\r\n\r\nKeep later body exact.\r\n';
  const projectContent = `${titleAndIntro}${laterBody}`;
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, true);
  assert.equal(result.state, 'missing');
  assert.equal(result.action, 'insert');
  assert.equal(result.changed, true);
  assert.equal(result.content.slice(0, titleAndIntro.length), titleAndIntro);
  assert.equal(result.content.slice(-laterBody.length), laterBody);
  assert.equal(result.content.indexOf(BEGIN_MARKER), titleAndIntro.length);
  assert.equal(countOccurrences(result.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(result.content, END_MARKER), 1);
  assert.match(result.agentsBlock.sha256, /^[a-f0-9]{64}$/);
  assert.equal(result.agentsBlock.sha256, agentsBlockSha256(canonicalAgentsBlockBody()));
});

test('appends one managed block when safe title and intro insertion is unclear', () => {
  const projectContent = '# Project AGENTS\r\n\r\n- Keep list-shaped local rules.\r\n- Do not infer an intro.\r\n';
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, true);
  assert.equal(result.state, 'missing');
  assert.equal(result.action, 'insert');
  assert.equal(result.changed, true);
  assert.equal(result.content.slice(0, projectContent.length), projectContent);
  assert.equal(result.content.slice(projectContent.length, result.content.indexOf(BEGIN_MARKER)), '');
  assert.equal(countOccurrences(result.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(result.content, END_MARKER), 1);
});

test('appends a separator before a managed block when source has no trailing newline', () => {
  const projectContent = '# Project AGENTS\n\n- Keep list-shaped local rules.';
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, true);
  assert.equal(result.state, 'missing');
  assert.equal(result.action, 'insert');
  assert.equal(result.changed, true);
  assert.equal(result.content.slice(0, projectContent.length), projectContent);
  assert.equal(result.content.slice(projectContent.length, result.content.indexOf(BEGIN_MARKER)), '\n\n');
  assert.equal(countOccurrences(result.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(result.content, END_MARKER), 1);
});

test('returns current block as a no-op', () => {
  const lockfile = { agentsBlock: { sha256: agentsBlockSha256() } };
  const projectContent = `# Project AGENTS\n\n${buildAgentsManagedBlock()}Keep local instructions.\n`;
  const result = planAgentsManagedBlock(projectContent, { lockfile });

  assert.equal(result.ok, true);
  assert.equal(result.state, 'current');
  assert.equal(result.action, 'none');
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

test('updates stale block and preserves outside-marker content byte for byte', () => {
  const previousBody = 'Previous OMO Toolkit managed body.\n';
  const previousBlock = buildAgentsManagedBlock({ body: previousBody });
  const prefix = '# Project AGENTS\r\n\r\nKeep prefix bytes exact.\r\n';
  const suffix = 'Keep suffix bytes exact.\r\n';
  const projectContent = `${prefix}${previousBlock}${suffix}`;
  const lockfile = { agentsBlock: { sha256: agentsBlockSha256(previousBody) } };
  const result = planAgentsManagedBlock(projectContent, { lockfile });

  assert.equal(result.ok, true);
  assert.equal(result.state, 'stale');
  assert.equal(result.action, 'update');
  assert.equal(result.changed, true);
  assert.equal(result.content.slice(0, prefix.length), prefix);
  assert.equal(result.content.slice(-suffix.length), suffix);
  assert.equal(countOccurrences(result.content, BEGIN_MARKER), 1);
  assert.equal(countOccurrences(result.content, END_MARKER), 1);
  assert.equal(result.previousAgentsBlock.sha256, lockfile.agentsBlock.sha256);
});

test('reports duplicate managed blocks as a conflict', () => {
  const block = buildAgentsManagedBlock();
  const projectContent = `# Project AGENTS\n\n${block}\n${block}`;
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, false);
  assert.equal(result.state, 'duplicate');
  assert.equal(result.code, AGENTS_BLOCK_CONFLICTS.duplicateBlock);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

test('reports nested managed blocks as a conflict', () => {
  const projectContent = `${BEGIN_MARKER}\n${BEGIN_MARKER}\nNested text.\n${END_MARKER}\n${END_MARKER}\n`;
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, false);
  assert.equal(result.state, 'nested');
  assert.equal(result.code, AGENTS_BLOCK_CONFLICTS.nestedBlock);
  assert.equal(result.changed, false);
});

test('reports partial marker pairs as a conflict', () => {
  const projectContent = `# Project AGENTS\n\n${BEGIN_MARKER}\nManaged text without an end marker.\n`;
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, false);
  assert.equal(result.state, 'partial');
  assert.equal(result.code, AGENTS_BLOCK_CONFLICTS.partialBlock);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

test('reports local modification when lockfile hash differs', () => {
  const previousBody = 'Previous generated body.\n';
  const modifiedBody = 'Locally edited managed body.\n';
  const projectContent = `# Project AGENTS\n\n${buildAgentsManagedBlock({ body: modifiedBody })}`;
  const lockfile = { agentsBlock: { sha256: agentsBlockSha256(previousBody) } };
  const result = planAgentsManagedBlock(projectContent, { lockfile });

  assert.equal(result.ok, false);
  assert.equal(result.state, 'locally-modified');
  assert.equal(result.code, AGENTS_BLOCK_CONFLICTS.localModification);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

test('reports unmarked toolkit-like text before insertion', () => {
  const projectContent = '# Project AGENTS\n\nOMO Toolkit says to read `.opencode/reference/routing-matrix.md` first.\n';
  const result = planAgentsManagedBlock(projectContent);

  assert.equal(result.ok, false);
  assert.equal(result.state, 'unmarked');
  assert.equal(result.code, AGENTS_BLOCK_CONFLICTS.unmarkedToolkitText);
  assert.equal(result.changed, false);
  assert.equal(result.content, projectContent);
});

function countOccurrences(content, needle) {
  let count = 0;
  let searchFrom = 0;

  while (searchFrom < content.length) {
    const matchIndex = content.indexOf(needle, searchFrom);

    if (matchIndex === -1) {
      break;
    }

    count += 1;
    searchFrom = matchIndex + needle.length;
  }

  return count;
}
