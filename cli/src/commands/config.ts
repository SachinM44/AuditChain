import chalk from 'chalk';

export async function configCommand(options: any) {
  console.log(chalk.bold('\n⚙️  ChainAudit Configuration\n'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log(chalk.bold('Network:          ') + chalk.cyan('testnet'));
  console.log(chalk.bold('Module Address:   ') + chalk.cyan('0x762779...'));
  console.log(chalk.gray('─'.repeat(50)));
  console.log('');
}
