import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';

export const BEGIN_MARKER = '<!-- BEGIN OMO-TOOLKIT MANAGED BLOCK: oh-my-openagent-toolkit -->';
export const END_MARKER = '<!-- END OMO-TOOLKIT MANAGED BLOCK: oh-my-openagent-toolkit -->';

export const AGENTS_BLOCK_CONFLICTS = Object.freeze({
  duplicateBlock: 'agents.duplicate-block',
  nestedBlock: 'agents.nested-block',
  partialBlock: 'agents.partial-block',
  localModification: 'agents.local-modification',
  unmarkedToolkitText: 'agents.unmarked-toolkit-text'
});

const DEFAULT_TEMPLATE_URL = new URL('../templates/agents-managed-block.md', import.meta.url);
const DEFAULT_PACKAGE_AGENTS_GUIDE_URL = new URL('../../../AGENTS.md', import.meta.url);
export const DEFAULT_AGENTS_BLOCK_BODY = readFileSync(DEFAULT_TEMPLATE_URL, 'utf8');

const CONFLICT_MESSAGES = Object.freeze({
  [AGENTS_BLOCK_CONFLICTS.duplicateBlock]: 'AGENTS.md contains more than one OMO Toolkit managed block.',
  [AGENTS_BLOCK_CONFLICTS.nestedBlock]: 'AGENTS.md contains nested OMO Toolkit managed block markers.',
  [AGENTS_BLOCK_CONFLICTS.partialBlock]: 'AGENTS.md contains an incomplete OMO Toolkit managed block marker pair.',
  [AGENTS_BLOCK_CONFLICTS.localModification]: 'AGENTS.md managed block differs from the lockfile hash and needs manual review.',
  [AGENTS_BLOCK_CONFLICTS.unmarkedToolkitText]: 'AGENTS.md contains toolkit-like text outside managed markers.'
});

const UNMARKED_TOOLKIT_TEXT_PATTERNS = Object.freeze([
  /\bOMO Toolkit\b/i,
  /\bOMO-TOOLKIT\b/,
  /\boh-my-openagent-toolkit\b/i,
  /\.opencode\/reference\/routing-matrix\.md/,
  /\.opencode\/reference\/opencode-compatibility-model\.md/,
  /\.opencode\/oh-my-openagent\.jsonc/
]);

export function loadPackagedAgentsGuide(options = {}) {
  const guideSource = options.guidePath
    ? path.resolve(options.guidePath)
    : options.packageRoot
      ? path.join(path.resolve(options.packageRoot), 'AGENTS.md')
      : DEFAULT_PACKAGE_AGENTS_GUIDE_URL;

  try {
    return readFileSync(guideSource, 'utf8');
  } catch (error) {
    const sourceDescription = guideSource instanceof URL ? guideSource.href : guideSource;
    throw new Error(`Unable to load packaged root AGENTS.md from ${sourceDescription}: ${error.message}`, { cause: error });
  }
}

export function isPackagedAgentsGuideCandidate(content) {
  const source = String(content ?? '');
  return source.includes('# AGENTS Guide')
    && source.includes('.opencode/reference/routing-matrix.md')
    && source.includes('## What each document owns');
}

export function buildPackagedAgentsGuideWithManagedBlock(options = {}) {
  const guide = loadPackagedAgentsGuide(options);
  const planned = planAgentsManagedBlock(guide, {
    allowUnmarkedToolkitText: true,
    body: options.body,
  });

  if (!planned.ok) {
    throw new Error(`Unable to build packaged root AGENTS.md guide: ${planned.message}`);
  }

  return planned.content;
}

export function canonicalAgentsBlockBody(body = DEFAULT_AGENTS_BLOCK_BODY) {
  const normalizedBody = String(body ?? '')
    .replace(/^\uFEFF/, '')
    .replace(/\r\n?/g, '\n')
    .trim();

  return normalizedBody.length > 0 ? `${normalizedBody}\n` : '';
}

export function agentsBlockSha256(body = DEFAULT_AGENTS_BLOCK_BODY) {
  return createHash('sha256')
    .update(canonicalAgentsBlockBody(body), 'utf8')
    .digest('hex');
}

export function buildAgentsManagedBlock(options = {}) {
  const body = canonicalAgentsBlockBody(options.body ?? DEFAULT_AGENTS_BLOCK_BODY);
  return `${BEGIN_MARKER}\n${body}${END_MARKER}\n`;
}

