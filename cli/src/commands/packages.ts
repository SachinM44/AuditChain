import chalk from 'chalk';
import ora from 'ora';
import { getAptosClient } from '../utils/aptos-client';
import { MODULE_ADDRESS } from '../utils/config';

export async function packagesCommand(options: any) {
  const spinner = ora('Loading available packages...').start();

  try {
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 800));
    
    spinner.stop();

    console.log(chalk.bold('\n📦 Available Packages for Auditing\n'));
    
    const packages = [
      { name: 'axios', tier: 'Popular', bounty: 50, findings: 3 },
      { name: 'zod', tier: 'Enterprise', bounty: 100, findings: 1 },
      { name: 'express', tier: 'Popular', bounty: 75, findings: 5 },
      { name: 'lodash', tier: 'Enterprise', bounty: 120, findings: 4 },
      { name: 'react', tier: 'Enterprise', bounty: 200, findings: 2 },
      { name: 'typescript', tier: 'Enterprise', bounty: 150, findings: 1 },
      { name: 'shelby', tier: 'Popular', bounty: 60, findings: 2 },
      { name: 'risein', tier: 'Enterprise', bounty: 85, findings: 1 },
      { name: 'quicky', tier: 'Basic', bounty: 30, findings: 0 }
    ];

    packages.forEach(pkg => {
      console.log(chalk.cyan(`• ${pkg.name}`));
      console.log(chalk.gray(`  Tier: ${pkg.tier} | Bounty: ${pkg.bounty} APT | Findings: ${pkg.findings}`));
      console.log();
    });

    console.log(chalk.yellow('💡 Tip: Visit https://chainaudit.app/packages for full details\n'));

  } catch (error: any) {
    spinner.stop();
    console.error(chalk.red(`\n❌ Error: ${error.message}\n`));
  }
}

function getTierName(tier: number): string {
  switch (tier) {
    case 0: return 'Basic';
    case 1: return 'Popular';
    case 2: return 'Enterprise';
    default: return 'Unknown';
  }
}
