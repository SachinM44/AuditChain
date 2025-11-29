"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.saveConfig = saveConfig;
exports.getConfigPath = getConfigPath;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
const DEFAULT_CONFIG = {
    riskThreshold: 70,
    policy: 'warn',
    registryAddress: '',
    network: 'testnet',
};
const CONFIG_DIR = path.join(os.homedir(), '.chainaudit');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
function loadConfig() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            return DEFAULT_CONFIG;
        }
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
    catch (error) {
        return DEFAULT_CONFIG;
    }
}
function saveConfig(config) {
    try {
        if (!fs.existsSync(CONFIG_DIR)) {
            fs.mkdirSync(CONFIG_DIR, { recursive: true });
        }
        const currentConfig = loadConfig();
        const newConfig = { ...currentConfig, ...config };
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
    }
    catch (error) {
        console.error('Error saving config:', error);
    }
}
function getConfigPath() {
    return CONFIG_FILE;
}
//# sourceMappingURL=config.js.map