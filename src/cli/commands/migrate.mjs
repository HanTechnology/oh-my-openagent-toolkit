import fs from 'node:fs';
import path from 'node:path';

import { diffBuffers } from '../core/diff.mjs';
import { hashFile } from '../core/hash.mjs';
import { LOCKFILE_RELATIVE_PATH, manifestSha256, parseLockfileContent } from '../core/lockfile.mjs';
import { MANIFEST_PATH, validateManifestFileEntry } from '../core/manifest.mjs';
import { applyMigrationPlan } from '../core/migration-apply.mjs';
import { MIGRATION_ACTIONS, planMigration } from '../core/migration-plan.mjs';
import { resolveOutputPath, resolvePackageRoot, resolveTargetRoot } from '../core/paths.mjs';

const VALID_PROFILES = new Set(['core', 'full']);
const MODE_FLAGS = new Map([
  ['--dry-run', 'dry-run'],
  ['--diff', 'diff'],
  ['--apply', 'apply'],
]);
const REJECTED_FLAGS = new Set(['--force', '--overwrite']);
const ROOT_DOC_TARGETS = Object.freeze({
  'CHANGELOG.md': 'CHANGELOG.oh-my-openagent-toolkit.md',
  LICENSE: 'LICENSE.oh-my-openagent-toolkit',
  'README.md': 'README.oh-my-openagent-toolkit.md',
  VERSION: 'VERSION.oh-my-openagent-toolkit',
});
const MANAGED_ROOTS = Object.freeze(['.opencode/skills/', '.opencode/commands/', '.opencode/reference/']);
const PLUGIN_CONFIG_PATH = '.opencode/oh-my-openagent.jsonc';
const PLACEHOLDER_MCP_TOKEN = `<<YOUR_GITHUB_${'PERSONAL_ACCESS_TOKEN'}>>`;

export async function runMigrateCommand(argv = [], options = {}) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;

  let flags;
  try {
    flags = parseMigrateFlags(argv);
  } catch (error) {
    writeLine(stderr, error.message);
    writeLine(stderr, migrateUsage());
    return 2;
  }

  const packageRoot = options.packageRoot ?? resolvePackageRoot(import.meta.url);
  const targetRoot = resolveTargetRoot(argv, options.cwd ?? process.cwd());

  try {
    const baseManifest = readJson(path.join(packageRoot, MANIFEST_PATH));
    const fullManifestDigest = manifestSha256(baseManifest);
    const manifest = buildMigrateManifest(baseManifest, { flags, packageRoot });
    const sourcePaths = sourcePathMap(manifest);
    const previousLockfile = readPreviousLockfile(targetRoot);
    const targetFiles = snapshotMigrationTarget(targetRoot, manifest, previousLockfile);
    const plan = planMigration({
      manifest,
      mode: flags.mode,
      profile: flags.profile,
      lockfile: previousLockfile,
      targetFiles,
      manifestSha256: fullManifestDigest,
    });

    printPlan(stdout, plan, { defaultedMode: !flags.explicitMode, json: flags.json });
    if (flags.mode === 'diff' && !flags.json) printDiff(stdout, targetRoot, packageRoot, plan, manifest, sourcePaths);
    if (!plan.ok) return 2;
    if (flags.mode === 'dry-run' || flags.mode === 'diff') return 0;

    const result = applyMigrationPlan({ targetRoot, packageRoot, plan, manifest, sourcePaths });
    if (!result.ok) {
      writeLine(stdout, `- migration-error ${result.code} ${result.message}`);
      return result.status ?? 1;
    }
    if (!flags.json) writeLine(stdout, result.applied ? 'Applied migration plan.' : 'No changes to apply.');
    return 0;
  } catch (error) {
    writeLine(stderr, `migrate failed: ${error.message}`);
    return 1;
  }
}