export function inspectAgentsManagedBlock(agentsContent = '') {
  const source = String(agentsContent ?? '');
  const beginIndexes = findAllIndexes(source, BEGIN_MARKER);
  const endIndexes = findAllIndexes(source, END_MARKER);

  if (beginIndexes.length !== endIndexes.length) {
    return markerConflict('partial', AGENTS_BLOCK_CONFLICTS.partialBlock, beginIndexes, endIndexes);
  }

  if (beginIndexes.length === 0) {
    return {
      state: 'missing',
      beginCount: 0,
      endCount: 0
    };
  }

  const markerShape = classifyMarkerShape(beginIndexes, endIndexes);

  if (markerShape.invalid) {
    return markerConflict('partial', AGENTS_BLOCK_CONFLICTS.partialBlock, beginIndexes, endIndexes);
  }

  if (beginIndexes.length > 1) {
    return markerShape.nested
      ? markerConflict('nested', AGENTS_BLOCK_CONFLICTS.nestedBlock, beginIndexes, endIndexes)
      : markerConflict('duplicate', AGENTS_BLOCK_CONFLICTS.duplicateBlock, beginIndexes, endIndexes);
  }

  const beginIndex = beginIndexes[0];
  const endIndex = endIndexes[0];

  if (endIndex < beginIndex) {
    return markerConflict('partial', AGENTS_BLOCK_CONFLICTS.partialBlock, beginIndexes, endIndexes);
  }

  const rawBodyStart = consumeLineEnding(source, beginIndex + BEGIN_MARKER.length);
  const rawBodyEnd = retreatLineEnding(source, endIndex);
  const rangeEnd = consumeLineEnding(source, endIndex + END_MARKER.length);

  return {
    state: 'managed',
    beginCount: 1,
    endCount: 1,
    rangeStart: beginIndex,
    rangeEnd,
    bodyStart: rawBodyStart,
    bodyEnd: rawBodyEnd,
    rawBody: source.slice(rawBodyStart, rawBodyEnd),
    prefix: source.slice(0, beginIndex),
    suffix: source.slice(rangeEnd)
  };
}

export function planAgentsManagedBlock(agentsContent = '', options = {}) {
  const source = String(agentsContent ?? '');
  const generatedBody = canonicalAgentsBlockBody(options.body ?? DEFAULT_AGENTS_BLOCK_BODY);
  const generatedBlock = buildAgentsManagedBlock({ body: generatedBody });
  const generatedAgentsBlock = {
    sha256: agentsBlockSha256(generatedBody),
    beginMarker: BEGIN_MARKER,
    endMarker: END_MARKER
  };
  const inspectedBlock = inspectAgentsManagedBlock(source);

  if (inspectedBlock.code) {
    return conflictResult(source, inspectedBlock.state, inspectedBlock.code, generatedAgentsBlock, inspectedBlock);
  }

  const unmarkedText = options.allowUnmarkedToolkitText === true
    ? null
    : findUnmarkedToolkitText(source, inspectedBlock);

  if (unmarkedText) {
    return conflictResult(
      source,
      'unmarked',
      AGENTS_BLOCK_CONFLICTS.unmarkedToolkitText,
      generatedAgentsBlock,
      { match: unmarkedText }
    );
  }

  if (inspectedBlock.state === 'missing') {
    return okResult({
      source,
      content: insertAgentsManagedBlock(source, generatedBlock),
      state: 'missing',
      action: 'insert',
      changed: true,
      agentsBlock: generatedAgentsBlock
    });
  }

  const existingBody = canonicalAgentsBlockBody(inspectedBlock.rawBody);
  const existingSha256 = agentsBlockSha256(existingBody);
  const previousAgentsBlock = { sha256: existingSha256 };

  if (existingSha256 === generatedAgentsBlock.sha256) {
    return okResult({
      source,
      content: source,
      state: 'current',
      action: 'none',
      changed: false,
      agentsBlock: generatedAgentsBlock,
      previousAgentsBlock
    });
  }

  const expectedSha256 = getExpectedSha256(options);

  if (expectedSha256 && expectedSha256 !== existingSha256) {
    return conflictResult(
      source,
      'locally-modified',
      AGENTS_BLOCK_CONFLICTS.localModification,
      generatedAgentsBlock,
      {
        expectedSha256,
        actualSha256: existingSha256
      }
    );
  }

  return okResult({
    source,
    content: source.slice(0, inspectedBlock.rangeStart) + generatedBlock + source.slice(inspectedBlock.rangeEnd),
    state: 'stale',
    action: 'update',
    changed: true,
    agentsBlock: generatedAgentsBlock,
    previousAgentsBlock
  });
}

export function isAgentsBlockConflict(result) {
  return result?.ok === false && typeof result.code === 'string';
}

function okResult(result) {
  return {
    ok: true,
    code: null,
    message: null,
    ...result
  };
}

function conflictResult(source, state, code, agentsBlock, details = {}) {
  return {
    ok: false,
    code,
    message: CONFLICT_MESSAGES[code],
    state,
    action: 'conflict',
    changed: false,
    source,
    content: source,
    agentsBlock,
    details
  };
}

