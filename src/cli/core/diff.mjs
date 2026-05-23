import { hashBuffer } from './hash.mjs';

export function diffBuffers(beforeBuffer, afterBuffer, { from = 'before', to = 'after' } = {}) {
  if (!isUtf8Text(beforeBuffer) || !isUtf8Text(afterBuffer)) {
    return binarySummary(beforeBuffer, afterBuffer, { from, to });
  }
  return diffText(beforeBuffer.toString('utf8'), afterBuffer.toString('utf8'), { from, to });
}

export function diffText(beforeText, afterText, { from = 'before', to = 'after' } = {}) {
  const beforeLines = splitStableLines(beforeText);
  const afterLines = splitStableLines(afterText);
  const operations = lineOperations(beforeLines, afterLines);
  const lines = [`--- ${from}`, `+++ ${to}`, `@@ -1,${beforeLines.length} +1,${afterLines.length} @@`];

  for (const operation of operations) {
    if (operation.type === 'same') lines.push(` ${operation.value}`);
    if (operation.type === 'remove') lines.push(`-${operation.value}`);
    if (operation.type === 'add') lines.push(`+${operation.value}`);
  }

  return `${lines.join('\n')}\n`;
}

export function binarySummary(beforeBuffer, afterBuffer, { from = 'before', to = 'after' } = {}) {
  const before = hashBuffer(beforeBuffer);
  const after = hashBuffer(afterBuffer);
  return [
    `Binary files differ: ${from} -> ${to}`,
    `${from}: sha256=${before.sha256} size=${before.size}`,
    `${to}: sha256=${after.sha256} size=${after.size}`,
    '',
  ].join('\n');
}

export function isUtf8Text(buffer) {
  if (buffer.includes(0)) return false;
  const decoded = buffer.toString('utf8');
  if (Buffer.from(decoded, 'utf8').compare(buffer) !== 0) return false;
  return !decoded.includes('\uFFFD');
}

function splitStableLines(text) {
  const normalized = text.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  if (lines.at(-1) === '') lines.pop();
  return lines;
}

function lineOperations(beforeLines, afterLines) {
  const width = afterLines.length + 1;
  const table = Array.from({ length: beforeLines.length + 1 }, () => Array(width).fill(0));

  for (let beforeIndex = beforeLines.length - 1; beforeIndex >= 0; beforeIndex -= 1) {
    for (let afterIndex = afterLines.length - 1; afterIndex >= 0; afterIndex -= 1) {
      if (beforeLines[beforeIndex] === afterLines[afterIndex]) {
        table[beforeIndex][afterIndex] = table[beforeIndex + 1][afterIndex + 1] + 1;
      } else {
        table[beforeIndex][afterIndex] = Math.max(table[beforeIndex + 1][afterIndex], table[beforeIndex][afterIndex + 1]);
      }
    }
  }

  const operations = [];
  let beforeIndex = 0;
  let afterIndex = 0;
  while (beforeIndex < beforeLines.length && afterIndex < afterLines.length) {
    if (beforeLines[beforeIndex] === afterLines[afterIndex]) {
      operations.push({ type: 'same', value: beforeLines[beforeIndex] });
      beforeIndex += 1;
      afterIndex += 1;
    } else if (table[beforeIndex + 1][afterIndex] >= table[beforeIndex][afterIndex + 1]) {
      operations.push({ type: 'remove', value: beforeLines[beforeIndex] });
      beforeIndex += 1;
    } else {
      operations.push({ type: 'add', value: afterLines[afterIndex] });
      afterIndex += 1;
    }
  }
  while (beforeIndex < beforeLines.length) {
    operations.push({ type: 'remove', value: beforeLines[beforeIndex] });
    beforeIndex += 1;
  }
  while (afterIndex < afterLines.length) {
    operations.push({ type: 'add', value: afterLines[afterIndex] });
    afterIndex += 1;
  }
  return operations;
}
