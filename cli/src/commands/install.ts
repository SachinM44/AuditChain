import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Network } from '@aptos-labs/ts-sdk';
import { AptosClient } from '../utils/aptos-client';
import { loadConfig } from '../utils/config';

const execAsync = promisify(exec);

export async function installCommand(packageSpec: string, options: any) {
  const spinner = ora('Checking package audit status...').start();
  
  try {
    // Parse package name and version
    const [packageName, version] = parsePackageSpec(packageSpec);
    
    if (!version) {
      spinner.fail('Please specify a version: package@version');
      return;
    }

    // Load config
    const config = loadConfig();
    
    if (!config.registryAddress) {
      spinner.warn('Registry address not configured. Run: chainaudit config --set-registry <address>');
      spinner.info('Proceeding with standard npm install...');
      await npmInstall(packageSpec);
      return;
    }

    // Check audit on Aptos
    const client = new AptosClient(
      config.network === 'mainnet' ? Network.MAINNET : Network.TESTNET, 
      config.registryAddress
    );
    const audit = await client.getLatestAudit(packageName, version);

    if (!audit || !audit.exists) {
      spinner.warn(`No audit found for ${packageName}@${version}`);
      console.log(chalk.yellow('\n⚠️  This package has not been audited yet.'));
      console.log(chalk.gray('   Run: chainaudit audit ' + packageSpec + ' to request an audit\n'));
      
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
    console.log(chalk.bold('📋 Audit Results:'));
    console.log(chalk.gray('─'.repeat(50)));
    
    const riskColor = audit.riskScore < 30 ? chalk.green : 
                     audit.riskScore < 70 ? chalk.yellow : chalk.red;
    
    console.log(`  Risk Score:     ${riskColor(audit.riskScore + '/100')} (${client.getRiskCategoryString(audit.riskCategory)})`);
    console.log(`  Audited by:     ${chalk.cyan(audit.auditorCount + ' nodes')}`);
    console.log(`  Last audit:     ${chalk.gray(client.formatTimestamp(audit.timestamp))}`);
    console.log(`  Findings:       ${audit.findingsCount > 0 ? chalk.yellow(audit.findingsCount) : chalk.green('0')}`);
    console.log(chalk.gray('─'.repeat(50)));
    console.log('');

    // Policy enforcement
    if (audit.riskScore >= config.riskThreshold) {
      if (config.policy === 'block' && !options.force) {
        console.log(chalk.red('❌ Installation blocked due to high risk score'));
        console.log(chalk.gray('   Use --force to override\n'));
        return;
      }
      
      if (config.policy === 'warn') {
        console.log(chalk.yellow('⚠️  Warning: High risk score detected'));
        console.log(chalk.gray('   Proceeding with installation...\n'));
      }
    } else {
      console.log(chalk.green('✓ Package passed security check\n'));
    }

    // Install package
    await npmInstall(packageSpec);
    
  } catch (error) {
    spinner.fail('Error during audit check');
    console.error(chalk.red(error));
  }
}

function parsePackageSpec(spec: string): [string, string | null] {
  const parts = spec.split('@');
  if (parts.length === 2) {
    return [parts[0], parts[1]];
  } else if (parts.length === 3 && parts[0] === '') {
    // Scoped package: @scope/package@version
    return [`@${parts[1]}`, parts[2]];
  }
  return [spec, null];
}

async function npmInstall(packageSpec: string) {
  const spinner = ora(`Installing ${packageSpec}...`).start();
  try {
    await execAsync(`npm install ${packageSpec}`);
    spinner.succeed(`Installed ${packageSpec}`);
  } catch (error: any) {
    spinner.fail('Installation failed');
    console.error(chalk.red(error.message));
  }
}
