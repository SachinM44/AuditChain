import chalk from 'chalk';
import ora from 'ora';
import { getAptosClient } from '../utils/aptos-client';
import { MODULE_ADDRESS } from '../utils/config';

export async function installCommand(packageName: string) {
  const spinner = ora(`Checking security for ${packageName}...`).start();

  try {
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPackages: any = {
      'axios': { tier: 'Popular', bounty: 50, findings: 3, accepted: 1, credibility: 92 },
      'zod': { tier: 'Enterprise', bounty: 100, findings: 1, accepted: 0, credibility: 95 },
      'express': { tier: 'Popular', bounty: 75, findings: 5, accepted: 2, credibility: 88 },
      'lodash': { tier: 'Enterprise', bounty: 120, findings: 4, accepted: 1, credibility: 90 },
      'react': { tier: 'Enterprise', bounty: 200, findings: 2, accepted: 0, credibility: 94 },
      'typescript': { tier: 'Enterprise', bounty: 150, findings: 1, accepted: 0, credibility: 96 },
      'shelby': { tier: 'Popular', bounty: 60, findings: 2, accepted: 0, credibility: 93 },
      'risein': { tier: 'Enterprise', bounty: 85, findings: 1, accepted: 0, credibility: 97 },
      'quicky': { tier: 'Basic', bounty: 30, findings: 0, accepted: 0, credibility: 100 }
    };

    spinner.stop();

    const pkg = mockPackages[packageName.toLowerCase()];
    
    if (!pkg) {
      console.log(chalk.yellow(`\n⚠️  Package "${packageName}" not registered on ChainAudit`));
      console.log(chalk.gray('This package has not been audited yet.\n'));
      return;
    }

    // Calculate security score
    const securityScore = pkg.accepted > 0 
      ? Math.max(0, 100 - (pkg.accepted * 10))
      : 100;

    console.log(chalk.green(`\n✓ Package registered on ChainAudit\n`));
    
    const scoreColor = securityScore >= 80 ? chalk.green : securityScore >= 60 ? chalk.yellow : chalk.red;
    console.log(chalk.bold(`Security Score: ${scoreColor(securityScore + '/100')}\n`));
    
    console.log(chalk.bold('📊 Audit Summary:'));
    console.log(`  Total Findings: ${pkg.findings}`);
    console.log(`  Accepted Findings: ${pkg.accepted}`);
    console.log(`  Bounty Pool: ${pkg.bounty} APT`);
    console.log(`  Owner Credibility: ${pkg.credibility}/100\n`);

    if (pkg.accepted > 0) {
      console.log(chalk.yellow(`⚠️  This package has ${pkg.accepted} accepted security findings`));
      console.log(chalk.gray(`Run 'chainaudit audit ${packageName}' for details\n`));
    } else {
      console.log(chalk.green(`✅ No critical security issues found\n`));
    }

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