function markerConflict(state, code, beginIndexes, endIndexes) {
  return {
    state,
    code,
    beginCount: beginIndexes.length,
    endCount: endIndexes.length,
    beginIndexes,
    endIndexes
  };
}

function findAllIndexes(source, marker) {
  const indexes = [];
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const markerIndex = source.indexOf(marker, searchFrom);

    if (markerIndex === -1) {
      break;
    }

    indexes.push(markerIndex);
    searchFrom = markerIndex + marker.length;
  }

  return indexes;
}

function classifyMarkerShape(beginIndexes, endIndexes) {
  const markerEvents = [
    ...beginIndexes.map((index) => ({ index, type: 'begin' })),
    ...endIndexes.map((index) => ({ index, type: 'end' }))
  ].sort((leftEvent, rightEvent) => leftEvent.index - rightEvent.index);
  let markerDepth = 0;
  let nested = false;

  for (const markerEvent of markerEvents) {
    if (markerEvent.type === 'begin') {
      markerDepth += 1;
      nested = nested || markerDepth > 1;
    } else {
      markerDepth -= 1;
    }

    if (markerDepth < 0) {
      return { invalid: true, nested };
    }
  }

  return { invalid: markerDepth !== 0, nested };
}

function consumeLineEnding(source, index) {
  if (source.startsWith('\r\n', index)) {
    return index + 2;
  }

  if (source[index] === '\n' || source[index] === '\r') {
    return index + 1;
  }

  return index;
}

function retreatLineEnding(source, index) {
  if (index >= 2 && source.slice(index - 2, index) === '\r\n') {
    return index - 2;
  }

  if (index >= 1 && (source[index - 1] === '\n' || source[index - 1] === '\r')) {
    return index - 1;
  }

  return index;
}

function insertAgentsManagedBlock(source, generatedBlock) {
  if (source.length === 0) {
    return generatedBlock;
  }

  const titleIntroInsertIndex = findTitleIntroInsertIndex(source);

  if (titleIntroInsertIndex !== null) {
    return `${source.slice(0, titleIntroInsertIndex)}${generatedBlock}${source.slice(titleIntroInsertIndex)}`;
  }

  const spacer = source.endsWith('\n') || source.endsWith('\r') ? '' : '\n\n';
  return `${source}${spacer}${generatedBlock}`;
}

function findTitleIntroInsertIndex(source) {
  const lines = splitLinesWithEndings(source);
  let lineIndex = 0;

  while (lineIndex < lines.length && isBlankLine(lines[lineIndex].text)) {
    lineIndex += 1;
  }

  if (lineIndex >= lines.length || !isTopLevelHeading(lines[lineIndex].text)) {
    return null;
  }

  lineIndex += 1;

  if (lineIndex >= lines.length || !isBlankLine(lines[lineIndex].text)) {
    return null;
  }

  lineIndex += 1;

  const introStartIndex = lineIndex;

  while (lineIndex < lines.length && !isBlankLine(lines[lineIndex].text)) {
    if (!isIntroLine(lines[lineIndex].text)) {
      return null;
    }

    lineIndex += 1;
  }

  if (lineIndex === introStartIndex || lineIndex >= lines.length || !isBlankLine(lines[lineIndex].text)) {
    return null;
  }

  lineIndex += 1;

  if (lineIndex >= lines.length || !isSectionHeading(lines[lineIndex].text)) {
    return null;
  }

  return lines[lineIndex].start;
}

function splitLinesWithEndings(source) {
  const lines = [];
  const linePattern = /.*(?:\r\n|\n|\r|$)/g;
  let match;

  while ((match = linePattern.exec(source)) !== null) {
    if (match[0] === '') {
      break;
    }

    lines.push({
      start: match.index,
      text: match[0].replace(/\r\n|\n|\r$/, '')
    });
  }

  return lines;
}

function isBlankLine(line) {
  return /^\s*$/.test(line);
}

function isTopLevelHeading(line) {
  return /^#\s+\S/.test(line) && !/^##/.test(line);
}

function isSectionHeading(line) {
  return /^#{2,6}\s+\S/.test(line);
}

function isIntroLine(line) {
  return !/^\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|```|~~~|>|\|)/.test(line);
}

function findUnmarkedToolkitText(source, inspectedBlock) {
  const unmarkedContent = inspectedBlock.state === 'managed'
    ? `${inspectedBlock.prefix}${inspectedBlock.suffix}`
    : source;

  for (const pattern of UNMARKED_TOOLKIT_TEXT_PATTERNS) {
    const match = unmarkedContent.match(pattern);

    if (match) {
      return match[0];
    }
  }

  return null;
}

function getExpectedSha256(options) {
  return options.expectedSha256
    ?? options.lockfile?.agentsBlock?.sha256
    ?? options.lockfile?.agentsBlockSha256
    ?? null;
}
