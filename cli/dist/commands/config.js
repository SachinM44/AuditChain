"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = configCommand;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../utils/config");
async function configCommand(options) {
    if (options.show || (!options.setThreshold && !options.setPolicy && !options.setRegistry)) {
        // Show current config
        const config = (0, config_1.loadConfig)();
        console.log(chalk_1.default.bold('\n⚙️  ChainAudit Configuration\n'));
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(chalk_1.default.bold('Risk Threshold:   ') + chalk_1.default.cyan(config.riskThreshold));
        console.log(chalk_1.default.bold('Policy:           ') + chalk_1.default.cyan(config.policy));
        console.log(chalk_1.default.bold('Registry Address: ') + (config.registryAddress ? chalk_1.default.cyan(config.registryAddress) : chalk_1.default.gray('Not set')));
        console.log(chalk_1.default.bold('Network:          ') + chalk_1.default.cyan(config.network));
        console.log(chalk_1.default.gray('─'.repeat(50)));
        console.log(chalk_1.default.gray(`Config file: ${(0, config_1.getConfigPath)()}`));
        console.log('');
        return;
    }
    const updates = {};
    if (options.setThreshold) {
        const threshold = parseInt(options.setThreshold);
        if (isNaN(threshold) || threshold < 0 || threshold > 100) {
            console.log(chalk_1.default.red('Error: Threshold must be between 0 and 100'));
            return;
        }
        updates.riskThreshold = threshold;
        console.log(chalk_1.default.green(`✓ Risk threshold set to ${threshold}`));
    }
    if (options.setPolicy) {
        const policy = options.setPolicy.toLowerCase();
        if (!['allow', 'warn', 'block'].includes(policy)) {
            console.log(chalk_1.default.red('Error: Policy must be one of: allow, warn, block'));
            return;
        }
        updates.policy = policy;
        console.log(chalk_1.default.green(`✓ Policy set to ${policy}`));
    }
    if (options.setRegistry) {
        updates.registryAddress = options.setRegistry;
        console.log(chalk_1.default.green(`✓ Registry address set to ${options.setRegistry}`));
    }
    if (Object.keys(updates).length > 0) {
        (0, config_1.saveConfig)(updates);
        console.log(chalk_1.default.gray('\nConfiguration saved!'));
    }
}
//# sourceMappingURL=config.js.map