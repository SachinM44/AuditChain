import chalk from 'chalk';
import ora from 'ora';

export async function registerCommand(packageName: string, options: any) {
  console.log(chalk.bold(`\n📦 Registering package: ${packageName}\n`));
  
  const tierMap: any = {
    'basic': { fee: 10, name: 'Basic' },
    'popular': { fee: 25, name: 'Popular' },
    'enterprise': { fee: 50, name: 'Enterprise' }
  };

  const tier = tierMap[options.tier.toLowerCase()] || tierMap.basic;
  const bounty = parseFloat(options.bounty);

  console.log(chalk.gray(`Tier: ${tier.name}`));
  console.log(chalk.gray(`Registration Fee: ${tier.fee} APT`));
  console.log(chalk.gray(`Initial Bounty: ${bounty} APT`));
  console.log(chalk.gray(`Total Cost: ${tier.fee + bounty} APT\n`));

  console.log(chalk.yellow('⚠️  Please use the web interface to complete registration:'));
  console.log(chalk.cyan('   https://chainaudit.app/register\n'));
  console.log(chalk.gray('The web interface provides wallet connection and transaction signing.\n'));
}
