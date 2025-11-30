import chalk from 'chalk';
import ora from 'ora';
import { getAptosClient } from '../utils/aptos-client';

export async function packagesCommand(options: any) {
  const spinner = ora('Loading available packages...').start();

  try {
    // In real implementation, query blockchain for all packages
    // For now, showing example output
    spinner.stop();

    console.log(chalk.bold('\n📦 Available Packages for Auditing\n'));
    
    const packages = [
      { name: 'express', tier: 'Popular', bounty: 50, findings: 5 },
      { name: 'lodash', tier: 'Enterprise', bounty: 100, findings: 2 },
      { name: 'axios', tier: 'Popular', bounty: 30, findings: 3 }
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
