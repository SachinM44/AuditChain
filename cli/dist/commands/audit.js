"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditCommand = auditCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptos_client_1 = require("../utils/aptos-client");
const config_1 = require("../utils/config");
async function auditCommand(packageSpec, options) {
    const spinner = (0, ora_1.default)('Checking audit status...').start();
    try {
        const [packageName, version] = parsePackageSpec(packageSpec);
        if (!version) {
            spinner.fail('Please specify a version: package@version');
            return;
        }
        const config = (0, config_1.loadConfig)();
        if (!config.registryAddress) {
            spinner.fail('Registry address not configured');
            console.log(chalk_1.default.yellow('Run: chainaudit config --set-registry <address>'));
            return;
        }
        const client = new aptos_client_1.AptosClient(config.network === 'mainnet' ? ts_sdk_1.Network.MAINNET : ts_sdk_1.Network.TESTNET, config.registryAddress);
        const audit = await client.getLatestAudit(packageName, version);
        if (!audit || !audit.exists) {
            spinner.info(`No audit found for ${packageName}@${version}`);
            console.log('');
            console.log(chalk_1.default.yellow('📝 Audit Request'));
            console.log(chalk_1.default.gray('─'.repeat(50)));
            console.log(chalk_1.default.gray('  This package needs to be audited.'));
            console.log(chalk_1.default.gray('  In production, this would trigger an on-chain audit request.'));
            console.log(chalk_1.default.gray('  Auditor nodes would analyze the package and submit findings.'));
            console.log(chalk_1.default.gray('─'.repeat(50)));
            console.log('');
            console.log(chalk_1.default.cyan('💡 Tip: Check back in a few minutes for results'));
            return;
        }
        spinner.succeed('Audit found!');
        console.log('');
        console.log(chalk_1.default.bold('📋 Detailed Audit Report'));
        console.log(chalk_1.default.gray('═'.repeat(50)));
        console.log('');
        console.log(chalk_1.default.bold('Package:        ') + chalk_1.default.cyan(`${packageName}@${version}`));
        const riskColor = audit.riskScore < 30 ? chalk_1.default.green :
            audit.riskScore < 70 ? chalk_1.default.yellow : chalk_1.default.red;
        console.log(chalk_1.default.bold('Risk Score:     ') + riskColor(`${audit.riskScore}/100`));
        console.log(chalk_1.default.bold('Risk Category:  ') + riskColor(client.getRiskCategoryString(audit.riskCategory)));
        console.log(chalk_1.default.bold('Audited by:     ') + chalk_1.default.cyan(`${audit.auditorCount} independent nodes`));
        console.log(chalk_1.default.bold('Last audit:     ') + chalk_1.default.gray(client.formatTimestamp(audit.timestamp)));
        console.log(chalk_1.default.bold('Findings:       ') + (audit.findingsCount > 0 ? chalk_1.default.yellow(audit.findingsCount) : chalk_1.default.green('None')));
        console.log('');
        console.log(chalk_1.default.gray('═'.repeat(50)));
        if (audit.riskScore >= 70) {
            console.log('');
            console.log(chalk_1.default.red('⚠️  HIGH RISK: This package may contain malicious code'));
            console.log(chalk_1.default.gray('   Review findings carefully before using'));
        }
        else if (audit.riskScore >= 30) {
            console.log('');
            console.log(chalk_1.default.yellow('⚠️  MEDIUM RISK: Some suspicious patterns detected'));
            console.log(chalk_1.default.gray('   Consider reviewing the package code'));
        }
        else {
            console.log('');
            console.log(chalk_1.default.green('✓ LOW RISK: No significant security concerns detected'));
        }
        console.log('');
    }
    catch (error) {
        spinner.fail('Error checking audit status');
        console.error(chalk_1.default.red(error));
    }
}
function parsePackageSpec(spec) {
    const parts = spec.split('@');
    if (parts.length === 2) {
        return [parts[0], parts[1]];
    }
    else if (parts.length === 3 && parts[0] === '') {
        return [`@${parts[1]}`, parts[2]];
    }
    return [spec, null];
}
//# sourceMappingURL=audit.js.map