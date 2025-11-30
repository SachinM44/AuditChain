#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { installCommand } from './commands/install';
import { registerCommand } from './commands/register';
import { submitCommand } from './commands/submit';
import { packagesCommand } from './commands/packages';

const program = new Command();

program
  .name('chainaudit')
  .description('ChainAudit - Human-driven NPM security bounty platform')
  .version('1.0.0');

program
  .command('install <package>')
  .description('Check package security before installing')
  .action(installCommand);

program
  .command('register <package>')
  .description('Register your npm package for auditing')
  .option('-t, --tier <tier>', 'Package tier (basic/popular/enterprise)', 'basic')
  .option('-b, --bounty <amount>', 'Initial bounty pool in APT', '20')
  .action(registerCommand);

program
  .command('submit <package>')
  .description('Submit a security finding')
  .option('-s, --severity <level>', 'Severity (low/medium/high/critical)', 'high')
  .option('-t, --title <title>', 'Finding title')
  .option('-d, --description <desc>', 'Finding description')
  .action(submitCommand);

program
  .command('packages')
  .description('Browse available packages for auditing')
  .option('-t, --tier <tier>', 'Filter by tier')
  .action(packagesCommand);

program.parse();