export function parseMigrateFlags(argv) {
  const flags = {
    allowPlaceholderMcp: false,
    explicitMode: false,
    json: false,
    mode: null,
    profile: 'full',
    withMcp: false,
    withRootDocs: false,
    yes: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (MODE_FLAGS.has(arg)) {
      flags.mode = setMode(flags.mode, MODE_FLAGS.get(arg));
      flags.explicitMode = true;
    } else if (arg === '--yes') flags.yes = true;
    else if (arg === '--with-mcp') flags.withMcp = true;
    else if (arg === '--allow-placeholder-mcp') flags.allowPlaceholderMcp = true;
    else if (arg === '--with-root-docs') flags.withRootDocs = true;
    else if (arg === '--json') flags.json = true;
    else if (REJECTED_FLAGS.has(arg)) throw new Error(`${arg} is not supported for migration; safe migration never overwrites project-owned files.`);
    else if (arg === '--profile') {
      index += 1;
      flags.profile = requireFlagValue(argv[index], '--profile');
    } else if (arg.startsWith('--profile=')) {
      flags.profile = requireFlagValue(arg.slice('--profile='.length), '--profile');
    } else if (arg === '--target') {
      index += 1;
      requireFlagValue(argv[index], '--target');
    } else if (arg.startsWith('--target=')) {
      requireFlagValue(arg.slice('--target='.length), '--target');
    } else {
      throw new Error(`Unknown migrate option: ${arg}`);
    }
  }

  if (!VALID_PROFILES.has(flags.profile)) throw new Error(`Unsupported profile: ${flags.profile}`);
  if (!flags.mode) flags.mode = flags.yes ? 'apply' : 'dry-run';
  return flags;
}

function setMode(current, next) {
  if (current && current !== next) throw new Error('--dry-run, --diff, and --apply are mutually exclusive.');
  return next;
}

function requireFlagValue(value, flag) {
  if (!value || value.startsWith('--')) throw new Error(`${flag} requires a value.`);
  return value;
}

function buildMigrateManifest(manifest, { flags, packageRoot }) {
  const files = [];
  for (const entry of manifest.files) {
    if (entry.path === '.mcp.json') {
      if (!flags.withMcp) continue;
      const content = fs.readFileSync(path.join(packageRoot, entry.path), 'utf8');
      if (!flags.allowPlaceholderMcp && content.includes(PLACEHOLDER_MCP_TOKEN)) {
        throw new Error('.mcp.json contains a placeholder token; rerun with --allow-placeholder-mcp to include it.');
      }
      files.push(asManagedEntry(entry, { profiles: [flags.profile] }));
      continue;
    }

    if (Object.hasOwn(ROOT_DOC_TARGETS, entry.path)) {
      if (!flags.withRootDocs) continue;
      files.push(asManagedEntry(entry, { path: ROOT_DOC_TARGETS[entry.path], profiles: [flags.profile], sourcePath: entry.path }));
      continue;
    }

    files.push(entry);
  }
  return { ...manifest, files };
}

function asManagedEntry(entry, overrides = {}) {
  return validateManifestFileEntry({
    ...entry,
    path: overrides.path ?? entry.path,
    profiles: overrides.profiles ?? entry.profiles,
    sourcePath: overrides.sourcePath ?? entry.sourcePath,
    strategy: 'managed',
  });
}

function sourcePathMap(manifest) {
  const map = new Map();
  for (const entry of manifest.files) {
    const original = entry.sourcePath ?? Object.entries(ROOT_DOC_TARGETS).find(([, target]) => target === entry.path)?.[0] ?? entry.path;
    map.set(entry.path, original);
  }
  return map;
}

function snapshotMigrationTarget(targetRoot, manifest, lockfile) {
  const paths = new Set(['AGENTS.md', LOCKFILE_RELATIVE_PATH]);
  for (const entry of manifest.files) paths.add(entry.path);
  for (const record of lockfile?.files ?? []) paths.add(record.path);
  for (const relativePath of lockfile?.overrides?.localOnly ?? []) paths.add(relativePath);
  for (const relativePath of listManagedRootFiles(targetRoot)) paths.add(relativePath);

  const targetFiles = {};
  for (const relativePath of [...paths].sort((left, right) => left.localeCompare(right, 'en-US'))) {
    const absolutePath = resolveOutputPath(targetRoot, relativePath);
    if (!fs.existsSync(absolutePath)) continue;
    const stats = fs.lstatSync(absolutePath);
    if (stats.isSymbolicLink()) {
      targetFiles[relativePath] = { isSymbolicLink: true };
    } else if (stats.isDirectory()) {
      targetFiles[relativePath] = { isDirectory: true };
    } else if (stats.isFile()) {
      targetFiles[relativePath] = relativePath === 'AGENTS.md'
        ? { content: fs.readFileSync(absolutePath, 'utf8') }
        : hashFile(absolutePath);
    }
  }
  return targetFiles;
}

