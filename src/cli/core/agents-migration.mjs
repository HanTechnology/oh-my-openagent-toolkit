import {
  AGENTS_BLOCK_CONFLICTS,
  BEGIN_MARKER,
  DEFAULT_AGENTS_BLOCK_BODY,
  END_MARKER,
  agentsBlockSha256,
  buildAgentsManagedBlock,
  buildPackagedAgentsGuideWithManagedBlock,
  canonicalAgentsBlockBody,
  inspectAgentsManagedBlock,
  planAgentsManagedBlock,
} from './agents-block.mjs';

export const AGENTS_MIGRATION_ACTIONS = Object.freeze({
  insert: 'agents-insert',
  adopt: 'agents-adopt',
  replace: 'agents-replace',
  needsReview: 'needs-review',
  unsafeConflict: 'unsafe-conflict',
});

export const AGENTS_MIGRATION_RULES = Object.freeze({
  missingFile: 'agents.missing-file',
  unmarkedSafe: 'agents.unmarked-safe',
  currentManagedBlock: 'agents.current-managed-block',
  historicalManagedBlock: 'agents.historical-managed-block',
  unknownManagedBlock: 'agents.unknown-managed-block',
});

const AGENTS_PATH = 'AGENTS.md';
const UNSAFE_MARKER_CONFLICTS = new Set([
  AGENTS_BLOCK_CONFLICTS.duplicateBlock,
  AGENTS_BLOCK_CONFLICTS.nestedBlock,
  AGENTS_BLOCK_CONFLICTS.partialBlock,
]);

export function classifyAgentsMigration(agentsContent = '', options = {}) {
  const exists = options.exists ?? options.agentsExists ?? (agentsContent !== null && agentsContent !== undefined);
  const source = exists ? String(agentsContent ?? '') : '';
  const body = canonicalAgentsBlockBody(options.body ?? DEFAULT_AGENTS_BLOCK_BODY);
  const generatedBlock = buildAgentsManagedBlock({ body });
  const agentsBlock = {
    sha256: agentsBlockSha256(body),
    beginMarker: BEGIN_MARKER,
    endMarker: END_MARKER,
  };
  const expectedPackagedGuide = buildPackagedAgentsGuideWithManagedBlock({ body });
  const isCurrentPackagedGuide = source === expectedPackagedGuide;
  const plannedBlock = planAgentsManagedBlock(source, {
    allowUnmarkedToolkitText: isCurrentPackagedGuide,
    body,
  });

  if (plannedBlock.ok === false) {
    if (UNSAFE_MARKER_CONFLICTS.has(plannedBlock.code)) {
      return unsafeConflictResult({
        source,
        agentsBlock,
        state: plannedBlock.state,
        ruleId: plannedBlock.code,
        reason: plannedBlock.message,
        details: plannedBlock.details,
      });
    }

    return needsReviewResult({
      source,
      agentsBlock,
      state: plannedBlock.state,
      ruleId: plannedBlock.code,
      reason: plannedBlock.message,
      details: plannedBlock.details,
    });
  }

  if (!exists) {
    return insertResult({
      source,
      content: expectedPackagedGuide,
      agentsBlock,
      state: 'missing-file',
      ruleId: AGENTS_MIGRATION_RULES.missingFile,
      reason: 'AGENTS.md is missing.',
    });
  }

  const inspectedBlock = inspectAgentsManagedBlock(source);

  if (inspectedBlock.state === 'missing') {
    return insertResult({
      source,
      content: plannedBlock.content,
      agentsBlock,
      state: 'unmarked-safe',
      ruleId: AGENTS_MIGRATION_RULES.unmarkedSafe,
      reason: 'AGENTS.md has no managed block and no toolkit-like unmarked text.',
    });
  }

  const existingBody = canonicalAgentsBlockBody(inspectedBlock.rawBody);
  const existingSha256 = agentsBlockSha256(existingBody);
  const previousAgentsBlock = { sha256: existingSha256 };

  if (existingSha256 === agentsBlock.sha256) {
    return noWriteResult({
      action: AGENTS_MIGRATION_ACTIONS.adopt,
      source,
      agentsBlock,
      previousAgentsBlock,
      state: 'current',
      ruleId: AGENTS_MIGRATION_RULES.currentManagedBlock,
      reason: 'AGENTS.md managed block already matches the current toolkit block.',
    });
  }

  const historicalMatch = findHistoricalAgentsBlock(existingSha256, options);

  if (historicalMatch) {
    return writeResult({
      action: AGENTS_MIGRATION_ACTIONS.replace,
      source,
      content: `${source.slice(0, inspectedBlock.rangeStart)}${generatedBlock}${source.slice(inspectedBlock.rangeEnd)}`,
      agentsBlock,
      previousAgentsBlock,
      state: 'historical',
      ruleId: AGENTS_MIGRATION_RULES.historicalManagedBlock,
      reason: 'AGENTS.md managed block matches a known historical toolkit block.',
      details: { historicalMatch },
    });
  }

  return needsReviewResult({
    source,
    agentsBlock,
    previousAgentsBlock,
    state: 'unknown-managed-block',
    ruleId: AGENTS_MIGRATION_RULES.unknownManagedBlock,
    reason: 'AGENTS.md managed block hash is not current or known historical.',
    details: { actualSha256: existingSha256 },
  });
}

