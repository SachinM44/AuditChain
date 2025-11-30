import chalk from 'chalk';
import ora from 'ora';
import { getAptosClient } from '../utils/aptos-client';
import { MODULE_ADDRESS } from '../utils/config';

export async function installCommand(packageName: string) {
  const spinner = ora(`Checking security for ${packageName}...`).start();

  try {
    const client = getAptosClient();
    
    // Query package info from blockchain
    const result: any = await client.view({
      payload: {
        function: `${MODULE_ADDRESS}::PackageRegistry::get_package_info`,
        typeArguments: [],
        functionArguments: [MODULE_ADDRESS, packageName]
      }
    });
    
    const [exists, owner, tier, bountyPool, credibility, totalFindings, acceptedFindings] = result;

    spinner.stop();

    if (!exists) {
      console.log(chalk.yellow(`\n⚠️  Package "${packageName}" not registered on ChainAudit`));
      console.log(chalk.gray('This package has not been audited yet.\n'));
      return;
    }

    // Calculate security score (simplified)
    const acceptedCount = Number(acceptedFindings) || 0;
    const securityScore = acceptedCount > 0 
      ? Math.max(0, 100 - (acceptedCount * 10))
      : 100;

    console.log(chalk.green(`\n✓ Package registered on ChainAudit\n`));
    console.log(chalk.bold(`Security Score: ${getScoreColor(securityScore)}${securityScore}/100${chalk.reset()}\n`));
    
    console.log(chalk.bold('📊 Audit Summary:'));
    console.log(`  Total Findings: ${totalFindings}`);
    console.log(`  Accepted Findings: ${acceptedFindings}`);
    console.log(`  Bounty Pool: ${Number(bountyPool) / 100000000} APT`);
    console.log(`  Owner Credibility: ${credibility}/100\n`);

    if (Number(acceptedFindings) > 0) {
      console.log(chalk.yellow(`⚠️  This package has ${acceptedFindings} accepted security findings`));
      console.log(chalk.gray(`Run 'chainaudit audit ${packageName}' for details\n`));
    }

    // Ask for confirmation
    console.log(chalk.cyan('Proceed with installation? (y/n)'));
    
  } catch (error: any) {
    spinner.stop();
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
  }
}

function getScoreColor(score: number): any {
  if (score >= 80) return chalk.green;
  if (score >= 60) return chalk.yellow;
  return chalk.red;
}
