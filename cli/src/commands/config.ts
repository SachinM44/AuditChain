import chalk from 'chalk';
import { loadConfig, saveConfig, getConfigPath } from '../utils/config';

export async function configCommand(options: any) {
  if (options.show || (!options.setThreshold && !options.setPolicy && !options.setRegistry)) {
    // Show current config
    const config = loadConfig();
    console.log(chalk.bold('\n⚙️  ChainAudit Configuration\n'));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.bold('Risk Threshold:   ') + chalk.cyan(config.riskThreshold));
    console.log(chalk.bold('Policy:           ') + chalk.cyan(config.policy));
    console.log(chalk.bold('Registry Address: ') + (config.registryAddress ? chalk.cyan(config.registryAddress) : chalk.gray('Not set')));
    console.log(chalk.bold('Network:          ') + chalk.cyan(config.network));
    console.log(chalk.gray('─'.repeat(50)));
    console.log(chalk.gray(`Config file: ${getConfigPath()}`));
    console.log('');
    return;
  }

  const updates: any = {};

  if (options.setThreshold) {
    const threshold = parseInt(options.setThreshold);
    if (isNaN(threshold) || threshold < 0 || threshold > 100) {
      console.log(chalk.red('Error: Threshold must be between 0 and 100'));
      return;
    }
    updates.riskThreshold = threshold;
    console.log(chalk.green(`✓ Risk threshold set to ${threshold}`));
  }

  if (options.setPolicy) {
    const policy = options.setPolicy.toLowerCase();
    if (!['allow', 'warn', 'block'].includes(policy)) {
      console.log(chalk.red('Error: Policy must be one of: allow, warn, block'));
      return;
    }
    updates.policy = policy;
    console.log(chalk.green(`✓ Policy set to ${policy}`));
  }

  if (options.setRegistry) {
    updates.registryAddress = options.setRegistry;
    console.log(chalk.green(`✓ Registry address set to ${options.setRegistry}`));
  }

  if (Object.keys(updates).length > 0) {
    saveConfig(updates);
    console.log(chalk.gray('\nConfiguration saved!'));
  }
}
