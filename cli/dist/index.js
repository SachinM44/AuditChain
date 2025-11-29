#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const install_1 = require("./commands/install");
const audit_1 = require("./commands/audit");
const history_1 = require("./commands/history");
const config_1 = require("./commands/config");
const program = new commander_1.Command();
program
    .name('chainaudit')
    .description('ChainAudit CLI - Decentralized NPM package security auditing')
    .version('0.1.0');
program
    .command('install <package>')
    .description('Install an npm package with security audit check')
    .option('-f, --force', 'Force install even if high risk')
    .action(install_1.installCommand);
program
    .command('audit <package>')
    .description('Request or check audit status for a package')
    .option('-w, --watch', 'Watch for audit completion')
    .action(audit_1.auditCommand);
program
    .command('history <package>')
    .description('View audit history for a package')
    .action(history_1.historyCommand);
program
    .command('config')
    .description('Configure ChainAudit settings')
    .option('--set-threshold <value>', 'Set risk threshold (0-100)')
    .option('--set-policy <policy>', 'Set policy: allow, warn, or block')
    .option('--set-registry <address>', 'Set Aptos registry contract address')
    .option('--show', 'Show current configuration')
    .action(config_1.configCommand);
program.parse();
//# sourceMappingURL=index.js.map