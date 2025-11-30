"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCommand = installCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const aptos_client_1 = require("../utils/aptos-client");
const config_1 = require("../utils/config");
async function installCommand(packageName) {
    const spinner = (0, ora_1.default)(`Checking security for ${packageName}...`).start();
    try {
        const client = (0, aptos_client_1.getAptosClient)();
        // Query package info from blockchain
        const result = await client.view({
            payload: {
                function: `${config_1.MODULE_ADDRESS}::PackageRegistry::get_package_info`,
                typeArguments: [],
                functionArguments: [config_1.MODULE_ADDRESS, packageName]
            }
        });
        const [exists, owner, tier, bountyPool, credibility, totalFindings, acceptedFindings] = result;
        spinner.stop();
        if (!exists) {
            console.log(chalk_1.default.yellow(`\n⚠️  Package "${packageName}" not registered on ChainAudit`));
            console.log(chalk_1.default.gray('This package has not been audited yet.\n'));
            return;
        }
        // Calculate security score (simplified)
        const acceptedCount = Number(acceptedFindings) || 0;
        const securityScore = acceptedCount > 0
            ? Math.max(0, 100 - (acceptedCount * 10))
            : 100;
        console.log(chalk_1.default.green(`\n✓ Package registered on ChainAudit\n`));
        console.log(chalk_1.default.bold(`Security Score: ${getScoreColor(securityScore)}${securityScore}/100${chalk_1.default.reset()}\n`));
        console.log(chalk_1.default.bold('📊 Audit Summary:'));
        console.log(`  Total Findings: ${totalFindings}`);
        console.log(`  Accepted Findings: ${acceptedFindings}`);
        console.log(`  Bounty Pool: ${Number(bountyPool) / 100000000} APT`);
        console.log(`  Owner Credibility: ${credibility}/100\n`);
        if (Number(acceptedFindings) > 0) {
            console.log(chalk_1.default.yellow(`⚠️  This package has ${acceptedFindings} accepted security findings`));
            console.log(chalk_1.default.gray(`Run 'chainaudit audit ${packageName}' for details\n`));
        }
        // Ask for confirmation
        console.log(chalk_1.default.cyan('Proceed with installation? (y/n)'));
    }
    catch (error) {
        spinner.stop();
        console.error(chalk_1.default.red(`\n❌ Error: ${error.message}\n`));
    }
}
function getScoreColor(score) {
    if (score >= 80)
        return chalk_1.default.green;
    if (score >= 60)
        return chalk_1.default.yellow;
    return chalk_1.default.red;
}
//# sourceMappingURL=install.js.map