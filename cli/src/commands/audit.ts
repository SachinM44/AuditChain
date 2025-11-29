import chalk from 'chalk';
import ora from 'ora';
import { Network } from '@aptos-labs/ts-sdk';
import { AptosClient } from '../utils/aptos-client';
import { loadConfig } from '../utils/config';

export async function auditCommand(packageSpec: string, options: any) {
  const spinner = ora('Checking audit status...').start();
  
  try {
    const [packageName, version] = parsePackageSpec(packageSpec);
    
    if (!version) {
      spinner.fail('Please specify a version: package@version');
      return;
    }

    const config = loadConfig();
    
    if (!config.registryAddress) {
      spinner.fail('Registry address not configured');
      console.log(chalk.yellow('Run: chainaudit config --set-registry <address>'));
      return;
    }

    const client = new AptosClient(
      config.network === 'mainnet' ? Network.MAINNET : Network.TESTNET, 
      config.registryAddress
    );
    const audit = await client.getLatestAudit(packageName, version);

    if (!audit || !audit.exists) {
      spinner.info(`No audit found for ${packageName}@${version}`);
      console.log('');
      console.log(chalk.yellow('📝 Audit Request'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(chalk.gray('  This package needs to be audited.'));
      console.log(chalk.gray('  In production, this would trigger an on-chain audit request.'));
      console.log(chalk.gray('  Auditor nodes would analyze the package and submit findings.'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log('');
      console.log(chalk.cyan('💡 Tip: Check back in a few minutes for results'));
      return;
    }

    spinner.succeed('Audit found!');
    console.log('');
    console.log(chalk.bold('📋 Detailed Audit Report'));
    console.log(chalk.gray('═'.repeat(50)));
    console.log('');
    console.log(chalk.bold('Package:        ') + chalk.cyan(`${packageName}@${version}`));
    
    const riskColor = audit.riskScore < 30 ? chalk.green : 
                     audit.riskScore < 70 ? chalk.yellow : chalk.red;
    
    console.log(chalk.bold('Risk Score:     ') + riskColor(`${audit.riskScore}/100`));
    console.log(chalk.bold('Risk Category:  ') + riskColor(client.getRiskCategoryString(audit.riskCategory)));
    console.log(chalk.bold('Audited by:     ') + chalk.cyan(`${audit.auditorCount} independent nodes`));
    console.log(chalk.bold('Last audit:     ') + chalk.gray(client.formatTimestamp(audit.timestamp)));
    console.log(chalk.bold('Findings:       ') + (audit.findingsCount > 0 ? chalk.yellow(audit.findingsCount) : chalk.green('None')));
    console.log('');
    console.log(chalk.gray('═'.repeat(50)));
    
    if (audit.riskScore >= 70) {
      console.log('');
      console.log(chalk.red('⚠️  HIGH RISK: This package may contain malicious code'));
      console.log(chalk.gray('   Review findings carefully before using'));
    } else if (audit.riskScore >= 30) {
      console.log('');
      console.log(chalk.yellow('⚠️  MEDIUM RISK: Some suspicious patterns detected'));
      console.log(chalk.gray('   Consider reviewing the package code'));
    } else {
      console.log('');
      console.log(chalk.green('✓ LOW RISK: No significant security concerns detected'));
    }
    console.log('');

  } catch (error) {
    spinner.fail('Error checking audit status');
    console.error(chalk.red(error));
  }
}

function parsePackageSpec(spec: string): [string, string | null] {
  const parts = spec.split('@');
  if (parts.length === 2) {
    return [parts[0], parts[1]];
  } else if (parts.length === 3 && parts[0] === '') {
    return [`@${parts[1]}`, parts[2]];
  }
  return [spec, null];
}
