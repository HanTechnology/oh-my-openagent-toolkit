import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import {
  BEGIN_MARKER,
  END_MARKER,
  agentsBlockSha256,
} from './agents-block.mjs';
import { hashFile } from './hash.mjs';
import {
  resolvePackageRoot,
  resolveReadPath,
  validatePathSet,
  validateRelativePath,
} from './paths.mjs';

export const MANIFEST_SCHEMA_VERSION = 1;
export const MANIFEST_PATH = 'toolkit-manifest.json';

export const DEFAULT_CORE_REFERENCES = Object.freeze([
  '.opencode/reference/routing-matrix.md',
  '.opencode/reference/opencode-compatibility-model.md',
  '.opencode/reference/support-policy.md',
  '.opencode/reference/workflow-catalog.md',
  '.opencode/reference/capability-matrix.json',
  '.opencode/reference/workspace-model.md',
  '.opencode/reference/project-setup-policy.md',
]);

export const OPT_IN_PATHS = Object.freeze([
  '.mcp.json',
  'README.md',
  'CHANGELOG.md',
  'VERSION',
  'LICENSE',
]);

export const MANIFEST_FILE_KINDS = Object.freeze([
  'skill',
  'command',
  'reference',
  'plugin-config',
  'root-doc',
  'license',
  'template',
]);

const PROFILE_NAMES = Object.freeze(['core', 'full', 'opt-in']);
const FORBIDDEN_PATH_SEGMENTS = Object.freeze(['.git', '.omo', 'workspace', 'node_modules']);
const GENERATED_EXCLUDES = Object.freeze(['toolkit-manifest.json']);

export function buildToolkitManifest(options = {}) {
  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const packageJson = readJson(resolveReadPath(packageRoot, 'package.json'));
  const version = fs.readFileSync(resolveReadPath(packageRoot, 'VERSION'), 'utf8').trim();
  const generatedAt = Object.hasOwn(options, 'generatedAt') ? options.generatedAt : new Date().toISOString();
  const gitCommit = Object.hasOwn(options, 'gitCommit') ? options.gitCommit : readGitCommit(packageRoot);
  const files = buildManifestFiles(packageRoot);

  return sortJsonValue({
    schema: MANIFEST_SCHEMA_VERSION,
    toolkit: {
      version,
      packageName: packageJson.name,
    },
    source: {
      generatedAt,
      gitCommit,
    },
    profiles: buildProfiles(),
    files,
    agentsBlock: buildAgentsBlockMetadata(),
  });
}

export function manifestToJson(manifest) {
  return `${JSON.stringify(sortJsonValue(manifest), null, 2)}\n`;
}

export function expectedManifestJson(options = {}) {
  return manifestToJson(buildToolkitManifest(options));
}

export function writeToolkitManifest(options = {}) {
  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const manifest = buildToolkitManifest({ ...options, packageRoot });
  const manifestPath = path.join(packageRoot, MANIFEST_PATH);
  const content = manifestToJson(manifest);
  fs.writeFileSync(manifestPath, content);
  return { manifest, manifestPath, content };
}

export function checkToolkitManifest(options = {}) {
  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const manifestPath = path.join(packageRoot, MANIFEST_PATH);
  const actual = fs.existsSync(manifestPath) ? fs.readFileSync(manifestPath, 'utf8') : null;
  const sourceMetadata = actual ? readSourceMetadataFromContent(actual) : {};
  const expected = expectedManifestJson({ ...options, packageRoot, ...sourceMetadata });
  return {
    ok: actual === expected,
    manifestPath,
    expected,
    actual,
  };
}

export function validateManifestPath(relativePath) {
  validateRelativePath(relativePath);
  assertAllowedManifestPath(relativePath);
  return relativePath;
}

export function validateManifestFileEntry(entry) {
  validateManifestPath(entry?.path);
  if (!/^[a-f0-9]{64}$/.test(entry.sha256)) {
    throw new Error(`Manifest entry has invalid sha256: ${entry.path}`);
  }
  if (!Number.isSafeInteger(entry.size) || entry.size < 0) {
    throw new Error(`Manifest entry has invalid size: ${entry.path}`);
  }
  if (!['100644', '100755'].includes(entry.mode)) {
    throw new Error(`Manifest entry has invalid mode: ${entry.path}`);
  }
  if (entry.owner !== 'toolkit') {
    throw new Error(`Manifest entry has invalid owner: ${entry.path}`);
  }
  if (!MANIFEST_FILE_KINDS.includes(entry.kind)) {
    throw new Error(`Manifest entry has unsupported kind ${entry.kind}: ${entry.path}`);
  }
  if (!Array.isArray(entry.profiles) || entry.profiles.length === 0) {
    throw new Error(`Manifest entry must belong to at least one profile: ${entry.path}`);
  }
  for (const profile of entry.profiles) {
    if (!PROFILE_NAMES.includes(profile)) {
      throw new Error(`Manifest entry has unknown profile ${profile}: ${entry.path}`);
    }
  }
  return entry;
}

function buildManifestFiles(packageRoot) {
  const opencodeFiles = listFiles(packageRoot, '.opencode');
  const optInFiles = OPT_IN_PATHS.filter((relativePath) => fs.existsSync(path.join(packageRoot, relativePath)));
  const entries = [...opencodeFiles, ...optInFiles]
    .filter((relativePath) => !GENERATED_EXCLUDES.includes(relativePath))
    .map((relativePath) => buildFileEntry(packageRoot, relativePath));

  validatePathSet(entries.map((entry) => entry.path));
  for (const entry of entries) validateManifestFileEntry(entry);
  return entries.sort(compareByPath);
}