export const planAgentsMigration = classifyAgentsMigration;

function insertResult(options) {
  return writeResult({
    action: AGENTS_MIGRATION_ACTIONS.insert,
    ...options,
  });
}

function writeResult({ action, source, content, agentsBlock, previousAgentsBlock = null, state, ruleId, reason, details = {} }) {
  return {
    ok: true,
    blocked: false,
    review: false,
    action,
    kind: 'agents',
    path: AGENTS_PATH,
    state,
    ruleId,
    reason,
    write: true,
    changed: content !== source,
    source,
    content,
    agentsBlock,
    previousAgentsBlock,
    details,
  };
}

function noWriteResult({ action, source, agentsBlock, previousAgentsBlock = null, state, ruleId, reason, details = {} }) {
  return {
    ok: true,
    blocked: false,
    review: false,
    action,
    kind: 'agents',
    path: AGENTS_PATH,
    state,
    ruleId,
    reason,
    write: false,
    changed: false,
    source,
    content: source,
    agentsBlock,
    previousAgentsBlock,
    details,
  };
}

function needsReviewResult(options) {
  return {
    ...noWriteResult({
      action: AGENTS_MIGRATION_ACTIONS.needsReview,
      ...options,
    }),
    review: true,
  };
}

function unsafeConflictResult(options) {
  return {
    ...noWriteResult({
      action: AGENTS_MIGRATION_ACTIONS.unsafeConflict,
      ...options,
    }),
    ok: false,
    blocked: true,
  };
}

function findHistoricalAgentsBlock(sha256, options) {
  for (const candidate of historicalAgentsBlockCandidates(options)) {
    if (candidate.sha256 === sha256) return candidate;
  }

  return null;
}

function historicalAgentsBlockCandidates(options) {
  const candidates = new Map();
  addHistoricalCandidates(candidates, options.historicalAgentsBlocks);
  addHistoricalCandidates(candidates, options.historicalAgentsBlockSha256s);
  addHistoricalCandidates(candidates, options.historicalAgentsBlockHashes);
  addHistoricalRegistryCandidates(candidates, options.historicalRegistry);
  addHistoricalRegistryCandidates(candidates, options.historicalHashRegistry);
  return candidates.values();
}

function addHistoricalRegistryCandidates(candidates, registry) {
  for (const version of registry?.versions ?? []) {
    addHistoricalCandidate(candidates, version.agentsBlock, version.version);
  }
}

function addHistoricalCandidates(candidates, values) {
  if (!values) return;
  const iterable = typeof values === 'string' || !values[Symbol.iterator]
    ? [values]
    : values;

  for (const value of iterable) {
    addHistoricalCandidate(candidates, value);
  }
}

function addHistoricalCandidate(candidates, value, version = null) {
  if (!value) return;

  if (typeof value === 'string') {
    if (!candidates.has(value)) candidates.set(value, { sha256: value, version });
    return;
  }

  if (typeof value !== 'object' || Array.isArray(value)) return;

  if (value.agentsBlock) {
    addHistoricalCandidate(candidates, value.agentsBlock, value.version ?? version);
    return;
  }

  if (typeof value.sha256 === 'string' && !candidates.has(value.sha256)) {
    candidates.set(value.sha256, {
      sha256: value.sha256,
      version: value.version ?? version,
    });
  }
}
