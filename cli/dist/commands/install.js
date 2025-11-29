"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCommand = installCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const ts_sdk_1 = require("@aptos-labs/ts-sdk");
const aptos_client_1 = require("../utils/aptos-client");
const config_1 = require("../utils/config");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function installCommand(packageSpec, options) {
    const spinner = (0, ora_1.default)('Checking package audit status...').start();
    try {
        // Parse package name and version
        const [packageName, version] = parsePackageSpec(packageSpec);
        if (!version) {
            spinner.fail('Please specify a version: package@version');
            return;
        }
        // Load config
        const config = (0, config_1.loadConfig)();
        if (!config.registryAddress) {
            spinner.warn('Registry address not configured. Run: chainaudit config --set-registry <address>');
            spinner.info('Proceeding with standard npm install...');
            await npmInstall(packageSpec);
            return;
        }
        // Check audit on Aptos
        const client = new aptos_client_1.AptosClient(config.network === 'mainnet' ? ts_sdk_1.Network.MAINNET : ts_sdk_1.Network.TESTNET, config.registryAddress);
        const audit = await client.getLatestAudit(packageName, version);
        if (!audit || !audit.exists) {
            spinner.warn(`No audit found for ${packageName}@${version}`);
            console.log(chalk_1.default.yellow('\n⚠️  This package has not been audited yet.'));
            console.log(chalk_1.default.gray('   Run: chainaudit audit ' + packageSpec + ' to request an audit\n'));
            if (config.policy === 'block') {
                spinner.fail('Installation blocked by policy');
                return;
            }
            await npmInstall(packageSpec);
            return;
        }
        // Display audit results
        spinner.succeed('Audit found!');
        console.log('');
        console.log(chalk_1.default.bold('📋 Audit Results:'));
        console.log(chalk_1.default.gray('─'.repeat(50)));
        const riskColor = audit.riskScore < 30 ? chalk_1.default.green :
            audit.riskScore < 70 ? chalk_1.default.yellow : chalk_1.default.red;
        console.log(`  Risk Score:     ${riskColor(audit.riskScore + '/100')} (${client.getRiskCategoryString(audit.riskCategory)})`);
        console.log(`  Audited by:     ${chalk_1.default.cyan(audit.auditorCount + ' nodes')}`);
        console.log(`  Last audit:     ${chalk_1.default.gray(client.formatTimestamp(audit.timestamp))}`);
        console.log(`  Findings:       ${audit.findingsCount > 0 ? chalk_1.default.yellow(audit.findingsCount) : chalk_1.default.green('0')}`);
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log('');
        // Policy enforcement
        if (audit.riskScore >= config.riskThreshold) {
            if (config.policy === 'block' && !options.force) {
                console.log(chalk_1.default.red('❌ Installation blocked due to high risk score'));
                console.log(chalk_1.default.gray('   Use --force to override\n'));
                return;
            }
            if (config.policy === 'warn') {
                console.log(chalk_1.default.yellow('⚠️  Warning: High risk score detected'));
                console.log(chalk_1.default.gray('   Proceeding with installation...\n'));
            }
        }
        else {
            console.log(chalk_1.default.green('✓ Package passed security check\n'));
        }
        // Install package
        await npmInstall(packageSpec);
    }
    catch (error) {
        spinner.fail('Error during audit check');
        console.error(chalk_1.default.red(error));
    }
}
function parsePackageSpec(spec) {
    const parts = spec.split('@');
    if (parts.length === 2) {
        return [parts[0], parts[1]];
    }
    else if (parts.length === 3 && parts[0] === '') {
        // Scoped package: @scope/package@version
        return [`@${parts[1]}`, parts[2]];
    }
    return [spec, null];
}
async function npmInstall(packageSpec) {
    const spinner = (0, ora_1.default)(`Installing ${packageSpec}...`).start();
    try {
        await execAsync(`npm install ${packageSpec}`);
        spinner.succeed(`Installed ${packageSpec}`);
    }
    catch (error) {
        spinner.fail('Installation failed');
        console.error(chalk_1.default.red(error.message));
    }
}
//# sourceMappingURL=install.js.map