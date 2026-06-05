#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { manifestSha256 } from '../src/cli/core/lockfile.mjs';

const REGISTRY_RELATIVE_PATH = 'src/cli/data/historical-hashes.json';
const SCHEMA_VERSION = 1;

function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.length === 0) {
    printHelp();
    return 0;
  }

  if (argv.length !== 1 || (!argv.includes('--write') && !argv.includes('--check'))) {
    console.error(`Unknown option: ${argv.join(' ')}`);
    printHelp();
    return 2;
  }

  const packageRoot = path.resolve(new URL('..', import.meta.url).pathname);
  const registryPath = path.join(packageRoot, REGISTRY_RELATIVE_PATH);
  const actual = fs.existsSync(registryPath) ? fs.readFileSync(registryPath, 'utf8') : null;
  const existingRegistry = actual ? readExistingRegistry(actual) : null;
  const generatedAt = actual ? existingRegistry?.generatedAt ?? null : readManifest(packageRoot).source?.generatedAt ?? null;
  const expected = registryToJson(buildHistoricalRegistry(packageRoot, { existingRegistry, generatedAt }));

  if (argv.includes('--write')) {
    fs.mkdirSync(path.dirname(registryPath), { recursive: true });
    fs.writeFileSync(registryPath, expected);
    console.log(`wrote ${registryPath}`);
    return 0;
  }

  if (actual === expected) {
    console.log(`historical hashes are current: ${registryPath}`);
    return 0;
  }

  console.error(`historical hashes are stale: ${registryPath}`);
  return 1;
}

export function buildHistoricalRegistry(packageRoot, options = {}) {
  const packageJson = readJson(path.join(packageRoot, 'package.json'));
  const manifest = readManifest(packageRoot);
  const files = manifest.files
    .map((file) => ({
      path: file.path,
      sha256: file.sha256,
      mode: file.mode,
      kind: file.kind,
    }))
    .sort(compareByPath);

  const currentVersion = {
    version: packageJson.version,
    manifestSha256: manifestSha256(manifest),
    files,
    agentsBlock: {
      sha256: manifest.agentsBlock.sha256,
    },
  };

  return sortJsonValue({
    schema: SCHEMA_VERSION,
    generatedAt: options.generatedAt ?? manifest.source?.generatedAt ?? null,
    versions: mergeHistoricalVersions(options.existingRegistry, currentVersion),
  });
}

export function registryToJson(registry) {
  return `${JSON.stringify(sortJsonValue(registry), null, 2)}\n`;
}

function readManifest(packageRoot) {
  return readJson(path.join(packageRoot, 'toolkit-manifest.json'));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readExistingRegistry(content) {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function mergeHistoricalVersions(existingRegistry, currentVersion) {
  const existingVersions = Array.isArray(existingRegistry?.versions) ? existingRegistry.versions : [];
  const versions = [];
  let replacedCurrent = false;

  for (const versionEntry of existingVersions) {
    if (versionEntry?.version !== currentVersion.version) {
      versions.push(versionEntry);
      continue;
    }

    if (!replacedCurrent) {
      versions.push(currentVersion);
      replacedCurrent = true;
    }
  }

  if (!replacedCurrent) versions.push(currentVersion);
  return versions;
}

function compareByPath(left, right) {
  return left.path.localeCompare(right.path, 'en-US');
}

function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey, 'en-US'))
      .map(([key, entryValue]) => [key, sortJsonValue(entryValue)])
  );
}

function printHelp() {
  console.log('Usage: node scripts/generate-historical-hashes.mjs [--write|--check]');
}

process.exitCode = main();
