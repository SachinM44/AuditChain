#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const install_1 = require("./commands/install");
const register_1 = require("./commands/register");
const submit_1 = require("./commands/submit");
const packages_1 = require("./commands/packages");
const program = new commander_1.Command();
program
    .name('chainaudit')
    .description('ChainAudit - Human-driven NPM security bounty platform')
    .version('1.0.0');
program
    .command('install <package>')
    .description('Check package security before installing')
    .action(install_1.installCommand);
program
    .command('register <package>')
    .description('Register your npm package for auditing')
    .option('-t, --tier <tier>', 'Package tier (basic/popular/enterprise)', 'basic')
    .option('-b, --bounty <amount>', 'Initial bounty pool in APT', '20')
    .action(register_1.registerCommand);
program
    .command('submit <package>')
    .description('Submit a security finding')
    .option('-s, --severity <level>', 'Severity (low/medium/high/critical)', 'high')
    .option('-t, --title <title>', 'Finding title')
    .option('-d, --description <desc>', 'Finding description')
    .action(submit_1.submitCommand);
program
    .command('packages')
    .description('Browse available packages for auditing')
    .option('-t, --tier <tier>', 'Filter by tier')
    .action(packages_1.packagesCommand);
program.parse();
//# sourceMappingURL=index.js.map