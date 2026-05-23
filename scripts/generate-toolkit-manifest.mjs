#!/usr/bin/env node
import process from 'node:process';

import {
  checkToolkitManifest,
  validateManifestPath,
  writeToolkitManifest,
} from '../src/cli/core/manifest.mjs';

function main(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.length === 0) {
    printHelp();
    return 0;
  }

  if (argv[0] === '--validate-path') {
    return validatePathCommand(argv[1]);
  }

  if (argv.includes('--write')) {
    const result = writeToolkitManifest();
    console.log(`wrote ${result.manifestPath}`);
    console.log(`files ${result.manifest.files.length}`);
    return 0;
  }

  if (argv.includes('--check')) {
    const result = checkToolkitManifest();
    if (result.ok) {
      console.log(`manifest is current: ${result.manifestPath}`);
      return 0;
    }
    console.error(`manifest is stale: ${result.manifestPath}`);
    return 1;
  }

  console.error(`Unknown option: ${argv.join(' ')}`);
  printHelp();
  return 2;
}

function validatePathCommand(relativePath) {
  try {
    validateManifestPath(relativePath);
    console.log(`safe manifest path: ${relativePath}`);
    return 0;
  } catch (error) {
    console.error(`${error.code ?? error.name}: ${error.message}`);
    return 2;
  }
}

function printHelp() {
  console.log(`Usage: node scripts/generate-toolkit-manifest.mjs [--write|--check|--validate-path <path>]`);
}

process.exitCode = main();
