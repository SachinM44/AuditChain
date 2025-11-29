"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.historyCommand = historyCommand;
const chalk_1 = __importDefault(require("chalk"));
async function historyCommand(packageName) {
    console.log(chalk_1.default.bold(`\n📜 Audit History for ${chalk_1.default.cyan(packageName)}\n`));
    console.log(chalk_1.default.gray('─'.repeat(50)));
    console.log(chalk_1.default.yellow('Feature coming soon!'));
    console.log(chalk_1.default.gray('This will show all historical audits for the package.'));
    console.log(chalk_1.default.gray('─'.repeat(50)));
    console.log('');
}
//# sourceMappingURL=history.js.map