function listManagedRootFiles(targetRoot) {
  if (!fs.existsSync(targetRoot)) return [];
  const results = [];
  walkTarget(targetRoot, targetRoot, results);
  return results.filter((relativePath) => isManagedInstallPath(relativePath)).sort((left, right) => left.localeCompare(right, 'en-US'));
}

function walkTarget(root, current, results) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    const absolutePath = path.join(current, entry.name);
    const relativePath = path.relative(root, absolutePath).split(path.sep).join(path.posix.sep);
    if (entry.isDirectory()) walkTarget(root, absolutePath, results);
    else if (entry.isFile() || entry.isSymbolicLink()) results.push(relativePath);
  }
}

function isManagedInstallPath(relativePath) {
  return relativePath === PLUGIN_CONFIG_PATH || MANAGED_ROOTS.some((root) => relativePath.startsWith(root));
}

function readPreviousLockfile(targetRoot) {
  const lockfilePath = resolveOutputPath(targetRoot, LOCKFILE_RELATIVE_PATH);
  if (!fs.existsSync(lockfilePath)) return null;
  return parseLockfileContent(fs.readFileSync(lockfilePath, 'utf8'));
}

function printPlan(stdout, plan, { defaultedMode, json }) {
  if (json) {
    writeLine(stdout, JSON.stringify(jsonPlan(plan, { defaultedMode }), null, 2));
    return;
  }
  writeLine(stdout, `Migration plan (${plan.mode}, profile ${plan.profile}):`);
  for (const action of plan.actions) {
    const rule = action.ruleId ? ` ${action.ruleId}` : '';
    writeLine(stdout, `- ${action.action} ${action.path}${rule}${action.write ? ' [write]' : ''}`);
  }
  if (plan.actions.length === 0) writeLine(stdout, 'No changes to apply.');
}

function jsonPlan(plan, { defaultedMode }) {
  return {
    actions: plan.actions,
    conflicts: plan.conflicts,
    reviews: plan.reviews,
    localOnly: plan.localOnly ?? [],
    plannedWrites: plan.plannedWrites.length,
    blocked: plan.blocked,
    ok: plan.ok,
    defaultedMode,
  };
}

function printDiff(stdout, targetRoot, packageRoot, plan, manifest, sourcePaths) {
  const entriesByPath = new Map(manifest.files.map((entry) => [entry.path, entry]));
  for (const action of plan.actions) {
    if (!diffableAction(action)) continue;
    const before = readTargetBuffer(targetRoot, action.path);
    const after = afterBufferForAction(packageRoot, action, { entriesByPath, sourcePaths });
    writeLine(stdout, `diff ${action.path}`);
    stdout.write(diffBuffers(before, after, { from: `${action.path} (current)`, to: `${action.path} (desired)` }));
  }
}

function diffableAction(action) {
  return [
    MIGRATION_ACTIONS.CREATE_MISSING,
    MIGRATION_ACTIONS.REPLACE_KNOWN_STALE,
    MIGRATION_ACTIONS.AGENTS_INSERT,
    MIGRATION_ACTIONS.AGENTS_REPLACE,
  ].includes(action.action);
}

function readTargetBuffer(targetRoot, relativePath) {
  const absolutePath = resolveOutputPath(targetRoot, relativePath);
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile() ? fs.readFileSync(absolutePath) : Buffer.alloc(0);
}

function afterBufferForAction(packageRoot, action, { entriesByPath, sourcePaths }) {
  if (action.kind === 'agents') return Buffer.from(action.content ?? '', 'utf8');
  const entry = entriesByPath.get(action.path);
  if (!entry) throw new Error(`No manifest entry for migration diff: ${action.path}`);
  return fs.readFileSync(path.join(packageRoot, sourcePaths.get(action.path) ?? entry.path));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeLine(stream, message = '') {
  stream.write(`${message}\n`);
}

function migrateUsage() {
  return 'Usage: omo-toolkit migrate [--target <path>] [--profile core|full] [--dry-run|--diff|--apply] [--yes] [--with-mcp] [--allow-placeholder-mcp] [--with-root-docs] [--json]';
}
