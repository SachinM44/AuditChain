import chalk from 'chalk';

export async function historyCommand(packageName: string) {
  console.log(chalk.bold(`\n📜 Audit History for ${chalk.cyan(packageName)}\n`));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.yellow('Feature coming soon!'));
  console.log(chalk.gray('This will show all historical audits for the package.'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log('');
}
