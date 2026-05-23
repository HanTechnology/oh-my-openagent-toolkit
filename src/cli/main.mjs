import { readFileSync } from 'node:fs';

import { runInitCommand } from './commands/init.mjs';
import { runMigrateCommand } from './commands/migrate.mjs';
import { runUpdateCommand } from './commands/update.mjs';
import { runValidateCommand } from './commands/validate.mjs';
import { runDoctorCommand } from './commands/doctor.mjs';

const USAGE = `Oh My OpenAgent Toolkit CLI

Usage:
  omo-toolkit <command>

Commands:
  init        Initialize toolkit files
  migrate     Migrate existing toolkit files into lockfile ownership
  update      Update toolkit files
  validate    Validate toolkit installation
  doctor      Diagnose toolkit installation
  help        Show this help message

Options:
  --help      Show this help message
  --version   Show CLI version`;

function writeLine(stream, message = '') {
  stream.write(`${message}\n`);
}

function readToolkitVersion() {
  return readFileSync(new URL('../../VERSION', import.meta.url), 'utf8').trim();
}

export async function runCli(argv = [], options = {}) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const command = argv[0] ?? 'help';

  if (command === 'help' || command === '--help' || command === '-h') {
    writeLine(stdout, USAGE);
    return 0;
  }

  if (command === '--version' || command === '-v') {
    writeLine(stdout, readToolkitVersion());
    return 0;
  }

  if (command === 'init') {
    return runInitCommand(argv.slice(1), options);
  }

  if (command === 'migrate') {
    return runMigrateCommand(argv.slice(1), options);
  }

  if (command === 'update') {
    return runUpdateCommand(argv.slice(1), options);
  }

  if (command === 'validate') {
    return runValidateCommand(argv.slice(1), options);
  }

  if (command === 'doctor') {
    return runDoctorCommand(argv.slice(1), options);
  }

  writeLine(stderr, `Unknown command: ${command}`);
  writeLine(stderr);
  writeLine(stderr, USAGE);
  return 2;
}
