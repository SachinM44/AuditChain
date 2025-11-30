import chalk from 'chalk';

export async function submitCommand(packageName: string, options: any) {
  console.log(chalk.bold(`\n🔍 Submit Finding for: ${packageName}\n`));
  
  const severityMap: any = {
    'low': { reward: '1-5 APT', level: 0 },
    'medium': { reward: '5-20 APT', level: 1 },
    'high': { reward: '20-50 APT', level: 2 },
    'critical': { reward: '50-100 APT', level: 3 }
  };

  const severity = severityMap[options.severity.toLowerCase()] || severityMap.high;

  console.log(chalk.gray(`Severity: ${options.severity.toUpperCase()}`));
  console.log(chalk.gray(`Potential Reward: ${severity.reward}\n`));

  if (options.title && options.description) {
    console.log(chalk.green('✓ Title: ') + options.title);
    console.log(chalk.green('✓ Description: ') + options.description.substring(0, 100) + '...\n');
  }

  console.log(chalk.yellow('⚠️  Please use the web interface to submit your finding:'));
  console.log(chalk.cyan('   https://chainaudit.app/submit\n'));
  console.log(chalk.gray('The web interface provides:'));
  console.log(chalk.gray('  • Wallet connection'));
  console.log(chalk.gray('  • Rich text editor for detailed reports'));
  console.log(chalk.gray('  • Code editor for proof-of-concept'));
  console.log(chalk.gray('  • Transaction signing\n'));
}