function buildFileEntry(packageRoot, relativePath) {
  validateManifestPath(relativePath);
  const hashed = hashFile(resolveReadPath(packageRoot, relativePath));
  return sortJsonValue({
    path: relativePath,
    sha256: hashed.sha256,
    size: hashed.size,
    mode: hashed.mode,
    owner: 'toolkit',
    strategy: entryStrategy(relativePath),
    profiles: entryProfiles(relativePath),
    kind: entryKind(relativePath),
  });
}

function buildProfiles() {
  return sortJsonValue({
    core: {
      default: true,
      description: 'Core routing command, required references, toolkit config, and AGENTS managed block metadata.',
      includes: [
        '.opencode/commands/**',
        ...DEFAULT_CORE_REFERENCES,
        '.opencode/oh-my-openagent.jsonc',
      ].sort(),
      agentsBlock: true,
    },
    full: {
      default: true,
      description: 'Full toolkit payload: all skills, commands, references, toolkit config, and AGENTS managed block metadata.',
      includes: [
        '.opencode/skills/**',
        '.opencode/commands/**',
        '.opencode/reference/**',
        '.opencode/oh-my-openagent.jsonc',
      ].sort(),
      agentsBlock: true,
    },
    'opt-in': {
      default: false,
      description: 'Repository-level files that are inventoried but never installed by default.',
      includes: [...OPT_IN_PATHS].sort(),
      agentsBlock: false,
    },
  });
}

function buildAgentsBlockMetadata() {
  return sortJsonValue({
    path: 'src/cli/templates/agents-managed-block.md',
    sha256: agentsBlockSha256(),
    beginMarker: BEGIN_MARKER,
    endMarker: END_MARKER,
    profiles: ['core', 'full'],
    strategy: 'merge-managed-block',
    kind: 'template',
  });
}

function entryProfiles(relativePath) {
  if (OPT_IN_PATHS.includes(relativePath)) return ['opt-in'];
  if (relativePath.startsWith('.opencode/skills/')) return ['full'];
  if (relativePath.startsWith('.opencode/reference/')) {
    return DEFAULT_CORE_REFERENCES.includes(relativePath) ? ['core', 'full'] : ['full'];
  }
  if (relativePath.startsWith('.opencode/commands/') || relativePath === '.opencode/oh-my-openagent.jsonc') {
    return ['core', 'full'];
  }
  return ['full'];
}

function entryStrategy(relativePath) {
  return OPT_IN_PATHS.includes(relativePath) ? 'opt-in' : 'managed';
}

function entryKind(relativePath) {
  if (relativePath === '.opencode/oh-my-openagent.jsonc') return 'plugin-config';
  if (relativePath === '.mcp.json') return 'plugin-config';
  if (relativePath.startsWith('.opencode/commands/')) return 'command';
  if (relativePath.startsWith('.opencode/skills/')) return 'skill';
  if (relativePath.startsWith('.opencode/reference/')) return 'reference';
  if (relativePath === 'README.md' || relativePath === 'CHANGELOG.md' || relativePath === 'VERSION') return 'root-doc';
  if (relativePath === 'LICENSE') return 'license';
  throw new Error(`Manifest path has no file kind mapping: ${relativePath}`);
}

function listFiles(packageRoot, relativeDirectory) {
  const directoryPath = resolveReadPath(packageRoot, relativeDirectory);
  const results = [];
  walkDirectory(packageRoot, directoryPath, results);
  return results.sort();
}

function walkDirectory(packageRoot, directoryPath, results) {
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    if (FORBIDDEN_PATH_SEGMENTS.includes(entry.name)) continue;
    const entryPath = path.join(directoryPath, entry.name);
    const relativePath = toRelativeManifestPath(packageRoot, entryPath);
    if (isForbiddenManifestPath(relativePath)) continue;
    if (entry.isDirectory()) {
      walkDirectory(packageRoot, entryPath, results);
      continue;
    }
    if (entry.isFile()) results.push(relativePath);
  }
}

function toRelativeManifestPath(packageRoot, absolutePath) {
  return path.relative(packageRoot, absolutePath).split(path.sep).join(path.posix.sep);
}

function assertAllowedManifestPath(relativePath) {
  if (isForbiddenManifestPath(relativePath)) {
    const error = new Error(`Manifest path is excluded from toolkit payload: ${relativePath}`);
    error.code = 'E_MANIFEST_EXCLUDED_PATH';
    throw error;
  }
}

function isForbiddenManifestPath(relativePath) {
  const parts = String(relativePath).split('/');
  if (parts.some((part) => FORBIDDEN_PATH_SEGMENTS.includes(part))) return true;
  if (relativePath.startsWith('test/fixtures/')) return true;
  if (relativePath.endsWith('.tgz')) return true;
  return false;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}


function readSourceMetadataFromContent(content) {
  try {
    const source = JSON.parse(content)?.source ?? {};
    return {
      generatedAt: source.generatedAt ?? null,
      gitCommit: source.gitCommit ?? null,
    };
  } catch {
    return { generatedAt: null, gitCommit: null };
  }
}

function readGitCommit(packageRoot) {
  try {
    const dirtyStatus = execFileSync('git', ['status', '--porcelain'], {
      cwd: packageRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      env: { ...process.env, GIT_MASTER: '1' },
    }).trim();
    if (dirtyStatus) return null;
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: packageRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      env: { ...process.env, GIT_MASTER: '1' },
    }).trim();
  } catch {
    return null;
  }
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
