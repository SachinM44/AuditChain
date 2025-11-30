"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = configCommand;
const chalk_1 = __importDefault(require("chalk"));
async function configCommand(options) {
    console.log(chalk_1.default.bold('\n⚙️  ChainAudit Configuration\n'));
    console.log(chalk_1.default.gray('─'.repeat(50)));
    console.log(chalk_1.default.bold('Network:          ') + chalk_1.default.cyan('testnet'));
    console.log(chalk_1.default.bold('Module Address:   ') + chalk_1.default.cyan('0x762779...'));
    console.log(chalk_1.default.gray('─'.repeat(50)));
    console.log('');
}
//# sourceMappingURL=config.js.map