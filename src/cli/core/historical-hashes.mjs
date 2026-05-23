import fs from 'node:fs';

export const HISTORICAL_HASH_REGISTRY_PATH = new URL('../data/historical-hashes.json', import.meta.url);

export function loadHistoricalHashRegistry(registryPath = HISTORICAL_HASH_REGISTRY_PATH) {
  return JSON.parse(fs.readFileSync(registryPath, 'utf8'));
}

export function findHistoricalFileHash(path, sha256, registry = loadHistoricalHashRegistry()) {
  if (typeof path !== 'string' || typeof sha256 !== 'string') return null;
  for (const version of registry.versions ?? []) {
    const match = (version.files ?? []).find((file) => file.path === path && file.sha256 === sha256);
    if (match) return { version: version.version, file: match };
  }
  return null;
}

export function isKnownHistoricalFileHash(path, sha256, registry = loadHistoricalHashRegistry()) {
  return findHistoricalFileHash(path, sha256, registry) !== null;
}
