#!/usr/bin/env node

import { Command } from 'commander';
import { installCommand } from './commands/install';
import { auditCommand } from './commands/audit';
import { historyCommand } from './commands/history';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('chainaudit')
  .description('ChainAudit CLI - Decentralized NPM package security auditing')
  .version('0.1.0');

program
  .command('install <package>')
  .description('Install an npm package with security audit check')
  .option('-f, --force', 'Force install even if high risk')
  .action(installCommand);

program
  .command('audit <package>')
  .description('Request or check audit status for a package')
  .option('-w, --watch', 'Watch for audit completion')
  .action(auditCommand);

program
  .command('history <package>')
  .description('View audit history for a package')
  .action(historyCommand);

program
  .command('config')
  .description('Configure ChainAudit settings')
  .option('--set-threshold <value>', 'Set risk threshold (0-100)')
  .option('--set-policy <policy>', 'Set policy: allow, warn, or block')
  .option('--set-registry <address>', 'Set Aptos registry contract address')
  .option('--show', 'Show current configuration')
  .action(configCommand);

program.parse();
